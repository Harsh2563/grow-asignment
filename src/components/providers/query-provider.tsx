"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState, useEffect } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache for 2 minutes for financial data (frequently changing)
            staleTime: 2 * 60 * 1000,
            // Keep data in cache for 30 minutes after component unmounts
            gcTime: 30 * 60 * 1000,
            // Retry failed requests 2 times (reduced for faster fallback)
            retry: 2,
            // Don't refetch on window focus
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect (let manual refresh handle this)
            refetchOnReconnect: false,
            // Don't refetch on mount if data is still fresh
            refetchOnMount: false,
            // Use cache first, then background refetch
            notifyOnChangeProps: ["data", "error"],
          },
        },
      })
  );

  const [persister] = useState(() => {
    if (typeof window !== "undefined") {
      return createSyncStoragePersister({
        storage: window.localStorage,
        key: "finboard-cache",
        // Serialize and deserialize to handle complex objects
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      });
    }
    return undefined;
  });

  // Don't render until we have access to window (client-side only)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (persister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          // Maximum age of cached data (30 minutes)
          maxAge: 30 * 60 * 1000,
          // Don't persist mutations, only queries
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              // Only persist successful queries
              return query.state.status === "success";
            },
          },
        }}
      >
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    );
  }

  // Fallback for server-side rendering
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
