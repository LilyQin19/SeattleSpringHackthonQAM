import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { UserProfile } from '@/types'
import * as authService from '@/services/auth.service'
import * as usersService from '@/services/users.service'

interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  hasCompletedOnboarding: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  createUserProfile: (data: Partial<UserProfile> & { id: string; email: string }) => Promise<UserProfile>
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null
  const hasCompletedOnboarding = user?.training_plan_id !== null && user?.training_plan_id !== undefined

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data } = await authService.getCurrentUser()
      if (data?.user) {
        const profile = await usersService.getUserProfile(data.user.id)
        setUser(profile)
      }
    } catch {
      // Not authenticated
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle(window.location.origin + '/app')
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!user?.id) return
    const profile = await usersService.getUserProfile(user.id)
    setUser(profile)
  }, [user?.id])

  const createUserProfile = useCallback(async (data: Partial<UserProfile> & { id: string; email: string }) => {
    const profile = await usersService.createUserProfile(data)
    setUser(profile)
    return profile
  }, [])

  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) return
    const updated = await usersService.updateUserProfile(user.id, updates)
    setUser(updated)
  }, [user?.id])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      hasCompletedOnboarding,
      signInWithGoogle,
      signOut,
      refreshUser,
      createUserProfile,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
