import type { WorkoutType } from '@/types'

export const WORKOUT_COLORS: Record<WorkoutType, { label: string; className: string; dotClass: string; bgClass: string }> = {
  easy: { label: 'Easy', className: 'workout-easy', dotClass: 'dot-easy', bgClass: 'bg-workout-easy' },
  speed: { label: 'Speed', className: 'workout-speed', dotClass: 'dot-speed', bgClass: 'bg-workout-speed' },
  tempo: { label: 'Tempo', className: 'workout-tempo', dotClass: 'dot-tempo', bgClass: 'bg-workout-tempo' },
  long: { label: 'Long', className: 'workout-long', dotClass: 'dot-long', bgClass: 'bg-workout-long' },
  rest: { label: 'Rest', className: 'workout-rest', dotClass: 'dot-rest', bgClass: 'bg-workout-rest' },
}

export const FITNESS_LEVELS = [
  { value: 'beginner' as const, label: 'Beginner', description: 'Less than 20 miles per week', icon: '🌱' },
  { value: 'intermediate' as const, label: 'Intermediate', description: '20-40 miles per week', icon: '🏃' },
  { value: 'advanced' as const, label: 'Advanced', description: '40+ miles per week', icon: '🔥' },
]

export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
