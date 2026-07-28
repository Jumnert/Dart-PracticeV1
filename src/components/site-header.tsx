"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BsFileTextFill } from "react-icons/bs";
import { PiTerminalWindowFill } from "react-icons/pi";

import { FluidTabs } from "@/components/ui/fluid-tabs";
import { exercises } from "@/data/exercises";
import { useProgress } from "@/lib/progress";

const TABS = [
  { id: "learn", label: "Learn", icon: <BsFileTextFill size={18} /> },
  { id: "practice", label: "Practice", icon: <PiTerminalWindowFill size={20} /> },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { solved, hydrated } = useProgress();

  const active = pathname.startsWith("/practice") ? "practice" : "learn";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-full bg-melon text-sm font-black text-white shadow-sm transition-transform group-hover:scale-105">
            D
            <span className="absolute -bottom-0.5 h-1.5 w-4 rounded-full bg-rind" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            Dart Practice
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 align-middle text-[10px] font-medium text-muted-foreground">
              Quiz 1
            </span>
          </span>
        </Link>

        {/* Nav tabs */}
        <nav aria-label="Sections" className="shrink-0">
          <FluidTabs
            tabs={TABS}
            defaultActive={active}
            onChange={(id) => router.push(id === "practice" ? "/practice" : "/")}
          />
        </nav>

        {/* Progress pill */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5">
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {hydrated ? solved.length : 0}
            <span className="opacity-60">/{exercises.length}</span> solved
          </span>
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-rind transition-[width] duration-500"
              style={{ width: `${((hydrated ? solved.length : 0) / exercises.length) * 100}%` }}
            />
          </span>
        </div>

      </div>
    </header>
  );
}
