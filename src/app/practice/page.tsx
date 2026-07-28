import type { Metadata } from "next";
import { Suspense } from "react";
import { PracticeShell } from "@/components/practice-shell";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Write and run Dart code for all 60 Quiz Month 1 exercises. Get instant feedback — your output is compared line-by-line against the expected result.",
  alternates: {
    canonical: "/practice",
  },
};

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span className="text-muted-foreground text-sm animate-pulse">Loading…</span>
        </div>
      }
    >
      <PracticeShell />
    </Suspense>
  );
}
