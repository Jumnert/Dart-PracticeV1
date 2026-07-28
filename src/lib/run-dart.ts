export type DartRunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
};

export async function runDart(source: string): Promise<DartRunResult> {
  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });

    if (!response.ok && response.status !== 403) {
      const detail = await response.json().catch(() => null);
      return {
        stdout: "",
        stderr: detail?.error ?? `Runner failed with status ${response.status}.`,
        exitCode: 1,
        durationMs: 0,
        timedOut: false,
      };
    }

    return (await response.json()) as DartRunResult;
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : "Network error while calling the runner.",
      exitCode: 1,
      durationMs: 0,
      timedOut: false,
    };
  }
}

/** Trailing spaces and blank-line noise should never fail a correct answer. */
export function normalizeOutput(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

export type Comparison = {
  matches: boolean;
  firstMismatchLine: number | null;
  expectedLine: string | null;
  actualLine: string | null;
  expectedLineCount: number;
  actualLineCount: number;
};

export function compareOutput(expected: string, actual: string): Comparison {
  const expectedLines = normalizeOutput(expected).split("\n");
  const actualLines = normalizeOutput(actual).split("\n");
  const max = Math.max(expectedLines.length, actualLines.length);

  for (let i = 0; i < max; i += 1) {
    if (expectedLines[i] !== actualLines[i]) {
      return {
        matches: false,
        firstMismatchLine: i + 1,
        expectedLine: expectedLines[i] ?? null,
        actualLine: actualLines[i] ?? null,
        expectedLineCount: expectedLines.length,
        actualLineCount: actualLines.length,
      };
    }
  }

  return {
    matches: true,
    firstMismatchLine: null,
    expectedLine: null,
    actualLine: null,
    expectedLineCount: expectedLines.length,
    actualLineCount: actualLines.length,
  };
}
