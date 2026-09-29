---
title: Group Anagrams
order: 13
difficulty: Medium
track: dsa
topics: ["String", "Hash Table", "Sorting"]
spec: {"mode": "function", "entry": "groupAnagrams", "params": ["strs"], "compare": "nested-unordered"}
---
Given a list of strings `strs`, group the **anagrams** together. You can return the groups, and the words inside each group, in any order.

**Constraints**
- `1 <= len(strs) <= 10^4`
- `0 <= len(strs[i]) <= 100`, lowercase letters

@@ hints
- Two words are anagrams exactly when they have the same *signature*.
- `"".join(sorted(word))` is one signature. A tuple of 26 letter counts is another.
- Use a `defaultdict(list)` keyed by signature.

@@ starter
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        pass

@@ solution
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for w in strs:
            groups["".join(sorted(w))].append(w)
        return list(groups.values())

@@ explanation
Bucket words by their sorted letters. With a counts-tuple key the per-word cost drops from O(k log k) to O(k).

**Time** O(n · k log k) · **Space** O(n · k)

@@ tests
{"args": [["eat", "tea", "tan", "ate", "nat", "bat"]], "expected": [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]}
{"args": [[""]], "expected": [[""]]}
{"args": [["a"]], "expected": [["a"]]}
{"args": [["abc", "bca", "cab", "xyz", "zyx", "q"]], "hidden": true}
