"use client";

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AddressesSkeleton, 
  MeasurementsSkeleton 
} from './skeletons';

// Lazy load tab components
const UserMeasurements = lazy(() => import('./user-measurements').then(mod => ({ default: mod.UserMeasurements })));
const UserAddresses = lazy(() => import('./user-addresses').then(mod => ({ default: mod.UserAddresses })));

interface ProfileTabsProps {
  userProfile: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
    addresses: any[];
  };
}

export function ProfileTabs({ userProfile }: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || 'addresses';
  
  const [currentTab, setCurrentTab] = useState(tab);
  const [isChangingTab, setIsChangingTab] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setIsChangingTab(true);
    setCurrentTab(value);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set('tab', value);
    router.push(`/profile?${params.toString()}`, { scroll: false });
    // Reset the changing state after a short delay for transition effect
    setTimeout(() => setIsChangingTab(false), 300);
  };

  // Update tab if URL changes externally
  useEffect(() => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  }, [tab, currentTab]);

  if (!userProfile) return null;

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs 
          value={currentTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="addresses" className="pt-6">
            <Suspense fallback={<AddressesSkeleton />}>
              <UserAddresses userId={userProfile.id} addresses={userProfile.addresses} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="measurements" className="pt-6">
            <Suspense fallback={<MeasurementsSkeleton />}>
              <UserMeasurements userId={userProfile.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 