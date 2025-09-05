"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Key } from "lucide-react";
import { UI } from "@/constants";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: "alpha-vantage" | "finnhub" | "polygon" | "nseindia";
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  isValid?: boolean;
  lastTested?: string;
}

interface DeleteApiKeyDialogProps {
  apiKey: ApiKey | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteApiKeyDialog: React.FC<DeleteApiKeyDialogProps> = ({
  apiKey,
  isOpen,
  onOpenChange,
  onConfirmDelete,
}) => {
  const handleDelete = () => {
    onConfirmDelete();
    onOpenChange(false);
  };


  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case "alpha-vantage":
        return "Alpha Vantage";
      case "finnhub":
        return "Finnhub";
      case "polygon":
        return "Polygon";
      case "nseindia":
        return "NSE India";
      default:
        return provider;
    }
  };

  if (!apiKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Delete API Key
              </DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone. This will permanently remove the API key from your account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Name
                </span>
                <span className="text-sm font-medium">
                  {apiKey.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Provider
                </span>
                <span className="text-sm font-medium">
                  {getProviderLabel(apiKey.provider)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Created
                </span>
                <span className="text-sm font-medium">
                  {new Date(apiKey.createdAt).toLocaleDateString()}
                </span>
              </div>
              {apiKey.lastUsed && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Used
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(apiKey.lastUsed).toLocaleDateString()}
                  </span>
                </div>
              )}

            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this API key? Any widgets or configurations using this key will stop working.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {UI.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
