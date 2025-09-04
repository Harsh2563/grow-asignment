"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { ApiKeySelector } from "@/components/api-key-selector";
import { AddApiKeyDialog } from "@/components/add-api-key-dialog";
import { Widget } from "@/store/slices/widgetsSlice";
import { useWidgetConfigurationDialog } from "@/lib/use-widget-configuration-dialog";

interface WidgetConfigurationDialogProps {
  widget: Widget;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WidgetConfigurationDialog: React.FC<
  WidgetConfigurationDialogProps
> = ({ widget, isOpen, onOpenChange }) => {
  const {
    // States
    isApiKeyDialogOpen,
    widgetName,
    setWidgetName,
    refreshInterval,
    setRefreshInterval,
    selectedApiKeyId,
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
    refreshIntervalOptions,

    // Handlers
    handleUpdateWidget,
    handleAddNewKeyFromWidget,
    handleAddNewKey,
    handleCancelAddKey,
    handleApiKeyDialogChange,
  } = useWidgetConfigurationDialog(widget, isOpen);

  return (
    <>
      {/* Widget Configuration Dialog */}
      <Dialog open={isOpen && !isApiKeyDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Widget
            </DialogTitle>
            <DialogDescription>
              Update the widget name, API key, and refresh interval for &quot;
              {widget?.name}&quot;. Other widget properties are fixed and cannot
              be changed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleUpdateWidget(e, onOpenChange)}>
            <div className="grid gap-4 py-4">
              {/* Error Message */}
              {errorMessage && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-md border border-red-200 dark:border-red-800">
                  {errorMessage}
                </div>
              )}

              {/* Widget Name */}
              <div className="grid gap-3">
                <Label htmlFor="widget-name">Widget Name</Label>
                <Input
                  id="widget-name"
                  placeholder="Enter widget name"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Fixed Widget Properties (Read-only display) */}
              <div className="grid gap-3">
                <Label>Widget Properties (Fixed)</Label>
                <div className="bg-muted/30 p-3 rounded-md space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize font-medium">
                      {widget?.type}
                    </span>
                  </div>
                  {widget?.stockSymbol && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Stock Symbol:
                      </span>
                      <span className="font-medium">{widget.stockSymbol}</span>
                    </div>
                  )}
                  {widget?.chartType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chart Type:</span>
                      <span className="capitalize font-medium">
                        {widget.chartType}
                      </span>
                    </div>
                  )}
                  {widget?.cardType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Card Type:</span>
                      <span className="capitalize font-medium">
                        {widget.cardType}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Refresh Interval */}
              <div className="grid gap-3">
                <Label htmlFor="refresh-interval">Refresh Interval</Label>
                <select
                  id="refresh-interval"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {refreshIntervalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

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
                <Settings className="h-4 w-4 mr-1.5" />
                Update Widget
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
