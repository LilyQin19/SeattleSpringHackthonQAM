import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_WEEKLY_MILEAGE, DEMO_PACE_TREND, DEMO_RUNS, DEMO_FEEDBACK, formatPace } from '@/lib/demo-data'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Target, Award, Zap, Star, CheckCircle } from 'lucide-react'

export function AnalyticsPage() {
  const totalMiles = DEMO_RUNS.reduce((sum, r) => sum + r.distance, 0)
  const totalRuns = DEMO_RUNS.length
  const avgPace = Math.round(DEMO_RUNS.reduce((sum, r) => sum + (r.avg_pace || 0), 0) / totalRuns)
  const completionPct = Math.round((27.3 / 48) * 100) // current week

  // Donut chart data
  const donutData = [
    { name: 'Completed', value: 30 },
    { name: 'Remaining', value: 12 },
  ]

  // Custom tooltip
  const PaceTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
    if (!active || !payload) return null
    return (
      <div className="rounded-lg border bg-card p-3 shadow-elegant text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-muted-foreground">
            {p.dataKey}: <span className="font-medium text-foreground">{formatPace(p.value)}/mi</span>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 md:pt-20 space-y-4 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Total Miles', value: totalMiles.toFixed(1), color: 'text-primary' },
          { icon: Target, label: 'Total Runs', value: totalRuns.toString(), color: 'text-workout-tempo' },
          { icon: Zap, label: 'Avg Pace', value: formatPace(avgPace) + '/mi', color: 'text-workout-speed' },
          { icon: Award, label: 'This Week', value: completionPct + '%', color: 'text-workout-easy' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Weekly Mileage Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Weekly Mileage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_WEEKLY_MILEAGE} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={(v) => `W${v}`} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="planned" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <span className="text-[10px] text-muted-foreground">Planned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-[10px] text-muted-foreground">Actual</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pace Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Pace Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_PACE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  reversed
                  tickFormatter={(v) => formatPace(v)}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<PaceTooltip />} />
                <Line type="monotone" dataKey="easy" stroke="hsl(var(--workout-easy))" strokeWidth={2} dot={{ r: 3 }} name="Easy" />
                <Line type="monotone" dataKey="tempo" stroke="hsl(var(--workout-tempo))" strokeWidth={2} dot={{ r: 3 }} name="Tempo" />
                <Line type="monotone" dataKey="speed" stroke="hsl(var(--workout-speed))" strokeWidth={2} dot={{ r: 3 }} name="Speed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-workout-easy" /><span className="text-[10px] text-muted-foreground">Easy</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-workout-tempo" /><span className="text-[10px] text-muted-foreground">Tempo</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-workout-speed" /><span className="text-[10px] text-muted-foreground">Speed</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Completion & AI Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Plan Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">71%</p>
                  <p className="text-[10px] text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest AI Feedback */}
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Latest AI Feedback</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{DEMO_FEEDBACK.fitness_score}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Fitness Score</p>
                <div className="h-1.5 w-24 bg-secondary rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${DEMO_FEEDBACK.fitness_score}%`, background: 'var(--gradient-progress)' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{DEMO_FEEDBACK.summary}</p>
            <div className="space-y-1.5">
              {DEMO_FEEDBACK.recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 text-success mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
