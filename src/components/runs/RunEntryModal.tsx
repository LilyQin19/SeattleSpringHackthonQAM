import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react'
import { formatPace } from '@/lib/demo-data'
import { WORKOUT_COLORS } from '@/lib/constants'
import { useRuns } from '@/contexts/RunContext'
import { useAuth } from '@/contexts/AuthContext'
import { useTrainingPlan } from '@/contexts/TrainingPlanContext'
import type { RunFormData, AIFeedback } from '@/types'

interface RunEntryModalProps {
  onClose: () => void
}

export function RunEntryModal({ onClose }: RunEntryModalProps) {
  const { addRun, requestFeedback } = useRuns()
  const { user } = useAuth()
  const { todayWorkout } = useTrainingPlan()
  
  const [form, setForm] = useState<RunFormData>({
    date: '2026-03-28',
    distance: '',
    duration_hours: '0',
    duration_minutes: '0',
    duration_seconds: '0',
    perceived_effort: null,
    notes: '',
    workout_id: null,
  })

  // Update workout_id when todayWorkout becomes available
  useEffect(() => {
    if (todayWorkout?.id) {
      setForm(f => ({ ...f, workout_id: todayWorkout.id }))
    }
  }, [todayWorkout])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)

  const distNum = parseFloat(form.distance) || 0
  const totalSeconds = (parseInt(form.duration_hours || '0') * 3600) + (parseInt(form.duration_minutes || '0') * 60) + (parseInt(form.duration_seconds || '0'))
  const pace = distNum > 0 && totalSeconds > 0 ? totalSeconds / distNum : 0

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Validate form data
      if (!form.distance || parseFloat(form.distance) <= 0) {
        throw new Error('Please enter a valid distance')
      }
      if (!form.duration_minutes && !form.duration_hours && !form.duration_seconds) {
        throw new Error('Please enter a duration')
      }
      if (!user?.id) {
        throw new Error('You must be logged in to save a run')
      }

      // Transform form data to database format
      const hours = parseInt(form.duration_hours || '0')
      const minutes = parseInt(form.duration_minutes || '0')
      const seconds = parseInt(form.duration_seconds || '0')
      const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      
      const distance = parseFloat(form.distance)
      const avgPace = distance > 0 && totalSeconds > 0 ? totalSeconds / distance : null

      // Create run data object
      const runData = {
        user_id: user.id,
        workout_id: form.workout_id,
        source: 'manual' as const,
        external_id: null,
        date: form.date,
        distance: distance,
        duration: duration,
        avg_pace: avgPace,
        avg_hr: null,
        max_hr: null,
        perceived_effort: form.perceived_effort,
        notes: form.notes || null,
      }

      // Save run to database
      const savedRun = await addRun(runData)

      // Show feedback section
      setIsSubmitting(false)
      setIsLoadingFeedback(true)
      setShowFeedback(true)

      // Request AI feedback (best effort - don't fail if AI fails)
      try {
        if (form.workout_id) {
          const aiFeedback = await requestFeedback(savedRun.id, form.workout_id)
          setFeedback(aiFeedback)
        }
      } catch (aiError) {
        // AI feedback failed but run was saved - show generic feedback
        console.error('AI feedback failed:', aiError)
        setFeedback({
          id: '',
          run_id: savedRun.id,
          workout_id: form.workout_id || '',
          summary: 'Your run has been saved successfully! AI feedback is temporarily unavailable.',
          pace_analysis: null,
          effort_assessment: null,
          recommendations: ['Keep up the great work!', 'Consistency is key to marathon success.'],
          fitness_score: null,
          confidence: null,
          created_at: new Date().toISOString(),
        })
      } finally {
        setIsLoadingFeedback(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save run')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-t-2xl md:rounded-2xl border shadow-card-hover animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card rounded-t-2xl">
          <h2 className="text-lg font-bold text-foreground">
            {showFeedback ? 'AI Coach Feedback' : 'Log Run'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {!showFeedback ? (
          /* Run Entry Form */
          <div className="p-4 space-y-4">
            {/* Matched workout */}
            {todayWorkout && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${WORKOUT_COLORS[todayWorkout.type].className}`}>
                  {WORKOUT_COLORS[todayWorkout.type].label.toUpperCase()}
                </div>
                <span className="text-sm text-foreground">
                  {todayWorkout.description || `${WORKOUT_COLORS[todayWorkout.type].label} Run`}
                  {todayWorkout.target_distance && ` - ${todayWorkout.target_distance} mi`}
                  {todayWorkout.target_pace && ` @ ${formatPace(todayWorkout.target_pace)}/mi`}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Distance (miles)</label>
              <input
                type="number"
                step="0.1"
                placeholder="7.0"
                value={form.distance}
                onChange={(e) => setForm(f => ({ ...f, distance: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Duration</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="H"
                    value={form.duration_hours}
                    onChange={(e) => setForm(f => ({ ...f, duration_hours: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">hrs</p>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={form.duration_minutes}
                    onChange={(e) => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">min</p>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="SS"
                    value={form.duration_seconds}
                    onChange={(e) => setForm(f => ({ ...f, duration_seconds: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">sec</p>
                </div>
              </div>
            </div>

            {/* Auto-calculated pace */}
            {pace > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground">Calculated Pace:</span>
                <span className="text-sm font-bold text-foreground">{formatPace(pace)}/mi</span>
                {pace > 1200 && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
              </div>
            )}

            {/* Perceived Effort */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Perceived Effort</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                  const isSelected = form.perceived_effort === n
                  const hue = 120 - (n - 1) * 12 // green to red
                  return (
                    <button
                      key={n}
                      onClick={() => setForm(f => ({ ...f, perceived_effort: n }))}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'ring-2 ring-foreground scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        background: `hsl(${hue} ${isSelected ? '70%' : '50%'} ${isSelected ? '45%' : '90%'})`,
                        color: isSelected ? 'hsl(0 0% 100%)' : `hsl(${hue} 60% 35%)`,
                      }}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes (optional)</label>
              <textarea
                placeholder="How did the run feel?"
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              variant="gradient"
              size="lg"
              className="w-full gap-2"
              onClick={handleSubmit}
              disabled={!form.distance || (!form.duration_hours && !form.duration_minutes && !form.duration_seconds) || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save & Get AI Feedback
                </>
              )}
            </Button>
          </div>
        ) : (
          /* AI Feedback Display */
          <div className="p-4 space-y-4">
            {isLoadingFeedback ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow" style={{ background: 'var(--gradient-hero)' }}>
                  <Sparkles className="w-8 h-8" style={{ color: 'hsl(0 0% 100%)' }} />
                </div>
                <p className="text-sm font-medium text-foreground">Analyzing your run...</p>
                <p className="text-xs text-muted-foreground">AI coach is reviewing your performance</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in-up">
                {/* Fitness Score */}
                {feedback?.fitness_score !== null && feedback?.fitness_score !== undefined && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-accent mb-3 relative">
                      <span className="text-3xl font-extrabold text-primary">{feedback.fitness_score}</span>
                      <span className="absolute -bottom-1 text-[10px] font-medium text-muted-foreground">/100</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">Fitness Score</p>
                    <div className="w-48 h-2 bg-secondary rounded-full mx-auto mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${feedback.fitness_score}%`, background: 'var(--gradient-progress)' }} />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <Card className="p-4 border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed">{feedback?.summary || 'Your run has been saved successfully!'}</p>
                </Card>

                {/* Pace Analysis */}
                {feedback?.pace_analysis && (
                  <Card className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pace Analysis</h3>
                    <p className="text-sm text-foreground leading-relaxed">{feedback.pace_analysis}</p>
                  </Card>
                )}

                {/* Effort Assessment */}
                {feedback?.effort_assessment && (
                  <Card className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Effort Assessment</h3>
                    <p className="text-sm text-foreground leading-relaxed">{feedback.effort_assessment}</p>
                  </Card>
                )}

                {/* Recommendations */}
                {feedback?.recommendations && feedback.recommendations.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommendations</h3>
                    <div className="space-y-2.5">
                      {feedback.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <Button variant="outline" className="w-full" onClick={onClose}>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
