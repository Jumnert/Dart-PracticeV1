"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { exercises } from "@/data/exercises";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { solved, hydrated } = useProgress();

  const isLearn = !pathname.startsWith("/practice");
  const isPractice = pathname.startsWith("/practice");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex size-7 items-center justify-center rounded-full bg-melon text-xs font-black text-white shadow-sm transition-transform group-hover:scale-105">
            D
            <span className="absolute -bottom-0.5 h-1 w-3.5 rounded-full bg-rind" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Dart Practice
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 align-middle text-[10px] font-medium text-muted-foreground">
              Quiz 1
            </span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Sections">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              isLearn
                ? "bg-foreground/8 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Learn
          </Link>
          <Link
            href="/practice"
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              isPractice
                ? "bg-foreground/8 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Practice
          </Link>
        </nav>

        {/* Right side: progress + theme toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {hydrated ? solved.length : 0}
              <span className="opacity-50">/{exercises.length}</span>
            </span>
            <span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-rind transition-[width] duration-500"
                style={{ width: `${((hydrated ? solved.length : 0) / exercises.length) * 100}%` }}
              />
            </span>
          </div>

          <AnimatedThemeToggler
            variant="circle"
            duration={400}
            className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
          />
        </div>

      </div>
    </header>
  );
}
