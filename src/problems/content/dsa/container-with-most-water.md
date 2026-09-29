---
title: Container With Most Water
order: 23
difficulty: Medium
track: dsa
topics: ["Two Pointers", "Greedy", "Array"]
spec: {"mode": "function", "entry": "maxArea", "params": ["height"]}
---
You're given `height`, where `height[i]` is the height of a vertical line at position `i`. Choose two lines that, together with the x-axis, hold the most water.

Return the maximum amount of water (width × the shorter height).

@@ hints
- Start with the widest container: pointers at both ends.
- Moving the taller line inward can never help. Which pointer should move?

@@ starter
class Solution:
    def maxArea(self, height: List[int]) -> int:
        pass

@@ solution
class Solution:
    def maxArea(self, height: List[int]) -> int:
        i, j = 0, len(height) - 1
        best = 0
        while i < j:
            best = max(best, (j - i) * min(height[i], height[j]))
            if height[i] < height[j]:
                i += 1
            else:
                j -= 1
        return best

@@ explanation
The area is limited by the shorter line. Moving the shorter pointer is the only move that could find a taller limit, so each step safely discards one line.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[1, 8, 6, 2, 5, 4, 8, 3, 7]], "expected": 49}
{"args": [[1, 1]], "expected": 1}
{"args": [[4, 3, 2, 1, 4]], "hidden": true}
{"gen": "[[rng.randint(0, 10000) for _ in range(50000)]]", "hidden": true}
