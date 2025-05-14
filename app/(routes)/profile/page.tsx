import { Container } from '@/components/ui/container';
import { getCurrentUserProfile } from '@/actions/users';
import { UserProfile } from './components/user-profile';
import { Suspense } from 'react';
import { ProfileSkeleton } from './components/skeletons';
import Link from 'next/link';
import { ShoppingBag, MapPin, Ruler } from 'lucide-react';

export default async function ProfilePage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg">Please sign in to view your profile</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* User Profile Section */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Suspense fallback={<ProfileSkeleton />}>
              <UserProfile user={userProfile} />
            </Suspense>
          </div>
          
          {/* Navigation Options */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Orders Option */}
              <Link href="/profile/orders" className="block">
                <div className="border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:border-primary hover:-translate-y-1">
                  <ShoppingBag className="w-12 h-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Orders</h3>
                  <p className="text-gray-500 mt-2">View your order history</p>
                </div>
              </Link>
              
              {/* Addresses Option */}
              <Link href="/profile/address" className="block">
                <div className="border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:border-primary hover:-translate-y-1">
                  <MapPin className="w-12 h-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Addresses</h3>
                  <p className="text-gray-500 mt-2">Manage your addresses</p>
                </div>
              </Link>
              
              {/* Measurements Option */}
              <Link href="/profile/measurement" className="block">
                <div className="border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:border-primary hover:-translate-y-1">
                  <Ruler className="w-12 h-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Measurements</h3>
                  <p className="text-gray-500 mt-2">Your body measurements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}