"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewApiKeyFormProps {
  keyName: string;
  keyValue: string;
  onKeyNameChange: (value: string) => void;
  onKeyValueChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const NewApiKeyForm = ({
  keyName,
  keyValue,
  onKeyNameChange,
  onKeyValueChange,
  onCancel,
  onSave,
}: NewApiKeyFormProps) => {
  return (
    <div className="grid gap-4 w-full">
      <div className="grid gap-2">
        <Label htmlFor="new-key-name">API Key Name</Label>
        <Input
          id="new-key-name"
          value={keyName}
          onChange={(e) => onKeyNameChange(e.target.value)}
          placeholder="e.g., Alpha Vantage API Key"
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
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save Key
        </Button>
      </div>
    </div>
  );
};
