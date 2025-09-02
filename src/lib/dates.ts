import { addDays, format } from "date-fns";

// Tiny helpers so date logic stays consistent everywhere
export const todayISO = () => format(new Date(), "yyyy-MM-dd");

export const plusOneDayISO = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return format(addDays(d, 1), "yyyy-MM-dd");
};

// Minimum allowed ISO date (inclusive)
export const MIN_ISO_DATE = "1970-01-01";

// Simple ISO date check
export function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

// Compare lexicographically for ISO strings
export function isBeforeMin(iso: string): boolean {
  return isIsoDate(iso) && iso < MIN_ISO_DATE;
}
