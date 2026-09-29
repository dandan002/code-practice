// Validates every problem: parses it, then runs its reference solution against all
// of its tests with the same harness the browser uses (under CPython here).
//   npm run check-problems            # all problems
//   npm run check-problems two-sum    # only slugs containing "two-sum"
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseProblem, type Problem } from "../src/problems/parse.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "src", "problems", "content");
const filter = process.argv[2] ?? "";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

const errors: string[] = [];
const problems: Problem[] = [];
for (const file of walk(contentDir)) {
  const slug = file.split("/").pop()!.replace(/\.md$/, "");
  if (!slug.includes(filter)) continue;
  try {
    const p = parseProblem(slug, readFileSync(file, "utf8"));
    const visible = p.tests.filter((t) => !t.hidden);
    if (!visible.length) errors.push(`${slug}: needs at least one visible (example) test`);
    for (const t of p.tests) {
      if (!t.hidden && !("expected" in t)) errors.push(`${slug}: visible tests must have "expected"`);
      if (t.gen && !t.hidden) errors.push(`${slug}: generated tests must be hidden`);
    }
    if (p.spec.mode === "function" && !p.spec.entry) errors.push(`${slug}: function mode needs spec.entry`);
    if (!p.solution.trim()) errors.push(`${slug}: missing solution`);
    if (!p.starter.trim()) errors.push(`${slug}: missing starter`);
    problems.push(p);
  } catch (e) {
    errors.push((e as Error).message);
  }
}

const driver = `
import json, sys, time
sys.path.insert(0, ${JSON.stringify(join(root, "src", "runner"))})
import harness
out = []
for job in json.load(sys.stdin):
    t = time.perf_counter()
    res = json.loads(harness.run_tests(json.dumps(job["solution"])))
    starter = json.loads(harness.run_tests(json.dumps(job["starter"])))
    out.append({"slug": job["slug"], "res": res, "starter": starter["status"],
                "ms": round((time.perf_counter() - t) * 1000)})
print(json.dumps(out))
`;

const jobs = problems.map((p) => ({
  slug: p.slug,
  solution: { code: p.solution, reference: p.solution, spec: p.spec, tests: p.tests },
  starter: { code: p.starter, reference: p.solution, spec: p.spec, tests: p.tests.filter((t) => !t.hidden) },
}));
const results = JSON.parse(
  execFileSync("python3", ["-c", driver], { input: JSON.stringify(jobs), maxBuffer: 1 << 28 }).toString(),
) as { slug: string; res: any; starter: string; ms: number }[];

for (const { slug, res, starter, ms } of results) {
  if (res.status !== "Accepted") {
    const bad = res.results.find((r: any) => !r.passed);
    errors.push(
      `${slug}: reference solution got ${res.status}` +
        (res.error ? `\n${res.error}` : "") +
        (bad ? `\n  case #${bad.index + 1}: ${bad.input}\n  got ${bad.output} expected ${bad.expected}\n${bad.error ?? ""}` : ""),
    );
  }
  if (starter === "Compile Error") errors.push(`${slug}: starter code does not compile`);
  if (starter === "Accepted") errors.push(`${slug}: starter code already passes the examples`);
  if (ms > 2000) console.warn(`warn: ${slug} took ${ms}ms under CPython (Pyodide is slower)`);
}

const byTrack = (t: string) => problems.filter((p) => p.track === t).length;
console.log(`checked ${problems.length} problems (dsa ${byTrack("dsa")}, python ${byTrack("python")})`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("all reference solutions pass");
