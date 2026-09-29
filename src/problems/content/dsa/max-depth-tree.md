---
title: Maximum Depth of Binary Tree
order: 70
difficulty: Easy
track: dsa
topics: ["Tree", "DFS", "BFS", "Recursion"]
spec: {"mode": "function", "entry": "maxDepth", "params": ["root"], "argTypes": ["TreeNode"]}
---
Given the `root` of a binary tree, return its maximum depth — the number of nodes on the longest root-to-leaf path.

Trees are written in **level order** with `null` for missing children, e.g. `[3,9,20,null,null,15,7]`. `TreeNode` (with `.val`, `.left`, `.right`) is already defined.

@@ hints
- The depth of a tree is 1 + the larger depth of its two subtrees.
- An empty tree has depth 0.

@@ starter
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        pass

@@ solution
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))

@@ explanation
Straightforward recursion. An iterative BFS counting levels works too and avoids deep recursion on skewed trees.

**Time** O(n) · **Space** O(height)

@@ tests
{"args": [[3, 9, 20, null, null, 15, 7]], "expected": 3}
{"args": [[1, null, 2]], "expected": 2}
{"args": [[]], "expected": 0}
{"args": [[1, 2, 3, 4, null, null, 5, 6]], "hidden": true}
