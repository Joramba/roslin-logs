import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { updateLog } from "./logsSlice";
import type { ServiceLog } from "@/types";
import { validateDraft } from "@/lib/validation";
import { MIN_ISO_DATE, plusOneDayISO } from "@/lib/dates";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import Field, { fieldErrorClass } from "@/components/form/Field";
import { SERVICE_TYPES } from "@/constants/serviceTypes";

export default function EditLogDialog({
  id,
  onOpenChange,
}: {
  id: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const log =
    useSelector((s: RootState) => s.logs.items.find((l) => l.id === id)) ||
    null;

  const [local, setLocal] = useState<ServiceLog | null>(log);

  useEffect(() => {
    setLocal(log);
  }, [id, log]);

  // Keep endDate = startDate + 1 day if startDate is present
  useEffect(() => {
    if (!local) return;
    if (!local.startDate) return;
    const must = plusOneDayISO(local.startDate);
    if (local.endDate !== must) {
      setLocal((prev) => (prev ? { ...prev, endDate: must } : prev));
    }
  }, [local?.startDate]); // endDate is derived; dependency only on startDate

  // Build a draft-like object to reuse validation
  const draftLike = useMemo(() => {
    if (!local) return null as any;
    return {
      providerId: local.providerId || "",
      serviceOrder: local.serviceOrder || "",
      carId: local.carId || "",
      odometer: local.odometer,
      engineHours: local.engineHours,
      startDate: local.startDate || "",
      endDate: local.endDate || "",
      type: local.type || "",
      serviceDescription: local.serviceDescription || "",
      savingStatus: "saved",
      updatedAt: Date.now(),
    } as any;
  }, [local]);

  const fieldErrors = useMemo(
    () => (draftLike ? validateDraft(draftLike) : {}),
    [draftLike]
  );
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  const save = () => {
    if (!local) return;
    const errs = validateDraft(draftLike as any);
    if (Object.keys(errs).length) {
      toast({
        variant: "error",
        title: "Validation failed",
        description: "Please complete all required fields.",
      });
      return;
    }
    dispatch(updateLog(local));
    toast({ variant: "success", title: "Service log updated" });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={!!id} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(1px)",
            zIndex: 100,
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(92vw, 720px)",
            maxHeight: "85vh",
            zIndex: 110,
            outline: "none",
            overflowY: "auto",
          }}
          className="card p-4 md:p-5 shadow-xl ring-1 ring-black/10"
        >
          <div
            className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur
                border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between py-2">
              <Dialog.Title className="text-2xl font-semibold">
                Edit log
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close"
                className="rounded-lg p-2 text-2xl leading-none
                 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer
                 transition-colors select-none"
              >
                ×
              </Dialog.Close>
            </div>

            {/* Hidden for sighted users, fixes a11y warning */}
            <Dialog.Description className="sr-only">
              Edit an existing service log. All fields below are editable.
            </Dialog.Description>
          </div>

          {local && (
            <div className="grid gap-3 mt-3">
              <Field label="Provider" error={fieldErrors.providerId}>
                <input
                  className={`input ${fieldErrorClass(fieldErrors.providerId)}`}
                  value={local.providerId}
                  onChange={(e) =>
                    setLocal({ ...local, providerId: e.target.value })
                  }
                />
              </Field>

              <Field label="Service Order" error={fieldErrors.serviceOrder}>
                <input
                  className={`input ${fieldErrorClass(
                    fieldErrors.serviceOrder
                  )}`}
                  value={local.serviceOrder}
                  onChange={(e) =>
                    setLocal({ ...local, serviceOrder: e.target.value })
                  }
                />
              </Field>

              <Field label="Car" error={fieldErrors.carId}>
                <input
                  className={`input ${fieldErrorClass(fieldErrors.carId)}`}
                  value={local.carId}
                  onChange={(e) =>
                    setLocal({ ...local, carId: e.target.value })
                  }
                />
              </Field>

              <Field label="Odometer (mi)" error={fieldErrors.odometer}>
                <input
                  type="number"
                  inputMode="numeric"
                  className={`input ${fieldErrorClass(fieldErrors.odometer)}`}
                  value={String(local.odometer)}
                  onChange={(e) =>
                    setLocal({ ...local, odometer: Number(e.target.value) })
                  }
                />
              </Field>

              <Field label="Engine Hours" error={fieldErrors.engineHours}>
                <input
                  type="number"
                  inputMode="numeric"
                  className={`input ${fieldErrorClass(
                    fieldErrors.engineHours
                  )}`}
                  value={String(local.engineHours)}
                  onChange={(e) =>
                    setLocal({ ...local, engineHours: Number(e.target.value) })
                  }
                />
              </Field>

              <Field label="Start Date" error={fieldErrors.startDate}>
                <input
                  type="date"
                  min={MIN_ISO_DATE}
                  className={`input ${fieldErrorClass(fieldErrors.startDate)}`}
                  value={local.startDate}
                  onChange={(e) => {
                    const start = e.target.value;
                    const nextEnd = start ? plusOneDayISO(start) : "";
                    setLocal((prev) =>
                      prev
                        ? { ...prev, startDate: start, endDate: nextEnd }
                        : prev
                    );
                  }}
                />
              </Field>

              <Field label="End Date (auto)">
                <input
                  type="date"
                  min={MIN_ISO_DATE}
                  className="input"
                  value={local.endDate}
                  disabled
                  readOnly
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 block">
                  End date is automatically set to the next day.
                </span>
              </Field>

              <Field label="Type" error={fieldErrors.type}>
                <select
                  className={`input ${fieldErrorClass(fieldErrors.type)}`}
                  value={local.type}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      type: e.target.value as ServiceLog["type"],
                    })
                  }
                >
                  <option value="">—</option>
                  {SERVICE_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Description (optional)">
                <textarea
                  className="input min-h-[100px]"
                  value={local.serviceDescription}
                  onChange={(e) =>
                    setLocal({ ...local, serviceDescription: e.target.value })
                  }
                />
              </Field>

              <div className="flex items-center justify-end gap-2 pt-3 mt-1 border-t">
                <Dialog.Close className="btn-outline">Cancel</Dialog.Close>
                <button
                  className="btn"
                  onClick={save}
                  disabled={hasFieldErrors}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
