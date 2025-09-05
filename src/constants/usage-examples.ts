/**
 * Constants Usage Example and Summary
 * 
 * This file demonstrates how the constants are being used throughout the application
 * and provides a summary of all the hardcoded strings that have been replaced.
 */

import { STRINGS } from './strings';

// Example usage of constants in components:

/*
1. API Keys Components:
   - API_KEYS.TITLE: "API Keys"
   - API_KEYS.ADD_API_KEY: "Add API Key"
   - API_KEYS.NAME_REQUIRED: "API Key name is required"
   - API_KEYS.VALUE_REQUIRED: "API Key value is required"
   - API_KEYS.DELETE_CONFIRM: "Are you sure you want to delete this API key?"

2. Widget Components:
   - WIDGETS.ADD_WIDGET: "Add Widget"
   - WIDGETS.DELETE_WIDGET: "Delete Widget"
   - WIDGETS.PLACEHOLDER_WIDGET_NAME: "Enter widget name"
   - WIDGETS.ADD_DESCRIPTION: "Create a new financial widget..."

3. Navigation:
   - NAVIGATION.DASHBOARD: "Dashboard"
   - NAVIGATION.SETTINGS: "Settings"
   - NAVIGATION.TOGGLE_MENU: "Toggle menu"

4. Dashboard:
   - DASHBOARD.EMPTY_TITLE: "Build your own dashboard"
   - DASHBOARD.EMPTY_DESCRIPTION: "Create custom widgets for watchlists..."

5. Loading States:
   - LOADING.TABLE_WIDGET: "Loading table widget..."
   - LOADING.CHART: "Loading chart..."
   - LOADING.DEFAULT: "Loading..."

6. Common UI:
   - UI.CANCEL: "Cancel"
   - UI.RETRY: "Retry"
   - UI.SAVE: "Save"
   - UI.DELETE: "Delete"

7. Stock Chart:
   - STOCK_CHART.PRICE_CHART: "Price Chart"
   - STOCK_CHART.INTERVAL: "Interval"
   - STOCK_CHART.DAILY: "Daily"
   - STOCK_CHART.WEEKLY: "Weekly"
   - STOCK_CHART.MONTHLY: "Monthly"

8. Finance Card:
   - FINANCE_CARD.OVERVIEW: "Overview"
   - FINANCE_CARD.GAINERS: "Gainers"
   - FINANCE_CARD.LOSERS: "Losers"

Files Updated with Constants:
=============================
✓ src/components/api-keys/api-keys-manager-component.tsx
✓ src/components/api-keys/empty-api-keys-state.tsx
✓ src/components/api-keys/add-api-key-dialog.tsx
✓ src/components/api-keys/new-api-key-form.tsx
✓ src/components/layout/navbar.tsx
✓ src/components/layout/empty-dashboard.tsx
✓ src/components/widgets/new-widget-dialog.tsx
✓ src/components/widgets/delete-widget-dialog.tsx
✓ src/components/widgets/widgets-list.tsx (partially)
✓ src/components/charts/stock-chart-widget.tsx (partially)
✓ src/components/widgets/comprehensive-finance-card.tsx (partially)
✓ src/lib/api/finance-api.ts (stock symbols)

Benefits of Using Constants:
============================
1. Centralized string management
2. Easier internationalization (i18n) support in future
3. Consistent text across the application
4. Easier to maintain and update strings
5. Type safety with TypeScript
6. Reduced risk of typos
7. Better search and replace capabilities
8. Consistent naming conventions

Future Improvements:
===================
1. Complete migration of all hardcoded strings
2. Add internationalization support
3. Create themed string variations
4. Add validation for required strings
5. Create tools for string extraction and verification
*/

export const USAGE_EXAMPLES = {
  // Example component using constants
  BUTTON_COMPONENT: `
    import { UI } from '@/constants';
    
    <Button onClick={handleSave}>
      {UI.SAVE}
    </Button>
  `,
  
  // Example dialog using constants
  DIALOG_COMPONENT: `
    import { WIDGETS, UI } from '@/constants';
    
    <DialogTitle>{WIDGETS.DELETE_WIDGET}</DialogTitle>
    <DialogDescription>{WIDGETS.DELETE_DESCRIPTION}</DialogDescription>
    <Button onClick={handleCancel}>{UI.CANCEL}</Button>
    <Button onClick={handleDelete}>{UI.DELETE}</Button>
  `,
  
  // Example loading state using constants
  LOADING_COMPONENT: `
    import { LOADING } from '@/constants';
    
    {loading && <div>{LOADING.TABLE_WIDGET}</div>}
  `,
} as const;

export default STRINGS;
