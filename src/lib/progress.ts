"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dart-practice.solved.v1";
const DRAFT_PREFIX = "dart-practice.draft.";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function write(ids: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)].sort((a, b) => a - b)));
  window.dispatchEvent(new Event("dart-practice:progress"));
}

export function useProgress() {
  const [solved, setSolved] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSolved(read());
    setHydrated(true);

    const sync = () => setSolved(read());
    window.addEventListener("dart-practice:progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("dart-practice:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markSolved = useCallback((id: number) => {
    const next = [...read(), id];
    write(next);
    setSolved([...new Set(next)].sort((a, b) => a - b));
  }, []);

  const reset = useCallback(() => {
    write([]);
    setSolved([]);
  }, []);

  return {
    solved,
    hydrated,
    isSolved: useCallback((id: number) => solved.includes(id), [solved]),
    markSolved,
    reset,
  };
}

export function loadDraft(id: number): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`${DRAFT_PREFIX}${id}`);
}

export function saveDraft(id: number, source: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${DRAFT_PREFIX}${id}`, source);
}

export function clearDraft(id: number) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
}
