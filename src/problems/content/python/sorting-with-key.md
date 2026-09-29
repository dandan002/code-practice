---
title: Sorting with key=
order: 14
difficulty: Easy
track: python
topics: ["Sorting", "Lambdas"]
spec: {"mode": "function", "entry": "rank_people", "params": ["people"]}
---
### Concept
`sorted(iterable, key=fn, reverse=False)` sorts by whatever `fn` returns for each item. Returning a **tuple** sorts by multiple fields, in order:

```python
sorted(words, key=len)                       # shortest first
sorted(people, key=lambda p: (p[1], p[0]))   # by age, then name
sorted(nums, key=abs, reverse=True)
```

Python's sort is **stable**: items with equal keys keep their original order. To mix directions on numbers, negate: `key=lambda p: (-p.score, p.name)`.

### Task
`people` is a list of `[name, age]` pairs. Return the names sorted by **age descending**, breaking ties by **name ascending**.

@@ hints
- `key=lambda p: (-p[1], p[0])`
- Then pull out just the names.

@@ starter
def rank_people(people):
    pass

@@ solution
def rank_people(people):
    return [name for name, age in sorted(people, key=lambda p: (-p[1], p[0]))]

@@ explanation
Negating the numeric field flips its direction while the name stays ascending in the same tuple key.

@@ tests
{"args": [[["Zoe", 30], ["Adam", 25], ["Bea", 30]]], "expected": ["Bea", "Zoe", "Adam"]}
{"args": [[["Solo", 1]]], "expected": ["Solo"]}
{"args": [[]], "expected": []}
{"args": [[["b", 5], ["a", 5], ["c", 9], ["d", 1]]], "hidden": true}
