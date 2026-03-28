import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WORKOUT_COLORS, DAYS_SHORT } from '@/lib/constants'
import { DEMO_WORKOUTS, DEMO_WEEK_SCHEDULE, DEMO_RUNS, formatPace } from '@/lib/demo-data'
import { Flame, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react'

interface DashboardPageProps {
  onLogRun: () => void
}

export function DashboardPage({ onLogRun }: DashboardPageProps) {
  const todayIndex = 5 // Saturday (0-indexed from Monday)
  const todayWorkout = DEMO_WEEK_SCHEDULE.days[todayIndex]
  const completedCount = DEMO_WORKOUTS.filter(w => w.completed).length
  const totalWorkouts = DEMO_WORKOUTS.filter(w => w.type !== 'rest').length
  const milesCompleted = DEMO_RUNS.filter(r => ['r1','r2','r3','r4'].includes(r.id)).reduce((sum, r) => sum + r.distance, 0)
  const milesPlanned = DEMO_WEEK_SCHEDULE.total_miles

  return (
    <div className="p-4 md:pt-20 space-y-4 animate-fade-in">
      {/* Weekly Strip */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Week 6 of 18</CardTitle>
            <span className="text-xs text-muted-foreground">Mar 23 — Mar 29</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5">
            {DEMO_WEEK_SCHEDULE.days.map((day, i) => {
              const workout = DEMO_WORKOUTS[i]
              const color = WORKOUT_COLORS[day.type]
              const isToday = i === todayIndex
              const isCompleted = workout.completed

              return (
                <div
                  key={day.day}
                  className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg transition-all ${
                    isToday ? 'ring-2 ring-primary bg-accent' : ''
                  }`}
                >
                  <span className="text-[10px] font-medium text-muted-foreground">{DAYS_SHORT[i]}</span>
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${color.className}`}>
                      {day.type === 'rest' ? '—' : day.distance}
                    </div>
                    {isCompleted && day.type !== 'rest' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success absolute -top-0.5 -right-0.5 fill-background" />
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground capitalize">{day.type}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Workout */}
      <Card className="overflow-hidden border-primary/20">
        <div className="h-1" style={{ background: 'var(--gradient-progress)' }} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Workout</p>
              <CardTitle className="text-xl">
                <span className={`inline-flex items-center gap-2`}>
                  <span className={`w-3 h-3 rounded-full ${WORKOUT_COLORS[todayWorkout.type].dotClass}`} />
                  {WORKOUT_COLORS[todayWorkout.type].label} Run
                </span>
              </CardTitle>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${WORKOUT_COLORS[todayWorkout.type].className}`}>
              {todayWorkout.distance} mi
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Target Pace</p>
              <p className="text-lg font-bold text-foreground">{todayWorkout.pace}<span className="text-xs text-muted-foreground">/mi</span></p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Est. Duration</p>
              <p className="text-lg font-bold text-foreground">63<span className="text-xs text-muted-foreground"> min</span></p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{todayWorkout.description}</p>
          <Button variant="gradient" className="w-full gap-2" size="lg" onClick={onLogRun}>
            <TrendingUp className="w-4 h-4" />
            Log This Run
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mileage bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Miles</span>
              <span className="font-semibold text-foreground">{milesCompleted.toFixed(1)} / {milesPlanned}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(milesCompleted / milesPlanned) * 100}%`,
                  background: 'var(--gradient-progress)',
                }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{completedCount}<span className="text-sm text-muted-foreground">/{totalWorkouts}</span></p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Workouts</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{formatPace(509)}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Avg Pace</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-workout-speed" />
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Week Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Runs</CardTitle>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEMO_RUNS.slice(0, 3).map((run) => {
              const workout = DEMO_WORKOUTS.find(w => w.id === run.workout_id)
              const type = workout?.type || 'easy'
              return (
                <div key={run.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${WORKOUT_COLORS[type].className}`}>
                    <span className="text-xs font-bold">{run.distance}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">{type} run</p>
                    <p className="text-xs text-muted-foreground">{run.date} · {run.avg_pace ? formatPace(run.avg_pace) + '/mi' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">{run.distance} mi</p>
                    <p className="text-[10px] text-muted-foreground">{run.duration}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
