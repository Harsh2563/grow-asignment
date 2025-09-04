import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  deleteWidget,
  toggleWidgetVisibility,
} from "@/store/slices/widgetsSlice";

export const useWidgetsManager = () => {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const [isOpen, setIsOpen] = useState(false);

  // Filter widgets by visibility
  const { hiddenWidgets, visibleWidgets } = useMemo(() => {
    const hidden = widgets.filter((widget) => !widget.isVisible);
    const visible = widgets.filter((widget) => widget.isVisible);
    return { hiddenWidgets: hidden, visibleWidgets: visible };
  }, [widgets]);

  // Handle deleting a single widget
  const handleDeleteWidget = (id: string) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      dispatch(deleteWidget(id));
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

    // Handlers
    handleDeleteWidget,
    handleToggleVisibility,
    handleShowAllHidden,
    handleDeleteAllHidden,
  };
};
