import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { updateLog } from "./logsSlice";
import type { ServiceLog } from "@/types";
import { validateDraft } from "@/lib/validation";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import Field, { fieldErrorClass } from "@/components/form/Field";

// Compact, centered modal (inline styles) with live validation
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
  }, [id]);

  const fieldErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!local) return e;
    if (!local.providerId?.trim()) e.providerId = "Required";
    if (!local.serviceOrder?.trim()) e.serviceOrder = "Required";
    if (!local.carId?.trim()) e.carId = "Required";
    return e;
  }, [local]);

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  const save = () => {
    if (!local || hasFieldErrors) return;

    const draftLike: any = {
      ...local,
      savingStatus: "saved",
      updatedAt: Date.now(),
      type: local.type,
      odometer: local.odometer,
      engineHours: local.engineHours,
    };
    const errs = validateDraft(draftLike);
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
        {/* Dark overlay */}
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(1px)",
            zIndex: 100,
          }}
        />
        {/* Centered modal with reduced vertical padding */}
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
          {/* Compact sticky header */}
          <div className="flex items-center justify-between sticky top-0 -mx-4 md:-mx-5 py-2 bg-white/95 backdrop-blur border-b">
            <Dialog.Title className="text-2xl font-semibold">
              Edit log
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="rounded-md px-2 py-1 text-sm hover:bg-black/5 "
            >
              ×
            </Dialog.Close>
          </div>

          {/* Form body with tighter spacing */}
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

              <Field label="Description (optional)">
                <textarea
                  className="input min-h-[100px]"
                  value={local.serviceDescription}
                  onChange={(e) =>
                    setLocal({ ...local, serviceDescription: e.target.value })
                  }
                />
              </Field>

              {/* Compact footer */}
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
