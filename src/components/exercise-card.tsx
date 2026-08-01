"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, ListChecks, Copy, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CodeBlock, useCopyToClipboard } from "@/components/ui/code-block";
import { RunActionButton, type RunStatus } from "@/components/ui/run-action-button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Terminal } from "@/components/ui/terminal";
import type { Exercise } from "@/data/exercises";
import { runDart } from "@/lib/run-dart";
import { cn } from "@/lib/utils";

type ExerciseCardProps = {
  exercise: Exercise;
  categoryLabel: string;
  solved: boolean;
};

export function ExerciseCard({ exercise, categoryLabel, solved }: ExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState<{
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
  } | null>(null);
  const { copiedId, copy } = useCopyToClipboard();
  const isCopied = copiedId === `answer-copy-${exercise.id}`;
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const node = sel.anchorNode;
          if (answerRef.current && answerRef.current.contains(node)) {
            e.preventDefault();
            const codeElement = answerRef.current.querySelector("code");
            if (codeElement) {
              const range = document.createRange();
              range.selectNodeContents(codeElement);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const demoRun = useCallback(async () => {
    setStatus("running");
    setResult(null);
    const run = await runDart(exercise.solution);
    setResult(run);
    setStatus(run.exitCode === 0 ? "done" : "error");
  }, [exercise.solution]);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
  }, []);

  return (
    <Card
      id={`exercise-${exercise.id}`}
      className="card-sheen scroll-mt-28 overflow-hidden border-border/70 bg-card/70 backdrop-blur-sm transition-colors hover:border-melon/40"
    >
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={cn(
                "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums",
                solved
                  ? "border-rind/40 bg-rind/15 text-rind"
                  : "border-border bg-muted/50 text-muted-foreground",
              )}
            >
              {exercise.id.toString().padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-balance text-lg font-semibold tracking-tight">
                {exercise.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{exercise.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full font-medium">
                  {categoryLabel}
                </Badge>
                <Badge variant="outline" className="rounded-full font-normal text-muted-foreground">
                  {exercise.focus}
                </Badge>
                {solved && (
                  <Badge className="rounded-full bg-rind/15 text-rind ring-1 ring-rind/30">
                    Solved
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={`answer-${exercise.id}`}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-melon/50 hover:text-melon"
          >
            <ChevronRight className="size-4 opacity-70 transition-opacity group-hover:opacity-100" />
            {open ? "Hide answer" : "Show answer"}
            <ChevronDown
              className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
            />
          </button>
        </div>

        <div className="grid gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Input
            </p>
            <ul className="mt-2 space-y-1.5">
              {exercise.inputs.map((input) => (
                <li key={input} className="flex gap-2 text-sm text-foreground/80">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-melon" />
                  <span className="font-medium text-sm">{input}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <ListChecks className="size-3.5" />
              Rules
            </p>
            <ul className="mt-2 space-y-1.5">
              {exercise.rules.map((rule) => (
                <li key={rule} className="flex gap-2 text-sm text-foreground/80">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-rind" />
                  <span className="font-medium text-sm">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={answerRef}
            id={`answer-${exercise.id}`}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-5 pt-0">
              <CodeBlock
                id={`solution-${exercise.id}`}
                code={exercise.solution}
                language="dart"
                showLineNumbers
                filename={`ex${exercise.id.toString().padStart(2, "0")}.dart`}
                maxCollapsedLines={22}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Demo run</p>
                  <p className="text-xs text-muted-foreground">
                    Executes this answer with the Dart SDK and prints the real stdout.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copy(exercise.solution, `answer-copy-${exercise.id}`)}
                    className="h-8 gap-1.5"
                  >
                    {isCopied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5 text-muted-foreground" />}
                    {isCopied ? "Copied!" : "Copy Answer"}
                  </Button>
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
                        ? "Running"
                        : status === "done"
                          ? `${result?.durationMs ?? 0}ms`
                          : status === "error"
                            ? "Failed"
                            : "Ready"
                    }
                    labelClassName="text-xs text-muted-foreground"
                  />
                  <RunActionButton
                    status={status}
                    onRun={demoRun}
                    onReset={reset}
                    idleLabel="Demo Run"
                    runningLabel="Running"
                    doneLabel="Output ready"
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Terminal
                      id={`terminal-${exercise.id}`}
                      command={`dart run ex${exercise.id.toString().padStart(2, "0")}.dart`}
                      stdout={result.stdout}
                      stderr={result.stderr}
                      exitCode={result.exitCode}
                      maxCollapsedLines={18}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
