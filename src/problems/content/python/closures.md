---
title: Closures & nonlocal
order: 22
difficulty: Medium
track: python
topics: ["Functions", "Closures"]
spec: {"mode": "expr"}
---
### Concept
An inner function **closes over** variables of the function that created it — they stay alive after the outer function returns:

```python
def make_multiplier(k):
    def mul(x):
        return x * k       # k is remembered
    return mul

triple = make_multiplier(3)
triple(5)   # 15
```

To **reassign** an enclosing variable (not just read it), declare it `nonlocal`.

### Task
Write `make_counter(start=0, step=1)` that returns a function. Each call to that function returns the next value: the first call returns `start`, then `start + step`, and so on. Separate counters must be independent.

@@ hints
- Store the next value in a variable of `make_counter`.
- The inner function needs `nonlocal` to update it.

@@ starter
def make_counter(start=0, step=1):
    pass

@@ solution
def make_counter(start=0, step=1):
    current = start

    def counter():
        nonlocal current
        value = current
        current += step
        return value

    return counter

@@ explanation
Without `nonlocal`, `current += step` would make `current` a new local variable and raise `UnboundLocalError`.

@@ tests
{"setup": "c = make_counter()", "expr": "[c(), c(), c()]", "expected": [0, 1, 2]}
{"setup": "c = make_counter(10, 5)", "expr": "[c(), c()]", "expected": [10, 15]}
{"setup": "a = make_counter()\nb = make_counter(100)\na(); a()", "expr": "[a(), b()]", "expected": [2, 100]}
{"setup": "c = make_counter(0, -2)", "expr": "[c() for _ in range(4)]", "hidden": true, "expected": [0, -2, -4, -6]}
