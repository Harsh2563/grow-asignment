"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { testApiKey } from "@/lib/api/api-key-tester";
import { Button } from "@/components/ui/button";
import { Key as KeyIcon, Plus as PlusIcon } from "lucide-react";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import { EmptyApiKeysState } from "@/components/api-keys/empty-api-keys-state";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { API_KEYS } from "@/constants";
import { ApiKey } from "@/types";

const AddApiKeyDialog = dynamic(
  () =>
    import("@/components/api-keys/add-api-key-dialog").then((mod) => ({
      default: mod.AddApiKeyDialog,
    })),
  {
    loading: () => null, // loading state not needed for dialog
    ssr: false,
  }
);

const DeleteApiKeyDialog = dynamic(
  () =>
    import("@/components/api-keys/delete-api-key-dialog").then((mod) => ({
      default: mod.DeleteApiKeyDialog,
    })),
  {
    loading: () => null, // loading state not needed for dialog
    ssr: false,
  }
);
import { useApiKeys } from "@/lib/hooks/use-api-keys";

export const ApiKeysManagerComponent = () => {
  const {
    apiKeys,
    addApiKey,
    deleteApiKey,
    getApiKeyByName,
    updateKeyValidationStatus,
  } = useApiKeys();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("nseindia");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleAddKey = async () => {
    setErrorMessage("");

    if (!newKeyName.trim()) {
      setErrorMessage(API_KEYS.NAME_REQUIRED);
      return;
    }

    if (!newKeyValue.trim()) {
      setErrorMessage(API_KEYS.VALUE_REQUIRED);
      return;
    }

    const existingKey = getApiKeyByName(newKeyName);
    if (existingKey) {
      setErrorMessage(API_KEYS.NAME_EXISTS);
      return;
    }

    // Test the API key before saving
    setIsTestingKey(true);
    try {
      const testResult = await testApiKey(newKeyValue);

      if (!testResult.success) {
        setErrorMessage(
          `${API_KEYS.VALIDATION_FAILED}: ${
            testResult.message || API_KEYS.DEFAULT_VALIDATION_ERROR
          }`
        );
        return;
      }

      // If validation passes, save the key
      addApiKey(newKeyName, newKeyValue, "nseindia");

      // Find the newly added key and update validation status
      const addedKey = getApiKeyByName(newKeyName);
      if (addedKey) {
        updateKeyValidationStatus(addedKey.id, true);
      }

      handleCancelAddKey();
    } catch (error) {
      console.error("Error testing API key:", error);
      setErrorMessage(API_KEYS.CONNECTION_ERROR);
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleCancelAddKey = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyProvider("nseindia");
    setErrorMessage("");
    setIsAddDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    const keyToDelete = apiKeys.find(key => key.id === id);
    if (keyToDelete) {
      setApiKeyToDelete(keyToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (apiKeyToDelete) {
      deleteApiKey(apiKeyToDelete.id);
      setApiKeyToDelete(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <KeyIcon className="mr-2 h-5 w-5" /> {API_KEYS.TITLE}
        </h2>

        <ConditionalRenderer isVisible={apiKeys.length > 0}>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> {API_KEYS.ADD_API_KEY}
          </Button>
        </ConditionalRenderer>
      </div>

      <ConditionalRenderer isVisible={apiKeys.length === 0}>
        <EmptyApiKeysState onAddApiKey={() => setIsAddDialogOpen(true)} />
      </ConditionalRenderer>

      <ConditionalRenderer isVisible={apiKeys.length > 0}>
        <ApiKeysList apiKeys={apiKeys} onDeleteApiKey={handleDeleteKey} />
      </ConditionalRenderer>

      <AddApiKeyDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        keyName={newKeyName}
        keyValue={newKeyValue}
        provider={newKeyProvider}
        errorMessage={errorMessage}
        isLoading={isTestingKey}
        onKeyNameChange={setNewKeyName}
        onKeyValueChange={setNewKeyValue}
        onProviderChange={setNewKeyProvider}
        onSubmit={handleAddKey}
        onCancel={handleCancelAddKey}
      />

      <DeleteApiKeyDialog
        apiKey={apiKeyToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
