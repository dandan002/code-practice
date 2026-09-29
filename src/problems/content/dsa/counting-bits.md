---
title: Counting Bits
order: 131
difficulty: Easy
track: dsa
topics: ["Bit Manipulation", "Dynamic Programming"]
spec: {"mode": "function", "entry": "countBits", "params": ["n"]}
---
Given `n`, return a list `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in the binary representation of `i`.

Can you do it in O(n) without counting bit by bit?

@@ hints
- `i >> 1` drops the last bit of `i`. You already know its bit count.
- `ans[i] = ans[i >> 1] + (i & 1)`.

@@ starter
class Solution:
    def countBits(self, n: int) -> List[int]:
        pass

@@ solution
class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i >> 1] + (i & 1)
        return ans

@@ explanation
DP over bit prefixes: shifting right by one reuses an earlier answer.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [2], "expected": [0, 1, 1]}
{"args": [5], "expected": [0, 1, 1, 2, 1, 2]}
{"args": [0], "hidden": true}
{"args": [16], "hidden": true}
