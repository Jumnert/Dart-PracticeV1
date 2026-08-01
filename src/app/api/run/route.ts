import { runInNewContext } from "node:vm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DARTPAD_COMPILE_URL =
  "https://stable.api.dartpad.dev/api/v3/compileDDC";

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

    const responseText = await res.text();
    let data: { result?: string; error?: { message?: string } | string; message?: string } | null = null;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Body is not JSON (e.g., plaintext "Route not found" or HTML error page)
    }

    if (!res.ok || !data?.result) {
      const msg: string =
        (typeof data?.error === "object" ? data?.error?.message : data?.error) ??
        data?.message ??
        `Compile error (HTTP ${res.status}): ${responseText.slice(0, 150)}`;
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
  let stdout = "";
  let stderr = "";
  let timedOut = false;

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
    self: undefined as unknown,
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
  sandbox.self = sandbox;

  const setupScript = `
    (function() {
      const dartxSymbols = {};
      self.dartx = new Proxy({}, {
        get: (_target, prop) => {
          const s = String(prop);
          if (!dartxSymbols[s]) {
            const sym = Symbol("dartx." + s);
            dartxSymbols[s] = sym;
            if (s === 'toStringAsFixed') {
              Number.prototype[sym] = function(fractionDigits) { return this.toFixed(fractionDigits); };
              Object.prototype[sym] = function(fractionDigits) { return Number(this).toFixed(fractionDigits); };
            } else if (s === 'trimRight' || s === 'trimEnd') {
              String.prototype[sym] = function() { return this.trimEnd(); };
              Object.prototype[sym] = function() { return String(this).trimEnd(); };
            } else if (s === 'trimLeft' || s === 'trimStart') {
              String.prototype[sym] = function() { return this.trimStart(); };
              Object.prototype[sym] = function() { return String(this).trimStart(); };
            } else if (s === 'toLowerCase') {
              String.prototype[sym] = function() { return this.toLowerCase(); };
              Object.prototype[sym] = function() { return String(this).toLowerCase(); };
            } else if (s === 'toUpperCase') {
              String.prototype[sym] = function() { return this.toUpperCase(); };
              Object.prototype[sym] = function() { return String(this).toUpperCase(); };
            } else if (s === 'split') {
              String.prototype[sym] = function(sep) { return this.split(sep); };
              Object.prototype[sym] = function(sep) { return String(this).split(sep); };
            } else if (s === 'join') {
              Array.prototype[sym] = function(sep) { return this.join(sep); };
              Object.prototype[sym] = function(sep) { return Array.from(this).join(sep); };
            } else if (s === 'toString') {
              Object.prototype[sym] = function() { return String(this); };
            } else if (s === 'modulo') {
              Number.prototype[sym] = function(n) { return this % n; };
              Object.prototype[sym] = function(n) { return Number(this) % n; };
            } else if (s === 'get$length' || s === 'length') {
              Object.defineProperty(Object.prototype, sym, {
                get: function() { return this.length ?? 0; },
                configurable: true
              });
            } else {
              Object.prototype[sym] = function(...args) {
                if (typeof this[s] === 'function') return this[s](...args);
                return this;
              };
            }
          }
          return dartxSymbols[s];
        }
      });

      const JSArrayClass = class JSArray extends Array {
        static of(arr) { return arr; }
      };

      self.dart_rti = {
        _Universe: {
          eval: () => () => ({}),
          addRules: () => {},
          addTypeRules: () => {},
          findType: () => ({}),
        },
        JSArray: JSArrayClass
      };

      self._interceptors = {
        JSArray: JSArrayClass
      };

      const makeConstFn = (fn) => {
        const f = typeof fn === 'function' ? fn : function() { return fn; };
        return new Proxy(f, {
          get: (target, prop) => {
            if (prop in target) return target[prop];
            return makeConstFn(() => ({}));
          },
          set: (target, prop, value) => {
            target[prop] = value;
            return true;
          }
        });
      };

      self.dart = {
        library: {},
        constFn: makeConstFn,
        lazyFn: (fn, getter) => fn,
        fn: (f) => f,
        trackLibraries: () => {},
        privateName: () => Symbol(),
        strSafe: (val) => val === null || val === undefined ? "null" : String(val),
        str: (val) => String(val),
        equals: (a, b) => a === b,
        hashCode: () => 0,
        constList: (_type, list) => list,
        constMap: (_type, map) => map,
        constSet: (_type, set) => set,
        defineLazy: (obj, props) => {
          for (const prop in props) {
            const val = props[prop];
            const getter = typeof val === "function" ? val : () => val;
            try {
              Object.defineProperty(obj, prop, { get: getter, enumerable: true, configurable: true });
            } catch (_) {}
          }
        }
      };

      const RandomClass = class Random {
        constructor(seed) {}
        nextInt(max) { return Math.floor(Math.random() * max); }
        nextDouble() { return Math.random(); }
        nextBool() { return Math.random() >= 0.5; }
      };
      RandomClass.new = function(seed) { return new RandomClass(seed); };

      self.math = {
        Random: RandomClass
      };

      self.core = {
        print: (...args) => {
          console.log(...args);
        }
      };

      self.dart_sdk = {
        dart_rti: self.dart_rti,
        _interceptors: self._interceptors,
        core: self.core,
        dart: self.dart,
        dartx: self.dartx,
        math: self.math
      };

      let moduleExport = null;
      self.define = (name, deps, factory) => {
        moduleExport = factory(self.dart_sdk);
      };
      self.__getModuleExport = () => moduleExport;
    })();
  `;

  const remainingMs = Math.max(1_000, TIMEOUT_MS - (Date.now() - started));

  try {
    const fullScript =
      setupScript +
      "\n;\n" +
      jsCode +
      "\n;\n if (self.__getModuleExport()) { const m = self.__getModuleExport(); const mainMod = m.dartpad_sample__main || m.dartpad_sample__bootstrap; if (mainMod && typeof mainMod.main === 'function') mainMod.main(); }";
    runInNewContext(fullScript, sandbox, { timeout: remainingMs });
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

