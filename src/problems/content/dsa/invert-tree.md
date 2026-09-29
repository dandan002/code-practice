---
title: Invert Binary Tree
order: 71
difficulty: Easy
track: dsa
topics: ["Tree", "DFS", "Recursion"]
spec: {"mode": "function", "entry": "invertTree", "params": ["root"], "argTypes": ["TreeNode"], "returnType": "TreeNode"}
---
Given the `root` of a binary tree, mirror it (swap every node's left and right children) and return the root.

@@ hints
- Swap the children of the root, then invert each subtree.

@@ starter
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        pass

@@ solution
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root:
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root

@@ explanation
Each node is visited once and its children swapped.

**Time** O(n) · **Space** O(height)

@@ tests
{"args": [[4, 2, 7, 1, 3, 6, 9]], "expected": [4, 7, 2, 9, 6, 3, 1]}
{"args": [[2, 1, 3]], "expected": [2, 3, 1]}
{"args": [[]], "expected": []}
{"args": [[1, 2]], "hidden": true}
