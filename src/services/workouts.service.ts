import { insforge } from '@/config/insforge'
import type { Workout, WeekSchedule } from '@/types'

export async function createWorkoutsFromPlan(
  planId: string,
  weeklySchedule: WeekSchedule[]
): Promise<Workout[]> {
  const workoutRows = weeklySchedule.flatMap((week) =>
    week.days.map((day) => ({
      plan_id: planId,
      scheduled_date: day.date,
      type: day.type,
      target_distance: day.distance,
      target_pace: day.pace ? paceStringToSeconds(day.pace) : null,
      description: day.description,
      completed: false,
    }))
  )

  const { data, error } = await insforge.database
    .from('workouts')
    .insert(workoutRows)
    .select()

  if (error) throw new Error(error.message)
  return data as Workout[]
}

export async function getWorkoutsForPlan(planId: string): Promise<Workout[]> {
  const { data, error } = await insforge.database
    .from('workouts')
    .select()
    .eq('plan_id', planId)
    .order('scheduled_date')

  if (error) throw new Error(error.message)
  return data as Workout[]
}

export async function markComplete(workoutId: string, runId: string): Promise<void> {
  const { error } = await insforge.database
    .from('workouts')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      run_id: runId,
    })
    .eq('id', workoutId)

  if (error) throw new Error(error.message)
}

export async function getWorkoutsByDateRange(
  planId: string,
  startDate: string,
  endDate: string
): Promise<Workout[]> {
  const { data, error } = await insforge.database
    .from('workouts')
    .select()
    .eq('plan_id', planId)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date')

  if (error) throw new Error(error.message)
  return data as Workout[]
}

function paceStringToSeconds(pace: string): number {
  const parts = pace.split(':')
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || '0')
}
