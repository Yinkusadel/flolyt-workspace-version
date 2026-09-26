import type {
  EvidenceStatusAssessment,
  ImpactStatement,
  IntelligenceReference,
} from "@/features/ai-conversations/agent-intelligence-types";

// Response shape of GET /api/v3/evidence/{kind}/{referenceId} — a finding's evidence and
// source-resolution graph. Render evidenceStatus from the structured field (show its `reason` as
// the explanation, never promote a status on the client); for `impact.basis === "unavailable"`
// show `unavailableReason` and no numeric value.
export interface CanonicalIntelligenceProjection {
  contractVersion: "1.0";
  root: IntelligenceReference;
  nodes: Array<{
    reference: IntelligenceReference;
    label: string;
    summary?: string | null;
    evidenceStatus: EvidenceStatusAssessment;
    impact?: ImpactStatement | null;
    observedAtUtc?: string | null;
    attributes?: Record<string, string> | null;
  }>;
  links: Array<{
    from: IntelligenceReference;
    to: IntelligenceReference;
    relation:
      | "Investigates"
      | "Establishes"
      | "SupportedBy"
      | "Tests"
      | "Quantifies"
      | "Recommends"
      | "DecidedAs"
      | "Executes"
      | "Produced"
      | "ResolvedFrom";
  }>;
  generatedAtUtc: string;
}
