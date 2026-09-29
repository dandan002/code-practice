---
title: Best Time to Buy and Sell Stock
order: 30
difficulty: Easy
track: dsa
topics: ["Sliding Window", "Array"]
spec: {"mode": "function", "entry": "maxProfit", "params": ["prices"]}
---
`prices[i]` is a stock's price on day `i`. Buy on one day and sell on a **later** day to maximise profit.

Return the maximum profit, or `0` if no profit is possible.

@@ hints
- For each day, the best buy is the cheapest price seen *before* it.
- Track the running minimum as you scan.

@@ starter
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        pass

@@ solution
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        lowest = float("inf")
        best = 0
        for p in prices:
            lowest = min(lowest, p)
            best = max(best, p - lowest)
        return best

@@ explanation
One pass keeping the lowest price so far; the best sale today is `price - lowest`.

**Time** O(n) · **Space** O(1)

@@ tests
{"args": [[7, 1, 5, 3, 6, 4]], "expected": 5}
{"args": [[7, 6, 4, 3, 1]], "expected": 0}
{"args": [[2, 4, 1]], "hidden": true}
{"args": [[3, 2, 6, 5, 0, 3]], "hidden": true}
