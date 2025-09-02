"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WidgetFormFieldsProps {
  widgetName: string;
  apiUrl: string;
  refreshInterval: string;
  onWidgetNameChange: (value: string) => void;
  onApiUrlChange: (value: string) => void;
  onRefreshIntervalChange: (value: string) => void;
}

export const WidgetFormFields = ({
  widgetName,
  apiUrl,
  refreshInterval,
  onWidgetNameChange,
  onApiUrlChange,
  onRefreshIntervalChange,
}: WidgetFormFieldsProps) => {
  return (
    <>
      <div className="grid gap-3">
        <Label htmlFor="widget-name">Widget Name</Label>
        <Input
          id="widget-name"
          name="widget-name"
          value={widgetName}
          onChange={(e) => onWidgetNameChange(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
        <Input
          id="refresh-interval"
          type="number"
          name="widget-refresh-interval"
          value={refreshInterval}
          onChange={(e) => onRefreshIntervalChange(e.target.value)}
          required
          min="1"
        />
      </div>
    </>
  );
};
