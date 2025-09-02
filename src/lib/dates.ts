import { addDays, format } from 'date-fns'

// Tiny helpers so date logic stays consistent everywhere
export const todayISO = () => format(new Date(), 'yyyy-MM-dd')

export const plusOneDayISO = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  return format(addDays(d, 1), 'yyyy-MM-dd')
}
