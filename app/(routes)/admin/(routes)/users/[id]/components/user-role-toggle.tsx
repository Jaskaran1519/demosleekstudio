"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/users";
import { Role } from "@prisma/client";

interface UserRoleToggleProps {
  userId: string;
  currentRole: Role;
}

export function UserRoleToggle({ userId, currentRole }: UserRoleToggleProps) {
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const router = useRouter();

  const handleRoleChange = async (newRole: Role) => {
    if (newRole === currentRole) return;

    try {
      setLoadingRole(newRole);
      
      await updateUserRole(userId, newRole);
      
      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user role: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoadingRole(null);
    }
  };

  const roleColors: { [key in Role]: string } = {
    ADMIN: "bg-purple-100 text-purple-800",
    USER: "bg-gray-100 text-gray-800",
    MANAGER: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <span className="font-medium">Current Role:</span>
        <span className={`px-2 py-1 rounded-full text-sm ${roleColors[currentRole]}`}>
          {currentRole}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {(["USER", "ADMIN", "MANAGER"] as Role[]).map((role) => (
          <Button
            key={role}
            variant="outline"
            onClick={() => handleRoleChange(role)}
            disabled={!!loadingRole || currentRole === role}
          >
            {loadingRole === role ? "Updating..." : `Make ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`}
          </Button>
        ))}
      </div>
    </div>
  );
}
