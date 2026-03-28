/**
 * Convert pace string "M:SS" to total seconds per mile
 */
export function paceToSeconds(pace: string): number {
  const parts = pace.split(':')
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || '0')
}

/**
 * Convert seconds per mile to pace string "M:SS"
 */
export function secondsToPace(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calculate pace from distance (miles) and duration (seconds)
 */
export function calculatePace(distanceMiles: number, durationSeconds: number): number {
  if (distanceMiles <= 0 || durationSeconds <= 0) return 0
  return durationSeconds / distanceMiles
}

/**
 * Calculate Hansons paces from marathon pace (seconds per mile)
 */
export function calculateHansonsPaces(marathonPaceSeconds: number) {
  return {
    marathon: marathonPaceSeconds,
    easy: marathonPaceSeconds + 90,    // MP + 60-120 sec (avg 90)
    tempo: marathonPaceSeconds,         // Same as MP
    longRun: marathonPaceSeconds + 45,  // MP + 40-50 sec (avg 45)
    speed: marathonPaceSeconds - 52,    // MP - 45-60 sec (avg 52, ~5K pace)
  }
}

/**
 * Convert goal time string "H:MM:SS" to marathon pace (seconds per mile)
 */
export function goalTimeToMarathonPace(goalTime: string): number {
  const parts = goalTime.split(':')
  const totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2] || '0')
  return totalSeconds / 26.2
}

/**
 * Format duration from "HH:MM:SS" interval to human readable
 */
export function formatDuration(duration: string): string {
  const parts = duration.split(':')
  if (parts.length === 3) {
    const h = parseInt(parts[0])
    const m = parts[1]
    const s = parts[2]
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${parseInt(m)}m ${parseInt(s)}s`
  }
  return duration
}

/**
 * Check if a pace is within reasonable range
 */
export function isPaceReasonable(secondsPerMile: number): boolean {
  return secondsPerMile >= 240 && secondsPerMile <= 1200 // 4:00/mi to 20:00/mi
}
