import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { updateField } from "../model/draftsSlice";
import { useAutosave } from "../hooks/useAutosave";
import { validateDraft } from "@/shared/lib/validation";
import { useEffect, useState } from "react";
import { SERVICE_TYPES } from "@/shared/constants/serviceTypes";
import Field, { fieldErrorClass } from "@/shared/ui/form/Field";
import Select from "@/shared/ui/form/Select";
import EmptyDraft from "./EmptyDraft";

export default function DraftForm() {
  const dispatch = useDispatch<AppDispatch>();
  const activeId = useSelector((s: RootState) => s.drafts.activeDraftId);
  const draft = useSelector((s: RootState) =>
    activeId ? s.drafts.byId[activeId] : null
  );

  // Full error map (computed), but only show for touched fields
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTouched({});
  }, [activeId]);
  useAutosave(draft);

  useEffect(() => {
    if (!draft) return;
    setErrors(validateDraft(draft) as any);
  }, [draft?.updatedAt]);

  if (!draft) {
    return <EmptyDraft />;
  }

  const setField = <K extends keyof typeof draft>(key: K, value: any) => {
    dispatch(updateField({ id: draft.id, key, value }));
    setTouched((prev) => ({ ...prev, [key as string]: true }));
  };
  const markBlur = (key: keyof typeof draft) =>
    setTouched((prev) => ({ ...prev, [key as string]: true }));

  const errIfTouched = (key: keyof typeof draft) =>
    touched[key as string] ? (errors as any)[key] : undefined;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Draft</h2>
        <span className="text-sm">
          {draft.savingStatus === "saving" ? "Saving…" : "Draft saved"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Provider ID" error={errIfTouched("providerId")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("providerId"))}`}
            value={draft.providerId}
            onChange={(e) => setField("providerId", e.target.value)}
            onBlur={() => markBlur("providerId")}
          />
        </Field>

        <Field label="Service Order" error={errIfTouched("serviceOrder")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("serviceOrder"))}`}
            value={draft.serviceOrder}
            onChange={(e) => setField("serviceOrder", e.target.value)}
            onBlur={() => markBlur("serviceOrder")}
          />
        </Field>

        <Field label="Car ID" error={errIfTouched("carId")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("carId"))}`}
            value={draft.carId}
            onChange={(e) => setField("carId", e.target.value)}
            onBlur={() => markBlur("carId")}
          />
        </Field>

        <Field label="Odometer (mi)" error={errIfTouched("odometer")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("odometer"))}`}
            type="number"
            value={draft.odometer ?? ""}
            onChange={(e) =>
              setField(
                "odometer",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            onBlur={() => markBlur("odometer")}
          />
        </Field>

        <Field label="Engine Hours" error={errIfTouched("engineHours")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("engineHours"))}`}
            type="number"
            value={draft.engineHours ?? ""}
            onChange={(e) =>
              setField(
                "engineHours",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            onBlur={() => markBlur("engineHours")}
          />
        </Field>

        <Field label="Start Date" error={errIfTouched("startDate")}>
          <input
            className={`input ${fieldErrorClass(errIfTouched("startDate"))}`}
            type="date"
            value={draft.startDate}
            onChange={(e) => setField("startDate", e.target.value)}
            onBlur={() => markBlur("startDate")}
          />
        </Field>

        <Field label="End Date">
          <div className="grid gap-1">
            <input
              className="input"
              type="date"
              value={draft.endDate}
              disabled
            />
            <span className="text-xs text-gray-500">
              End date is automatically set to the next day.
            </span>
          </div>
        </Field>

        <Field label="Type" error={errIfTouched("type")}>
          <div className="grid gap-1">
            <Select
              options={SERVICE_TYPES}
              value={draft.type ?? ""}
              onChange={(v) => setField("type", v || null)}
              allowEmpty
              placeholder="—"
              className={fieldErrorClass(errIfTouched("type"))}
            />
            <span className="text-xs invisible">
              End date is automatically set to the next day.
            </span>
          </div>
        </Field>
      </div>

      <Field label="Service Description (optional)">
        <textarea
          className="input min-h-[120px]"
          value={draft.serviceDescription}
          onChange={(e) => setField("serviceDescription", e.target.value)}
        />
      </Field>
    </div>
  );
}
