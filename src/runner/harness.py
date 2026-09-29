"""Test harness for the practice site.

Runs inside Pyodide (in a Web Worker) and also under plain CPython, which is how
`npm run check-problems` validates every reference solution against its tests.
All public entry points take and return JSON strings so the JS side stays simple.
"""

import builtins
import copy
import io
import json
import math
import sys
import time
import traceback

FILENAME = "solution.py"
MAX_STDOUT = 20_000
MAX_ITEMS = 200_000

# Source that is implicitly available to every solution, mirroring the usual
# LeetCode environment. It is also fed to Jedi so completions know about it.
PRELUDE_SRC = '''\
from typing import *
import collections, heapq, bisect, itertools, functools, math, re, string, random, operator
from collections import deque, defaultdict, Counter, OrderedDict
from functools import lru_cache, cache, reduce


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"
'''
PRELUDE_LINES = PRELUDE_SRC.count("\n")

_prelude_ns: dict = {"__name__": "__prelude__"}
exec(compile(PRELUDE_SRC, "<prelude>", "exec"), _prelude_ns)
ListNode = _prelude_ns["ListNode"]
TreeNode = _prelude_ns["TreeNode"]
PRELUDE_NAMES = sorted(k for k in _prelude_ns if not k.startswith("__"))


def fresh_namespace():
    ns = {k: v for k, v in _prelude_ns.items() if not k.startswith("__")}
    ns["__name__"] = "__main__"
    ns["__builtins__"] = builtins
    return ns


# ---------------------------------------------------------------- converters

def to_linked_list(values):
    dummy = tail = ListNode()
    for v in values or []:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def from_linked_list(node):
    out = []
    seen = 0
    while node is not None:
        out.append(node.val)
        node = node.next
        seen += 1
        if seen > MAX_ITEMS:
            raise ValueError("linked list too long (cycle?)")
    return out


def to_tree(values):
    if not values or values[0] is None:
        return None
    it = iter(values)
    root = TreeNode(next(it))
    queue = [root]
    i = 0
    while i < len(queue):
        node = queue[i]
        i += 1
        try:
            left = next(it)
        except StopIteration:
            break
        if left is not None:
            node.left = TreeNode(left)
            queue.append(node.left)
        try:
            right = next(it)
        except StopIteration:
            break
        if right is not None:
            node.right = TreeNode(right)
            queue.append(node.right)
    return root


def from_tree(root):
    out = []
    queue = [root]
    i = 0
    while i < len(queue):
        node = queue[i]
        i += 1
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
        if len(queue) > MAX_ITEMS * 2:
            raise ValueError("tree too large (cycle?)")
    while out and out[-1] is None:
        out.pop()
    return out


IN_CONVERTERS = {
    "ListNode": to_linked_list,
    "TreeNode": to_tree,
    "ListNode[]": lambda lists: [to_linked_list(x) for x in lists],
}
OUT_CONVERTERS = {"ListNode": from_linked_list, "TreeNode": from_tree}


# ------------------------------------------------------------- normalization

def normalize(value, depth=0):
    """Turn a Python result into plain JSON-compatible data for comparison/display."""
    if depth > 50:
        return repr(value)
    if value is None or isinstance(value, (bool, int, str)):
        return value
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return repr(value)
        return value
    if hasattr(value, "val") and hasattr(value, "next"):
        return from_linked_list(value)
    if hasattr(value, "val") and hasattr(value, "left") and hasattr(value, "right"):
        return from_tree(value)
    if isinstance(value, dict):
        return {str(k) if not isinstance(k, str) else k: normalize(v, depth + 1) for k, v in value.items()}
    if isinstance(value, (set, frozenset)):
        items = [normalize(v, depth + 1) for v in value]
        return sorted(items, key=sort_key)
    if isinstance(value, (list, tuple)):
        return [normalize(v, depth + 1) for v in value]
    if hasattr(value, "__iter__") and hasattr(value, "__next__"):
        items = []
        for v in value:
            items.append(normalize(v, depth + 1))
            if len(items) >= MAX_ITEMS:
                break
        return items
    return repr(value)


def sort_key(v):
    return json.dumps(v, sort_keys=True)


def deep_sort(v):
    if isinstance(v, list):
        return sorted((deep_sort(x) for x in v), key=sort_key)
    return v


def values_equal(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a is b if isinstance(a, bool) and isinstance(b, bool) else False
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if isinstance(a, int) and isinstance(b, int):
            return a == b
        return math.isclose(a, b, rel_tol=1e-6, abs_tol=1e-6)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(values_equal(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(values_equal(a[k], b[k]) for k in a)
    return a == b


def compare(result, expected, mode):
    if mode == "unordered" and isinstance(result, list) and isinstance(expected, list):
        return values_equal(sorted(result, key=sort_key), sorted(expected, key=sort_key))
    if mode == "nested-unordered" and isinstance(result, list) and isinstance(expected, list):
        return values_equal(deep_sort(result), deep_sort(expected))
    return values_equal(result, expected)


MAX_SHOW = 3_000


def show(value):
    try:
        s = json.dumps(value)
    except (TypeError, ValueError):
        s = repr(value)
    if len(s) > MAX_SHOW:
        s = s[:MAX_SHOW] + f"... ({len(s) - MAX_SHOW} more chars)"
    return s


def generate_args(expr):
    """Hidden stress tests describe large inputs as a Python expression."""
    import random
    ns = fresh_namespace()
    ns["rng"] = random.Random(12345)
    return eval(compile(expr, "<gen>", "eval"), ns)


# ----------------------------------------------------------------- execution

class CappedWriter(io.StringIO):
    def write(self, s):
        remaining = MAX_STDOUT - self.tell()
        if remaining <= 0:
            return len(s)
        if len(s) > remaining:
            super().write(s[:remaining] + "\n... output truncated ...\n")
            return len(s)
        return super().write(s)


class Captured:
    def __init__(self, stdin=""):
        self.out = CappedWriter()
        self.stdin = io.StringIO(stdin)

    def __enter__(self):
        self._saved = sys.stdout, sys.stderr, sys.stdin
        sys.stdout = self.out
        sys.stderr = self.out
        sys.stdin = self.stdin
        return self

    def __exit__(self, *exc):
        sys.stdout, sys.stderr, sys.stdin = self._saved
        return False


def format_error(exc):
    """Traceback trimmed to frames in the user's file."""
    te = traceback.TracebackException.from_exception(exc)
    if isinstance(exc, SyntaxError):
        return "".join(te.format_exception_only()).rstrip()
    frames = [f for f in te.stack if f.filename == FILENAME]
    lines = []
    if frames:
        lines.append("Traceback (most recent call last):")
        for f in frames:
            lines.append(f'  Line {f.lineno}, in {f.name}')
            if f.line:
                lines.append(f"    {f.line.strip()}")
    lines.extend(te.format_exception_only())
    return "\n".join(l.rstrip() for l in lines)


def error_line(exc):
    if isinstance(exc, SyntaxError):
        return exc.lineno
    tb = exc.__traceback__
    line = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == FILENAME:
            line = tb.tb_lineno
        tb = tb.tb_next
    return line


def load_user_code(code_obj):
    ns = fresh_namespace()
    exec(code_obj, ns)
    return ns


def resolve_entry(ns, entry):
    sol = ns.get("Solution")
    if isinstance(sol, type) and hasattr(sol, entry):
        return getattr(sol(), entry)
    fn = ns.get(entry)
    if callable(fn):
        return fn
    raise NameError(f"Could not find '{entry}'. Define it at top level or as a method of class Solution.")


def format_args(params, args):
    if not params:
        return ", ".join(show(a) for a in args)
    return "\n".join(f"{p} = {show(a)}" for p, a in zip(params, args))


def run_function_case(code_obj, spec, case):
    ns = load_user_code(code_obj)
    fn = resolve_entry(ns, spec["entry"])
    arg_types = spec.get("argTypes") or []
    args = copy.deepcopy(case["args"])
    call_args = []
    for i, a in enumerate(args):
        t = arg_types[i] if i < len(arg_types) else None
        call_args.append(IN_CONVERTERS[t](a) if t in IN_CONVERTERS else a)
    result = fn(*call_args)
    if spec.get("returnArg") is not None:
        result = call_args[spec["returnArg"]]
    ret_type = spec.get("returnType")
    if ret_type in OUT_CONVERTERS and not isinstance(result, list):
        # Duck-typed so it also works if the user pasted their own node class.
        result = [] if result is None else OUT_CONVERTERS[ret_type](result)
    return normalize(result)


def run_design_case(code_obj, spec, case):
    ns = load_user_code(code_obj)
    ops, op_args = case["ops"], copy.deepcopy(case["args"])
    cls_name = ops[0]
    cls = ns.get(cls_name)
    if not isinstance(cls, type):
        raise NameError(f"Could not find class '{cls_name}'.")
    obj = cls(*op_args[0])
    out = [None]
    for op, a in zip(ops[1:], op_args[1:]):
        out.append(normalize(getattr(obj, op)(*a)))
    return out


def run_expr_case(code_obj, spec, case):
    ns = load_user_code(code_obj)
    if case.get("setup"):
        exec(compile(case["setup"], "<test>", "exec"), ns)
    return normalize(eval(compile(case["expr"], "<test>", "eval"), ns))


RUNNERS = {"function": run_function_case, "design": run_design_case, "expr": run_expr_case}


def describe_input(spec, case):
    mode = spec.get("mode", "function")
    if mode == "design":
        return f"{show(case['ops'])}\n{show(case['args'])}"
    if mode == "expr":
        return (case.get("setup", "") + "\n" + case["expr"]).strip()
    if "gen" in case:
        return f"(generated) {case['gen']}"
    return format_args(spec.get("params"), case["args"])


def run_one(code_obj, spec, case):
    runner = RUNNERS[spec.get("mode", "function")]
    cap = Captured()
    error = None
    output = None
    err_line = None
    start = time.perf_counter()
    with cap:
        try:
            output = runner(code_obj, spec, case)
        except Exception as exc:  # noqa: BLE001 - we report any user error
            error = format_error(exc)
            err_line = error_line(exc)
    elapsed = (time.perf_counter() - start) * 1000
    return output, error, err_line, cap.out.getvalue(), elapsed


def run_tests(payload_json):
    payload = json.loads(payload_json)
    spec = payload["spec"]
    try:
        code_obj = compile(payload["code"], FILENAME, "exec")
    except SyntaxError as exc:
        return json.dumps({
            "status": "Compile Error",
            "error": format_error(exc),
            "errorLine": exc.lineno,
            "results": [],
        })

    ref_obj = None
    if payload.get("reference"):
        ref_obj = compile(payload["reference"], "reference.py", "exec")

    mode = spec.get("compare", "exact")
    results = []
    status = "Accepted"
    for i, case in enumerate(payload["tests"]):
        if "gen" in case:
            case = dict(case, args=generate_args(case["gen"]))
        expected = case.get("expected")
        has_expected = "expected" in case
        if not has_expected and ref_obj is not None:
            ref_out, ref_err, _, _, _ = run_one(ref_obj, spec, case)
            expected, has_expected = ref_out, ref_err is None

        output, error, err_line, stdout, elapsed = run_one(code_obj, spec, case)
        passed = None
        if error is None and has_expected:
            passed = compare(output, expected, mode)
        results.append({
            "index": i,
            "input": describe_input(spec, case),
            "output": None if error else show(output),
            "expected": show(expected) if has_expected else None,
            "passed": passed if error is None else False,
            "error": error,
            "errorLine": err_line,
            "stdout": stdout,
            "timeMs": round(elapsed, 2),
            "hidden": bool(case.get("hidden")),
        })
        if error is not None and status == "Accepted":
            status = "Runtime Error"
        elif passed is False and status == "Accepted":
            status = "Wrong Answer"
    return json.dumps({"status": status, "results": results})


def run_script(payload_json):
    """Playground: run arbitrary code, capture output."""
    payload = json.loads(payload_json)
    cap = Captured(payload.get("stdin", ""))
    error = None
    err_line = None
    start = time.perf_counter()
    with cap:
        try:
            code_obj = compile(payload["code"], FILENAME, "exec")
            exec(code_obj, fresh_namespace())
        except BaseException as exc:  # noqa: BLE001 - include SystemExit etc.
            if not isinstance(exc, SystemExit):
                error = format_error(exc)
                err_line = error_line(exc)
    elapsed = (time.perf_counter() - start) * 1000
    return json.dumps({"stdout": cap.out.getvalue(), "error": error, "errorLine": err_line,
                       "timeMs": round(elapsed, 2)})


# ------------------------------------------------------------ language tools

def lint(code):
    diags = []
    try:
        import ast
        tree = ast.parse(code, FILENAME)
    except SyntaxError as exc:
        diags.append({"line": exc.lineno or 1, "col": max((exc.offset or 1) - 1, 0),
                      "message": f"SyntaxError: {exc.msg}", "severity": "error"})
        return json.dumps(diags)
    try:
        from pyflakes import checker, messages
    except ImportError:
        return json.dumps(diags)
    w = checker.Checker(tree, filename=FILENAME, builtins=PRELUDE_NAMES)
    serious = (messages.UndefinedName, messages.UndefinedLocal, messages.UndefinedExport,
               messages.DuplicateArgument, messages.ReturnOutsideFunction,
               messages.YieldOutsideFunction, messages.ContinueOutsideLoop,
               messages.BreakOutsideLoop)
    for m in w.messages:
        diags.append({
            "line": m.lineno,
            "col": getattr(m, "col", 0) or 0,
            "message": m.message % m.message_args,
            "severity": "error" if isinstance(m, serious) else "warning",
        })
    return json.dumps(diags)


def _jedi_script(code):
    import jedi
    return jedi.Script(code=PRELUDE_SRC + code, path=FILENAME)


def complete(code, line, col):
    """line is 1-based, col is 0-based (Jedi convention)."""
    script = _jedi_script(code)
    items = []
    for i, c in enumerate(script.complete(line + PRELUDE_LINES, col)):
        if i >= 150:
            break
        if c.name.startswith("__") and not c.name.endswith("__"):
            continue
        item = {"label": c.name, "type": c.type}
        if i < 25:
            try:
                sigs = c.get_signatures()
                if sigs:
                    item["detail"] = sigs[0].to_string()
                doc = c.docstring(raw=True, fast=True)
                if doc:
                    item["info"] = doc[:600]
            except Exception:  # noqa: BLE001 - jedi can fail on odd inputs
                pass
        items.append(item)
    return json.dumps(items)


def signatures(code, line, col):
    script = _jedi_script(code)
    out = []
    for s in script.get_signatures(line + PRELUDE_LINES, col)[:1]:
        out.append({
            "name": s.name,
            "params": [p.to_string() for p in s.params],
            "index": s.index,
        })
    return json.dumps(out)
