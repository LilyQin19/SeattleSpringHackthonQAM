import { useTrainingPlan } from '@/contexts/TrainingPlanContext'
import { getTodayISO } from '@/lib/date-utils'
import { format, parseISO, differenceInDays } from 'date-fns'

export function TrainingProgressBar() {
  const { plan, currentWeekNumber } = useTrainingPlan()

  // Don't render if no plan exists
  if (!plan) return null

  const startDate = parseISO(plan.start_date)
  const raceDate = parseISO(plan.race_date)
  const today = parseISO(getTodayISO())

  const totalDays = differenceInDays(raceDate, startDate)
  const daysElapsed = differenceInDays(today, startDate)

  // Calculate progress percentage, clamped to 0-100
  const progressPercentage = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100))

  // Format dates for display (e.g., "Mar 1", "Jun 28")
  const formattedStartDate = format(startDate, 'MMM d')
  const formattedRaceDate = format(raceDate, 'MMM d')

  return (
    <div className="w-full bg-background border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 py-2">
        {/* Label row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Week {currentWeekNumber} of 18
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Training Progress
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progressPercentage}%`,
              background: 'var(--gradient-progress)',
            }}
          />
        </div>

        {/* Date labels */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">{formattedStartDate}</span>
          <span className="text-[10px] text-muted-foreground">{formattedRaceDate}</span>
        </div>
      </div>
    </div>
  )
}
