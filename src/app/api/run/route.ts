import { runInNewContext } from "node:vm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DARTPAD_COMPILE_URL =
  "https://stable.api.dartpad.dev/api/dartservices/v2/compile";

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

async function runWithDartPad(source: string): Promise<RunResult> {
  const started = Date.now();

  // ── 1. Compile Dart → JavaScript via DartPad API ─────────────────────────
  let jsCode: string;
  try {
    const controller = new AbortController();
    const compileTimer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(DARTPAD_COMPILE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
      signal: controller.signal,
    });
    clearTimeout(compileTimer);

    const data = await res.json();

    if (!res.ok || data.error) {
      const msg: string =
        data.error?.message ?? data.message ?? `Compile error (HTTP ${res.status})`;
      return {
        stdout: "",
        stderr: msg,
        exitCode: 1,
        durationMs: Date.now() - started,
        timedOut: false,
      };
    }

    jsCode = data.result as string;
  } catch (err: unknown) {
    const timedOut = (err as { name?: string }).name === "AbortError";
    return {
      stdout: "",
      stderr: timedOut
        ? `Compilation timed out after ${TIMEOUT_MS / 1000}s.`
        : err instanceof Error
          ? err.message
          : "Network error reaching DartPad compile API.",
      exitCode: 1,
      durationMs: Date.now() - started,
      timedOut,
    };
  }

  // ── 2. Execute compiled JS inside a sandboxed Node.js vm ─────────────────
  //
  // dart2js targets browsers but only uses console.log for print() in
  // pure-Dart console programs. We intercept that and capture the output.
  let stdout = "";
  let stderr = "";
  let timedOut = false;

  // Build a minimal global context that satisfies dart2js bootstrap code.
  const sandbox: Record<string, unknown> = {
    console: {
      log: (...args: unknown[]) => {
        if (stdout.length < MAX_OUTPUT_CHARS)
          stdout += args.map(String).join(" ") + "\n";
      },
      error: (...args: unknown[]) => {
        if (stderr.length < MAX_OUTPUT_CHARS)
          stderr += args.map(String).join(" ") + "\n";
      },
      warn: (...args: unknown[]) => {
        if (stderr.length < MAX_OUTPUT_CHARS)
          stderr += args.map(String).join(" ") + "\n";
      },
    },
    // dart2js uses `self` as its "global" reference
    self: undefined as unknown,
    // Standard globals dart2js references
    Math,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Error,
    Date,
    JSON,
    RegExp,
    Promise,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Symbol,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    ArrayBuffer,
    DataView,
    isNaN,
    isFinite,
    parseInt,
    parseFloat,
    Infinity,
    NaN,
    undefined,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };
  // dart2js expects `self` to point to the global object
  sandbox.self = sandbox;

  const remainingMs = Math.max(1_000, TIMEOUT_MS - (Date.now() - started));

  try {
    runInNewContext(jsCode, sandbox, { timeout: remainingMs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes("timed out") ||
      msg.toLowerCase().includes("script execution timed out")
    ) {
      timedOut = true;
      stderr += `\nExecution stopped after ${TIMEOUT_MS / 1000}s (possible infinite loop).`;
    } else {
      stderr += (stderr ? "\n" : "") + msg;
    }
  }

  return {
    stdout: stdout.slice(0, MAX_OUTPUT_CHARS),
    stderr: stderr.trim().slice(0, MAX_OUTPUT_CHARS),
    exitCode: timedOut ? 124 : stdout || !stderr ? 0 : 1,
    durationMs: Date.now() - started,
    timedOut,
  };
}

// ── Route handlers ────────────────────────────────────────────────────────────

export async function GET() {
  return Response.json({ ready: true, sdk: "dartpad", allowed: true });
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
    return Response.json(
      { error: "`source` must be a non-empty string." },
      { status: 400 },
    );
  }
  if (Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES) {
    return Response.json({ error: "Source is too large." }, { status: 413 });
  }

  const result = await runWithDartPad(source);
  return Response.json(result);
}
