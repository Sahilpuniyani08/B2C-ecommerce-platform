import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { findUserByAuthId } from "@/repositories/auth.repository";
import { BusinessError } from "@/types/global";

export interface AdminUser {
  id: string;
  authId: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Verify admin authentication from the request.
 * 1. Extracts Bearer token from Authorization header
 * 2. Verifies with Supabase Auth
 * 3. Finds local User by authId
 * 4. Checks role === ADMIN && isActive === true
 */
export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new BusinessError("UNAUTHORIZED", "Authentication required", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  // Verify token with Supabase
  const {
    data: { user: supabaseUser },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !supabaseUser) {
    throw new BusinessError("UNAUTHORIZED", "Invalid or expired token", 401);
  }

  // Find local user by Supabase auth ID
  const localUser = await findUserByAuthId(supabaseUser.id);

  if (!localUser) {
    throw new BusinessError("FORBIDDEN", "User not found in system", 403);
  }

  if (!localUser.isActive) {
    throw new BusinessError("FORBIDDEN", "User account is disabled", 403);
  }

  if (localUser.role !== "ADMIN") {
    throw new BusinessError("FORBIDDEN", "Admin access required", 403);
  }

  return {
    id: localUser.id,
    authId: localUser.authId,
    name: localUser.name,
    email: localUser.email,
    role: localUser.role,
  };
}
