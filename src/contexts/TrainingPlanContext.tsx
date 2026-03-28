import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { TrainingPlan, Workout } from '@/types'
import * as plansService from '@/services/plans.service'
import * as workoutsService from '@/services/workouts.service'

interface TrainingPlanState {
  plan: TrainingPlan | null
  workouts: Workout[]
  currentWeekNumber: number
  todayWorkout: Workout | null
  isLoading: boolean
  isGenerating: boolean
  generatePlan: (userId: string, raceDate: string, fitnessLevel: string, goalTime?: string | null) => Promise<TrainingPlan>
  markWorkoutComplete: (workoutId: string, runId: string) => Promise<void>
  fetchPlan: (planId: string) => Promise<void>
  getWorkoutsForWeek: (weekNum: number) => Workout[]
  getWorkoutsForMonth: (year: number, month: number) => Workout[]
}

const TrainingPlanContext = createContext<TrainingPlanState | null>(null)

function getCurrentWeekNumber(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
  return Math.max(1, Math.min(18, diffWeeks + 1))
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function TrainingPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<TrainingPlan | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const currentWeekNumber = plan ? getCurrentWeekNumber(plan.start_date) : 1
  const today = getTodayString()
  const todayWorkout = workouts.find(w => w.scheduled_date === today) || null

  const generatePlan = useCallback(async (userId: string, raceDate: string, fitnessLevel: string, goalTime?: string | null) => {
    setIsGenerating(true)
    try {
      // Call the edge function which handles AI generation, plan saving,
      // workout creation, and user profile update atomically on the backend
      const result = await plansService.generateTrainingPlan(userId, raceDate, fitnessLevel, goalTime)
      const savedPlan = result.plan

      // Fetch the workouts that were created by the edge function
      const savedWorkouts = await workoutsService.getWorkoutsForPlan(savedPlan.id)

      setPlan(savedPlan)
      setWorkouts(savedWorkouts)
      return savedPlan
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const fetchPlan = useCallback(async (planId: string) => {
    setIsLoading(true)
    try {
      const fetchedPlan = await plansService.getPlan(planId)
      if (fetchedPlan) {
        setPlan(fetchedPlan)
        const fetchedWorkouts = await workoutsService.getWorkoutsForPlan(planId)
        setWorkouts(fetchedWorkouts)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markWorkoutComplete = useCallback(async (workoutId: string, runId: string) => {
    // Optimistic update
    setWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? { ...w, completed: true, completed_at: new Date().toISOString(), run_id: runId }
          : w
      )
    )

    try {
      await workoutsService.markComplete(workoutId, runId)
    } catch {
      // Revert on failure
      setWorkouts(prev =>
        prev.map(w =>
          w.id === workoutId
            ? { ...w, completed: false, completed_at: null, run_id: null }
            : w
        )
      )
    }
  }, [])

  const getWorkoutsForWeek = useCallback((weekNum: number): Workout[] => {
    if (!plan) return []
    const startDate = new Date(plan.start_date)
    startDate.setDate(startDate.getDate() + (weekNum - 1) * 7)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    const startStr = startDate.toISOString().split('T')[0]
    const endStr = endDate.toISOString().split('T')[0]

    return workouts.filter(w => w.scheduled_date >= startStr && w.scheduled_date <= endStr)
  }, [plan, workouts])

  const getWorkoutsForMonth = useCallback((year: number, month: number): Workout[] => {
    const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endDate = new Date(year, month + 1, 0)
    const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

    return workouts.filter(w => w.scheduled_date >= startStr && w.scheduled_date <= endStr)
  }, [workouts])

  return (
    <TrainingPlanContext.Provider value={{
      plan,
      workouts,
      currentWeekNumber,
      todayWorkout,
      isLoading,
      isGenerating,
      generatePlan,
      markWorkoutComplete,
      fetchPlan,
      getWorkoutsForWeek,
      getWorkoutsForMonth,
    }}>
      {children}
    </TrainingPlanContext.Provider>
  )
}

export function useTrainingPlan() {
  const ctx = useContext(TrainingPlanContext)
  if (!ctx) throw new Error('useTrainingPlan must be used within TrainingPlanProvider')
  return ctx
}
