---
title: The Iterator Protocol
order: 34
difficulty: Medium
track: python
topics: ["Iteration", "Classes"]
spec: {"mode": "expr"}
---
### Concept
A `for` loop calls `iter(obj)` to get an **iterator**, then `next()` on it until `StopIteration` is raised.

- An **iterable** has `__iter__` returning an iterator.
- An **iterator** has `__next__` (and `__iter__` returning itself).

```python
class Squares:
    def __init__(self, n): self.n = n
    def __iter__(self):
        return (i * i for i in range(self.n))   # a fresh iterator each time
```

Returning a fresh iterator from `__iter__` makes the object re-iterable; iterators themselves are one-shot.

### Task
Write a class `Countdown(start)`:
- iterating it yields `start, start-1, ..., 1`,
- it is **re-iterable** (two loops each see the full sequence),
- `len(Countdown(n))` is `max(n, 0)`.

Implement `__iter__` with a **separate iterator class** `CountdownIterator` that has `__next__` and raises `StopIteration` — don't use `yield`.

@@ hints
- `Countdown.__iter__` returns `CountdownIterator(self.start)`.
- `CountdownIterator.__next__`: if the current value is `<= 0`, `raise StopIteration`; otherwise return it and decrement.
- `CountdownIterator.__iter__` should `return self`.

@@ starter
class CountdownIterator:
    pass


class Countdown:
    pass

@@ solution
class CountdownIterator:
    def __init__(self, current):
        self.current = current

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        return CountdownIterator(self.start)

    def __len__(self):
        return max(self.start, 0)

@@ explanation
Separating the iterable (`Countdown`) from the iterator (`CountdownIterator`) is what makes it re-iterable: each loop gets its own cursor.

@@ tests
{"expr": "list(Countdown(3))", "expected": [3, 2, 1]}
{"setup": "c = Countdown(2)", "expr": "[list(c), list(c)]", "expected": [[2, 1], [2, 1]]}
{"expr": "[len(Countdown(5)), len(Countdown(-1)), list(Countdown(0))]", "expected": [5, 0, []]}
{"setup": "it = iter(Countdown(2))", "expr": "[next(it), next(it), next(it, 'done'), iter(it) is it]", "expected": [2, 1, "done", true]}
