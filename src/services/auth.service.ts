import { findUserByAuthId } from "@/repositories/auth.repository";

/**
 * Get admin user by Supabase auth ID.
 * Returns null if not found or not active admin.
 */
export async function getAdminUser(authId: string) {
  const user = await findUserByAuthId(authId);
  if (!user || !user.isActive || user.role !== "ADMIN") {
    return null;
  }
  return user;
}
