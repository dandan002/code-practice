---
title: Contains Duplicate
order: 11
difficulty: Easy
track: dsa
topics: ["Array", "Hash Table"]
spec: {"mode": "function", "entry": "containsDuplicate", "params": ["nums"]}
---
Given an integer array `nums`, return `True` if any value appears **at least twice**, and `False` if every element is distinct.

**Constraints**
- `1 <= len(nums) <= 10^5`

@@ hints
- Sorting puts duplicates next to each other — O(n log n).
- A `set` lets you check "seen before?" in O(1).

@@ starter
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        pass

@@ solution
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for x in nums:
            if x in seen:
                return True
            seen.add(x)
        return False

@@ explanation
Track values in a set; the first repeat answers the question. (One-liner: `len(set(nums)) != len(nums)`.)

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [[1, 2, 3, 1]], "expected": true}
{"args": [[1, 2, 3, 4]], "expected": false}
{"args": [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], "expected": true}
{"args": [[7]], "hidden": true}
{"gen": "[list(range(100000))]", "hidden": true}
