---
title: Longest Common Subsequence
order: 104
difficulty: Medium
track: dsa
topics: ["Dynamic Programming", "String"]
spec: {"mode": "function", "entry": "longestCommonSubsequence", "params": ["text1", "text2"]}
---
Given two strings, return the length of their longest **common subsequence** (characters appearing in both, in the same relative order), or `0` if none.

@@ hints
- 2D DP: `dp[i][j]` = LCS of `text1[:i]` and `text2[:j]`.
- If the last characters match: `dp[i-1][j-1] + 1`. Otherwise: `max(dp[i-1][j], dp[i][j-1])`.

@@ starter
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        pass

@@ solution
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        prev = [0] * (len(text2) + 1)
        for a in text1:
            cur = [0]
            for j, b in enumerate(text2):
                cur.append(prev[j] + 1 if a == b else max(prev[j + 1], cur[j]))
            prev = cur
        return prev[-1]

@@ explanation
The classic 2D table, compressed to one row at a time.

**Time** O(n·m) · **Space** O(m)

@@ tests
{"args": ["abcde", "ace"], "expected": 3}
{"args": ["abc", "abc"], "expected": 3}
{"args": ["abc", "def"], "expected": 0}
{"args": ["bsbininm", "jmjkbkjkv"], "hidden": true}
