import { useState, useEffect, useMemo } from "react";
import { StockData } from "@/lib/finance-api";
import {
  usePopularStocks,
  useStockSearch,
  useInvalidateQueries,
  useAutoRefresh,
} from "@/lib/use-finance-queries";

export const useFinanceTableWidget = (
  selectedApiKey: any,
  refreshInterval: number
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedStocks, setSearchedStocks] = useState<Set<string>>(new Set());
  const [searchedStocksData, setSearchedStocksData] = useState<StockData[]>([]);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 5;

  // API calls
  const {
    data: popularData,
    isLoading: isLoadingPopular,
    error: popularError,
    refetch: refetchPopular,
  } = usePopularStocks(selectedApiKey || null);

  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
  } = useStockSearch(currentSearchTerm, selectedApiKey || null, shouldSearch);

  const { invalidatePopularStocks } = useInvalidateQueries();

  // Use auto-refresh hook for reliable data updates
  useAutoRefresh(refreshInterval, selectedApiKey?.id || "");

  // Combine popular stocks and searched stocks
  const stocksData = useMemo(() => {
    const popularStocks = popularData?.stocksData || [];
    const combinedStocks = [...popularStocks, ...searchedStocksData];

    const uniqueStocks = combinedStocks.reduce((acc, stock) => {
      const existingIndex = acc.findIndex((s) => s.symbol === stock.symbol);
      if (existingIndex >= 0) {
        // Replace with the more recent data (searched stocks take priority)
        if (searchedStocksData.some((s) => s.symbol === stock.symbol)) {
          acc[existingIndex] = stock;
        }
      } else {
        acc.push(stock);
      }
      return acc;
    }, [] as StockData[]);

    return uniqueStocks;
  }, [popularData?.stocksData, searchedStocksData]);

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocksData;
    
    const query = searchQuery.toLowerCase().trim();
    return stocksData.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        (stock as any).name?.toLowerCase().includes(query)
    );
  }, [stocksData, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStocks = filteredStocks.slice(startIndex, endIndex);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle search functionality
  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toUpperCase();
    if (!trimmedQuery || searchedStocks.has(trimmedQuery)) return;

    setCurrentSearchTerm(trimmedQuery);
    setShouldSearch(true);
  };

  // Handle search result
  useEffect(() => {
    if (searchResult && shouldSearch) {
      setSearchedStocks(prev => new Set([...prev, currentSearchTerm]));
      setSearchedStocksData(prev => [...prev, searchResult]);
      setShouldSearch(false);
      setCurrentSearchTerm("");
    }
  }, [searchResult, shouldSearch, currentSearchTerm]);

  // Handle removing searched stock
  const handleRemoveSearchedStock = (symbol: string) => {
    setSearchedStocks(prev => {
      const newSet = new Set(prev);
      newSet.delete(symbol);
      return newSet;
    });
    setSearchedStocksData(prev => 
      prev.filter(stock => stock.symbol !== symbol)
    );
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate loading and error states
  const loading = isLoadingPopular || isSearching;
  const error = popularError || searchError;

  return {
    // Search states
    searchQuery,
    setSearchQuery,
    searchedStocks,
    
    // Pagination states
    currentPage,
    totalPages,
    currentStocks,
    
    // Data states
    stocksData: filteredStocks,
    loading,
    error,
    
    // Handlers
    handleSearch,
    handleRemoveSearchedStock,
    handleClearSearch,
    handlePageChange,
    
    // Data refetch
    refetchPopular,
    invalidatePopularStocks,
    
    // Constants
    ITEMS_PER_PAGE,
  };
};
