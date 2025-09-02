import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  createDraft,
  selectDraft,
  deleteDraft,
  clearAllDrafts,
} from "./draftsSlice";
import { useToast } from "@/components/ui/Toaster";
import Ellipsis from "@/components/ui/Ellipsis";

export default function DraftList() {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { order, byId, activeDraftId } = useSelector(
    (s: RootState) => s.drafts
  );

  const hasDrafts = order.length > 0;
  if (!hasDrafts) {
    // No drafts -> hide the whole left panel controls completely.
    return null;
  }

  const onDeleteActive = () => {
    if (!activeDraftId) return;
    dispatch(deleteDraft(activeDraftId));
    toast({ variant: "success", title: "Draft deleted" });
  };

  const onClearAll = () => {
    dispatch(clearAllDrafts());
    toast({ variant: "info", title: "All drafts cleared" });
  };

  return (
    <div className="space-y-3">
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => dispatch(createDraft())}>
          Create Draft
        </button>
        <button className="btn-outline" onClick={onClearAll}>
          Clear All Drafts
        </button>
        {activeDraftId && (
          <button className="btn-danger ml-auto" onClick={onDeleteActive}>
            Delete Draft
          </button>
        )}
      </div>

      {/* Drafts list */}
      <ul className="grid gap-2">
        {order.map((id) => {
          const d = byId[id];
          const isActive = id === activeDraftId;
          return (
            <li
              key={id}
              role="button"
              onClick={() => dispatch(selectDraft(id))}
              className={[
                "cursor-pointer p-3 rounded-xl border transition flex items-center justify-between",
                isActive
                  ? "bg-blue-50 border-blue-400 ring-2 ring-blue-100"
                  : "hover:bg-gray-50",
              ].join(" ")}
            >
              <div className="text-left flex-1 min-w-0">
                <Ellipsis
                  text={d.providerId?.trim() || "(untitled)"}
                  lines={2}
                  className="font-medium block"
                />
                <Ellipsis
                  text={`${d.serviceOrder || "—"} · ${d.carId || "—"}`}
                  lines={1}
                  className="text-xs opacity-70 mt-1 block"
                />
              </div>

              <div className="flex items-center gap-2 pl-3">
                {isActive && <span className="badge badge-active">Active</span>}
                <span
                  className={`text-xs ${
                    d.savingStatus === "saved"
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {d.savingStatus === "saving" ? "Saving…" : "Saved"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
