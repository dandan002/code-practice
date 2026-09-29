---
title: Valid Parentheses
order: 40
difficulty: Easy
track: dsa
topics: ["Stack", "String"]
spec: {"mode": "function", "entry": "isValid", "params": ["s"]}
---
Given a string `s` containing only `()[]{}`, return `True` if every bracket is closed by the same type, in the correct order.

@@ hints
- The most recent unmatched opener must be closed first. What data structure gives you "most recent"?
- A dict mapping closer → opener keeps the code short.

@@ starter
class Solution:
    def isValid(self, s: str) -> bool:
        pass

@@ solution
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)
        return not stack

@@ explanation
Push openers; each closer must match the top of the stack. The string is valid if the stack ends empty.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": ["()"], "expected": true}
{"args": ["()[]{}"], "expected": true}
{"args": ["(]"], "expected": false}
{"args": ["([)]"], "hidden": true}
{"args": ["{[]}"], "hidden": true}
{"args": ["(("], "hidden": true}
{"args": ["]"], "hidden": true}
