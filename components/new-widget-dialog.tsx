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
import { useAppDispatch } from "@/store/hooks";
import { addWidget } from "@/store/slices/widgetsSlice";

export const NewWidgetDialog = () => {
  const dispatch = useAppDispatch();
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("");
  const [widgetType, setWidgetType] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [chartType, setChartType] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { apiKeys, addApiKey } = useApiKeys();

  const handleAddWidget = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!widgetName.trim()) {
      setErrorMessage("Widget name is required");
      return;
    }

    if (!widgetType) {
      setErrorMessage("Please select a widget type");
      return;
    }

    if (!stockSymbol.trim()) {
      setErrorMessage("Stock symbol is required");
      return;
    }

    if (!selectedApiKeyId) {
      setErrorMessage("Please select an API key");
      return;
    }

    // Create widget and save to Redux store
    const newWidget = {
      name: widgetName,
      type: widgetType as "table" | "card" | "chart",
      stockSymbol: stockSymbol,
      chartType:
        widgetType === "chart"
          ? (chartType as "line" | "candlestick")
          : undefined,
      cardType: widgetType === "card" ? ("watchlist" as const) : undefined,
      refreshInterval: parseInt(refreshInterval),
      apiKeyId: selectedApiKeyId,
      isVisible: true,
    };

    // Dispatch to Redux store
    dispatch(addWidget(newWidget));

    // Reset form
    setWidgetName("");
    setWidgetType("");
    setStockSymbol("");
    setChartType("");
    setRefreshInterval("60");
    setSelectedApiKeyId(null);
    setErrorMessage("");
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
    setNewKeyProvider("");
    setErrorMessage("");
    setIsApiKeyDialogOpen(false);
    setIsWidgetDialogOpen(true);
  };

  const handleCancelAddKey = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyProvider("");
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
            <DialogDescription>
              Create a new financial widget to display real-time stock data on
              your dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWidget}>
            <div className="grid gap-4 py-4">
              {/* Error Message */}
              {errorMessage && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Widget Form Fields */}
              <WidgetFormFields
                widgetName={widgetName}
                widgetType={widgetType}
                stockSymbol={stockSymbol}
                chartType={chartType}
                refreshInterval={refreshInterval}
                onWidgetNameChange={setWidgetName}
                onWidgetTypeChange={setWidgetType}
                onStockSymbolChange={setStockSymbol}
                onChartTypeChange={setChartType}
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
        provider={newKeyProvider}
        errorMessage={errorMessage}
        onKeyNameChange={setNewKeyName}
        onKeyValueChange={setNewKeyValue}
        onProviderChange={setNewKeyProvider}
        onSubmit={handleAddNewKey}
        onCancel={handleCancelAddKey}
      />
    </>
  );
};
