---
title: Edit Distance
order: 106
difficulty: Hard
track: dsa
topics: ["Dynamic Programming", "String"]
spec: {"mode": "function", "entry": "minDistance", "params": ["word1", "word2"]}
---
Return the minimum number of operations to convert `word1` into `word2`, where an operation is inserting, deleting, or replacing one character.

@@ hints
- `dp[i][j]` = edit distance between `word1[:i]` and `word2[:j]`.
- If the last characters match, it's `dp[i-1][j-1]`. Otherwise 1 + the min of delete `dp[i-1][j]`, insert `dp[i][j-1]`, replace `dp[i-1][j-1]`.

@@ starter
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        pass

@@ solution
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        prev = list(range(len(word2) + 1))
        for i, a in enumerate(word1, 1):
            cur = [i]
            for j, b in enumerate(word2, 1):
                if a == b:
                    cur.append(prev[j - 1])
                else:
                    cur.append(1 + min(prev[j], cur[j - 1], prev[j - 1]))
            prev = cur
        return prev[-1]

@@ explanation
Levenshtein distance. The base cases are the costs of building from / deleting to an empty string.

**Time** O(n·m) · **Space** O(m)

@@ tests
{"args": ["horse", "ros"], "expected": 3}
{"args": ["intention", "execution"], "expected": 5}
{"args": ["", "abc"], "hidden": true}
{"args": ["kitten", "sitting"], "hidden": true}
