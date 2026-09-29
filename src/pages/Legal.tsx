import { useEffect } from "preact/hooks";
import { Icon } from "../components/Icon";
import privacy from "../legal/privacy.md?raw";
import terms from "../legal/terms.md?raw";
import { renderMarkdown } from "../markdown";
import { goBack } from "../router";

const DOCS = {
  privacy: { title: "Privacy Policy", body: privacy },
  terms: { title: "Terms of Service", body: terms },
};

export function Legal({ doc }: { doc: keyof typeof DOCS }) {
  const { title, body } = DOCS[doc];
  useEffect(() => {
    document.title = `${title} · Code Practice`;
  }, [title]);
  return (
    <div class="page legal-page">
      <header class="topbar">
        <button class="icon-btn" onClick={goBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <div class="topbar-title">
          <span class="topbar-name">{title}</span>
        </div>
      </header>
      <main class="scroll">
        <article class="md legal" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
      </main>
    </div>
  );
}
