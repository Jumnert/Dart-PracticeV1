"use client";

let confettiFn: ((options: Record<string, unknown>) => void) | null = null;

async function loader() {
  if (confettiFn) return confettiFn;
  const mod = await import("canvas-confetti");
  confettiFn = mod.default as unknown as (options: Record<string, unknown>) => void;
  return confettiFn;
}

/** Watermelon-coloured burst. Loaded on demand so it never touches first paint. */
export async function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const confetti = await loader();
  const colors = ["#fb5f7a", "#ff8fa3", "#2fbf71", "#0f9b57", "#ffffff"];

  confetti({
    particleCount: 90,
    spread: 78,
    startVelocity: 42,
    origin: { y: 0.72 },
    colors,
    scalar: 0.95,
    disableForReducedMotion: true,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 55,
      spread: 110,
      startVelocity: 30,
      decay: 0.92,
      origin: { y: 0.62 },
      colors,
      disableForReducedMotion: true,
    });
  }, 140);
}
