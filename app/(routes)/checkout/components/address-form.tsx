"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Country = 'INDIA' | 'USA' | 'CANADA' | 'DUBAI' | 'EUROPE' | 'AUSTRALIA' | 'NEW_ZEALAND';

export const COUNTRIES: { value: Country; label: string }[] = [
  { value: 'INDIA', label: 'India' },
  { value: 'USA', label: 'United States' },
  { value: 'CANADA', label: 'Canada' },
  { value: 'DUBAI', label: 'Dubai' },
  { value: 'EUROPE', label: 'Europe' },
  { value: 'AUSTRALIA', label: 'Australia' },
  { value: 'NEW_ZEALAND', label: 'New Zealand' },
];

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
}

interface AddressFormProps {
  onAddressCreated: (newAddress: Address) => void;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddressForm({ onAddressCreated, defaultOpen = false, onOpenChange }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'INDIA',
    postalCode: '',
    isDefault: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Basic validation
    if (!formData.name || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.country || !formData.postalCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          addressLine2: formData.addressLine2 || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const newAddress = await response.json();
      onAddressCreated(newAddress);

      // Show success toast
      toast.success("Address added successfully");

      // Reset form
      setFormData({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'INDIA',
        postalCode: '',
        isDefault: false
      });

      // Close the accordion after successful submission
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={defaultOpen ? "address-form" : undefined}
        onValueChange={(value) => onOpenChange?.(value === "address-form")}
        className="w-full mt-4 border rounded-lg overflow-hidden"
      >
        <AccordionItem value="address-form" className="border-b-0">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Add New Address</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-4">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Street Address *</Label>
                <Input 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                <Input 
                  id="addressLine2" 
                  name="addressLine2" 
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input 
                    id="postalCode" 
                    name="postalCode" 
                    value={formData.postalCode}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select 
                    name="country"
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isDefault" 
                  name="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isDefault: checked as boolean }))
                  }
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange?.(false)}
                  disabled={isSubmitting}
                  className="w-24"
                >
                  {isSubmitting ? 'Saving...' : 'Cancel'}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-24"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save'}
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddressForm;
