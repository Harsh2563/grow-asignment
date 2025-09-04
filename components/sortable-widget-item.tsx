"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Widget } from "@/store/slices/widgetsSlice";
import { Button } from "@/components/ui/button";
import { DragHandle } from "@/components/ui/drag-handle";
import { Trash2, Eye, EyeOff } from "lucide-react";

interface SortableWidgetItemProps {
  widget: Widget;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export const SortableWidgetItem: React.FC<SortableWidgetItemProps> = ({
  widget,
  children,
  onDelete,
  onToggleVisibility,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Drag Handle */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-background/80 rounded border-2 border-dashed border-transparent hover:border-primary/20 transition-colors"
        >
          <DragHandle isDragging={isDragging} />
        </div>
      </div>

      {/* Widget Content */}
      <div className={`${isDragging ? 'ring-2 ring-primary ring-opacity-50 rounded-lg' : ''}`}>
        {children}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onToggleVisibility(widget.id)}
          className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border shadow-sm hover:bg-background"
        >
          {widget.isVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(widget.id)}
          className="h-8 w-8 p-0 bg-red-500/90 backdrop-blur-sm shadow-sm hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
