import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Naadabrahma AI | Where Tradition Meets Intelligence",
  description: "The world's most comprehensive AI-powered Indian Classical Music Learning Platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-[#1A2228] font-sans selection:bg-[#800020]/20 selection:text-[#800020]">
        {children}
      </body>
    </html>
  );
}
