import { acceptCompletion, completionStatus, insertBracket, startCompletion } from "@codemirror/autocomplete";
import { cursorCharLeft, cursorCharRight, indentLess, indentMore, redo, undo } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";
import { useEffect, useRef, useState } from "preact/hooks";
import type { SignatureInfo } from "../runner/protocol";
import { useSettings } from "../storage";
import { createEditor, type EditorHandle } from "./setup";

interface Props {
  /** Changing the key recreates the editor (e.g. navigating to another problem). */
  docKey: string;
  initialDoc: string;
  onChange?: (doc: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  onReady?: (view: EditorView) => void;
  onFocusChange?: (focused: boolean) => void;
}

export function CodeEditor({ docKey, initialDoc, onChange, onRun, onSubmit, onReady, onFocusChange }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<EditorHandle | null>(null);
  const settings = useSettings();
  const [sig, setSig] = useState<SignatureInfo | null>(null);
  const [focused, setFocused] = useState(false);

  // Keep latest callbacks without recreating the editor.
  const cb = useRef({ onChange, onRun, onSubmit, onFocusChange });
  cb.current = { onChange, onRun, onSubmit, onFocusChange };

  useEffect(() => {
    const h = createEditor(host.current!, {
      doc: initialDoc,
      settings,
      onChange: (d) => cb.current.onChange?.(d),
      onRun: () => cb.current.onRun?.(),
      onSubmit: () => cb.current.onSubmit?.(),
      onSignature: setSig,
      onFocusChange: (f) => {
        setFocused(f);
        cb.current.onFocusChange?.(f);
      },
    });
    handle.current = h;
    onReady?.(h.view);
    return () => {
      h.view.destroy();
      handle.current = null;
      setSig(null);
    };
  }, [docKey]);

  useEffect(() => {
    handle.current?.applySettings(settings);
  }, [settings]);

  const view = () => handle.current?.view;

  return (
    <div class="editor-wrap" style={{ "--code-font-size": `${settings.fontSize}px` }}>
      <div class="editor-host" ref={host} />
      {sig && <SignatureBar sig={sig} />}
      {settings.keybar && focused && isTouch() && <Keybar view={view} onRun={() => cb.current.onRun?.()} />}
    </div>
  );
}

const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

function SignatureBar({ sig }: { sig: SignatureInfo }) {
  return (
    <div class="sigbar" role="status">
      <span class="sig-name">{sig.name}</span>(
      {sig.params.map((p, i) => (
        <>
          {i > 0 && ", "}
          <span class={i === sig.index ? "sig-param active" : "sig-param"}>{p}</span>
        </>
      ))}
      )
    </div>
  );
}

type KeyAction = (v: EditorView) => void;

function typeText(text: string): KeyAction {
  return (v) => {
    const tr = text.length === 1 ? insertBracket(v.state, text) : null;
    if (tr) v.dispatch(tr);
    else v.dispatch(v.state.replaceSelection(text), { userEvent: "input.type", scrollIntoView: true });
  };
}

const tab: KeyAction = (v) => {
  if (completionStatus(v.state) === "active") {
    acceptCompletion(v);
    return;
  }
  const { head, empty } = v.state.selection.main;
  const line = v.state.doc.lineAt(head);
  const before = v.state.sliceDoc(line.from, head);
  if (!empty || /^\s*$/.test(before)) {
    indentMore(v);
  } else {
    const n = 4 - (before.length % 4);
    typeText(" ".repeat(n))(v);
  }
};

const KEYS: { label: string; title: string; act: KeyAction; wide?: boolean }[][] = [
  [
    { label: "⇥", title: "Indent / accept completion", act: tab },
    { label: "⇤", title: "Dedent", act: (v) => void indentLess(v) },
    ...["(", ")", "[", "]", "{", "}", ":", "="].map((c) => ({ label: c, title: c, act: typeText(c) })),
  ],
  [
    ...['"', "'", ".", ",", "_", "#"].map((c) => ({ label: c, title: c, act: typeText(c) })),
    { label: "←", title: "Cursor left", act: (v) => void cursorCharLeft(v) },
    { label: "→", title: "Cursor right", act: (v) => void cursorCharRight(v) },
    { label: "↶", title: "Undo", act: (v) => void undo(v) },
    { label: "↷", title: "Redo", act: (v) => void redo(v) },
  ],
];

function Keybar({ view, onRun }: { view: () => EditorView | undefined; onRun: () => void }) {
  const press = (act: KeyAction) => {
    const v = view();
    if (!v) return;
    act(v);
    v.focus();
  };
  // preventDefault on pointerdown keeps focus (and the soft keyboard) in the editor.
  const keep = (e: Event) => e.preventDefault();
  return (
    <div class="keybar" onPointerDown={keep} onMouseDown={keep}>
      {KEYS.map((row, r) => (
        <div class="keybar-row" key={r}>
          {row.map((k) => (
            <button type="button" class="key" title={k.title} aria-label={k.title} onClick={() => press(k.act)}>
              {k.label}
            </button>
          ))}
        </div>
      ))}
      <div class="keybar-row keybar-actions">
        <button type="button" class="key key-wide" onClick={() => press((v) => void startCompletion(v))}>
          Suggest
        </button>
        <button type="button" class="key key-wide key-run" onClick={onRun}>
          ▶ Run
        </button>
        <button type="button" class="key key-wide" onClick={() => view()?.contentDOM.blur()}>
          Hide ⌄
        </button>
      </div>
    </div>
  );
}
