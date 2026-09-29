---
title: Permutations
order: 111
difficulty: Medium
track: dsa
topics: ["Backtracking"]
spec: {"mode": "function", "entry": "permute", "params": ["nums"], "compare": "unordered"}
---
Given an array of distinct integers, return all possible permutations, in any order.

@@ hints
- Build a permutation one position at a time, choosing from the unused numbers.
- Track used numbers with a set or boolean list; undo the choice after recursing.

@@ starter
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        out = []
        path = []
        used = [False] * len(nums)

        def backtrack():
            if len(path) == len(nums):
                out.append(path[:])
                return
            for i, x in enumerate(nums):
                if not used[i]:
                    used[i] = True
                    path.append(x)
                    backtrack()
                    path.pop()
                    used[i] = False

        backtrack()
        return out

@@ explanation
Standard choose / explore / un-choose backtracking. (`itertools.permutations` exists, but it's worth writing once.)

**Time** O(n · n!) · **Space** O(n)

@@ tests
{"args": [[1, 2, 3]], "expected": [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]}
{"args": [[0, 1]], "expected": [[0, 1], [1, 0]]}
{"args": [[1]], "expected": [[1]]}
{"args": [[5, 6, 7, 8]], "hidden": true}
