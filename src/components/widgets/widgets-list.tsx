"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DragEndEvent } from "@dnd-kit/core";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  deleteWidget,
  toggleWidgetVisibility,
  reorderWidgets,
  Widget,
} from "@/store/slices/widgetsSlice";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import { LOADING } from "@/constants";

// Lazy load FinanceTableWidget to reduce initial bundle size
const FinanceTableWidget = dynamic(
  () =>
    import("@/components/widgets/finance-table-widget").then((mod) => ({
      default: mod.FinanceTableWidget,
    })),
  {
    loading: () => (
      <Card className="w-full h-[520px] flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
                        Loading ...
          </span>
        </div>
      </Card>
    ),
    ssr: false,
  }
);

// Lazy load StockChartWidget to reduce initial bundle size and defer loading of recharts library
const StockChartWidget = dynamic(
  () =>
    import("@/components/charts/stock-chart-widget").then((mod) => ({
      default: mod.StockChartWidget,
    })),
  {
    loading: () => (
      <Card className="p-6 h-[550px] flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">{LOADING.CHART}</span>
        </div>
      </Card>
    ),
    ssr: false, // Disable SSR for charts to avoid hydration issues
  }
);

// Lazy load ComprehensiveFinanceCard to reduce initial bundle size
const ComprehensiveFinanceCard = dynamic(
  () =>
    import("@/components/widgets/comprehensive-finance-card").then((mod) => ({
      default: mod.ComprehensiveFinanceCard,
    })),
  {
    loading: () => (
      <Card className="w-full h-[380px] flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            {LOADING.DEFAULT}
          </span>
        </div>
      </Card>
    ),
    ssr: false,
  }
);

// Lazy load SortableWidgetItem since it's only needed when widgets are displayed
const SortableWidgetItem = dynamic(
  () =>
    import("@/components/widgets/sortable-widget-item").then((mod) => ({
      default: mod.SortableWidgetItem,
    })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load WidgetsManager since it's only shown when widgets exist
const WidgetsManager = dynamic(
  () =>
    import("@/components/widgets/widgets-manager").then((mod) => ({
      default: mod.WidgetsManager,
    })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-9 w-32 bg-muted rounded"></div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load WidgetConfigurationDialog since it's only opened on user interaction
const WidgetConfigurationDialog = dynamic(
  () =>
    import("@/components/widgets/widget-configuration-dialog").then((mod) => ({
      default: mod.WidgetConfigurationDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-background rounded-lg p-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="text-sm">Loading dialog...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);
import { useApiKeys } from "@/lib/hooks/use-api-keys";

// Lazy load DeleteWidgetDialog since it's only opened on user interaction
const DeleteWidgetDialog = dynamic(
  () =>
    import("@/components/widgets/delete-widget-dialog").then((mod) => ({
      default: mod.DeleteWidgetDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-background rounded-lg p-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="text-sm">Loading dialog...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load drag and drop components since they're only needed when widgets exist and need to be reordered
const DragDropProvider = dynamic(
  () => import("@/components/widgets/drag-drop-provider"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const WidgetsList = () => {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const { apiKeys } = useApiKeys();
  const [configurationWidget, setConfigurationWidget] = useState<Widget | null>(
    null
  );
  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<Widget | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const visibleWidgets = widgets.filter((widget) => widget.isVisible);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === String(active.id));
      const newIndex = widgets.findIndex((widget) => widget.id === String(over?.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderWidgets({ oldIndex, newIndex }));
      }
    }
  };

  const handleDeleteWidget = (id: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      setWidgetToDelete(widget);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (widgetToDelete) {
      dispatch(deleteWidget(widgetToDelete.id));
      setWidgetToDelete(null);
    }
  };

  const handleToggleVisibility = (id: string) => {
    dispatch(toggleWidgetVisibility(id));
  };

  const handleConfigureWidget = (id: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      setConfigurationWidget(widget);
      setIsConfigurationDialogOpen(true);
    }
  };

  const getApiKeyForWidget = (apiKeyId: string) => {
    return apiKeys.find((key) => key.id === apiKeyId);
  };

  const renderWidget = (widget: Widget) => {
    const apiKey = getApiKeyForWidget(widget.apiKeyId);

    if (!apiKey) {
      return (
        <Card key={widget.id} className="p-6">
          <div className="text-center text-destructive">
            API key not found for this widget
          </div>
        </Card>
      );
    }

    switch (widget.type) {
      case "table":
        return <FinanceTableWidget key={widget.id} widget={widget} />;

      case "card":
        return <ComprehensiveFinanceCard key={widget.id} widget={widget} />;

      case "chart":
        return (
          <StockChartWidget
            key={widget.id}
            widgetId={widget.id}
            symbol={widget.stockSymbol}
            chartType="line"
            apiKey={apiKey}
            refreshInterval={widget.refreshInterval}
            onError={(error) => console.error(`Chart widget error: ${error}`)}
          />
        );
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Widgets</h2>
            <p className="text-muted-foreground mt-2">
              {widgets.length} widget{widgets.length !== 1 ? "s" : ""} in your
              dashboard
            </p>
            {visibleWidgets.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                💡 Hover over widgets to see drag handles and controls
              </p>
            )}
          </div>

          <ConditionalRenderer isVisible={widgets.length > 0}>
            <div className="w-full sm:w-auto">
              <WidgetsManager />
            </div>
          </ConditionalRenderer>
        </div>
      </div>

      <ConditionalRenderer isVisible={widgets.length === 0}>
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-16 w-16 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No widgets created yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your financial dashboard by creating your first
            widget. Track stocks, monitor performance, and stay updated with
            real-time data.
          </p>
        </div>
      </ConditionalRenderer>

      <ConditionalRenderer isVisible={visibleWidgets.length > 0}>
        <div className="pl-0 sm:pl-8">
          {visibleWidgets.length > 1 ? (
            <DragDropProvider
              items={visibleWidgets.map((widget) => widget.id)}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-4 sm:space-y-6">
                {visibleWidgets.map((widget) => (
                  <SortableWidgetItem
                    key={widget.id}
                    widget={widget}
                    onDelete={handleDeleteWidget}
                    onToggleVisibility={handleToggleVisibility}
                    onConfigure={handleConfigureWidget}
                  >
                    {renderWidget(widget)}
                  </SortableWidgetItem>
                ))}
              </div>
            </DragDropProvider>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {visibleWidgets.map((widget) => (
                <SortableWidgetItem
                  key={widget.id}
                  widget={widget}
                  onDelete={handleDeleteWidget}
                  onToggleVisibility={handleToggleVisibility}
                  onConfigure={handleConfigureWidget}
                >
                  {renderWidget(widget)}
                </SortableWidgetItem>
              ))}
            </div>
          )}
        </div>
      </ConditionalRenderer>

      {/* Widget Configuration Dialog */}
      {configurationWidget && (
        <WidgetConfigurationDialog
          widget={configurationWidget}
          isOpen={isConfigurationDialogOpen}
          onOpenChange={setIsConfigurationDialogOpen}
        />
      )}

      {/* Delete Widget Dialog */}
      <DeleteWidgetDialog
        widget={widgetToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
