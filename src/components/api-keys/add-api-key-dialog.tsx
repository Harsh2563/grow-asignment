"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewApiKeyForm } from "@/components/api-keys/new-api-key-form";
import { API_KEYS } from "@/constants";

interface AddApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string;
  keyValue: string;
  provider: string;
  errorMessage: string;
  isLoading?: boolean;
  onKeyNameChange: (value: string) => void;
  onKeyValueChange: (value: string) => void;
  onProviderChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  triggerButton?: React.ReactNode;
}

export const AddApiKeyDialog = ({
  isOpen,
  onOpenChange,
  keyName,
  keyValue,
  provider,
  errorMessage,
  isLoading = false,
  onKeyNameChange,
  onKeyValueChange,
  onProviderChange,
  onSubmit,
  onCancel,
  triggerButton,
}: AddApiKeyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{API_KEYS.ADD_NEW_API_KEY}</DialogTitle>
          <DialogDescription>
            {API_KEYS.ADD_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <NewApiKeyForm
            keyName={keyName}
            keyValue={keyValue}
            provider={provider}
            isLoading={isLoading}
            onKeyNameChange={onKeyNameChange}
            onKeyValueChange={onKeyValueChange}
            onProviderChange={onProviderChange}
            onCancel={onCancel}
            onSave={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
