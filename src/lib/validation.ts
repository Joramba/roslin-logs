import { plusOneDayISO } from "./dates";
import type { ServiceDraft } from "@/types";

export type DraftErrors = Partial<Record<keyof ServiceDraft, string>>;

// Description is optional now.
export function validateDraft(d: ServiceDraft): DraftErrors {
  const e: DraftErrors = {};
  if (!d.providerId?.trim()) e.providerId = "Required";
  if (!d.serviceOrder?.trim()) e.serviceOrder = "Required";
  if (!d.carId?.trim()) e.carId = "Required";
  if (d.odometer == null || Number.isNaN(d.odometer))
    e.odometer = "Number required";
  if (d.engineHours == null || Number.isNaN(d.engineHours))
    e.engineHours = "Number required";
  if (!d.startDate) e.startDate = "Required";
  if (!d.endDate) e.endDate = "Required";
  if (!d.type) e.type = "Required";
  // d.serviceDescription is optional

  if (d.startDate && d.endDate) {
    const must = plusOneDayISO(d.startDate);
    if (d.endDate !== must) e.endDate = `Must be ${must}`;
  }
  return e;
}
