---
title: Reverse Linked List
order: 60
difficulty: Easy
track: dsa
topics: ["Linked List", "Recursion"]
spec: {"mode": "function", "entry": "reverseList", "params": ["head"], "argTypes": ["ListNode"], "returnType": "ListNode"}
---
Given the `head` of a singly linked list, reverse the list and return the new head.

Lists are written as arrays in the examples, e.g. `[1,2,3]` is `1 → 2 → 3`. `ListNode` (with `.val` and `.next`) is already defined for you.

@@ hints
- Walk the list keeping `prev` and `cur`. Before re-pointing `cur.next`, save the old next.
- Recursive version: reverse the rest, then hook `head` onto the end.

@@ starter
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass

@@ solution
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        cur = head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        return prev

@@ explanation
Iteratively flip each `next` pointer. Python's tuple assignment makes this compact: `cur.next, prev, cur = prev, cur, cur.next`.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[1, 2, 3, 4, 5]], "expected": [5, 4, 3, 2, 1]}
{"args": [[1, 2]], "expected": [2, 1]}
{"args": [[]], "expected": []}
{"args": [[7]], "hidden": true}
