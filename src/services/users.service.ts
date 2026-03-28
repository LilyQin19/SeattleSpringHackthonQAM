import { insforge } from '@/config/insforge'
import type { UserProfile } from '@/types'

export async function getUserProfile(userId: string) {
  const { data, error } = await insforge.database
    .from('users')
    .select()
    .eq('id', userId)
    .single()

  if (error) return null
  return data as UserProfile
}

export async function createUserProfile(profile: Partial<UserProfile> & { id: string; email: string }) {
  const { data, error } = await insforge.database
    .from('users')
    .insert(profile)
    .select()

  if (error) throw new Error(error.message)
  return data[0] as UserProfile
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await insforge.database
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()

  if (error) throw new Error(error.message)
  return data[0] as UserProfile
}
