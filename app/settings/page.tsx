"use client";

import { ApiKeysManagerComponent } from "@/components/api-keys-manager-component";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <ApiKeysManagerComponent />
        </div>
      </main>
    </div>
  );
}
