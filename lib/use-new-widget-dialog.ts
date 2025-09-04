import { useState } from "react";
import { useApiKeys } from "@/lib/use-api-keys";
import { useAppDispatch } from "@/store/hooks";
import { addWidget } from "@/store/slices/widgetsSlice";

export const useNewWidgetDialog = () => {
  const dispatch = useAppDispatch();
  const { apiKeys, addApiKey } = useApiKeys();

  // Dialog states
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  // Widget form states
  const [widgetName, setWidgetName] = useState("");
  const [widgetType, setWidgetType] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [chartType, setChartType] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("60");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);

  // API key form states
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState("");

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // Reset widget form
  const resetWidgetForm = () => {
    setWidgetName("");
    setWidgetType("");
    setStockSymbol("");
    setChartType("");
    setRefreshInterval("60");
    setSelectedApiKeyId(null);
    setErrorMessage("");
  };

  // Reset API key form
  const resetApiKeyForm = () => {
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyProvider("");
    setErrorMessage("");
  };

  // Validate widget form
  const validateWidgetForm = () => {
    if (!widgetName.trim()) {
      setErrorMessage("Widget name is required");
      return false;
    }

    if (!widgetType) {
      setErrorMessage("Please select a widget type");
      return false;
    }

    if (widgetType !== "table" && !stockSymbol.trim()) {
      setErrorMessage("Stock symbol is required");
      return false;
    }

    if (!selectedApiKeyId) {
      setErrorMessage("Please select an API key");
      return false;
    }

    return true;
  };

  // Handle adding widget
  const handleAddWidget = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateWidgetForm()) {
      return;
    }

    // Create widget and save to Redux store
    const newWidget = {
      name: widgetName,
      type: widgetType as "table" | "card" | "chart",
      stockSymbol: widgetType === "table" ? "" : stockSymbol, // Empty for table widgets
      chartType: widgetType === "chart" ? (chartType as "line") : undefined,
      cardType: widgetType === "card" ? ("comprehensive" as const) : undefined,
      refreshInterval: parseInt(refreshInterval),
      apiKeyId: selectedApiKeyId!, // We know this is not null due to validation
      isVisible: true,
    };

    // Dispatch to Redux store
    dispatch(addWidget(newWidget));

    // Reset form and close dialog
    resetWidgetForm();
    setIsWidgetDialogOpen(false);
  };

  // Handle switching from widget dialog to API key dialog
  const handleAddNewKeyFromWidget = () => {
    setIsWidgetDialogOpen(false);
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
      const newlyAddedKey = apiKeys.find(key => key.name === newKeyName);
      if (newlyAddedKey) {
        setSelectedApiKeyId(newlyAddedKey.id);
      }
    }, 100);

    resetApiKeyForm();
    setIsApiKeyDialogOpen(false);
    setIsWidgetDialogOpen(true);
  };

  // Handle canceling API key addition
  const handleCancelAddKey = () => {
    resetApiKeyForm();
    setIsApiKeyDialogOpen(false);
    setIsWidgetDialogOpen(true);
  };

  // Handle API key dialog close
  const handleApiKeyDialogChange = (open: boolean) => {
    if (!open) {
      setIsApiKeyDialogOpen(false);
      setIsWidgetDialogOpen(true);
    }
  };

  // Get selected API key object
  const selectedApiKey = apiKeys.find((key) => key.id === selectedApiKeyId);

  return {
    // States
    isWidgetDialogOpen,
    setIsWidgetDialogOpen,
    isApiKeyDialogOpen,
    widgetName,
    setWidgetName,
    widgetType,
    setWidgetType,
    stockSymbol,
    setStockSymbol,
    chartType,
    setChartType,
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

    // Handlers
    handleAddWidget,
    handleAddNewKeyFromWidget,
    handleAddNewKey,
    handleCancelAddKey,
    handleApiKeyDialogChange,
  };
};
