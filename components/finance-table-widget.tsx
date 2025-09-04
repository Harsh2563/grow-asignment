"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { Widget } from "@/store/slices/widgetsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StockData,
  calculateStockChange,
  formatCurrency,
  formatPercentage,
} from "@/lib/finance-api";
import {
  usePopularStocks,
  useStockSearch,
  useInvalidateQueries,
  useAutoRefresh,
} from "@/lib/use-finance-queries";

interface TableWidgetProps {
  widget: Widget;
}

export const FinanceTableWidget = ({ widget }: TableWidgetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedStocks, setSearchedStocks] = useState<Set<string>>(new Set());
  const [searchedStocksData, setSearchedStocksData] = useState<StockData[]>([]);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 5;

  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKey = apiKeys.find((key) => key.id === widget.apiKeyId);

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
  useAutoRefresh(widget.refreshInterval, selectedApiKey?.id || "");

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

  const loading = isLoadingPopular && searchedStocksData.length === 0;
  const error = popularError || searchError;

  useEffect(() => {
    if (searchResult && shouldSearch) {
      setSearchedStocksData((prev) => {
        const filtered = prev.filter(
          (stock) => stock.symbol !== searchResult.symbol
        );
        return [...filtered, searchResult];
      });
      setSearchedStocks(
        (prev) => new Set([...prev, currentSearchTerm.toUpperCase()])
      );
      setShouldSearch(false);
      setCurrentSearchTerm("");
    }
  }, [searchResult, shouldSearch, currentSearchTerm]);

  const searchAndAddStock = async (symbol: string): Promise<void> => {
    if (!selectedApiKey || searchedStocks.has(symbol.toUpperCase())) {
      return;
    }

    setCurrentSearchTerm(symbol.toUpperCase());
    setShouldSearch(true);
  };

  const handleSearchClick = async () => {
    const trimmedQuery = searchQuery.trim().toUpperCase();
    if (trimmedQuery.length >= 1) {
      await searchAndAddStock(trimmedQuery);
    }
  };

  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredStocks = useMemo(() => {
    if (!searchQuery) {
      return stocksData;
    }

    const query = searchQuery.toLowerCase();
    return stocksData.filter((stock) =>
      stock.symbol.toLowerCase().includes(query)
    );
  }, [stocksData, searchQuery]);

  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStocks = filteredStocks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!widget.isVisible) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {widget.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {popularData && (
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && stocksData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Loading stocks data...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>{error?.message || "An error occurred"}</span>
          </div>
        ) : stocksData.length > 0 ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 pr-10"
                  disabled={isSearching}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSearchClick}
                disabled={!searchQuery.trim() || isSearching}
                className="min-w-[100px]"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Search Results Info */}
            {searchedStocks.size > 0 && (
              <div className="text-sm text-muted-foreground">
                Searched stocks: {Array.from(searchedStocks).join(", ")}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setSearchedStocks(new Set());
                    setSearchedStocksData([]);
                    refetchPopular();
                  }}
                  className="h-auto p-0 ml-2"
                >
                  Reset to popular stocks
                </Button>
              </div>
            )}

            {/* Stocks Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Symbol</TableHead>
                  <TableHead className="font-semibold text-right">
                    Current Price
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Change
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Change %
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    High
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Low
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Open
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStocks.length > 0 ? (
                  currentStocks.map((stock) => {
                    const change = calculateStockChange(stock);
                    return (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium font-mono">
                          {stock.symbol}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(stock.c)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono ${
                            change.isPositive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {change.isPositive ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {change.isPositive ? "+" : ""}
                            {formatCurrency(change.amount)}
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono ${
                            change.isPositive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatPercentage(change.percentage)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(stock.h)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(stock.l)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(stock.o)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? `No stocks found matching "${searchQuery}"`
                        : "No stocks available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Stats */}
            <div className="text-sm text-muted-foreground text-center">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredStocks.length)} of{" "}
              {filteredStocks.length} stocks
              {searchQuery && ` (filtered from ${stocksData.length} total)`}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No stock data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
