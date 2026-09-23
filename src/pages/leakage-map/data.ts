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

export type ConfidenceLevel = "low" | "medium" | "high";
export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = { low: "Low", medium: "Medium", high: "High" };

// ---------------------------------------------------------------------------
// Matrix — the mock's hardcoded 5×5 grid, 5 authored cell states, and per-cell severity/confidence
// ranking are gone as of Step 4 (see docs/leakage-map/build-plan.md): `matrix.tsx` now renders
// `GET /leakage`'s own dynamic `grids[]`, and the server already excludes severity/confidence-
// filtered cells from that response rather than the client hiding them. `HEAT_SCALE`/
// `HEAT_TEXT_CLASS` survive unchanged — purely decorative constants, not mock data — now driven by
// each real cell's own `intensity` field instead of an authored `heat` property.
// ---------------------------------------------------------------------------

/** Sequential rose-tint heat scale for "how much is at risk in this cell" — 0 is the legend's unused LOW swatch. */
export const HEAT_SCALE = ["#F5F5F4", "#FBEBE7", "#F4CFC7", "#E5A79B"] as const;
export const HEAT_TEXT_CLASS = ["text-ink-2", "text-ink-2", "text-ink", "text-ink"] as const;

/** The Actions-triggered panel's one authored worked example (`actions-panel.tsx`, still hidden
 * for this pass per the Step 1 decision) links to this room — kept only for that reference until
 * Step 5 removes `ActionsPanel` from `index.tsx` entirely. */
export const FEATURED_CELL = {
  rowKey: "slipping",
  columnKey: "repeatDecay",
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
