import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WORKOUT_COLORS } from '@/lib/constants'
import { DEMO_WORKOUTS } from '@/lib/demo-data'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WorkoutType } from '@/types'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Generate calendar grid for a month
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days: { date: number; month: 'prev' | 'current' | 'next'; fullDate: string }[] = []

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    days.push({ date: d, month: 'prev', fullDate: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, month: 'current', fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` })
  }

  // Next month's leading days
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    days.push({ date: i, month: 'next', fullDate: `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` })
  }

  return days
}

// Extended demo workouts for March
const MARCH_WORKOUTS: Record<string, { type: WorkoutType; distance: number | null; desc: string; completed: boolean }> = {}
DEMO_WORKOUTS.forEach(w => {
  MARCH_WORKOUTS[w.scheduled_date] = { type: w.type, distance: w.target_distance, desc: w.description || '', completed: w.completed }
})
// Add more workouts for calendar fullness
const extraDays: [string, WorkoutType, number | null, string, boolean][] = [
  ['2026-03-02', 'easy', 6, 'Easy run', true],
  ['2026-03-03', 'speed', 7, 'Speed intervals', true],
  ['2026-03-04', 'easy', 5, 'Recovery', true],
  ['2026-03-05', 'tempo', 7, 'Tempo run', true],
  ['2026-03-06', 'rest', null, 'Rest', true],
  ['2026-03-07', 'easy', 6, 'Easy run', true],
  ['2026-03-08', 'long', 12, 'Long run', true],
  ['2026-03-09', 'easy', 6, 'Easy run', true],
  ['2026-03-10', 'speed', 8, 'Speed intervals', true],
  ['2026-03-11', 'easy', 5, 'Recovery', true],
  ['2026-03-12', 'tempo', 8, 'Tempo run', true],
  ['2026-03-13', 'rest', null, 'Rest', true],
  ['2026-03-14', 'easy', 6, 'Easy run', true],
  ['2026-03-15', 'long', 13, 'Long run', true],
  ['2026-03-16', 'easy', 6, 'Easy run', true],
  ['2026-03-17', 'speed', 8, 'Speed work', true],
  ['2026-03-18', 'easy', 5, 'Recovery', true],
  ['2026-03-19', 'tempo', 7, 'Tempo run', true],
  ['2026-03-20', 'rest', null, 'Rest', true],
  ['2026-03-21', 'easy', 7, 'Easy run', true],
  ['2026-03-22', 'long', 14, 'Long run', true],
]
extraDays.forEach(([date, type, dist, desc, comp]) => {
  if (!MARCH_WORKOUTS[date]) {
    MARCH_WORKOUTS[date] = { type, distance: dist, desc, completed: comp }
  }
})

export function CalendarPage() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(2) // March = 2
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const days = getCalendarDays(year, month)
  const selectedWorkout = selectedDate ? MARCH_WORKOUTS[selectedDate] : null
  const today = '2026-03-28'

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="p-4 md:pt-20 space-y-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <CardTitle>{MONTH_NAMES[month]} {year}</CardTitle>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEK_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const workout = MARCH_WORKOUTS[day.fullDate]
              const isToday = day.fullDate === today
              const isSelected = day.fullDate === selectedDate
              const isOtherMonth = day.month !== 'current'

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day.fullDate)}
                  className={`relative flex flex-col items-center py-1.5 rounded-lg transition-all text-xs ${
                    isOtherMonth ? 'opacity-30' : ''
                  } ${
                    isSelected ? 'ring-2 ring-primary bg-accent' : 'hover:bg-accent/50'
                  } ${
                    isToday && !isSelected ? 'bg-accent' : ''
                  }`}
                >
                  <span className={`font-medium ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {day.date}
                  </span>
                  {workout && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${WORKOUT_COLORS[workout.type].dotClass}`} />
                      {workout.completed && workout.type !== 'rest' && (
                        <svg className="w-2.5 h-2.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
            {Object.entries(WORKOUT_COLORS).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Panel */}
      {selectedDate && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWorkout ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${WORKOUT_COLORS[selectedWorkout.type].className}`}>
                    {selectedWorkout.type.toUpperCase()}
                  </div>
                  {selectedWorkout.distance && (
                    <span className="text-sm font-semibold text-foreground">{selectedWorkout.distance} miles</span>
                  )}
                  {selectedWorkout.completed && (
                    <span className="text-xs font-medium text-success flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedWorkout.desc}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No workout scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
