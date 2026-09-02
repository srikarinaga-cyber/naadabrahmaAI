import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { sanitizeSupabaseUrl, sanitizeAnonKey } from "@/lib/supabase/static";

const PROTECTED_PREFIXES = ["/student", "/teacher", "/admin"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const isLogoutRequest = searchParams.get("logout") === "true";
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Check for demo session cookie
  const demoRole = request.cookies.get("naada_demo_role")?.value;
  const isDemo = Boolean(demoRole || request.cookies.get("demo_mode")?.value);

  // If explicit logout is requested or visiting login, clear demo cookies if needed or allow login page render
  if (isLogoutRequest && (pathname === "/login" || pathname === "/")) {
    response.cookies.delete("naada_demo_role");
    response.cookies.delete("demo_mode");
    return response;
  }

  // If in demo mode and accessing protected routes, grant instant access
  if (isDemo) {
    if (isProtected) {
      return response;
    }
    // Allow login/signup page viewing if user explicitly visits login page
    if (pathname === "/login" || pathname === "/signup") {
      return response;
    }
  }

  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return response;
  }

  try {
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

    // Redirect to login if unauthenticated & not demo
    if (isProtected && !user && !isDemo) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (err) {
    console.warn("Middleware auth check warning:", err);
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
