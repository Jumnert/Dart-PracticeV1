import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15_000;
const MAX_SOURCE_BYTES = 64_000;
const MAX_OUTPUT_CHARS = 200_000;

/**
 * This route runs Dart source on the machine hosting the app. That is the whole
 * point of a local playground, but it is also arbitrary code execution: keep it
 * on localhost, or set ALLOW_DART_EXEC=true only on a sandboxed host you own.
 */
function executionAllowed(): boolean {
  if (process.env.ALLOW_DART_EXEC === "true") return true;
  if (process.env.ALLOW_DART_EXEC === "false") return false;
  return process.env.NODE_ENV !== "production";
}

const CANDIDATE_PATHS = [
  process.env.DART_SDK_BIN,
  "/Users/apple/development/flutter/bin/dart",
  "/opt/homebrew/bin/dart",
  "/usr/local/bin/dart",
  "/usr/bin/dart",
  path.join(process.env.HOME ?? "", "development/flutter/bin/dart"),
  path.join(process.env.HOME ?? "", "flutter/bin/dart"),
  path.join(process.env.HOME ?? "", "fvm/default/bin/dart"),
].filter(Boolean) as string[];

let cachedDart: string | null = null;

function resolveDart(): string | null {
  if (cachedDart) return cachedDart;
  for (const candidate of CANDIDATE_PATHS) {
    if (existsSync(candidate)) {
      cachedDart = candidate;
      return cachedDart;
    }
  }
  return null;
}

type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
};

function execute(dart: string, file: string, cwd: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(dart, ["run", "--enable-asserts", file], {
      cwd,
      env: {
        ...process.env,
        PATH: process.env.PATH ?? "",
        HOME: process.env.HOME ?? "",
        PUB_CACHE: process.env.PUB_CACHE ?? "",
      } as NodeJS.ProcessEnv,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => {
      if (stdout.length < MAX_OUTPUT_CHARS) stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      if (stderr.length < MAX_OUTPUT_CHARS) stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        exitCode: 1,
        durationMs: Date.now() - started,
        timedOut,
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout.slice(0, MAX_OUTPUT_CHARS),
        stderr: timedOut
          ? `${stderr}\nExecution stopped after ${TIMEOUT_MS / 1000}s (possible infinite loop).`.trim()
          : stderr.slice(0, MAX_OUTPUT_CHARS),
        exitCode: timedOut ? 124 : (code ?? 1),
        durationMs: Date.now() - started,
        timedOut,
      });
    });
  });
}

export async function GET() {
  const dart = resolveDart();
  return Response.json({
    ready: Boolean(dart) && executionAllowed(),
    sdk: dart ? path.basename(path.dirname(path.dirname(dart))) : null,
    allowed: executionAllowed(),
  });
}

export async function POST(request: Request) {
  if (!executionAllowed()) {
    return Response.json(
      {
        stdout: "",
        stderr:
          "Dart execution is disabled on this host. Set ALLOW_DART_EXEC=true only on a machine you control.",
        exitCode: 126,
        durationMs: 0,
        timedOut: false,
      },
      { status: 403 },
    );
  }

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

  const dart = resolveDart();
  if (!dart) {
    return Response.json(
      {
        stdout: "",
        stderr:
          "Dart SDK not found. Install Dart or Flutter, or set DART_SDK_BIN to the dart binary path.",
        exitCode: 127,
        durationMs: 0,
        timedOut: false,
      },
      { status: 200 },
    );
  }

  const dir = await mkdtemp(path.join(tmpdir(), "dart-practice-"));
  const file = path.join(dir, "main.dart");

  try {
    await writeFile(file, source, "utf8");
    const result = await execute(dart, file, dir);
    return Response.json(result);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
