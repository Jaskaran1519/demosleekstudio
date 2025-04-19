"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import useCart from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Tag, X, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AddressCard } from "@/components/address-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(searchParams.get('addressId') || "");
  const [mounted, setMounted] = useState(false);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  
  // Payment and order states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Calculate cart summary
  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.05; // 5% tax
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shipping + tax - discount;

  // Fetch user addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch("/api/addresses");
        const data = await response.json();
        setAddresses(data);
        if (data.length > 0 && !selectedAddressId) {
          const defaultAddress = data.find((addr: any) => addr.isDefault) || data[0];
          handleAddressChange(defaultAddress.id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }

    fetchAddresses();
  }, [selectedAddressId]);

  // This effect ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true);
    
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Update the URL when address changes
  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    const params = new URLSearchParams(searchParams);
    params.set('addressId', addressId);
    router.push(`/checkout?${params.toString()}`, { scroll: false });
  };

  // Apply coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");
    setIsApplyingCoupon(true);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: subtotal,
          items: items
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError("");
        toast.success(`Coupon applied: ${data.coupon.name}`);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };
  
  // Create order and initiate payment
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    
    setIsCreatingOrder(true);
    
    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          })),
          addressId: selectedAddressId,
          couponId: appliedCoupon?.id,
          couponCode: appliedCoupon?.code,
          discountAmount: discount,
          subtotal,
          tax,
          shipping,
          total
        }),
      });
      
      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }
      
      // Initialize Razorpay payment
      initializeRazorpayPayment(orderData);
      
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create your order. Please try again.");
      setIsCreatingOrder(false);
    }
  };
  
  // Initialize Razorpay payment
  const initializeRazorpayPayment = (orderData: any) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment system is not available. Please try again later.");
      setIsCreatingOrder(false);
      return;
    }
    
    setIsProcessingPayment(true);
    
    const options = {
      key: orderData.payment.key,
      amount: orderData.payment.amount * 100, // Convert to paise
      currency: orderData.payment.currency,
      name: "Sleek Studio",
      description: `Order #${orderData.order.id}`,
      order_id: orderData.payment.id,
      handler: function (response: any) {
        handlePaymentSuccess(response, orderData.order.id);
      },
      prefill: {
        email: "", // Will be filled by Razorpay from user's account
        contact: "", // Will be filled by Razorpay from user's account
      },
      theme: {
        color: "#9333EA", // Purple for brand consistency
      },
      modal: {
        ondismiss: function() {
          setIsCreatingOrder(false);
          setIsProcessingPayment(false);
          toast.error("Payment cancelled. Your order is saved and you can try again later.");
        }
      }
    };
    
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };
  
  // Handle successful payment
  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      setIsProcessingPayment(true);
      
      // Show a loading state
      toast.success("Payment successful! Finalizing your order...");
      
      // Optionally: Verify payment with backend
      // await fetch(`/api/verify-payment`, { method: "POST", body: JSON.stringify(response) });
      
      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
      
      // Only clear cart after we're sure we're navigating away
      // This way the data is preserved if there's an error
      setTimeout(() => {
        clearCart();
      }, 1000);
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast.error("There was an issue completing your order. Please contact support.");
    } finally {
      setIsCreatingOrder(false);
      setIsProcessingPayment(false);
    }
  };

  if (!mounted) {
    return <div className="h-screen"></div>;
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            You need to add items to your cart before checkout.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your order</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main checkout area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping address section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <Button variant="outline" asChild>
                  <Link href="/profile?tab=addresses">Manage Addresses</Link>
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-4">You don't have any saved addresses.</p>
                  <Button asChild>
                    <Link href="/profile?tab=addresses">Add an Address</Link>
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddressId}
                  onValueChange={handleAddressChange}
                  className="space-y-4"
                >
                  {addresses.map((address: any) => (
                    <div key={address.id} className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value={address.id} 
                        id={address.id}
                        className="mt-1" 
                      />
                      <div className="flex-1">
                        <AddressCard address={address} />
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img src="/razorpay-logo.png" alt="Razorpay" className="h-8" />
                  <div>
                    <p className="font-medium">Razorpay (Secure Payment)</p>
                    <p className="text-sm text-gray-500">
                      Credit/Debit Card, UPI, NetBanking, Wallet
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Your payment information is processed securely. We do not store your payment details.
              </p>
            </div>

            {/* Coupon code section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Have a Coupon?</h2>
              
              {appliedCoupon ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium">{appliedCoupon.name}</p>
                        <p className="text-sm text-green-700">
                          {appliedCoupon.discountType === "PERCENTAGE" 
                            ? `${appliedCoupon.discountValue}% off` 
                            : `₹${appliedCoupon.discountValue} off`
                          }
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600">
                    You saved ₹{appliedCoupon.discountAmount.toFixed(2)} with this coupon!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  
                  {couponError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{couponError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} {item.size && `(${item.size})`} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : "Free"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Items</span>
                  <span>{getTotalItems()}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={isCreatingOrder || isProcessingPayment || !selectedAddressId || addresses.length === 0}
                onClick={handlePlaceOrder}
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Place Order"}
              </Button>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span>Secure checkout with Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 