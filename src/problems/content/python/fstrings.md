---
title: f-strings & Formatting
order: 18
difficulty: Easy
track: python
topics: ["Strings", "Basics"]
spec: {"mode": "function", "entry": "receipt_line", "params": ["item", "qty", "price"]}
---
### Concept
f-strings embed expressions with an optional **format spec** after `:`:

```python
name, n, x = "ana", 1234567, 3.14159
f"{name!r}"      # "'ana'"     (repr)
f"{name:>8}"     # '     ana' (right-align in 8)
f"{name:*^9}"    # '***ana***' (centre, fill with *)
f"{x:.2f}"       # '3.14'
f"{n:,}"         # '1,234,567'
f"{0.256:.1%}"   # '25.6%'
f"{n=}"          # 'n=1234567'  (handy for debugging)
```

### Task
Write `receipt_line(item, qty, price)` returning a line exactly **30** characters wide:
- the item name, left-aligned in 16 characters (truncated to 16 if longer),
- `x` + quantity, right-aligned in 4 characters,
- the total `qty * price` with a `$`, thousands separators and 2 decimals, right-aligned in 10 characters.

`receipt_line("Coffee", 3, 4.5)` → `"Coffee            x3    $13.50"`

@@ hints
- Truncate with slicing: `item[:16]`.
- `f"{'x' + str(qty):>4}"` and `f"{'$' + format(total, ',.2f'):>10}"`.

@@ starter
def receipt_line(item, qty, price):
    pass

@@ solution
def receipt_line(item, qty, price):
    total = f"${qty * price:,.2f}"
    return f"{item[:16]:<16}{'x' + str(qty):>4}{total:>10}"

@@ explanation
Format specs compose: `<16` pads to width, `:,.2f` adds separators and fixes decimals. Build pieces that need prefixes (`$`, `x`) first, then align them as strings.

@@ tests
{"args": ["Coffee", 3, 4.5], "expected": "Coffee            x3    $13.50"}
{"args": ["Extremely long product name", 1, 1999.99], "expected": "Extremely long p  x1 $1,999.99"}
{"args": ["Tea", 12, 0.5], "expected": "Tea              x12     $6.00"}
{"args": ["Gadget", 100, 12345.678], "hidden": true}
