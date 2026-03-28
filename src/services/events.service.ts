import { insforge } from '@/config/insforge'
import { DEMO_UPCOMING_EVENTS } from '@/lib/demo-data'
import type { MarathonEvent } from '@/types'

export async function getUpcomingMarathons(): Promise<MarathonEvent[]> {
  try {
    const { data, error } = await insforge.functions.invoke('fetch-races', {
      body: {},
    })

    if (error) throw new Error(error.message || 'Failed to fetch races')

    if (Array.isArray(data) && data.length > 0) {
      return data as MarathonEvent[]
    }

    return DEMO_UPCOMING_EVENTS
  } catch (err) {
    console.warn('Failed to fetch marathon events, using demo data:', err)
    return DEMO_UPCOMING_EVENTS
  }
}
