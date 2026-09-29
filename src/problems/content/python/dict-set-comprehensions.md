---
title: Dict & Set Comprehensions
order: 11
difficulty: Easy
track: python
topics: ["Comprehensions", "Dictionaries"]
spec: {"mode": "function", "entry": "word_lengths", "params": ["sentence"]}
---
### Concept
Comprehensions also build dicts and sets:

```python
{k: v for k, v in pairs}          # dict
{x % 3 for x in range(10)}        # set -> {0, 1, 2}
{v: k for k, v in d.items()}      # invert a dict
```

### Task
Write `word_lengths(sentence)` that returns a dict mapping each **lowercased** word in `sentence` to its length. Words are separated by whitespace. Ignore words that are 3 characters or shorter.

@@ hints
- `sentence.split()` splits on any whitespace.
- `{w.lower(): len(w) for w in ... if len(w) > 3}`

@@ starter
def word_lengths(sentence):
    pass

@@ solution
def word_lengths(sentence):
    return {w.lower(): len(w) for w in sentence.split() if len(w) > 3}

@@ explanation
A dict comprehension with a filter. Duplicate keys simply overwrite earlier ones (same length here anyway).

@@ tests
{"args": ["The quick brown fox jumps"], "expected": {"quick": 5, "brown": 5, "jumps": 5}}
{"args": ["Python is Great"], "expected": {"python": 6, "great": 5}}
{"args": ["a an the"], "expected": {}}
{"args": ["  Spaces   everywhere  "], "hidden": true}
