# 📊 Finance Dashboard - Advanced React Application

A sophisticated, full-featured financial dashboard built with Next.js 15, featuring real-time data visualization, intelligent caching, and a modular architecture designed for scalability and performance.

## 🌟 Key Features

### 🎛️ **Dynamic Widget System**

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

- **React Query**: Server state management with automatic background updates
- **Error Boundaries**: Graceful error handling and recovery
- **Retry Logic**: Exponential backoff for failed requests

### 🎯 **Performance Optimizations**

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
3. Choose your provider (Alpha Vantage, Finnhub, etc.)
4. Enter your API key and give it a name
5. Test the connection

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

---

**Built with ❤️ by [Harsh Rai](https://github.com/Harsh2563)**

_A modern, performant, and scalable financial dashboard showcasing advanced React patterns, intelligent caching strategies, and exceptional user experience design._
