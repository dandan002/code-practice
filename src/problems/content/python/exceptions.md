---
title: Custom Exceptions
order: 33
difficulty: Medium
track: python
topics: ["Exceptions", "Classes"]
spec: {"mode": "expr"}
---
### Concept
Define your own exceptions by subclassing `Exception`. Handle them with `try / except / else / finally`:

```python
class AppError(Exception):
    pass

class NotFound(AppError):
    def __init__(self, key):
        super().__init__(f"{key!r} not found")
        self.key = key

try:
    ...
except NotFound as e:          # most specific first
    print(e.key)
except AppError:
    ...
else:                          # ran only if no exception
    ...
finally:                       # always runs
    ...
```

`raise NewError(...) from err` chains exceptions so the original cause is kept.

### Task
Write:
1. `InsufficientFunds(Exception)` whose constructor takes `(balance, amount)`, stores both as attributes, and has the message `"cannot withdraw 50 from balance 20"` (for amount 50, balance 20).
2. `class Account` with `balance` starting at the constructor argument (default `0`), and:
   - `deposit(amount)` — raises `ValueError` if `amount <= 0`; returns the new balance,
   - `withdraw(amount)` — raises `ValueError` if `amount <= 0`, raises `InsufficientFunds` if it would go negative; returns the new balance.

@@ hints
- Call `super().__init__(message)` so `str(err)` gives the message.
- Validate before changing `self.balance`, so a failed withdrawal leaves the balance unchanged.

@@ starter
class InsufficientFunds(Exception):
    pass


class Account:
    pass

@@ solution
class InsufficientFunds(Exception):
    def __init__(self, balance, amount):
        super().__init__(f"cannot withdraw {amount} from balance {balance}")
        self.balance = balance
        self.amount = amount


class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount > self.balance:
            raise InsufficientFunds(self.balance, amount)
        self.balance -= amount
        return self.balance

@@ explanation
Custom exceptions carry structured data (`e.amount`) as well as a message, and callers can catch exactly the failure they care about.

@@ tests
{"setup": "a = Account(100)", "expr": "[a.deposit(50), a.withdraw(30), a.balance]", "expected": [150, 120, 120]}
{"setup": "a = Account(20)\ntry:\n    a.withdraw(50)\nexcept InsufficientFunds as e:\n    err = e", "expr": "[str(err), err.balance, err.amount, a.balance]", "expected": ["cannot withdraw 50 from balance 20", 20, 50, 20]}
{"setup": "a = Account()\ntry:\n    a.deposit(-5)\n    r = 'accepted'\nexcept ValueError:\n    r = 'ValueError'", "expr": "r", "expected": "ValueError"}
{"expr": "issubclass(InsufficientFunds, Exception)", "expected": true}
{"setup": "a = Account(10)\nr = []\nfor amt in (0, 11, 10):\n    try:\n        a.withdraw(amt); r.append('ok')\n    except InsufficientFunds:\n        r.append('funds')\n    except ValueError:\n        r.append('value')", "expr": "[r, a.balance]", "hidden": true, "expected": [["value", "funds", "ok"], 0]}
