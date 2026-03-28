import { insforge } from '@/config/insforge'
import type { AIFeedback } from '@/types'

export async function requestFeedback(runId: string, workoutId: string): Promise<AIFeedback> {
  const { data, error } = await insforge.functions.invoke('analyze-run', {
    body: { runId, workoutId },
  })

  if (error) throw new Error(error.message || 'Failed to get AI feedback')
  return data as AIFeedback
}

export async function requestFeedbackWithAI(
  runData: {
    distance: number
    duration: string
    avg_pace: number
    perceived_effort: number | null
  },
  workoutData: {
    type: string
    target_distance: number | null
    target_pace: number | null
    description: string | null
  },
  recentRunsSummary: string
): Promise<Omit<AIFeedback, 'id' | 'run_id' | 'workout_id' | 'created_at'>> {
  const formatPace = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

  const { data } = await insforge.ai.chat.completions.create({
    model: 'anthropic/claude-3.5-haiku',
    messages: [
      {
        role: 'system',
        content: `You are a professional running coach. Analyze workout data and provide constructive, data-driven feedback. Return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence overview",
  "pace_analysis": "specific pace feedback",
  "effort_assessment": "how hard they worked and if it was appropriate",
  "recommendations": ["tip 1", "tip 2", "tip 3"],
  "fitness_score": 1-100,
  "confidence": 0.0-1.0
}
Tone: Encouraging but honest, like a trusted running coach.`,
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
${recentRunsSummary || 'No previous data available'}

Return ONLY valid JSON.`,
      },
    ],
  })

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('AI returned empty response')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI response did not contain valid JSON')

  return JSON.parse(jsonMatch[0])
}

export async function getFeedbackForRun(runId: string): Promise<AIFeedback | null> {
  const { data, error } = await insforge.database
    .from('ai_feedback')
    .select()
    .eq('run_id', runId)
    .single()

  if (error) return null
  return data as AIFeedback
}

export async function saveFeedback(feedback: Omit<AIFeedback, 'id' | 'created_at'>): Promise<AIFeedback> {
  const { data, error } = await insforge.database
    .from('ai_feedback')
    .insert(feedback)
    .select()

  if (error) throw new Error(error.message)
  return data[0] as AIFeedback
}
