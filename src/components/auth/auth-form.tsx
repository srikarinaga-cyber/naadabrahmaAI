"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signIn as serverSignIn, signUp as serverSignUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [portal, setPortal] = useState<"student" | "teacher">("student");
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

    const targetDestination = portal === "teacher" ? "/teacher" : "/student";

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
        setSuccess(`Login successful! Entering ${portal === "teacher" ? "Teacher Portal" : "Student Dashboard"}...`);
        window.location.href = targetDestination;
      } else {
        if (supabase) {
          const { error: authError } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { name: name.trim(), role: portal },
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
        window.location.href = targetDestination;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected authentication error occurred.");
      setLoading(false);
    }
  }

  const handleDemoLogin = (targetRole: "student" | "teacher") => {
    setLoading(true);
    setError(null);
    setSuccess(`Accessing ${targetRole === "teacher" ? "Teacher Portal" : "Student Dashboard"}...`);
    const targetUrl = targetRole === "teacher" ? "/teacher" : "/student";
    window.location.href = targetUrl;
  };

  const isEmailConfirmationError =
    error && (error.toLowerCase().includes("email not confirmed") || error.toLowerCase().includes("rate limit"));

  return (
    <div className="space-y-4">
      {/* ── Role / Portal Switcher ── */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1 border border-border/50">
        <button
          type="button"
          onClick={() => setPortal("student")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
            portal === "student"
              ? "bg-card text-kumkum shadow-sm font-bold border border-swara-gold/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="size-3.5" />
          Student Portal
        </button>
        <button
          type="button"
          onClick={() => setPortal("teacher")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
            portal === "teacher"
              ? "bg-card text-kumkum shadow-sm font-bold border border-swara-gold/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-3.5" />
          Teacher Portal (Guru)
        </button>
      </div>

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
                placeholder={portal === "teacher" ? "Guru Sangeetha" : "Student Name"}
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
              placeholder={portal === "teacher" ? "teacher@naadabrahma.ai" : "student@naadabrahma.ai"}
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0" />
              <p>{error}</p>
            </div>

            {/* Smart fallback for email confirmation or rate limit */}
            {isEmailConfirmationError && (
              <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-amber-600 shrink-0" />
                  Instant Access Available
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Supabase requires email verification. Click below to open your portal instantly:
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(portal)}
                  className="w-full border-amber-400 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-1.5 h-auto rounded-lg"
                >
                  <Sparkles className="mr-1.5 size-3 text-amber-700" />
                  Enter {portal === "teacher" ? "Teacher Portal" : "Student Dashboard"} Instantly
                </Button>
              </div>
            )}
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
              Redirecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {mode === "login"
                ? portal === "teacher"
                  ? "Sign In as Guru"
                  : "Sign In as Student"
                : portal === "teacher"
                ? "Create Guru Account"
                : "Create Student Account"}
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">Or quick access</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("student")}
          disabled={loading}
          className="border-swara-gold/30 hover:border-swara-gold hover:bg-swara-gold/10 text-foreground font-medium rounded-xl text-xs py-2 h-auto transition-all flex items-center justify-center gap-1"
        >
          <GraduationCap className="size-3.5 text-swara-gold" />
          Demo Student
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("teacher")}
          disabled={loading}
          className="border-swara-gold/30 hover:border-swara-gold hover:bg-swara-gold/10 text-foreground font-medium rounded-xl text-xs py-2 h-auto transition-all flex items-center justify-center gap-1"
        >
          <Users className="size-3.5 text-kumkum" />
          Demo Teacher
        </Button>
      </div>

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
    </div>
  );
}
