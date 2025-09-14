"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  phone: string;
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
  phone: "",
  isDefault: false,
};

export function UserAddresses({
  userId,
  addresses: initialAddresses = [],
}: {
  userId: string;
  addresses?: any;
}) {
  const [addresses, setAddresses] = useState<Address[]>(
    Array.isArray(initialAddresses) ? initialAddresses : []
  );
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.type === 'checkbox' 
      ? (target as HTMLInputElement).checked 
      : target.value;
      
    setAddressForm({
      ...addressForm,
      [target.name]: value,
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
      const response = await fetch(`/api/addresses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        console.error('Failed to delete address:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        
        throw new Error(
          responseData.error || 
          responseData.message || 
          `Failed to delete address (Status: ${response.status})`
        );
      }

      // Update the UI optimistically
      setAddresses((prev) => {
        const updated = prev.filter((address) => address.id !== id);
        
        // If we deleted the default address, update the first address to be default
        const wasDefault = prev.find(a => a.id === id)?.isDefault;
        if (wasDefault && updated.length > 0) {
          updated[0].isDefault = true;
        }
        
        return updated;
      });
      
      toast.success('Address deleted successfully');
      
    } catch (error) {
      console.error('Error deleting address:', error);
      
      // More specific error messages based on the error type
      let errorMessage = 'Failed to delete address';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle common error cases
        if (errorMessage.includes('foreign key constraint')) {
          errorMessage = 'Cannot delete address as it is being used in existing orders';
        } else if (errorMessage.includes('400')) {
          errorMessage = 'Invalid request. Please try again.';
        } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
          errorMessage = 'You are not authorized to perform this action';
        } else if (errorMessage.includes('404')) {
          errorMessage = 'Address not found or already deleted';
        }
      }
      
      toast.error(errorMessage);
      
      // Refresh the addresses list to ensure consistency
      fetchAddresses();
    }
  };

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {isEditMode ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Country/Region field */}
              <div className="space-y-2">
                <Label htmlFor="country">Country/Region</Label>
                <select
                  id="country"
                  name="country"
                  value={addressForm.country}
                  onChange={handleFormChange}
                  required
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Select a country</option>
                  <option value="INDIA">India</option>
                  <option value="USA" disabled>United States</option>
                  <option value="CANADA" disabled>Canada</option>
                  <option value="DUBAI" disabled>Dubai (UAE)</option>
                  <option value="EUROPE" disabled>Europe</option>
                  <option value="AUSTRALIA" disabled>Australia</option>
                  <option value="NEW_ZEALAND" disabled>New Zealand</option>
                </select>
              </div>

              {/* Name fields in a row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={addressForm.name}
                    onChange={handleFormChange}
                    placeholder="First name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Address line 1 with search icon */}
              <div className="space-y-2 relative">
                <Label htmlFor="addressLine1">Address</Label>
                <div className="relative">
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleFormChange}
                    placeholder="Address"
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Apartment field */}
              <div className="space-y-2">
                <Label htmlFor="addressLine2">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={addressForm.addressLine2}
                  onChange={handleFormChange}
                  placeholder="Apartment, suite, etc."
                  disabled={isSubmitting}
                />
              </div>

              {/* City, State, PIN code in a row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleFormChange}
                    placeholder="City"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleFormChange}
                    placeholder="State"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">PIN code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleFormChange}
                    placeholder="PIN code"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Phone field with help icon */}
              <div className="space-y-2 relative">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleFormChange}
                    placeholder="Phone"
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2">
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
                  className="rounded-sm"
                />
                <Label htmlFor="isDefault" className="text-sm font-normal">
                  Set as default address
                </Label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="px-6">
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Address"
                    : "Save Address"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              actions={
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/addresses", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              ...address,
                              isDefault: true,
                            }),
                          });

                          if (!response.ok) {
                            throw new Error("Failed to update address");
                          }

                          toast.success("Default address updated");
                          await fetchAddresses();
                        } catch (error) {
                          console.error("Error updating address:", error);
                          toast.error("Failed to update address");
                        }
                      }}
                    >
                      Set as default
                    </Button>
                  )}
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
            <p className="text-gray-500">
              You don't have any saved addresses yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
