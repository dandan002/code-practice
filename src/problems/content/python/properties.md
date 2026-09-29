---
title: Properties
order: 35
difficulty: Medium
track: python
topics: ["Classes", "Properties"]
spec: {"mode": "expr"}
---
### Concept
`@property` turns a method into a computed attribute; `@x.setter` validates or converts on assignment. Callers use plain attribute syntax:

```python
class Circle:
    def __init__(self, r):
        self.radius = r            # goes through the setter

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("radius must be >= 0")
        self._radius = value

    @property
    def area(self):                # read-only: no setter
        return math.pi * self._radius ** 2
```

### Task
Write `Temperature(celsius=0.0)` with:
- a `celsius` property whose setter raises `ValueError` below absolute zero (`-273.15`),
- a `fahrenheit` property (`c * 9/5 + 32`) that can also be **set**, updating `celsius` (and validated the same way),
- a read-only `kelvin` property (`c + 273.15`); assigning to it must raise `AttributeError`.

@@ hints
- Store the real value in `self._celsius`, and have `__init__` assign `self.celsius = celsius` so validation runs.
- The fahrenheit setter can simply assign `self.celsius = (f - 32) * 5 / 9`.
- A property without a setter raises `AttributeError` on assignment automatically.

@@ starter
class Temperature:
    def __init__(self, celsius=0.0):
        pass

@@ solution
class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

    @property
    def kelvin(self):
        return self._celsius + 273.15

@@ explanation
All writes funnel through the `celsius` setter, so validation lives in exactly one place. Read-only properties are just properties without a setter.

@@ tests
{"setup": "t = Temperature(100)", "expr": "[t.celsius, t.fahrenheit, t.kelvin]", "expected": [100, 212.0, 373.15]}
{"setup": "t = Temperature()\nt.fahrenheit = 32", "expr": "t.celsius", "expected": 0.0}
{"setup": "try:\n    Temperature(-300)\n    r = 'ok'\nexcept ValueError:\n    r = 'ValueError'", "expr": "r", "expected": "ValueError"}
{"setup": "t = Temperature()\ntry:\n    t.kelvin = 5\n    r = 'ok'\nexcept AttributeError:\n    r = 'AttributeError'", "expr": "r", "expected": "AttributeError"}
{"setup": "t = Temperature(10)\ntry:\n    t.fahrenheit = -1000\nexcept ValueError:\n    pass", "expr": "t.celsius", "hidden": true, "expected": 10}
