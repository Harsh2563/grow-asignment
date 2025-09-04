"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addApiKey as addApiKeyAction,
  updateApiKey as updateApiKeyAction,
  deleteApiKey as deleteApiKeyAction,
  recordKeyUsage as recordKeyUsageAction,
  updateKeyValidation,
  setApiKeys,
  setSelectedApiKey,
  clearSelectedApiKey,
  type ApiKey,
} from "@/store/slices/apiKeysSlice";
import { useEffect } from "react";

export function useApiKeys() {
  const dispatch = useAppDispatch();
  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKeyId = useAppSelector(
    (state) => state.apiKeys.selectedApiKeyId
  );

  useEffect(() => {
    if (!selectedApiKeyId && apiKeys.length > 0) {
      const firstValidKey = apiKeys.find((key) => key.isValid === true);
      if (firstValidKey) {
        dispatch(setSelectedApiKey(firstValidKey.id));
      }
    }
  }, [dispatch, selectedApiKeyId, apiKeys]);

  const addApiKey = (
    name: string,
    key: string,
    provider: "alpha-vantage" | "finnhub" | "polygon" | "nseindia" = "nseindia"
  ) => {
    const newKey = {
      name,
      key,
      provider,
      isActive: true,
    };
    const result = dispatch(addApiKeyAction(newKey));

    // Return a basic object - the component will find the actual key from the store
    return { name, key, provider, isActive: true };
  };

  const getApiKeyByName = (name: string) => {
    return apiKeys.find((key) => key.name === name) || null;
  };

  const getApiKeyById = (id: string) => {
    return apiKeys.find((key) => key.id === id) || null;
  };

  const updateApiKey = (
    id: string,
    updates: Partial<Omit<ApiKey, "id" | "createdAt">>
  ) => {
    dispatch(updateApiKeyAction({ id, updates }));
    const updatedKey = apiKeys.find((key) => key.id === id);
    return updatedKey || null;
  };

  const deleteApiKey = (id: string) => {
    dispatch(deleteApiKeyAction(id));
    return true;
  };

  const recordKeyUsage = (id: string) => {
    dispatch(recordKeyUsageAction(id));
  };

  const updateKeyValidationStatus = (id: string, isValid: boolean) => {
    dispatch(updateKeyValidation({ id, isValid }));
  };

  const getValidApiKeys = () => {
    return apiKeys.filter((key) => key.isValid === true);
  };

  const getUntestedApiKeys = () => {
    return apiKeys.filter((key) => key.isValid === undefined);
  };

  const getSelectedApiKey = () => {
    if (!selectedApiKeyId) return null;
    return apiKeys.find((key) => key.id === selectedApiKeyId) || null;
  };

  const selectApiKey = (id: string) => {
    dispatch(setSelectedApiKey(id));
  };

  const clearSelection = () => {
    dispatch(clearSelectedApiKey());
  };

  return {
    apiKeys,
    selectedApiKeyId,
    isLoading: false,
    addApiKey,
    getApiKeyByName,
    getApiKeyById,
    updateApiKey,
    deleteApiKey,
    recordKeyUsage,
    updateKeyValidationStatus,
    getValidApiKeys,
    getUntestedApiKeys,
    getSelectedApiKey,
    selectApiKey,
    clearSelection,
    refreshApiKeys: () => {},
  };
}
