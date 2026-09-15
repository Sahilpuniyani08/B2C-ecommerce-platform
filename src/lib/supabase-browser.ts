import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-safe Supabase client for admin authentication.
 * Uses only public / publishable keys — safe to expose in the browser.
 * The secret key lives only in server-side code (src/lib/supabase.ts).
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable."
    );
  }

  return createBrowserClient(url, key);
}

/**
 * Singleton pattern to reuse the same client instance across renders.
 */
let _client: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!_client) {
    _client = createSupabaseBrowserClient();
  }
  return _client;
}
