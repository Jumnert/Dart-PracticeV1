"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsBraces, BsListNested } from "react-icons/bs";
import { TbRepeat, TbMathFunction } from "react-icons/tb";
import { HiOutlineViewGrid } from "react-icons/hi";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { ExerciseCard } from "@/components/exercise-card";
import { CommandSearch, type CommandItem } from "@/components/ui/command-search";
import { categories, categoryOf, exercises, type CategoryId } from "@/data/exercises";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "all";

const ICONS: Record<Filter, React.ReactNode> = {
  all: <HiOutlineViewGrid size={20} />,
  conditionals: <BsBraces size={18} />,
  "for-loop": <BsListNested size={18} />,
  "while-loop": <TbRepeat size={20} />,
  functions: <TbMathFunction size={20} />,
};

const CATEGORY_CARDS: { id: Filter; label: string; short: string; count: number; blurb: string }[] =
  [
    {
      id: "all",
      label: "All",
      short: "All",
      count: exercises.length,
      blurb: "Every exercise",
    },
    ...categories.map((c) => ({
      id: c.id as Filter,
      label: c.label,
      short: c.short,
      count: exercises.filter((e) => e.category === c.id).length,
      blurb: c.blurb,
    })),
  ];

export function LearnCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const { solved, hydrated } = useProgress();
  const router = useRouter();

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

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
      {/* ── Filter bar: category grid on the left, search on the right ── */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border/50 bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category grid */}
          <div className="grid grid-cols-5 gap-2">
            {CATEGORY_CARDS.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={cn(
                    "group flex min-w-[96px] flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                    active
                      ? "border-melon/40 bg-melon/8 shadow-sm ring-1 ring-melon/20"
                      : "border-border/60 bg-white hover:border-melon/30 hover:bg-melon/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center gap-1.5 transition-colors",
                      active ? "text-melon" : "text-muted-foreground group-hover:text-melon/80",
                    )}
                  >
                    {ICONS[cat.id]}
                    <span
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-wider",
                        active ? "text-melon" : "text-muted-foreground",
                      )}
                    >
                      {cat.short}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-bold tabular-nums leading-none",
                      active ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {cat.count}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="shrink-0">
            <CommandSearch
              items={searchItems}
              triggerLabel="Search exercises"
              placeholder="Search by title or topic"
            />
          </div>
        </div>
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
