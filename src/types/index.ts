export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type WorkoutType = 'easy' | 'speed' | 'tempo' | 'long' | 'rest'

export type RunSource = 'manual' | 'strava' | 'import'

export interface UserProfile {
  id: string
  email: string
  created_at: string
  race_date: string
  goal_time: string | null
  fitness_level: FitnessLevel
  training_plan_id: string | null
  marathon_pace: number | null
  easy_pace: number | null
  tempo_pace: number | null
  long_run_pace: number | null
  speed_pace: number | null
}

export interface DayPlan {
  day: string
  date: string
  type: WorkoutType
  distance: number | null
  pace: string | null
  description: string
}

export interface WeekSchedule {
  week: number
  week_starting: string
  total_miles: number
  days: DayPlan[]
}

export interface TrainingPlan {
  id: string
  user_id: string
  method: string
  level: string
  start_date: string
  race_date: string
  weekly_schedule: WeekSchedule[]
  created_at: string
  updated_at: string
}

export interface Workout {
  id: string
  plan_id: string
  scheduled_date: string
  type: WorkoutType
  target_distance: number | null
  target_pace: number | null
  target_duration: string | null
  description: string | null
  completed: boolean
  completed_at: string | null
  run_id: string | null
  created_at: string
}

export interface Run {
  id: string
  user_id: string
  workout_id: string | null
  source: RunSource
  external_id: string | null
  date: string
  distance: number
  duration: string
  avg_pace: number | null
  avg_hr: number | null
  max_hr: number | null
  perceived_effort: number | null
  notes: string | null
  created_at: string
}

export interface RunFormData {
  date: string
  distance: string
  duration_hours: string
  duration_minutes: string
  duration_seconds: string
  perceived_effort: number | null
  notes: string
  workout_id: string | null
}

export interface AIFeedback {
  id: string
  run_id: string
  workout_id: string
  summary: string
  pace_analysis: string | null
  effort_assessment: string | null
  recommendations: string[]
  fitness_score: number | null
  confidence: number | null
  created_at: string
}

export interface MarathonEvent {
  race_id: number
  name: string
  date: string
  city: string | null
  state: string | null
  country_code: string | null
  logo_url: string | null
  url: string
  distance: string | null
}

export interface OnboardingState {
  race_date: string | null
  fitness_level: FitnessLevel | null
  goal_time: string | null
  current_step: number
}
