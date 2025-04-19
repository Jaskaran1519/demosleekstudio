import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AddressProps {
  address: {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
  actions?: React.ReactNode;
}

export function AddressCard({ address, actions }: AddressProps) {
  return (
    <div className="border rounded-lg p-4 w-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{address.name}</h3>
          {address.isDefault && (
            <Badge variant="secondary" className="ml-2">Default</Badge>
          )}
        </div>
        {actions}
      </div>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
      </div>
    </div>
  );
} 