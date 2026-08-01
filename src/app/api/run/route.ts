export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const TIMEOUT_MS = 15_000;
const MAX_SOURCE_BYTES = 64_000;
const MAX_OUTPUT_CHARS = 200_000;

type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
};

async function runWithPiston(source: string): Promise<RunResult> {
  const started = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "dart",
        version: "*",
        files: [{ name: "main.dart", content: source }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        stdout: "",
        stderr: `Piston API error ${response.status}: ${text}`.trim(),
        exitCode: 1,
        durationMs: Date.now() - started,
        timedOut: false,
      };
    }

    const data = await response.json();
    const run = data?.run ?? {};
    const timedOut = run.signal === "SIGKILL" || run.code === 124;

    return {
      stdout: (run.stdout ?? "").slice(0, MAX_OUTPUT_CHARS),
      stderr: timedOut
        ? `${run.stderr ?? ""}\nExecution stopped after ${TIMEOUT_MS / 1000}s (possible infinite loop).`.trim()
        : (run.stderr ?? "").slice(0, MAX_OUTPUT_CHARS),
      exitCode: run.code ?? 1,
      durationMs: Date.now() - started,
      timedOut,
    };
  } catch (err: unknown) {
    clearTimeout(timer);
    const timedOut = (err as { name?: string }).name === "AbortError";
    return {
      stdout: "",
      stderr: timedOut
        ? `Request timed out after ${TIMEOUT_MS / 1000}s.`
        : err instanceof Error
          ? err.message
          : "Network error while calling Piston API.",
      exitCode: timedOut ? 124 : 1,
      durationMs: Date.now() - started,
      timedOut,
    };
  }
}

export async function GET() {
  return Response.json({ ready: true, sdk: "piston", allowed: true });
}

export async function POST(request: Request) {
  let source: unknown;
  try {
    const body = await request.json();
    source = body?.source;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof source !== "string" || source.trim().length === 0) {
    return Response.json({ error: "`source` must be a non-empty string." }, { status: 400 });
  }
  if (Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES) {
    return Response.json({ error: "Source is too large." }, { status: 413 });
  }

  const result = await runWithPiston(source);
  return Response.json(result);
}
