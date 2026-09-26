import type {
  EvidenceStatus,
  EvidenceStatusAssessment,
  ImpactStatement,
  IntelligenceReference,
} from "./agent-intelligence-types";

// The v2 structured response, replacing plain-markdown `response_chunk` as the source of truth.
// Render `markdown` with a safe renderer; findings/metrics/evidence/caveats/actions come from
// these fields directly — don't parse them back out of the markdown.
export interface AgentResponseV2 {
  contractVersion: "2.0";
  markdown: string;
  findings: Array<{
    id: string;
    title: string;
    summary: string;
    evidenceStatus: EvidenceStatus;
    metrics: Array<{
      id: string;
      label: string;
      value: string;
      unit?: string | null;
      basis?: string | null;
      impact?: ImpactStatement | null;
    }>;
    evidence: Array<{
      referenceType: string;
      referenceId: string;
      label: string;
      mappingVersion?: string | null;
      observedAtUtc?: string | null;
      coverage?: number | null;
      lineage?: number | null;
    }>;
  }>;
  caveats: Array<{ code: string; message: string }>;
  actions: SuggestedActionV2[];
  provenance?: ResponseProvenanceBundle | null;
}

// Resolve `target.resource` through a frontend-owned map (known values so far: "segment",
// "campaign", "datasources", "channels", "room"); ignore unknown resource names and never treat a
// label/parameter/model-authored text as a URL. Hide actions where `eligibility.eligible === false`.
export interface SuggestedActionV2 {
  id: string;
  // The handoff doc lists this as a PascalCase enum ("OpenRoom", etc.), but a live capture on
  // 2026-09-25 sent "openRoom" (camelCase) instead. Resolution is keyed off `target.resource`, not
  // `kind` (except the `AskAgent` special case), so the mismatch doesn't break anything — but
  // widened to accept any string rather than pretend the doc's casing is confirmed. Re-tighten
  // only after re-checking a live payload.
  kind: "OpenRecord" | "OpenWorkspaceSurface" | "OpenRoom" | "ConnectSource" | "AskAgent" | (string & {});
  label: string;
  target: { resource: string; resourceId?: string | null };
  parameters?: Record<string, string> | null;
  eligibility?: {
    eligible: boolean;
    reason?: string | null;
    requiredCapabilities?: string[] | null;
  } | null;
}

export interface ResponseProvenanceBundle {
  contractVersion: "1.0";
  findings: Array<{
    findingId: string;
    evidenceStatus: EvidenceStatusAssessment;
    evidence: IntelligenceReference[];
    sourceResolution?: {
      capabilityId: string;
      decision: string;
      evaluatedAtUtc: string;
      selectedSources: IntelligenceReference[];
    } | null;
    traceRoots?: IntelligenceReference[] | null;
  }>;
}
