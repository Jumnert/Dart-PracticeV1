"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsBraces, BsListNested } from "react-icons/bs";
import { TbRepeat, TbMathFunction } from "react-icons/tb";
import { HiOutlineViewGrid } from "react-icons/hi";

import { ExerciseCard } from "@/components/exercise-card";
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
      ...categories.map((category) => ({
        id: category.id,
        label: category.short,
        icon: ICONS[category.id],
      })),
    ],
    [],
  );

  const visible = useMemo(
    () => (filter === "all" ? exercises : exercises.filter((item) => item.category === filter)),
    [filter],
  );

  const activeCategory = filter === "all" ? null : categoryOf(filter);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
      <div className="sticky top-16 z-30 -mx-4 mb-8 flex flex-col gap-3 border-b border-border/50 bg-background/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <FluidTabs
          tabs={tabs}
          defaultActive="all"
          onChange={(id) => setFilter(id as Filter)}
        />
        <p className="text-xs text-muted-foreground">
          {activeCategory ? activeCategory.blurb : "Every exercise from the quiz sheet, in order."}
        </p>
      </div>

      <motion.div layout className="grid gap-5">
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
