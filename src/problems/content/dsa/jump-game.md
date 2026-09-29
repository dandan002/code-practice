---
title: Jump Game
order: 122
difficulty: Medium
track: dsa
topics: ["Greedy", "Array"]
spec: {"mode": "function", "entry": "canJump", "params": ["nums"]}
---
You start at index `0`. `nums[i]` is the maximum jump length from index `i`. Return `True` if you can reach the last index.

@@ hints
- Track the farthest index reachable so far.
- If you ever stand on an index beyond that, you're stuck.

@@ starter
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        pass

@@ solution
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0
        for i, n in enumerate(nums):
            if i > reach:
                return False
            reach = max(reach, i + n)
        return True

@@ explanation
Greedy: keep extending the reachable frontier.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[2, 3, 1, 1, 4]], "expected": true}
{"args": [[3, 2, 1, 0, 4]], "expected": false}
{"args": [[0]], "hidden": true}
{"args": [[2, 0, 0]], "hidden": true}
