import type { EditorView } from "@codemirror/view";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Icon } from "../components/Icon";
import { useMediaQuery } from "../components/useMediaQuery";
import { CodeEditor } from "../editor/CodeEditor";
import { jumpToLine, markRuntimeError } from "../editor/setup";
import { renderMarkdown, highlightPython } from "../markdown";
import { bySlug, formatExampleInput, groupOf, problems, type Problem } from "../problems";
import { runner, useRunner } from "../runner/client";
import type { CaseResult, RunResult } from "../runner/protocol";
import { goBack, href } from "../router";
import { clearCode, loadCode, recordSubmission, saveCode, settings, useProgress, useSettings } from "../storage";

type Tab = "desc" | "code" | "result";
type RunKind = "run" | "submit" | "custom";

export function ProblemPage({ slug }: { slug: string }) {
  const p = bySlug.get(slug);
  if (!p) {
    return (
      <div class="page">
        <header class="topbar">
          <a class="icon-btn" href={href.home()} aria-label="Home">
            <Icon name="back" />
          </a>
          <div class="topbar-title">Not found</div>
        </header>
        <main class="scroll">
          <p class="empty">No problem called “{slug}”.</p>
        </main>
      </div>
    );
  }
  // Key by slug so all state resets when navigating between problems.
  return <ProblemView key={p.slug} p={p} />;
}

function ProblemView({ p }: { p: Problem }) {
  const wide = useMediaQuery("(min-width: 900px)");
  const [tab, setTab] = useState<Tab>(() => (loadCode(p.slug) ? "code" : "desc"));
  const [running, setRunning] = useState<RunKind | null>(null);
  const [result, setResult] = useState<(RunResult & { kind: RunKind }) | null>(null);
  const [editorFocused, setEditorFocused] = useState(false);
  const code = useRef(loadCode(p.slug) ?? p.starter);
  const view = useRef<EditorView | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const r = useRunner();

  useEffect(() => {
    runner.start();
    document.title = `${p.title} · Code Practice`;
  }, []);

  useEffect(() => {
    // The editor may have been laid out while hidden on another tab.
    if (tab === "code") view.current?.requestMeasure();
  }, [tab]);

  const siblings = problems.filter((x) => x.track === p.track);
  const idx = siblings.indexOf(p);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  const run = async (kind: RunKind, customArgs?: unknown[]) => {
    if (running) return;
    setRunning(kind);
    if (!wide) setTab("result");
    view.current?.contentDOM.blur();
    const tests = kind === "custom" ? [{ args: customArgs }] : kind === "run" ? p.tests.filter((t) => !t.hidden) : p.tests;
    try {
      const res = await runner.run({ code: code.current, spec: p.spec, tests, reference: p.solution });
      setResult({ ...res, kind });
      if (kind === "submit") {
        const total = res.results.reduce((s, x) => s + x.timeMs, 0);
        recordSubmission(p.slug, res.status === "Accepted", total);
      }
      const firstErr = res.errorLine ?? res.results.find((x) => x.error)?.errorLine;
      const errMsg = res.error ?? res.results.find((x) => x.error)?.error;
      if (view.current && firstErr && errMsg) markRuntimeError(view.current, firstErr, errMsg);
    } catch (e) {
      setResult({ status: "Runtime Error", error: String(e), results: [], kind });
    } finally {
      setRunning(null);
    }
  };

  const onChange = (doc: string) => {
    code.current = doc;
    saveCode(p.slug, doc);
  };

  const resetCode = () => {
    if (!confirm("Reset your code to the starter template? Your current code will be lost.")) return;
    clearCode(p.slug);
    code.current = p.starter;
    setEditorKey((k) => k + 1);
  };

  const loadSolution = () => {
    if (!confirm("Replace your code with the reference solution?")) return;
    code.current = p.solution;
    saveCode(p.slug, p.solution);
    setEditorKey((k) => k + 1);
    setTab("code");
  };

  const goToLine = (line: number) => {
    if (!wide) setTab("code");
    setTimeout(() => view.current && jumpToLine(view.current, line), 50);
  };

  const compact = !wide && editorFocused;
  const show = (t: Tab) => wide || tab === t;

  return (
    <div class={`page problem ${wide ? "wide" : "narrow"} ${compact ? "compact" : ""}`}>
      {!compact && (
        <header class="topbar">
          <button class="icon-btn" onClick={goBack} aria-label="Back">
            <Icon name="back" />
          </button>
          <div class="topbar-title">
            <span class="topbar-crumb">{groupOf(p)}</span>
            <span class="topbar-name">{p.title}</span>
          </div>
          <nav class="topbar-actions">
            <a class={`icon-btn ${prev ? "" : "disabled"}`} href={prev ? href.problem(prev.slug) : undefined} aria-label="Previous problem">
              <Icon name="chevronLeft" />
            </a>
            <a class={`icon-btn ${next ? "" : "disabled"}`} href={next ? href.problem(next.slug) : undefined} aria-label="Next problem">
              <Icon name="chevronRight" />
            </a>
          </nav>
        </header>
      )}

      {!wide && !compact && (
        <div class="tabs" role="tablist">
          {(
            [
              ["desc", "Description", "book"],
              ["code", "Code", "code"],
              ["result", "Result", "list"],
            ] as const
          ).map(([k, label, icon]) => (
            <button role="tab" aria-selected={tab === k} class={tab === k ? "active" : ""} onClick={() => setTab(k)}>
              <Icon name={icon} size={16} /> {label}
              {k === "result" && result && <StatusDot status={result.status} />}
            </button>
          ))}
        </div>
      )}

      <div class="problem-body">
        <section class="pane pane-desc scroll" hidden={!show("desc")}>
          <Description p={p} onLoadSolution={loadSolution} />
        </section>

        <section class="pane pane-code" hidden={!show("code")}>
          {!compact && (
            <CodeToolbar
              wide={wide}
              running={running}
              ready={r.state === "ready"}
              onReset={resetCode}
              onRun={() => run("run")}
              onSubmit={() => run("submit")}
            />
          )}
          <CodeEditor
            docKey={`${p.slug}:${editorKey}`}
            initialDoc={code.current}
            onChange={onChange}
            onRun={() => run("run")}
            onSubmit={() => run("submit")}
            onReady={(v) => (view.current = v)}
            onFocusChange={setEditorFocused}
          />
        </section>

        <section class="pane pane-result scroll" hidden={!show("result")}>
          <Results p={p} result={result} running={running} onRun={run} onGoToLine={goToLine} />
        </section>
      </div>

      {!wide && !compact && tab !== "desc" && (
        <div class="action-bar">
          <RunnerStatus />
          <button class="btn" disabled={!!running} onClick={() => run("run")}>
            {running === "run" ? <span class="spinner" /> : <Icon name="play" size={16} />} Run
          </button>
          <button class="btn btn-primary" disabled={!!running} onClick={() => run("submit")}>
            {running === "submit" ? <span class="spinner" /> : <Icon name="send" size={16} />} Submit
          </button>
        </div>
      )}
      {!wide && !compact && tab === "desc" && (
        <div class="action-bar">
          <RunnerStatus />
          <button class="btn btn-primary" onClick={() => setTab("code")}>
            <Icon name="code" size={16} /> Start coding
          </button>
        </div>
      )}
    </div>
  );
}

function RunnerStatus() {
  const r = useRunner();
  if (r.state === "ready") return <span class="runner-status ok">Python ready</span>;
  return (
    <span class="runner-status">
      <span class="spinner" /> {r.statusText || "Loading Python…"}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return <span class={`status-pip ${status === "Accepted" ? "ok" : "bad"}`} />;
}

function CodeToolbar(props: {
  wide: boolean;
  running: RunKind | null;
  ready: boolean;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
}) {
  const s = useSettings();
  const font = (d: number) => settings.set({ fontSize: Math.min(22, Math.max(11, s.fontSize + d)) });
  return (
    <div class="code-toolbar">
      <span class="lang-pill">Python 3</span>
      <button class="icon-btn sm" onClick={() => font(-1)} aria-label="Smaller font" title="Smaller font">
        <Icon name="minus" size={16} />
      </button>
      <span class="font-size">{s.fontSize}</span>
      <button class="icon-btn sm" onClick={() => font(1)} aria-label="Larger font" title="Larger font">
        <Icon name="plus" size={16} />
      </button>
      <button class="icon-btn sm" onClick={props.onReset} aria-label="Reset code" title="Reset to starter code">
        <Icon name="reset" size={16} />
      </button>
      <span class="spacer" />
      {props.wide && (
        <>
          {!props.ready && <RunnerStatus />}
          <button class="btn sm" disabled={!!props.running} onClick={props.onRun} title="Run examples (Ctrl/⌘+Enter)">
            {props.running === "run" ? <span class="spinner" /> : <Icon name="play" size={14} />} Run
          </button>
          <button class="btn btn-primary sm" disabled={!!props.running} onClick={props.onSubmit} title="Submit all tests (Ctrl/⌘+Shift+Enter)">
            {props.running === "submit" ? <span class="spinner" /> : <Icon name="send" size={14} />} Submit
          </button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- description

function Description({ p, onLoadSolution }: { p: Problem; onLoadSolution: () => void }) {
  const progress = useProgress()[p.slug];
  const examples = p.tests.filter((t) => !t.hidden).slice(0, 3);
  const [showSolution, setShowSolution] = useState(false);
  const solutionHtml = useMemo(() => highlightPython(p.solution), [p.solution]);

  return (
    <article class="description">
      <h1>{p.title}</h1>
      <div class="meta-row">
        <span class={`diff diff-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
        {progress?.status === "solved" && (
          <span class="solved-badge">
            <Icon name="check" size={14} /> Solved
          </span>
        )}
        {progress?.status === "attempted" && <span class="attempted-badge">Attempted</span>}
        {p.topics.map((t) => (
          <span class="chip">{t}</span>
        ))}
      </div>

      <div class="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.description) }} />

      {examples.length > 0 && (
        <div class="examples">
          {examples.map((t, i) => (
            <div class="example">
              <div class="example-title">Example {i + 1}</div>
              <pre>
                <b>Input:</b> {formatExampleInput(p, t)}
                {"\n"}
                <b>Output:</b> {JSON.stringify(t.expected)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {p.hints.length > 0 && (
        <div class="hints">
          {p.hints.map((h, i) => (
            <details class="hint">
              <summary>
                <Icon name="bulb" size={16} /> Hint {i + 1}
              </summary>
              <div class="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(h) }} />
            </details>
          ))}
        </div>
      )}

      <details class="solution" open={showSolution} onToggle={(e) => setShowSolution((e.target as HTMLDetailsElement).open)}>
        <summary>
          <Icon name="book" size={16} /> Solution & explanation
        </summary>
        {showSolution && (
          <div class="solution-body">
            {p.explanation && <div class="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.explanation) }} />}
            <pre class="code-block">
              <code dangerouslySetInnerHTML={{ __html: solutionHtml }} />
            </pre>
            <button class="btn sm" onClick={onLoadSolution}>
              <Icon name="copy" size={14} /> Load into editor
            </button>
          </div>
        )}
      </details>
    </article>
  );
}

// -------------------------------------------------------------------- results

function Results(props: {
  p: Problem;
  result: (RunResult & { kind: RunKind }) | null;
  running: RunKind | null;
  onRun: (kind: RunKind, args?: unknown[]) => void;
  onGoToLine: (line: number) => void;
}) {
  const { p, result, running } = props;
  const r = useRunner();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    // Jump to the first failing case.
    const i = result?.results.findIndex((x) => x.passed === false) ?? -1;
    setSelected(i >= 0 ? i : 0);
  }, [result]);

  let body;
  if (running) {
    body = (
      <div class="result-running">
        <span class="spinner lg" />
        <div>
          {r.state !== "ready" ? (
            <>
              <strong>{r.statusText || "Loading Python…"}</strong>
              <p class="muted">The first load downloads the Python runtime (~13 MB). It is cached for offline use afterwards.</p>
            </>
          ) : (
            <strong>{running === "submit" ? "Running all tests…" : "Running…"}</strong>
          )}
        </div>
      </div>
    );
  } else if (!result) {
    body = (
      <div class="result-empty">
        <p>Run your code to see results here.</p>
        <p class="muted">
          <b>Run</b> checks the examples. <b>Submit</b> also runs hidden tests, including larger inputs that catch slow solutions.
        </p>
        <p class="muted hide-touch">Shortcuts: Ctrl/⌘+Enter to run, Ctrl/⌘+Shift+Enter to submit.</p>
      </div>
    );
  } else {
    const cases = result.results;
    const passed = cases.filter((c) => c.passed).length;
    const visible = cases.filter((c) => !c.hidden);
    const hidden = cases.filter((c) => c.hidden);
    const hiddenFail = hidden.find((c) => c.passed === false);
    const shown = [...visible, ...(hiddenFail ? [hiddenFail] : [])];
    const current = shown[selected] ?? shown[0];
    const ok = result.status === "Accepted";
    const totalMs = cases.reduce((s, c) => s + c.timeMs, 0);
    const isCustom = result.kind === "custom";
    body = (
      <div class="result">
        <div class={`result-head ${isCustom ? "" : ok ? "ok" : "bad"}`}>
          <strong>{isCustom ? (cases[0]?.error ? "Runtime Error" : cases[0]?.passed === false ? "Differs from reference" : cases[0]?.passed ? "Matches reference" : "Custom run") : result.status}</strong>
          {cases.length > 0 && !isCustom && (
            <span>
              {passed}/{cases.length} tests passed · {totalMs.toFixed(1)} ms
            </span>
          )}
        </div>
        {ok && result.kind === "run" && <p class="muted">Examples pass — now Submit to run the hidden tests.</p>}
        {ok && result.kind === "submit" && <p class="success-note">🎉 All tests passed. Nice work!</p>}

        {result.error && (
          <ErrorBlock error={result.error} line={result.errorLine} onGoToLine={props.onGoToLine} />
        )}

        {shown.length > 0 && (
          <>
            <div class="case-tabs" role="tablist">
              {shown.map((c, i) => (
                <button
                  role="tab"
                  aria-selected={i === selected}
                  class={`case-tab ${i === selected ? "active" : ""} ${c.passed === true ? "ok" : c.passed === false ? "bad" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {c.passed === true ? "✓" : c.passed === false ? "✗" : "•"} {isCustom ? "Custom" : c.hidden ? "Hidden" : `Case ${i + 1}`}
                </button>
              ))}
            </div>
            {hidden.length > 0 && (
              <p class="muted small">
                Hidden tests: {hidden.filter((c) => c.passed).length}/{hidden.length} passed
                {hiddenFail ? " — first failing hidden test shown." : "."}
              </p>
            )}
            {current && <CaseView c={current} onGoToLine={props.onGoToLine} />}
          </>
        )}
      </div>
    );
  }

  return (
    <div class="results">
      {body}
      {p.spec.mode === "function" && <CustomInput p={p} disabled={!!running} onRun={(args) => props.onRun("custom", args)} />}
    </div>
  );
}

function ErrorBlock({ error, line, onGoToLine }: { error: string; line?: number | null; onGoToLine: (l: number) => void }) {
  return (
    <div class="error-block">
      <pre>{error}</pre>
      {line ? (
        <button class="btn sm" onClick={() => onGoToLine(line)}>
          Go to line {line}
        </button>
      ) : null}
    </div>
  );
}

function CaseView({ c, onGoToLine }: { c: CaseResult; onGoToLine: (l: number) => void }) {
  return (
    <div class="case-view">
      <Field label="Input" value={c.input} />
      {c.error ? (
        <ErrorBlock error={c.error} line={c.errorLine} onGoToLine={onGoToLine} />
      ) : (
        <Field label="Output" value={c.output ?? ""} tone={c.passed === false ? "bad" : c.passed ? "ok" : undefined} />
      )}
      {c.expected != null && <Field label="Expected" value={c.expected} />}
      {c.stdout && <Field label="Stdout" value={c.stdout} />}
      <p class="muted small">{c.timeMs.toFixed(2)} ms</p>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "ok" | "bad" }) {
  return (
    <div class="field">
      <div class="field-label">{label}</div>
      <pre class={`field-value ${tone ?? ""}`}>{value}</pre>
    </div>
  );
}

function CustomInput({ p, disabled, onRun }: { p: Problem; disabled: boolean; onRun: (args: unknown[]) => void }) {
  const first = p.tests.find((t) => !t.hidden);
  const params = p.spec.params ?? [];
  const [text, setText] = useState(() => (first?.args ?? []).map((a) => JSON.stringify(a)).join("\n"));
  const [err, setErr] = useState("");

  const submit = () => {
    const lines = text.split("\n").filter((l) => l.trim());
    try {
      const args = lines.map((l) => JSON.parse(l));
      if (args.length !== params.length) throw new Error(`Expected ${params.length} line(s): ${params.join(", ")}`);
      setErr("");
      onRun(args);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <details class="custom-input">
      <summary>Custom test input</summary>
      <p class="muted small">
        One JSON value per line, in order: <code>{params.join(", ")}</code>. The expected output comes from the reference solution.
      </p>
      <textarea
        rows={Math.max(2, params.length + 1)}
        value={text}
        spellcheck={false}
        autocapitalize="off"
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
      />
      {err && <p class="error-text small">{err}</p>}
      <button class="btn sm" disabled={disabled} onClick={submit}>
        <Icon name="play" size={14} /> Run custom input
      </button>
    </details>
  );
}
