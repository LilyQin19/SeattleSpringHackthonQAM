import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FITNESS_LEVELS } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useTrainingPlan } from '@/contexts/TrainingPlanContext'
import type { FitnessLevel, OnboardingState } from '@/types'

export function OnboardingPage() {
  const { user, updateUser } = useAuth()
  const { generatePlan, isGenerating } = useTrainingPlan()

  const [state, setState] = useState<OnboardingState>({
    race_date: null,
    fitness_level: null,
    goal_time: null,
    current_step: 0,
  })
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 4
  const progress = ((state.current_step + 1) / totalSteps) * 100

  const next = () => setState(s => ({ ...s, current_step: s.current_step + 1 }))
  const back = () => setState(s => ({ ...s, current_step: Math.max(0, s.current_step - 1) }))

  const handleGenerate = async () => {
    if (!user || !state.race_date || !state.fitness_level) return

    try {
      setError(null)

      // Generate training plan via AI and save to DB
      const savedPlan = await generatePlan(
        user.id,
        state.race_date,
        state.fitness_level,
        state.goal_time,
      )

      // Update user profile with onboarding data + plan reference
      await updateUser({
        race_date: state.race_date,
        fitness_level: state.fitness_level,
        goal_time: state.goal_time,
        training_plan_id: savedPlan.id,
      })
      // App.tsx will re-render to dashboard because hasCompletedOnboarding is now true
    } catch (err) {
      setError('Failed to generate your training plan. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full rounded-r-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--gradient-progress)' }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 20 L10 4 L12 12 L14 4 L18 20" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground">Marathon Coach</span>
        </div>
        <span className="text-xs text-muted-foreground">Step {state.current_step + 1} of {totalSteps}</span>
      </header>

      {/* Step content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        {/* Step 0: Welcome */}
        {state.current_step === 0 && (
          <div className="text-center animate-fade-in-up space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-2" style={{ background: 'var(--gradient-hero)' }}>
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 20 L10 4 L12 12 L14 4 L18 20" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, Runner!</h1>
            <p className="text-muted-foreground leading-relaxed">
              Let's build your personalized marathon training plan based on the 
              <span className="font-semibold text-foreground"> Hansons Marathon Method</span> — 
              a science-backed approach trusted by thousands of marathon runners.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 text-left">
              {[
                { icon: '🎯', title: '18-Week Plan', desc: 'Structured progression' },
                { icon: '🧠', title: 'AI-Powered', desc: 'Personalized to you' },
                { icon: '📊', title: 'Smart Analytics', desc: 'Track every detail' },
                { icon: '💬', title: 'AI Coach', desc: 'Post-run feedback' },
              ].map(f => (
                <Card key={f.title} className="p-3 border-border/50">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-sm font-semibold text-foreground">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </Card>
              ))}
            </div>
            <Button size="lg" variant="gradient" className="w-full mt-4" onClick={next}>
              Get Started
            </Button>
          </div>
        )}

        {/* Step 1: Race Date */}
        {state.current_step === 1 && (
          <div className="w-full animate-fade-in-up space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">📅</div>
              <h2 className="text-2xl font-bold text-foreground">When's your marathon?</h2>
              <p className="text-sm text-muted-foreground">We need at least 12 weeks to build your plan</p>
            </div>
            <div className="space-y-2">
              <input
                type="date"
                value={state.race_date || ''}
                onChange={(e) => setState(s => ({ ...s, race_date: e.target.value }))}
                min="2026-06-20"
                className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={back} className="flex-1">Back</Button>
              <Button
                variant="gradient"
                onClick={next}
                disabled={!state.race_date}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Level */}
        {state.current_step === 2 && (
          <div className="w-full animate-fade-in-up space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">💪</div>
              <h2 className="text-2xl font-bold text-foreground">Your fitness level</h2>
              <p className="text-sm text-muted-foreground">This helps us calibrate your training intensity</p>
            </div>
            <div className="space-y-3">
              {FITNESS_LEVELS.map((level) => (
                <Card
                  key={level.value}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    state.fitness_level === level.value
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => setState(s => ({ ...s, fitness_level: level.value as FitnessLevel }))}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{level.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </div>
                    {state.fitness_level === level.value && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={back} className="flex-1">Back</Button>
              <Button
                variant="gradient"
                onClick={next}
                disabled={!state.fitness_level}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Goal Time + Generate */}
        {state.current_step === 3 && (
          <div className="w-full animate-fade-in-up space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold text-foreground">Goal finish time</h2>
              <p className="text-sm text-muted-foreground">Optional — helps us set your training paces</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <div className="text-center">
                <input
                  type="number"
                  placeholder="H"
                  min="2"
                  max="7"
                  className="w-20 h-14 text-center text-2xl font-bold rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) => {
                    const h = e.target.value || '3'
                    setState(s => ({ ...s, goal_time: `${h}:${s.goal_time?.split(':')[1] || '30'}:00` }))
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1">Hours</div>
              </div>
              <span className="text-2xl font-bold text-muted-foreground mb-4">:</span>
              <div className="text-center">
                <input
                  type="number"
                  placeholder="MM"
                  min="0"
                  max="59"
                  className="w-20 h-14 text-center text-2xl font-bold rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) => {
                    const m = e.target.value || '30'
                    setState(s => ({ ...s, goal_time: `${s.goal_time?.split(':')[0] || '3'}:${m}:00` }))
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1">Minutes</div>
              </div>
            </div>
            <button
              onClick={() => setState(s => ({ ...s, goal_time: null }))}
              className="block mx-auto text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Skip — I don't have a goal time
            </button>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium bg-destructive/10 text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={back} disabled={isGenerating} className="flex-1">Back</Button>
              <Button
                variant="gradient"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Generate My Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
