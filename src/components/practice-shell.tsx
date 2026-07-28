"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { BsBraces } from "react-icons/bs";
import { PiTerminalWindowFill } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import { TbRepeat } from "react-icons/tb";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ArrowRight } from "lucide-react";

import { DartEditor } from "@/components/dart-editor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommandSearch, type CommandItem } from "@/components/ui/command-search";
import { RunActionButton, type RunStatus } from "@/components/ui/run-action-button";
import { Separator } from "@/components/ui/separator";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spinner } from "@/components/ui/spinner";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Terminal } from "@/components/ui/terminal";
import { TextGradient } from "@/components/ui/text-gradient";
import {
  categories,
  categoryOf,
  exerciseById,
  exercises,
  type Exercise,
} from "@/data/exercises";
import { celebrate } from "@/lib/confetti";
import { loadDraft, saveDraft, useProgress } from "@/lib/progress";
import { compareOutput, runDart } from "@/lib/run-dart";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────────
// Exercise Picker sidebar
// ───────────────────────────────────────────────────────────────────
type ExerciseListProps = {
  current: number;
  onSelect: (id: number) => void;
  solved: number[];
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  conditionals: <BsBraces size={13} />,
  "for-loop": <HiOutlineViewGrid size={13} />,
  "while-loop": <TbRepeat size={14} />,
  functions: <TbMathFunction size={14} />,
};

function ExerciseList({ current, onSelect, solved }: ExerciseListProps) {
  return (
    <nav className="custom-scrollbar flex h-full flex-col overflow-y-auto pb-6">
      {categories.map((cat) => {
        const catExercises = exercises.filter((e) => e.category === cat.id);
        return (
          <div key={cat.id} className="mb-1">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="text-muted-foreground">{CATEGORY_ICONS[cat.id]}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {cat.label}
              </span>
            </div>
            <div className="space-y-0.5 px-2">
              {catExercises.map((ex) => {
                const isActive = ex.id === current;
                const isSolved = solved.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelect(ex.id)}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-melon/15 text-foreground ring-1 ring-melon/30"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold tabular-nums",
                        isSolved
                          ? "bg-rind/20 text-rind"
                          : isActive
                            ? "bg-melon/20 text-melon"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {ex.id}
                    </span>
                    <span className="truncate font-medium">{ex.title}</span>
                    {isSolved && (
                      <CheckCircle2 className="ml-auto size-3.5 shrink-0 text-rind" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ───────────────────────────────────────────────────────────────────
// Output diff viewer
// ───────────────────────────────────────────────────────────────────
function OutputPanel({
  stdout,
  stderr,
  exitCode,
  durationMs,
  expected,
  exerciseId,
}: {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  expected: string;
  exerciseId: number;
}) {
  const comparison = compareOutput(expected, stdout);
  const success = comparison.matches && exitCode === 0;

  return (
    <div className="space-y-4">
      <Terminal
        id={`run-${exerciseId}`}
        command={`dart run ex${exerciseId.toString().padStart(2, "0")}.dart`}
        stdout={stdout}
        stderr={stderr}
        exitCode={exitCode}
        maxCollapsedLines={20}
      />
      {!success && stdout.trim() && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="space-y-3 pt-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-red-500">
              <XCircle className="size-4" /> Output mismatch at line {comparison.firstMismatchLine}
            </p>
            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <p className="mb-1.5 font-medium text-muted-foreground uppercase">Expected</p>
                <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-rind">
                  {comparison.expectedLine ?? "(no more lines)"}
                </pre>
              </div>
              <div>
                <p className="mb-1.5 font-medium text-muted-foreground uppercase">Your output</p>
                <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-red-400">
                  {comparison.actualLine ?? "(no more lines)"}
                </pre>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Expected {comparison.expectedLineCount} lines · got {comparison.actualLineCount} lines
            </p>
          </CardContent>
        </Card>
      )}
      {success && (
        <Card className="border-rind/30 bg-rind/5">
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <CheckCircle2 className="size-5 text-rind" />
            <div>
              <p className="text-sm font-semibold text-rind">Perfect match!</p>
              <p className="text-xs text-muted-foreground">
                {comparison.expectedLineCount} lines matched · {durationMs}ms
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Main Practice workspace
// ───────────────────────────────────────────────────────────────────
type WorkspaceProps = {
  exercise: Exercise;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
};

function Workspace({ exercise, onPrev, onNext }: WorkspaceProps) {
  const { solved, isSolved, markSolved } = useProgress();
  const [code, setCode] = useState<string>(() => loadDraft(exercise.id) ?? exercise.starter);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [runResult, setRunResult] = useState<{
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
  } | null>(null);
  const [justSolved, setJustSolved] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // When the exercise changes load the new starter (or saved draft).
  useEffect(() => {
    setCode(loadDraft(exercise.id) ?? exercise.starter);
    setStatus("idle");
    setRunResult(null);
    setJustSolved(false);
    setShowAnswer(false);
  }, [exercise.id, exercise.starter]);

  // Auto-save draft.
  useEffect(() => {
    const t = window.setTimeout(() => saveDraft(exercise.id, code), 600);
    return () => window.clearTimeout(t);
  }, [exercise.id, code]);

  const run = useCallback(async () => {
    setStatus("running");
    setRunResult(null);
    const result = await runDart(code);
    setRunResult(result);
    const cmp = compareOutput(exercise.expectedOutput, result.stdout);
    const ok = cmp.matches && result.exitCode === 0;
    setStatus(ok ? "done" : "error");
    if (ok && !isSolved(exercise.id)) {
      markSolved(exercise.id);
      setJustSolved(true);
      await celebrate();
    }
  }, [code, exercise.expectedOutput, exercise.id, isSolved, markSolved]);

  const resetCode = useCallback(() => {
    setCode(exercise.starter);
    setStatus("idle");
    setRunResult(null);
    setJustSolved(false);
  }, [exercise.starter]);

  const alreadySolved = isSolved(exercise.id);

  return (
    <div className="grid h-full gap-0 xl:grid-cols-[1fr_440px]">
      {/* ── Left column: Editor ── */}
      <div className="flex min-h-0 flex-col gap-4 p-4 xl:overflow-y-auto">
        {/* Navigation breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Badge variant="outline" className="gap-1.5 rounded-full font-mono text-xs">
              {CATEGORY_ICONS[exercise.category]}
              {categoryOf(exercise.category).label}
            </Badge>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">
              {exercise.id.toString().padStart(2, "0")} · {exercise.title}
            </span>
            {alreadySolved && (
              <Badge className="rounded-full bg-rind/15 text-rind ring-1 ring-rind/30 text-xs">
                Solved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetCode}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
            <button
              type="button"
              onClick={() => setShowAnswer((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-melon"
            >
              {showAnswer ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              {showAnswer ? "Hide answer" : "Peek answer"}
            </button>
          </div>
        </div>

        <Card className="flex-1 overflow-hidden border-border/70 bg-card/60">
          <CardContent className="h-full p-0">
            <DartEditor
              value={code}
              onChange={setCode}
              onRun={run}
              minHeight={480}
              className="h-full rounded-none border-none"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusIndicator
              state={
                status === "running"
                  ? "fixing"
                  : status === "done"
                    ? "active"
                    : status === "error"
                      ? "down"
                      : "idle"
              }
              size="sm"
              label={
                status === "running"
                  ? "Compiling"
                  : status === "done"
                    ? `${runResult?.durationMs ?? 0}ms · matched`
                    : status === "error"
                      ? "Mismatch"
                      : "⌘ Enter to run"
              }
              labelClassName="text-xs text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-3">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 text-sm transition-colors hover:border-melon/40"
              >
                <ChevronLeft className="size-4" /> Prev
              </button>
            )}
            <RunActionButton
              status={status}
              onRun={run}
              onReset={() => setStatus("idle")}
              idleLabel="Run Code"
              runningLabel="Running"
              doneLabel="Correct! Run again"
              errorLabel="Try again"
            />
            <AnimatePresence>
              {(status === "done" || alreadySolved) && onNext && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  type="button"
                  onClick={onNext}
                  className="flex items-center gap-1.5 rounded-full bg-rind px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rind/20 transition-transform hover:scale-[1.03]"
                >
                  Next <ChevronRight className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Confetti success banner */}
        <AnimatePresence>
          {justSolved && (
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-xl border border-rind/30 bg-rind/10 px-5 py-3 text-sm"
            >
              <p className="font-semibold text-rind">
                🎉 Exercise {exercise.id} solved! Output matches perfectly.
              </p>
              {onNext && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Click <strong>Next</strong> to continue, or pick another exercise from the list.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right column: Instructions + Output ── */}
      <div className="custom-scrollbar flex flex-col gap-4 overflow-y-auto border-l border-border/60 bg-card/30 p-4">
        {/* Exercise brief */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">
            {exercise.id.toString().padStart(2, "0")} · {exercise.title}
          </h2>
          <p className="text-sm text-muted-foreground">{exercise.summary}</p>

          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Inputs
            </p>
            <ul className="space-y-1">
              {exercise.inputs.map((inp) => (
                <li key={inp} className="flex gap-2 text-xs">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-melon" />
                  <span className="font-mono">{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="size-3" /> Rules
            </p>
            <ul className="space-y-1.5">
              {exercise.rules.map((rule) => (
                <li key={rule} className="flex gap-2 text-xs text-foreground/80">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-rind" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Focus
            </p>
            <Badge variant="outline" className="rounded-full text-xs font-normal">
              {exercise.focus}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Answer peek */}
        <AnimatePresence initial={false}>
          {showAnswer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                Reference answer
              </p>
              <pre className="custom-scrollbar overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 font-mono text-xs leading-relaxed">
                {exercise.solution}
              </pre>
              <Separator className="mt-4" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expected output */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Expected output ({exercise.outputLines} lines)
          </p>
          <pre className="custom-scrollbar max-h-52 overflow-auto rounded-xl border border-border/60 bg-muted/20 p-4 font-mono text-xs leading-relaxed text-foreground/80">
            {exercise.expectedOutput}
          </pre>
        </div>

        {/* Run output */}
        <AnimatePresence initial={false}>
          {runResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your output
              </p>
              <OutputPanel
                stdout={runResult.stdout}
                stderr={runResult.stderr}
                exitCode={runResult.exitCode}
                durationMs={runResult.durationMs}
                expected={exercise.expectedOutput}
                exerciseId={exercise.id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Practice page shell
// ───────────────────────────────────────────────────────────────────
export function PracticeShell() {
  const router = useRouter();
  const params = useSearchParams();
  const { solved, hydrated } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentId = useMemo(() => {
    const raw = params.get("ex");
    const n = raw ? parseInt(raw, 10) : NaN;
    return !isNaN(n) && exerciseById.has(n) ? n : 1;
  }, [params]);

  const exercise = exerciseById.get(currentId)!;

  const goto = useCallback(
    (id: number) => {
      router.push(`/practice?ex=${id}`, { scroll: false });
      setSidebarOpen(false);
    },
    [router],
  );

  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < exercises.length ? currentId + 1 : null;

  const jumpItems = useMemo<CommandItem[]>(
    () =>
      exercises.map((ex) => ({
        id: String(ex.id),
        title: `${ex.id.toString().padStart(2, "0")} · ${ex.title}`,
        subtitle: ex.summary,
        section: categoryOf(ex.category).label,
        icon: <ArrowRight size={14} />,
        action: () => goto(ex.id),
      })),
    [goto],
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-[1600px] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-30 w-72 shrink-0 border-r border-border/60 bg-white transition-transform xl:relative xl:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
        )}
        style={{ marginTop: "3.5rem", height: "calc(100vh - 3.5rem)" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
          <span className="text-sm font-semibold">Exercises</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {hydrated ? solved.length : 0}/{exercises.length}
            <span className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-rind transition-[width] duration-500"
                style={{ width: `${((hydrated ? solved.length : 0) / exercises.length) * 100}%` }}
              />
            </span>
          </div>
        </div>
        <ExerciseList
          current={currentId}
          onSelect={goto}
          solved={hydrated ? solved : []}
        />
      </aside>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/40 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground xl:hidden"
          >
            All exercises
          </button>
          <div className="hidden items-center gap-2 xl:flex">
            <TextGradient className="text-sm font-medium">
              Exercise {currentId} of {exercises.length}
            </TextGradient>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CommandSearch
              items={jumpItems}
              triggerLabel="Jump to"
              placeholder="Search exercises"
            />
          </div>
        </div>

        {/* Workspace */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentId}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <Workspace
                exercise={exercise}
                onPrev={prevId ? () => goto(prevId) : null}
                onNext={nextId ? () => goto(nextId) : null}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
