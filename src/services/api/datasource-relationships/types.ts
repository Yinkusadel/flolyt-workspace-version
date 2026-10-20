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

// Real shapes seen 2026-10-20 on an approved mapping.
export interface RelationshipApprovalBinding {
  dataset: RelationshipDatasetScope;
  sourceConfigurationFingerprint: string;
  mappingFingerprint: string;
  // Null for a bring-your-own-warehouse source, which has no import revision.
  importId: string | null;
}

export interface RelationshipApproval {
  // The preview receipt the approval was made against.
  previewId: string;
  declarationRevision: number;
  definitionFingerprint: string;
  bindings: RelationshipApprovalBinding[];
  approvedByUserId: string;
  // Added by the backend 2026-10-20 (ticket closed).
  approvedByName: string;
  approvedAtUtc: string;
  partial: boolean;
  acceptedPartial: boolean;
}

// One audit revision. `state` is title case here ("Draft", "Approved", "Disabled"), unlike the
// upper-case `state` on the mapping. `changeReason` is CREATED, REVISED or APPROVED, except on a
// disable, where it is the free text reason the person typed.
export interface RelationshipHistoryEntry {
  id: string;
  companyId: string;
  mappingId: string;
  revision: number;
  definition?: RelationshipDefinition;
  state: string;
  changedByUserId: string;
  // Added by the backend 2026-10-20 (ticket closed).
  changedByName: string;
  changedAtUtc: string;
  changeReason: string;
  approval: RelationshipApproval | null;
}

export interface RelationshipMapping {
  id: string;
  revision: number;
  state: RelationshipState;
  storedState: RelationshipState;
  definition: RelationshipDefinition;
  // Doc only: element shapes not seen yet.
  limitations: unknown[];
  // Null until approved.
  approval: RelationshipApproval | null;
  // Detail carries the latest 50 revisions, newest first. List rows carry an empty array here
  // while `historyTruncated` is true, so it is only reliable on the detail response.
  history?: RelationshipHistoryEntry[];
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

// Real response seen 2026-10-20. `id` is the server-issued receipt that approval sends back as
// `previewId`. `declarationRevision` is the mapping revision it was run against.
export interface RelationshipPreview {
  id: string;
  mappingId: string;
  declarationRevision: number;
  summary: RelationshipPreviewSummary;
  scope: RelationshipPreviewScope;
  canApprove: boolean;
  // True when the preview was partial: approval then needs `acceptPartial: true`.
  requiresPartialAcceptance: boolean;
  observedAtUtc: string;
  // The receipt lifetime is 15 minutes.
  expiresAtUtc: string;
}

// ── History ──────────────────────────────────────────────────────────────────────────────────

export interface RelationshipHistoryPage {
  offset: number;
  limit: number;
  total: number;
  revisions: RelationshipHistoryEntry[];
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
