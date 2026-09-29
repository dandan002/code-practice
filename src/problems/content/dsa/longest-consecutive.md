---
title: Longest Consecutive Sequence
order: 16
difficulty: Medium
track: dsa
topics: ["Array", "Hash Table"]
spec: {"mode": "function", "entry": "longestConsecutive", "params": ["nums"]}
---
Given an unsorted array of integers `nums`, return the length of the longest run of consecutive values (e.g. `4, 5, 6, 7`). The values don't need to be adjacent in the array.

Aim for O(n).

@@ hints
- Put everything in a set.
- Only start counting from `x` when `x - 1` is **not** in the set — then `x` is the start of a run.

@@ starter
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 not in s:
                y = x
                while y + 1 in s:
                    y += 1
                best = max(best, y - x + 1)
        return best

@@ explanation
Each run is walked exactly once, from its smallest element, so the total work is linear.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [[100, 4, 200, 1, 3, 2]], "expected": 4}
{"args": [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], "expected": 9}
{"args": [[]], "expected": 0}
{"args": [[1, 2, 0, 1]], "hidden": true}
{"gen": "[rng.sample(range(-200000, 200000), 50000)]", "hidden": true}
