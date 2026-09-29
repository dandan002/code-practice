---
title: Generator Pipelines
order: 21
difficulty: Medium
track: python
topics: ["Generators", "Iteration", "itertools"]
spec: {"mode": "expr"}
---
### Concept
Generators compose into memory-efficient **pipelines** — each stage pulls items from the previous one on demand:

```python
lines   = (l.strip() for l in open("log.txt"))      # generator expression
errors  = (l for l in lines if "ERROR" in l)
first10 = itertools.islice(errors, 10)
```

`iter(x)` gets an iterator from any iterable; `next(it, default)` pulls one item without raising at the end.

### Task
Write a generator `chunked(iterable, size)` that yields lists of up to `size` consecutive items. It must work with **any iterable**, including generators and infinite ones (so no `len()` or slicing).

```python
list(chunked(range(7), 3))   # [[0, 1, 2], [3, 4, 5], [6]]
```

@@ hints
- Get an iterator once: `it = iter(iterable)`.
- `list(itertools.islice(it, size))` takes the next chunk; an empty list means you're done.

@@ starter
def chunked(iterable, size):
    pass

@@ solution
def chunked(iterable, size):
    it = iter(iterable)
    while True:
        chunk = list(itertools.islice(it, size))
        if not chunk:
            return
        yield chunk

@@ explanation
Because `it` is a single shared iterator, each `islice` call continues where the last one stopped. (Python 3.12 added `itertools.batched`, which yields tuples.)

@@ tests
{"expr": "list(chunked(range(7), 3))", "expected": [[0, 1, 2], [3, 4, 5], [6]]}
{"expr": "list(chunked('abcd', 2))", "expected": [["a", "b"], ["c", "d"]]}
{"expr": "list(chunked([], 5))", "expected": []}
{"expr": "list(itertools.islice(chunked(itertools.count(), 2), 3))", "expected": [[0, 1], [2, 3], [4, 5]]}
{"expr": "list(chunked((x * x for x in range(5)), 4))", "hidden": true, "expected": [[0, 1, 4, 9], [16]]}
