// InsForge Edge Function: analyze-run
// Provides AI coaching feedback after a run is logged
//
// Deployed to InsForge via: insforge functions deploy analyze-run --file ./insforge/functions/analyze-run/index.ts

import { createClient } from 'npm:@insforge/sdk'

interface RequestBody {
  runId: string
  workoutId: string
}

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  try {
    const { runId, workoutId } = (await req.json()) as RequestBody

    // Initialize InsForge client
    const authHeader = req.headers.get('Authorization') || ''
    const userToken = authHeader.replace('Bearer ', '')
    const insforge = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL')!,
      ...(userToken
        ? { edgeFunctionToken: userToken }
        : { anonKey: Deno.env.get('ANON_KEY')! }),
    })

    // Fetch run data
    const { data: runData, error: runError } = await insforge.database
      .from('runs')
      .select()
      .eq('id', runId)
      .single()

    if (runError || !runData) throw new Error('Run not found')

    // Fetch workout data
    const { data: workoutData, error: workoutError } = await insforge.database
      .from('workouts')
      .select()
      .eq('id', workoutId)
      .single()

    if (workoutError || !workoutData) throw new Error('Workout not found')

    // Fetch recent runs (last 4 weeks) for context
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

    const { data: recentRuns } = await insforge.database
      .from('runs')
      .select()
      .eq('user_id', runData.user_id)
      .gte('date', fourWeeksAgo.toISOString().split('T')[0])
      .order('date', { ascending: false })

    // Build recent history summary
    const histSummary = (recentRuns || []).slice(0, 10).map((r: { date: string; distance: number; avg_pace: number }) =>
      `${r.date}: ${r.distance}mi at ${formatPace(r.avg_pace)}/mi`
    ).join('\n')

    // Generate AI feedback
    const { data: aiResponse } = await insforge.ai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'system',
          content: `You are a professional running coach specializing in the Hansons Marathon Method. Analyze workout data and provide constructive, data-driven feedback. Return ONLY a valid JSON object with these exact fields:
{
  "summary": "2-3 sentence performance overview",
  "pace_analysis": "how well they hit their target pace",
  "effort_assessment": "was perceived effort appropriate for this workout type",
  "recommendations": ["tip 1", "tip 2", "tip 3"],
  "fitness_score": integer 1-100,
  "confidence": float 0.0-1.0
}
Be encouraging but honest. Use specific numbers from the data.`,
        },
        {
          role: 'user',
          content: `Analyze this workout and provide coaching feedback:

Planned Workout:
- Type: ${workoutData.type}
- Target: ${workoutData.target_distance || 'N/A'} miles${workoutData.target_pace ? ` at ${formatPace(workoutData.target_pace)}/mile` : ''}
- Description: ${workoutData.description || 'N/A'}

Actual Performance:
- Distance: ${runData.distance} miles
- Duration: ${runData.duration}
- Average Pace: ${formatPace(runData.avg_pace)}/mile
- Perceived Effort: ${runData.perceived_effort || 'N/A'}/10

Recent History (last 4 weeks):
${histSummary || 'No previous data available'}

Return ONLY the JSON object, no other text.`,
        },
      ],
    })

    const content = aiResponse.choices?.[0]?.message?.content
    if (!content) throw new Error('AI returned empty response')

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI response did not contain valid JSON')

    const feedback = JSON.parse(jsonMatch[0])

    // Save feedback to database
    const { data: savedFeedback, error: saveError } = await insforge.database
      .from('ai_feedback')
      .insert({
        run_id: runId,
        workout_id: workoutId,
        summary: feedback.summary,
        pace_analysis: feedback.pace_analysis,
        effort_assessment: feedback.effort_assessment,
        recommendations: feedback.recommendations,
        fitness_score: feedback.fitness_score,
        confidence: feedback.confidence,
      })
      .select()

    if (saveError) throw saveError

    return jsonResponse(savedFeedback[0])
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return jsonResponse({ error: message }, 500)
  }
}

function formatPace(secondsPerMile: number): string {
  if (!secondsPerMile) return 'N/A'
  const mins = Math.floor(secondsPerMile / 60)
  const secs = Math.round(secondsPerMile % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}
