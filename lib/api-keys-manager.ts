// API Keys Manager
// Handles storing, retrieving, and validating API keys

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider?: 'alphavantage' | 'twelvedata' | 'finnhub';
  createdAt: Date;
  lastUsed?: Date;
  isValid?: boolean;
  lastTested?: Date;
}

export class ApiKeysManager {
  private static readonly STORAGE_KEY = "finboard-api-keys";

  /**
   * Add a new API key
   * @param name A friendly name for the API key
   * @param key The actual API key value
   * @param provider The financial data provider (optional)
   * @returns The newly created API key object
   */
  static addApiKey(name: string, key: string, provider?: 'alphavantage' | 'twelvedata' | 'finnhub'): ApiKey {
    const apiKeys = this.getApiKeys();

    const newApiKey: ApiKey = {
      id: crypto.randomUUID(),
      name,
      key,
      provider,
      createdAt: new Date(),
    };

    apiKeys.push(newApiKey);
    this.saveApiKeys(apiKeys);

    return newApiKey;
  }

  /**
   * Get all stored API keys
   * @returns Array of API key objects
   */
  static getApiKeys(): ApiKey[] {
    if (typeof window === "undefined") {
      return [];
    }

    const storedKeys = localStorage.getItem(this.STORAGE_KEY);
    if (!storedKeys) {
      return [];
    }

    try {
      return JSON.parse(storedKeys);
    } catch (error) {
      console.error("Failed to parse stored API keys:", error);
      return [];
    }
  }

  /**
   * Get a specific API key by its ID
   * @param id The ID of the API key to retrieve
   * @returns The API key object or null if not found
   */
  static getApiKeyById(id: string): ApiKey | null {
    const apiKeys = this.getApiKeys();
    return apiKeys.find((key) => key.id === id) || null;
  }

  /**
   * Get a specific API key by its name
   * @param name The name of the API key to retrieve
   * @returns The API key object or null if not found
   */
  static getApiKeyByName(name: string): ApiKey | null {
    const apiKeys = this.getApiKeys();
    return apiKeys.find((key) => key.name === name) || null;
  }

  /**
   * Update an existing API key
   * @param id The ID of the API key to update
   * @param updates The fields to update
   * @returns The updated API key or null if not found
   */
  static updateApiKey(
    id: string,
    updates: Partial<Omit<ApiKey, "id" | "createdAt">>
  ): ApiKey | null {
    const apiKeys = this.getApiKeys();
    const keyIndex = apiKeys.findIndex((key) => key.id === id);

    if (keyIndex === -1) {
      return null;
    }

    apiKeys[keyIndex] = {
      ...apiKeys[keyIndex],
      ...updates,
    };

    this.saveApiKeys(apiKeys);
    return apiKeys[keyIndex];
  }

  /**
   * Delete an API key by ID
   * @param id The ID of the API key to delete
   * @returns true if deleted, false if not found
   */
  static deleteApiKey(id: string): boolean {
    const apiKeys = this.getApiKeys();
    const initialLength = apiKeys.length;

    const filteredKeys = apiKeys.filter((key) => key.id !== id);

    if (filteredKeys.length !== initialLength) {
      this.saveApiKeys(filteredKeys);
      return true;
    }

    return false;
  }

  /**
   * Record usage of an API key
   * @param id The ID of the API key that was used
   */
  static recordKeyUsage(id: string): void {
    this.updateApiKey(id, { lastUsed: new Date() });
  }

  /**
   * Update the validation status of an API key
   * @param id The ID of the API key to update
   * @param isValid Whether the API key is valid
   */
  static updateKeyValidation(id: string, isValid: boolean): void {
    this.updateApiKey(id, { isValid, lastTested: new Date() });
  }

  /**
   * Get all valid API keys (those that have been tested and are working)
   * @returns Array of valid API key objects
   */
  static getValidApiKeys(): ApiKey[] {
    return this.getApiKeys().filter(key => key.isValid === true);
  }

  /**
   * Get all untested API keys (those that haven't been validated yet)
   * @returns Array of untested API key objects
   */
  static getUntestedApiKeys(): ApiKey[] {
    return this.getApiKeys().filter(key => key.isValid === undefined);
  }

  /**
   * Save API keys to localStorage
   * @param apiKeys Array of API key objects to save
   */
  private static saveApiKeys(apiKeys: ApiKey[]): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(apiKeys));
  }

  /**
   * Clear all API keys from storage
   */
  static clearAllApiKeys(): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(this.STORAGE_KEY);
  }
}
