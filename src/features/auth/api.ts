import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { LoginInput, AdminSession } from "./types";

/** Admin login via Supabase Auth */
export async function loginAdmin(input: LoginInput): Promise<AdminSession> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new Error(error?.message ?? "Login failed. Please check your credentials.");
  }

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    accessToken: data.session.access_token,
  };
}

/** Sign out admin */
export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
}

/** Get current session (null if not authenticated) */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  console.log("sessin", data)
  if (!data.session) return null;

  return {
    userId: data.session.user.id,
    email: data.session.user.email ?? "",
    accessToken: data.session.access_token,
  };
}
