import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { insforge } from '@/config/insforge'
import { DEMO_WORKOUTS, DEMO_WEEK_SCHEDULE, DEMO_RUNS, DEMO_FEEDBACK, formatPace } from '@/lib/demo-data'
import { DEMO_UPCOMING_EVENTS } from '@/lib/demo-data'
import { Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

// Demo data constants
const CURRENT_WEEK = 6
const TOTAL_WEEKS = 18
const TODAY = new Date('2026-03-28')
const RACE_DATE = new Date(DEMO_UPCOMING_EVENTS[0].date) // Seattle Marathon
const FITNESS_SCORE = 82

// Calculate days until race
const daysUntilRace = Math.ceil((RACE_DATE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))

// Calculate weekly progress
const completedWorkoutsThisWeek = DEMO_WORKOUTS.filter(w => w.completed && w.type !== 'rest').length
const totalPlannedWorkouts = DEMO_WORKOUTS.filter(w => w.type !== 'rest').length
const weeklyMilesCompleted = DEMO_RUNS.filter(r => ['r1', 'r2', 'r3', 'r4'].includes(r.id)).reduce((sum, r) => sum + r.distance, 0)
const weeklyMilesPlanned = DEMO_WEEK_SCHEDULE.total_miles

// Calculate average pace from recent runs
const recentRuns = DEMO_RUNS.slice(0, 4)
const avgPaceSeconds = recentRuns.reduce((sum, r) => sum + r.avg_pace, 0) / recentRuns.length
const avgPace = formatPace(avgPaceSeconds)

// Fallback/demo summary
const FALLBACK_SUMMARY = "You're crushing Week 6! Four strong workouts in the bag, and your tempo run showed fantastic pacing discipline. With 120 days until race day, you're building exactly the aerobic base and speed endurance you need. Trust the process — you're on track for a great Seattle Marathon!"

interface MetricBadgeProps {
  label: string
  value: string
  className?: string
}

function MetricBadge({ label, value, className }: MetricBadgeProps) {
  return (
    <div className={cn("flex flex-col items-center px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm", className)}>
      <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  )
}

function SkeletonState() {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <CardContent className="p-6 space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/20 animate-pulse" />
          <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
        </div>
        
        {/* Summary text skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-white/20 rounded animate-pulse" />
        </div>
        
        {/* Metrics skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-12 w-20 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-12 w-20 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AISummaryCard() {
  const [summary, setSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const systemPrompt = `You are an enthusiastic, world-class marathon coach. Generate a brief, personalized training status summary. Be very encouraging and motivational. Focus on what's going well and what to look forward to. Keep it to 2-3 sentences.`

    const userPrompt = `Generate a training summary for a runner with the following context:

Current Training Status:
- Week ${CURRENT_WEEK} of ${TOTAL_WEEKS} training plan
- ${daysUntilRace} days until race day (${DEMO_UPCOMING_EVENTS[0].name})
- ${completedWorkoutsThisWeek} of ${totalPlannedWorkouts} workouts completed this week
- Weekly mileage: ${weeklyMilesCompleted.toFixed(1)} of ${weeklyMilesPlanned} miles completed
- Recent average pace: ${avgPace}/mile
- Fitness score: ${FITNESS_SCORE}/100

Recent performance highlights:
- Completed a strong tempo run with negative splits
- Maintained consistent easy runs throughout the week
- Speed workout showed good interval discipline

Be encouraging, mention their progress, and build excitement for the upcoming race.`

    try {
      const { data } = await insforge.ai.chat.completions.create({
        model: 'anthropic/claude-3.5-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
      })

      const content = data.choices?.[0]?.message?.content
      if (content) {
        setSummary(content.trim())
      } else {
        setSummary(FALLBACK_SUMMARY)
      }
    } catch (err) {
      console.error('Failed to generate AI summary:', err)
      setSummary(FALLBACK_SUMMARY)
      setError('Using cached summary')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    generateSummary()
  }, [generateSummary])

  if (isLoading) {
    return <SkeletonState />
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Header with AI Coach label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold text-white/90">AI Coach</span>
          </div>
          <button
            onClick={generateSummary}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title="Refresh summary"
          >
            <RefreshCw className="w-4 h-4 text-white/80" />
          </button>
        </div>

        {/* Summary text */}
        <p className="text-base leading-relaxed text-white">
          {summary || FALLBACK_SUMMARY}
        </p>

        {/* Metric badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          <MetricBadge 
            label="Week" 
            value={`${CURRENT_WEEK}/${TOTAL_WEEKS}`} 
          />
          <MetricBadge 
            label="Race Day" 
            value={`${daysUntilRace} days`} 
          />
          <MetricBadge 
            label="Readiness" 
            value={`${FITNESS_SCORE}%`} 
          />
          <MetricBadge 
            label="This Week" 
            value={`${Math.round(weeklyMilesCompleted)}/${weeklyMilesPlanned} mi`} 
          />
        </div>

        {error && (
          <p className="text-[10px] text-white/60 italic">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
