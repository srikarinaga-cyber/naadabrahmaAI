"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signIn as serverSignIn, signUp as serverSignUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let supabase = null;
      try {
        supabase = createClient();
      } catch (err) {
        console.warn("Browser Supabase client fallback:", err);
      }

      if (mode === "login") {
        if (supabase) {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
          }
        } else {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          const res = await serverSignIn(formData);
          if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
          }
        }
        setSuccess("Login successful! Redirecting to student dashboard...");
        setTimeout(() => {
          router.push("/student");
          router.refresh();
        }, 600);
      } else {
        if (supabase) {
          const { error: authError } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { name: name.trim(), role: "student" },
            },
          });
          if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
          }
        } else {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          formData.append("name", name);
          const res = await serverSignUp(formData);
          if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
          }
        }
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/student");
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected authentication error occurred.");
      setLoading(false);
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess("Accessing Demo Student Dashboard...");
    setTimeout(() => {
      router.push("/student");
      router.refresh();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
              placeholder="Sangeetha Vidwan"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
            placeholder="student@naadabrahma.ai"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground">
            Password
          </label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="size-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-kumkum hover:bg-kumkum-light text-white font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {mode === "login" ? "Sign In" : "Create Student Account"}
            <ArrowRight className="size-4" />
          </span>
        )}
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">Or quick access</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full border-swara-gold/30 hover:border-swara-gold hover:bg-swara-gold/10 text-foreground font-medium rounded-xl text-xs py-2 transition-all flex items-center justify-center gap-1.5"
      >
        <Sparkles className="size-3.5 text-swara-gold" />
        Continue as Demo Student
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-kumkum font-semibold hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/login" className="text-kumkum font-semibold hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

