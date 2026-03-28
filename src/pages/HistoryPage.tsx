import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WORKOUT_COLORS } from '@/lib/constants'
import { DEMO_RUNS, DEMO_WORKOUTS, formatPace, formatDuration } from '@/lib/demo-data'
import { MapPin, Clock, TrendingUp, MessageSquare } from 'lucide-react'
import type { WorkoutType } from '@/types'

export function HistoryPage() {
  return (
    <div className="p-4 md:pt-20 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-foreground">Run History</h2>
        <span className="text-xs text-muted-foreground">{DEMO_RUNS.length} runs logged</span>
      </div>

      {DEMO_RUNS.map((run) => {
        const workout = DEMO_WORKOUTS.find(w => w.id === run.workout_id)
        const type: WorkoutType = (workout?.type as WorkoutType) || 'easy'
        const color = WORKOUT_COLORS[type]

        return (
          <Card key={run.id} className="overflow-hidden">
            <div className={`h-0.5 ${color.bgClass}`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${color.className}`}>
                    {type}
                  </div>
                  <CardTitle className="text-sm">{run.distance} miles</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">{run.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold text-foreground">{formatDuration(run.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pace</p>
                    <p className="text-sm font-semibold text-foreground">{run.avg_pace ? formatPace(run.avg_pace) + '/mi' : '--'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Effort</p>
                    <p className="text-sm font-semibold text-foreground">{run.perceived_effort}/10</p>
                  </div>
                </div>
              </div>
              {run.notes && (
                <div className="flex items-start gap-2 pt-2 border-t border-border">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{run.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
