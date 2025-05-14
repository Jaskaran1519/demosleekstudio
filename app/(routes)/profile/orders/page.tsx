import { Container } from '@/components/ui/container';
import { getCurrentUserProfile } from '@/actions/users';
import { UserOrders } from '../components/user-orders';
import { Suspense } from 'react';
import { OrdersSkeleton } from '../components/skeletons';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function OrdersPage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg">Please sign in to view your orders</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center mb-8">
          <Link href="/profile" className="flex items-center text-primary hover:underline mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
        </div>
        
        <Suspense fallback={<OrdersSkeleton />}>
          <UserOrders userId={userProfile.id} />
        </Suspense>
      </div>
    </Container>
  );
}
