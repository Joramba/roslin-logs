import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ServiceLog } from "@/types";

type LogsState = { items: ServiceLog[] };
const initialState: LogsState = { items: [] };

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog(state, action: PayloadAction<ServiceLog>) {
      state.items.unshift(action.payload);
    },
    updateLog(state, action: PayloadAction<ServiceLog>) {
      const idx = state.items.findIndex((l) => l.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    deleteLog(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
  },
});

export const { addLog, updateLog, deleteLog } = logsSlice.actions;
export default logsSlice.reducer;
