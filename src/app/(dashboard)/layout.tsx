"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  exact?: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("Srinivas K.");
  const [userInitials, setUserInitials] = useState<string>("SK");

  useEffect(() => {
    // 1. Try reading from localStorage or cookies
    const storedName =
      typeof window !== "undefined"
        ? localStorage.getItem("naada_user_name")
        : null;

    let cookieName: string | null = null;
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )naada_user_name=([^;]*)/);
      if (match) cookieName = decodeURIComponent(match[1]);
    }

    const currentName = storedName || cookieName;
    if (currentName) {
      setUserName(currentName);
      updateInitials(currentName);
    }

    // 2. Also check active Supabase Auth user session if available
    try {
      const supabase = createClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            const metaName =
              data.user.user_metadata?.name || data.user.email?.split("@")[0];
            if (metaName) {
              const formattedName = metaName
                .replace(/[._-]/g, " ")
                .split(" ")
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              setUserName(formattedName);
              updateInitials(formattedName);
            }
          }
        });
      }
    } catch (e) {
      console.warn("Supabase auth layout fetch error:", e);
    }
  }, []);

  function updateInitials(nameStr: string) {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      setUserInitials((parts[0][0] + parts[1][0]).toUpperCase());
    } else if (parts.length === 1 && parts[0].length > 0) {
      setUserInitials(parts[0].slice(0, 2).toUpperCase());
    } else {
      setUserInitials("SK");
    }
  }

  function handleLogout() {
    try {
      document.cookie =
        "naada_demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "naada_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      if (typeof window !== "undefined") {
        localStorage.removeItem("naada_user_name");
      }
      try {
        const supabase = createClient();
        if (supabase) supabase.auth.signOut();
      } catch (e) {
        console.warn("Signout warning:", e);
      }
    } catch (e) {
      console.warn("Logout error:", e);
    }
    window.location.href = "/login?logout=true";
  }

  const NAV_ITEMS: NavItem[] = [
    { name: "Student Home", href: "/student", icon: "📊", exact: true },
    { name: "Practice Hub", href: "/student/exam", icon: "🎵" },
    { name: "Knowledge Hub", href: "/knowledge-hub", icon: "📖" },
    { name: "Notes & PDFs", href: "/notes", icon: "📝" },
    { name: "AI Guru Chat", href: "/student/guru", icon: "🧘‍♂️" },
    { name: "Search", href: "/search", icon: "🔍" },
  ];

  function isNavActive(item: NavItem) {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }

  return (
    <div className="relative min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row overflow-hidden">
      {/* High-Visibility Realistic Sangeetha Trinity Background Theme showing all 3 Saints */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-[0.50] dark:opacity-[0.45]"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#FAF6F0]/30 via-transparent to-[#FAF6F0]/50" />

      {/* Ultra-Translucent Sidebar so the first person on the left is 100% visible */}
      <aside className="relative z-10 w-full md:w-64 border-r border-[#D4AF37]/25 bg-white/35 backdrop-blur-md flex flex-col justify-between p-6 shadow-xs">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🕉️</span>
            <div>
              <h2 className="font-serif text-sm font-bold text-[#800020] tracking-wide">
                NAADABRAHMA
              </h2>
              <p className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-semibold -mt-0.5">
                Portal
              </p>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Student portal navigation">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item);
              const isExternalModule =
                item.href === "/knowledge-hub" || item.href === "/search";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#800020]/20 text-[#800020] border-l-2 border-[#800020] font-bold shadow-xs backdrop-blur-xs"
                      : "text-[#1A2228]/80 hover:bg-white/40 hover:text-[#800020]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                  {isExternalModule && active && (
                    <span className="ml-auto text-[8px] text-gray-400">↗</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logged In User Profile & Logout Button */}
        <div className="border-t border-[#D4AF37]/20 pt-4 mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#800020]/15 shrink-0 flex items-center justify-center font-bold text-[#800020] text-xs shadow-xs">
              {userInitials}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-[#1A2228] truncate" title={userName}>
                {userName}
              </h4>
              <p className="text-[9px] text-[#1A2228]/60">Student Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-100 text-red-700 transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
            title="Log Out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D4AF37]/20 bg-white/50 p-4 rounded-2xl backdrop-blur-md shadow-xs">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#800020]">
              Welcome back, {userName}
            </h3>
            <p className="text-xs text-[#1A2228]/70 mt-0.5">
              Let&apos;s continue your musical learning journey.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#E68A00]/15 border border-[#E68A00]/30 rounded-lg px-3 py-1.5 flex items-center space-x-2 backdrop-blur-xs">
              <span className="text-sm">🔥</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#E68A00] tracking-wide -mb-0.5">
                  Streak
                </p>
                <p className="text-xs font-extrabold text-[#1A2228]">7 Days</p>
              </div>
            </div>

            {/* Header Log Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-600/20 text-red-700 text-xs font-bold transition-all shadow-xs"
              title="Log Out of Portal"
            >
              <LogOut className="size-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
