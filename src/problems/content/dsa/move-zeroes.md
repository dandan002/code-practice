---
title: Move Zeroes
order: 21
difficulty: Easy
track: dsa
topics: ["Two Pointers", "Array"]
spec: {"mode": "function", "entry": "moveZeroes", "params": ["nums"], "returnArg": 0}
---
Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements.

Do it **in place** — modify `nums` and return nothing. (The tests check `nums` after your function runs.)

@@ hints
- Keep a "write" pointer for where the next non-zero value should go.
- After placing every non-zero value, fill the rest with zeroes — or swap as you go.

@@ starter
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        pass

@@ solution
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        w = 0
        for r in range(len(nums)):
            if nums[r] != 0:
                nums[w], nums[r] = nums[r], nums[w]
                w += 1

@@ explanation
`w` marks the boundary of the non-zero prefix. Swapping each non-zero value into place pushes zeroes toward the end.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[0, 1, 0, 3, 12]], "expected": [1, 3, 12, 0, 0]}
{"args": [[0]], "expected": [0]}
{"args": [[1, 2, 3]], "hidden": true}
{"args": [[0, 0, 1]], "hidden": true}
