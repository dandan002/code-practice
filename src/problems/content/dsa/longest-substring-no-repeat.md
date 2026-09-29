---
title: Longest Substring Without Repeating Characters
order: 31
difficulty: Medium
track: dsa
topics: ["Sliding Window", "String", "Hash Table"]
spec: {"mode": "function", "entry": "lengthOfLongestSubstring", "params": ["s"]}
---
Given a string `s`, return the length of the longest **substring** (contiguous) that contains no repeated characters.

@@ hints
- Keep a window `[left, right]` with all-unique characters.
- When `s[right]` is already in the window, move `left` past its previous occurrence.
- A dict of `char -> last index` lets you jump `left` directly.

@@ starter
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass

@@ solution
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = best = 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best

@@ explanation
Classic sliding window. The window only ever grows on the right and jumps forward on the left, so each index is visited a constant number of times.

**Time** O(n) · **Space** O(alphabet)

@@ tests
{"args": ["abcabcbb"], "expected": 3}
{"args": ["bbbbb"], "expected": 1}
{"args": ["pwwkew"], "expected": 3}
{"args": [""], "hidden": true}
{"args": ["abba"], "hidden": true}
{"args": ["dvdf"], "hidden": true}
