import { useState, useEffect } from "react";
import { useApiKeys } from "@/lib/hooks/use-api-keys";
import { useAppDispatch } from "@/store/hooks";
import { updateWidget, Widget } from "@/store/slices/widgetsSlice";

export const useWidgetConfigurationDialog = (
  widget: Widget | null,
  isOpen: boolean
) => {
  const dispatch = useAppDispatch();
  const { apiKeys, addApiKey } = useApiKeys();

  // Dialog states
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  // Form states
  const [widgetName, setWidgetName] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);

  // API key form states
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("");

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize form values when widget changes or dialog opens
  useEffect(() => {
    if (widget && isOpen) {
      setWidgetName(widget.name);
      setRefreshInterval(widget.refreshInterval.toString());
      setSelectedApiKeyId(widget.apiKeyId);
      setErrorMessage("");
    }
  }, [widget, isOpen]);

  // Reset API key form
  const resetApiKeyForm = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyProvider("");
    setErrorMessage("");
  };

  // Validate form
  const validateForm = () => {
    if (!widgetName.trim()) {
      setErrorMessage("Widget name is required");
      return false;
    }

    if (!selectedApiKeyId) {
      setErrorMessage("Please select an API key");
      return false;
    }

    const intervalValue = parseInt(refreshInterval);
    if (isNaN(intervalValue) || intervalValue < 1) {
      setErrorMessage("Refresh interval must be a positive number");
      return false;
    }

    return true;
  };

  // Handle updating widget
  const handleUpdateWidget = (
    e: React.FormEvent,
    onOpenChange: (open: boolean) => void
  ) => {
    e.preventDefault();

    if (!widget || !validateForm()) {
      return;
    }

    // Update widget
    dispatch(
      updateWidget({
        id: widget.id,
        updates: {
          name: widgetName,
          refreshInterval: parseInt(refreshInterval),
          apiKeyId: selectedApiKeyId!,
        },
      })
    );

    setErrorMessage("");
    onOpenChange(false);
  };

  // Handle switching to API key dialog
  const handleAddNewKeyFromWidget = () => {
    setIsApiKeyDialogOpen(true);
  };

  // Handle adding new API key
  const handleAddNewKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      setErrorMessage("Both name and value are required");
      return;
    }

    addApiKey(newKeyName, newKeyValue);

    // Find the newly added key by name
    setTimeout(() => {
      const newlyAddedKey = apiKeys.find((key) => key.name === newKeyName);
      if (newlyAddedKey) {
        setSelectedApiKeyId(newlyAddedKey.id);
      }
    }, 100);

    resetApiKeyForm();
    setIsApiKeyDialogOpen(false);
  };

  // Handle canceling API key addition
  const handleCancelAddKey = () => {
    resetApiKeyForm();
    setIsApiKeyDialogOpen(false);
  };

  // Handle API key dialog close
  const handleApiKeyDialogChange = (open: boolean) => {
    if (!open) {
      setIsApiKeyDialogOpen(false);
    }
  };

  // Get selected API key object
  const selectedApiKey = apiKeys.find((key) => key.id === selectedApiKeyId);

  const refreshIntervalOptions = [
    { value: "30", label: "30 seconds" },
    { value: "60", label: "1 minute" },
    { value: "300", label: "5 minutes" },
    { value: "600", label: "10 minutes" },
    { value: "1800", label: "30 minutes" },
    { value: "3600", label: "1 hour" },
  ];

  return {
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
  };
};
