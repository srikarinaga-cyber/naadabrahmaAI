"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Music2, LogOut, UserCheck, Languages } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { SITE_LANGUAGES } from "@/lib/data/site-i18n";
import type { SupportedLanguage } from "@/lib/ai/context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const storedName =
      typeof window !== "undefined"
        ? localStorage.getItem("naada_user_name")
        : null;

    let cookieName: string | null = null;
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )naada_user_name=([^;]*)/);
      if (match) cookieName = decodeURIComponent(match[1]);
    }

    const name = storedName || cookieName;
    if (name) {
      setUserName(name);
    }
  }, []);

  function handleLogout() {
    document.cookie =
      "naada_demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "naada_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (typeof window !== "undefined") {
      localStorage.removeItem("naada_user_name");
    }
    window.location.href = "/login?logout=true";
  }

  const navLabels: Record<string, string> = {
    "/": t.navHome,
    "/knowledge-hub": t.navKnowledgeHub,
    "/ai-guru": t.navAiGuru,
    "/instruments": t.navInstruments,
    "/notes": t.navNotes,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-swara-gold/30 bg-background/90 backdrop-blur-xl shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#800020] to-[#D4AF37] p-1 shadow-md border border-amber-300/40">
            <Music2 className="size-5 text-white" aria-hidden />
          </div>
          <div>
            <p className="font-serif text-lg font-extrabold leading-tight tracking-wide text-[#800020] dark:text-amber-200">
              {siteConfig.name.toUpperCase()}
            </p>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-swara-gold">
              {siteConfig.tagline}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-extrabold text-foreground/90 transition-colors hover:text-[#800020] dark:hover:text-amber-300"
            >
              {navLabels[item.href] || item.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Language Selector */}
        <div className="flex items-center gap-3">
          {/* Site-Wide Global Multilingual Language Switcher */}
          <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-xl border border-swara-gold/40 shadow-2xs">
            <Languages className="size-3.5 text-[#800020] dark:text-amber-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="rounded-lg border border-swara-gold/40 bg-card px-2 py-0.5 text-xs font-extrabold text-[#800020] dark:text-amber-200 focus:outline-none shadow-2xs cursor-pointer"
            >
              {SITE_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <ThemeToggle />

          <div className="hidden items-center gap-2 sm:flex">
            {userName ? (
              <>
                <Link
                  href="/student"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020]/10 text-[#800020] dark:text-amber-200 border border-[#800020]/30 text-xs font-extrabold hover:bg-[#800020] hover:text-white transition-all shadow-2xs"
                >
                  <UserCheck className="size-3.5" />
                  <span>{userName}</span>
                </Link>
                <Button
                  size="sm"
                  className="bg-[#800020] hover:bg-[#A00028] text-white font-extrabold rounded-xl px-3.5 py-1.5 text-xs shadow-xs"
                  render={<Link href="/student" />}
                >
                  {t.navStudentPortal}
                </Button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-bold"
                  title={t.navLogout}
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-[#800020] dark:text-amber-200 font-extrabold text-xs" render={<Link href="/login" />}>
                  {t.navSignIn}
                </Button>
                <Button size="sm" className="bg-[#800020] hover:bg-[#A00028] text-white font-extrabold rounded-xl text-xs px-3.5" render={<Link href="/signup" />}>
                  {t.navGetStarted}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-serif text-[#800020] font-extrabold">
                  {siteConfig.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-4" aria-label="Mobile navigation">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-xs font-extrabold text-foreground transition-colors hover:bg-muted"
                  >
                    {navLabels[item.href] || item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
