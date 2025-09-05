"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  Eye,
  EyeOff,
  Settings,
  TrendingUp,
  BarChart3,
  Table,
} from "lucide-react";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import { useWidgetsManager } from "@/lib/hooks/use-widgets-manager";
import { DeleteWidgetDialog } from "./delete-widget-dialog";

const getWidgetIcon = (type: string) => {
  switch (type) {
    case "chart":
      return <TrendingUp className="h-4 w-4" />;
    case "table":
      return <Table className="h-4 w-4" />;
    case "card":
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <BarChart3 className="h-4 w-4" />;
  }
};

const getWidgetTypeDisplay = (type: string) => {
  switch (type) {
    case "chart":
      return "Chart Widget";
    case "table":
      return "Table Widget";
    case "card":
      return "Card Widget";
    default:
      return "Widget";
  }
};

export const WidgetsManager = () => {
  const {
    // States
    isOpen,
    setIsOpen,
    hiddenWidgets,
    visibleWidgets,
    deleteDialog,

    // Handlers
    handleDeleteWidget,
    handleConfirmDeleteWidget,
    handleCloseDeleteDialog,
    handleToggleVisibility,
    handleShowAllHidden,
    handleDeleteAllHidden,
  } = useWidgetsManager();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Widgets
          {hiddenWidgets.length > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
              {hiddenWidgets.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Your Widgets</DialogTitle>
          <DialogDescription>
            View and manage all your widgets. Hidden widgets can be restored or
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Visible Widgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                Visible Widgets
              </h3>
              <span className="text-sm text-muted-foreground">
                {visibleWidgets.length} widget
                {visibleWidgets.length !== 1 ? "s" : ""}
              </span>
            </div>

            <ConditionalRenderer isVisible={visibleWidgets.length === 0}>
              <p className="text-muted-foreground text-sm">
                No visible widgets
              </p>
            </ConditionalRenderer>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {visibleWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  className="p-3 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getWidgetIcon(widget.type)}
                      <span className="font-medium text-sm">{widget.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVisibility(widget.id)}
                        className="h-6 w-6 p-0"
                        title="Hide widget"
                      >
                        <EyeOff className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteWidget(widget.id)}
                        className="h-6 w-6 p-0"
                        title="Delete widget"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {getWidgetTypeDisplay(widget.type)}
                    </p>
                    {widget.stockSymbol && (
                      <p>
                        <span className="font-medium">Symbol:</span>{" "}
                        {widget.stockSymbol}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Hidden Widgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">
                Hidden Widgets
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {hiddenWidgets.length} widget
                  {hiddenWidgets.length !== 1 ? "s" : ""}
                </span>
                {hiddenWidgets.length > 0 && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShowAllHidden}
                      className="h-7 text-xs"
                    >
                      Show All
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAllHidden}
                      className="h-7 text-xs"
                    >
                      Delete All
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <ConditionalRenderer isVisible={hiddenWidgets.length === 0}>
              <p className="text-muted-foreground text-sm">No hidden widgets</p>
            </ConditionalRenderer>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {hiddenWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  className="p-3 opacity-60 border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getWidgetIcon(widget.type)}
                      <span className="font-medium text-sm">{widget.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVisibility(widget.id)}
                        className="h-6 w-6 p-0"
                        title="Show widget"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteWidget(widget.id)}
                        className="h-6 w-6 p-0"
                        title="Delete widget"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {getWidgetTypeDisplay(widget.type)}
                    </p>
                    {widget.stockSymbol && (
                      <p>
                        <span className="font-medium">Symbol:</span>{" "}
                        {widget.stockSymbol}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Hidden:</span>{" "}
                      {new Date(widget.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Delete Widget Dialog */}
      <DeleteWidgetDialog
        widget={deleteDialog.widget}
        isOpen={deleteDialog.isOpen}
        onOpenChange={handleCloseDeleteDialog}
        onConfirmDelete={handleConfirmDeleteWidget}
      />
    </Dialog>
  );
};
