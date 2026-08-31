import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FloatingTanpura } from "@/components/music/FloatingTanpura";
import { MusicBackground } from "@/components/music/MusicBackground";
import { ModuleThemeSwitcher } from "@/components/providers/ModuleThemeSwitcher";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground selection:bg-kumkum/20 selection:text-kumkum">
        {/* Module theme switcher — changes CSS vars on route change */}
        <ModuleThemeSwitcher />
        {/* Fixed background — outside all scroll containers */}
        <MusicBackground />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {/* Floating Tanpura — direct child of body so fixed positioning always works */}
        <FloatingTanpura />
      </body>
    </html>
  );
}
