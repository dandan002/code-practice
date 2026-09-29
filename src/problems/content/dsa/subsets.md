---
title: Subsets
order: 110
difficulty: Medium
track: dsa
topics: ["Backtracking", "Bit Manipulation"]
spec: {"mode": "function", "entry": "subsets", "params": ["nums"], "compare": "nested-unordered"}
---
Given an array of **unique** integers, return all possible subsets (the power set), in any order, without duplicates.

@@ hints
- Each element is either in or out: 2ⁿ subsets.
- Iterative: start with `[[]]` and, for each number, add it to every existing subset.
- Backtracking: at index `i`, recurse with and without `nums[i]`.

@@ starter
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        out = []
        path = []

        def backtrack(i):
            if i == len(nums):
                out.append(path[:])
                return
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()
            backtrack(i + 1)

        backtrack(0)
        return out

@@ explanation
The include/exclude decision tree has 2ⁿ leaves. Note `path[:]` — appending `path` itself would store a reference that later changes.

**Time** O(n · 2ⁿ) · **Space** O(n) recursion

@@ tests
{"args": [[1, 2, 3]], "expected": [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]}
{"args": [[0]], "expected": [[], [0]]}
{"args": [[4, 1, 0, 9]], "hidden": true}
