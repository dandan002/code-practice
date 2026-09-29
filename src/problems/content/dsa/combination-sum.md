---
title: Combination Sum
order: 112
difficulty: Medium
track: dsa
topics: ["Backtracking", "Array"]
spec: {"mode": "function", "entry": "combinationSum", "params": ["candidates", "target"], "compare": "nested-unordered"}
---
Given distinct positive integers `candidates` and a `target`, return all **unique combinations** that sum to `target`. Each number may be used any number of times. Two combinations are the same if they use the same numbers with the same frequencies.

@@ hints
- To avoid duplicates like `[2,3]` and `[3,2]`, only consider candidates at index `>= start`.
- Passing the same `start` again allows reusing a number.
- Stop early when the remaining target goes negative (sorting helps prune).

@@ starter
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        out = []
        path = []

        def backtrack(start, remaining):
            if remaining == 0:
                out.append(path[:])
                return
            for i in range(start, len(candidates)):
                c = candidates[i]
                if c > remaining:
                    break
                path.append(c)
                backtrack(i, remaining - c)
                path.pop()

        backtrack(0, target)
        return out

@@ explanation
Non-decreasing choice order guarantees each multiset is produced once. Sorting enables the early `break`.

**Time** exponential in target/min(candidates) · **Space** O(target)

@@ tests
{"args": [[2, 3, 6, 7], 7], "expected": [[2, 2, 3], [7]]}
{"args": [[2, 3, 5], 8], "expected": [[2, 2, 2, 2], [2, 3, 3], [3, 5]]}
{"args": [[2], 1], "expected": []}
{"args": [[7, 3, 2], 18], "hidden": true}
