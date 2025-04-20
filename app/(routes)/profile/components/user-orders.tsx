"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { OrdersSkeleton } from "./skeletons";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string | Date;
  items: OrderItem[];
}

interface UserOrdersProps {
  userId: string;
}

export function UserOrders({ userId }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${userId}/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (isMounted) {
          setError("There was a problem loading your orders");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (userId) {
      fetchOrders();
    }
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(order.total)}</p>
                <p className="text-sm text-gray-500">{order.status}</p>
              </div>
            </div>
            {order.items && order.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative w-16 h-16">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name || "Product"}
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="bg-gray-200 w-16 h-16 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.product?.name || "Product"}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items in this order</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 