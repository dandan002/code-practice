---
title: Slicing
order: 13
difficulty: Easy
track: python
topics: ["Sequences", "Basics"]
spec: {"mode": "function", "entry": "rotate", "params": ["items", "k"]}
---
### Concept
`seq[start:stop:step]` works on lists, strings and tuples. Any part can be omitted, and negatives count from the end:

```python
s = "abcdef"
s[1:4]    # 'bcd'
s[-2:]    # 'ef'   (last two)
s[:-2]    # 'abcd' (all but last two)
s[::2]    # 'ace'  (every second)
s[::-1]   # 'fedcba' (reversed)
```

Slices never raise `IndexError` — out-of-range bounds are clamped.

### Task
Write `rotate(items, k)` that returns a **new** list rotated right by `k` positions. `k` may be larger than the length, and `items` may be empty. Use slicing.

@@ hints
- Rotating right by `k` moves the last `k` items to the front.
- Reduce `k` with `k % len(items)` — but watch out for empty lists.

@@ starter
def rotate(items, k):
    pass

@@ solution
def rotate(items, k):
    if not items:
        return []
    k %= len(items)
    return items[-k:] + items[:-k] if k else items[:]

@@ explanation
`items[-k:] + items[:-k]`. The `k == 0` case needs care because `items[-0:]` is the whole list and `items[:-0]` is empty.

@@ tests
{"args": [[1, 2, 3, 4, 5], 2], "expected": [4, 5, 1, 2, 3]}
{"args": [[1, 2, 3], 3], "expected": [1, 2, 3]}
{"args": [[1, 2, 3], 7], "expected": [3, 1, 2]}
{"args": [[], 4], "hidden": true}
{"args": [["a", "b"], 0], "hidden": true}
