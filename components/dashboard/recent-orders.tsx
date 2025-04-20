import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest customer orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <Link 
                  href={`/admin/orders/${order.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  Order #{order.id.substring(0, 8)}...
                </Link>
                <p className="text-xs text-muted-foreground">
                  {order.user.name || order.user.email || "Unknown user"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-base font-semibold">
                  {formatPrice(order.total)}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <Link 
              href="/admin/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all orders →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Status badge component
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    [OrderStatus.PENDING]: { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80", label: "Pending" },
    [OrderStatus.PROCESSING]: { color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80", label: "Processing" },
    [OrderStatus.SHIPPED]: { color: "bg-purple-100 text-purple-800 hover:bg-purple-100/80", label: "Shipped" },
    [OrderStatus.DELIVERED]: { color: "bg-green-100 text-green-800 hover:bg-green-100/80", label: "Delivered" },
    [OrderStatus.CANCELLED]: { color: "bg-red-100 text-red-800 hover:bg-red-100/80", label: "Cancelled" },
  };

  const config = statusConfig[status] || statusConfig[OrderStatus.PENDING];

  return (
    <Badge variant="outline" className={`${config.color} font-normal`}>
      {config.label}
    </Badge>
  );
} 