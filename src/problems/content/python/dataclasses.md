---
title: Dataclasses
order: 31
difficulty: Easy
track: python
topics: ["Classes", "dataclasses"]
spec: {"mode": "expr"}
---
### Concept
`@dataclass` generates `__init__`, `__repr__` and `__eq__` from annotated fields:

```python
from dataclasses import dataclass, field

@dataclass(order=True, frozen=True)
class Card:
    rank: int
    suit: str = "♠"

Card(10) < Card(11)        # order=True compares fields as tuples
Card(10) == Card(10, "♠")  # True
# frozen=True makes instances immutable (and hashable)
```

Use `field(default_factory=list)` for mutable defaults — never `tags: list = []`.

### Task
Define a dataclass `Point` with float fields `x` and `y` (both default `0.0`) that:
- supports ordering (`<`, `sorted`) by `(x, y)`,
- is **frozen** (immutable and hashable),
- has a method `dist(self, other)` returning the Euclidean distance to another point.

`dataclass` is not pre-imported — import it yourself.

@@ hints
- `from dataclasses import dataclass`
- `@dataclass(order=True, frozen=True)`
- `math.dist((self.x, self.y), (other.x, other.y))` or `math.hypot(dx, dy)`.

@@ starter
class Point:
    pass

@@ solution
from dataclasses import dataclass


@dataclass(order=True, frozen=True)
class Point:
    x: float = 0.0
    y: float = 0.0

    def dist(self, other):
        return math.hypot(self.x - other.x, self.y - other.y)

@@ explanation
Two decorator flags give you comparison and immutability for free. Frozen dataclasses also get a `__hash__`, so they can go in sets and be dict keys.

@@ tests
{"expr": "Point(3, 4).dist(Point())", "expected": 5.0}
{"expr": "[repr(Point(1, 2)), Point(1, 2) == Point(1.0, 2.0)]", "expected": ["Point(x=1, y=2)", true]}
{"expr": "[(p.x, p.y) for p in sorted([Point(2, 1), Point(1, 5), Point(1, 2)])]", "expected": [[1, 2], [1, 5], [2, 1]]}
{"setup": "p = Point(1, 1)\ntry:\n    p.x = 5\n    r = 'mutable'\nexcept Exception:\n    r = 'frozen'", "expr": "r", "expected": "frozen"}
{"expr": "len({Point(1, 1), Point(1, 1), Point(2, 2)})", "hidden": true, "expected": 2}
