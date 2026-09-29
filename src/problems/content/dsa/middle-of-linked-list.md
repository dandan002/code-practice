---
title: Middle of the Linked List
order: 63
difficulty: Easy
track: dsa
topics: ["Linked List", "Two Pointers"]
spec: {"mode": "function", "entry": "middleNode", "params": ["head"], "argTypes": ["ListNode"], "returnType": "ListNode"}
---
Given the `head` of a singly linked list, return the **middle** node. If there are two middle nodes, return the second one.

(The result is shown as the list starting at the node you return.)

@@ hints
- Fast & slow pointers: `fast` moves two steps for each step of `slow`.

@@ starter
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass

@@ solution
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow

@@ explanation
When `fast` runs off the end, `slow` has covered half the distance. The same trick (Floyd's tortoise & hare) detects cycles.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[1, 2, 3, 4, 5]], "expected": [3, 4, 5]}
{"args": [[1, 2, 3, 4, 5, 6]], "expected": [4, 5, 6]}
{"args": [[1]], "hidden": true}
