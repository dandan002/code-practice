---
title: List Comprehensions
order: 10
difficulty: Easy
track: python
topics: ["Comprehensions", "Basics"]
spec: {"mode": "function", "entry": "squares_of_evens", "params": ["nums"]}
---
### Concept
A **list comprehension** builds a list from an iterable in one expression:

```python
[expr for item in iterable if condition]

[n * 2 for n in range(5)]           # [0, 2, 4, 6, 8]
[w.upper() for w in words if w]     # skip empty strings
```

It reads left to right like the equivalent loop, but is shorter and usually faster.

### Task
Write `squares_of_evens(nums)` that returns the squares of the **even** numbers in `nums`, in their original order. Use a single list comprehension.

@@ hints
- The filter goes at the end: `... for n in nums if n % 2 == 0`.

@@ starter
def squares_of_evens(nums):
    pass

@@ solution
def squares_of_evens(nums):
    return [n * n for n in nums if n % 2 == 0]

@@ explanation
`[n * n for n in nums if n % 2 == 0]` — the `if` clause filters, the leading expression transforms. Note `-4 % 2 == 0` in Python, so negative evens work too.

@@ tests
{"args": [[1, 2, 3, 4, 5, 6]], "expected": [4, 16, 36]}
{"args": [[1, 3, 5]], "expected": []}
{"args": [[-4, 0, 7]], "expected": [16, 0]}
{"args": [[]], "hidden": true}
