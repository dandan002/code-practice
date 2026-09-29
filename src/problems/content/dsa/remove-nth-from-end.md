---
title: Remove Nth Node From End of List
order: 62
difficulty: Medium
track: dsa
topics: ["Linked List", "Two Pointers"]
spec: {"mode": "function", "entry": "removeNthFromEnd", "params": ["head", "n"], "argTypes": ["ListNode", null], "returnType": "ListNode"}
---
Given the `head` of a linked list, remove the `n`-th node **from the end** and return the head. Try to do it in one pass.

@@ hints
- Move a `fast` pointer `n` steps ahead, then move `fast` and `slow` together until `fast` hits the end.
- Start `slow` at a dummy node before `head` so removing the first node isn't a special case.

@@ starter
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        pass

@@ solution
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n):
            fast = fast.next
        while fast.next:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next

@@ explanation
The gap of `n` nodes between the two pointers means that when `fast` reaches the last node, `slow` is just before the node to delete.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[1, 2, 3, 4, 5], 2], "expected": [1, 2, 3, 5]}
{"args": [[1], 1], "expected": []}
{"args": [[1, 2], 1], "expected": [1]}
{"args": [[1, 2], 2], "hidden": true}
