"use client";

import { Button } from "@/components/ui/button";
import { Key as KeyIcon, Plus as PlusIcon } from "lucide-react";
import { API_KEYS } from "@/constants";

interface EmptyApiKeysStateProps {
  onAddApiKey: () => void;
}

export const EmptyApiKeysState = ({ onAddApiKey }: EmptyApiKeysStateProps) => {
  return (
    <div className="text-center py-8 border border-dashed border-gray-500 rounded-lg">
      <KeyIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium mb-2">{API_KEYS.EMPTY_TITLE}</h3>
      <p className="text-gray-400 mb-4">
        {API_KEYS.EMPTY_DESCRIPTION}
      </p>
      <Button
        onClick={onAddApiKey}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        <PlusIcon className="h-4 w-4 mr-1.5" /> {API_KEYS.ADD_API_KEY}
      </Button>
    </div>
  );
};
