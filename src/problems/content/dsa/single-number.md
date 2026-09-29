---
title: Single Number
order: 130
difficulty: Easy
track: dsa
topics: ["Bit Manipulation", "Array"]
spec: {"mode": "function", "entry": "singleNumber", "params": ["nums"]}
---
Every element of `nums` appears twice except for one. Find that single one, in O(n) time and O(1) extra space.

@@ hints
- XOR has two useful properties: `x ^ x == 0` and `x ^ 0 == x`.
- XOR is also commutative — order doesn't matter.

@@ starter
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        out = 0
        for x in nums:
            out ^= x
        return out

@@ explanation
Pairs cancel under XOR, leaving the unique value. `functools.reduce(operator.xor, nums)` is the one-liner.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[2, 2, 1]], "expected": 1}
{"args": [[4, 1, 2, 1, 2]], "expected": 4}
{"args": [[1]], "expected": 1}
{"args": [[-3, 5, 5]], "hidden": true}
