"use client";

import dynamic from "next/dynamic";

// Lazy load NewWidgetDialog since it's only opened on user interaction
const NewWidgetDialog = dynamic(
  () =>
    import("@/components/widgets/new-widget-dialog").then((mod) => ({
      default: mod.NewWidgetDialog,
    })),
  {
    loading: () => (
      <div className="inline-block">
        <div className="h-9 px-4 py-2 bg-muted animate-pulse rounded-md">
          <div className="w-20 h-4 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export { NewWidgetDialog as DynamicNewWidgetDialog };
