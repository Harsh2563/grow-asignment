"use client";

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
  calculateStockChange,
  formatCurrency,
  formatPercentage,
} from "@/lib/finance-api";
import { useFinanceTableWidget } from "@/lib/use-finance-table-widget";

interface TableWidgetProps {
  widget: Widget;
}

export const FinanceTableWidget = ({ widget }: TableWidgetProps) => {
  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKey = apiKeys.find((key) => key.id === widget.apiKeyId);

  const {
    // Search states
    searchQuery,
    setSearchQuery,
    searchedStocks,
    
    // Pagination states
    currentPage,
    totalPages,
    currentStocks,
    
    // Data states
    stocksData,
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
  } = useFinanceTableWidget(selectedApiKey, widget.refreshInterval);

  if (!widget.isVisible) return null;

  return (
    <Card className="w-full h-[520px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {widget.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {loading && stocksData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading stocks...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mr-2" />
            <div className="text-center">
              <p className="font-medium">Failed to load stock data</p>
              <p className="text-sm mt-1">{error?.message}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchPopular()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search stocks or filter results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                disabled={
                  !searchQuery.trim() ||
                  searchedStocks.has(searchQuery.trim().toUpperCase()) ||
                  loading
                }
                className="flex-shrink-0"
              >
                <Search className="h-4 w-4 mr-1" />
                Add Stock
              </Button>
            </div>

            {/* Searched Stocks Pills */}
            {searchedStocks.size > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs text-muted-foreground mr-2">
                  Added stocks:
                </span>
                {Array.from(searchedStocks).map((symbol) => (
                  <div
                    key={symbol}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    <span>{symbol}</span>
                    <button
                      onClick={() => handleRemoveSearchedStock(symbol)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Change %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchQuery ? "No stocks found" : "No stock data"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentStocks.map((stock) => {
                      const change = calculateStockChange(stock);
                      const isPositive = change.amount >= 0;

                      return (
                        <TableRow key={stock.symbol}>
                          <TableCell className="font-medium">
                            {stock.symbol}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {stock.name || stock.symbol}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(stock.c)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {formatCurrency(Math.abs(change.amount))}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatPercentage(change.percentage)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, stocksData.length)} of{" "}
                  {stocksData.length} stocks
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
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
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
