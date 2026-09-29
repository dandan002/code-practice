import type { Spec, TestCase } from "../problems/parse";

export interface RunPayload {
  code: string;
  spec: Spec;
  tests: TestCase[];
  /** Reference solution used to compute `expected` for tests that omit it. */
  reference?: string;
}

export interface CaseResult {
  index: number;
  input: string;
  output: string | null;
  expected: string | null;
  passed: boolean | null;
  error: string | null;
  errorLine: number | null;
  stdout: string;
  timeMs: number;
  hidden: boolean;
}

export type RunStatus = "Accepted" | "Wrong Answer" | "Runtime Error" | "Compile Error" | "Time Limit Exceeded";

export interface RunResult {
  status: RunStatus;
  error?: string;
  errorLine?: number;
  results: CaseResult[];
}

export interface ExecResult {
  stdout: string;
  error: string | null;
  errorLine: number | null;
  timeMs: number;
  timedOut?: boolean;
}

export interface Diagnostic {
  line: number;
  col: number;
  message: string;
  severity: "error" | "warning";
}

export interface CompletionItem {
  label: string;
  type: string;
  detail?: string;
  info?: string;
}

export interface SignatureInfo {
  name: string;
  params: string[];
  index: number | null;
}

export type WorkerRequest =
  | { type: "init"; indexURL: string }
  | { type: "run"; id: number; payload: RunPayload }
  | { type: "exec"; id: number; payload: { code: string; stdin: string } }
  | { type: "lint"; id: number; code: string }
  | { type: "complete"; id: number; code: string; line: number; col: number }
  | { type: "signatures"; id: number; code: string; line: number; col: number };

export type WorkerResponse =
  | { type: "status"; status: string }
  | { type: "ready" }
  | { type: "toolsReady" }
  | { type: "result"; id: number; data: unknown }
  | { type: "error"; id?: number; error: string };
