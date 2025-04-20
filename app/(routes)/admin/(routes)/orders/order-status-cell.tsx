"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/actions/orders";
import { ChevronDown, CheckCircle2, Clock, Truck, Home, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OrderStatusCellProps {
  orderId: string;
  initialStatus: OrderStatus;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    icon: AlertCircle,
  },
  [OrderStatus.SHIPPED]: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 hover:bg-green-100/80",
    icon: CheckCircle2,
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 hover:bg-red-100/80",
    icon: XCircle,
  },
};

export function OrderStatusCell({ orderId, initialStatus }: OrderStatusCellProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const StatusIcon = statusConfig[status].icon;

  const handleStatusChange = async (value: string) => {
    if (value === status) return;
    
    setIsLoading(true);
    
    try {
      await updateOrderStatus(orderId, value);
      setStatus(value as OrderStatus);
      toast.success(`Order status updated to ${statusConfig[value as OrderStatus].label}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-[140px] justify-start ${statusConfig[status].color}`}
          disabled={isLoading}
        >
          <StatusIcon className="mr-2 h-4 w-4" />
          {statusConfig[status].label}
          {!isLoading && <ChevronDown className="ml-auto h-4 w-4" />}
          {isLoading && <span className="ml-auto animate-spin">●</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
          <DropdownMenuRadioItem value={OrderStatus.PENDING}>
            <Clock className="mr-2 h-4 w-4 text-yellow-600" />
            Pending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={OrderStatus.PROCESSING}>
            <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
            Processing
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={OrderStatus.SHIPPED}>
            <Truck className="mr-2 h-4 w-4 text-purple-600" />
            Shipped
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={OrderStatus.DELIVERED}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Delivered
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value={OrderStatus.CANCELLED}>
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Cancelled
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 