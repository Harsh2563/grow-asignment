"use client";
import dynamic from "next/dynamic";
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
import { ApiKeySelector } from "@/components/api-keys/api-key-selector";
import { WidgetFormFields } from "@/components/widgets/widget-form-fields";
import { WIDGETS, UI } from "@/constants";
// Lazy load AddApiKeyDialog since it's only opened when user needs to add a new API key
const AddApiKeyDialog = dynamic(
  () =>
    import("@/components/api-keys/add-api-key-dialog").then((mod) => ({
      default: mod.AddApiKeyDialog,
    })),
  {
    loading: () => null, // No loading state needed for nested dialog
    ssr: false,
  }
);
import { useNewWidgetDialog } from "@/lib/hooks/use-new-widget-dialog";

export const NewWidgetDialog = () => {
  const {
    // States
    isWidgetDialogOpen,
    setIsWidgetDialogOpen,
    isApiKeyDialogOpen,
    widgetName,
    setWidgetName,
    widgetType,
    setWidgetType,
    stockSymbol,
    setStockSymbol,
    chartType,
    setChartType,
    refreshInterval,
    setRefreshInterval,
    setSelectedApiKeyId,
    newKeyName,
    setNewKeyName,
    newKeyValue,
    setNewKeyValue,
    newKeyProvider,
    setNewKeyProvider,
    errorMessage,
    apiKeys,
    selectedApiKey,

    // Handlers
    handleAddWidget,
    handleAddNewKeyFromWidget,
    handleAddNewKey,
    handleCancelAddKey,
    handleApiKeyDialogChange,
  } = useNewWidgetDialog();

  return (
    <>
      {/* Widget Dialog */}
      <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> {WIDGETS.ADD_WIDGET}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{WIDGETS.ADD_NEW_WIDGET}</DialogTitle>
            <DialogDescription>
              {WIDGETS.ADD_DESCRIPTION}
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
                  {UI.CANCEL}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" /> {WIDGETS.ADD_WIDGET}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <AddApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onOpenChange={handleApiKeyDialogChange}
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
