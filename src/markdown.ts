import { classHighlighter, highlightCode } from "@lezer/highlight";
import { parser as pythonParser } from "@lezer/python";
import { Marked } from "marked";

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

/** Python source -> HTML with the same token classes the editor uses. */
export function highlightPython(code: string): string {
  let html = "";
  highlightCode(
    code,
    pythonParser.parse(code),
    classHighlighter,
    (text, classes) => {
      html += classes ? `<span class="${classes}">${escapeHtml(text)}</span>` : escapeHtml(text);
    },
    () => {
      html += "\n";
    },
  );
  return html;
}

const md = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const body = !lang || lang === "python" || lang === "py" ? highlightPython(text) : escapeHtml(text);
      return `<pre class="code-block"><code>${body}</code></pre>`;
    },
  },
});

const cache = new Map<string, string>();

/** Problem content is authored in this repo, so it is trusted markdown. */
export function renderMarkdown(src: string): string {
  let html = cache.get(src);
  if (html === undefined) {
    html = md.parse(src, { async: false }) as string;
    cache.set(src, html);
  }
  return html;
}
