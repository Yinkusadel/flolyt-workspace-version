// Shared shapes for /api/v3/datasource-relationships. Documented in
// docs/endpoints/datasource-relationships.md. Fields marked "doc only" are named in the backend
// handoff (docs/datasource-relationship-mapping-api.md) but have not been seen in a real response.

export interface RelationshipValidationIssue {
  code: string;
  field: string;
  message: string;
}

// Standard envelope, plus the `code` and `validationIssues` this API adds.
export interface RelationshipEnvelope<T> {
  data: T;
  succeeded: boolean;
  code: string | null;
  messages: string[];
  validationIssues: RelationshipValidationIssue[];
}

export interface RelationshipDatasetScope {
  // Server-assigned, present on responses, never sent on a declaration.
  companyId?: string;
  datasourceId: string;
  datasetId: string;
  subjectType: string;
  grain: string;
}

// ── Catalog ──────────────────────────────────────────────────────────────────────────────────

export interface RelationshipCatalogColumn {
  name: string;
  keyType: string;
  semanticRole: string;
  identityCandidate: boolean;
}

export interface RelationshipIdentityKey {
  name: string;
  kind: string;
  columns: string[];
}

export interface RelationshipCatalogDataset {
  dataset: RelationshipDatasetScope;
  sourceLabel: string;
  provider: string;
  mappingFingerprint: string;
  // Doc names three values: ALLOWED | UNVERIFIED | DENIED_OR_DEGRADED. Typed string until seen live.
  readPermission: string;
  active: boolean;
  columns: RelationshipCatalogColumn[];
  identityKeys: RelationshipIdentityKey[];
  previewSupported: boolean;
  previewLimitations: string[];
}

export interface RelationshipSuggestion {
  name: string;
  from: RelationshipDatasetScope;
  fromColumns: string[];
  to: RelationshipDatasetScope;
  toColumns: string[];
  // A single string here, but a declaration's `evidence` is an array of 1 to 20 references.
  evidence: string;
  origin: string;
}

export interface RelationshipCatalog {
  datasets: RelationshipCatalogDataset[];
  suggestions: RelationshipSuggestion[];
}

// ── Definition (write body) ──────────────────────────────────────────────────────────────────

export type RelationshipMeaning = "Reference" | "Identity";
export type RelationshipCardinality = "OneToOne" | "ManyToOne" | "OneToMany" | "ManyToMany";

export interface RelationshipEndpoint {
  dataset: RelationshipDatasetScope;
  // Ordered, 1 to 8 exact column names. No trimming, case folding or fuzzy matching.
  keyColumns: string[];
}

export interface RelationshipCrosswalk {
  dataset: RelationshipDatasetScope;
  fromColumns: string[];
  toColumns: string[];
}

export interface RelationshipDefinition {
  name: string;
  meaning: RelationshipMeaning;
  from: RelationshipEndpoint;
  to: RelationshipEndpoint;
  cardinality: RelationshipCardinality;
  // 1 to 20 references.
  evidence: string[];
  crosswalk?: RelationshipCrosswalk;
}

// ── Mapping (list item, detail, write responses) ─────────────────────────────────────────────

// Doc: DRAFT | APPROVED | DISABLED | NEEDS_REVIEW. `state` is the effective state, `storedState`
// the audited lifecycle state.
export type RelationshipState = "DRAFT" | "APPROVED" | "DISABLED" | "NEEDS_REVIEW";

export interface RelationshipMapping {
  id: string;
  revision: number;
  state: RelationshipState;
  storedState: RelationshipState;
  definition: RelationshipDefinition;
  // Doc only: element shapes not seen yet.
  limitations: unknown[];
  // Doc only: "receipt/actor/time", field names not seen yet. Null when not approved.
  approval: Record<string, unknown> | null;
  // Detail carries the latest 50 revisions, newest first. List and write responses omit these.
  history?: Record<string, unknown>[];
  historyTotal?: number;
  historyTruncated?: boolean;
}

// ── Preview ──────────────────────────────────────────────────────────────────────────────────

export interface RelationshipPreviewSummary {
  sourceRowsExamined: number;
  targetRowsExamined: number;
  bridgeRowsExamined: number;
  matched: number;
  unmatched: number;
  unresolved: number;
  ambiguous: number;
  sourceMissingKeys: number;
  targetMissingKeys: number;
  bridgeMissingKeys: number;
  malformedKeys: number;
  cardinalityViolations: number;
  partial: boolean;
  canApprove: boolean;
}

export type RelationshipPreviewScope = "COMPLETE_FOR_SELECTED_DATASETS" | "PARTIAL";

// Doc only: the doc shows `data.summary` and says "scope" and the server's "preview ID" exist, but
// not where they sit. Both are guessed to be on `data`.
export interface RelationshipPreview {
  previewId: string;
  scope: RelationshipPreviewScope;
  summary: RelationshipPreviewSummary;
}

// ── History ──────────────────────────────────────────────────────────────────────────────────

export interface RelationshipHistoryPage {
  offset: number;
  limit: number;
  total: number;
  // Revision element shape not seen yet.
  revisions: Record<string, unknown>[];
  hasMore: boolean;
}

export interface RelationshipListPage {
  mappings: RelationshipMapping[];
  offset: number;
  limit: number;
  total: number;
}

export interface RelationshipPageParams {
  offset?: number;
  // 1 to 100.
  limit?: number;
}
