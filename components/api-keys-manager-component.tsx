"use client";

import { useState, useEffect } from "react";
import { ApiKeysManager } from "@/lib/api-keys-manager";
import { Button } from "@/components/ui/button";
import { Key as KeyIcon, Plus as PlusIcon } from "lucide-react";
import { ConditionalRenderer } from "@/ConditionalRenderer/ConditionalRenderer";
import { EmptyApiKeysState } from "@/components/empty-api-keys-state";
import { ApiKeysList } from "@/components/api-keys-list";
import { AddApiKeyDialog } from "@/components/add-api-key-dialog";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export const ApiKeysManagerComponent = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    const keys = ApiKeysManager.getApiKeys();
    setApiKeys(keys);
  };

  const handleAddKey = () => {
    // Validate inputs
    if (!newKeyName.trim()) {
      setErrorMessage("API Key name is required");
      return;
    }

    if (!newKeyValue.trim()) {
      setErrorMessage("API Key value is required");
      return;
    }

    const existingKey = ApiKeysManager.getApiKeyByName(newKeyName);
    if (existingKey) {
      setErrorMessage("An API Key with this name already exists");
      return;
    }

    ApiKeysManager.addApiKey(newKeyName, newKeyValue);

    handleCancelAddKey();
    loadApiKeys();
  };

  const handleCancelAddKey = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setErrorMessage("");
    setIsAddDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    if (confirm("Are you sure you want to delete this API key?")) {
      ApiKeysManager.deleteApiKey(id);
      loadApiKeys();
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
        errorMessage={errorMessage}
        onKeyNameChange={setNewKeyName}
        onKeyValueChange={setNewKeyValue}
        onSubmit={handleAddKey}
        onCancel={handleCancelAddKey}
      />
    </div>
  );
};
