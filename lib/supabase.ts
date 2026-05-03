import { createClient } from "@supabase/supabase-js";

type Client = ReturnType<typeof createPharmrooClient>;
let cached: Client | null = null;

function createPharmrooClient(url: string, key: string) {
  return createClient(url, key, {
    db: { schema: "pharmroo" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Server-only client. Uses the service_role key to bypass RLS for inserts.
// Never import this from a client component.
export function getSupabaseAdmin(): Client {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createPharmrooClient(url, key);
  return cached;
}
