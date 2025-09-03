"use client";
import InitialBackground from "@/components/empty-dashboard";
import { ConditionalRenderer } from "@/ConditionalRenderer/ConditionalRenderer";
import { WidgetsList } from "@/components/widgets-list";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const widgets = useAppSelector((state) => state.widgets.widgets);
  const isEmpty = widgets.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="relative">
        <ConditionalRenderer isVisible={isEmpty}>
          <InitialBackground />
        </ConditionalRenderer>

        <ConditionalRenderer isVisible={!isEmpty}>
          <div className="container mx-auto px-4 py-8">
            <WidgetsList />
          </div>
        </ConditionalRenderer>
      </main>
    </div>
  );
}
