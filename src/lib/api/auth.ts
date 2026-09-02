import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        return user;
      }
    }
  } catch (err) {
    console.error("Failed to get Supabase session user:", err);
  }

  // Fallback to demo / cookie session check
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("naada_demo_role")?.value;
    const isDemo = cookieStore.get("demo_mode")?.value;
    const userNameCookie = cookieStore.get("naada_user_name")?.value;

    if (demoRole || isDemo || userNameCookie) {
      const resolvedName = userNameCookie
        ? decodeURIComponent(userNameCookie)
        : demoRole === "teacher"
        ? "Guru Sangeetha"
        : "Srinivas K.";

      return {
        id: "demo-user-session",
        email: "student@naadabrahma.ai",
        aud: "authenticated",
        role: demoRole || "student",
        user_metadata: { name: resolvedName },
        app_metadata: { provider: "email" },
        created_at: new Date().toISOString(),
      } as unknown as import("@supabase/supabase-js").User;
    }
  } catch (e) {
    console.warn("Cookie session check error:", e);
  }

  return null;
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
