import { createClient } from '@insforge/sdk'

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY

if (!insforgeUrl || !insforgeAnonKey) {
  console.warn(
    'InsForge environment variables not set. Set VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY in .env'
  )
}

export const insforge = createClient({
  baseUrl: insforgeUrl || 'https://placeholder.insforge.app',
  anonKey: insforgeAnonKey || 'placeholder-key',
})
