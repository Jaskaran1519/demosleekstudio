"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Clock, Truck, Home, XCircle, AlertCircle } from "lucide-react";

interface OrderStatusUpdateProps {
  orderId: string;
  initialStatus: OrderStatus;
}

const statusOptions = [
  {
    value: OrderStatus.PENDING,
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    value: OrderStatus.PROCESSING,
    label: "Processing",
    icon: AlertCircle,
    color: "text-blue-600",
  },
  {
    value: OrderStatus.SHIPPED,
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600",
  },
  {
    value: OrderStatus.DELIVERED,
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    value: OrderStatus.CANCELLED,
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
  },
];

export function OrderStatusUpdate({ orderId, initialStatus }: OrderStatusUpdateProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (value: OrderStatus) => {
    if (value === status) return;
    
    setIsLoading(true);
    
    try {
      await updateOrderStatus(orderId, value);
      setStatus(value);
      toast.success(`Order status updated to ${value}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Select
        value={status}
        onValueChange={handleStatusChange as any}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Set status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <Icon className={`mr-2 h-4 w-4 ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
} 