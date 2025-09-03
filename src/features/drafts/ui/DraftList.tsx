import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  createDraft,
  selectDraft,
  deleteDraft,
  clearAllDrafts,
} from "../model/draftsSlice";
import { useToast } from "@/shared/ui/Toaster";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import { useState } from "react";

export default function DraftList() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { order, byId, activeDraftId } = useSelector(
    (s: RootState) => s.drafts
  );

  // Local UI state for confirmations
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const askDeleteActive = () => {
    if (!activeDraftId) return;
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!activeDraftId) return;
    dispatch(deleteDraft(activeDraftId));
    toast({ variant: "success", title: "Draft deleted" });
    setConfirmDeleteOpen(false);
  };

  const askClearAll = () => setConfirmClearOpen(true);
  const confirmClearAll = () => {
    dispatch(clearAllDrafts());
    toast({ variant: "info", title: "All drafts cleared" });
    setConfirmClearOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => dispatch(createDraft())}>
          Create Draft
        </button>
        <button
          className="btn-outline"
          onClick={askClearAll}
          disabled={order.length === 0}
        >
          Clear All Drafts
        </button>
        {activeDraftId && (
          <button className="btn-danger ml-auto" onClick={askDeleteActive}>
            Delete Draft
          </button>
        )}
      </div>

      {/* Click to switch drafts */}
      <ul className="grid gap-2">
        {order.map((id) => {
          const d = byId[id];
          const isActive = id === activeDraftId;

          return (
            <li
              key={id}
              onClick={() => dispatch(selectDraft(id))}
              className={[
                // base
                "cursor-pointer p-3 rounded-xl border transition flex items-center justify-between",
                // light theme
                "bg-white",
                isActive
                  ? "bg-blue-50 border-blue-400 ring-2 ring-blue-100"
                  : "hover:bg-gray-50",
                // dark theme only
                "dark:bg-gray-900 dark:border-gray-700",
                isActive
                  ? "dark:bg-blue-900/20 dark:border-blue-400/60 dark:ring-2 dark:ring-blue-300/20"
                  : "dark:hover:bg-white/5",
              ].join(" ")}
            >
              <div className="text-left min-w-0">
                <div className="font-medium truncate text-gray-900 dark:text-gray-100">
                  {d.providerId || "(untitled)"}
                </div>
                <div className="text-xs opacity-70 text-gray-500 dark:text-gray-400 truncate">
                  {d.serviceOrder || "—"} · {d.carId || "—"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <span
                    className="badge badge-active
                             dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-400/40"
                  >
                    Active
                  </span>
                )}
                <span
                  className={`text-xs ${
                    d.savingStatus === "saved"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {d.savingStatus === "saving" ? "Saving…" : "Saved"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Confirm delete active draft */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete draft?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />

      {/* Confirm clear all drafts */}
      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear all drafts?"
        description="All drafts will be removed. This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={confirmClearAll}
      />
    </div>
  );
}
