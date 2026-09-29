---
title: "*args and **kwargs"
order: 25
difficulty: Medium
track: python
topics: ["Functions", "Basics"]
spec: {"mode": "expr"}
---
### Concept
`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict. The same symbols **unpack** at call sites:

```python
def f(a, *args, sep=" ", **kwargs):
    ...

f(1, 2, 3, sep="-", debug=True)   # a=1, args=(2, 3), kwargs={'debug': True}
nums = [1, 2, 3]
print(*nums)                        # print(1, 2, 3)
opts = {"sep": ", "}
print(*nums, **opts)                # print(1, 2, 3, sep=", ")
```

Parameters after `*args` are **keyword-only**.

### Task
Write `build_url(base, *segments, **params)`:
- joins `base` and each segment with single `/` (strip extra slashes from both ends of each piece),
- appends query params as `?k=v&k2=v2` **sorted by key**, skipping params whose value is `None`,
- omits the `?` entirely if there are no params left.

```python
build_url("https://x.com/", "api", "/users/", id=7, q=None)
# 'https://x.com/api/users?id=7'
```

@@ hints
- `"/".join(p.strip("/") for p in (base, *segments))`
- `"&".join(f"{k}={v}" for k, v in sorted(params.items()) if v is not None)`

@@ starter
def build_url(base, *segments, **params):
    pass

@@ solution
def build_url(base, *segments, **params):
    url = "/".join(str(p).strip("/") for p in (base, *segments))
    query = "&".join(f"{k}={v}" for k, v in sorted(params.items()) if v is not None)
    return f"{url}?{query}" if query else url

@@ explanation
`(base, *segments)` unpacks inside a tuple display. Keyword arguments arrive as a plain dict, so sorting and filtering are ordinary dict operations.

@@ tests
{"expr": "build_url('https://x.com/', 'api', '/users/', id=7, q=None)", "expected": "https://x.com/api/users?id=7"}
{"expr": "build_url('http://a.io')", "expected": "http://a.io"}
{"expr": "build_url('http://a.io', 'v1', page=2, limit=10)", "expected": "http://a.io/v1?limit=10&page=2"}
{"setup": "parts = ['a', 'b']\nopts = {'z': 1, 'y': None}", "expr": "build_url('h:/', *parts, **opts)", "hidden": true, "expected": "h:/a/b?z=1"}
