"use client";

import Link from "next/link";
import { Menu, Music2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-swara-gold/20 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-kumkum/10 ring-1 ring-swara-gold/30 transition-colors group-hover:bg-kumkum/15">
            <Music2 className="size-5 text-kumkum" aria-hidden />
          </div>
          <div>
            <p className="font-serif text-lg font-bold leading-tight tracking-wide text-kumkum">
              {siteConfig.name.toUpperCase()}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-swara-gold">
              {siteConfig.tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-kumkum"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm" className="text-kumkum">
              Sign In
            </Button>
            <Button size="sm" className="bg-kumkum hover:bg-kumkum-light">
              Get Started
            </Button>
          </div>

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
                <SheetTitle className="font-serif text-kumkum">
                  {siteConfig.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full bg-kumkum hover:bg-kumkum-light">
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
