// InsForge Edge Function: generate-plan
// Generates an 18-week marathon training plan using the Hansons Marathon Method via AI
//
// Deployed to InsForge via: insforge functions deploy generate-plan --file ./insforge/functions/generate-plan/index.ts

import { createClient } from 'npm:@insforge/sdk'

interface RequestBody {
  raceDate: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goalTime?: string | null
}

const MILEAGE_RANGES = {
  beginner: { start: 35, peak: 50 },
  intermediate: { start: 40, peak: 57 },
  advanced: { start: 45, peak: 63 },
}

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  try {
    const { raceDate, fitnessLevel, goalTime } = (await req.json()) as RequestBody

    // Validate inputs
    const raceMs = new Date(raceDate).getTime()
    const nowMs = Date.now()
    const weeksUntilRace = (raceMs - nowMs) / (7 * 24 * 60 * 60 * 1000)
    if (weeksUntilRace < 12) {
      return jsonResponse({ error: 'Race date must be at least 12 weeks in the future' }, 400)
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(fitnessLevel)) {
      return jsonResponse({ error: 'Invalid fitness level' }, 400)
    }

    // Initialize InsForge client from auth header
    const authHeader = req.headers.get('Authorization') || ''
    const userToken = authHeader.replace('Bearer ', '')
    const insforge = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL')!,
      ...(userToken
        ? { edgeFunctionToken: userToken }
        : { anonKey: Deno.env.get('ANON_KEY')! }),
    })

    // Calculate pace targets
    const goalTimeStr = goalTime ? `Goal marathon time: ${goalTime}` : 'No specific goal time'
    const mileage = MILEAGE_RANGES[fitnessLevel]

    // Generate plan via AI
    const { data } = await insforge.ai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'system',
          content: `You are an expert marathon coach specializing in the Hansons Marathon Method. Generate structured 18-week training plans. Return ONLY valid JSON with a "weeks" array. Each week has: week number, week_starting date, total_miles, and a "days" array with 7 entries (Mon-Sun). Each day has: day name, date, type (easy/speed/tempo/long/rest), distance (null for rest), pace (string like "9:00" or null for rest), and description.`,
        },
        {
          role: 'user',
          content: `Generate an 18-week Hansons Marathon Method training plan:
- Fitness level: ${fitnessLevel}
- Race date: ${raceDate}
- ${goalTimeStr}
- Weekly mileage: ${mileage.start} to ${mileage.peak} miles (progressive)
- Schedule: Mon=easy, Tue=speed, Wed=easy, Thu=tempo, Fri=rest, Sat=easy, Sun=long
- Max long run: 16 miles
- Speed: intervals at 5K pace with recovery
- Tempo: sustained at marathon pace
- Follow cumulative fatigue principle

Calculate start date as ${raceDate} minus 18 weeks.
Return ONLY the JSON object.`,
        },
      ],
    })

    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('AI returned empty response')

    // Parse JSON from AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI response did not contain valid JSON')

    const parsed = JSON.parse(jsonMatch[0])
    const weeklySchedule = parsed.weeks

    // Calculate plan dates
    const raceDateObj = new Date(raceDate)
    const startDate = new Date(raceDateObj)
    startDate.setDate(startDate.getDate() - 18 * 7)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Get authenticated user
    const { data: authData } = await insforge.auth.getCurrentUser()
    const userId = authData?.user?.id
    if (!userId) throw new Error('User not authenticated')

    // Save plan to database
    const { data: planData, error: planError } = await insforge.database
      .from('training_plans')
      .insert({
        user_id: userId,
        method: 'hansons',
        level: fitnessLevel,
        start_date: startDateStr,
        race_date: raceDate,
        weekly_schedule: weeklySchedule,
      })
      .select()

    if (planError) throw planError
    const plan = planData[0]

    // Hydrate individual workout rows
    const workoutRows = weeklySchedule.flatMap((week: { days: Array<{ date: string; type: string; distance: number | null; pace: string | null; description: string }> }) =>
      week.days.map((day: { date: string; type: string; distance: number | null; pace: string | null; description: string }) => ({
        plan_id: plan.id,
        scheduled_date: day.date,
        type: day.type,
        target_distance: day.distance,
        target_pace: day.pace ? paceToSeconds(day.pace) : null,
        description: day.description,
        completed: false,
      }))
    )

    await insforge.database.from('workouts').insert(workoutRows)

    // Calculate paces and update user profile
    let paces = {}
    if (goalTime) {
      const parts = goalTime.split(':')
      const totalSec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2] || '0')
      const mp = totalSec / 26.2
      paces = {
        marathon_pace: Math.round(mp),
        easy_pace: Math.round(mp + 90),
        tempo_pace: Math.round(mp),
        long_run_pace: Math.round(mp + 45),
        speed_pace: Math.round(mp - 52),
      }
    }

    await insforge.database.from('users').update({
      training_plan_id: plan.id,
      race_date: raceDate,
      fitness_level: fitnessLevel,
      goal_time: goalTime,
      ...paces,
    }).eq('id', userId)

    return jsonResponse({ plan, weeklySchedule })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return jsonResponse({ error: message }, 500)
  }
}

function paceToSeconds(pace: string): number {
  const parts = pace.split(':')
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || '0')
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
