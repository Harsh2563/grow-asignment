"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface NewApiKeyFormProps {
  keyName: string;
  keyValue: string;
  provider: string;
  isLoading?: boolean;
  onKeyNameChange: (value: string) => void;
  onKeyValueChange: (value: string) => void;
  onProviderChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const NewApiKeyForm = ({
  keyName,
  keyValue,
  provider,
  isLoading = false,
  onKeyNameChange,
  onKeyValueChange,
  onProviderChange,
  onCancel,
  onSave,
}: NewApiKeyFormProps) => {
  return (
    <div className="grid gap-4 w-full">
      <div className="grid gap-2">
        <Label htmlFor="provider">Provider</Label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a provider</option>
          <option value="alphavantage">Alpha Vantage</option>
          <option value="twelvedata">Twelve Data</option>
          <option value="finnhub">Finnhub</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-key-name">API Key Name</Label>
        <Input
          id="new-key-name"
          value={keyName}
          onChange={(e) => onKeyNameChange(e.target.value)}
          placeholder="e.g., Alpha Vantage API Key"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-key-value">API Key Value</Label>
        <Input
          id="new-key-value"
          type="password"
          value={keyValue}
          onChange={(e) => onKeyValueChange(e.target.value)}
          placeholder="Enter the API key"
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={
            isLoading || !keyName.trim() || !keyValue.trim() || !provider
          }
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Testing Key..." : "Save Key"}
        </Button>
      </div>
    </div>
  );
};
