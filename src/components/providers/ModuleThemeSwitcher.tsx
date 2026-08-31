"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Maps URL paths → module theme name (matches data-module in globals.css)
const MODULE_MAP: { pattern: string; module: string }[] = [
  { pattern: "/knowledge-hub", module: "knowledge-hub" },
  { pattern: "/notes",         module: "notes"         },
  { pattern: "/ai-guru",       module: "ai-guru"       },
  { pattern: "/instruments",   module: "instruments"   },
  { pattern: "/student",       module: "student"       },
  { pattern: "/teacher",       module: "teacher"       },
  { pattern: "/admin",         module: "admin"         },
  { pattern: "/",              module: "home"          },
];

export function ModuleThemeSwitcher() {
  const pathname = usePathname();

  useEffect(() => {
    const match = MODULE_MAP.find(m =>
      m.pattern === "/" ? pathname === "/" : pathname.startsWith(m.pattern)
    );
    const module = match?.module ?? "home";
    document.documentElement.setAttribute("data-module", module);

    return () => {
      document.documentElement.removeAttribute("data-module");
    };
  }, [pathname]);

  return null;
}
