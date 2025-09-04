import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: "alpha-vantage" | "finnhub" | "polygon" | "nseindia";
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  isValid?: boolean;
  lastTested?: string;
}

interface ApiKeysState {
  apiKeys: ApiKey[];
  selectedApiKeyId?: string;
}

const initialState: ApiKeysState = {
  apiKeys: [],
  selectedApiKeyId: undefined,
};

const apiKeysSlice = createSlice({
  name: "apiKeys",
  initialState,
  reducers: {
    addApiKey: (
      state,
      action: PayloadAction<Omit<ApiKey, "id" | "createdAt">>
    ) => {
      const newApiKey: ApiKey = {
        ...action.payload,
        id: `apikey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      state.apiKeys.push(newApiKey);
    },

    updateApiKey: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<ApiKey, "id" | "createdAt">>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const keyIndex = state.apiKeys.findIndex((key) => key.id === id);
      if (keyIndex !== -1) {
        state.apiKeys[keyIndex] = {
          ...state.apiKeys[keyIndex],
          ...updates,
        };
      }
    },

    deleteApiKey: (state, action: PayloadAction<string>) => {
      state.apiKeys = state.apiKeys.filter((key) => key.id !== action.payload);
    },

    recordKeyUsage: (state, action: PayloadAction<string>) => {
      const keyIndex = state.apiKeys.findIndex(
        (key) => key.id === action.payload
      );
      if (keyIndex !== -1) {
        state.apiKeys[keyIndex].lastUsed = new Date().toISOString();
      }
    },

    updateKeyValidation: (
      state,
      action: PayloadAction<{ id: string; isValid: boolean }>
    ) => {
      const { id, isValid } = action.payload;
      const keyIndex = state.apiKeys.findIndex((key) => key.id === id);
      if (keyIndex !== -1) {
        state.apiKeys[keyIndex].isValid = isValid;
        state.apiKeys[keyIndex].lastTested = new Date().toISOString();
      }
    },

    clearAllApiKeys: (state) => {
      state.apiKeys = [];
    },

    setApiKeys: (state, action: PayloadAction<ApiKey[]>) => {
      state.apiKeys = action.payload;
    },

    setSelectedApiKey: (state, action: PayloadAction<string>) => {
      const keyExists = state.apiKeys.find((key) => key.id === action.payload);
      if (keyExists) {
        state.selectedApiKeyId = action.payload;
      }
    },

    clearSelectedApiKey: (state) => {
      state.selectedApiKeyId = undefined;
    },
  },
});

export const {
  addApiKey,
  updateApiKey,
  deleteApiKey,
  recordKeyUsage,
  updateKeyValidation,
  clearAllApiKeys,
  setApiKeys,
  setSelectedApiKey,
  clearSelectedApiKey,
} = apiKeysSlice.actions;

export default apiKeysSlice.reducer;
