---
title: Two Sum
order: 10
difficulty: Easy
track: dsa
topics: ["Array", "Hash Table"]
spec: {"mode": "function", "entry": "twoSum", "params": ["nums", "target"], "compare": "unordered"}
---
Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.

Each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Constraints**
- `2 <= len(nums) <= 10^4`
- `-10^9 <= nums[i], target <= 10^9`
- Exactly one valid answer exists.

@@ hints
- A brute force checks every pair — O(n²). Can you do it in one pass?
- For each number `x`, you need to know whether `target - x` has been seen before, and where.
- A dict mapping value → index answers that in O(1).

@@ starter
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass

@@ solution
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}  # value -> index
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []

@@ explanation
Walk the array once, remembering each value's index in a hash map. Before storing `x`, check whether its complement `target - x` is already there.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [[2, 7, 11, 15], 9], "expected": [0, 1]}
{"args": [[3, 2, 4], 6], "expected": [1, 2]}
{"args": [[3, 3], 6], "expected": [0, 1]}
{"args": [[-1, -2, -3, -4, -5], -8], "hidden": true}
{"args": [[0, 4, 3, 0], 0], "hidden": true}
{"gen": "[list(range(10000)), 19997]", "hidden": true}
