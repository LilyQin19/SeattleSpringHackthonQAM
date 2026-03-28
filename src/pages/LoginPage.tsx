import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      setIsRedirecting(true)
      await signInWithGoogle()
    } catch (err) {
      setError('Sign-in failed. Please try again.')
      setIsRedirecting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Hero section with background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-runner.png"
          alt="Marathon runner at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero-overlay)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top nav */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(0 0% 100%)' }}>
                <path d="M6 20 L10 4 L12 12 L14 4 L18 20" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ color: 'hsl(0 0% 100%)' }}>Marathon Coach</span>
          </div>
        </header>

        {/* Hero content */}
        <main className="flex-1 flex flex-col justify-end p-6 pb-12 md:justify-center md:items-center md:pb-6">
          <div className="max-w-lg md:text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6" style={{ background: 'hsl(0 0% 100% / 0.15)', color: 'hsl(0 0% 100% / 0.9)', backdropFilter: 'blur(8px)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(var(--success))' }} />
              Powered by AI + Hansons Method
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4" style={{ color: 'hsl(0 0% 100%)' }}>
              Your AI
              <br />
              Marathon Coach
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'hsl(0 0% 100% / 0.75)' }}>
              Personalized 18-week training plans based on the Hansons Marathon Method. 
              AI-powered coaching feedback after every run.
            </p>

            {error && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 70% 50% / 0.2)', color: 'hsl(0 0% 100% / 0.9)' }}>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 md:justify-center">
              <Button
                size="xl"
                variant="gradient"
                onClick={handleGoogleLogin}
                disabled={isRedirecting}
                className="gap-3"
              >
                {isRedirecting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Redirecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs mt-6" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>
              Free to use during beta. No credit card required.
            </p>
          </div>
        </main>

        {/* Feature pills */}
        <footer className="relative z-10 px-6 pb-8">
          <div className="flex flex-wrap gap-2 md:justify-center">
            {['AI Training Plans', 'Smart Coaching', 'Progress Analytics', 'Hansons Method'].map((feat) => (
              <span key={feat} className="rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: 'hsl(0 0% 100% / 0.1)', color: 'hsl(0 0% 100% / 0.7)', backdropFilter: 'blur(8px)' }}>
                {feat}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
