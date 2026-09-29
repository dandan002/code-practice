---
title: Valid Palindrome
order: 20
difficulty: Easy
track: dsa
topics: ["Two Pointers", "String"]
spec: {"mode": "function", "entry": "isPalindrome", "params": ["s"]}
---
A phrase is a **palindrome** if, after lowercasing and removing every non-alphanumeric character, it reads the same forward and backward.

Given a string `s`, return `True` if it is a palindrome.

@@ hints
- `ch.isalnum()` and `ch.lower()` are your friends.
- Try two pointers moving inward, skipping characters that don't count — no extra string needed.

@@ starter
class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass

@@ solution
class Solution:
    def isPalindrome(self, s: str) -> bool:
        i, j = 0, len(s) - 1
        while i < j:
            if not s[i].isalnum():
                i += 1
            elif not s[j].isalnum():
                j -= 1
            elif s[i].lower() != s[j].lower():
                return False
            else:
                i += 1
                j -= 1
        return True

@@ explanation
Two pointers converge from both ends, skipping punctuation and comparing case-insensitively.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": ["A man, a plan, a canal: Panama"], "expected": true}
{"args": ["race a car"], "expected": false}
{"args": [" "], "expected": true}
{"args": ["0P"], "hidden": true}
{"args": ["ab_a"], "hidden": true}
