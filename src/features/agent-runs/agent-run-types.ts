import type { AgentResponseV2 } from "@/features/ai-conversations/agent-response-types";

export type SourceCandidateState =
  | "AVAILABLE"
  | "PARTIAL"
  | "STALE"
  | "UNMAPPED"
  | "LOW_QUALITY"
  | "PERMISSION_BLOCKED"
  | "SOURCE_DEGRADED"
  | "NOT_AVAILABLE";

export interface SourceResolution {
  capabilityId: string;
  requiredEntities: string[];
  requiredRoleGroups: string[][];
  unmodelledSource?: string | null;
  decision:
    | "no_source_required"
    | "use_single_source"
    | "combine_sources"
    | "ask_for_mapping"
    | "unavailable";
  evaluatedAtUtc: string;
  selectedSourceIds: string[];
  clarification?: string | null;
  unavailableReason?: string | null;
  candidates: Array<{
    sourceId: string;
    sourceName: string;
    state: SourceCandidateState;
    score: {
      relevance: number;
      authority: number;
      completeness: number;
      freshness: number;
      quality: number;
      lineage: number;
      timeCoverage: number;
      permission: number;
      total: number;
    };
    matchedEntities: string[];
    matchedRoles: string[];
    missingEntities: string[];
    missingRoleGroups: string[][];
    observedAtUtc?: string | null;
    mappingVersion?: string | null;
    lineage?: number | null;
    coverageFromUtc?: string | null;
    coverageToUtc?: string | null;
  }>;
}

// `execution`, `executionRationaleId`, and everything inside `execution` are diagnostic/support
// data only — never present as model reasoning or a user-editable control. Per the v3 handoff,
// `sourceResolutionEnforced`/`responseIntegrityEnforced` record the policy frozen for a given run
// (support diagnostics, not frontend feature flags), and `sourceResolution`/`knowledgeRetrieval`
// stay diagnostic/data-readiness-surface-only regardless — render citations only when they appear
// in a final structured finding, never raw retrieved passages. Older runs can return false or omit
// any of these entirely.
export interface AgentRun {
  id: string;
  sessionId: string;
  status: "queued" | "running" | "awaiting_approval" | "done" | "failed" | "cancelled";
  cancelRequested: boolean;
  error?: string | null;
  turn: number;
  inputTokens: number;
  outputTokens: number;
  promptVersion: string;
  modelTier: string;
  execution?: {
    agentId: string;
    routingKind: "explicit" | "single_match" | "multi_match" | "unmatched" | "unready";
    candidateAgentIds: string[];
    packVersion: string;
    outputContractVersion: string;
    effectiveVersion: string;
    boundToolNames: string[];
    methodIds: string[];
    // Typed as required booleans on the wire per the handoff's TS block, but the same doc notes
    // older runs "can return false or omit" them — optional here so a run recorded before these
    // existed doesn't type-lie as `false`.
    sourceResolutionEnforced?: boolean;
    responseIntegrityEnforced?: boolean;
    sourceResolution?: SourceResolution | null;
    knowledgeRetrieval?: {
      mode: "undeclared" | "exact" | "lexical" | "hybrid_shadow" | "shadow_error";
      collectionIds: string[];
      documentVersions: string[];
      chunkIds: string[];
      citations: Array<{
        collectionId: string;
        documentId: string;
        documentVersion: string;
        chunkId: string;
        title: string;
        sourceUri: string;
        section?: string | null;
      }>;
      filters: Record<string, string>;
      indexGenerationIds: string[];
      augmentedPrompt: boolean;
      status?: "not_requested" | "no_match" | "matched" | "failed" | null;
    } | null;
    // Appears only on multi-domain turns; older and single-specialist runs omit it. Read-only audit
    // view — the conversation still renders one final Maestro answer regardless.
    executionPlan?: {
      schemaVersion: "flolyt.agent-execution-plan.v1";
      planId: string;
      planVersion: string;
      orchestratorAgentId: "flolyt.maestro";
      specialistSteps: Array<{
        stepId: string;
        agentId: string;
        requiredCapabilities: string[];
        expectedEvidence: string[];
        brief: string;
      }>;
      synthesis: { stepId: string; agentId: "flolyt.maestro"; brief: string };
    } | null;
    // Support-only audit view of the frozen model-selection policy for this run — no customer-
    // facing selector, no change to message rendering. An internal diagnostics panel may show
    // this; older runs omit it entirely.
    modelRouting?: {
      policyVersion: string;
      mode: "off" | "shadow" | "active" | "fallback" | string;
      cohortKey: string;
      baselineModelId: string;
      candidateModelId?: string | null;
      recommendedModelId: string;
      selectedModelId: string;
      reason: string;
      isHoldout: boolean;
      baselineSamples: number;
      candidateSamples: number;
      consecutivePasses: number;
    } | null;
  } | null;
  executionRationaleId?: string | null;
  finalResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  steering: Array<{ id: string; text: string; addedBy: string; addedAtUtc: string; consumed: boolean }>;
  createdAtUtc: string;
  finishedAtUtc?: string | null;
}
