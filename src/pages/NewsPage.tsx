import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UpcomingEventsCard } from '@/components/events/UpcomingEventsCard'
import { Newspaper, ExternalLink, BookOpen, Trophy, Dumbbell, ShoppingBag } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  source: string
  description: string
  url: string
  category: 'Training Tips' | 'Race News' | 'Gear Review' | 'Inspiration'
  icon: typeof BookOpen
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'How to Taper for Your First Marathon: A Complete Guide',
    source: "Runner's World",
    description: 'Expert advice on reducing mileage and staying sharp in the final weeks before race day.',
    url: 'https://www.runnersworld.com/training/a20823676/how-to-taper/',
    category: 'Training Tips',
    icon: Dumbbell,
  },
  {
    id: '2',
    title: 'Boston Marathon 2025: Registration Opens Next Week',
    source: 'Marathon Handbook',
    description: 'Everything you need to know about qualifying times, registration dates, and the new expo layout.',
    url: 'https://marathonhandbook.com/boston-marathon/',
    category: 'Race News',
    icon: Trophy,
  },
  {
    id: '3',
    title: 'The Best Running Shoes of 2025: Tested & Reviewed',
    source: 'Canadian Running Magazine',
    description: 'Our team logged over 2,000 miles to find the top performers for every type of runner.',
    url: 'https://runningmagazine.ca/gear/shoes/',
    category: 'Gear Review',
    icon: ShoppingBag,
  },
  {
    id: '4',
    title: 'From Couch to Marathon: One Runner\'s 18-Month Journey',
    source: 'Strava Blog',
    description: 'An inspiring story of transformation, setbacks, and the community that made it possible.',
    url: 'https://blog.strava.com/',
    category: 'Inspiration',
    icon: BookOpen,
  },
  {
    id: '5',
    title: 'Ultramarathon Training: When 26.2 Miles Is Just the Beginning',
    source: 'iRunFar',
    description: 'Elite trail runners share their secrets for building endurance beyond the marathon distance.',
    url: 'https://www.irunfar.com/',
    category: 'Training Tips',
    icon: Dumbbell,
  },
  {
    id: '6',
    title: 'Olympic Marathon Trials Preview: Who to Watch',
    source: 'LetsRun.com',
    description: 'Breaking down the contenders, course analysis, and predictions for the upcoming trials.',
    url: 'https://www.letsrun.com/',
    category: 'Race News',
    icon: Trophy,
  },
  {
    id: '7',
    title: 'Heart Rate Training Zones Explained for Runners',
    source: "Runner's World",
    description: 'How to use heart rate monitoring to optimize your training and avoid overtraining.',
    url: 'https://www.runnersworld.com/training/a20823676/heart-rate-training/',
    category: 'Training Tips',
    icon: Dumbbell,
  },
  {
    id: '8',
    title: 'Running Watch Showdown: Garmin vs. Apple vs. Coros',
    source: 'Marathon Handbook',
    description: 'A detailed comparison of the latest GPS watches for tracking your runs and training progress.',
    url: 'https://marathonhandbook.com/best-gps-running-watches/',
    category: 'Gear Review',
    icon: ShoppingBag,
  },
]

const CATEGORY_COLORS: Record<NewsItem['category'], { bg: string; text: string; icon: string }> = {
  'Training Tips': { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'text-blue-500' },
  'Race News': { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'text-amber-500' },
  'Gear Review': { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: 'text-purple-500' },
  'Inspiration': { bg: 'bg-rose-500/10', text: 'text-rose-600', icon: 'text-rose-500' },
}

export function NewsPage() {
  return (
    <div className="p-4 md:pt-20 space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Running News</h1>
          <p className="text-sm text-muted-foreground">Stay updated with the latest from the running world</p>
        </div>
      </div>

      {/* Upcoming Marathons Section */}
      <UpcomingEventsCard />

      {/* Running News & Blog Posts Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Running News & Blog Posts</CardTitle>
            <span className="text-[10px] text-muted-foreground font-medium">Curated for you</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {NEWS_ITEMS.map((item) => {
              const colors = CATEGORY_COLORS[item.category]
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.source}</span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
