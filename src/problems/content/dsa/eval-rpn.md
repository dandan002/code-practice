---
title: Evaluate Reverse Polish Notation
order: 43
difficulty: Medium
track: dsa
topics: ["Stack", "Math"]
spec: {"mode": "function", "entry": "evalRPN", "params": ["tokens"]}
---
Evaluate an arithmetic expression in **Reverse Polish Notation** (operators come after their operands). Operators are `+`, `-`, `*`, `/`.

Division between two integers **truncates toward zero** (so `-7 / 2 == -3`). The input is always valid.

@@ hints
- Numbers go on a stack; an operator pops two operands and pushes the result.
- Careful: the first value popped is the *right* operand.
- Python's `//` floors (rounds toward −∞). Use `int(a / b)` to truncate toward zero.

@@ starter
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        pass

@@ solution
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        ops = {
            "+": lambda a, b: a + b,
            "-": lambda a, b: a - b,
            "*": lambda a, b: a * b,
            "/": lambda a, b: int(a / b),
        }
        stack = []
        for tok in tokens:
            if tok in ops:
                b = stack.pop()
                a = stack.pop()
                stack.append(ops[tok](a, b))
            else:
                stack.append(int(tok))
        return stack[0]

@@ explanation
A stack evaluates postfix expressions directly. The one Python gotcha is truncating division.

**Time** O(n) · **Space** O(n)

@@ tests
{"args": [["2", "1", "+", "3", "*"]], "expected": 9}
{"args": [["4", "13", "5", "/", "+"]], "expected": 6}
{"args": [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], "expected": 22}
{"args": [["-7", "2", "/"]], "hidden": true}
