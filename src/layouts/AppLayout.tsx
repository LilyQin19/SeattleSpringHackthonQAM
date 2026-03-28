import { type ReactNode, useState } from 'react'
import { Calendar, BarChart3, Clock, Activity, Plus, LogOut, Newspaper } from 'lucide-react'
import { RunEntryModal } from '@/components/runs/RunEntryModal'
import { useAuth } from '@/contexts/AuthContext'
import { TrainingProgressBar } from '@/components/dashboard/TrainingProgressBar'

type TabId = 'today' | 'calendar' | 'history' | 'analytics' | 'news'

interface AppLayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: TabId) => void
  onLogRun: () => void
  showRunModal: boolean
  onCloseRunModal: () => void
}

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'today', label: 'Today', icon: Activity },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'news', label: 'News', icon: Newspaper },
]

export function AppLayout({ children, activeTab, onTabChange, onLogRun, showRunModal, onCloseRunModal }: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const userInitial = user?.email?.charAt(0).toUpperCase() || '?'
  const userEmail = user?.email || ''

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 20 L10 4 L12 12 L14 4 L18 20" />
              </svg>
            </div>
            <span className="font-bold text-foreground">Marathon Coach</span>
          </div>

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              {userInitial}
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-card shadow-card-hover p-2 animate-scale-in">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-semibold text-foreground">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); signOut() }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Training Progress Bar */}
      <TrainingProgressBar />

      {/* Main content */}
      <main className="flex-1 pb-24 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* FAB - Log Run */}
      <button
        onClick={onLogRun}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-30 w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground shadow-fab transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: 'var(--gradient-hero)' }}
        aria-label="Log Run"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop Tab Bar */}
      <div className="hidden md:block fixed top-14 left-0 right-0 z-30 border-b border-border/50 bg-background">
        <div className="flex items-center gap-1 px-4 max-w-5xl mx-auto">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Run Entry Modal */}
      {showRunModal && (
        <RunEntryModal onClose={onCloseRunModal} />
      )}
    </div>
  )
}
