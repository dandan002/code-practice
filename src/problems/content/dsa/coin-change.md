---
title: Coin Change
order: 102
difficulty: Medium
track: dsa
topics: ["Dynamic Programming", "BFS"]
spec: {"mode": "function", "entry": "coinChange", "params": ["coins", "amount"]}
---
Given coin denominations `coins` (unlimited supply of each) and a target `amount`, return the **fewest** coins that add up to `amount`, or `-1` if it can't be made.

@@ hints
- Greedy (always take the biggest coin) fails: coins `[1, 3, 4]`, amount `6`.
- Let `dp[a]` be the fewest coins for amount `a`. Then `dp[a] = 1 + min(dp[a - c])` over coins `c`.

@@ starter
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        pass

@@ solution
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a and dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
        return dp[amount] if dp[amount] != INF else -1

@@ explanation
Bottom-up DP over amounts. `amount + 1` works as infinity since no answer can use more coins than that.

**Time** O(amount · len(coins)) · **Space** O(amount)

@@ tests
{"args": [[1, 2, 5], 11], "expected": 3}
{"args": [[2], 3], "expected": -1}
{"args": [[1], 0], "expected": 0}
{"args": [[1, 3, 4], 6], "hidden": true}
{"args": [[186, 419, 83, 408], 6249], "hidden": true}
