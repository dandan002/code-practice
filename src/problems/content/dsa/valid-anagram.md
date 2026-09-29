---
title: Valid Anagram
order: 12
difficulty: Easy
track: dsa
topics: ["String", "Hash Table", "Sorting"]
spec: {"mode": "function", "entry": "isAnagram", "params": ["s", "t"]}
---
Given two strings `s` and `t`, return `True` if `t` is an **anagram** of `s` (uses exactly the same letters, the same number of times), and `False` otherwise.

**Constraints**
- `1 <= len(s), len(t) <= 5 * 10^4`
- Lowercase English letters only.

@@ hints
- If the lengths differ, it can't be an anagram.
- Count characters in each string and compare the counts.

@@ starter
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass

@@ solution
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        counts = {}
        for a, b in zip(s, t):
            counts[a] = counts.get(a, 0) + 1
            counts[b] = counts.get(b, 0) - 1
        return all(v == 0 for v in counts.values())

@@ explanation
Increment for letters of `s`, decrement for letters of `t`; every count must end at zero. `Counter(s) == Counter(t)` is the idiomatic one-liner.

**Time** O(n) · **Space** O(1) (26 letters)

@@ tests
{"args": ["anagram", "nagaram"], "expected": true}
{"args": ["rat", "car"], "expected": false}
{"args": ["a", "ab"], "hidden": true}
{"args": ["aacc", "ccac"], "hidden": true}
