import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  deleteWidget,
  toggleWidgetVisibility,
  Widget,
} from "@/store/slices/widgetsSlice";

export const useWidgetsManager = () => {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    widget: Widget | null;
  }>({
    isOpen: false,
    widget: null,
  });

  // Filter widgets by visibility
  const { hiddenWidgets, visibleWidgets } = useMemo(() => {
    const hidden = widgets.filter((widget) => !widget.isVisible);
    const visible = widgets.filter((widget) => widget.isVisible);
    return { hiddenWidgets: hidden, visibleWidgets: visible };
  }, [widgets]);

  // Handle deleting a single widget
  const handleDeleteWidget = (id: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      setDeleteDialog({
        isOpen: true,
        widget,
      });
    }
  };

  // Handle confirming widget deletion
  const handleConfirmDeleteWidget = () => {
    if (deleteDialog.widget) {
      dispatch(deleteWidget(deleteDialog.widget.id));
      setDeleteDialog({
        isOpen: false,
        widget: null,
      });
    }
  };

  // Handle closing delete dialog
  const handleCloseDeleteDialog = (open: boolean) => {
    if (!open) {
      setDeleteDialog({
        isOpen: false,
        widget: null,
      });
    }
  };

  // Handle toggling widget visibility
  const handleToggleVisibility = (id: string) => {
    dispatch(toggleWidgetVisibility(id));
  };

  // Handle showing all hidden widgets
  const handleShowAllHidden = () => {
    hiddenWidgets.forEach((widget) => {
      dispatch(toggleWidgetVisibility(widget.id));
    });
  };

  // Handle deleting all hidden widgets
  const handleDeleteAllHidden = () => {
    if (
      confirm(
        `Are you sure you want to delete all ${hiddenWidgets.length} hidden widgets? This action cannot be undone.`
      )
    ) {
      hiddenWidgets.forEach((widget) => {
        dispatch(deleteWidget(widget.id));
      });
    }
  };

  return {
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
  };
};
