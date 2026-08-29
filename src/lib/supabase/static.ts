import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function sanitizeSupabaseUrl(url: string | undefined): string | null {
  if (!url) return null;
  
  // Remove any leading/trailing quotes, equals signs, or spaces
  let clean = url.trim().replace(/^['"=\s]+|['"\s]+$/g, '');
  
  // Remove trailing API path /rest/v1 and trailing slashes
  clean = clean.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  
  return null;
}

export function sanitizeAnonKey(key: string | undefined): string | null {
  if (!key) return null;
  return key.trim().replace(/^['"=\s]+|['"\s]+$/g, '');
}

export function isSupabaseConfigured(): boolean {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return Boolean(url && anonKey);
}

/**
 * Creates a static, read-only Supabase client that does not inspect request cookies.
 * Safe to use inside statically pre-rendered components and ISR pages (e.g. landing page features, music catalogs).
 */
export function createStaticClient() {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
