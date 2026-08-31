import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { sanitizeSupabaseUrl, sanitizeAnonKey } from "@/lib/supabase/static";

const PROTECTED_PREFIXES = ["/student", "/teacher", "/admin"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Check for demo access session cookie
  const demoRole = request.cookies.get("naada_demo_role")?.value;
  const isDemo = Boolean(demoRole || request.cookies.get("demo_mode")?.value);

  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Allow protected routes if user is logged in OR in demo mode
  if (isProtected && !user && !isDemo) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && (user || isDemo)) {
    const dest = demoRole === "teacher" ? "/teacher" : "/student";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
