"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Loader2, LogIn, UserPlus } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if Supabase is configured on the client side
  useEffect(() => {
    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setSupabaseReady(hasUrl && hasKey);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const action = mode === "login" ? signIn : signUp;
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (res.ok) {
        router.push("/student");
        router.refresh();
      } else {
        setError("Demo login failed. Please try again.");
        setDemoLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setDemoLoading(false);
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Supabase not configured banner ── */}
      {supabaseReady === false && (
        <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 dark:bg-amber-900/20 dark:border-amber-500/30">
          <div className="flex gap-2.5">
            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300 mb-1">
                Supabase Not Connected
              </p>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
                Add <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code className="font-mono text-[10px]">.env.local</code> file to enable real login.
              </p>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1.5">
                👇 Use Demo Mode below to explore the app without setup.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Demo Mode Button ── */}
      <button
        onClick={handleDemoLogin}
        disabled={demoLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-swara-gold/50 bg-swara-gold/8 py-3 text-sm font-extrabold text-swara-gold hover:border-swara-gold hover:bg-swara-gold/15 transition-all duration-200 disabled:opacity-60"
      >
        {demoLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <span className="text-base">🎵</span>
        )}
        {demoLoading ? "Logging in..." : "Try Demo Mode — No account needed"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* ── Real login form ── */}
      <form action={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-xs font-extrabold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-shadow"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-xs font-extrabold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-shadow"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-extrabold text-muted-foreground mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-shadow"
            placeholder="••••••••"
          />
          {mode === "login" && (
            <p className="text-[10px] font-bold text-muted-foreground mt-1 text-right">
              Min. 6 characters
            </p>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 dark:bg-red-900/20 dark:border-red-500/30">
            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-700 dark:text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-kumkum hover:bg-kumkum-light font-extrabold py-2.5 h-auto gap-2"
        >
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Please wait...</>
          ) : mode === "login" ? (
            <><LogIn className="size-4" /> Sign In</>
          ) : (
            <><UserPlus className="size-4" /> Create Account</>
          )}
        </Button>

        <p className="text-center text-xs font-bold text-muted-foreground">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link href="/signup" className="text-kumkum font-extrabold hover:underline">
                Create account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-kumkum font-extrabold hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
