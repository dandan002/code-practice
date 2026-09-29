---
title: Longest Increasing Subsequence
order: 103
difficulty: Medium
track: dsa
topics: ["Dynamic Programming", "Binary Search"]
spec: {"mode": "function", "entry": "lengthOfLIS", "params": ["nums"]}
---
Given an integer array `nums`, return the length of the longest **strictly increasing subsequence** (elements in order, not necessarily contiguous).

**Follow-up:** O(n log n)?

@@ hints
- O(n²): `dp[i]` = longest increasing subsequence ending at `i`.
- O(n log n): keep `tails`, where `tails[k]` is the smallest possible tail of an increasing subsequence of length `k+1`. Use `bisect_left` to place each number.

@@ starter
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            i = bisect.bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)

@@ explanation
"Patience sorting": `tails` stays sorted, so each number either extends the longest run or replaces a tail with a smaller one via binary search.

**Time** O(n log n) · **Space** O(n)

@@ tests
{"args": [[10, 9, 2, 5, 3, 7, 101, 18]], "expected": 4}
{"args": [[0, 1, 0, 3, 2, 3]], "expected": 4}
{"args": [[7, 7, 7, 7]], "expected": 1}
{"gen": "[[rng.randint(-10**6, 10**6) for _ in range(5000)]]", "hidden": true}
