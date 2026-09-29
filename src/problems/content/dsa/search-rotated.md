---
title: Search in Rotated Sorted Array
order: 51
difficulty: Medium
track: dsa
topics: ["Binary Search", "Array"]
spec: {"mode": "function", "entry": "search", "params": ["nums", "target"]}
---
A sorted array of distinct integers was **rotated** at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`).

Given the rotated array `nums` and a `target`, return its index or `-1`. Must be O(log n).

@@ hints
- After picking `mid`, at least one half — `[lo, mid]` or `[mid, hi]` — is properly sorted.
- Check whether the target falls inside the sorted half's range; if not, it's in the other half.

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
            if nums[lo] <= nums[mid]:  # left half sorted
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:  # right half sorted
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1

@@ explanation
Identify which half is sorted by comparing its endpoints, then use that half's range to decide where the target must be.

**Time** O(log n) · **Space** O(1)

@@ tests
{"args": [[4, 5, 6, 7, 0, 1, 2], 0], "expected": 4}
{"args": [[4, 5, 6, 7, 0, 1, 2], 3], "expected": -1}
{"args": [[1], 0], "expected": -1}
{"args": [[3, 1], 1], "hidden": true}
{"args": [[5, 1, 3], 5], "hidden": true}
{"args": [[6, 7, 1, 2, 3, 4, 5], 7], "hidden": true}
