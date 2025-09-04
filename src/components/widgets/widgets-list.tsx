"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  deleteWidget,
  toggleWidgetVisibility,
  reorderWidgets,
  Widget,
} from "@/store/slices/widgetsSlice";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Table } from "lucide-react";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import { FinanceTableWidget } from "@/components/widgets/finance-table-widget";
import { StockChartWidget } from "@/components/charts/stock-chart-widget";
import { ComprehensiveFinanceCard } from "@/components/widgets/comprehensive-finance-card";
import { SortableWidgetItem } from "@/components/widgets/sortable-widget-item";
import { WidgetsManager } from "@/components/widgets/widgets-manager";
import { WidgetConfigurationDialog } from "@/components/widgets/widget-configuration-dialog";
import { useApiKeys } from "@/lib/hooks/use-api-keys";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const WidgetsList = () => {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const { apiKeys } = useApiKeys();
  const [configurationWidget, setConfigurationWidget] = useState<Widget | null>(
    null
  );
  const [isConfigurationDialogOpen, setIsConfigurationDialogOpen] =
    useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleWidgets = widgets.filter((widget) => widget.isVisible);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderWidgets({ oldIndex, newIndex }));
      }
    }
  };

  const handleDeleteWidget = (id: string) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      dispatch(deleteWidget(id));
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Widgets</h2>
            <p className="text-muted-foreground mt-2">
              {widgets.length} widget{widgets.length !== 1 ? "s" : ""} in your
              dashboard
            </p>
            {visibleWidgets.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                💡 Hover over widgets to see drag handles and controls
              </p>
            )}
          </div>

          <ConditionalRenderer isVisible={widgets.length > 0}>
            <WidgetsManager />
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
        <div className="pl-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleWidgets.map((widget) => widget.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
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
            </SortableContext>
          </DndContext>
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
    </div>
  );
};
