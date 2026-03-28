import type { Workout, Run, AIFeedback, WeekSchedule, MarathonEvent } from '@/types'

// Current date for demo
const TODAY = '2026-03-28'

export const DEMO_WEEK_SCHEDULE: WeekSchedule = {
  week: 6,
  week_starting: '2026-03-23',
  total_miles: 48,
  days: [
    { day: 'Monday', date: '2026-03-23', type: 'easy', distance: 6, pace: '9:15', description: 'Easy recovery run at conversational pace' },
    { day: 'Tuesday', date: '2026-03-24', type: 'speed', distance: 8, pace: '7:30', description: '12x400m at 5K pace with 400m jog recovery' },
    { day: 'Wednesday', date: '2026-03-25', type: 'easy', distance: 5, pace: '9:15', description: 'Easy recovery run' },
    { day: 'Thursday', date: '2026-03-26', type: 'tempo', distance: 8, pace: '8:00', description: '1mi warm-up, 6mi at marathon pace, 1mi cool-down' },
    { day: 'Friday', date: '2026-03-27', type: 'rest', distance: null, pace: null, description: 'Rest day — light stretching or yoga optional' },
    { day: 'Saturday', date: '2026-03-28', type: 'easy', distance: 7, pace: '9:00', description: 'Easy run with strides' },
    { day: 'Sunday', date: '2026-03-29', type: 'long', distance: 14, pace: '8:40', description: 'Long run at easy pace, focus on even effort' },
  ],
}

export const DEMO_WORKOUTS: Workout[] = [
  { id: 'w1', plan_id: 'p1', scheduled_date: '2026-03-23', type: 'easy', target_distance: 6, target_pace: 555, target_duration: null, description: 'Easy recovery run at conversational pace', completed: true, completed_at: '2026-03-23T07:30:00', run_id: 'r1', created_at: '2026-03-01' },
  { id: 'w2', plan_id: 'p1', scheduled_date: '2026-03-24', type: 'speed', target_distance: 8, target_pace: 450, target_duration: null, description: '12x400m at 5K pace with 400m jog recovery', completed: true, completed_at: '2026-03-24T06:15:00', run_id: 'r2', created_at: '2026-03-01' },
  { id: 'w3', plan_id: 'p1', scheduled_date: '2026-03-25', type: 'easy', target_distance: 5, target_pace: 555, target_duration: null, description: 'Easy recovery run', completed: true, completed_at: '2026-03-25T07:00:00', run_id: 'r3', created_at: '2026-03-01' },
  { id: 'w4', plan_id: 'p1', scheduled_date: '2026-03-26', type: 'tempo', target_distance: 8, target_pace: 480, target_duration: null, description: '1mi warm-up, 6mi at marathon pace, 1mi cool-down', completed: true, completed_at: '2026-03-26T06:30:00', run_id: 'r4', created_at: '2026-03-01' },
  { id: 'w5', plan_id: 'p1', scheduled_date: '2026-03-27', type: 'rest', target_distance: null, target_pace: null, target_duration: null, description: 'Rest day — light stretching or yoga optional', completed: true, completed_at: '2026-03-27T08:00:00', run_id: null, created_at: '2026-03-01' },
  { id: 'w6', plan_id: 'p1', scheduled_date: '2026-03-28', type: 'easy', target_distance: 7, target_pace: 540, target_duration: null, description: 'Easy run with strides', completed: false, completed_at: null, run_id: null, created_at: '2026-03-01' },
  { id: 'w7', plan_id: 'p1', scheduled_date: '2026-03-29', type: 'long', target_distance: 14, target_pace: 520, target_duration: null, description: 'Long run at easy pace, focus on even effort', completed: false, completed_at: null, run_id: null, created_at: '2026-03-01' },
]

export const DEMO_RUNS: Run[] = [
  { id: 'r1', user_id: 'u1', workout_id: 'w1', source: 'manual', external_id: null, date: '2026-03-23', distance: 6.1, duration: '00:55:30', avg_pace: 547, avg_hr: 142, max_hr: 155, perceived_effort: 4, notes: 'Felt good, legs fresh after rest day', created_at: '2026-03-23' },
  { id: 'r2', user_id: 'u1', workout_id: 'w2', source: 'manual', external_id: null, date: '2026-03-24', distance: 8.2, duration: '01:01:15', avg_pace: 448, avg_hr: 168, max_hr: 182, perceived_effort: 8, notes: 'Strong intervals, last 3 reps were tough', created_at: '2026-03-24' },
  { id: 'r3', user_id: 'u1', workout_id: 'w3', source: 'manual', external_id: null, date: '2026-03-25', distance: 5.0, duration: '00:46:00', avg_pace: 552, avg_hr: 138, max_hr: 148, perceived_effort: 3, notes: 'Recovery run, kept it easy', created_at: '2026-03-25' },
  { id: 'r4', user_id: 'u1', workout_id: 'w4', source: 'manual', external_id: null, date: '2026-03-26', distance: 8.0, duration: '01:03:20', avg_pace: 475, avg_hr: 162, max_hr: 174, perceived_effort: 7, notes: 'Tempo felt controlled, negative split the last 3 miles', created_at: '2026-03-26' },
  // Older runs for analytics
  { id: 'r5', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-16', distance: 6, duration: '00:56:00', avg_pace: 560, avg_hr: 140, max_hr: 152, perceived_effort: 4, notes: null, created_at: '2026-03-16' },
  { id: 'r6', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-17', distance: 7, duration: '00:52:30', avg_pace: 450, avg_hr: 170, max_hr: 184, perceived_effort: 8, notes: 'Speed work', created_at: '2026-03-17' },
  { id: 'r7', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-18', distance: 5, duration: '00:47:00', avg_pace: 564, avg_hr: 136, max_hr: 145, perceived_effort: 3, notes: null, created_at: '2026-03-18' },
  { id: 'r8', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-19', distance: 7, duration: '00:56:00', avg_pace: 480, avg_hr: 160, max_hr: 172, perceived_effort: 6, notes: 'Tempo run', created_at: '2026-03-19' },
  { id: 'r9', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-22', distance: 12, duration: '01:42:00', avg_pace: 510, avg_hr: 152, max_hr: 165, perceived_effort: 6, notes: 'Long run', created_at: '2026-03-22' },
  { id: 'r10', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-09', distance: 6, duration: '00:57:00', avg_pace: 570, avg_hr: 142, max_hr: 155, perceived_effort: 4, notes: null, created_at: '2026-03-09' },
  { id: 'r11', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-10', distance: 7, duration: '00:53:00', avg_pace: 454, avg_hr: 172, max_hr: 186, perceived_effort: 9, notes: 'Hard speed session', created_at: '2026-03-10' },
  { id: 'r12', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-12', distance: 8, duration: '01:04:00', avg_pace: 480, avg_hr: 158, max_hr: 170, perceived_effort: 7, notes: 'Tempo', created_at: '2026-03-12' },
  { id: 'r13', user_id: 'u1', workout_id: null, source: 'manual', external_id: null, date: '2026-03-15', distance: 13, duration: '01:51:00', avg_pace: 515, avg_hr: 150, max_hr: 162, perceived_effort: 6, notes: 'Long run', created_at: '2026-03-15' },
]

export const DEMO_FEEDBACK: AIFeedback = {
  id: 'f1',
  run_id: 'r4',
  workout_id: 'w4',
  summary: 'Excellent tempo session! You maintained a strong, controlled pace throughout the 6-mile tempo portion, finishing with a negative split — a sign of disciplined pacing and growing fitness.',
  pace_analysis: 'Your average pace of 7:55/mile was well within the target of 8:00/mile for this tempo run. The negative split over the final 3 miles shows great race-day instincts developing.',
  effort_assessment: 'Perceived effort of 7/10 is ideal for a tempo run. This indicates you were working at the right intensity — comfortably hard but sustainable. Your heart rate of 162 bpm confirms controlled threshold effort.',
  recommendations: [
    'Continue practicing negative splits — they build confidence and simulate race-day strategy',
    'Consider adding 2-3 short surges (20 seconds) during your easy runs to maintain leg turnover',
    'Your aerobic base is strengthening — next week\'s tempo can increase to 7 miles at pace',
  ],
  fitness_score: 78,
  confidence: 0.89,
  created_at: '2026-03-26',
}

export const DEMO_TODAY = TODAY

export function formatPace(secondsPerMile: number): string {
  const minutes = Math.floor(secondsPerMile / 60)
  const seconds = Math.round(secondsPerMile % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDuration(duration: string): string {
  const parts = duration.split(':')
  if (parts.length === 3) {
    const h = parseInt(parts[0])
    const m = parts[1]
    const s = parts[2]
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }
  return duration
}

// Weekly mileage data for analytics
export const DEMO_WEEKLY_MILEAGE = [
  { week: 1, planned: 38, actual: 36 },
  { week: 2, planned: 40, actual: 41 },
  { week: 3, planned: 42, actual: 40 },
  { week: 4, planned: 44, actual: 44 },
  { week: 5, planned: 46, actual: 45 },
  { week: 6, planned: 48, actual: 27.3 },
]

// Pace trend for analytics
export const DEMO_PACE_TREND = [
  { date: 'W1', easy: 570, tempo: 490, speed: 460 },
  { date: 'W2', easy: 565, tempo: 485, speed: 458 },
  { date: 'W3', easy: 560, tempo: 482, speed: 455 },
  { date: 'W4', easy: 555, tempo: 480, speed: 452 },
  { date: 'W5', easy: 552, tempo: 478, speed: 450 },
  { date: 'W6', easy: 547, tempo: 475, speed: 448 },
]

// Upcoming marathon events for discovery (fallback data)
export const DEMO_UPCOMING_EVENTS: MarathonEvent[] = [
  {
    race_id: 1001,
    name: 'Seattle Marathon',
    date: '2026-05-17',
    city: 'Seattle',
    state: 'WA',
    country_code: 'US',
    logo_url: null,
    url: 'https://www.seattlemarathon.org/',
    distance: 'Marathon',
  },
  {
    race_id: 1002,
    name: 'San Francisco Marathon',
    date: '2026-06-21',
    city: 'San Francisco',
    state: 'CA',
    country_code: 'US',
    logo_url: null,
    url: 'https://www.thesfmarathon.com/',
    distance: 'Marathon',
  },
  {
    race_id: 1003,
    name: 'Rock \'n\' Roll Portland Marathon',
    date: '2026-07-12',
    city: 'Portland',
    state: 'OR',
    country_code: 'US',
    logo_url: null,
    url: 'https://www.runrocknroll.com/portland',
    distance: 'Marathon',
  },
  {
    race_id: 1004,
    name: 'Chicago Marathon',
    date: '2026-08-09',
    city: 'Chicago',
    state: 'IL',
    country_code: 'US',
    logo_url: null,
    url: 'https://www.chicagomarathon.com/',
    distance: 'Marathon',
  },
  {
    race_id: 1005,
    name: 'Twin Cities Marathon',
    date: '2026-09-06',
    city: 'Minneapolis',
    state: 'MN',
    country_code: 'US',
    logo_url: null,
    url: 'https://www.tcmevents.org/',
    distance: 'Marathon',
  },
]
