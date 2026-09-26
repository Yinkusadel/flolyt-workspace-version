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
// data only — never present as model reasoning or a user-editable control. `sourceResolution` and
// `knowledgeRetrieval` are shadow-mode fields: show them only on diagnostic/data-readiness
// surfaces (keep using the existing roster-readiness projection elsewhere) until backend
// enforcement is announced. Older runs return these as null or omit them entirely.
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
  } | null;
  executionRationaleId?: string | null;
  finalResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  steering: Array<{ text: string; addedBy: string; addedAtUtc: string; consumed: boolean }>;
  createdAtUtc: string;
  finishedAtUtc?: string | null;
}
