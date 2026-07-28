"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsBraces, BsListNested } from "react-icons/bs";
import { TbRepeat, TbMathFunction } from "react-icons/tb";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

import { ExerciseCard } from "@/components/exercise-card";
import { CommandSearch, type CommandItem } from "@/components/ui/command-search";
import { FluidTabs } from "@/components/ui/fluid-tabs";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { categories, categoryOf, exercises, type CategoryId } from "@/data/exercises";
import { useProgress } from "@/lib/progress";

type Filter = CategoryId | "all";

const ICONS: Record<Filter, React.ReactNode> = {
  all: <HiOutlineViewGrid size={19} />,
  conditionals: <BsBraces size={17} />,
  "for-loop": <BsListNested size={17} />,
  "while-loop": <TbRepeat size={19} />,
  functions: <TbMathFunction size={19} />,
};

export function LearnCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const { solved, hydrated } = useProgress();

  const tabs = useMemo(
    () => [
      { id: "all", label: `All ${exercises.length}`, icon: ICONS.all },
      ...categories.map((c) => ({
        id: c.id,
        label: c.short,
        icon: ICONS[c.id],
      })),
    ],
    [],
  );

  const searchItems = useMemo<CommandItem[]>(
    () =>
      exercises.map((ex) => ({
        id: String(ex.id),
        title: `${ex.id.toString().padStart(2, "0")} · ${ex.title}`,
        subtitle: ex.summary,
        section: categoryOf(ex.category).label,
        icon: <ArrowRight size={14} />,
        action: () => {
          const el = document.getElementById(`exercise-${ex.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      })),
    [],
  );

  const visible = useMemo(
    () => (filter === "all" ? exercises : exercises.filter((item) => item.category === filter)),
    [filter],
  );

  const activeCategory = filter === "all" ? null : categoryOf(filter);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Floating sticky FAB bar ── */}
      <div className="sticky top-4 z-30 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-xl">
          {/* Tabs */}
          <FluidTabs
            tabs={tabs}
            defaultActive="all"
            onChange={(id) => setFilter(id as Filter)}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-border/60" />

          {/* Search */}
          <CommandSearch
            items={searchItems}
            triggerLabel="Search exercises"
            placeholder="Search by title or topic"
          />

          {/* Divider */}
          <div className="h-5 w-px bg-border/60" />

          {/* Practice link */}
          <Link
            href="/practice"
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-melon/40 hover:text-foreground"
          >
            <Code2 size={15} />
            Practice
          </Link>

          {/* Dark mode toggle */}
          <AnimatedThemeToggler
            variant="circle"
            duration={400}
            className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
          />
        </div>
      </div>

      {activeCategory && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{activeCategory.blurb}</p>
      )}

      {/* ── Exercise list ── */}
      <motion.div layout className="mt-6 grid gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((exercise) => (
            <motion.div
              key={exercise.id}
              layout
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ExerciseCard
                exercise={exercise}
                categoryLabel={categoryOf(exercise.category).label}
                solved={hydrated && solved.includes(exercise.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
