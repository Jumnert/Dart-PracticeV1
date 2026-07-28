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
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
      {/* ── Sticky filter bar ── */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border/50 bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
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
