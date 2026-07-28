"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

type DartEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
};

const FALLBACK = (code: string) =>
  code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Highlighting runs through shiki (already a Watermelon `code-block` dependency)
 * so the editor stays a few kilobytes instead of pulling in a full IDE engine.
 * Highlight work is debounced and cached, keeping typing at 60fps.
 */
export function DartEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  className,
  minHeight = 380,
}: DartEditorProps) {
  const [theme, setTheme] = useState<"github-dark" | "github-light">("github-dark");
  const cache = useRef(new Map<string, string>());
  const [, force] = useState(0);

  useEffect(() => {
    const resolve = () =>
      setTheme(
        document.documentElement.classList.contains("dark") ? "github-dark" : "github-light",
      );
    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const highlight = (code: string) => {
    const key = `${theme}::${code}`;
    const cached = cache.current.get(key);
    if (cached) return cached;

    // Schedule the async highlight outside of render
    // Using queueMicrotask ensures we don't update state during render
    queueMicrotask(() => {
      codeToHtml(code, { lang: "dart", theme })
        .then((html) => {
          const inner = html
            .replace(/^<pre[^>]*>/, "")
            .replace(/<\/pre>$/, "")
            .replace(/^<code[^>]*>/, "")
            .replace(/<\/code>$/, "");
          if (cache.current.size > 60) cache.current.clear();
          cache.current.set(key, inner);
          force((n) => n + 1);
        })
        .catch(() => undefined);
    });

    return FALLBACK(code);
  };

  return (
    <div
      className={cn(
        "dart-editor custom-scrollbar relative overflow-auto rounded-xl border bg-card/60 backdrop-blur-sm",
        readOnly && "opacity-90",
        className,
      )}
      style={{ minHeight }}
    >
      <Editor
        value={value}
        onValueChange={readOnly ? () => undefined : onChange}
        highlight={highlight}
        readOnly={readOnly}
        padding={18}
        insertSpaces
        tabSize={2}
        onKeyDown={(event) => {
          if (onRun && (event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            onRun();
          }
        }}
        textareaClassName="focus:outline-none"
        style={{ minHeight }}
        aria-label="Dart code editor"
      />
    </div>
  );
}
