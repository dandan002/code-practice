import { useEffect } from "preact/hooks";
import { Icon } from "../components/Icon";
import { useRunner } from "../runner/client";
import { goBack, href } from "../router";
import { exportData, importData, resetAll, settings, useSettings, type Settings as S } from "../storage";

export function Settings() {
  const s = useSettings();
  const r = useRunner();
  useEffect(() => {
    document.title = "Settings · Code Practice";
  }, []);

  const toggle = (key: keyof S, label: string, help: string) => (
    <label class="setting">
      <span>
        <span class="setting-label">{label}</span>
        <span class="setting-help">{help}</span>
      </span>
      <input type="checkbox" class="switch" checked={!!s[key]} onChange={(e) => settings.set({ [key]: (e.target as HTMLInputElement).checked })} />
    </label>
  );

  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `code-practice-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        if (confirm("Importing replaces progress and saved code for matching problems. Continue?")) importData(await file.text());
      } catch (e) {
        alert(`Import failed: ${(e as Error).message}`);
      }
    };
    input.click();
  };

  return (
    <div class="page settings-page">
      <header class="topbar">
        <button class="icon-btn" onClick={goBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <div class="topbar-title">
          <span class="topbar-name">Settings</span>
        </div>
      </header>
      <main class="scroll">
        <section class="card settings-group">
          <h2>Appearance</h2>
          <div class="setting">
            <span class="setting-label">Theme</span>
            <div class="segmented small">
              {(["system", "light", "dark"] as const).map((t) => (
                <button class={s.theme === t ? "active" : ""} onClick={() => settings.set({ theme: t })}>
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <label class="setting">
            <span>
              <span class="setting-label">Editor font size</span>
              <span class="setting-help">{s.fontSize}px</span>
            </span>
            <input
              type="range"
              min={11}
              max={22}
              value={s.fontSize}
              onInput={(e) => settings.set({ fontSize: Number((e.target as HTMLInputElement).value) })}
            />
          </label>
          {toggle("lineWrap", "Wrap long lines", "Handy on narrow screens")}
        </section>

        <section class="card settings-group">
          <h2>Editor tools</h2>
          {toggle("autocomplete", "Autocomplete", "Jedi-powered completions with docs")}
          {toggle("signatureHelp", "Signature help", "Shows parameters while typing a call")}
          {toggle("lint", "Linting", "Syntax errors, undefined names, unused imports (pyflakes)")}
          {toggle("keybar", "Symbol keybar", "Extra row of coding keys above the on-screen keyboard")}
        </section>

        <section class="card settings-group">
          <h2>Your data</h2>
          <p class="setting-help">Progress and code are stored only on this device. Back them up to move between devices.</p>
          <div class="button-row">
            <button class="btn" onClick={download}>
              <Icon name="download" size={16} /> Export
            </button>
            <button class="btn" onClick={upload}>
              <Icon name="upload" size={16} /> Import
            </button>
            <button
              class="btn btn-danger"
              onClick={() => confirm("Erase all progress and saved code on this device?") && resetAll()}
            >
              <Icon name="reset" size={16} /> Reset
            </button>
          </div>
        </section>

        <section class="card settings-group">
          <h2>About</h2>
          <p class="setting-help">
            Python runs entirely in your browser via Pyodide (WebAssembly) — no server, and it works offline once loaded.
          </p>
          <p class="setting-help">
            Python runtime: {r.state === "ready" ? `ready (booted in ${(r.bootMs / 1000).toFixed(1)}s)` : r.state === "loading" ? "loading…" : "not started"}
            {" · "}Language tools: {r.toolsReady ? "ready" : "not loaded"}
          </p>
          <p class="setting-help legal-links">
            <a href={href.privacy()}>Privacy Policy</a> · <a href={href.terms()}>Terms of Service</a> ·{" "}
            <a href="https://github.com/dandan002/code-practice" target="_blank" rel="noopener">
              Source (MIT)
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
