import { Suspense } from "react";
import { PracticeShell } from "@/components/practice-shell";

export const metadata = {
  title: "Practice · Dart Quiz 1",
};

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <span className="text-muted-foreground text-sm animate-pulse">Loading…</span>
        </div>
      }
    >
      <PracticeShell />
    </Suspense>
  );
}
