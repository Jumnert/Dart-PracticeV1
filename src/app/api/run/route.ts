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

      // Pre-register common Dart number/string extension methods eagerly so
      // they work on raw primitive values (e.g. 35[$toStringAsFixed]) before
      // the DDC module accesses dartx for the first time.
      function registerSym(s) {
        if (dartxSymbols[s]) return dartxSymbols[s];
        const sym = Symbol("dartx." + s);
        dartxSymbols[s] = sym;
        if (s === 'toStringAsFixed') {
          Number.prototype[sym] = function(d) { return this.toFixed(d); };
        } else if (s === 'toStringAsPrecision') {
          Number.prototype[sym] = function(d) { return this.toPrecision(d); };
        } else if (s === 'toStringAsExponential') {
          Number.prototype[sym] = function(d) { return this.toExponential(d); };
        } else if (s === 'toRadixString') {
          Number.prototype[sym] = function(r) { return Math.trunc(this).toString(r); };
        } else if (s === 'abs') {
          Number.prototype[sym] = function() { return Math.abs(Number(this)); };
        } else if (s === 'ceil') {
          Number.prototype[sym] = function() { return Math.ceil(Number(this)); };
        } else if (s === 'floor') {
          Number.prototype[sym] = function() { return Math.floor(Number(this)); };
        } else if (s === 'round') {
          Number.prototype[sym] = function() { return Math.round(Number(this)); };
        } else if (s === 'truncate') {
          Number.prototype[sym] = function() { return Math.trunc(Number(this)); };
        } else if (s === 'isNaN') {
          Number.prototype[sym] = function() { return isNaN(Number(this)); };
        } else if (s === 'isFinite') {
          Number.prototype[sym] = function() { return isFinite(Number(this)); };
        } else if (s === 'isInfinite') {
          Number.prototype[sym] = function() { return !isFinite(Number(this)) && !isNaN(Number(this)); };
        } else if (s === 'isNegative') {
          Number.prototype[sym] = function() { return Number(this) < 0; };
        } else if (s === 'sign') {
          Number.prototype[sym] = function() { return Math.sign(Number(this)); };
        } else if (s === 'clamp') {
          Number.prototype[sym] = function(lo, hi) { const v = Number(this); return v < lo ? lo : v > hi ? hi : v; };
        } else if (s === 'remainder') {
          Number.prototype[sym] = function(n) { return Number(this) % Number(n); };
        } else if (s === 'modulo') {
          Number.prototype[sym] = function(n) { const r = Number(this) % Number(n); return r < 0 ? r + Math.abs(Number(n)) : r; };
        } else if (s === 'compareTo') {
          Number.prototype[sym] = function(o) { const a = Number(this), b = Number(o); return a < b ? -1 : a > b ? 1 : 0; };
          String.prototype[sym] = function(o) { return this < o ? -1 : this > o ? 1 : 0; };
        } else if (s === 'toString') {
          Number.prototype[sym] = function() { return String(Number(this)); };
          Object.prototype[sym] = function() { return String(this); };
        } else if (s === 'toLowerCase') {
          String.prototype[sym] = function() { return this.toLowerCase(); };
        } else if (s === 'toUpperCase') {
          String.prototype[sym] = function() { return this.toUpperCase(); };
        } else if (s === 'trim') {
          String.prototype[sym] = function() { return this.trim(); };
        } else if (s === 'trimLeft' || s === 'trimStart') {
          String.prototype[sym] = function() { return this.trimStart(); };
        } else if (s === 'trimRight' || s === 'trimEnd') {
          String.prototype[sym] = function() { return this.trimEnd(); };
        } else if (s === 'split') {
          String.prototype[sym] = function(sep) { return this.split(sep); };
        } else if (s === 'contains') {
          String.prototype[sym] = function(sub, start) { return start !== undefined ? this.indexOf(sub, start) >= 0 : this.includes(sub); };
          Array.prototype[sym] = function(el) { return this.includes(el); };
        } else if (s === 'startsWith') {
          String.prototype[sym] = function(s2, pos) { return pos !== undefined ? this.startsWith(s2, pos) : this.startsWith(s2); };
        } else if (s === 'endsWith') {
          String.prototype[sym] = function(s2) { return this.endsWith(s2); };
        } else if (s === 'indexOf') {
          String.prototype[sym] = function(sub, start) { return this.indexOf(sub, start); };
          Array.prototype[sym] = function(el, start) { return this.indexOf(el, start); };
        } else if (s === 'lastIndexOf') {
          String.prototype[sym] = function(sub, start) { return start !== undefined ? this.lastIndexOf(sub, start) : this.lastIndexOf(sub); };
          Array.prototype[sym] = function(el, start) { return start !== undefined ? this.lastIndexOf(el, start) : this.lastIndexOf(el); };
        } else if (s === 'substring') {
          String.prototype[sym] = function(start, end) { return this.substring(start, end); };
        } else if (s === 'replaceAll') {
          String.prototype[sym] = function(from, to) { return this.split(from).join(to); };
        } else if (s === 'replaceFirst') {
          String.prototype[sym] = function(from, to) { return this.replace(from, to); };
        } else if (s === 'padLeft') {
          String.prototype[sym] = function(width, fill) { return this.padStart(width, fill || ' '); };
        } else if (s === 'padRight') {
          String.prototype[sym] = function(width, fill) { return this.padEnd(width, fill || ' '); };
        } else if (s === 'join') {
          Array.prototype[sym] = function(sep) { return this.join(sep); };
        } else if (s === 'reversed') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return [...this].reverse(); }, configurable: true });
        } else if (s === 'first') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return this[0]; }, configurable: true });
        } else if (s === 'last') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return this[this.length - 1]; }, configurable: true });
        } else if (s === 'isEmpty') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return this.length === 0; }, configurable: true });
          Object.defineProperty(String.prototype, sym, { get: function() { return this.length === 0; }, configurable: true });
        } else if (s === 'isNotEmpty') {
          Object.defineProperty(Array.prototype, sym, { get: function() { return this.length > 0; }, configurable: true });
          Object.defineProperty(String.prototype, sym, { get: function() { return this.length > 0; }, configurable: true });
        } else if (s === 'length') {
          // handled by get$length
        } else {
          // Fallback: try calling native method with same name
          Object.prototype[sym] = function(...args) {
            if (typeof this[s] === 'function') return this[s](...args);
            return this;
          };
        }
        return sym;
      }

      // Eagerly pre-register the most common ones used across exercises
      [
        'toStringAsFixed','toStringAsPrecision','toStringAsExponential','toRadixString',
        'abs','ceil','floor','round','truncate','clamp','sign','remainder','modulo',
        'isNaN','isFinite','isInfinite','isNegative','compareTo','toString',
        'toLowerCase','toUpperCase','trim','trimLeft','trimRight','trimStart','trimEnd',
        'split','contains','startsWith','endsWith','indexOf','lastIndexOf',
        'substring','replaceAll','replaceFirst','padLeft','padRight',
        'join','reversed','first','last','isEmpty','isNotEmpty',
      ].forEach(registerSym);

      self.dartx = new Proxy({}, {
        get: (_target, prop) => {
          const s = String(prop);
          return registerSym(s);
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

  // ── 3. Patch DDC output so x[$dartxMethod](args) → Object(x)[$dartxMethod](args) ──
  // DDC caches dartx symbols as `var $toStringAsFixed = dartx.toStringAsFixed;`
  // then calls them as `x[$toStringAsFixed](n)` — but primitive JS numbers/strings
  // don't auto-box for Symbol-keyed property access. Wrapping in Object() fixes this.
  function patchDdcJs(code: string): string {
    // Collect all DDC-emitted dartx symbol variable names: `var $foo = dartx.foo;`
    const symVarNames: string[] = [];
    const declRe = /\bvar\s+(\$\w+)\s*=\s*dartx\.\w+\s*;/g;
    let dm: RegExpExecArray | null;
    while ((dm = declRe.exec(code)) !== null) {
      symVarNames.push(dm[1]);
    }
    if (symVarNames.length === 0) return code;

    // For each line, do simple string replacements of `ident[$sym](` → `Object(ident)[$sym](`
    // Using simple indexOf for speed (no catastrophic backtracking).
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      for (const sym of symVarNames) {
        const needle = `[${sym}](`;
        let idx = line.indexOf(needle);
        while (idx !== -1) {
          // Walk backwards to find the start of the receiver identifier
          let start = idx - 1;
          // Skip whitespace
          while (start >= 0 && (line[start] === " " || line[start] === "\t")) start--;
          if (start < 0) { idx = line.indexOf(needle, idx + 1); continue; }
          // Collect identifier characters (alphanumeric, $, _, .)
          const endOfRecv = start;
          while (start > 0 && /[\w$.]/.test(line[start - 1])) start--;
          const recv = line.slice(start, endOfRecv + 1);
          if (!recv || recv === "Object") { idx = line.indexOf(needle, idx + needle.length); continue; }
          const before = line.slice(0, start);
          const after = line.slice(endOfRecv + 1);
          line = `${before}Object(${recv})${after}`;
          // Advance past the replaced section
          idx = line.indexOf(needle, before.length + `Object(${recv})`.length + needle.length);
        }
      }
      lines[i] = line;
    }
    return lines.join("\n");
  }

  const patchedJsCode = patchDdcJs(jsCode);

  try {
    const fullScript =
      setupScript +
      "\n;\n" +
      patchedJsCode +
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

