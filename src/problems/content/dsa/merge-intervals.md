---
title: Merge Intervals
order: 120
difficulty: Medium
track: dsa
topics: ["Intervals", "Sorting", "Array"]
spec: {"mode": "function", "entry": "merge", "params": ["intervals"]}
---
Given a list of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return the non-overlapping result, **sorted by start**.

Intervals that touch (e.g. `[1,4]` and `[4,5]`) count as overlapping.

@@ hints
- Sort by start time.
- Walk through; if the current interval starts at or before the last merged interval's end, extend it.

@@ starter
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        out = []
        for start, end in sorted(intervals):
            if out and start <= out[-1][1]:
                out[-1][1] = max(out[-1][1], end)
            else:
                out.append([start, end])
        return out

@@ explanation
After sorting, overlapping intervals are adjacent, so a single sweep merges them.

**Time** O(n log n) · **Space** O(n)

@@ tests
{"args": [[[1, 3], [2, 6], [8, 10], [15, 18]]], "expected": [[1, 6], [8, 10], [15, 18]]}
{"args": [[[1, 4], [4, 5]]], "expected": [[1, 5]]}
{"args": [[[1, 4], [0, 4]]], "hidden": true}
{"args": [[[1, 4], [2, 3]]], "hidden": true}
