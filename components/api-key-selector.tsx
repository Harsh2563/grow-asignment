"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus as PlusIcon,
  Key as KeyIcon,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

interface ApiKeySelectorProps {
  apiKeys: ApiKey[];
  selectedApiKey: ApiKey | undefined;
  onSelectApiKey: (id: string) => void;
  onAddNewClick: () => void;
}

export const ApiKeySelector = ({
  apiKeys,
  selectedApiKey,
  onSelectApiKey,
  onAddNewClick,
}: ApiKeySelectorProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedApiKey ? (
              <span>{selectedApiKey.name}</span>
            ) : (
              <span className="text-muted-foreground">Select an API key</span>
            )}
            <ChevronDownIcon className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Your API Keys</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {apiKeys.length > 0 ? (
            apiKeys.map((key) => (
              <DropdownMenuItem
                key={key.id}
                onClick={() => onSelectApiKey(key.id)}
              >
                <KeyIcon className="h-4 w-4 mr-2" />
                <span>{key.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No API keys available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="button" variant="outline" onClick={onAddNewClick}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </>
  );
};
