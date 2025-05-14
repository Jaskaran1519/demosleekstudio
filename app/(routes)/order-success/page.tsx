"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, Clock, Home } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  images: string[];
}

interface OrderAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  items: OrderItem[];
  address: OrderAddress;
  paymentStatus: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Could not load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, router]);

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8">{error || "Order not found"}</p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase, your order has been received.
          </p>
          <p className="font-medium">Order ID: {order.id}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Package className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Order Placed</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
              <Clock className="h-8 w-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-400">Processing</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
              <Truck className="h-8 w-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-400">Shipped</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
              <Home className="h-8 w-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-400">Delivered</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="h-20 w-20 rounded bg-gray-100 relative overflow-hidden">
                      {item.images && item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-cover h-full w-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size} </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <p className="font-medium">{order.address.name}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
              <p>{order.address.country}</p>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : "Free"}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>

              <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">Payment Successful</p>
                    <p className="text-sm text-green-700">
                      Your payment has been processed successfully.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/profile/orders">View All Orders</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 