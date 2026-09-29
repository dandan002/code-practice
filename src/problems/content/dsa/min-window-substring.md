---
title: Minimum Window Substring
order: 32
difficulty: Hard
track: dsa
topics: ["Sliding Window", "String", "Hash Table"]
spec: {"mode": "function", "entry": "minWindow", "params": ["s", "t"]}
---
Given strings `s` and `t`, return the **shortest substring** of `s` that contains every character of `t` (including duplicates). If there's no such substring, return `""`.

The answer is guaranteed to be unique.

@@ hints
- Expand `right` until the window covers `t`, then shrink `left` as far as possible while it still covers `t`.
- Track how many distinct characters currently meet their required count, so checking "covers t" is O(1).

@@ starter
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        pass

@@ solution
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(need)  # distinct chars not yet satisfied
        have = defaultdict(int)
        best = (float("inf"), 0, 0)
        left = 0
        for right, ch in enumerate(s):
            have[ch] += 1
            if ch in need and have[ch] == need[ch]:
                missing -= 1
            while missing == 0:
                if right - left + 1 < best[0]:
                    best = (right - left + 1, left, right + 1)
                c = s[left]
                have[c] -= 1
                if c in need and have[c] < need[c]:
                    missing += 1
                left += 1
        return s[best[1]:best[2]] if best[0] != float("inf") else ""

@@ explanation
Expand to become valid, contract to become minimal. `missing` counts distinct characters still short of their target, making validity checks constant-time.

**Time** O(|s| + |t|) · **Space** O(alphabet)

@@ tests
{"args": ["ADOBECODEBANC", "ABC"], "expected": "BANC"}
{"args": ["a", "a"], "expected": "a"}
{"args": ["a", "aa"], "expected": ""}
{"args": ["aaflslflsldkalskaaa", "aaa"], "hidden": true}
{"args": ["cabwefgewcwaefgcf", "cae"], "hidden": true}
