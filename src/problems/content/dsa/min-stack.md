---
title: Min Stack
order: 41
difficulty: Medium
track: dsa
topics: ["Stack", "Design"]
spec: {"mode": "design"}
---
Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element — **all in O(1)**.

Implement `MinStack`:
- `MinStack()` initialises the stack.
- `push(val)` pushes `val`.
- `pop()` removes the top element.
- `top()` returns the top element.
- `getMin()` returns the minimum element.

**Test format:** the first line lists method calls, the second their arguments. The expected output lists each call's return value (`null` for methods that return nothing).

@@ hints
- Alongside each value, store the minimum *at the time it was pushed*.
- Then the current minimum is always at the top.

@@ starter
class MinStack:
    def __init__(self):
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass

@@ solution
class MinStack:
    def __init__(self):
        self.stack = []  # (value, min so far)

    def push(self, val: int) -> None:
        cur = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]

@@ explanation
Each entry remembers the minimum of itself and everything beneath it, so popping restores the previous minimum automatically.

**Time** O(1) per op · **Space** O(n)

@@ tests
{"ops": ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], "args": [[], [-2], [0], [-3], [], [], [], []], "expected": [null, null, null, null, -3, null, 0, -2]}
{"ops": ["MinStack", "push", "push", "getMin", "push", "getMin", "pop", "getMin"], "args": [[], [5], [5], [], [3], [], [], []], "hidden": true}
{"ops": ["MinStack", "push", "push", "push", "pop", "getMin", "pop", "getMin"], "args": [[], [2], [1], [1], [], [], [], []], "hidden": true}
