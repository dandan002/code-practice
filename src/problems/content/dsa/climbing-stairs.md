---
title: Climbing Stairs
order: 100
difficulty: Easy
track: dsa
topics: ["Dynamic Programming", "Math"]
spec: {"mode": "function", "entry": "climbStairs", "params": ["n"]}
---
You're climbing a staircase with `n` steps. Each move you climb either 1 or 2 steps. In how many distinct ways can you reach the top?

@@ hints
- To reach step `n`, your last move came from step `n-1` or `n-2`.
- So `ways(n) = ways(n-1) + ways(n-2)` — look familiar?

@@ starter
class Solution:
    def climbStairs(self, n: int) -> int:
        pass

@@ solution
class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n):
            a, b = b, a + b
        return a

@@ explanation
It's Fibonacci. Only the last two values are needed, so the DP table collapses to two variables.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [2], "expected": 2}
{"args": [3], "expected": 3}
{"args": [1], "hidden": true}
{"args": [45], "hidden": true}
