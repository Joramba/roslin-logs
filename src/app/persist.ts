import localforage from 'localforage'
import { persistReducer, persistStore } from 'redux-persist'

// Use IndexedDB via localforage for better quotas and async storage
export const storage = localforage
export { persistReducer, persistStore }
