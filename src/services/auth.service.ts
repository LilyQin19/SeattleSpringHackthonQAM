import { insforge } from '@/config/insforge'

export async function signInWithGoogle(redirectTo: string) {
  return insforge.auth.signInWithOAuth({
    provider: 'google',
    redirectTo,
  })
}

export async function getCurrentUser() {
  return insforge.auth.getCurrentUser()
}

export async function signOut() {
  return insforge.auth.signOut()
}
