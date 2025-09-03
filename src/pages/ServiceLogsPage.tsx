import DraftList from "@/features/drafts/DraftList";
import DraftForm from "@/features/drafts/DraftForm";
import LogsTable from "@/features/serviceLogs/LogsTable";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { validateDraft } from "@/lib/validation";
import type { ServiceLog } from "@/types";
import { nanoid } from "nanoid";
import { addLog } from "@/features/serviceLogs/logsSlice";
import { useToast } from "@/components/ui/Toaster";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function ServiceLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const { activeDraftId, byId, order } = useSelector(
    (s: RootState) => s.drafts
  );
  const hasDrafts = order.length > 0;

  const active = activeDraftId ? byId[activeDraftId] : null;
  const errors = active ? validateDraft(active) : {};
  const isValid = !!active && Object.keys(errors).length === 0;

  const createLog = () => {
    if (!active || !isValid) {
      toast({
        variant: "error",
        title: "Cannot create service log",
        description: "Please complete all required fields.",
      });
      return;
    }
    try {
      const log: ServiceLog = {
        id: nanoid(),
        createdAt: Date.now(),
        providerId: active.providerId,
        serviceOrder: active.serviceOrder,
        carId: active.carId,
        odometer: active.odometer!,
        engineHours: active.engineHours!,
        startDate: active.startDate,
        endDate: active.endDate,
        type: active.type!,
        serviceDescription: active.serviceDescription,
      };
      dispatch(addLog(log));
      toast({ variant: "success", title: "Service log created" });
    } catch (e) {
      toast({
        variant: "error",
        title: "Failed to add service log",
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  const gridClass = hasDrafts
    ? "grid md:grid-cols-[320px_1fr] gap-6"
    : "grid gap-6";

  return (
    <div className="container p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Service Logs</h1>
        <ThemeToggle />
      </div>

      <section className={gridClass}>
        {hasDrafts && (
          <div className="space-y-4">
            <DraftList />
            <button
              className="btn w-full"
              onClick={createLog}
              disabled={!isValid}
            >
              Create Service Log
            </button>
          </div>
        )}

        <div className="card p-4">
          <DraftForm />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Service logs list</h2>
        <LogsTable />
      </section>
    </div>
  );
}
