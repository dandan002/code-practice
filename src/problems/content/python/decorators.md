---
title: Decorators
order: 23
difficulty: Medium
track: python
topics: ["Functions", "Decorators", "Closures"]
spec: {"mode": "expr"}
---
### Concept
A **decorator** is a function that takes a function and returns a replacement. `@deco` above a `def` is shorthand for `f = deco(f)`:

```python
import functools

def shout(fn):
    @functools.wraps(fn)          # keep fn's __name__, __doc__
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"

greet("ana")   # 'HI ANA'
```

Functions are objects, so you can also attach attributes: `wrapper.hits = 0`.

### Task
Write a decorator `count_calls` that:
1. counts how many times the decorated function is called, exposed as a `.calls` attribute (starting at `0`),
2. passes through all positional and keyword arguments and returns the original result,
3. preserves the original function's `__name__` (use `functools.wraps`).

@@ hints
- Inside `wrapper`, do `wrapper.calls += 1` before calling `fn`.
- Set `wrapper.calls = 0` after defining `wrapper`, before returning it.

@@ starter
def count_calls(fn):
    pass

@@ solution
def count_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper

@@ explanation
The wrapper stores its own state as a function attribute. `functools.wraps` copies `__name__`, `__doc__`, etc. from the original.

@@ tests
{"setup": "@count_calls\ndef add(a, b=0):\n    return a + b", "expr": "[add.calls, add(1, 2), add(5, b=5), add.calls]", "expected": [0, 3, 10, 2]}
{"setup": "@count_calls\ndef hello():\n    'docs'\n    return 'hi'", "expr": "[hello.__name__, hello.__doc__]", "expected": ["hello", "docs"]}
{"setup": "@count_calls\ndef f(): pass\n@count_calls\ndef g(): pass\nf(); f(); g()", "expr": "[f.calls, g.calls]", "expected": [2, 1]}
