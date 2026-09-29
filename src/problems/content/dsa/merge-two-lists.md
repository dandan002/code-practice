---
title: Merge Two Sorted Lists
order: 61
difficulty: Easy
track: dsa
topics: ["Linked List", "Recursion"]
spec: {"mode": "function", "entry": "mergeTwoLists", "params": ["list1", "list2"], "argTypes": ["ListNode", "ListNode"], "returnType": "ListNode"}
---
Merge two sorted linked lists `list1` and `list2` into one sorted list made by splicing together their nodes. Return its head.

@@ hints
- A **dummy** head node removes the special case for the first element.
- Repeatedly attach the smaller front node, then attach whatever remains.

@@ starter
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        pass

@@ solution
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next

@@ explanation
The dummy-node pattern: build the answer after a placeholder, then return `dummy.next`.

**Time** O(n + m) · **Space** O(1)

@@ tests
{"args": [[1, 2, 4], [1, 3, 4]], "expected": [1, 1, 2, 3, 4, 4]}
{"args": [[], []], "expected": []}
{"args": [[], [0]], "expected": [0]}
{"args": [[5], [1, 2, 3]], "hidden": true}
