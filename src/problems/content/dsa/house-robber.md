---
title: House Robber
order: 101
difficulty: Medium
track: dsa
topics: ["Dynamic Programming", "Array"]
spec: {"mode": "function", "entry": "rob", "params": ["nums"]}
---
Houses along a street hold `nums[i]` money. You can't rob two **adjacent** houses. Return the most money you can rob.

@@ hints
- At house `i` you either skip it (keep the best up to `i-1`) or rob it (`nums[i]` + best up to `i-2`).
- Two rolling variables are enough.

@@ starter
class Solution:
    def rob(self, nums: List[int]) -> int:
        pass

@@ solution
class Solution:
    def rob(self, nums: List[int]) -> int:
        prev, cur = 0, 0  # best up to i-2, best up to i-1
        for x in nums:
            prev, cur = cur, max(cur, prev + x)
        return cur

@@ explanation
`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`, kept in two variables.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[1, 2, 3, 1]], "expected": 4}
{"args": [[2, 7, 9, 3, 1]], "expected": 12}
{"args": [[2, 1, 1, 2]], "hidden": true}
{"args": [[5]], "hidden": true}
