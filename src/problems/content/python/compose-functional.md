---
title: Lambdas, map & reduce
order: 26
difficulty: Medium
track: python
topics: ["Functions", "functools", "Lambdas"]
spec: {"mode": "expr"}
---
### Concept
Functions are first-class values: pass them around, store them, return them.

```python
square = lambda x: x * x              # small anonymous function
list(map(square, [1, 2, 3]))          # [1, 4, 9]
list(filter(str.isdigit, "a1b2"))     # ['1', '2']
functools.reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)   # 24
```

Comprehensions usually read better than `map`/`filter`, but `reduce` and higher-order functions shine when *combining* functions.

### Task
Write `compose(*fns)` returning a single function that applies `fns` **right to left**: `compose(f, g, h)(x) == f(g(h(x)))`. With no functions it returns the identity function. The composed function takes exactly one argument.

Use `functools.reduce`.

@@ hints
- Composing two functions: `lambda x: f(g(x))`.
- `reduce(combine, fns, identity)` folds that pairwise across the list.

@@ starter
def compose(*fns):
    pass

@@ solution
def compose(*fns):
    return reduce(lambda f, g: lambda x: f(g(x)), fns, lambda x: x)

@@ explanation
`reduce` folds the list into a single function, starting from the identity. Each step wraps the accumulated function around the next one.

@@ tests
{"expr": "compose(lambda x: x + 1, lambda x: x * 2)(5)", "expected": 11}
{"expr": "compose()(42)", "expected": 42}
{"expr": "compose(str.upper, str.strip)('  hi ')", "expected": "HI"}
{"expr": "compose(len, str, abs)(-12345)", "expected": 5}
{"expr": "compose(*[lambda x: x + 1] * 100)(0)", "hidden": true, "expected": 100}
