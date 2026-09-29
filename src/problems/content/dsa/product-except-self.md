---
title: Product of Array Except Self
order: 15
difficulty: Medium
track: dsa
topics: ["Array", "Prefix Sum"]
spec: {"mode": "function", "entry": "productExceptSelf", "params": ["nums"]}
---
Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element of `nums` **except** `nums[i]`.

You must run in O(n) time and **without using division**.

@@ hints
- `answer[i]` = (product of everything to the left) × (product of everything to the right).
- Fill `answer` with prefix products in one pass, then multiply in suffix products in a second pass going backwards.

@@ starter
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        pass

@@ solution
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        out = [1] * n
        prefix = 1
        for i in range(n):
            out[i] = prefix
            prefix *= nums[i]
        suffix = 1
        for i in range(n - 1, -1, -1):
            out[i] *= suffix
            suffix *= nums[i]
        return out

@@ explanation
Two sweeps: the forward pass stores prefix products, the backward pass multiplies in a running suffix product. No extra arrays needed beyond the output.

**Time** O(n) · **Space** O(1) extra

@@ tests
{"args": [[1, 2, 3, 4]], "expected": [24, 12, 8, 6]}
{"args": [[-1, 1, 0, -3, 3]], "expected": [0, 0, 9, 0, 0]}
{"args": [[2, 3]], "hidden": true}
{"args": [[0, 0, 5]], "hidden": true}
