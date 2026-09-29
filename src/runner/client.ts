import { useEffect, useState } from "preact/hooks";
import type {
  CompletionItem,
  Diagnostic,
  ExecResult,
  RunPayload,
  RunResult,
  SignatureInfo,
  WorkerRequest,
  WorkerResponse,
} from "./protocol";

export type RunnerState = "off" | "loading" | "ready";

interface Pending {
  resolve: (v: any) => void;
  reject: (e: Error) => void;
}

type Listener = () => void;

/**
 * Owns the Pyodide worker. Code runs are guarded by a wall-clock limit: an infinite
 * loop can't be interrupted inside WebAssembly, so on timeout the worker is killed
 * and a fresh one is booted.
 */
class PythonRunner {
  private worker: Worker | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;
  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private listeners = new Set<Listener>();

  state: RunnerState = "off";
  toolsReady = false;
  statusText = "";
  bootMs = 0;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  /** Start loading Python in the background (idempotent). */
  start(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    const t0 = performance.now();
    this.state = "loading";
    this.statusText = "Starting Python…";
    this.toolsReady = false;
    this.emit();
    this.readyPromise = new Promise((res) => (this.resolveReady = res));
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    this.worker = worker;
    worker.onmessage = (ev: MessageEvent<WorkerResponse>) => this.onMessage(ev.data, t0);
    worker.onerror = (ev) => {
      this.statusText = `Python failed to load: ${ev.message}`;
      this.emit();
    };
    const indexURL = new URL("pyodide/", document.baseURI).href;
    this.post({ type: "init", indexURL });
    return this.readyPromise;
  }

  private onMessage(msg: WorkerResponse, t0: number) {
    switch (msg.type) {
      case "status":
        this.statusText = msg.status;
        this.emit();
        break;
      case "ready":
        this.state = "ready";
        this.statusText = "";
        this.bootMs = Math.round(performance.now() - t0);
        this.resolveReady?.();
        this.emit();
        break;
      case "toolsReady":
        this.toolsReady = true;
        this.emit();
        break;
      case "result": {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        p?.resolve(msg.data);
        break;
      }
      case "error": {
        if (msg.id === undefined) {
          this.statusText = msg.error;
          this.emit();
          return;
        }
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        p?.reject(new Error(msg.error));
        break;
      }
    }
  }

  private post(msg: WorkerRequest) {
    this.worker!.postMessage(msg);
  }

  private restart() {
    this.worker?.terminate();
    this.worker = null;
    this.readyPromise = null;
    this.state = "off";
    for (const p of this.pending.values()) p.reject(new Error("Python was restarted"));
    this.pending.clear();
    this.start();
  }

  private async request<T>(build: (id: number) => WorkerRequest, timeoutMs: number, killOnTimeout: boolean): Promise<T | "timeout"> {
    await this.start();
    const id = this.nextId++;
    return new Promise<T | "timeout">((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        if (killOnTimeout) this.restart();
        resolve("timeout");
      }, timeoutMs);
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.post(build(id));
    });
  }

  async run(payload: RunPayload, timeoutMs = 10_000): Promise<RunResult> {
    const res = await this.request<RunResult>((id) => ({ type: "run", id, payload }), timeoutMs, true);
    if (res === "timeout") {
      return {
        status: "Time Limit Exceeded",
        error: `Your code ran for more than ${timeoutMs / 1000}s. Look for an infinite loop or a slower-than-needed algorithm.`,
        results: [],
      };
    }
    return res;
  }

  async exec(code: string, stdin = "", timeoutMs = 10_000): Promise<ExecResult> {
    const res = await this.request<ExecResult>((id) => ({ type: "exec", id, payload: { code, stdin } }), timeoutMs, true);
    if (res === "timeout") return { stdout: "", error: null, errorLine: null, timeMs: timeoutMs, timedOut: true };
    return res;
  }

  async lint(code: string): Promise<Diagnostic[]> {
    const res = await this.request<Diagnostic[]>((id) => ({ type: "lint", id, code }), 8_000, false);
    return res === "timeout" ? [] : res;
  }

  // Jedi requests can't be cancelled once in the worker, so while one is in flight
  // newer requests wait and only the most recent one is actually sent.
  private chains: Record<string, { tail: Promise<unknown>; seq: number }> = {};

  private async latestOnly<T>(key: string, build: (id: number) => WorkerRequest, timeoutMs: number): Promise<T | null> {
    const c = (this.chains[key] ??= { tail: Promise.resolve(), seq: 0 });
    const seq = ++c.seq;
    await c.tail.catch(() => {});
    if (seq !== c.seq) return null; // superseded while waiting
    const p = this.request<T>(build, timeoutMs, false);
    c.tail = p;
    const res = await p;
    return res === "timeout" ? null : res;
  }

  async complete(code: string, line: number, col: number): Promise<CompletionItem[]> {
    return (await this.latestOnly<CompletionItem[]>("complete", (id) => ({ type: "complete", id, code, line, col }), 15_000)) ?? [];
  }

  async signatures(code: string, line: number, col: number): Promise<SignatureInfo[]> {
    return (await this.latestOnly<SignatureInfo[]>("sig", (id) => ({ type: "signatures", id, code, line, col }), 15_000)) ?? [];
  }
}

export const runner = new PythonRunner();

export function useRunner() {
  const [, force] = useState(0);
  useEffect(() => runner.subscribe(() => force((n) => n + 1)), []);
  return runner;
}
