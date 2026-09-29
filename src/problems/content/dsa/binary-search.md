---
title: Binary Search
order: 50
difficulty: Easy
track: dsa
topics: ["Binary Search", "Array"]
spec: {"mode": "function", "entry": "search", "params": ["nums", "target"]}
---
Given a sorted (ascending) array of distinct integers `nums` and a `target`, return the index of `target`, or `-1` if it isn't present.

Your algorithm must run in O(log n).

@@ hints
- Keep a range `[lo, hi]` that must contain the target if it exists.
- Compare with the middle element and discard half the range each step.

@@ starter
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        pass

@@ solution
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1

@@ explanation
The loop invariant is "if target exists, it's in `nums[lo..hi]`". Each iteration halves the range. (The standard library's `bisect.bisect_left` does the same thing.)

**Time** O(log n) · **Space** O(1)

@@ tests
{"args": [[-1, 0, 3, 5, 9, 12], 9], "expected": 4}
{"args": [[-1, 0, 3, 5, 9, 12], 2], "expected": -1}
{"args": [[5], 5], "hidden": true}
{"args": [[2, 5], 0], "hidden": true}
{"args": [[2, 5], 5], "hidden": true}
