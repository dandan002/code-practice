// Parser for problem files (src/problems/content/**/*.md).
//
// Format:
//   ---
//   key: value            (value is parsed as JSON when possible, otherwise a string)
//   ---
//   Markdown description...
//   @@ hints              (markdown list; each "- " item is one hint)
//   @@ starter            (raw Python)
//   @@ solution           (raw Python, the reference solution)
//   @@ explanation        (markdown shown after revealing the solution)
//   @@ tests              (one JSON object per line)
//
// Kept dependency-free so scripts/check-problems.ts can reuse it under Node.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Track = "dsa" | "python";
export type CompareMode = "exact" | "unordered" | "nested-unordered";

export interface Spec {
  mode: "function" | "design" | "expr";
  entry?: string;
  params?: string[];
  argTypes?: (string | null)[];
  returnType?: string;
  returnArg?: number;
  compare?: CompareMode;
}

export interface TestCase {
  args?: unknown[];
  gen?: string;
  ops?: string[];
  expr?: string;
  setup?: string;
  expected?: unknown;
  hidden?: boolean;
}

export interface Problem {
  slug: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  track: Track;
  topics: string[];
  spec: Spec;
  description: string;
  hints: string[];
  starter: string;
  solution: string;
  explanation: string;
  tests: TestCase[];
}

function parseValue(raw: string): unknown {
  const v = raw.trim();
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

export function parseProblem(slug: string, text: string): Problem {
  const src = text.replace(/\r\n/g, "\n");
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(src);
  if (!fm) throw new Error(`${slug}: missing front matter`);
  const meta: Record<string, unknown> = {};
  for (const line of fm[1].split("\n")) {
    const m = /^(\w+):\s*(.*)$/.exec(line);
    if (m) meta[m[1]] = parseValue(m[2]);
  }

  const body = src.slice(fm[0].length);
  const sections: Record<string, string> = {};
  let current = "description";
  let buf: string[] = [];
  for (const line of body.split("\n")) {
    const m = /^@@\s+(\w+)\s*$/.exec(line);
    if (m) {
      sections[current] = buf.join("\n");
      current = m[1];
      buf = [];
    } else {
      buf.push(line);
    }
  }
  sections[current] = buf.join("\n");

  const tests: TestCase[] = [];
  (sections.tests ?? "").split("\n").forEach((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("//")) return;
    try {
      tests.push(JSON.parse(t));
    } catch (e) {
      throw new Error(`${slug}: bad test JSON on tests line ${i + 1}: ${(e as Error).message}`);
    }
  });

  const hints = (sections.hints ?? "")
    .split(/\n(?=- )/)
    .map((h) => h.replace(/^- /, "").trim())
    .filter(Boolean);

  const code = (s: string | undefined) => (s ?? "").replace(/^\n+/, "").replace(/\s+$/, "") + "\n";

  const spec = (meta.spec ?? { mode: "function" }) as Spec;
  spec.mode ??= "function";

  return {
    slug,
    order: Number(meta.order ?? 999),
    title: String(meta.title ?? slug),
    difficulty: (meta.difficulty ?? "Easy") as Difficulty,
    track: (meta.track ?? "dsa") as Track,
    topics: (meta.topics ?? []) as string[],
    spec,
    description: (sections.description ?? "").trim(),
    hints,
    starter: code(sections.starter),
    solution: code(sections.solution),
    explanation: (sections.explanation ?? "").trim(),
    tests,
  };
}
