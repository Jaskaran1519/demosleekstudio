import { Container } from '@/components/ui/container';
import { getCurrentUserProfile } from '@/actions/users';
import { ProfileTabs } from './components/profile-tabs';

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

  // Pass data to client component for tab navigation
  return <ProfileTabs userProfile={userProfile} />;
} 