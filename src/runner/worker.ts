/// <reference lib="webworker" />
// Runs Python (via Pyodide) off the main thread. The main thread can terminate
// this worker to enforce time limits, so it holds no state worth keeping.
import harnessSrc from "./harness.py?raw";
import type { WorkerRequest, WorkerResponse } from "./protocol";

type PyFn = (...args: unknown[]) => string;
interface Py {
  runPython(code: string): unknown;
  globals: { get(name: string): unknown };
  FS: { writeFile(path: string, data: Uint8Array): void };
}

const WHEELS = ["parso-0.8.6-py2.py3-none-any.whl", "jedi-0.19.2-py2.py3-none-any.whl", "pyflakes-4.0.0-py2.py3-none-any.whl"];

let py: Py | null = null;
let ready: Promise<Py> | null = null;
let toolsReady: Promise<void> | null = null;
let indexURL = "";

function post(msg: WorkerResponse) {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg);
}

async function boot(url: string): Promise<Py> {
  indexURL = url;
  const { loadPyodide } = await import(/* @vite-ignore */ `${url}pyodide.mjs`);
  post({ type: "status", status: "Loading Python…" });
  const inst = (await loadPyodide({ indexURL: url, stdout: () => {}, stderr: () => {} })) as Py;
  inst.FS.writeFile("/home/pyodide/harness.py", new TextEncoder().encode(harnessSrc));
  inst.runPython("import sys; sys.path.insert(0, '/home/pyodide'); import harness");
  py = inst;
  return inst;
}

/** Jedi + pyflakes are pure-Python wheels; unpack them straight into site-packages. */
async function loadTools(inst: Py) {
  const site = inst.runPython("import site; site.getsitepackages()[0]") as string;
  for (const name of WHEELS) {
    const res = await fetch(indexURL + name);
    if (!res.ok) throw new Error(`failed to fetch ${name}`);
    const path = `/tmp/${name}`;
    inst.FS.writeFile(path, new Uint8Array(await res.arrayBuffer()));
    inst.runPython(`import zipfile; zipfile.ZipFile(${JSON.stringify(path)}).extractall(${JSON.stringify(site)})`);
  }
  inst.runPython("import importlib; importlib.invalidate_caches(); import pyflakes.checker, jedi");
  // Warm Jedi up (it lazily loads builtin stubs) so the first real completion is quick.
  inst.runPython("harness.complete('import collections\\ncollections.C', 2, 13); harness.signatures('sorted(', 1, 7)");
}

function harnessFn(name: string): PyFn {
  const fn = (py!.globals.get("harness") as Record<string, PyFn>)[name];
  return (...args) => fn(...args);
}

self.onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  const msg = ev.data;
  try {
    if (msg.type === "init") {
      ready ??= boot(msg.indexURL);
      const inst = await ready;
      post({ type: "ready" });
      toolsReady ??= loadTools(inst);
      toolsReady.then(
        () => post({ type: "toolsReady" }),
        (e) => post({ type: "status", status: `Language tools unavailable: ${e}` }),
      );
      return;
    }
    await ready;
    switch (msg.type) {
      case "run":
        post({ type: "result", id: msg.id, data: JSON.parse(harnessFn("run_tests")(JSON.stringify(msg.payload))) });
        break;
      case "exec":
        post({ type: "result", id: msg.id, data: JSON.parse(harnessFn("run_script")(JSON.stringify(msg.payload))) });
        break;
      case "lint":
        await toolsReady?.catch(() => {});
        post({ type: "result", id: msg.id, data: JSON.parse(harnessFn("lint")(msg.code)) });
        break;
      case "complete":
        await toolsReady;
        post({ type: "result", id: msg.id, data: JSON.parse(harnessFn("complete")(msg.code, msg.line, msg.col)) });
        break;
      case "signatures":
        await toolsReady;
        post({ type: "result", id: msg.id, data: JSON.parse(harnessFn("signatures")(msg.code, msg.line, msg.col)) });
        break;
    }
  } catch (e) {
    post({ type: "error", id: "id" in msg ? msg.id : undefined, error: String(e) });
  }
};
