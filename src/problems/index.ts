import { parseProblem, type Problem } from "./parse";

export type { Problem, TestCase, Spec, Difficulty, Track } from "./parse";

const files = import.meta.glob("./content/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

const DIFF_RANK = { Easy: 0, Medium: 1, Hard: 2 } as const;

export const problems: Problem[] = Object.entries(files)
  .map(([path, text]) => parseProblem(path.split("/").pop()!.replace(/\.md$/, ""), text))
  .sort((a, b) => a.order - b.order || DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty] || a.title.localeCompare(b.title));

export const bySlug = new Map(problems.map((p) => [p.slug, p]));

export function topicsFor(track: string | null): string[] {
  const set = new Set<string>();
  for (const p of problems) if (!track || p.track === track) p.topics.forEach((t) => set.add(t));
  return [...set].sort();
}

/** "Input" text for an example, in LeetCode style. */
export function formatExampleInput(p: Problem, t: Problem["tests"][number]): string {
  const j = (v: unknown) => JSON.stringify(v);
  if (p.spec.mode === "design") return `${j(t.ops)}\n${j(t.args)}`;
  if (p.spec.mode === "expr") return [t.setup, t.expr].filter(Boolean).join("\n");
  const params = p.spec.params ?? [];
  return (t.args ?? []).map((a, i) => (params[i] ? `${params[i]} = ${j(a)}` : j(a))).join(", ");
}

// Roadmap sections, keyed by the tens digit of a problem's `order`.
const GROUPS: Record<string, Record<number, string>> = {
  dsa: {
    1: "Arrays & Hashing",
    2: "Two Pointers",
    3: "Sliding Window",
    4: "Stack",
    5: "Binary Search",
    6: "Linked List",
    7: "Trees",
    8: "Heap / Priority Queue",
    9: "Graphs",
    10: "Dynamic Programming",
    11: "Backtracking",
    12: "Intervals & Greedy",
    13: "Bit Manipulation",
    14: "Design",
  },
  python: {
    1: "Idioms & Collections",
    2: "Functions, Generators & Decorators",
    3: "Classes & Protocols",
  },
};

export function groupOf(p: Problem): string {
  return GROUPS[p.track]?.[Math.floor(p.order / 10)] ?? "More";
}

export const TRACK_LABEL = { dsa: "Data Structures & Algorithms", python: "Python Concepts" } as const;
