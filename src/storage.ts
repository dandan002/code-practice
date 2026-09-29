import { useEffect, useState } from "preact/hooks";

// Everything is stored locally in the browser — there is no backend.

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) — keep working in memory.
  }
}

class Store<T extends object> {
  private listeners = new Set<() => void>();
  value: T;
  constructor(
    private key: string,
    fallback: T,
  ) {
    this.value = read(key, fallback);
  }
  set(patch: Partial<T>) {
    this.value = { ...this.value, ...patch };
    write(this.key, this.value);
    this.listeners.forEach((fn) => fn());
  }
  replace(value: T) {
    this.value = value;
    write(this.key, value);
    this.listeners.forEach((fn) => fn());
  }
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  }
}

function useStore<T extends object>(store: Store<T>): T {
  const [, force] = useState(0);
  useEffect(() => store.subscribe(() => force((n) => n + 1)), [store]);
  return store.value;
}

// ------------------------------------------------------------------ settings

export interface Settings {
  theme: "system" | "light" | "dark";
  fontSize: number;
  autocomplete: boolean;
  lint: boolean;
  keybar: boolean;
  lineWrap: boolean;
  signatureHelp: boolean;
}

export const settings = new Store<Settings>("cp:settings", {
  theme: "dark",
  fontSize: 14,
  autocomplete: true,
  lint: true,
  keybar: true,
  lineWrap: window.matchMedia("(max-width: 600px)").matches,
  signatureHelp: true,
});
export const useSettings = () => useStore(settings);

// ------------------------------------------------------------------ progress

export interface ProblemProgress {
  status: "solved" | "attempted";
  attempts: number;
  solvedAt?: number;
  lastAttemptAt?: number;
  bestMs?: number;
}

export const progress = new Store<Record<string, ProblemProgress>>("cp:progress", {});
export const useProgress = () => useStore(progress);

export function recordSubmission(slug: string, accepted: boolean, totalMs: number) {
  const prev = progress.value[slug];
  const now = Date.now();
  const next: ProblemProgress = {
    status: accepted || prev?.status === "solved" ? "solved" : "attempted",
    attempts: (prev?.attempts ?? 0) + 1,
    lastAttemptAt: now,
    solvedAt: prev?.solvedAt ?? (accepted ? now : undefined),
    bestMs: accepted ? Math.min(prev?.bestMs ?? Infinity, totalMs) : prev?.bestMs,
  };
  progress.set({ [slug]: next });
}

/** Consecutive days (ending today or yesterday) with at least one solve or attempt. */
export function streakDays(p: Record<string, ProblemProgress>): number {
  const days = new Set(
    Object.values(p)
      .flatMap((x) => [x.lastAttemptAt, x.solvedAt])
      .filter((t): t is number => !!t)
      .map((t) => new Date(t).toDateString()),
  );
  let streak = 0;
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ------------------------------------------------------------------- drafts

const codeKey = (slug: string) => `cp:code:${slug}`;

export function loadCode(slug: string): string | null {
  try {
    return localStorage.getItem(codeKey(slug));
  } catch {
    return null;
  }
}

export function saveCode(slug: string, code: string) {
  try {
    localStorage.setItem(codeKey(slug), code);
  } catch {
    /* ignore */
  }
}

export function clearCode(slug: string) {
  try {
    localStorage.removeItem(codeKey(slug));
  } catch {
    /* ignore */
  }
}

// ------------------------------------------------------------ export/import

export function exportData(): string {
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("cp:")) data[k] = localStorage.getItem(k)!;
    }
  } catch {
    /* ignore */
  }
  return JSON.stringify({ app: "code-practice", version: 1, data }, null, 2);
}

export function importData(json: string) {
  const parsed = JSON.parse(json);
  if (parsed?.app !== "code-practice" || typeof parsed.data !== "object") throw new Error("Not a code-practice backup file");
  for (const [k, v] of Object.entries(parsed.data)) {
    if (k.startsWith("cp:") && typeof v === "string") localStorage.setItem(k, v);
  }
  location.reload();
}

export function resetAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cp:") && k !== "cp:settings")
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  location.reload();
}
