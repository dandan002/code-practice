import { useEffect, useRef, useState } from "preact/hooks";
import type { EditorView } from "@codemirror/view";
import { Icon } from "../components/Icon";
import { useMediaQuery } from "../components/useMediaQuery";
import { CodeEditor } from "../editor/CodeEditor";
import { jumpToLine, markRuntimeError } from "../editor/setup";
import { runner, useRunner } from "../runner/client";
import type { ExecResult } from "../runner/protocol";
import { goBack } from "../router";
import { loadCode, saveCode } from "../storage";

const KEY = "__playground";

const STARTER = `# Scratchpad: try out any Python here.
# Useful modules (collections, itertools, heapq, ...) are pre-imported.

def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print(list(itertools.islice(fib(), 10)))

name = input("Your name? ")   # reads from the stdin box
print(f"Hello, {name}!")
`;

export function Playground() {
  const r = useRunner();
  const wide = useMediaQuery("(min-width: 900px)");
  const code = useRef(loadCode(KEY) ?? STARTER);
  const view = useRef<EditorView | null>(null);
  const [stdin, setStdin] = useState("World");
  const [out, setOut] = useState<ExecResult | null>(null);
  const [running, setRunning] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    runner.start();
    document.title = "Playground · Code Practice";
  }, []);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setShowOutput(true);
    view.current?.contentDOM.blur();
    try {
      const res = await runner.exec(code.current, stdin);
      setOut(res);
      if (res.error && view.current) markRuntimeError(view.current, res.errorLine, res.error);
    } catch (e) {
      setOut({ stdout: "", error: String(e), errorLine: null, timeMs: 0 });
    } finally {
      setRunning(false);
    }
  };

  const compact = !wide && focused;
  const outputVisible = wide || showOutput;

  return (
    <div class={`page playground ${wide ? "wide" : "narrow"} ${compact ? "compact" : ""}`}>
      {!compact && (
        <header class="topbar">
          <button class="icon-btn" onClick={goBack} aria-label="Back">
            <Icon name="back" />
          </button>
          <div class="topbar-title">
            <span class="topbar-name">Playground</span>
          </div>
          <nav class="topbar-actions">
            <button class="btn btn-primary sm" disabled={running} onClick={run}>
              {running ? <span class="spinner" /> : <Icon name="play" size={14} />} Run
            </button>
          </nav>
        </header>
      )}
      <div class="playground-body">
        <section class="pane pane-code" hidden={!wide && showOutput && !compact}>
          <CodeEditor
            docKey={KEY}
            initialDoc={code.current}
            onChange={(d) => {
              code.current = d;
              saveCode(KEY, d);
            }}
            onRun={run}
            onReady={(v) => (view.current = v)}
            onFocusChange={setFocused}
          />
        </section>
        {outputVisible && !compact && (
          <section class="pane pane-output scroll">
            <div class="output-head">
              <strong>Output</strong>
              {r.state !== "ready" && (
                <span class="runner-status">
                  <span class="spinner" /> {r.statusText || "Loading Python…"}
                </span>
              )}
              {out && !running && <span class="muted small">{out.timedOut ? "timed out" : `${out.timeMs.toFixed(1)} ms`}</span>}
              <span class="spacer" />
              {!wide && (
                <button class="btn sm" onClick={() => setShowOutput(false)}>
                  <Icon name="code" size={14} /> Code
                </button>
              )}
            </div>
            {running && <p class="muted">Running…</p>}
            {!running && out && (
              <>
                <pre class="console">{out.stdout || (out.error ? "" : "(no output)")}</pre>
                {out.timedOut && <pre class="console error">Stopped after 10s — infinite loop?</pre>}
                {out.error && (
                  <div class="error-block">
                    <pre>{out.error}</pre>
                    {out.errorLine && (
                      <button
                        class="btn sm"
                        onClick={() => {
                          setShowOutput(false);
                          setTimeout(() => view.current && jumpToLine(view.current, out.errorLine!), 50);
                        }}
                      >
                        Go to line {out.errorLine}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            <details class="stdin-box">
              <summary>Standard input</summary>
              <textarea
                rows={3}
                value={stdin}
                spellcheck={false}
                autocapitalize="off"
                onInput={(e) => setStdin((e.target as HTMLTextAreaElement).value)}
                placeholder="Text read by input()"
              />
            </details>
          </section>
        )}
      </div>
      {!wide && !compact && !showOutput && (
        <div class="action-bar">
          <button class="btn" onClick={() => setShowOutput(true)}>
            <Icon name="terminal" size={16} /> Output
          </button>
          <button class="btn btn-primary" disabled={running} onClick={run}>
            <Icon name="play" size={16} /> Run
          </button>
        </div>
      )}
    </div>
  );
}
