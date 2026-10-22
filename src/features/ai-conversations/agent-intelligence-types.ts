// Shared primitives from the agent-api v3 contract (docs/chat-panel/frontend-agent-v3-handoff.md).
// Used by structured conversation/run responses and by evidence traversal — kept in one place so
// those don't each redeclare the same shapes.

export type EvidenceStatus = "UNVERIFIED" | "INDICATIVE" | "CORROBORATED" | "MEASURED";

export interface IntelligenceReference {
  kind:
    | "Investigation"
    | "Finding"
    | "Evidence"
    | "Hypothesis"
    | "Impact"
    | "Recommendation"
    | "Decision"
    | "Action"
    | "Outcome"
    | "SourceResolution"
    | "Source";
  id: string;
}

export interface ImpactStatement {
  value?: string | null;
  unit?: string | null;
  basis: "measured" | "estimated" | "unavailable";
  method?: string | null;
  confidence?: number | null;
  scope?: string | null;
  period?: { fromUtc: string; toUtc: string } | null;
  coverage?: number | null;
  lineage: IntelligenceReference[];
  assumptions: string[];
  unavailableReason?: string | null;
}

export interface EvidenceStatusAssessment {
  status: EvidenceStatus;
  reason: string;
  sourceGrade?: string | null;
  sourceBasis?: string | null;
}
