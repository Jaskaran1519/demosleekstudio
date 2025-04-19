"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import useCart, { CartItem } from "@/store/useCart";
import Image from "next/image";
import { Trash, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // This effect ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state or empty div to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-screen"></div>;
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-md shadow-sm flex items-start gap-4">
                  <div className="w-20 h-20 relative bg-gray-100 rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link 
                          href={`/products/${item.slug}`} 
                          className="text-lg font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {item.color && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <span>Color:</span>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Number of items</span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unique products</span>
                  <span>{items.length}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              
              <Link href='/checkout'>

              <Button className="w-full mt-6">

                Proceed to Checkout
              </Button>
              </Link>
              
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}