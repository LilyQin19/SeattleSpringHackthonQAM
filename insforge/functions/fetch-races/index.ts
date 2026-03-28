// InsForge Edge Function: fetch-races
// Proxies the RunSignUp API to fetch upcoming marathon events
//
// Deployed to InsForge via: insforge functions deploy fetch-races --file ./insforge/functions/fetch-races/index.ts

interface MarathonEvent {
  race_id: number
  name: string
  date: string
  city: string | null
  state: string | null
  country_code: string | null
  logo_url: string | null
  url: string
  distance: string | null
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  try {
    const apiKey = Deno.env.get('RUNSIGNUP_API_KEY')
    const apiSecret = Deno.env.get('RUNSIGNUP_API_SECRET')

    if (!apiKey || !apiSecret) {
      return jsonResponse({ error: 'RunSignUp API credentials not configured' }, 502)
    }

    // Compute date range: today → today + 6 months
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)

    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const params = new URLSearchParams({
      format: 'json',
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      min_distance: '26',
      max_distance: '27',
      distance_units: 'M',
      results_per_page: '10',
      sort: 'date ASC',
      events: 'T',
      api_key: apiKey,
      api_secret: apiSecret,
    })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      `https://api.runsignup.com/rest/races?${params.toString()}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!response.ok) {
      return jsonResponse(
        { error: `RunSignUp API returned ${response.status}` },
        502
      )
    }

    const data = await response.json()
    const races = data.races || []

    const events: MarathonEvent[] = races.map(
      (entry: {
        race: {
          race_id: number
          name: string
          next_date: string
          address?: {
            city?: string
            state?: string
            country_code?: string
          }
          logo_url?: string
          url?: string
          events?: Array<{ name?: string; distance?: number; distance_units?: string }>
        }
      }) => {
        const race = entry.race
        const eventInfo = race.events?.[0]
        let distanceLabel: string | null = null
        if (eventInfo?.distance) {
          distanceLabel =
            eventInfo.distance >= 26 && eventInfo.distance <= 27
              ? 'Marathon'
              : `${eventInfo.distance} ${eventInfo.distance_units || 'mi'}`
        }

        // Convert MM/DD/YYYY to YYYY-MM-DD
        let isoDate = race.next_date
        if (race.next_date && race.next_date.includes('/')) {
          const parts = race.next_date.split('/')
          if (parts.length === 3) {
            isoDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
          }
        }

        return {
          race_id: race.race_id,
          name: race.name,
          date: isoDate,
          city: race.address?.city || null,
          state: race.address?.state || null,
          country_code: race.address?.country_code || null,
          logo_url: race.logo_url || null,
          url: race.url || `https://runsignup.com/Race/${race.race_id}`,
          distance: distanceLabel,
        }
      }
    )

    return jsonResponse(events)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return jsonResponse({ error: message }, 502)
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}
