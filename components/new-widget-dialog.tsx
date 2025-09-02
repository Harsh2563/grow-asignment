"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus as PlusIcon } from "lucide-react";
import { useApiKeys } from "@/lib/use-api-keys";
import { ApiKeySelector } from "@/components/api-key-selector";
import { WidgetFormFields } from "@/components/widget-form-fields";
import { AddApiKeyDialog } from "@/components/add-api-key-dialog";

export const NewWidgetDialog = () => {
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { apiKeys, addApiKey } = useApiKeys();

  const handleAddWidget = (e: React.FormEvent) => {
    e.preventDefault();
    setWidgetName("");
    setApiUrl("");
    setRefreshInterval("60");
    setSelectedApiKeyId(null);
    setIsWidgetDialogOpen(false);
  };

  const handleAddNewKeyFromWidget = () => {
    setIsWidgetDialogOpen(false);
    setIsApiKeyDialogOpen(true);
  };

  const handleAddNewKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      setErrorMessage("Both name and value are required");
      return;
    }

    const newKey = addApiKey(newKeyName, newKeyValue);
    setSelectedApiKeyId(newKey.id);

    setNewKeyName("");
    setNewKeyValue("");
    setErrorMessage("");
    setIsApiKeyDialogOpen(false);
    setIsWidgetDialogOpen(true);
  };

  const handleCancelAddKey = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setErrorMessage("");
    setIsApiKeyDialogOpen(false);
    setIsWidgetDialogOpen(true);
  };

  const selectedApiKey = apiKeys.find((key) => key.id === selectedApiKeyId);

  return (
    <>
      {/* Widget Dialog */}
      <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> Add Widget
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
            <DialogDescription>
              Configure your new data widget with the required API details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWidget}>
            <div className="grid gap-4 py-4">
              {/* Widget Form Fields */}
              <WidgetFormFields
                widgetName={widgetName}
                apiUrl={apiUrl}
                refreshInterval={refreshInterval}
                onWidgetNameChange={setWidgetName}
                onApiUrlChange={setApiUrl}
                onRefreshIntervalChange={setRefreshInterval}
              />

              {/* API Key Selection */}
              <div className="grid gap-3">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <ApiKeySelector
                    apiKeys={apiKeys}
                    selectedApiKey={selectedApiKey}
                    onSelectApiKey={setSelectedApiKeyId}
                    onAddNewClick={handleAddNewKeyFromWidget}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" /> Add Widget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <AddApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsApiKeyDialogOpen(false);
            setIsWidgetDialogOpen(true);
          }
        }}
        keyName={newKeyName}
        keyValue={newKeyValue}
        errorMessage={errorMessage}
        onKeyNameChange={setNewKeyName}
        onKeyValueChange={setNewKeyValue}
        onSubmit={handleAddNewKey}
        onCancel={handleCancelAddKey}
      />
    </>
  );
};
