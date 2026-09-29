---
title: LRU Cache
order: 140
difficulty: Medium
track: dsa
topics: ["Design", "Hash Table", "Linked List"]
spec: {"mode": "design"}
---
Design a **Least Recently Used** cache with a fixed `capacity`.

- `LRUCache(capacity)` initialises the cache.
- `get(key)` returns the value if present, otherwise `-1`. Counts as a use.
- `put(key, value)` inserts or updates. If this exceeds capacity, evict the least recently used key first.

Both operations must be O(1) on average.

**Test format:** method names on the first line, their arguments on the second.

@@ hints
- You need O(1) lookup (dict) *and* O(1) "move to most-recent" / "remove oldest" (doubly linked list).
- Python's `OrderedDict` has `move_to_end(key)` and `popitem(last=False)` — that's the whole data structure.
- For extra practice, implement it with a dict + your own doubly linked list.

@@ starter
class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass

@@ solution
class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.data:
            return -1
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key: int, value: int) -> None:
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.cap:
            self.data.popitem(last=False)

@@ explanation
`OrderedDict` keeps keys in recency order. Under the hood it's exactly a hash map plus a doubly linked list.

**Time** O(1) per op · **Space** O(capacity)

@@ tests
{"ops": ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], "args": [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], "expected": [null, null, null, 1, null, -1, null, -1, 3, 4]}
{"ops": ["LRUCache", "put", "get", "put", "get", "get"], "args": [[1], [2, 1], [2], [3, 2], [2], [3]], "hidden": true}
{"ops": ["LRUCache", "put", "put", "put", "get", "put", "get", "get"], "args": [[2], [1, 1], [2, 2], [1, 10], [1], [3, 3], [2], [1]], "hidden": true}
