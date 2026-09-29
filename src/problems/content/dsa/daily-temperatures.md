---
title: Daily Temperatures
order: 42
difficulty: Medium
track: dsa
topics: ["Stack", "Monotonic Stack", "Array"]
spec: {"mode": "function", "entry": "dailyTemperatures", "params": ["temperatures"]}
---
Given daily `temperatures`, return a list `answer` where `answer[i]` is how many days you have to wait after day `i` for a **warmer** temperature. Use `0` if there is no future warmer day.

@@ hints
- Keep a stack of days still waiting for a warmer day.
- The stack's temperatures are decreasing — when a warmer day arrives, it resolves everything cooler on top.

@@ starter
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        pass

@@ solution
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        answer = [0] * len(temperatures)
        stack = []  # indices, temperatures decreasing
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                answer[j] = i - j
            stack.append(i)
        return answer

@@ explanation
A **monotonic stack**: each index is pushed and popped at most once, so the nested loop is still linear overall.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [[73, 74, 75, 71, 69, 72, 76, 73]], "expected": [1, 1, 4, 2, 1, 1, 0, 0]}
{"args": [[30, 40, 50, 60]], "expected": [1, 1, 1, 0]}
{"args": [[30, 60, 90]], "expected": [1, 1, 0]}
{"gen": "[[rng.randint(30, 100) for _ in range(50000)]]", "hidden": true}
