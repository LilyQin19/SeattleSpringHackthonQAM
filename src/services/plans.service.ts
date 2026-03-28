import { insforge } from '@/config/insforge'
import type { TrainingPlan, WeekSchedule } from '@/types'

export async function generateTrainingPlan(
  userId: string,
  raceDate: string,
  fitnessLevel: string,
  goalTime?: string | null
): Promise<{ plan: TrainingPlan; weeklySchedule: WeekSchedule[] }> {
  const { data, error } = await insforge.functions.invoke('generate-plan', {
    body: { userId, raceDate, fitnessLevel, goalTime },
  })

  if (error) throw new Error(error.message || 'Failed to generate plan')
  if (!data || !data.plan) {
    throw new Error(data?.error || 'Invalid response from plan generation')
  }
  return data as { plan: TrainingPlan; weeklySchedule: WeekSchedule[] }
}

export async function getPlan(planId: string) {
  const { data, error } = await insforge.database
    .from('training_plans')
    .select()
    .eq('id', planId)
    .single()

  if (error) return null
  return data as TrainingPlan
}

export async function savePlan(plan: Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await insforge.database
    .from('training_plans')
    .insert(plan)
    .select()

  if (error) throw new Error(error.message)
  return data[0] as TrainingPlan
}

export async function generatePlanWithAI(
  raceDate: string,
  fitnessLevel: string,
  goalTime?: string | null
): Promise<WeekSchedule[]> {
  const goalTimeStr = goalTime ? `Goal marathon time: ${goalTime}` : 'No specific goal time set'

  const { data } = await insforge.ai.chat.completions.create({
    model: 'anthropic/claude-3.5-haiku',
    messages: [
      {
        role: 'system',
        content: `You are an expert marathon coach specializing in the Hansons Marathon Method. Generate structured training plans as valid JSON. Always return a JSON object with a "weeks" array.`,
      },
      {
        role: 'user',
        content: `Generate an 18-week marathon training plan following Hansons Marathon Method principles:
- Fitness level: ${fitnessLevel}
- Race date: ${raceDate}
- ${goalTimeStr}

Requirements:
- 6 days of running per week, 1 rest day (Friday)
- 3 SOS workouts per week (speed on Tuesday, tempo on Thursday, long on Sunday)
- Easy runs on Monday, Wednesday, Saturday
- Max long run: 16 miles
- Progressive weekly mileage buildup from ${fitnessLevel === 'beginner' ? '35' : fitnessLevel === 'intermediate' ? '40' : '45'} to ${fitnessLevel === 'beginner' ? '50' : fitnessLevel === 'intermediate' ? '57' : '63'} miles
- Include pace targets for each workout type
- Follow cumulative fatigue principle

Return as JSON with this exact structure:
{
  "weeks": [
    {
      "week": 1,
      "week_starting": "YYYY-MM-DD",
      "total_miles": 40,
      "days": [
        { "day": "Monday", "date": "YYYY-MM-DD", "type": "easy|speed|tempo|long|rest", "distance": 6, "pace": "9:00", "description": "..." },
        ...
      ]
    },
    ...
  ]
}`,
      },
    ],
  })

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('AI returned empty response')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI response did not contain valid JSON')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.weeks as WeekSchedule[]
}
