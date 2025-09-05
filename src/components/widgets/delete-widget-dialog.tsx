"use client";

import React from "react";
import { Widget } from "@/store/slices/widgetsSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { WIDGETS, UI } from "@/constants";

interface DeleteWidgetDialogProps {
  widget: Widget | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteWidgetDialog: React.FC<DeleteWidgetDialogProps> = ({
  widget,
  isOpen,
  onOpenChange,
  onConfirmDelete,
}) => {
  const handleDelete = () => {
    onConfirmDelete();
    onOpenChange(false);
  };

  const getWidgetTypeLabel = (type: string) => {
    switch (type) {
      case "table":
        return WIDGETS.TABLE_WIDGET;
      case "card":
        return WIDGETS.FINANCE_CARD;
      case "chart":
        return WIDGETS.CHART_WIDGET;
      default:
        return WIDGETS.WIDGET;
    }
  };

  if (!widget) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>{WIDGETS.DELETE_WIDGET}</DialogTitle>
              <DialogDescription className="mt-1">
                {WIDGETS.DELETE_DESCRIPTION}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {WIDGETS.TYPE_LABEL}
                </span>
                <span className="text-sm font-medium">
                  {getWidgetTypeLabel(widget.type)}
                </span>
              </div>
              {widget.stockSymbol && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {WIDGETS.SYMBOL_LABEL}
                  </span>
                  <span className="text-sm font-medium">
                    {widget.stockSymbol}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {WIDGETS.CREATED_LABEL}
                </span>
                <span className="text-sm font-medium">
                  {new Date(widget.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {WIDGETS.DELETE_CONFIRMATION}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {UI.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            {WIDGETS.DELETE_WIDGET}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
