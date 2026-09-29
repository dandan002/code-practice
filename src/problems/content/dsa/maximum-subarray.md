---
title: Maximum Subarray
order: 121
difficulty: Medium
track: dsa
topics: ["Greedy", "Dynamic Programming", "Array"]
spec: {"mode": "function", "entry": "maxSubArray", "params": ["nums"]}
---
Given an integer array `nums`, find the contiguous subarray (at least one element) with the largest sum and return that sum.

@@ hints
- **Kadane's algorithm:** the best subarray ending at `i` either extends the best one ending at `i-1`, or starts fresh at `i`.
- If the running sum drops below zero, it can only hurt what comes next.

@@ starter
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best = cur = nums[0]
        for x in nums[1:]:
            cur = max(x, cur + x)
            best = max(best, cur)
        return best

@@ explanation
Kadane's algorithm in two variables.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], "expected": 6}
{"args": [[1]], "expected": 1}
{"args": [[5, 4, -1, 7, 8]], "expected": 23}
{"args": [[-3, -2, -5]], "hidden": true}
