import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, storage } from "./persist";

import draftsReducer from "@/features/drafts/model/draftsSlice";
import logsReducer from "@/features/serviceLogs/model/logsSlice";
import filtersReducer from "@/features/serviceLogs/model/filtersSlice";

const rootReducer = combineReducers({
  drafts: draftsReducer,
  logs: logsReducer,
  filters: filtersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["drafts", "logs"], // persist both drafts and logs
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false }), // redux-persist uses non-serializable actions
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
