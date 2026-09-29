---
title: Context Managers
order: 30
difficulty: Medium
track: python
topics: ["Context Managers", "Classes", "Exceptions"]
spec: {"mode": "expr"}
---
### Concept
`with` guarantees setup and cleanup. Any object with `__enter__` and `__exit__` works:

```python
class Tag:
    def __init__(self, name): self.name = name
    def __enter__(self):
        print(f"<{self.name}>")
        return self                     # bound by `as`
    def __exit__(self, exc_type, exc, tb):
        print(f"</{self.name}>")
        return False                    # True would swallow the exception
```

`__exit__` receives the exception (or three `None`s). Returning a truthy value suppresses it.

### Task
Write a class `Suppress(*exc_types)` used as `with Suppress(ValueError, KeyError) as s:`. It should:
- swallow exceptions that are instances of any given type (including subclasses),
- let every other exception propagate,
- record the swallowed exception on `s.error` (or `None` if nothing was raised).

@@ hints
- `__enter__` should reset `self.error = None` and return `self`.
- In `__exit__`, use `issubclass(exc_type, self.exc_types)` — it accepts a tuple.
- Remember `exc_type` is `None` when the block finished normally.

@@ starter
class Suppress:
    def __init__(self, *exc_types):
        pass

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc, tb):
        pass

@@ solution
class Suppress:
    def __init__(self, *exc_types):
        self.exc_types = exc_types
        self.error = None

    def __enter__(self):
        self.error = None
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None and issubclass(exc_type, self.exc_types):
            self.error = exc
            return True
        return False

@@ explanation
Returning `True` from `__exit__` tells Python the exception was handled. The standard library has `contextlib.suppress` (without the recording), and `@contextlib.contextmanager` lets you write context managers as generators.

@@ tests
{"setup": "with Suppress(ValueError) as s:\n    int('x')", "expr": "type(s.error).__name__", "expected": "ValueError"}
{"setup": "with Suppress(KeyError) as s:\n    pass", "expr": "s.error", "expected": null}
{"setup": "try:\n    with Suppress(KeyError):\n        1 / 0\n    r = 'swallowed'\nexcept ZeroDivisionError:\n    r = 'propagated'", "expr": "r", "expected": "propagated"}
{"setup": "with Suppress(LookupError) as s:\n    [][1]", "expr": "type(s.error).__name__", "expected": "IndexError"}
{"setup": "with Suppress(TypeError, ValueError) as s:\n    None + 1", "expr": "isinstance(s.error, TypeError)", "hidden": true, "expected": true}
