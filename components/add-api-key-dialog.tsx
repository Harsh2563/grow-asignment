"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewApiKeyForm } from "@/components/new-api-key-form";

interface AddApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string;
  keyValue: string;
  errorMessage: string;
  onKeyNameChange: (value: string) => void;
  onKeyValueChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  triggerButton?: React.ReactNode;
}

export const AddApiKeyDialog = ({
  isOpen,
  onOpenChange,
  keyName,
  keyValue,
  errorMessage,
  onKeyNameChange,
  onKeyValueChange,
  onSubmit,
  onCancel,
  triggerButton,
}: AddApiKeyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            Enter a name and value for your API key. The key will be stored
            securely in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <NewApiKeyForm
            keyName={keyName}
            keyValue={keyValue}
            onKeyNameChange={onKeyNameChange}
            onKeyValueChange={onKeyValueChange}
            onCancel={onCancel}
            onSave={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
