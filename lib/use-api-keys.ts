"use client";

import { useState, useEffect } from "react";
import { ApiKeysManager } from "@/lib/api-keys-manager";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    setIsLoading(true);
    try {
      const keys = ApiKeysManager.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Error loading API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addApiKey = (name: string, key: string) => {
    const newKey = ApiKeysManager.addApiKey(name, key);
    loadApiKeys();
    return newKey;
  };

  const getApiKeyByName = (name: string) => {
    return ApiKeysManager.getApiKeyByName(name);
  };

  const updateApiKey = (
    id: string,
    updates: Partial<Omit<ApiKey, "id" | "createdAt">>
  ) => {
    const updatedKey = ApiKeysManager.updateApiKey(id, updates);
    loadApiKeys();
    return updatedKey;
  };

  const deleteApiKey = (id: string) => {
    const result = ApiKeysManager.deleteApiKey(id);
    loadApiKeys();
    return result;
  };

  const recordKeyUsage = (id: string) => {
    ApiKeysManager.recordKeyUsage(id);
    loadApiKeys();
  };

  return {
    apiKeys,
    isLoading,
    addApiKey,
    getApiKeyByName,
    updateApiKey,
    deleteApiKey,
    recordKeyUsage,
    refreshApiKeys: loadApiKeys,
  };
}
