"use client";

import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Truck, Home, XCircle, AlertCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
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

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`font-normal ${config.color}`}
    >
      <StatusIcon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
} 