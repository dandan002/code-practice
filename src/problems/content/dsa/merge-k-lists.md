---
title: Merge k Sorted Lists
order: 64
difficulty: Hard
track: dsa
topics: ["Linked List", "Heap", "Divide and Conquer"]
spec: {"mode": "function", "entry": "mergeKLists", "params": ["lists"], "argTypes": ["ListNode[]"], "returnType": "ListNode"}
---
You're given `lists`, an array of `k` sorted linked lists. Merge them all into one sorted linked list and return it.

@@ hints
- Merging one list at a time is O(k·N). Can you always pick the smallest front node quickly?
- A min-heap of `(value, tiebreaker, node)` gives the smallest front in O(log k).

@@ starter
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        pass

@@ solution
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next

@@ explanation
The heap always holds the current front of each list. The index `i` breaks ties so Python never tries to compare two `ListNode`s.

**Time** O(N log k) · **Space** O(k)

@@ tests
{"args": [[[1, 4, 5], [1, 3, 4], [2, 6]]], "expected": [1, 1, 2, 3, 4, 4, 5, 6]}
{"args": [[]], "expected": []}
{"args": [[[]]], "expected": []}
{"args": [[[2], [], [-1]]], "hidden": true}
{"gen": "[[sorted(rng.randint(-1000, 1000) for _ in range(200)) for _ in range(100)]]", "hidden": true}
