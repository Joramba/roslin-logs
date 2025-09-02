import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { ServiceType } from "@/types";

// Simple filter state to control table view
type FiltersState = {
  search: string;
  type: ServiceType | "all";
  startFrom: string | null;
  startTo: string | null;
};

const initialState: FiltersState = {
  search: "",
  type: "all",
  startFrom: null,
  startTo: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (s, a: PayloadAction<string>) => {
      s.search = a.payload;
    },
    setType: (s, a: PayloadAction<FiltersState["type"]>) => {
      s.type = a.payload;
    },
    setStartFrom: (s, a: PayloadAction<string | null>) => {
      s.startFrom = a.payload;
    },
    setStartTo: (s, a: PayloadAction<string | null>) => {
      s.startTo = a.payload;
    },
    clear: () => initialState,
  },
});

export const { setSearch, setType, setStartFrom, setStartTo, clear } =
  filtersSlice.actions;
export default filtersSlice.reducer;

export const selectFilteredLogs = createSelector(
  (state: RootState) => state.logs.items,
  (state: RootState) => state.filters,
  (items, f) => {
    const search = f.search.trim().toLowerCase();
    return items.filter((l) => {
      const matchesSearch =
        !search ||
        [l.providerId, l.serviceOrder, l.carId, l.serviceDescription].some(
          (v) => v.toLowerCase().includes(search)
        );

      const matchesType = f.type === "all" || l.type === f.type;

      const startOk =
        (!f.startFrom || l.startDate >= f.startFrom) &&
        (!f.startTo || l.startDate <= f.startTo);

      return matchesSearch && matchesType && startOk;
    });
  }
);
