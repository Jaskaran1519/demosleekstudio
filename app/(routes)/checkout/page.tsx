"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import useCart from "@/store/useCart";
import type { CartItem } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Tag, X, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { AddressCard } from "@/components/address-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { AddressForm } from "./components/address-form";
import Script from "next/script";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  [key: string]: any; // For other address fields
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderData {
  items: OrderItem[];
  shippingAddressId: string;
  shippingCountry: string;
  shippingRate: number;
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface PaymentOrderData {
  order: {
    id: string;
  };
  payment: {
    id: string;
    amount: number;
    currency: string;
    key: string;
  };
}

interface CouponData {
  id: string;
  code: string;
  name: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  discountAmount: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const PaymentSuccessOverlay = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
      <p>Finalizing your order...</p>
    </div>
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { data: session, status } = useSession();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    searchParams?.get("addressId") || ""
  );
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [shipping, setShipping] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05; // 5% tax
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shipping + tax - discount;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/shipping-rates');
        if (response.ok) {
          const rates = await response.json();
          const ratesMap = rates.reduce((acc: Record<string, number>, rate: any) => {
            acc[rate.country] = rate.rate;
            return acc;
          }, {});
          setShippingRates(ratesMap);
        }
      } catch (error) {
        console.error('Error fetching shipping rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress && shippingRates[selectedAddress.country] !== undefined) {
        setShipping(shippingRates[selectedAddress.country]);
      }
    }
  }, [selectedAddressId, addresses, shippingRates]);

  useEffect(() => {
    async function fetchAddresses() {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/addresses");
          const data = await response.json();
          setAddresses(data);
          if (data.length > 0 && !selectedAddressId) {
            const defaultAddress = data.find((addr: any) => addr.isDefault) || data[0];
            if (defaultAddress) {
              handleAddressChange(defaultAddress.id);
            }
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      }
    }
    fetchAddresses();
  }, [status]);

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("addressId", addressId);
    router.push(`/checkout?${params.toString()}`, { scroll: false });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal, items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAppliedCoupon(data.coupon);
      toast.success(`Coupon applied: ${data.coupon.name}`);
    } catch (error: any) {
      setCouponError(error.message);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    setIsCreatingOrder(true);
    try {
      // Ensure we're using the correct ID field for products
      const orderPayload = {
        items: items.map(item => ({
          productId: item.id, // This should be the MongoDB ObjectId string
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          name: item.name, // Include product name for reference
          image: item.image // Include image for reference
        })),
        addressId: selectedAddressId,
        couponId: appliedCoupon?.id,
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
        subtotal, 
        tax, 
        shipping, 
        total,
      };
      
      console.log("[CHECKOUT] Sending order payload:", JSON.stringify(orderPayload, null, 2));
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Failed to create order");
      initializeRazorpayPayment(orderData);
    } catch (error: any) {
      toast.error(error.message || "Failed to create your order. Please try again.");
      setIsCreatingOrder(false);
    }
  };

  const initializeRazorpayPayment = (orderData: PaymentOrderData) => {
    if (!orderData.payment.key) {
      toast.error("Payment gateway is not configured. Please contact support.");
      setIsCreatingOrder(false);
      return;
    }
    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment gateway is not available. Please refresh and try again.");
      setIsCreatingOrder(false);
      return;
    }

    const options = {
      key: orderData.payment.key,
      amount: orderData.payment.amount * 100,
      currency: orderData.payment.currency,
      name: "Sleek Studio",
      description: `Order #${orderData.order.id}`,
      image: "/logo.png",
      order_id: orderData.payment.id,
      handler: (response: any) => handlePaymentSuccess(response, orderData.order.id),
      prefill: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        contact: addresses.find(a => a.id === selectedAddressId)?.phone || "",
      },
      notes: {
        address: addresses.find(a => a.id === selectedAddressId)?.addressLine1,
        orderId: orderData.order.id,
      },
      theme: { color: "#9333EA" },
      modal: {
        ondismiss: () => {
          toast.info("Payment was not completed.");
          setIsCreatingOrder(false);
          setIsProcessingPayment(false);
        },
      },
    };

    try {
      setIsProcessingPayment(true);
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsCreatingOrder(false);
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (error) {
      toast.error("Failed to open payment gateway. Please try again.");
      setIsCreatingOrder(false);
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }, orderId: string) => {
    setIsProcessingPayment(true);
    setIsPaymentSuccessful(true);
    try {
      await fetch(`/api/verify-payment`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...response, order_id: orderId })
      });
      toast.success("Payment successful! Redirecting...");
      router.push(`/order-success?orderId=${orderId}`);
      setTimeout(() => clearCart(), 1000);
    } catch (error) {
      toast.error("There was an issue completing your order. Please contact support.");
    } finally {
      setIsCreatingOrder(false);
      setIsProcessingPayment(false);
    }
  };

  if (!mounted || status === "loading") {
    return (
      <Container className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-8">Please sign in to access the checkout page.</p>
        <Button asChild><Link href="/auth/signin?callbackUrl=/checkout">Sign In</Link></Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">You need to add items to your cart before checkout.</p>
        <Button asChild><Link href="/products">Browse Products</Link></Button>
      </Container>
    );
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <Container className="px-4 sm:px-6 lg:px-8 pb-24">
        {isPaymentSuccessful && <PaymentSuccessOverlay />}
        <h1 className="text-3xl font-bold my-4">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <Button variant="outline" asChild><Link href="/profile/address">Manage Addresses</Link></Button>
              </div>
              {addresses.length > 0 ? (
                <RadioGroup value={selectedAddressId} onValueChange={handleAddressChange} className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer"><AddressCard address={address} /></Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : <p>No addresses found. Please add one.</p>}
              <div className="mt-6">
                <AddressForm defaultOpen={addresses.length === 0} onAddressCreated={(newAddress) => { setAddresses(prev => [...prev, newAddress]); setSelectedAddressId(newAddress.id); }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Coupon Code</h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3"><Tag className="h-5 w-5 text-green-600" /><p className="font-semibold text-green-700">{appliedCoupon.code} - {appliedCoupon.name}</p></div>
                  <Button variant="ghost" size="icon" onClick={removeCoupon}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1" />
                  <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>{isApplyingCoupon ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Applying...</> : "Apply"}</Button>
                </div>
              )}
              {couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md"><img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" /><div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</div></div>
                    <div className="flex-1"><h3 className="font-medium text-sm">{item.name}</h3><p className="text-sm text-gray-500">{item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p><p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p></div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                {appliedCoupon && <div className="flex justify-between text-green-600"><span>Discount ({appliedCoupon.name})</span><span>-₹{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : "Free"}</span></div>
                <div className="flex justify-between text-sm"><span>Items</span><span>{getTotalItems()}</span></div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold text-lg mb-6"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <Button className="w-full" size="lg" disabled={isCreatingOrder || isProcessingPayment || !selectedAddressId || addresses.length === 0} onClick={handlePlaceOrder}>{isCreatingOrder ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Place Order"}</Button>
              <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 mr-2" /><span>Secure checkout with</span></div>
                <div className="flex items-center justify-center"><Image src="/razorpay.svg" alt="Razorpay" width={120} height={30} className="h-8 object-contain" /></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
