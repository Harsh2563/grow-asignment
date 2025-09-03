"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  deleteWidget,
  toggleWidgetVisibility,
} from "@/store/slices/widgetsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  BarChart3,
  Table,
} from "lucide-react";
import { ConditionalRenderer } from "@/ConditionalRenderer/ConditionalRenderer";
import { FinanceTableWidget } from "@/components/finance-table-widget";

const getWidgetIcon = (type: string) => {
  switch (type) {
    case "chart":
      return <TrendingUp className="h-4 w-4" />;
    case "table":
      return <Table className="h-4 w-4" />;
    case "card":
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <BarChart3 className="h-4 w-4" />;
  }
};

const getWidgetTypeDisplay = (type: string) => {
  switch (type) {
    case "chart":
      return "Chart Widget";
    case "table":
      return "Table Widget";
    case "card":
      return "Card Widget";
    default:
      return "Widget";
  }
};

export const WidgetsList = () => {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.widgets.widgets);

  const handleDeleteWidget = (id: string) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      dispatch(deleteWidget(id));
    }
  };

  const handleToggleVisibility = (id: string) => {
    dispatch(toggleWidgetVisibility(id));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Your Widgets</h2>
        <p className="text-muted-foreground mt-2">
          {widgets.length} widget{widgets.length !== 1 ? "s" : ""} in your
          dashboard
        </p>
      </div>

      <ConditionalRenderer isVisible={widgets.length === 0}>
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-16 w-16 text-primary/60" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No widgets created yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start building your financial dashboard by creating your first
            widget. Track stocks, monitor performance, and stay updated with
            real-time data.
          </p>
        </div>
      </ConditionalRenderer>

      <ConditionalRenderer isVisible={widgets.length > 0}>
        <div className="space-y-6">
          {widgets
            .filter((widget) => widget.type === "table")
            .map((widget) => (
              <div key={widget.id} className="relative group">
                <FinanceTableWidget widget={widget} />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleVisibility(widget.id)}
                    className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border shadow-sm hover:bg-background"
                  >
                    {widget.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteWidget(widget.id)}
                    className="h-8 w-8 p-0 bg-red-500/90 backdrop-blur-sm shadow-sm hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </ConditionalRenderer>
    </div>
  );
};
