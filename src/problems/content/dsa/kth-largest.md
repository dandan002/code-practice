---
title: Kth Largest Element in an Array
order: 80
difficulty: Medium
track: dsa
topics: ["Heap", "Array", "Quickselect"]
spec: {"mode": "function", "entry": "findKthLargest", "params": ["nums", "k"]}
---
Given an integer array `nums` and an integer `k`, return the `k`-th largest element (in sorted order, not the k-th distinct).

Can you do better than sorting?

@@ hints
- Keep a **min-heap of size k**. Its root is the k-th largest seen so far.
- `heapq` is a min-heap: `heappush`, `heappop`, and `heappushpop`.

@@ starter
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        pass

@@ solution
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = nums[:k]
        heapq.heapify(heap)
        for x in nums[k:]:
            if x > heap[0]:
                heapq.heapreplace(heap, x)
        return heap[0]

@@ explanation
The heap keeps the k largest values seen; the smallest of those sits at `heap[0]`. (`heapq.nlargest(k, nums)[-1]` does this for you.) Quickselect averages O(n).

**Time** O(n log k) · **Space** O(k)

@@ tests
{"args": [[3, 2, 1, 5, 6, 4], 2], "expected": 5}
{"args": [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], "expected": 4}
{"args": [[1], 1], "hidden": true}
{"gen": "[[rng.randint(-10000, 10000) for _ in range(50000)], 500]", "hidden": true}
