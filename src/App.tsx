import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AppLayout } from '@/layouts/AppLayout'

type Tab = 'today' | 'calendar' | 'history' | 'analytics'
type View = 'dashboard' | 'calendar' | 'history' | 'analytics'

function App() {
  const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth()
  const [view, setView] = useState<View>('dashboard')
  const [showRunModal, setShowRunModal] = useState(false)

  // Loading splash while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 20 L10 4 L12 12 L14 4 L18 20" />
          </svg>
        </div>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated — show login
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Authenticated but hasn't completed onboarding — show onboarding wizard
  if (!hasCompletedOnboarding) {
    return <OnboardingPage />
  }

  // Fully authenticated with completed onboarding — show main app
  const activeTab: Tab = view === 'dashboard' ? 'today'
    : view === 'calendar' ? 'calendar'
    : view === 'history' ? 'history'
    : 'analytics'

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        const viewMap: Record<string, View> = { today: 'dashboard', calendar: 'calendar', history: 'history', analytics: 'analytics' }
        setView(viewMap[tab] || 'dashboard')
      }}
      onLogRun={() => setShowRunModal(true)}
      showRunModal={showRunModal}
      onCloseRunModal={() => setShowRunModal(false)}
    >
      {view === 'dashboard' && <DashboardPage onLogRun={() => setShowRunModal(true)} />}
      {view === 'calendar' && <CalendarPage />}
      {view === 'history' && <HistoryPage />}
      {view === 'analytics' && <AnalyticsPage />}
    </AppLayout>
  )
}

export default App
