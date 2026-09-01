"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      {/* High-Visibility Sangeetha Trinity Artwork Background Theme for Portal Modules */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.25] dark:opacity-[0.30]"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#FAF6F0]/60 via-[#FAF6F0]/40 to-[#FAF6F0]/80" />

      <aside className="relative z-10 w-full md:w-64 border-r border-[#D4AF37]/20 bg-white/85 backdrop-blur-md flex flex-col justify-between p-6 shadow-sm">
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
              const isExternalModule = item.href === "/knowledge-hub" || item.href === "/search";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#800020]/15 text-[#800020] border-l-2 border-[#800020] font-bold shadow-xs"
                      : "text-[#1A2228]/70 hover:bg-[#FAF6F0] hover:text-[#800020]"
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

        <div className="border-t border-[#D4AF37]/10 pt-4 mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#800020]/10 flex items-center justify-center font-bold text-[#800020] text-xs">
              SK
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1A2228]">Srinivas K.</h4>
              <p className="text-[9px] text-[#1A2228]/50">Student Profile</p>
            </div>
          </div>
          <Link
            href="/"
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors text-xs"
            title="Log Out"
          >
            ❌
          </Link>
        </div>
      </aside>

      <main className="relative z-10 flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#D4AF37]/10 bg-white/60 p-4 rounded-2xl backdrop-blur-md shadow-xs">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#800020]">
              Welcome back, Srinivas
            </h3>
            <p className="text-xs text-[#1A2228]/60 mt-0.5">
              Let&apos;s continue your musical learning journey.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-[#E68A00]/10 border border-[#E68A00]/25 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-sm">🔥</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#E68A00] tracking-wide -mb-0.5">
                  Streak
                </p>
                <p className="text-xs font-extrabold text-[#1A2228]">7 Days</p>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
