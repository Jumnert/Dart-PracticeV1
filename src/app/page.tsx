import Link from "next/link";
import { ArrowRight, Play, Terminal as TerminalIcon } from "lucide-react";

import { LearnCatalog } from "@/components/learn-catalog";
import { Badge } from "@/components/ui/badge";
import { TextGradient } from "@/components/ui/text-gradient";
import { exercises } from "@/data/exercises";

export default function LearnPage() {
  const totalOutputLines = exercises.reduce((sum, item) => sum + item.outputLines, 0);

  return (
    <>
      <section className="melon-grid relative overflow-hidden border-b border-border/60">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <Badge
            variant="outline"
            className="rounded-full border-melon/40 bg-melon/10 px-3 py-1 text-melon"
          >
            Quiz 1 · if-else, switch, loops, functions
          </Badge>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Read the answer, then{" "}
            <TextGradient
              highlightColor="var(--melon)"
              baseColor="var(--foreground)"
              duration={3.2}
              spread={40}
            >
              write it yourself
            </TextGradient>
            .
          </h1>

          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            All {exercises.length} exercises from the quiz sheet with a worked Dart answer you can
            execute on the spot. Every answer here was run through the Dart SDK, so the expected
            output is real output — {totalOutputLines.toLocaleString()} lines of it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/practice"
              className="group inline-flex items-center gap-2 rounded-full bg-melon px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-melon/20 transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <Play className="size-4" />
              Start practicing
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#exercise-1"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium transition-colors hover:border-melon/40 hover:text-melon"
            >
              <TerminalIcon className="size-4" />
              Browse the answers
            </a>
          </div>
        </div>
      </section>

      <LearnCatalog />
    </>
  );
}
