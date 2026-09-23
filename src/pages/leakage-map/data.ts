/**
 * Static content for the leakage map, rebuilt from
 * flolyt-figma-designs/New-pages-pattern/leakage-new/svg/01–12. The export's own caption says
 * this is a fixed "live-demo sample" — kept here now only as a record of what the Figma export
 * looked like, and shrinking as each section gets wired to `GET /leakage` (see
 * docs/leakage-map/build-plan.md). Calc mode / Window / Horizon / Severity / Confidence filter
 * option lists used to live here — they're wired now and live in filters.ts instead, sourced from
 * the live response where it supplies them, per [[feedback_retire_mock_options_not_extend]].
 */

export type Tone = "rose" | "teal";

// ---------------------------------------------------------------------------
// Severity / confidence — still the mock matrix's own internal risk ranking below (`MATRIX_ROWS`
// etc.), separate from the real filters.ts values now sent to the API. Collapses into one thing
// once the matrix itself is wired to the real grid (Step 4) — see the adapter in index.tsx in the
// meantime.
// ---------------------------------------------------------------------------

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export const SEVERITY_LABEL: Record<SeverityLevel, string> = {
  1: "S1 — Critical",
  2: "S2 — High",
  3: "S3 — Elevated",
  4: "S4 — Moderate",
  5: "S5 — Low",
};

export type ConfidenceLevel = "low" | "medium" | "high";

export const CONFIDENCE_RANK: Record<ConfidenceLevel, number> = { low: 1, medium: 2, high: 3 };
export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = { low: "Low", medium: "Medium", high: "High" };

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

export type Stage = {
  id: string;
  number: string;
  label: string;
  dot: string;
  metricLines: string[];
  value: string;
  valueTone: Tone;
  coveragePercent: number;
};

/** Adopt keeps its own operational drilldown (customers/median features/slipped-out) — the one
 * stage this export authors a "Learn why" agent handoff for. */
export const ADOPT_STAGE_DETAIL = {
  stageId: "adopt",
  owner: "Product owns this stage",
  customersInStage: "640,100",
  medianFeaturesReached: "2.1 of 9",
  slippedOutLastQuarter: "74,300",
  spans: ["active", "slipping"] as const,
  spansNote: "Adopt spans Active and Slipping in the matrix below — highlighted there now.",
};

/** Retain is the export's own authored rollup example (06-stage-rollup.svg) — the coverage math
 * that explains why stage cards never sum to the matrix below them. */
export const RETAIN_STAGE_ROLLUP = {
  stageId: "retain",
  summary: "Expected loss across all Retain-stage leaks at the current horizon.",
  coveragePercent: 74,
  unattributedAmount: "₦107M",
  unattributedPercent: 26,
  topMechanisms: [
    { label: "Repeat decay", value: "₦212M" },
    { label: "Involuntary churn", value: "₦98M" },
    { label: "Abandonment", value: "₦61M" },
    { label: "Refunds", value: "₦41M" },
  ],
  confidence: "Medium",
  rangeLow: "₦280M",
  rangeHigh: "₦580M",
};

// ---------------------------------------------------------------------------
// Matrix
// ---------------------------------------------------------------------------

export type MatrixColumnKey = "repeatDecay" | "involuntaryChurn" | "abandonment" | "refunds" | "discountDependency";

export const MATRIX_COLUMNS: { key: MatrixColumnKey; label: string }[] = [
  { key: "repeatDecay", label: "Repeat decay" },
  { key: "involuntaryChurn", label: "Involuntary churn" },
  { key: "abandonment", label: "Abandonment" },
  { key: "refunds", label: "Refunds" },
  { key: "discountDependency", label: "Discount dependency" },
];

/** Sequential rose-tint heat scale for "how much is at risk in this cell" — 0 is the legend's unused LOW swatch. */
export const HEAT_SCALE = ["#F5F5F4", "#FBEBE7", "#F4CFC7", "#E5A79B"] as const;
export const HEAT_TEXT_CLASS = ["text-ink-2", "text-ink-2", "text-ink", "text-ink"] as const;

type RiskMeta = { severity: SeverityLevel; confidence: ConfidenceLevel };

export type MatrixCell =
  | ({ kind: "value"; value: string; heat: 1 | 2 | 3 } & RiskMeta)
  | ({
      kind: "compound";
      value: string;
      heat: 1 | 2 | 3;
      projection: { horizon: string; value: string }[];
      severityNow: SeverityLevel;
      severityAt12m: SeverityLevel;
      rankByAmount: number;
      rankByThreat: number;
    } & RiskMeta)
  | { kind: "zero"; note: string; lastChecked: string }
  | { kind: "gap"; missingSource: string; explanation: string; recoveryLow: string; recoveryHigh: string };

export type MatrixRow = {
  key: string;
  label: string;
  cells: Record<MatrixColumnKey, MatrixCell>;
};

export const MATRIX_ROWS: MatrixRow[] = [
  {
    key: "new",
    label: "New",
    cells: {
      repeatDecay: { kind: "value", value: "₦41M", heat: 1, severity: 2, confidence: "medium" },
      involuntaryChurn: { kind: "value", value: "₦12M", heat: 1, severity: 2, confidence: "medium" },
      abandonment: { kind: "value", value: "₦88M", heat: 3, severity: 1, confidence: "high" },
      refunds: { kind: "value", value: "₦6M", heat: 1, severity: 2, confidence: "medium" },
      discountDependency: { kind: "value", value: "₦18M", heat: 1, severity: 2, confidence: "medium" },
    },
  },
  {
    key: "active",
    label: "Active",
    cells: {
      repeatDecay: { kind: "value", value: "₦96M", heat: 2, severity: 2, confidence: "medium" },
      involuntaryChurn: { kind: "value", value: "₦61M", heat: 2, severity: 1, confidence: "high" },
      abandonment: {
        kind: "compound",
        value: "₦124M",
        heat: 3,
        severity: 2,
        confidence: "medium",
        severityNow: 3,
        severityAt12m: 1,
        rankByAmount: 6,
        rankByThreat: 2,
        projection: [
          { horizon: "30d", value: "₦12M" },
          { horizon: "90d", value: "₦124M" },
          { horizon: "Qtr", value: "₦180M" },
          { horizon: "12m", value: "₦248M" },
        ],
      },
      refunds: { kind: "value", value: "₦22M", heat: 1, severity: 2, confidence: "medium" },
      discountDependency: { kind: "value", value: "₦46M", heat: 2, severity: 2, confidence: "medium" },
    },
  },
  {
    key: "slipping",
    label: "Slipping",
    cells: {
      repeatDecay: { kind: "value", value: "₦412M", heat: 3, severity: 2, confidence: "medium" },
      involuntaryChurn: { kind: "value", value: "₦27M", heat: 1, severity: 2, confidence: "high" },
      abandonment: { kind: "value", value: "₦34M", heat: 1, severity: 2, confidence: "medium" },
      refunds: { kind: "zero", note: "No refunds detected in the slipping state at this horizon and confidence level.", lastChecked: "6 minutes ago" },
      discountDependency: { kind: "value", value: "₦31M", heat: 1, severity: 2, confidence: "medium" },
    },
  },
  {
    key: "lapsed",
    label: "Lapsed",
    cells: {
      repeatDecay: { kind: "value", value: "₦188M", heat: 3, severity: 1, confidence: "medium" },
      involuntaryChurn: {
        kind: "gap",
        missingSource: "no dunning feed",
        explanation: "No dunning feed is connected, so involuntary churn cannot be detected in this state.",
        recoveryLow: "₦18M",
        recoveryHigh: "₦34M",
      },
      abandonment: { kind: "value", value: "₦11M", heat: 1, severity: 2, confidence: "medium" },
      refunds: { kind: "value", value: "₦4M", heat: 1, severity: 2, confidence: "medium" },
      discountDependency: { kind: "value", value: "₦52M", heat: 2, severity: 2, confidence: "medium" },
    },
  },
  {
    key: "reactivated",
    label: "Reactivated",
    cells: {
      repeatDecay: { kind: "value", value: "₦34M", heat: 1, severity: 2, confidence: "medium" },
      involuntaryChurn: { kind: "value", value: "₦8M", heat: 1, severity: 2, confidence: "medium" },
      abandonment: { kind: "value", value: "₦14M", heat: 1, severity: 2, confidence: "medium" },
      refunds: {
        kind: "gap",
        missingSource: "no dunning feed",
        explanation:
          "No dunning feed is connected, so Flolyt cannot see which reactivated customers were refunded and which simply churned again.",
        recoveryLow: "₦6M",
        recoveryHigh: "₦15M",
      },
      discountDependency: { kind: "value", value: "₦74M", heat: 2, severity: 2, confidence: "medium" },
    },
  },
];

/** Only "value" and "compound" cells carry a severity/confidence ranking to filter on — a gap or
 * a zero cell is about data availability, not risk severity, so both stay visible regardless of
 * the Severity/Confidence controls. */
function isRankedCell(cell: MatrixCell): cell is Extract<MatrixCell, { kind: "value" | "compound" }> {
  return cell.kind === "value" || cell.kind === "compound";
}

export function isCellHiddenByFilter(
  cell: MatrixCell,
  severityFilter: SeverityLevel,
  confidenceFilter: ConfidenceLevel
): boolean {
  if (!isRankedCell(cell)) return false;
  return cell.severity > severityFilter || CONFIDENCE_RANK[cell.confidence] < CONFIDENCE_RANK[confidenceFilter];
}

/** Share of ranked cells the current Severity/Confidence filter hides — drives the status line's
 * amber warning and the matrix's own banner (11-filtered.svg). */
export function filteredOutPercent(severityFilter: SeverityLevel, confidenceFilter: ConfidenceLevel): number {
  const ranked = MATRIX_ROWS.flatMap((row) => MATRIX_COLUMNS.map((col) => row.cells[col.key])).filter(isRankedCell);
  if (ranked.length === 0) return 0;
  const hidden = ranked.filter((cell) => isCellHiddenByFilter(cell, severityFilter, confidenceFilter)).length;
  return Math.round((hidden / ranked.length) * 100);
}

/** The one authored worked example — every other cell only carries what the matrix itself already shows. */
export const FEATURED_CELL = {
  rowKey: "slipping",
  columnKey: "repeatDecay" as MatrixColumnKey,
  threatScore: 82,
  rangeLow: "₦280M",
  rangeHigh: "₦580M",
  recencyDays: "3 days",
  recoverablePercent: 22,
  netExpectedLoss: "₦321M",
  segments: [
    { label: "Lagos · first order Mar–May", amount: "₦84M" },
    { label: "Annual NGN plans", amount: "₦61M" },
    { label: "Mobile-first, no second order", amount: "₦48M" },
  ],
  moreSegments: 87,
  room: { id: "second-order-never-happened", label: "Room 2471 is open on this cell" },
};

// ---------------------------------------------------------------------------
// Coverage & limitations panel
// ---------------------------------------------------------------------------

export const COVERAGE_PANEL = {
  overallPercent: 78,
  missingSourceCount: 4,
  covered: {
    customerPercent: 79,
    lines: ["10 lifecycle stages", "5 leak mechanisms", "5 customer states", "3.3M of 4.2M customers"],
  },
  notCovered: [
    { label: "Dunning feed · involuntary churn", detail: "₦18M–₦34M unknown" },
    { label: "Renewal intent signals", detail: "not connected" },
    { label: "Partner-sourced accounts", detail: "0.6M customers" },
    { label: "Latent pricing risk", detail: "not modelled" },
  ],
  notIncluded: [
    { label: "Unknown leaks", detail: "by definition" },
    { label: "Cascade from correlated churn", detail: "" },
    { label: "Macro or market shocks", detail: "" },
    { label: "Model error", detail: "" },
  ],
  howToImprove: [
    { label: "Connect dunning feed", boost: "+4–6%" },
    { label: "Connect renewal intent", boost: "+6–9%" },
    { label: "Expand to partner accounts", boost: "+12%" },
  ],
  lastUpdated: "6 min ago",
};

// ---------------------------------------------------------------------------
// Actions triggered panel
// ---------------------------------------------------------------------------

export type ActionRow = {
  severity: "S1" | "S2";
  cellLabel: string;
  accountsLine: string;
  action: string;
  sla: string;
  amount: string;
  /** Links straight to the room already open on this cell, when there is one — see FEATURED_CELL. */
  roomId?: string;
};

export const ACTIONS_PANEL = {
  summary: "2 critical · 5 high · 11 medium · every one has an owner and an SLA",
  filterSummary: "Based on the current view · Expected loss · Next 90 days · Severity ≥ S2 · Confidence ≥ Medium",
  rows: [
    { severity: "S1", cellLabel: "Slipping × Repeat decay", accountsLine: "24 accounts · Dana O. · Product", action: "Exec sponsor outreach", sla: "SLA 24h", amount: "₦412M", roomId: FEATURED_CELL.room.id },
    { severity: "S1", cellLabel: "Active × Abandonment", accountsLine: "12 accounts · Amara Okeke · Support", action: "Onboarding intervention", sla: "SLA 48h", amount: "₦124M" },
    { severity: "S2", cellLabel: "New × Abandonment", accountsLine: "41 accounts · 3 CSMs", action: "Activation campaign", sla: "SLA 1 week", amount: "₦88M" },
    { severity: "S2", cellLabel: "Lapsed × Repeat decay", accountsLine: "18 accounts · Win-back team", action: "Reactivation play", sla: "SLA 2 weeks", amount: "₦188M" },
  ] satisfies ActionRow[],
  moreAtS3: 11,
  totalActionableExposure: "₦1.18B",
  expectedSaveRecoveryAdjusted: "₦487M",
  calloutTitle: "Exposure without routing is a scoreboard",
  calloutBody: "Every figure above lands on a named desk with an action and an SLA. A number nobody owns is a number nobody moves.",
};

// ---------------------------------------------------------------------------
// How this is calculated
// ---------------------------------------------------------------------------

export const HOW_CALCULATED = {
  formulas: [
    "Expected loss = Probability × Impact × Ramp factor",
    "Net expected loss = Expected loss × (1 − Recovery rate)",
  ],
  terms: [
    { term: "Probability", body: "How likely the leak is to convert to actual loss. From base rates, signal strength and mechanism clarity." },
    { term: "Impact", body: "Revenue at stake if it materialises, in the current lens — bookings, revenue, margin or cash." },
    { term: "Ramp factor", body: "How much materialises by the selected horizon. Deal slippage ramps faster than discount dependency." },
    { term: "Recovery rate", body: "Fraction realistically saveable with reasonable intervention, calibrated from historical saves." },
    { term: "Confidence", body: "How much we trust the estimate itself. It decays as the horizon extends." },
  ],
  notIncluded: [
    "Unknown leaks — not yet detected",
    "Latent leaks — structural, not yet triggered",
    "Correlated shocks — market, macro, competitive",
    "Second-order effects — cascade, contagion",
    "Model error",
  ],
  coveragePercent: 78,
  lastCalibration: "2 April 2026",
  nextRecalibration: "1 July 2026",
};

// ---------------------------------------------------------------------------
// Page-level footer (shared under both the coverage and actions panels)
// ---------------------------------------------------------------------------

export const PAGE_FOOTER = {
  coverageLine: "Coverage: 78% of detectable surface",
  notIncludedLine: "Not included: unknown, latent, correlated, macro",
  totalLine: "Total actionable exposure: ₦1.18B",
  expectedSaveLine: "Expected save, recovery-adjusted: ₦487M",
  explainer: "The first line protects you from false confidence. The second tells you what to do.",
};

// ---------------------------------------------------------------------------
// Page states (12-states.svg) — empty/error render as a `PageStateBanner`; loading is now
// `recomputing-toast.tsx`'s own floating toast (a fixed-position overlay, not in-flow, so a
// refetch never shifts the page — see that file).
// ---------------------------------------------------------------------------

export const PAGE_STATES = {
  empty: {
    title: "No leakage data yet",
    body: "Connect at least one source to see your exposure map.",
    footnote: "One source is enough to start; coverage is shown from the first cell.",
    cta: "Connect a source",
  },
  error: {
    title: "Unable to refresh the leakage map",
    body: "Last successful refresh 41 minutes ago. Nothing below has been re-estimated.",
    footnote: "The stale figures stay on screen with their timestamp rather than being blanked.",
    cta: "Retry",
  },
};

// ---------------------------------------------------------------------------
// Market breakdown
// ---------------------------------------------------------------------------

export type Market = {
  name: string;
  customers: string;
  amount: string;
  barPercent: number;
  tone: Tone | "amber";
};

export const MARKETS: Market[] = [
  { name: "Nigeria", customers: "2.9M customers", amount: "₦742M", barPercent: 86, tone: "rose" },
  { name: "Kenya", customers: "610k customers", amount: "KES 41.2M", barPercent: 44, tone: "amber" },
  { name: "Ghana", customers: "380k customers", amount: "GHS 3.1M", barPercent: 31, tone: "amber" },
  { name: "United Kingdom", customers: "310k customers", amount: "£184k", barPercent: 18, tone: "teal" },
];

export const NO_SINGLE_TOTAL = {
  title: ["There is no single total here,", "and that is deliberate"],
  body: [
    "Converting ₦742M and £184k into one number would hide that the UK problem is small and the Nigerian one is nine tenths of the exposure.",
    "Where a combined figure is genuinely needed, the rate and its date sit next to it.",
  ],
};
