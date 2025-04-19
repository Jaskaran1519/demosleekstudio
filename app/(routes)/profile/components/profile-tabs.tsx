"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from './user-profile';
import { UserOrders } from './user-orders';
import { UserMeasurements } from './user-measurements';
import { UserAddresses } from './user-addresses';

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
  const tab = searchParams.get('tab') || 'profile';
  
  const [currentTab, setCurrentTab] = useState(tab);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`/profile?${params.toString()}`, { scroll: false });
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
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfile user={userProfile} />
          </TabsContent>
          
          <TabsContent value="addresses">
            <UserAddresses userId={userProfile.id} />
          </TabsContent>
          
          <TabsContent value="orders">
            <UserOrders userId={userProfile.id} />
          </TabsContent>
          
          <TabsContent value="measurements">
            <UserMeasurements userId={userProfile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
} 