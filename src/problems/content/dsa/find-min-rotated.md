---
title: Find Minimum in Rotated Sorted Array
order: 52
difficulty: Medium
track: dsa
topics: ["Binary Search", "Array"]
spec: {"mode": "function", "entry": "findMin", "params": ["nums"]}
---
A sorted array of **unique** integers has been rotated between 1 and n times. Return its minimum element in O(log n).

@@ hints
- Compare `nums[mid]` with `nums[hi]`.
- If `nums[mid] > nums[hi]`, the drop (and the minimum) is to the right of `mid`.

@@ starter
class Solution:
    def findMin(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def findMin(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]

@@ explanation
The minimum is the only point where the order "drops". Comparing against the right end tells you which side of `mid` the drop lies on.

**Time** O(log n) · **Space** O(1)

@@ tests
{"args": [[3, 4, 5, 1, 2]], "expected": 1}
{"args": [[4, 5, 6, 7, 0, 1, 2]], "expected": 0}
{"args": [[11, 13, 15, 17]], "expected": 11}
{"args": [[2, 1]], "hidden": true}
{"args": [[1]], "hidden": true}
