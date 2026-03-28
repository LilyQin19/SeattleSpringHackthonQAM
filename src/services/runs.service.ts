import { insforge } from '@/config/insforge'
import type { Run } from '@/types'

export async function createRun(run: Omit<Run, 'id' | 'created_at'>): Promise<Run> {
  const { data, error } = await insforge.database
    .from('runs')
    .insert(run)
    .select()

  if (error) throw new Error(error.message)
  return data[0] as Run
}

export async function getRunsForUser(userId: string): Promise<Run[]> {
  const { data, error } = await insforge.database
    .from('runs')
    .select()
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Run[]
}

export async function getRunById(runId: string): Promise<Run | null> {
  const { data, error } = await insforge.database
    .from('runs')
    .select()
    .eq('id', runId)
    .single()

  if (error) return null
  return data as Run
}

export async function getRecentRuns(userId: string, weeks: number): Promise<Run[]> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - weeks * 7)

  const { data, error } = await insforge.database
    .from('runs')
    .select()
    .eq('user_id', userId)
    .gte('date', cutoffDate.toISOString().split('T')[0])
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Run[]
}
