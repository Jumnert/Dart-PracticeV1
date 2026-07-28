import type { Metadata } from "next";
import { LearnCatalog } from "@/components/learn-catalog";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Browse all 60 Dart exercises from Quiz Month 1 — conditionals, for loops, while loops, and functions. Click any card to see the solution and run it live.",
  alternates: {
    canonical: "/",
  },
};

export default function LearnPage() {
  return <LearnCatalog />;
}
