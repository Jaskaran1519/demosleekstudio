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
  // Add a loading overlay component at the top level
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
  // Address interface is now defined at the top level

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    searchParams?.get("addressId") || ""
  );
  const [mounted, setMounted] = useState(false);

  // Authentication state
  const { status } = useSession();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  // Payment and order states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  // Shipping and tax states
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [shipping, setShipping] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Calculate cart summary
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05; // 5% tax
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shipping + tax - discount;

  // Fetch shipping rates on component mount
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

  // Update shipping cost when address changes
  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress && shippingRates[selectedAddress.country] !== undefined) {
        setShipping(shippingRates[selectedAddress.country]);
      }
    }
  }, [selectedAddressId, addresses, shippingRates]);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated" && mounted) {
      router.push("/auth/signin?callbackUrl=/checkout");
      toast.error("Please sign in to continue to checkout");
    }
  }, [status, mounted, router]);

  // Fetch user addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch("/api/addresses");
        const data = await response.json();
        setAddresses(data);
        if (data.length > 0 && !selectedAddressId) {
          const defaultAddress =
            data.find((addr: any) => addr.isDefault) || data[0];
          handleAddressChange(defaultAddress.id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }

    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [selectedAddressId, status]);

  // This effect ensures hydration mismatch is avoided and loads Razorpay script
  useEffect(() => {
    setMounted(true);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    
    // Only append if not already present
    if (!document.getElementById("razorpay-script")) {
      document.body.appendChild(script);
    }

    return () => {
      // Safe removal - check if script exists and if it's still in the document
      const scriptElement = document.getElementById("razorpay-script");
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // Update the URL when address changes
  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    // Update shipping based on the selected address
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress && shippingRates[selectedAddress.country] !== undefined) {
      setShipping(shippingRates[selectedAddress.country]);
    }
    
    // If the address has isDefault=true, update the default address
    if (selectedAddress?.isDefault) {
      // Update the default address in the backend if needed
      updateDefaultAddress(addressId);
    }
    
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("addressId", addressId);
    router.push(`/checkout?${params.toString()}`, { scroll: false });
  };
  
  const updateDefaultAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update default address');
      }
      
      // Update the addresses list to reflect the new default
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }))
      );
    } catch (error) {
      console.error('Error updating default address:', error);
      toast.error('Failed to update default address');
    }
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
          items: items,
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
    
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Invalid shipping address");
      return;
    }
    
    if (shippingRates[selectedAddress.country] === undefined) {
      toast.error("Shipping not available for the selected country");
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        shippingAddressId: selectedAddressId,
        shippingCountry: selectedAddress.country,
        shippingRate: shippingRates[selectedAddress.country],
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
        subtotal,
        tax,
        shipping,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderDataResponse = await response.json();

      if (!response.ok) {
        throw new Error(orderDataResponse.error || "Failed to create order");
      }

      // Initialize Razorpay payment
      initializeRazorpayPayment(orderDataResponse);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create your order. Please try again.");
      setIsCreatingOrder(false);
    }
  };



// Initialize Razorpay payment
const initializeRazorpayPayment = (orderData: PaymentOrderData) => {
  // Check if Razorpay is available
  if (typeof window === "undefined") {
    toast.error("Payment system is not available in server environment.");
    setIsCreatingOrder(false);
    return;
  }

  // Wait for Razorpay to load if needed
  const waitForRazorpay = () => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      proceedWithPayment();
    } else {
      // Check again after a short delay
      const checkRazorpay = () => {
        if (typeof window !== 'undefined' && window.Razorpay) {
          proceedWithPayment();
        } else {
          toast.error("Payment system is taking too long to load. Please refresh the page and try again.");
          setIsCreatingOrder(false);
          setIsProcessingPayment(false);
        }
      };
      
      const timer = setTimeout(checkRazorpay, 2000); // Wait 2 seconds before giving up
      
      return () => clearTimeout(timer);
    }
  };

  const proceedWithPayment = () => {
    setIsProcessingPayment(true);

    // Get user data from session if available
    const userEmail = ""; // You can get this from session if available
    const userPhone = ""; // You can get this from session if available

    const options = {
      key: orderData.payment.key,
      amount: orderData.payment.amount * 100, // Convert to INR (paise)
      currency: orderData.payment.currency,
      name: "Sleek Studio",
      description: `Order #${orderData.order.id}`,
      order_id: orderData.payment.id,
      handler: function (response: any) {
        handlePaymentSuccess(response, orderData.order.id);
      },
      prefill: {
        email: userEmail,
        contact: userPhone,
      },
      notes: {
        order_id: orderData.order.id,
        // Add any additional metadata that might help with webhook processing
      },
      theme: {
        color: "#9333EA", // Purple for brand consistency
      },
      modal: {
        ondismiss: function () {
          setIsCreatingOrder(false);
          setIsProcessingPayment(false);
          setIsPaymentSuccessful(false);
          toast.error(
            "Payment cancelled. Your order is saved and you can try again later."
          );
        },
      },
      // Enable this to send SMS/Email notifications
      send_sms_hash: true,
      // For better webhook reliability
      retry: true,
    };

    try {
      if (typeof window !== 'undefined' && window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function(response: { error: { description: string; code: string } }) {
          toast.error("Payment failed. Please try again.");
          console.error("Payment failed:", response.error);
          setIsCreatingOrder(false);
          setIsProcessingPayment(false);
          setIsPaymentSuccessful(false);
        });
        razorpayInstance.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsCreatingOrder(false);
      setIsProcessingPayment(false);
    }
  };

  // Start the process
  waitForRazorpay();
};

// Handle successful payment
const handlePaymentSuccess = async (response: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}, orderId: string) => {
  try {
    setIsProcessingPayment(true);
    setIsPaymentSuccessful(true); // Set payment as successful immediately

    // Show a loading state
    toast.success("Payment successful! Finalizing your order...");

    // Verify payment with backend to ensure it's processed even if webhook fails
    try {
      console.log("Verifying payment with server...", {
        payment_id: response.razorpay_payment_id,
        order_id: response.razorpay_order_id,
        app_order_id: orderId
      });
      
      const verifyResponse = await fetch(`/api/verify-payment`, { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: orderId
        })
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(`Verification failed: ${errorData.error || 'Unknown error'}`); 
      }
      
      const verifyResult = await verifyResponse.json();
      console.log("Payment verification result:", verifyResult);
      
      if (!verifyResult.success) {
        throw new Error('Payment verification failed');
      }
      
      // Payment verified successfully
      toast.success("Order confirmed and payment verified!");
      
    } catch (verifyError) {
      console.error("Error verifying payment:", verifyError);
      toast.error(
        "Payment received but order verification failed. Please contact support with your payment ID."
      );
      // Continue with the process even if verification fails
      // The webhook should handle this as a backup
    }

    // Redirect to success page
    router.push(`/order-success?orderId=${orderId}`);

    // Only clear cart after we're sure we're navigating away
    // This way the data is preserved if there's an error
    setTimeout(() => {
      clearCart();
    }, 1000);
  } catch (error) {
    console.error("Error handling payment success:", error);
    toast.error(
      "There was an issue completing your order. Please contact support."
    );
  } finally {
    setIsCreatingOrder(false);
    setIsProcessingPayment(false);
    // Note: we don't reset isPaymentSuccessful here as we want the overlay to remain until navigation
  }
};

if (!mounted) {
  return <div className="h-screen"></div>;
}

// Show loading state while checking authentication
if (status === "loading") {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>Loading checkout...</p>
      </div>
    </Container>
  );
}

// Don't render checkout content for unauthenticated users
if (status === "unauthenticated") {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-8">
          Please sign in to access the checkout page.
        </p>
        <Button asChild>
          <Link href="/auth/signin?callbackUrl=/checkout">Sign In</Link>
        </Button>
      </div>
    </Container>
  );
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
  <Container className="py-10">
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
            <Link href="/profile/address">Manage Addresses</Link>
          </Button>
        </div>

        {addresses.length > 0 && (
          <RadioGroup
            value={selectedAddressId}
            onValueChange={handleAddressChange}
            className="space-y-4 mb-6"
          >
            {addresses.map((address) => (
              <div key={address.id} className="flex items-center space-x-3">
                <RadioGroupItem value={address.id} id={address.id} />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <AddressCard address={address} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* Add New Address Accordion */}
        <div className="mt-6">
          <AddressForm
            defaultOpen={addresses.length === 0}
            onOpenChange={(isOpen) => {
              // Handle accordion open/close if needed
            }}
            onAddressCreated={(newAddress) => {
              const updatedAddresses = [...addresses, newAddress];
              setAddresses(updatedAddresses);
              
              // Select the new address
              handleAddressChange(newAddress.id);
              
              // Update shipping if the new address has a country with a defined rate
              if (newAddress.country && shippingRates[newAddress.country] !== undefined) {
                setShipping(shippingRates[newAddress.country]);
              }
              
              // The toast is now shown in the AddressForm component
            }}
          />
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex items-center space-x-3">
            <img
              src="/razorpay.svg"
              alt="Razorpay"
              className="h-8"
            />
            <div>
              <p className="font-medium">Razorpay (Secure Payment)</p>
              <p className="text-sm text-gray-500">
                Credit/Debit Card, UPI, NetBanking, Wallet
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Your payment information is processed securely. We do not store
          your payment details.
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
                      : `₹${appliedCoupon.discountValue} off`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>

    {/* Order summary sidebar */}
    <div className="lg:col-span-4">
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                </p>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedCoupon.name})</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping > 0 ? `₹${shipping.toFixed(2)}` : "Free"}
            </span>
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
          disabled={
            isCreatingOrder ||
            isProcessingPayment ||
            !selectedAddressId ||
            addresses.length === 0 
          }
          onClick={handlePlaceOrder}
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>

        <div className="flex flex-col items-center justify-center mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <span>Secure checkout with</span>
          </div>
          <div className="flex items-center justify-center">
            <Image 
              src="/razorpay.svg" 
              alt="Razorpay" 
              width={120} 
              height={30} 
              className="h-8 object-contain" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</Container>
  );
}
