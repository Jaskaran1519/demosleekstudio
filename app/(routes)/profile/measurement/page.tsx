import { Container } from '@/components/ui/container';
import { getCurrentUserProfile } from '@/actions/users';
import { UserMeasurements } from '../components/user-measurements';
import { Suspense } from 'react';
import { MeasurementsSkeleton } from '../components/skeletons';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function MeasurementPage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg">Please sign in to view your measurements</p>
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
          <h1 className="text-3xl font-bold">My Measurements</h1>
        </div>
        
        <Suspense fallback={<MeasurementsSkeleton />}>
          <UserMeasurements userId={userProfile.id} />
        </Suspense>
      </div>
    </Container>
  );
}