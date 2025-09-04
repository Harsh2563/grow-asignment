"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { testApiKey } from "@/lib/api/api-key-tester";
import { Button } from "@/components/ui/button";
import { Key as KeyIcon, Plus as PlusIcon } from "lucide-react";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import { EmptyApiKeysState } from "@/components/api-keys/empty-api-keys-state";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";

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
import { useApiKeys } from "@/lib/hooks/use-api-keys";

export const ApiKeysManagerComponent = () => {
  const {
    apiKeys,
    addApiKey,
    deleteApiKey,
    getApiKeyByName,
    updateKeyValidationStatus,
    getSelectedApiKey,
    selectApiKey,
  } = useApiKeys();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("nseindia");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleAddKey = async () => {
    setErrorMessage("");

    if (!newKeyName.trim()) {
      setErrorMessage("API Key name is required");
      return;
    }

    if (!newKeyValue.trim()) {
      setErrorMessage("API Key value is required");
      return;
    }

    const existingKey = getApiKeyByName(newKeyName);
    if (existingKey) {
      setErrorMessage("An API Key with this name already exists");
      return;
    }

    // Test the API key before saving
    setIsTestingKey(true);
    try {
      const testResult = await testApiKey(newKeyValue);

      if (!testResult.success) {
        setErrorMessage(
          `API Key validation failed: ${
            testResult.message || "The API key is not working properly"
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
      setErrorMessage(
        "Failed to test API key. Please check your internet connection and try again."
      );
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
    if (confirm("Are you sure you want to delete this API key?")) {
      deleteApiKey(id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <KeyIcon className="mr-2 h-5 w-5" /> API Keys
        </h2>

        <ConditionalRenderer isVisible={apiKeys.length > 0}>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> Add API Key
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
    </div>
  );
};
