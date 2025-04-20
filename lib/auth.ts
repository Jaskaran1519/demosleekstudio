import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Helper function to get the auth session on the server
 * Use this in server components or server actions
 */
export async function getAuthSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
} 