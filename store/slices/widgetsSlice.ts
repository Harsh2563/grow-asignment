import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Widget {
  id: string;
  name: string;
  type: "table" | "card" | "chart";
  stockSymbol: string;
  chartType?: "line" | "candlestick";
  cardType?: "watchlist" | "gainers" | "performance" | "financial";
  refreshInterval: number;
  apiKeyId: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WidgetsState {
  widgets: Widget[];
  selectedWidgetId: string | null;
}

const initialState: WidgetsState = {
  widgets: [],
  selectedWidgetId: null,
};

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (
      state,
      action: PayloadAction<Omit<Widget, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newWidget: Widget = {
        ...action.payload,
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.widgets.push(newWidget);
    },

    updateWidget: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Widget> }>
    ) => {
      const { id, updates } = action.payload;
      const widgetIndex = state.widgets.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        state.widgets[widgetIndex] = {
          ...state.widgets[widgetIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      if (state.selectedWidgetId === action.payload) {
        state.selectedWidgetId = null;
      }
    },

    toggleWidgetVisibility: (state, action: PayloadAction<string>) => {
      const widget = state.widgets.find((w) => w.id === action.payload);
      if (widget) {
        widget.isVisible = !widget.isVisible;
        widget.updatedAt = new Date().toISOString();
      }
    },

    selectWidget: (state, action: PayloadAction<string | null>) => {
      state.selectedWidgetId = action.payload;
    },
  },
});

export const {
  addWidget,
  updateWidget,
  deleteWidget,
  toggleWidgetVisibility,
  selectWidget,
} = widgetsSlice.actions;

export default widgetsSlice.reducer;
