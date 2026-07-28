"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsBraces, BsListNested } from "react-icons/bs";
import { TbRepeat, TbMathFunction } from "react-icons/tb";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ArrowRight } from "lucide-react";

import { ExerciseCard } from "@/components/exercise-card";
import { CommandSearch, type CommandItem } from "@/components/ui/command-search";
import { FluidTabs } from "@/components/ui/fluid-tabs";
import { categories, categoryOf, exercises, type CategoryId } from "@/data/exercises";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "all";

const ICONS: Record<Filter, React.ReactNode> = {
  all: <HiOutlineViewGrid size={19} />,
  conditionals: <BsBraces size={17} />,
  "for-loop": <BsListNested size={17} />,
  "while-loop": <TbRepeat size={19} />,
  functions: <TbMathFunction size={19} />,
};

const CATEGORY_CARDS = [
  {
    id: "all" as Filter,
    short: "All",
    label: "All Exercises",
    count: exercises.length,
  },
  ...categories.map((c) => ({
    id: c.id as Filter,
    short: c.short,
    label: c.label,
    count: exercises.filter((e) => e.category === c.id).length,
  })),
];

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
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border/50 bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">

        {/* Category stat grid */}
        <div className="mb-4 grid grid-cols-5 gap-2">
          {CATEGORY_CARDS.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                  active
                    ? "border-melon/40 bg-melon/8 shadow-sm ring-1 ring-melon/20"
                    : "border-border/60 bg-white hover:border-melon/30 hover:bg-melon/5",
                )}
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    active ? "text-melon" : "text-muted-foreground",
                  )}
                >
                  {ICONS[cat.id]}
                  <span className={cn("text-[11px] font-semibold uppercase tracking-wider", active ? "text-melon" : "text-muted-foreground")}>
                    {cat.short}
                  </span>
                </span>
                <span className={cn("text-2xl font-bold tabular-nums leading-none", active ? "text-foreground" : "text-foreground/80")}>
                  {cat.count}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FluidTabs + search row */}
        <div className="flex items-center justify-between gap-4">
          <FluidTabs
            tabs={tabs}
            defaultActive="all"
            onChange={(id) => setFilter(id as Filter)}
          />
          <div className="shrink-0">
            <CommandSearch
              items={searchItems}
              triggerLabel="Search exercises"
              placeholder="Search by title or topic"
            />
          </div>
        </div>

        {activeCategory && (
          <p className="mt-2 text-xs text-muted-foreground">{activeCategory.blurb}</p>
        )}
      </div>

      {/* ── Exercise list ── */}
      <motion.div layout className="mt-8 grid gap-5">
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
