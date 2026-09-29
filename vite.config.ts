import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  // Relative base so the build works on GitHub Pages sub-paths or any static host.
  base: "./",
  plugins: [preact()],
  worker: { format: "es" },
  build: { target: "es2022", chunkSizeWarningLimit: 1000 },
});
