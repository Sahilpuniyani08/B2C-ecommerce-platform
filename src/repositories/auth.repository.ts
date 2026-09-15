import { prisma } from "@/lib/prisma";

/**
 * Find a local User by their Supabase auth ID.
 */
export async function findUserByAuthId(authId: string) {
  return prisma.user.findUnique({
    where: { authId },
  });
}
