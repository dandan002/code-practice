import { useMemo, useState } from "preact/hooks";
import { groupOf, problems, topicsFor, type Problem } from "../problems";
import { href } from "../router";
import { streakDays, useProgress, type ProblemProgress } from "../storage";
import { Icon } from "../components/Icon";

type TrackFilter = "dsa" | "python" | "all";
type StatusFilter = "all" | "todo" | "solved";

function readUiState() {
  try {
    return JSON.parse(sessionStorage.getItem("cp:home") ?? "{}");
  } catch {
    return {};
  }
}

export function Home() {
  const progress = useProgress();
  const saved = readUiState();
  const [track, setTrack] = useState<TrackFilter>(saved.track ?? "dsa");
  const [query, setQuery] = useState<string>(saved.query ?? "");
  const [difficulty, setDifficulty] = useState<string>(saved.difficulty ?? "all");
  const [status, setStatus] = useState<StatusFilter>(saved.status ?? "all");
  const [topic, setTopic] = useState<string>(saved.topic ?? "");

  try {
    sessionStorage.setItem("cp:home", JSON.stringify({ track, query, difficulty, status, topic }));
  } catch {
    /* ignore */
  }

  const inTrack = problems.filter((p) => track === "all" || p.track === track);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inTrack.filter((p) => {
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      const st = progress[p.slug]?.status;
      if (status === "solved" && st !== "solved") return false;
      if (status === "todo" && st === "solved") return false;
      if (topic && !p.topics.includes(topic)) return false;
      if (q && !`${p.title} ${p.topics.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [track, query, difficulty, status, topic, progress]);

  const filtering = query.trim() !== "" || difficulty !== "all" || status !== "all" || topic !== "";
  const groups = useMemo(() => {
    const m = new Map<string, Problem[]>();
    for (const p of filtered) {
      const g = filtering ? "Results" : track === "all" ? (p.track === "dsa" ? "DSA · " : "Python · ") + groupOf(p) : groupOf(p);
      m.set(g, [...(m.get(g) ?? []), p]);
    }
    return [...m.entries()];
  }, [filtered, filtering, track]);

  const lastAttempted = Object.entries(progress)
    .filter(([slug]) => problems.some((p) => p.slug === slug))
    .sort((a, b) => (b[1].lastAttemptAt ?? 0) - (a[1].lastAttemptAt ?? 0))[0]?.[0];
  const next = inTrack.find((p) => progress[p.slug]?.status !== "solved");

  const randomUnsolved = () => {
    const pool = inTrack.filter((p) => progress[p.slug]?.status !== "solved");
    const pick = (pool.length ? pool : inTrack)[Math.floor(Math.random() * (pool.length || inTrack.length))];
    if (pick) location.hash = href.problem(pick.slug);
  };

  return (
    <div class="page home">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">{"</>"}</span> Code Practice
        </div>
        <nav class="topbar-actions">
          <a class="icon-btn" href={href.playground()} aria-label="Python playground" title="Playground">
            <Icon name="terminal" />
          </a>
          <a class="icon-btn" href={href.settings()} aria-label="Settings" title="Settings">
            <Icon name="settings" />
          </a>
        </nav>
      </header>

      <main class="scroll">
        <Stats progress={progress} />

        <div class="quick-actions">
          {lastAttempted && (
            <a class="btn" href={href.problem(lastAttempted)}>
              <Icon name="history" /> Resume
            </a>
          )}
          {next && (
            <a class="btn btn-primary" href={href.problem(next.slug)}>
              <Icon name="play" /> Next: {next.title}
            </a>
          )}
          <button class="btn" onClick={randomUnsolved}>
            <Icon name="shuffle" /> Random
          </button>
        </div>

        <div class="segmented" role="tablist">
          {(
            [
              ["dsa", "DSA"],
              ["python", "Python"],
              ["all", "All"],
            ] as const
          ).map(([k, label]) => (
            <button
              role="tab"
              aria-selected={track === k}
              class={track === k ? "active" : ""}
              onClick={() => {
                setTrack(k);
                setTopic("");
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div class="filters">
          <label class="search">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Search problems or topics"
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              enterKeyHint="search"
            />
          </label>
          <div class="filter-row">
            <select value={difficulty} onChange={(e) => setDifficulty((e.target as HTMLSelectElement).value)} aria-label="Difficulty">
              <option value="all">Any difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select value={status} onChange={(e) => setStatus((e.target as HTMLSelectElement).value as StatusFilter)} aria-label="Status">
              <option value="all">Any status</option>
              <option value="todo">To do</option>
              <option value="solved">Solved</option>
            </select>
            <select value={topic} onChange={(e) => setTopic((e.target as HTMLSelectElement).value)} aria-label="Topic">
              <option value="">Any topic</option>
              {topicsFor(track === "all" ? null : track).map((t) => (
                <option>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {groups.length === 0 && <p class="empty">No problems match these filters.</p>}
        {groups.map(([name, list]) => {
          const solved = list.filter((p) => progress[p.slug]?.status === "solved").length;
          return (
            <section class="group" key={name}>
              <h2 class="group-title">
                <span>{name}</span>
                <span class="group-count">
                  {solved}/{list.length}
                </span>
              </h2>
              <ul class="problem-list">
                {list.map((p) => (
                  <ProblemRow p={p} st={progress[p.slug]} />
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function ProblemRow({ p, st }: { p: Problem; st?: ProblemProgress }) {
  return (
    <li>
      <a class="problem-row" href={href.problem(p.slug)}>
        <span class={`status-dot ${st?.status ?? "todo"}`} aria-label={st?.status ?? "not started"}>
          {st?.status === "solved" ? <Icon name="check" /> : null}
        </span>
        <span class="problem-main">
          <span class="problem-title">{p.title}</span>
          <span class="problem-topics">{p.topics.slice(0, 3).join(" · ")}</span>
        </span>
        <span class={`diff diff-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
      </a>
    </li>
  );
}

function Stats({ progress }: { progress: Record<string, ProblemProgress> }) {
  const solved = problems.filter((p) => progress[p.slug]?.status === "solved");
  const streak = streakDays(progress);
  const byDiff = (["Easy", "Medium", "Hard"] as const).map((d) => ({
    d,
    total: problems.filter((p) => p.difficulty === d).length,
    done: solved.filter((p) => p.difficulty === d).length,
  }));
  const tracks = (["dsa", "python"] as const).map((t) => ({
    t,
    total: problems.filter((p) => p.track === t).length,
    done: solved.filter((p) => p.track === t).length,
  }));
  const pct = Math.round((solved.length / problems.length) * 100);
  return (
    <section class="stats card">
      <div class="stats-ring" style={{ "--pct": pct }} aria-label={`${pct}% solved`}>
        <div>
          <strong>{solved.length}</strong>
          <span>/ {problems.length}</span>
        </div>
      </div>
      <div class="stats-bars">
        {byDiff.map(({ d, total, done }) => (
          <div class="stat-bar">
            <span class={`diff diff-${d.toLowerCase()}`}>{d}</span>
            <span class="bar">
              <span class={`bar-fill fill-${d.toLowerCase()}`} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </span>
            <span class="stat-num">
              {done}/{total}
            </span>
          </div>
        ))}
        <div class="stat-meta">
          {tracks.map(({ t, total, done }) => (
            <span>
              {t === "dsa" ? "DSA" : "Python"} {done}/{total}
            </span>
          ))}
          <span title="Days in a row with practice">🔥 {streak} day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>
    </section>
  );
}
