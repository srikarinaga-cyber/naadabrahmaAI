import { NextResponse } from "next/server";

// Demo login — works without Supabase for testing purposes
export async function POST() {
  const response = NextResponse.json({ success: true });

  // Set a demo session cookie that lasts 24 hours
  response.cookies.set("nb_demo_session", JSON.stringify({
    id: "demo-user-001",
    name: "Demo Student",
    email: "demo@naadabrahma.ai",
    role: "student",
    loginAt: new Date().toISOString(),
  }), {
    httpOnly: false,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("nb_demo_session");
  return response;
}
