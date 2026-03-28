import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Run, AIFeedback } from '@/types'
import { insforge } from '@/config/insforge'
import * as runsService from '@/services/runs.service'
import * as feedbackService from '@/services/ai-feedback.service'

interface RunState {
  runs: Run[]
  isLoading: boolean
  isSubmitting: boolean
  latestFeedback: AIFeedback | null
  addRun: (run: Omit<Run, 'id' | 'created_at'>) => Promise<Run>
  fetchRuns: (userId: string) => Promise<void>
  requestFeedback: (runId: string, workoutId: string) => Promise<AIFeedback>
  getFeedbackForRun: (runId: string) => Promise<AIFeedback | null>
}

const RunContext = createContext<RunState | null>(null)

export function RunProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<Run[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestFeedback, setLatestFeedback] = useState<AIFeedback | null>(null)

  const fetchRuns = useCallback(async (userId: string) => {
    setIsLoading(true)
    try {
      const fetchedRuns = await runsService.getRunsForUser(userId)
      setRuns(fetchedRuns)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addRun = useCallback(async (run: Omit<Run, 'id' | 'created_at'>) => {
    setIsSubmitting(true)
    try {
      const savedRun = await runsService.createRun(run)
      setRuns(prev => [savedRun, ...prev])
      return savedRun
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const requestFeedback = useCallback(async (runId: string, workoutId: string) => {
    // Use the run from local state if available, otherwise fetch from DB
    const localRun = runs.find(r => r.id === runId)
    const runData = localRun || await runsService.getRunById(runId)
    if (!runData) throw new Error('Run not found')

    // Fetch workout details from DB
    const { data: workoutData } = await insforge.database
      .from('workouts')
      .select()
      .eq('id', workoutId)
      .single()

    // Build recent history summary from local state
    const recentSummary = runs.slice(0, 10).map(r => {
      const pace = r.avg_pace ?? 0
      const mins = Math.floor(pace / 60)
      const secs = String(Math.round(pace % 60)).padStart(2, '0')
      return `${r.date}: ${r.distance}mi at ${mins}:${secs}/mi`
    }).join('\n')

    // Call AI directly from client (bypasses edge function)
    const feedbackData = await feedbackService.requestFeedbackWithAI(
      {
        distance: runData.distance,
        duration: runData.duration,
        avg_pace: runData.avg_pace ?? 0,
        perceived_effort: runData.perceived_effort,
      },
      {
        type: workoutData?.type || 'easy',
        target_distance: workoutData?.target_distance || null,
        target_pace: workoutData?.target_pace || null,
        description: workoutData?.description || null,
      },
      recentSummary
    )

    // Save feedback to database
    const saved = await feedbackService.saveFeedback({
      run_id: runId,
      workout_id: workoutId,
      ...feedbackData,
    })

    setLatestFeedback(saved)
    return saved
  }, [runs])

  const getFeedbackForRun = useCallback(async (runId: string) => {
    return feedbackService.getFeedbackForRun(runId)
  }, [])

  return (
    <RunContext.Provider value={{
      runs,
      isLoading,
      isSubmitting,
      latestFeedback,
      addRun,
      fetchRuns,
      requestFeedback,
      getFeedbackForRun,
    }}>
      {children}
    </RunContext.Provider>
  )
}

export function useRuns() {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRuns must be used within RunProvider')
  return ctx
}
