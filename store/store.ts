import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import widgetsReducer from "./slices/widgetsSlice";
import apiKeysReducer from "./slices/apiKeysSlice";

const persistConfig = {
  key: "finboard-store",
  storage,
  whitelist: ["widgets", "apiKeys"],
};

const rootReducer = {
  widgets: widgetsReducer,
  apiKeys: apiKeysReducer,
};

const persistedRootReducer = persistReducer(persistConfig, (state: any, action: any) => ({
  widgets: widgetsReducer(state?.widgets, action),
  apiKeys: apiKeysReducer(state?.apiKeys, action),
}));

export const store = configureStore({
  reducer: persistedRootReducer,
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
