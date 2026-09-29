---
title: Validate Binary Search Tree
order: 74
difficulty: Medium
track: dsa
topics: ["Tree", "DFS", "Binary Search Tree"]
spec: {"mode": "function", "entry": "isValidBST", "params": ["root"], "argTypes": ["TreeNode"]}
---
Determine whether a binary tree is a valid **binary search tree**:
- every value in a node's left subtree is **strictly less** than the node's value,
- every value in its right subtree is **strictly greater**, and
- both subtrees are BSTs too.

@@ hints
- Checking only a node against its direct children isn't enough (see example 2's deeper nodes).
- Pass down the allowed `(low, high)` range for each subtree.
- Alternatively: an in-order traversal of a BST is strictly increasing.

@@ starter
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        pass

@@ solution
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def ok(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return ok(node.left, low, node.val) and ok(node.right, node.val, high)

        return ok(root, float("-inf"), float("inf"))

@@ explanation
Every node must lie in an open interval inherited from its ancestors. Going left tightens the upper bound; going right tightens the lower bound.

**Time** O(n) · **Space** O(height)

@@ tests
{"args": [[2, 1, 3]], "expected": true}
{"args": [[5, 1, 4, null, null, 3, 6]], "expected": false}
{"args": [[5, 4, 6, null, null, 3, 7]], "expected": false}
{"args": [[2, 2, 2]], "hidden": true}
{"args": [[1]], "hidden": true}
