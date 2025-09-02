"use client";

import { Button } from "@/components/ui/button";
import { Trash2 as TrashIcon } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  onDeleteApiKey: (id: string) => void;
}

export const ApiKeysList = ({ apiKeys, onDeleteApiKey }: ApiKeysListProps) => {
  const maskApiKey = (key: string): string => {
    if (key.length <= 8) {
      return "••••••••";
    }
    return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(
      key.length - 4
    )}`;
  };

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <div
          key={apiKey.id}
          className="p-4 border rounded-lg bg-card flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium">{apiKey.name}</h3>
            <div className="text-sm text-gray-400 mt-1 font-mono">
              {maskApiKey(apiKey.key)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Added: {new Date(apiKey.createdAt).toLocaleDateString()}
              {apiKey.lastUsed &&
                ` • Last used: ${new Date(
                  apiKey.lastUsed
                ).toLocaleDateString()}`}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2"
              onClick={() => {
                navigator.clipboard.writeText(apiKey.key);
                alert("API Key copied to clipboard");
              }}
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 px-2"
              onClick={() => onDeleteApiKey(apiKey.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
