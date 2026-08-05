"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "Student Home", href: "/student", icon: "📊" },
    { name: "Knowledge Hub", href: "/knowledge", icon: "📖" },
    { name: "AI Guru Chat", href: "/student/guru", icon: "🧘‍♂️" },
    { name: "Exam Hub", href: "/student/exam", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-r border-[#D4AF37]/20 bg-white flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Dashboard Logo */}
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

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              // Exact matches or subdirectory active states
              const isActive = pathname.startsWith(item.href) || pathname === `/student${item.href}`;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#800020]/5 text-[#800020] border-l-2 border-[#800020]"
                      : "text-[#1A2228]/70 hover:bg-[#FAF6F0] hover:text-[#800020]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer info */}
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

      {/* Main dashboard content viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#D4AF37]/10">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#800020]">
              Welcome back, Srinivas
            </h3>
            <p className="text-xs text-[#1A2228]/60 mt-0.5">
              Let's continue your musical learning journey.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Streak Badge */}
            <div className="bg-[#E68A00]/10 border border-[#E68A00]/25 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-sm">🔥</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#E68A00] tracking-wide -mb-0.5">Streak</p>
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
