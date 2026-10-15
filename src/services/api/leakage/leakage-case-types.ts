// Shared across every case/Room endpoint below — the way get-leakage.ts is the canonical source
// for the main page's types. Scaffolded 2026-10-01, not wired into a page yet — see
// docs/leakage-map/v2-build-plan.md. Doc framing: "The case owns accountability and business
// lifecycle. The Room is its collaboration surface. Do not infer case status from Room status or
// render the case as a generic task."

export type RevenueLeakCaseStatus =
  | "DETECTED"
  | "REVIEWED"
  | "ASSIGNED"
  | "WORKED"
  | "RESOLVED"
  | "VERIFIED"
  | "CLOSED"
  | "INVALIDATED";

export interface RevenueLeakCaseDecision {
  id: string;
  actorUserId: string;
  decision: string;
  reason: string;
  occurredAtUtc: string;
}

export interface RevenueLeakCaseEscalation {
  level: number;
  escalatedToUserId: string | null;
  reason: string;
  occurredAtUtc: string;
}

export interface RevenueLeakCaseAuditEntry {
  sequence: number;
  from: RevenueLeakCaseStatus;
  to: RevenueLeakCaseStatus;
  actorUserId: string | null;
  action: string;
  reason: string;
  occurredAtUtc: string;
}

export interface RevenueLeakCaseValueAttribution {
  sourceVerificationId: string;
  roomOpeningNumber: number;
  kind: "PRESERVED" | "RECOVERED" | "CAPTURED";
  amount: number;
  currency: string;
  verifiedBy: string;
  verifiedAtUtc: string;
}

export interface RevenueLeakCase {
  id: string;
  stableFindingId: string;
  cellId: string;
  sourceSnapshotId: string;
  status: RevenueLeakCaseStatus;
  ownerUserId: string | null;
  roomId: string | null;
  detectedAtUtc: string;
  updatedAtUtc: string;
  dueAtUtc: string;
  isOverdue: boolean;
  escalationLevel: number;
  evidenceReferences: string[];
  decisions: RevenueLeakCaseDecision[];
  escalations: RevenueLeakCaseEscalation[];
  auditTrail: RevenueLeakCaseAuditEntry[];
  valueAttributions: RevenueLeakCaseValueAttribution[];
}

export interface RevenueLeakCaseResponse {
  data: RevenueLeakCase;
  messages: string[];
  succeeded: boolean;
}
