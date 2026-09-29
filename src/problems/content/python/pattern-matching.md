---
title: Structural Pattern Matching
order: 19
difficulty: Medium
track: python
topics: ["match", "Control Flow"]
spec: {"mode": "function", "entry": "describe", "params": ["cmd"]}
---
### Concept
`match` (Python 3.10+) destructures data by shape:

```python
match event:
    case {"type": "click", "pos": (x, y)}:      # dict + nested sequence
        ...
    case ["move", dx, dy]:                      # exact-length list
        ...
    case ["say", *words]:                       # rest capture
        ...
    case int(n) if n < 0:                       # type check + guard
        ...
    case "quit" | "exit":                       # alternatives
        ...
    case _:                                     # wildcard
        ...
```

Names in patterns **bind** values; dotted names and literals are compared.

### Task
Write `describe(cmd)` using `match`:

| Input | Output |
|---|---|
| `["go", direction]` | `"going <direction>"` |
| `["take", item, *rest]` | `"taking <n> item(s)"` where n = 1 + len(rest) |
| `{"say": text}` (any extra keys allowed) | `"saying <text>"` |
| `"quit"` or `"exit"` | `"bye"` |
| an `int` greater than 0 | `"waiting <n>"` |
| anything else | `"unknown"` |

@@ hints
- `case ["take", item, *rest]: return f"taking {1 + len(rest)} item(s)"`
- Mapping patterns ignore extra keys automatically.
- `case int(n) if n > 0:` — note `bool` is a subclass of `int`; that's fine here.

@@ starter
def describe(cmd):
    pass

@@ solution
def describe(cmd):
    match cmd:
        case ["go", direction]:
            return f"going {direction}"
        case ["take", _, *rest]:
            return f"taking {1 + len(rest)} item(s)"
        case {"say": text}:
            return f"saying {text}"
        case "quit" | "exit":
            return "bye"
        case int(n) if n > 0:
            return f"waiting {n}"
        case _:
            return "unknown"

@@ explanation
Each `case` is tried top to bottom. Sequence patterns check length, mapping patterns check keys, and guards (`if ...`) add arbitrary conditions.

@@ tests
{"args": [["go", "north"]], "expected": "going north"}
{"args": [["take", "lamp", "key", "map"]], "expected": "taking 3 item(s)"}
{"args": [{"say": "hello", "volume": 3}], "expected": "saying hello"}
{"args": ["exit"], "expected": "bye"}
{"args": [5], "expected": "waiting 5"}
{"args": [["go"]], "expected": "unknown"}
{"args": [-2], "hidden": true}
{"args": [["take", "x"]], "hidden": true}
{"args": ["quit"], "hidden": true}
