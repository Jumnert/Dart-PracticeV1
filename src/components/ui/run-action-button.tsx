"use client";

import { motion, AnimatePresence, type Transition } from "motion/react";
import { Zap } from "lucide-react";
import { HiBadgeCheck } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import { PiSpinnerGapBold } from "react-icons/pi";

function AnimatedText({
  text,
  className,
  delayStep = 0.014,
}: {
  text: string;
  className?: string;
  delayStep?: number;
}) {
  const chars = text.split("");

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          style={{ display: "inline-flex", willChange: "transform" }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 10, opacity: 0, scale: 0.5, filter: "blur(2px)" }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ y: -10, opacity: 0, scale: 0.5, filter: "blur(2px)" }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 16,
                mass: 1.2,
                delay: i * delayStep,
              }}
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.8,
};

export type RunStatus = "idle" | "running" | "done" | "error";

type RunActionButtonProps = {
  status: RunStatus;
  onRun: () => void;
  onReset?: () => void;
  idleLabel?: string;
  runningLabel?: string;
  doneLabel?: string;
  errorLabel?: string;
  disabled?: boolean;
};

/**
 * Watermelon `run-action-button`, wired to real execution state instead of the
 * demo timer that ships with the registry component.
 */
export function RunActionButton({
  status,
  onRun,
  onReset,
  idleLabel = "Run Dart",
  runningLabel = "Compiling",
  doneLabel = "Output ready",
  errorLabel = "Run failed",
  disabled = false,
}: RunActionButtonProps) {
  const widths = {
    idle: 176,
    running: 232,
    done: 220,
    error: 208,
  } as const;

  return (
    <div className="flex items-center">
      <motion.div
        initial={false}
        animate={{ width: widths[status] }}
        transition={spring}
        className={`relative flex h-[56px] items-center justify-between overflow-hidden rounded-full ${
          status === "running"
            ? "border-2 border-dashed border-[#D6D6DD] dark:border-white/20"
            : "border-2 border-transparent"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {status === "idle" && (
            <motion.button
              key="idle"
              type="button"
              onClick={onRun}
              disabled={disabled}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={spring}
              whileTap={{ scale: 0.96 }}
              className="flex flex-1 items-center gap-2 rounded-full bg-[#F4F4F9] px-5 py-3 whitespace-nowrap transition-colors hover:bg-[#ecebf5] disabled:opacity-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <Zap className="h-5 w-5 text-[#26262B] dark:text-zinc-100" />
              <AnimatedText
                text={idleLabel}
                className="text-[16px] font-semibold text-[#26262B] dark:text-zinc-100"
              />
            </motion.button>
          )}

          {status === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={spring}
              className="flex flex-1 items-center justify-center gap-2.5 px-4 whitespace-nowrap"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="flex items-center"
              >
                <PiSpinnerGapBold className="h-5 w-5 text-[#28272A] dark:text-zinc-100" />
              </motion.span>
              <AnimatedText
                text={runningLabel}
                className="text-[16px] font-bold text-[#28272A] dark:text-zinc-100"
              />
            </motion.div>
          )}

          {status === "done" && (
            <motion.button
              key="done"
              type="button"
              onClick={onReset ?? onRun}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={spring}
              whileTap={{ scale: 0.96 }}
              className="flex flex-1 items-center gap-2 rounded-full bg-[#EAF9EA] px-5 py-3 whitespace-nowrap dark:bg-green-200"
            >
              <HiBadgeCheck className="h-5 w-5 text-[#22c55e]" />
              <AnimatedText
                text={doneLabel}
                className="text-[16px] font-bold text-[#1f9d4d]"
              />
              <VscDebugRestart className="ml-1 h-4 w-4 text-[#1f9d4d]" />
            </motion.button>
          )}

          {status === "error" && (
            <motion.button
              key="error"
              type="button"
              onClick={onReset ?? onRun}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={spring}
              whileTap={{ scale: 0.96 }}
              className="flex flex-1 items-center gap-2 rounded-full bg-[#FDECEC] px-5 py-3 whitespace-nowrap dark:bg-red-200"
            >
              <IoCloseSharp className="h-5 w-5 text-[#ef4444]" />
              <AnimatedText
                text={errorLabel}
                className="text-[16px] font-bold text-[#ef4444]"
              />
              <VscDebugRestart className="ml-1 h-4 w-4 text-[#ef4444]" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
