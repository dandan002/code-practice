import { useEffect, useState } from "preact/hooks";

export type Route =
  | { name: "home" }
  | { name: "problem"; slug: string }
  | { name: "playground" }
  | { name: "settings" };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "");
  const [head, arg] = path.split("/");
  if (head === "p" && arg) return { name: "problem", slug: decodeURIComponent(arg) };
  if (head === "playground") return { name: "playground" };
  if (head === "settings") return { name: "settings" };
  return { name: "home" };
}

export const href = {
  home: () => "#/",
  problem: (slug: string) => `#/p/${encodeURIComponent(slug)}`,
  playground: () => "#/playground",
  settings: () => "#/settings",
};

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

let inAppNavigations = 0;
window.addEventListener("hashchange", () => inAppNavigations++);

/** Go back if we navigated within the app, otherwise go home (e.g. opened via a shared link). */
export function goBack() {
  if (inAppNavigations > 0) history.back();
  else location.hash = href.home();
}
