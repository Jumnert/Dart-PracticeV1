import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://dart-quiz-1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dart Quiz Month 1 — Practice & Learn",
    template: "%s · Dart Quiz Month 1",
  },
  description:
    "Practice all 60 Dart exercises from Quiz Month 1. Master conditionals, for loops, while loops, and functions with a live Dart runner that checks your output instantly.",
  keywords: [
    "dart quiz month 1",
    "dart quiz 1",
    "dart programming exercises",
    "dart practice",
    "dart conditionals",
    "dart for loop",
    "dart while loop",
    "dart functions",
    "learn dart",
    "dart exercises",
  ],
  authors: [{ name: "Dart Quiz Month 1" }],
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Dart Quiz Month 1 — Practice & Learn",
    description:
      "60 Dart exercises from Quiz Month 1. Practice conditionals, loops, and functions with a live Dart runner.",
    siteName: "Dart Quiz Month 1",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dart Quiz Month 1 — Practice & Learn",
    description:
      "60 Dart exercises from Quiz Month 1. Practice conditionals, loops, and functions with a live Dart runner.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ scrollPaddingTop: "80px" }}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col bg-background">
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
