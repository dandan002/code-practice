---
title: collections.defaultdict
order: 16
difficulty: Easy
track: python
topics: ["collections", "Dictionaries"]
spec: {"mode": "function", "entry": "group_by_initial", "params": ["words"]}
---
### Concept
`defaultdict(factory)` creates missing keys on first access by calling `factory()`:

```python
from collections import defaultdict
groups = defaultdict(list)
groups["a"].append("apple")     # no KeyError, no setdefault
counts = defaultdict(int)
counts["x"] += 1                # int() == 0
```

Convert back with `dict(groups)` when you're done, so later typos don't silently create keys.

### Task
Write `group_by_initial(words)` returning a regular `dict` mapping each lowercase first letter to the list of words starting with it (original order preserved). Skip empty strings.

@@ hints
- `groups[w[0].lower()].append(w)`
- Return `dict(groups)`.

@@ starter
def group_by_initial(words):
    pass

@@ solution
def group_by_initial(words):
    groups = defaultdict(list)
    for w in words:
        if w:
            groups[w[0].lower()].append(w)
    return dict(groups)

@@ explanation
The factory `list` supplies an empty list for each new letter, so the loop body is one line.

@@ tests
{"args": [["apple", "Avocado", "banana", "blueberry", "cherry"]], "expected": {"a": ["apple", "Avocado"], "b": ["banana", "blueberry"], "c": ["cherry"]}}
{"args": [[]], "expected": {}}
{"args": [["", "x"]], "expected": {"x": ["x"]}}
{"args": [["Zed", "zoo", "Yak"]], "hidden": true}
