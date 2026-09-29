// Copies the Pyodide runtime and vendored pure-Python wheels into public/pyodide
// so the app is fully self-hosted (and works offline once cached).
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "pyodide");
mkdirSync(out, { recursive: true });

const pyodideDir = join(root, "node_modules", "pyodide");
for (const f of ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"]) {
  cpSync(join(pyodideDir, f), join(out, f));
}
const wheelDir = join(root, "vendor", "wheels");
for (const f of readdirSync(wheelDir)) cpSync(join(wheelDir, f), join(out, f));
console.log("vendored pyodide ->", out);
