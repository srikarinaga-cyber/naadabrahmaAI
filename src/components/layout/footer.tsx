import Link from "next/link";
import { Music2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Platform: [
    { label: "Knowledge Hub", href: "/knowledge-hub" },
    { label: "Notes & PDFs", href: "/notes" },
    { label: "AI Guru", href: "/ai-guru" },
    { label: "Search", href: "/search" },
    { label: "Examinations", href: "/student/exam" },
  ],
  Roles: [
    { label: "Students", href: "/student" },
    { label: "Teachers", href: "/teacher" },
    { label: "Academies", href: "/academy" },
    { label: "Administrators", href: "/admin" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-swara-gold/15 bg-shanti-slate text-sandalwood">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-kumkum/20 ring-1 ring-swara-gold/30">
                <Music2 className="size-5 text-swara-gold" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-lg font-bold tracking-wide">
                  {siteConfig.name.toUpperCase()}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-swara-gold/80">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-sandalwood/70">
              {siteConfig.description}
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-swara-gold">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sandalwood/65 transition-colors hover:text-sandalwood"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-sandalwood/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-sandalwood/50 md:flex-row">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p>Preserving heritage. Empowering minds.</p>
        </div>
      </div>
    </footer>
  );
}
