import { useState } from 'react'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AppLayout } from '@/layouts/AppLayout'

type View = 'login' | 'onboarding' | 'dashboard' | 'calendar' | 'history' | 'analytics'

function App() {
  const [view, setView] = useState<View>('login')
  const [showRunModal, setShowRunModal] = useState(false)

  if (view === 'login') {
    return <LoginPage onLogin={() => setView('onboarding')} />
  }

  if (view === 'onboarding') {
    return <OnboardingPage onComplete={() => setView('dashboard')} />
  }

  const activeTab = view === 'dashboard' ? 'today'
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
