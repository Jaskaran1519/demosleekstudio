"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { OrdersTableColumns, OrderColumn } from "../columns";
import { OrdersTableFilters } from "../filters";
import { Pagination } from "@/components/ui/pagination";

interface OrderClientProps {
  orders: OrderColumn[];
  totalPages: number;
  currentPage: number;
}

export const OrderClient = ({
  orders,
  totalPages,
  currentPage,
}: OrderClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    return newParams.toString();
  };

  const onPageChange = (page: number) => {
    router.push(
      `/admin/orders?${createQueryString({
        page
      })}`
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${orders.length})`}
          description="Manage customer orders"
        />
      </div>
      <Separator />
      <div className="space-y-4 mt-4">
        <OrdersTableFilters />
        <DataTable 
          columns={OrdersTableColumns} 
          data={orders} 
          filterValue={searchParams?.get("query") || ""}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};