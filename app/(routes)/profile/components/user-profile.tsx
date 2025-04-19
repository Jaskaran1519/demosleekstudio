'use client'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface UserProfileProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User avatar"}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">
            Member since {formattedDate}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Account Details</h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">Role:</span> {user.role}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 