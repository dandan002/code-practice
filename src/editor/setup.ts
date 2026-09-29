import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { globalCompletion, localCompletionSource, python } from "@codemirror/lang-python";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
  syntaxTree,
} from "@codemirror/language";
import { type Diagnostic as CmDiagnostic, linter, lintKeymap, setDiagnostics } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { classHighlighter } from "@lezer/highlight";
import { runner } from "../runner/client";
import type { SignatureInfo } from "../runner/protocol";
import type { Settings } from "../storage";

const JEDI_TYPES: Record<string, string> = {
  module: "namespace",
  class: "class",
  instance: "variable",
  function: "function",
  param: "variable",
  path: "text",
  keyword: "keyword",
  property: "property",
  statement: "variable",
};

/** Jedi-backed completions once language tools are loaded; CodeMirror's local/builtin ones until then. */
async function pythonCompletions(ctx: CompletionContext): Promise<CompletionResult | null> {
  const word = ctx.matchBefore(/\w*/);
  if (!word) return null;
  const afterDot = ctx.state.sliceDoc(word.from - 1, word.from) === ".";
  if (word.from === word.to && !afterDot && !ctx.explicit) return null;

  const node = syntaxTree(ctx.state).resolveInner(ctx.pos, -1);
  if (["Comment", "String", "FormatString"].includes(node.name)) return null;

  if (!runner.toolsReady) {
    return (await localCompletionSource(ctx)) ?? (globalCompletion(ctx) as CompletionResult | null);
  }

  const line = ctx.state.doc.lineAt(ctx.pos);
  const items = await runner.complete(ctx.state.doc.toString(), line.number, ctx.pos - line.from).catch(() => []);
  if (ctx.aborted) return null;
  const options: Completion[] = items.map((it, i) => ({
    label: it.label,
    type: JEDI_TYPES[it.type] ?? it.type,
    detail: it.detail,
    info: it.info,
    boost: -i / 1000, // keep Jedi's ordering among equal fuzzy matches
  }));
  return { from: word.from, options, validFor: /^\w*$/ };
}

function pythonLinter(view: EditorView): Promise<CmDiagnostic[]> {
  const doc = view.state.doc;
  return runner.lint(doc.toString()).then(
    (diags) =>
      diags
        .filter((d) => d.line >= 1 && d.line <= doc.lines)
        .map((d) => {
          const line = doc.line(d.line);
          const from = Math.min(line.from + d.col, line.to);
          // Underline the identifier at the reported column (or the rest of the line).
          const m = /^\w+/.exec(doc.sliceString(from, line.to));
          return {
            from,
            to: m ? from + m[0].length : Math.max(line.to, from),
            severity: d.severity,
            message: d.message,
            source: d.message.startsWith("SyntaxError") ? "python" : "pyflakes",
          };
        }),
    () => [],
  );
}

/** Show a runtime error from a test run as a diagnostic on its line. */
export function markRuntimeError(view: EditorView, line: number | null | undefined, message: string) {
  if (!line || line < 1 || line > view.state.doc.lines) return;
  const l = view.state.doc.line(line);
  const text = message.trim().split("\n").pop() ?? message;
  view.dispatch(setDiagnostics(view.state, [{ from: l.from, to: l.to, severity: "error", message: text, source: "runtime" }]));
}

export function jumpToLine(view: EditorView, line: number) {
  if (line < 1 || line > view.state.doc.lines) return;
  const l = view.state.doc.line(line);
  view.dispatch({ selection: { anchor: l.from }, effects: EditorView.scrollIntoView(l.from, { y: "center" }) });
  view.focus();
}

/** Calls `onChange` with the signature under the cursor (debounced), or null. */
function signatureHelp(onChange: (sig: SignatureInfo | null) => void): Extension {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let showing = false;
  return EditorView.updateListener.of((u) => {
    if (!u.docChanged && !u.selectionSet) return;
    clearTimeout(timer);
    const state = u.state;
    const pos = state.selection.main.head;
    let inArgs = false;
    for (let n: ReturnType<typeof syntaxTree>["topNode"] | null = syntaxTree(state).resolveInner(pos, -1); n; n = n.parent) {
      if (n.name === "ArgList" && pos > n.from) {
        // Inside unless the cursor sits just after the closing paren.
        inArgs = n.to > pos || state.sliceDoc(n.to - 1, n.to) !== ")";
        break;
      }
    }
    if (!inArgs || !runner.toolsReady) {
      if (showing) onChange(null);
      showing = false;
      return;
    }
    timer = setTimeout(async () => {
      const line = state.doc.lineAt(pos);
      const sigs = await runner.signatures(state.doc.toString(), line.number, pos - line.from).catch(() => []);
      showing = sigs.length > 0;
      onChange(sigs[0] ?? null);
    }, 250);
  });
}

export interface EditorOptions {
  doc: string;
  settings: Settings;
  onChange?: (doc: string) => void;
  onSignature?: (sig: SignatureInfo | null) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  onFocusChange?: (focused: boolean) => void;
}

export interface EditorHandle {
  view: EditorView;
  applySettings(s: Settings): void;
}

export function createEditor(parent: HTMLElement, opts: EditorOptions): EditorHandle {
  const wrap = new Compartment();
  const tools = new Compartment();
  const gutters = new Compartment();

  const toolExts = (s: Settings): Extension[] => [
    s.autocomplete
      ? autocompletion({ override: [pythonCompletions], activateOnTypingDelay: 150, maxRenderedOptions: 60, icons: true })
      : [],
    s.lint ? linter(pythonLinter, { delay: 600 }) : [],
    s.signatureHelp && opts.onSignature ? signatureHelp(opts.onSignature) : [],
  ];

  const narrow = () => window.matchMedia("(max-width: 600px)").matches;
  const gutterExts = (): Extension[] =>
    narrow() ? [lineNumbers(), highlightActiveLineGutter()] : [lineNumbers(), highlightActiveLineGutter(), foldGutter()];

  const runKeys = keymap.of([
    { key: "Mod-Enter", run: () => (opts.onRun?.(), true), preventDefault: true },
    { key: "Mod-Shift-Enter", run: () => (opts.onSubmit?.(), true), preventDefault: true },
    { key: "Mod-'", run: () => (opts.onSubmit?.(), true), preventDefault: true },
  ]);

  const state = EditorState.create({
    doc: opts.doc,
    extensions: [
      runKeys,
      gutters.of(gutterExts()),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(classHighlighter),
      bracketMatching(),
      closeBrackets(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      indentUnit.of("    "),
      EditorState.tabSize.of(4),
      python(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      wrap.of(opts.settings.lineWrap ? EditorView.lineWrapping : []),
      tools.of(toolExts(opts.settings)),
      EditorView.contentAttributes.of({ autocapitalize: "off", autocorrect: "off", spellcheck: "false" }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) opts.onChange?.(u.state.doc.toString());
        if (u.focusChanged) opts.onFocusChange?.(u.view.hasFocus);
      }),
    ],
  });

  const view = new EditorView({ state, parent });
  return {
    view,
    applySettings(s) {
      view.dispatch({
        effects: [
          wrap.reconfigure(s.lineWrap ? EditorView.lineWrapping : []),
          tools.reconfigure(toolExts(s)),
          gutters.reconfigure(gutterExts()),
        ],
      });
    },
  };
}
