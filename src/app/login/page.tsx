export const dynamic = "force-dynamic";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🕉️</span>
            <span className="font-serif text-xl font-bold text-[#800020]">NAADABRAHMA</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#800020]">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue your musical journey</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#D4AF37]/20 p-8 shadow-sm">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}
