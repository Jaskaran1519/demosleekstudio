"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AddressCard } from "@/components/address-card";
import { toast } from "sonner";
import { AddressesSkeleton } from "./skeletons";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const defaultAddressForm = {
  id: "",
  name: "",
  addressLine1: "",
  addressLine2: undefined as string | undefined,
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export function UserAddresses({ userId, addresses: initialAddresses = [] }: { userId: string, addresses?: any }) {
  const [addresses, setAddresses] = useState<Address[]>(Array.isArray(initialAddresses) ? initialAddresses : []);
  const [isLoading, setIsLoading] = useState(initialAddresses.length === 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  useEffect(() => {
    let isMounted = true;
    
    // Only fetch addresses if there are none initially provided
    if (addresses.length === 0) {
      fetchAddresses(isMounted);
    } else {
      setIsLoading(false); // Use pre-loaded addresses
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchAddresses = async (isMounted = true) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/addresses");
      const data = await response.json();
      if (isMounted) {
        setAddresses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (address: Address) => {
    // Convert the address to match the form type
    const formAddress = {
      ...address,
      addressLine2: address.addressLine2 || undefined,
    };
    setAddressForm(formAddress);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const resetForm = () => {
    setAddressForm(defaultAddressForm);
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = "/api/addresses"; // Same endpoint for both
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      // Success notification
      toast.success(isEditMode ? "Address updated" : "Address added");
      
      // Fetch updated addresses
      await fetchAddresses();
      
      // Reset form state
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      toast.success("Address deleted");
      
      // Update state directly to improve speed
      setAddresses(prev => prev.filter(address => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Address Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={addressForm.name}
                  onChange={handleFormChange}
                  placeholder="Home, Office, etc."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleFormChange}
                  placeholder="Street address"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={handleFormChange}
                  placeholder="Apartment, suite, unit, etc."
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={addressForm.country}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onCheckedChange={(checked) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: checked as boolean,
                    })
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Address" : "Save Address")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              actions={
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          ))
        ) : (
          <div className="col-span-2 p-6 text-center border rounded-lg">
            <p className="text-gray-500">You don't have any saved addresses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 