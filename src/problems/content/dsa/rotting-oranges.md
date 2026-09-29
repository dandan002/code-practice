---
title: Rotting Oranges
order: 92
difficulty: Medium
track: dsa
topics: ["Graph", "BFS", "Matrix"]
spec: {"mode": "function", "entry": "orangesRotting", "params": ["grid"]}
---
In a grid, `0` is empty, `1` is a fresh orange, `2` is a rotten orange. Every minute, fresh oranges adjacent (4-directionally) to a rotten one become rotten.

Return the minimum number of minutes until no fresh orange remains, or `-1` if that's impossible.

@@ hints
- All rotten oranges spread *at the same time* — start a BFS from all of them at once (multi-source BFS).
- Each BFS layer is one minute. Count fresh oranges so you know if any are unreachable.

@@ starter
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        pass

@@ solution
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        q = deque()
        fresh = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1
        minutes = 0
        while q and fresh:
            minutes += 1
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
        return -1 if fresh else minutes

@@ explanation
Multi-source BFS: seed the queue with every rotten orange, then process level by level.

**Time** O(m·n) · **Space** O(m·n)

@@ tests
{"args": [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], "expected": 4}
{"args": [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], "expected": -1}
{"args": [[[0, 2]]], "expected": 0}
{"args": [[[0]]], "hidden": true}
{"args": [[[2, 2], [1, 1], [0, 0], [2, 0]]], "hidden": true}
