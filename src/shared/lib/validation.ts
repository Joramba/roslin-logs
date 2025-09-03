import { plusOneDayISO, MIN_ISO_DATE, isIsoDate, isBeforeMin } from "./dates";
import type { ServiceDraft } from "@/types";

export type DraftErrors = Partial<Record<keyof ServiceDraft, string>>;

/** Validates draft fields; description is optional. */
export function validateDraft(d: ServiceDraft): DraftErrors {
  const e: DraftErrors = {};

  // Required text fields
  if (!d.providerId?.trim()) e.providerId = "Required";
  if (!d.serviceOrder?.trim()) e.serviceOrder = "Required";
  if (!d.carId?.trim()) e.carId = "Required";

  // Numbers
  if (typeof d.odometer !== "number" || Number.isNaN(d.odometer))
    e.odometer = "Number required";
  if (typeof d.engineHours !== "number" || Number.isNaN(d.engineHours))
    e.engineHours = "Number required";

  // Dates: required + ISO + >= 1970-01-01
  if (!d.startDate) {
    e.startDate = "Required";
  } else if (!isIsoDate(d.startDate)) {
    e.startDate = "Invalid date";
  } else if (isBeforeMin(d.startDate)) {
    e.startDate = `Date must be on or after ${MIN_ISO_DATE}`;
  }

  if (!d.endDate) {
    e.endDate = "Required";
  } else if (!isIsoDate(d.endDate)) {
    e.endDate = "Invalid date";
  } else if (isBeforeMin(d.endDate)) {
    e.endDate = `Date must be on or after ${MIN_ISO_DATE}`;
  }

  // Enforce "end = start + 1 day" only when both dates are valid so far
  if (!e.startDate && !e.endDate && d.startDate && d.endDate) {
    const must = plusOneDayISO(d.startDate);
    if (d.endDate !== must) e.endDate = `Must be ${must}`;
  }

  // Type
  if (!d.type) e.type = "Required";

  // d.serviceDescription is optional
  return e;
}
