import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error("Failed to get session user:", err);
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data;
  } catch (err) {
    console.error("Failed to get user profile:", err);
    return null;
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile || !allowedRoles.includes(profile.role)) return null;

  return { user, profile };
}
