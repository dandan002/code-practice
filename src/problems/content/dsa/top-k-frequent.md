---
title: Top K Frequent Elements
order: 14
difficulty: Medium
track: dsa
topics: ["Array", "Hash Table", "Heap", "Bucket Sort"]
spec: {"mode": "function", "entry": "topKFrequent", "params": ["nums", "k"], "compare": "unordered"}
---
Given an integer array `nums` and an integer `k`, return the `k` most frequent elements, in any order. The answer is guaranteed to be unique.

**Follow-up:** can you beat O(n log n)?

@@ hints
- Count first: `Counter(nums)`.
- A heap of size `k` gives O(n log k).
- Bucket sort: index `i` of a list holds the numbers that appear exactly `i` times. Read buckets from the highest index down.

@@ starter
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        pass

@@ solution
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for x, c in count.items():
            buckets[c].append(x)
        out = []
        for c in range(len(buckets) - 1, 0, -1):
            for x in buckets[c]:
                out.append(x)
                if len(out) == k:
                    return out
        return out

@@ explanation
Frequencies are bounded by `n`, so bucket numbers by frequency and walk the buckets from high to low.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [[1, 1, 1, 2, 2, 3], 2], "expected": [1, 2]}
{"args": [[1], 1], "expected": [1]}
{"args": [[4, 4, 4, 4, 5, 5, 5, 6, 6, 7], 3], "hidden": true}
{"args": [[-1, -1, 2, 2, 2], 1], "hidden": true}
