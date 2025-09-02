"use client";
import InitialBackground from "@/components/empty-dashboard";
import { ConditionalRenderer } from "@/ConditionalRenderer/ConditionalRenderer";
import { useState } from "react";

export default function Home() {
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <ConditionalRenderer
          isVisible={isEmpty}
        >
          <InitialBackground />
        </ConditionalRenderer>
      </main>
    </div>
  );
}
