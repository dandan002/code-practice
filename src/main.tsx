import { render } from "preact";
import { useEffect } from "preact/hooks";
import { Home } from "./pages/Home";
import { Legal } from "./pages/Legal";
import { Playground } from "./pages/Playground";
import { ProblemPage } from "./pages/ProblemPage";
import { Settings } from "./pages/Settings";
import { useRoute } from "./router";
import { settings, useSettings } from "./storage";
import "./styles.css";

function applyTheme() {
  const t = settings.value.theme;
  const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#26272a" : "#f4f4f3");
}

/**
 * Size the app shell to the *visual* viewport so the editor and keybar stay above the
 * on-screen keyboard on iOS (which overlays the page rather than resizing it).
 */
function trackViewport() {
  const vv = window.visualViewport;
  const root = document.documentElement;
  const update = () => {
    const h = vv ? vv.height : window.innerHeight;
    root.style.setProperty("--vvh", `${h}px`);
    root.style.setProperty("--vvtop", `${vv ? vv.offsetTop : 0}px`);
  };
  update();
  vv?.addEventListener("resize", update);
  vv?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
}

function App() {
  const route = useRoute();
  const s = useSettings();
  useEffect(applyTheme, [s.theme]);
  useEffect(() => {
    if (route.name === "home") document.title = "Code Practice";
  }, [route]);

  switch (route.name) {
    case "problem":
      return <ProblemPage slug={route.slug} />;
    case "playground":
      return <Playground />;
    case "settings":
      return <Settings />;
    case "privacy":
    case "terms":
      return <Legal doc={route.name} />;
    default:
      return <Home />;
  }
}

applyTheme();
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
trackViewport();
render(<App />, document.getElementById("app")!);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
