---
title: Binary Tree Level Order Traversal
order: 73
difficulty: Medium
track: dsa
topics: ["Tree", "BFS"]
spec: {"mode": "function", "entry": "levelOrder", "params": ["root"], "argTypes": ["TreeNode"]}
---
Given the `root` of a binary tree, return the values level by level, left to right: a list of lists, one per level.

@@ hints
- BFS with a `deque`.
- Process one level at a time: the queue's length at the start of a level is how many nodes it has.

@@ starter
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        pass

@@ solution
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []
        out = []
        q = deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            out.append(level)
        return out

@@ explanation
Breadth-first search, draining exactly one level per outer iteration.

**Time** O(n) · **Space** O(width)

@@ tests
{"args": [[3, 9, 20, null, null, 15, 7]], "expected": [[3], [9, 20], [15, 7]]}
{"args": [[1]], "expected": [[1]]}
{"args": [[]], "expected": []}
{"args": [[1, 2, 3, 4, null, null, 5]], "hidden": true}
