---
title: Course Schedule
order: 91
difficulty: Medium
track: dsa
topics: ["Graph", "Topological Sort", "BFS"]
spec: {"mode": "function", "entry": "canFinish", "params": ["numCourses", "prerequisites"]}
---
There are `numCourses` courses labelled `0..numCourses-1`. `prerequisites[i] = [a, b]` means you must take `b` before `a`.

Return `True` if it's possible to finish every course (i.e. there's no cycle).

@@ hints
- Model courses as a directed graph `b → a`.
- **Kahn's algorithm:** repeatedly take a course with no remaining prerequisites (in-degree 0).
- If you manage to take all courses, there's no cycle.

@@ starter
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        pass

@@ solution
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = defaultdict(list)
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        taken = 0
        while q:
            c = q.popleft()
            taken += 1
            for nxt in graph[c]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return taken == numCourses

@@ explanation
Topological sort via BFS. Courses on a cycle never reach in-degree 0, so they're never taken.

**Time** O(V + E) · **Space** O(V + E)

@@ tests
{"args": [2, [[1, 0]]], "expected": true}
{"args": [2, [[1, 0], [0, 1]]], "expected": false}
{"args": [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], "hidden": true}
{"args": [3, [[0, 1], [1, 2], [2, 0]]], "hidden": true}
