"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";

export function OrdersTableFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch and sync with URL params
  useEffect(() => {
    setMounted(true);
    // Sync status with URL params
    const urlStatus = searchParams.get("status");
    if (urlStatus) {
      setStatus(urlStatus);
    } else {
      setStatus("all");
    }
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters({ query });
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    updateFilters({ status: value });
  }

  function handleResetSearch() {
    setQuery("");
    updateFilters({ query: "" });
  }

  function updateFilters(updates: { query?: string; status?: string }) {
    const params = new URLSearchParams(searchParams);

    if (updates.query !== undefined) {
      if (updates.query) {
        params.set("query", updates.query);
      } else {
        params.delete("query");
      }
    }

    if (updates.status !== undefined) {
      if (updates.status) {
        params.set("status", updates.status);
      } else {
        params.delete("status");
      }
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`?${params.toString()}`);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer name..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              type="button"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={handleResetSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
          <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
          <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
          <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
