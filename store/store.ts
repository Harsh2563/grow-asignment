import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import widgetsReducer from "./slices/widgetsSlice";

const persistConfig = {
  key: "finboard-widgets",
  storage,
  whitelist: ["widgets"],
};

const persistedWidgetsReducer = persistReducer(persistConfig, widgetsReducer);

export const store = configureStore({
  reducer: {
    widgets: persistedWidgetsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
