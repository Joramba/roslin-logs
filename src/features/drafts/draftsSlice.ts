import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { ServiceDraft } from "@/types";
import { todayISO, plusOneDayISO } from "@/lib/dates";

type DraftsState = {
  byId: Record<string, ServiceDraft>;
  order: string[];
  activeDraftId: string | null;
};

const initialState: DraftsState = { byId: {}, order: [], activeDraftId: null };

const newDraft = (): ServiceDraft => {
  const start = todayISO();
  return {
    id: nanoid(),
    providerId: "",
    serviceOrder: "",
    carId: "",
    odometer: null,
    engineHours: null,
    startDate: start,
    endDate: plusOneDayISO(start),
    type: null,
    serviceDescription: "",
    savingStatus: "saved",
    updatedAt: Date.now(),
  };
};

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    createDraft(state) {
      const d = newDraft();
      state.byId[d.id] = d;
      state.order.unshift(d.id);
      state.activeDraftId = d.id;
    },
    selectDraft(state, action: PayloadAction<string>) {
      state.activeDraftId = action.payload;
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; key: keyof ServiceDraft; value: any }>
    ) {
      const d = state.byId[action.payload.id];
      if (!d) return;
      (d as any)[action.payload.key] = action.payload.value;

      // Keep endDate = startDate + 1 day (auto sync)
      if (action.payload.key === "startDate" && d.startDate) {
        d.endDate = plusOneDayISO(d.startDate);
      }

      d.savingStatus = "saving";
      d.updatedAt = Date.now();
    },
    markSaved(state, action: PayloadAction<{ id: string }>) {
      const d = state.byId[action.payload.id];
      if (d) d.savingStatus = "saved";
    },
    deleteDraft(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.byId[id];
      state.order = state.order.filter((x) => x !== id);
      if (state.activeDraftId === id) {
        state.activeDraftId = state.order[0] ?? null;
      }
    },
    clearAllDrafts(state) {
      state.byId = {};
      state.order = [];
      state.activeDraftId = null;
    },
  },
});

export const {
  createDraft,
  selectDraft,
  updateField,
  markSaved,
  deleteDraft,
  clearAllDrafts,
} = draftsSlice.actions;
export default draftsSlice.reducer;
