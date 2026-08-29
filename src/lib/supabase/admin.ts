import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { sanitizeSupabaseUrl, sanitizeAnonKey } from "./static";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminClient() {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = sanitizeAnonKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !serviceKey) return null;

  if (!adminClient) {
    adminClient = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
