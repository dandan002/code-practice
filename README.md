# Code Practice

A mobile-first, LeetCode-style site for practising **data structures & algorithms** and **Python concepts** on your phone. Python runs entirely in the browser (Pyodide/WebAssembly): no server and no account, and it works offline once loaded. You can install it as an app from your browser's "Add to Home Screen".

## Features

- **74 problems**: 51 DSA problems in a roadmap (arrays & hashing → DP → design) and 23 Python concept lessons (comprehensions, generators, decorators, context managers, dataclasses, dunder methods, pattern matching, …), each with a short lesson.
- **Run & Submit**: *Run* checks the examples. *Submit* adds hidden tests, including large generated inputs that catch slow solutions. Results show per-case input, output, expected, stdout, and tracebacks with "go to line".
- **Custom input**: runs your own arguments and compares them against the reference solution.
- **Language tools**: CodeMirror 6 with Python highlighting, bracket matching and auto-closing, and auto-indent. Also Jedi completions with docs, signature help while typing calls, and pyflakes linting (undefined names, unused imports, syntax errors).
- **Mobile editing**: a symbol keybar above the on-screen keyboard (tab/dedent, brackets, `:`, `=`, quotes, cursor keys, undo/redo, Run). The layout tracks the visual viewport so the editor stays above the keyboard.
- **Time limits**: infinite loops are stopped after 10s and Python restarts automatically.
- Hints, solutions with explanations, progress tracking, a streak counter, a Python playground with stdin, light and dark themes, and export/import of your data.

## Development

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # static site in dist/
npm run check-problems   # validate every reference solution against its tests (needs python3)
```

`npm run vendor` (run automatically by `dev` and `build`) copies the Pyodide runtime from `node_modules` into `public/pyodide`, along with the Jedi, parso and pyflakes wheels from `vendor/wheels`. The site is fully self-hosted.

## Deploying

`.github/workflows/deploy.yml` validates the problems, builds the site, and publishes it to GitHub Pages on every push to `main`/`master`. Enable it under **Settings → Pages → Source: GitHub Actions**. Any static host works as well: the build uses relative paths.

## Adding problems

Each problem is a Markdown file in `src/problems/content/{dsa,python}/`:

```text
---
title: Two Sum
order: 10                     # tens digit picks the roadmap section
difficulty: Easy
track: dsa                    # or python
topics: ["Array", "Hash Table"]
spec: {"mode": "function", "entry": "twoSum", "params": ["nums", "target"], "compare": "unordered"}
---
Markdown description…
@@ hints
- one hint per bullet
@@ starter
class Solution: ...
@@ solution
class Solution: ...
@@ explanation
Markdown shown with the solution.
@@ tests
{"args": [[2, 7, 11, 15], 9], "expected": [0, 1]}
{"args": [[3, 3], 6], "hidden": true}
{"gen": "[list(range(10000)), 19997]", "hidden": true}
```

- **Modes:** `function` calls `entry` with `args`, either as a top-level function or a method of `class Solution`. `design` runs LeetCode-style `ops`/`args` against a class. `expr` evaluates a Python `expr` (after optional `setup`) against your code, which suits decorators, classes and similar concept exercises.
- **Types:** `argTypes`/`returnType` of `ListNode`, `TreeNode` or `ListNode[]` convert from JSON arrays. `returnArg: 0` checks an argument mutated in place.
- **compare:** `exact` (default; floats use a tolerance), `unordered`, or `nested-unordered`.
- Hidden tests may omit `expected`. It is then computed from the reference solution, and `gen` builds large inputs from a Python expression (with a seeded `rng`).

Run `npm run check-problems` after editing.

## Privacy & terms

The app collects no data: progress and code stay in the browser's local storage. See the [Privacy Policy](src/legal/privacy.md) and [Terms of Service](src/legal/terms.md), which are also shown in the app at `#/privacy` and `#/terms`.

## License

[MIT](LICENSE). Third-party components keep their own licenses: Pyodide (MPL-2.0) is copied from `node_modules` at build time, and the vendored Jedi, parso and pyflakes wheels are MIT-licensed.
