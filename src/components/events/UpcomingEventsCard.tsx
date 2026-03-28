import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { getUpcomingMarathons } from '@/services/events.service'
import { format, parseISO } from 'date-fns'
import type { MarathonEvent } from '@/types'

export function UpcomingEventsCard() {
  const [events, setEvents] = useState<MarathonEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUpcomingMarathons()
      .then((data) => setEvents(data.slice(0, 5)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Upcoming Marathons</CardTitle>
          <span className="text-[10px] text-muted-foreground font-medium">Next 6 months</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-lg bg-secondary animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 bg-secondary animate-pulse rounded" />
                  <div className="h-2.5 w-20 bg-secondary animate-pulse rounded" />
                </div>
                <div className="h-3 w-16 bg-secondary animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No upcoming marathons found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <a
                key={event.race_id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary shrink-0">
                  {event.logo_url ? (
                    <img
                      src={event.logo_url}
                      alt={event.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.display = 'none'
                        target.parentElement!.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
                      }}
                    />
                  ) : (
                    <MapPin className="w-[18px] h-[18px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[event.city, event.state].filter(Boolean).join(', ') || 'Location TBA'}
                  </p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-1.5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {format(parseISO(event.date), 'MMM d')}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(parseISO(event.date), 'yyyy')}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
