---
title: Number of Islands
order: 90
difficulty: Medium
track: dsa
topics: ["Graph", "DFS", "BFS", "Matrix"]
spec: {"mode": "function", "entry": "numIslands", "params": ["grid"]}
---
Given an `m x n` grid of `"1"` (land) and `"0"` (water), return the number of **islands**. An island is land connected horizontally or vertically.

@@ hints
- Scan every cell. When you find unvisited land, that's a new island.
- Flood-fill (DFS or BFS) from it to mark the entire island as visited.
- You can mark visited by overwriting `"1"` with `"0"`.

@@ starter
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        pass

@@ solution
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        rows, cols = len(grid), len(grid[0])
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != "1":
                    continue
                count += 1
                stack = [(r, c)]
                grid[r][c] = "0"
                while stack:
                    y, x = stack.pop()
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1":
                            grid[ny][nx] = "0"
                            stack.append((ny, nx))
        return count

@@ explanation
Each land cell is sunk exactly once. An explicit stack avoids Python's recursion limit on big islands.

**Time** O(m·n) · **Space** O(m·n) worst case

@@ tests
{"args": [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], "expected": 1}
{"args": [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], "expected": 3}
{"args": [[["0"]]], "hidden": true}
{"gen": "[[['1' if rng.random() < 0.5 else '0' for _ in range(150)] for _ in range(150)]]", "hidden": true}
