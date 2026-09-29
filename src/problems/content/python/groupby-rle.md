---
title: itertools.groupby
order: 17
difficulty: Easy
track: python
topics: ["itertools", "Iteration"]
spec: {"mode": "function", "entry": "rle", "params": ["s"]}
---
### Concept
`itertools` is a toolbox of fast iterator building blocks. A few favourites:

```python
from itertools import groupby, accumulate, pairwise, product, combinations, chain

[(k, len(list(g))) for k, g in groupby("aaabcc")]   # [('a',3), ('b',1), ('c',2)]
list(accumulate([1, 2, 3, 4]))                       # [1, 3, 6, 10] running sums
list(pairwise([1, 2, 3]))                            # [(1, 2), (2, 3)]
list(combinations("abc", 2))                         # [('a','b'), ('a','c'), ('b','c')]
list(chain([1, 2], [3]))                             # [1, 2, 3]
```

`groupby` groups **consecutive** equal items — sort first if you want global groups.

### Task
Write `rle(s)` that **run-length encodes** a string: each run of a repeated character becomes the count followed by the character, but a run of length 1 is just the character.

`"aaabccdddd"` → `"3ab2c4d"`

@@ hints
- `for ch, group in itertools.groupby(s):`
- `n = sum(1 for _ in group)` counts without building a list.

@@ starter
def rle(s):
    pass

@@ solution
def rle(s):
    out = []
    for ch, group in itertools.groupby(s):
        n = sum(1 for _ in group)
        out.append(f"{n}{ch}" if n > 1 else ch)
    return "".join(out)

@@ explanation
`groupby` hands you each run as `(key, iterator)`. Building a list of pieces and `"".join`-ing once is the idiomatic way to build strings.

@@ tests
{"args": ["aaabccdddd"], "expected": "3ab2c4d"}
{"args": ["abc"], "expected": "abc"}
{"args": [""], "expected": ""}
{"args": ["zzzzzzzzzzzz"], "hidden": true}
