---
title: collections.Counter
order: 15
difficulty: Easy
track: python
topics: ["collections", "Dictionaries"]
spec: {"mode": "function", "entry": "top_words", "params": ["text", "n"]}
---
### Concept
`Counter` is a dict subclass for counting things:

```python
from collections import Counter
c = Counter("mississippi")
c["s"]              # 4
c["z"]              # 0  (missing keys count as zero, no KeyError)
c.most_common(2)    # [('i', 4), ('s', 4)]
c.update("sss")     # add more counts
Counter(a) - Counter(b)   # multiset difference
```

### Task
Write `top_words(text, n)` returning the `n` most common words in `text` as a list of `[word, count]` pairs, most common first. Words are lowercased and split on whitespace. Break ties **alphabetically**.

@@ hints
- `most_common` breaks ties by first-seen order, not alphabetically — so sort yourself.
- `sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))[:n]`

@@ starter
def top_words(text, n):
    pass

@@ solution
def top_words(text, n):
    counts = Counter(text.lower().split())
    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    return [[w, c] for w, c in ranked[:n]]

@@ explanation
`Counter` does the counting; a tuple sort key handles "count descending, then word ascending".

@@ tests
{"args": ["the cat and the hat and the bat", 2], "expected": [["the", 3], ["and", 2]]}
{"args": ["b a c b a", 3], "expected": [["a", 2], ["b", 2], ["c", 1]]}
{"args": ["", 1], "expected": []}
{"args": ["Go go GO stop Stop", 5], "hidden": true}
