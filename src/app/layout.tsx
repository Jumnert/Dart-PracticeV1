import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dart Practice · Quiz 1",
  description:
    "Learn and practice all 60 Dart exercises from Quiz 1 — conditionals, loops, and functions — with a live Dart runner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="border-t border-border/60 py-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
            <p>
              60 exercises from Quiz 1 · answers executed with the Dart SDK
            </p>
            <p className="font-mono">Built with Watermelon UI</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
