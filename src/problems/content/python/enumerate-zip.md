---
title: enumerate & zip
order: 12
difficulty: Easy
track: python
topics: ["Iteration", "Basics"]
spec: {"mode": "function", "entry": "report", "params": ["names", "scores"]}
---
### Concept
Avoid `range(len(...))`. Python has better tools:

```python
for i, name in enumerate(names, start=1):   # index + value
    ...
for name, score in zip(names, scores):       # walk lists in parallel
    ...
```

`zip` stops at the shortest input. (`zip(a, b, strict=True)` raises if lengths differ.)

### Task
Write `report(names, scores)` returning a list of strings like `"1. Ana: 93"` — a 1-based rank, the name, and the score — in the given order. Use `enumerate` and `zip` together.

@@ hints
- `enumerate(zip(names, scores), start=1)` yields `(i, (name, score))`.
- An f-string builds each line: `f"{i}. {name}: {score}"`.

@@ starter
def report(names, scores):
    pass

@@ solution
def report(names, scores):
    return [f"{i}. {name}: {score}" for i, (name, score) in enumerate(zip(names, scores), start=1)]

@@ explanation
Nested unpacking `for i, (name, score) in ...` pulls apart the tuple that `enumerate` wraps around `zip`'s tuple.

@@ tests
{"args": [["Ana", "Ben"], [93, 88]], "expected": ["1. Ana: 93", "2. Ben: 88"]}
{"args": [[], []], "expected": []}
{"args": [["Solo"], [100]], "expected": ["1. Solo: 100"]}
{"args": [["A", "B", "C"], [1, 2, 3]], "hidden": true}
