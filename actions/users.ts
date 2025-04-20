"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { currentUser } from "./auth";
import { Prisma } from "@prisma/client";

/**
 * Get current user helper
 */
async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string) {
  try {
    // Check if userId is a valid MongoDB ObjectId format
    // MongoDB ObjectIds are 24 character hex strings
    if (!userId || typeof userId !== 'string' || userId.length !== 24) {
      console.warn(`Invalid user ID format: ${userId}`);
      return null;
    }
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                  }
                }
              }
            }
          }
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    // First try to get user by ID, and fallback to email if ID causes issues
    try {
      const userProfile = await db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          addresses: true,
        },
      });
      
      return userProfile;
    } catch (error) {
      // If ID lookup fails (e.g., malformed ObjectID), try by email instead
      if (user.email) {
        const userProfileByEmail = await db.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            addresses: true,
          },
        });
        
        return userProfileByEmail;
      }
      
      throw error; // Re-throw if we can't find the user by email either
    }
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

/**
 * Add a product to user's wishlist
 */
export async function addToWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        wishlistIds: {
          push: productId,
        },
      },
    });

    revalidatePath("/profile/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
}

/**
 * Remove a product from user's wishlist
 */
export async function removeFromWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get current wishlist
    const userWithWishlist = await db.user.findUnique({
      where: { id: user.id },
      select: { wishlistIds: true },
    });

    if (!userWithWishlist) {
      throw new Error("User not found");
    }

    // Filter out the product ID
    const updatedWishlist = userWithWishlist.wishlistIds.filter((id: string) => id !== productId);

    // Update the user
    await db.user.update({
      where: { id: user.id },
      data: {
        wishlistIds: updatedWishlist,
      },
    });

    revalidatePath("/profile/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return [];
    }

    const userWithWishlist = await db.user.findUnique({
      where: { id: user.id },
      select: {
        wishlist: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            images: true,
            category: true,
          },
        },
      },
    });

    return userWithWishlist?.wishlist || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error("Failed to fetch wishlist");
  }
}

export type FetchUsersParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export async function fetchUsers({
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc'
}: FetchUsersParams) {
  try {
    // Verify admin access
    const user = await currentUser();
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build where clause for search
    const where = search ? {
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    } : {};

    // Fetch users
    const [users, totalUsers] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      db.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        pageSize,
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Update a user's role (admin only)
 */
export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  try {
    // Verify admin access
    const user = await currentUser();
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Prevent changing own role
    if (user.id === userId) {
      throw new Error('Cannot change your own role');
    }

    // Update the user's role
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath('/admin/users');
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string) {
  try {
    // Verify admin access
    const user = await currentUser();
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Prevent deleting own account
    if (user.id === userId) {
      throw new Error('Cannot delete your own account');
    }

    // Delete the user
    await db.user.delete({
      where: { id: userId },
    });

    // Revalidate paths
    revalidatePath('/admin/users');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
} 