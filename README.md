# 📊 Finance Dashboard - Indian Stock Market

A sophisticated, full-featured financial dashboard built with Next.js 15, designed specifically for the Indian stock market. Features real-time NSE data visualization, intelligent caching, and a modular architecture optimized for Indian trading hours and INR currency.

## 🌟 Key Features

### �🇳 **Indian Stock Market Specialized**

- **NSE Integration**: Built exclusively for National Stock Exchange (NSE) data
- **Popular Indian Stocks**: RELIANCE, TCS, HDFCBANK, INFY, HINDUNILVR, ICICIBANK, and more
- **INR Currency Support**: All prices displayed in Indian Rupees (₹)
- **Indian Market Hours**: Optimized for NSE trading sessions
- **Yahoo Finance Backend**: Reliable data source for Indian equities

### �🎛️ **Dynamic Widget System**

- **Drag & Drop Interface**: Reorder widgets with smooth animations using `@dnd-kit`
- **Multiple Widget Types**:
  - 📈 **Stock Chart Widgets**: Interactive line charts with multiple time intervals
  - 📊 **Finance Table Widgets**: Paginated stock tables with search functionality
  - 💼 **Comprehensive Finance Cards**: All-in-one financial data views
- **Widget Management**: Create, configure, hide/show, and delete widgets dynamically
- **Persistent State**: Widget configurations saved across sessions

### ⚡ **Advanced Caching System**

- **Multi-Layer Caching**:
  - Browser-level caching with expiration policies
  - React Query for server state management
  - Custom client-side cache manager
- **Smart Cache Invalidation**: Automatic cache updates based on data freshness
- **Cache Statistics**: Monitor cache hit rates and performance
- **Offline Support**: Graceful degradation when APIs are unavailable

### 🔄 **Real-Time Data Updates**

- **Auto-Refresh**: Configurable refresh intervals per widget (15s to 5min)
- **Smart Polling**: Only active widgets consume API calls
- **Background Updates**: Data refreshes without UI disruption
- **Manual Refresh**: Force refresh individual widgets or entire dashboard

### 🎨 **Modern UI/UX**

- **Dark/Light Mode**: System-aware theme switching with next-themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: CSS animations and transitions throughout
- **Component Library**: Custom UI components built on Radix UI primitives

## 🏗️ **Architecture & Technical Excellence**

### 📁 **Clean Folder Structure**

```
src/
├── components/
│   ├── api-keys/          # API key management components
│   ├── charts/            # Chart and visualization components
│   ├── icons/             # SVG icons and graphics
│   ├── layout/            # Navigation and layout components
│   ├── providers/         # Context providers (Theme, Redux, Query)
│   ├── ui/                # Reusable UI primitives
│   └── widgets/           # Widget-specific components
├── lib/
│   ├── api/               # API service layer
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic services
│   └── utils.ts           # Utility functions
├── store/
│   ├── slices/            # Redux state slices
│   ├── hooks.ts           # Typed Redux hooks
│   └── store.ts           # Store configuration
└── types/                 # TypeScript type definitions
```

### 🪝 **Custom Hooks Ecosystem**

#### **Data Management Hooks**

- `useFinanceQueries` - Centralized API state management with React Query
- `useCachedStockData` - Custom caching with automatic refresh
- `useFinanceTableWidget` - Table widget state and pagination logic
- `useComprehensiveFinanceCard` - Multi-tab financial data management

#### **UI State Hooks**

- `useWidgetsManager` - Widget CRUD operations and state
- `useApiKeys` - API key management and validation
- `useNewWidgetDialog` - Form state for widget creation
- `useAutoRefresh` - Configurable auto-refresh logic

### 🗄️ **State Management**

- **Redux Toolkit**: Efficient state updates with Immer integration
- **Redux Persist**: Automatic state persistence to localStorage
- **Typed Hooks**: Fully typed useAppSelector and useAppDispatch
- **Slice-Based Architecture**: Modular state management by feature

### 📡 **API Integration**

- **Indian Stock Market Focus**: 
  - **Built exclusively for NSE India**: Works with National Stock Exchange (NSE) listed companies
  - **Yahoo Finance API Integration**: Reliable data source for Indian stocks (.NS suffix)
  - **Popular Indian stocks**: RELIANCE, TCS, HDFCBANK, INFY, HINDUNILVR, ICICIBANK, KOTAKBANK, and more
  - **INR currency formatting**: All prices displayed in Indian Rupees (₹)
  - **Indian market hours awareness**: Data updates aligned with NSE trading hours
- **No External API Keys Required**: Works out-of-the-box with built-in Indian stock data
- **React Query**: Server state management with automatic background updates
- **Error Boundaries**: Graceful error handling and recovery
- **Retry Logic**: Exponential backoff for failed requests

**Note**: This application is specifically designed and optimized for the Indian stock market using NSE data through Yahoo Finance API.

### 🎯 **Performance Optimizations**

#### **Code Splitting & Lazy Loading**

- **Dynamic Imports**: Components loaded only when needed using Next.js `dynamic()`
- **Chart Components**: `recharts` library (~500KB) loaded only for chart widgets
- **Dialog Components**: Modal dialogs lazy loaded on user interaction
- **Drag & Drop**: DnD Kit (~300KB) loaded only when multiple widgets exist
- **Widget Components**: Each widget type loaded independently based on usage
- **Progressive Enhancement**: App works with minimal JS, enhances as features load

#### **Lazy Loading Strategy**


#### **Caching Strategies**

- **Stale-While-Revalidate**: Show cached data while fetching fresh data
- **Background Refresh**: Update cache without blocking UI
- **TTL Management**: Automatic cache expiration and cleanup

## 🛠️ **Technology Stack**

### **Frontend Core**

- **Next.js 15.5.2** - React framework with App Router
- **TypeScript 5** - Full type safety throughout the application
- **Tailwind CSS 4** - Utility-first styling with custom design system

### **State Management**

- **@reduxjs/toolkit 2.9.0** - Modern Redux with RTK Query
- **react-redux 9.2.0** - React bindings for Redux
- **redux-persist 6.0.0** - Persist store to localStorage

### **Data Fetching & Caching**

- **@tanstack/react-query 5.86.0** - Powerful data synchronization
- **@tanstack/react-query-persist-client** - Persist query cache
- **@tanstack/react-query-devtools** - Development tools

### **UI Components & Styling**

- **@radix-ui/react-\*** - Accessible, unstyled UI primitives
- **lucide-react 0.542.0** - Beautiful SVG icon library
- **next-themes 0.4.6** - Theme management

### **Charts & Visualizations**

- **recharts 3.1.2** - Composable charting library built on D3
- **Custom Chart Components** - Tailored financial visualizations

### **Drag & Drop**

- **@dnd-kit/core 6.3.1** - Modern drag and drop toolkit
- **@dnd-kit/sortable 10.0.0** - Sortable list implementations
- **@dnd-kit/utilities 3.2.2** - Utility functions for drag and drop

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+
- npm or yarn or pnpm

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Harsh2563/grow-assignment.git
cd grow-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Setup**

Create a `.env.local` file:

```env
# Optional: Add any API keys or configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Available Scripts**

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📋 **Usage Guide**

### **Setting Up API Keys**

1. Navigate to Settings page
2. Click "Add New API Key"
3. **For Indian Stock Market (Primary)**:
   - Select "NSE India" provider
   - Enter any dummy API key (the app uses Yahoo Finance for NSE data)
   - Give it a descriptive name like "NSE India Data"
4. Test the connection

**Important Note**: This application is built specifically for Indian stock market data and works primarily with NSE-listed companies. The API key setup is available for extensibility but the core functionality works with built-in Indian stock data through Yahoo Finance.

### **Creating Widgets**

1. Click the "Add Widget" button
2. Choose widget type:
   - **Table**: Stock watchlist with search and pagination
   - **Chart**: Interactive price charts with multiple timeframes
   - **Card**: Comprehensive financial data view
3. Configure the widget settings
4. Select an API key
5. Set refresh interval (15s - 5min)

### **Widget Management**

- **Drag & Drop**: Click and drag widgets to reorder
- **Configure**: Click the settings icon to modify widget parameters
- **Hide/Show**: Toggle widget visibility without deleting
- **Delete**: Remove widgets permanently

### **Advanced Features**

- **Search Stocks**: Use the search functionality in table widgets
- **Time Intervals**: Switch between daily, weekly, and monthly chart views
- **Market Data**: View gainers, losers, and market performance
- **Caching**: Data is intelligently cached for optimal performance

## 🔧 **Advanced Techniques Used**

### **Code Splitting & Lazy Loading Implementation**

#### **Component-Level Code Splitting**

#### **Bundle Size Optimization Results**

- **Initial Bundle**: Reduced by ~60% with lazy loading
- **Chart Library**: 500KB+ recharts loaded only for chart widgets
- **Drag & Drop**: 300KB+ @dnd-kit loaded only for multiple widgets
- **Dialogs**: Modal components loaded on user interaction
- **Progressive Loading**: Users see content immediately, features enhance over time

#### **Smart Loading Strategies**

- **Route-Based Splitting**: Different pages load different component sets
- **Feature-Based Splitting**: Components grouped by functionality
- **User Interaction Splitting**: Heavy features load on first use
- **Conditional Loading**: Features load based on data availability

### **Custom Hook Patterns**

### **Intelligent Caching Strategy**

### **Performance Monitoring**

### **Error Boundary Implementation**

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 **Support**

For support, email raiharsh030@gmail.com or create an issue in the repository.

## ⚠️ **Important Notes**

- **Single API Focus**: This application is built and tested specifically for Indian stock market data using NSE listings
- **Primary Data Source**: Yahoo Finance API for Indian equities (symbols with .NS suffix)
- **Market Specialization**: Optimized for Indian trading hours, INR currency, and NSE-listed companies
- **No External Keys Required**: Core functionality works without external API subscriptions

---

**Built with ❤️ by [Harsh Rai](https://github.com/Harsh2563)**

_A modern, performant, and scalable financial dashboard specialized for the Indian stock market, showcasing advanced React patterns, intelligent caching strategies, and exceptional user experience design._
