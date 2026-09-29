---
title: Memoization & lru_cache
order: 24
difficulty: Medium
track: python
topics: ["functools", "Decorators", "Recursion"]
spec: {"mode": "function", "entry": "grid_paths", "params": ["rows", "cols"]}
---
### Concept
`functools.cache` (or `lru_cache(maxsize=None)`) memoizes a function: results are stored by argument, so repeated calls are instant. It turns exponential recursion into DP with one line:

```python
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(200)    # instant
```

Arguments must be hashable (ints, strings, tuples — not lists).

### Task
Write `grid_paths(rows, cols)`: the number of paths from the top-left to the bottom-right of a `rows × cols` grid, moving only **right** or **down**. Some tests use large grids, so a plain recursive solution will time out — memoize it.

@@ hints
- `paths(r, c) = paths(r - 1, c) + paths(r, c - 1)`, with `1` when either dimension is `1`.
- Define a nested helper decorated with `@cache`.

@@ starter
def grid_paths(rows, cols):
    pass

@@ solution
def grid_paths(rows, cols):
    @cache
    def paths(r, c):
        if r == 1 or c == 1:
            return 1
        return paths(r - 1, c) + paths(r, c - 1)

    return paths(rows, cols)

@@ explanation
Memoization means each `(r, c)` pair is computed once — O(rows · cols) instead of exponential. (The closed form is `math.comb(rows + cols - 2, rows - 1)`.)

@@ tests
{"args": [2, 2], "expected": 2}
{"args": [3, 7], "expected": 28}
{"args": [1, 1], "expected": 1}
{"args": [18, 18], "hidden": true}
{"args": [60, 40], "hidden": true}
