"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  className?: string;
  isDragging?: boolean;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  className,
  isDragging = false,
}) => {
  return (
    <div
      className={cn(
        "cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200",
        isDragging && "text-primary cursor-grabbing",
        className
      )}
    >
      <GripVertical className="h-5 w-5" />
    </div>
  );
};
