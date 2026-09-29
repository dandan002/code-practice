---
title: Generators & yield
order: 20
difficulty: Medium
track: python
topics: ["Generators", "Iteration"]
spec: {"mode": "expr"}
---
### Concept
A function containing `yield` is a **generator**. Calling it returns an iterator that runs the body lazily, pausing at each `yield`:

```python
def count_up(n):
    i = 0
    while i < n:
        yield i
        i += 1

list(count_up(3))    # [0, 1, 2]
g = count_up(10)
next(g), next(g)     # (0, 1)
```

Generators can be **infinite** — consumers take what they need with `itertools.islice` or `zip`.

### Task
Write `fib()`, an **infinite** generator of the Fibonacci numbers `0, 1, 1, 2, 3, 5, ...`.

The tests call things like `list(islice(fib(), 10))`.

@@ hints
- Keep two variables `a, b = 0, 1`.
- Loop forever: `yield a`, then `a, b = b, a + b`.

@@ starter
def fib():
    pass

@@ solution
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

@@ explanation
State lives in local variables that survive between `yield`s. Nothing is computed until someone asks for the next value.

@@ tests
{"expr": "list(itertools.islice(fib(), 10))", "expected": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]}
{"expr": "next(fib())", "expected": 0}
{"setup": "import types", "expr": "isinstance(fib(), types.GeneratorType)", "expected": true}
{"setup": "g = fib()\nfor _ in range(50): v = next(g)", "expr": "v", "hidden": true}
