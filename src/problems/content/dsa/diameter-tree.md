---
title: Diameter of Binary Tree
order: 72
difficulty: Easy
track: dsa
topics: ["Tree", "DFS"]
spec: {"mode": "function", "entry": "diameterOfBinaryTree", "params": ["root"], "argTypes": ["TreeNode"]}
---
Return the length of the **diameter** of a binary tree — the number of *edges* on the longest path between any two nodes. The path may or may not pass through the root.

@@ hints
- The longest path through a node = height(left) + height(right).
- Compute heights with a DFS and update a best-so-far answer at every node.

@@ starter
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        pass

@@ solution
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        def height(node):
            nonlocal best
            if not node:
                return 0
            l, r = height(node.left), height(node.right)
            best = max(best, l + r)
            return 1 + max(l, r)

        height(root)
        return best

@@ explanation
One DFS returns heights while tracking the best `left + right` seen. Note the `nonlocal` to update the enclosing variable.

**Time** O(n) · **Space** O(height)

@@ tests
{"args": [[1, 2, 3, 4, 5]], "expected": 3}
{"args": [[1, 2]], "expected": 1}
{"args": [[1, 2, null, 3, 4, 5, null, null, 6]], "hidden": true}
