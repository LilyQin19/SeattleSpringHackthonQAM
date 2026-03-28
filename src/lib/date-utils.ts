import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addWeeks,
  differenceInWeeks,
  isToday as _isToday,
  isSameMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'

export function formatDate(dateStr: string, formatStr: string = 'MMM d, yyyy'): string {
  return format(parseISO(dateStr), formatStr)
}

export function isToday(dateStr: string): boolean {
  return _isToday(parseISO(dateStr))
}

export function getWeekNumber(startDate: string, currentDate: string): number {
  const start = parseISO(startDate)
  const current = parseISO(currentDate)
  return Math.max(1, differenceInWeeks(current, start) + 1)
}

export function getWeekRange(startDate: string, weekNumber: number): { start: string; end: string } {
  const base = parseISO(startDate)
  const weekStart = addWeeks(base, weekNumber - 1)
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  return {
    start: format(weekStart, 'yyyy-MM-dd'),
    end: format(weekEnd, 'yyyy-MM-dd'),
  }
}

export function getMonthDays(year: number, month: number): string[] {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getMinRaceDate(): string {
  return format(addWeeks(new Date(), 12), 'yyyy-MM-dd')
}

export { format, parseISO, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek }
