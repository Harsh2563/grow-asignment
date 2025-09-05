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
        return "Table Widget";
      case "card":
        return "Finance Card";
      case "chart":
        return "Chart Widget";
      default:
        return "Widget";
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
              <DialogTitle>Delete Widget</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Type
                </span>
                <span className="text-sm font-medium">
                  {getWidgetTypeLabel(widget.type)}
                </span>
              </div>
              {widget.stockSymbol && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Symbol
                  </span>
                  <span className="text-sm font-medium">
                    {widget.stockSymbol}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Created
                </span>
                <span className="text-sm font-medium">
                  {new Date(widget.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this widget? All its data and
            configuration will be permanently removed from your dashboard.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
