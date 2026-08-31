export const dynamic = "force-dynamic";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Badge } from "@/components/ui/badge";
import { Music, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-10 px-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 rounded-full bg-kumkum/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-72 rounded-full bg-swara-gold/10 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="mx-auto w-full max-w-md flex items-center justify-between z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-kumkum text-white shadow-md group-hover:scale-105 transition-transform">
            <Music className="size-5" />
          </div>
          <span className="font-serif text-lg font-bold text-kumkum tracking-wide">
            NAADABRAHMA AI
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Home
        </Link>
      </div>

      {/* Auth Card */}
      <div className="mx-auto w-full max-w-md my-auto z-10 pt-6 pb-6">
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/30 bg-card/90 p-8 md:p-10 shadow-xl backdrop-blur-md">
          <div className="text-center mb-6">
            <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-3 py-1 px-3">
              <ShieldCheck className="mr-1.5 size-3.5" />
              Student Portal Access
            </Badge>
            <h1 className="font-serif text-3xl font-bold text-kumkum">Welcome Back</h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Sign in to access your Carnatic music notes, practice streaks, and AI Guru session history.
            </p>
          </div>

          <AuthForm mode="login" />
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mx-auto w-full max-w-md text-center text-xs text-muted-foreground z-10">
        <p>© {new Date().getFullYear()} Naadabrahma AI. Where Tradition Meets Intelligence.</p>
      </div>
    </div>
  );
}
