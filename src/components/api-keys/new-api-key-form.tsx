"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { API_KEYS, UI } from "@/constants";

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
  isLoading = false,
  onKeyNameChange,
  onKeyValueChange,
  onCancel,
  onSave,
}: NewApiKeyFormProps) => {
  return (
    <div className="grid gap-4 w-full">
      <div className="grid gap-2">
        <Label htmlFor="provider">{API_KEYS.PROVIDER}</Label>
        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background items-center">
          <span className="text-foreground">{API_KEYS.NSE_INDIA}</span>
        </div>
        <input type="hidden" value="nseindia" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-key-name">{API_KEYS.API_KEY_NAME}</Label>
        <Input
          id="new-key-name"
          value={keyName}
          onChange={(e) => onKeyNameChange(e.target.value)}
          placeholder={API_KEYS.PLACEHOLDER_NAME}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-key-value">{API_KEYS.API_KEY_VALUE}</Label>
        <Input
          id="new-key-value"
          type="password"
          value={keyValue}
          onChange={(e) => onKeyValueChange(e.target.value)}
          placeholder={API_KEYS.PLACEHOLDER_VALUE}
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
          {UI.CANCEL}
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={isLoading || !keyName.trim() || !keyValue.trim()}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? API_KEYS.TESTING_KEY : API_KEYS.SAVE_KEY}
        </Button>
      </div>
    </div>
  );
};
