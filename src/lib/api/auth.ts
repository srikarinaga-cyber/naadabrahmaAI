import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile || !allowedRoles.includes(profile.role)) return null;

  return { user, profile };
}
