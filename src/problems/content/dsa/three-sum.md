---
title: 3Sum
order: 22
difficulty: Medium
track: dsa
topics: ["Two Pointers", "Array", "Sorting"]
spec: {"mode": "function", "entry": "threeSum", "params": ["nums"], "compare": "nested-unordered"}
---
Given an integer array `nums`, return all **unique** triplets `[a, b, c]` of elements at distinct indices such that `a + b + c == 0`.

The result must not contain duplicate triplets. Order doesn't matter.

@@ hints
- Sort first.
- Fix the first number, then solve "two sum on a sorted array" with two pointers on the rest.
- Skip equal neighbours to avoid duplicate triplets.

@@ starter
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        out = []
        n = len(nums)
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, n - 1
            while lo < hi:
                s = nums[i] + nums[lo] + nums[hi]
                if s < 0:
                    lo += 1
                elif s > 0:
                    hi -= 1
                else:
                    out.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
                    hi -= 1
        return out

@@ explanation
After sorting, each anchor `nums[i]` reduces the problem to a two-pointer scan. Skipping repeated values at both the anchor and the low pointer removes duplicates.

**Time** O(n²) · **Space** O(1) extra (ignoring output/sort)

@@ tests
{"args": [[-1, 0, 1, 2, -1, -4]], "expected": [[-1, -1, 2], [-1, 0, 1]]}
{"args": [[0, 1, 1]], "expected": []}
{"args": [[0, 0, 0]], "expected": [[0, 0, 0]]}
{"args": [[-2, 0, 1, 1, 2]], "hidden": true}
{"args": [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]], "hidden": true}
