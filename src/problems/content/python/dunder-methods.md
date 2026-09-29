---
title: Dunder Methods
order: 32
difficulty: Medium
track: python
topics: ["Classes", "Operator Overloading"]
spec: {"mode": "expr"}
---
### Concept
"Dunder" (double-underscore) methods let your objects work with Python's operators and built-ins:

| You write | Python calls |
|---|---|
| `a + b` | `a.__add__(b)` |
| `a * 3` / `3 * a` | `__mul__` / `__rmul__` |
| `a == b` | `__eq__` |
| `len(a)` | `__len__` |
| `a[i]` | `__getitem__` |
| `abs(a)` | `__abs__` |
| `repr(a)` | `__repr__` |

Return `NotImplemented` (not raise) when an operand type isn't supported, so Python can try the other side.

### Task
Write a class `Vector(*components)` supporting:
- `Vector(1, 2) + Vector(3, 4) == Vector(4, 6)` (same length required; raise `ValueError` otherwise),
- scalar multiplication on **both** sides: `v * 2` and `2 * v`,
- `len(v)`, indexing `v[i]`, and `abs(v)` (Euclidean length),
- `repr(v)` → `"Vector(1, 2)"`.

@@ hints
- Store components as a tuple: `self.c = tuple(components)`.
- `__rmul__ = __mul__` handles `2 * v`.
- `__eq__` should compare tuples, and return `NotImplemented` for non-Vectors.

@@ starter
class Vector:
    def __init__(self, *components):
        pass

@@ solution
class Vector:
    def __init__(self, *components):
        self.c = tuple(components)

    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        if len(self) != len(other):
            raise ValueError("vectors must have the same length")
        return Vector(*(a + b for a, b in zip(self.c, other.c)))

    def __mul__(self, k):
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Vector(*(a * k for a in self.c))

    __rmul__ = __mul__

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return self.c == other.c

    def __len__(self):
        return len(self.c)

    def __getitem__(self, i):
        return self.c[i]

    def __abs__(self):
        return math.hypot(*self.c)

    def __repr__(self):
        return f"Vector({', '.join(map(repr, self.c))})"

@@ explanation
Each operator maps to one method. `__rmul__` is the "reflected" version Python tries when the left operand (an `int`) doesn't know how to multiply by a `Vector`. Defining `__eq__` without `__hash__` makes instances unhashable — intentional for a mutable-looking value type.

@@ tests
{"expr": "repr(Vector(1, 2) + Vector(3, 4))", "expected": "Vector(4, 6)"}
{"expr": "[Vector(1, 2) * 3 == Vector(3, 6), 2 * Vector(1, 1) == Vector(2, 2)]", "expected": [true, true]}
{"expr": "[len(Vector(1, 2, 3)), Vector(7, 8)[1], abs(Vector(3, 4))]", "expected": [3, 8, 5.0]}
{"setup": "try:\n    Vector(1) + Vector(1, 2)\n    r = 'no error'\nexcept ValueError:\n    r = 'ValueError'", "expr": "r", "expected": "ValueError"}
{"expr": "[Vector(1, 2) == (1, 2), list(Vector(4, 5, 6))]", "hidden": true, "expected": [false, [4, 5, 6]]}
