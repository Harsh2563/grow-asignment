/**
 * Application String Constants
 * Centralizes all hardcoded strings used throughout the application
 */

export const STRINGS = {
  // Application Title & Branding
  APP_TITLE: "Groww Finance Dashboard",
  
  // Navigation
  NAVIGATION: {
    DASHBOARD: "Dashboard",
    SETTINGS: "Settings",
    TOGGLE_MENU: "Toggle menu",
    NAVIGATION: "Navigation",
  },

  // Dashboard & Layout
  DASHBOARD: {
    EMPTY_TITLE: "Build your own dashboard",
    EMPTY_DESCRIPTION: "Create custom widgets for watchlists, gainers, and price charts. Rearrange them the way you like and personalize your finance view.",
  },

  // Widget Types
  WIDGET_TYPES: {
    CARD: "Finance Card",
    TABLE: "Stock Table",
    CHART: "Stock Chart",
  },

  // Common UI Labels
  UI: {
    ADD: "Add",
    EDIT: "Edit",
    DELETE: "Delete",
    SAVE: "Save",
    CANCEL: "Cancel",
    CLOSE: "Close",
    RETRY: "Retry",
    LOADING: "Loading",
    ERROR: "Error",
    SUCCESS: "Success",
    YES: "Yes",
    NO: "No",
    OK: "OK",
    CONTINUE: "Continue",
    BACK: "Back",
    NEXT: "Next",
    PREVIOUS: "Previous",
    REFRESH: "Refresh",
    SEARCH: "Search",
    FILTER: "Filter",
    CLEAR: "Clear",
    SELECT: "Select",
    CHOOSE: "Choose",
    BROWSE: "Browse",
    UPLOAD: "Upload",
    DOWNLOAD: "Download",
    EXPORT: "Export",
    IMPORT: "Import",
    UPDATED: "Updated",
  },

  // Loading States
  LOADING: {
    WIDGET: "Loading...",
    TABLE_WIDGET: "Loading table widget...",
    CHART: "Loading chart...",
    TESTING_KEY: "Testing Key...",
    DEFAULT: "Loading...",
    DIALOG: "Loading dialog...",
  },

  // API Keys
  API_KEYS: {
    TITLE: "API Keys",
    ADD_API_KEY: "Add API Key",
    ADD_NEW_API_KEY: "Add New API Key",
    API_KEY_NAME: "API Key Name",
    API_KEY_VALUE: "API Key Value",
    PROVIDER: "Provider",
    NSE_INDIA: "NSE India",
    SAVE_KEY: "Save Key",
    TESTING_KEY: "Testing Key...",
    
    // Placeholders
    PLACEHOLDER_NAME: "e.g., NSE India API Key",
    PLACEHOLDER_VALUE: "Enter the API key",
    
    // Empty State
    EMPTY_TITLE: "No API Keys Added",
    EMPTY_DESCRIPTION: "Add your first API key to get started",
    
    // Validation Messages
    NAME_REQUIRED: "API Key name is required",
    VALUE_REQUIRED: "API Key value is required",
    NAME_EXISTS: "An API Key with this name already exists",
    VALIDATION_FAILED: "API Key validation failed",
    DEFAULT_VALIDATION_ERROR: "The API key is not working properly",
    CONNECTION_ERROR: "Failed to test API key. Please check your internet connection and try again.",
    
    // Confirmation Messages
    DELETE_CONFIRM: "Are you sure you want to delete this API key?",
    
    // Dialog Descriptions
    ADD_DESCRIPTION: "Enter a name and value for your API key. The key will be tested before saving to ensure it works properly.",
  },

  // Widgets
  WIDGETS: {
    ADD_WIDGET: "Add Widget",
    ADD_NEW_WIDGET: "Add New Widget",
    WIDGET_NAME: "Widget Name",
    WIDGET_TYPE: "Widget Type",
    DELETE_WIDGET: "Delete Widget",
    EDIT_WIDGET: "Edit Widget",
    CONFIGURE_WIDGET: "Configure Widget",
    WIDGET: "Widget",
    TABLE_WIDGET: "Table Widget",
    FINANCE_CARD: "Finance Card",
    CHART_WIDGET: "Chart Widget",
    
    // Widget Form
    STOCK_SYMBOL: "Stock Symbol",
    CHART_TYPE: "Chart Type",
    CARD_DESCRIPTION: "Card Description",
    REFRESH_INTERVAL: "Refresh Interval",
    
    // Widget Types
    SELECT_WIDGET_TYPE: "Select widget type",
    
    // Chart Types
    SELECT_CHART_TYPE: "Select chart type",
    LINE_CHART: "Line Chart",
    CANDLESTICK: "Candlestick",
    
    // Placeholders
    PLACEHOLDER_WIDGET_NAME: "Enter widget name",
    PLACEHOLDER_STOCK_SYMBOL: "e.g., AAPL, GOOGL, TSLA",
    PLACEHOLDER_MULTIPLE_STOCKS: "Multiple stocks will be displayed",
    
    // Descriptions
    ADD_DESCRIPTION: "Create a new financial widget to display real-time stock data on your dashboard. Choose from comprehensive finance cards, stock tables, or price charts.",
    MULTIPLE_STOCKS_DESCRIPTION: "Table widgets display multiple predefined stocks automatically",
    CHART_DESCRIPTION: "Line charts show price trends over time with optional moving averages.",
    FIXED_PROPERTIES: "Widget Properties (Fixed)",
    
    // Values for Multiple Stocks
    MULTIPLE_STOCKS_VALUE: "Multiple stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, NFLX)",
    
    // Delete Dialog
    DELETE_TITLE: "Delete Widget",
    DELETE_DESCRIPTION: "This action cannot be undone.",
    DELETE_CONFIRMATION: "Are you sure you want to delete this widget? All its data and configuration will be permanently removed from your dashboard.",
    
    // Widget Info Labels
    TYPE_LABEL: "Type",
    SYMBOL_LABEL: "Symbol",
    CREATED_LABEL: "Created",
    UPDATED_LABEL: "Hidden", // Note: This seems to be a typo in original code
  },

  // Stock Chart
  STOCK_CHART: {
    PRICE_CHART: "Price Chart",
    INTERVAL: "Interval",
    SHOW_MOVING_AVERAGES: "Show Moving Averages",
    CHART_TYPE_BADGE: "Line Chart",
    UPDATED: "Updated",
    
    // Intervals
    DAILY: "Daily",
    WEEKLY: "Weekly", 
    MONTHLY: "Monthly",
    
    // Chart Labels
    PRICE: "Price",
    MA20: "MA(20)",
    MA50: "MA(50)",
    
    // Coming Soon
    CANDLESTICK_COMING_SOON: "Candlestick chart coming soon...",
  },

  // Finance Card Tabs
  FINANCE_CARD: {
    OVERVIEW: "Overview",
    MAIN: "Main", // Mobile abbreviated version
    GAINERS: "Gainers",
    LOSERS: "Losers",
  },

  // Refresh Intervals
  REFRESH_INTERVALS: {
    "300": "5 minutes",
    "600": "10 minutes", 
    "900": "15 minutes",
    "1800": "30 minutes",
    "3600": "1 hour",
  },

  // Time Formatting
  TIME: {
    LOCALE: "en-US",
    DATE_OPTIONS: {
      MONTH_SHORT_DAY: {
        month: "short" as const,
        day: "numeric" as const,
      },
      MONTH_SHORT_YEAR: {
        month: "short" as const,
        year: "2-digit" as const,
      },
    },
  },

  // Currency
  CURRENCY: {
    SYMBOL: "$",
    FORMAT_LOCALE: "en-IN",
    CURRENCY_CODE: "INR",
  },

  // Stock Data
  STOCK: {
    // Popular Indian Companies
    POPULAR_COMPANIES: [
      "RELIANCE",
      "TCS", 
      "HDFCBANK",
      "INFY",
      "HINDUNILVR",
      "ICICIBANK",
      "KOTAKBANK",
      "LT",
      "ASIANPAINT",
      "MARUTI",
      "BHARTIARTL",
      "ITC",
      "SBIN",
      "AXISBANK",
      "BAJFINANCE",
      "WIPRO",
      "ULTRACEMCO",
      "NESTLEIND",
      "POWERGRID",
      "NTPC",
    ],
  },

  // Error Messages
  ERRORS: {
    GENERIC: "Something went wrong. Please try again.",
    NETWORK: "Network error. Please check your internet connection.",
    API_KEY_INVALID: "Invalid API key provided.",
    WIDGET_NOT_FOUND: "Widget not found.",
    DATA_FETCH_ERROR: "Failed to fetch data.",
  },

  // Success Messages
  SUCCESS: {
    WIDGET_ADDED: "Widget added successfully!",
    WIDGET_UPDATED: "Widget updated successfully!",
    WIDGET_DELETED: "Widget deleted successfully!",
    API_KEY_ADDED: "API key added successfully!",
    API_KEY_DELETED: "API key deleted successfully!",
  },

  // Form Validation
  VALIDATION: {
    REQUIRED: "This field is required",
    MIN_LENGTH: "Minimum length is {0} characters",
    MAX_LENGTH: "Maximum length is {0} characters",
    INVALID_FORMAT: "Invalid format",
    INVALID_EMAIL: "Invalid email address",
    PASSWORDS_DONT_MATCH: "Passwords don't match",
  },

  // Accessibility
  A11Y: {
    SCREEN_READER_ONLY: "sr-only",
  },
} as const;

// Type for accessing strings with proper type checking
export type StringKeys = typeof STRINGS;
