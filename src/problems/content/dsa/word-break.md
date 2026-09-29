---
title: Word Break
order: 105
difficulty: Medium
track: dsa
topics: ["Dynamic Programming", "String", "Hash Table"]
spec: {"mode": "function", "entry": "wordBreak", "params": ["s", "wordDict"]}
---
Given a string `s` and a list of words `wordDict`, return `True` if `s` can be split into a sequence of one or more dictionary words (words may be reused).

@@ hints
- `ok[i]` = can `s[:i]` be segmented?
- `ok[i]` is true if some `j < i` has `ok[j]` true and `s[j:i]` is a word.

@@ starter
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        pass

@@ solution
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        max_len = max(map(len, words), default=0)
        ok = [True] + [False] * len(s)
        for i in range(1, len(s) + 1):
            for j in range(max(0, i - max_len), i):
                if ok[j] and s[j:i] in words:
                    ok[i] = True
                    break
        return ok[-1]

@@ explanation
Prefix DP. Limiting `j` to the longest word length keeps it fast.

**Time** O(n · L) · **Space** O(n)

@@ tests
{"args": ["leetcode", ["leet", "code"]], "expected": true}
{"args": ["applepenapple", ["apple", "pen"]], "expected": true}
{"args": ["catsandog", ["cats", "dog", "sand", "and", "cat"]], "expected": false}
{"args": ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", ["a", "aa", "aaa", "aaaa"]], "hidden": true}
