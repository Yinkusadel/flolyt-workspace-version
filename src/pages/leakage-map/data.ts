/**
 * Static content for the new leakage map, sourced from
 * flolyt-figma-designs/New-pages-pattern/leakage/leakage/svg/01–04, updated per the later revision
 * in .../leakage/Archive/04,08,09 (new "Shade by" filter, and the Window picker's options/coverage
 * notes). The export's own caption (index.html) says the content is a fixed "live-demo sample" —
 * there is no GET /leakage endpoint behind these numbers, so every picker in index.tsx only changes
 * its own label and the legend caption for now; none of them recompute the matrix below.
 */

export type Tone = "rose" | "teal";

export type ViewMode = "historical" | "forward";

export type ViewModeOption = {
  value: ViewMode;
  /** Compact form shown in the closed trigger. */
  shortLabel: string;
  label: string;
  note: string;
};

// Window (a period) and Shade By (Exposure/Annualised/Severity/Confidence) don't both make sense
// on screen at once — Window is a backward-looking span, Exposure a right-now measure. So index.tsx
// shows exactly one of the two next to this toggle, never both, never neither: Historical pairs
// with Window, Forward exposure pairs with Shade By (full option list, nothing narrowed).
export const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  {
    value: "historical",
    shortLabel: "Historical",
    label: "Historical window",
    note: "look back over a period you pick",
  },
  {
    value: "forward",
    shortLabel: "Forward",
    label: "Forward exposure",
    note: "shade by exposure or risk instead of a period",
  },
];

export const DEFAULT_VIEW_MODE: ViewMode = "historical";

export type WindowOption = {
  value: string;
  label: string;
  /** Muted coverage note shown under the label — amber (a real caveat) when `caveat` is set. */
  note: string;
  caveat?: boolean;
};

export const WINDOW_OPTIONS: WindowOption[] = [
  { value: "30d", label: "Last 30 days", note: "every source covers this" },
  { value: "90d", label: "Last 90 days", note: "every source covers this" },
  { value: "qtd", label: "Quarter to date", note: "every source covers this" },
  { value: "12m", label: "Last 12 months", note: "product events only start 4 March", caveat: true },
  { value: "custom", label: "Custom range…", note: "pick any start and end" },
];

// Reasserted every time Window remounts (switching back from Forward, or a fresh page load) —
// see index.tsx's conditional render.
export const DEFAULT_WINDOW = "30d";

export const WINDOW_FOOTNOTE =
  "A longer window is not always a fuller picture. Cells a source cannot reach read Unavailable.";

export type ShadeByOption = {
  value: string;
  /** Compact form shown in the closed trigger, e.g. "Exposure". */
  shortLabel: string;
  /** Full label shown in the open list, e.g. "Exposure · 90 days". */
  label: string;
  note: string;
  /** Slots into the matrix legend's "Shading is …" caption. */
  captionLabel: string;
};

export const SHADE_BY_OPTIONS: ShadeByOption[] = [
  {
    value: "exposure",
    shortLabel: "Exposure",
    label: "Exposure · 90 days",
    note: "money at risk inside the window",
    captionLabel: "90-day exposure",
  },
  {
    value: "annualised",
    shortLabel: "Annualised",
    label: "Annualised exposure",
    note: "the same cells at a yearly run rate",
    captionLabel: "annualised exposure",
  },
  {
    value: "severity",
    shortLabel: "Severity",
    label: "Severity",
    note: "S1–S5, so small but urgent cells surface",
    captionLabel: "severity",
  },
  {
    value: "confidence",
    shortLabel: "Confidence",
    label: "Confidence",
    note: "how firmly each cell is held",
    captionLabel: "confidence",
  },
];

export const DEFAULT_SHADE_BY = "exposure";

export const SHADE_BY_FOOTNOTE = "Shading changes the ramp, never the figures. Ranking always uses the threat score.";

export type Stage = {
  id: string;
  number: string;
  label: string;
  dot: string;
  metricLines: string[];
  value: string;
  valueTone: Tone;
};

/** 01–10 · the "REVENUE AT EACH STAGE" rail. */
export const STAGES: Stage[] = [
  { id: "acquire", number: "01", label: "Acquire", dot: "#788831", metricLines: ["894k / yr"], value: "₦74M", valueTone: "rose" },
  { id: "activate", number: "02", label: "Activate", dot: "#7757AC", metricLines: ["41% reach", "value"], value: "₦188M", valueTone: "rose" },
  { id: "price", number: "03", label: "Price", dot: "#5E67C0", metricLines: ["6 plans"], value: "₦46M", valueTone: "rose" },
  { id: "adopt", number: "04", label: "Adopt", dot: "#785BA1", metricLines: ["2.1 of 9", "features"], value: "₦112M", valueTone: "rose" },
  { id: "retain", number: "05", label: "Retain", dot: "#798933", metricLines: ["1.1M active"], value: "₦412M", valueTone: "rose" },
  { id: "expand", number: "06", label: "Expand", dot: "#BB5390", metricLines: ["18% eligible"], value: "₦96M", valueTone: "rose" },
  { id: "support", number: "07", label: "Support", dot: "#CC6626", metricLines: ["42k contacts"], value: "₦31M", valueTone: "rose" },
  { id: "renew", number: "08", label: "Renew", dot: "#1D947F", metricLines: ["61k renewals"], value: "₦88M", valueTone: "rose" },
  { id: "advocate", number: "09", label: "Advocate", dot: "#7A8934", metricLines: ["124k", "referrers"], value: "₦124M", valueTone: "teal" },
  { id: "churn", number: "10", label: "Churn", dot: "#98A0AE", metricLines: ["602k lost"], value: "₦602M", valueTone: "rose" },
];

// Source copy used an em dash ("Advocacy feeds acquisition — 124,000 referrers…"); split into a
// title + body pair instead of carrying that punctuation into user-facing copy.
export const ADVOCACY_NOTE_TITLE = "Advocacy feeds acquisition";
export const ADVOCACY_NOTE_BODY =
  "124,000 referrers brought 31% of last quarter's new customers at a CAC of ₦0.";

/** Only Adopt has authored drilldown copy (customers/median features/slipped-out + the rows it spans). */
export const ADOPT_STAGE_DETAIL = {
  stageId: "adopt",
  owner: "Product owns this stage",
  customersInStage: "640,100",
  medianFeaturesReached: "2.1 of 9",
  slippedOutLastQuarter: "74,300",
  spans: ["active", "slipping"] as const,
  spansNote: "Adopt spans Active and Slipping in the matrix below — highlighted there now.",
};

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

export type MatrixCell =
  | { kind: "value"; value: string; heat: 1 | 2 | 3 }
  | { kind: "gap"; missingSource: string; explanation: string; wouldUnlock: string };

export type MatrixRow = {
  key: string;
  label: string;
  cells: Record<MatrixColumnKey, MatrixCell>;
};

const STRIPE_UNLOCK = "Connecting Stripe billing events fills this cell and one other.";

export const MATRIX_ROWS: MatrixRow[] = [
  {
    key: "new",
    label: "New",
    cells: {
      repeatDecay: { kind: "value", value: "₦41M", heat: 1 },
      involuntaryChurn: { kind: "value", value: "₦12M", heat: 1 },
      abandonment: { kind: "value", value: "₦88M", heat: 3 },
      refunds: { kind: "value", value: "₦6M", heat: 1 },
      discountDependency: { kind: "value", value: "₦18M", heat: 1 },
    },
  },
  {
    key: "active",
    label: "Active",
    cells: {
      repeatDecay: { kind: "value", value: "₦96M", heat: 2 },
      involuntaryChurn: { kind: "value", value: "₦61M", heat: 2 },
      abandonment: { kind: "value", value: "₦124M", heat: 3 },
      refunds: { kind: "value", value: "₦22M", heat: 1 },
      discountDependency: { kind: "value", value: "₦46M", heat: 2 },
    },
  },
  {
    key: "slipping",
    label: "Slipping",
    cells: {
      repeatDecay: { kind: "value", value: "₦412M", heat: 3 },
      involuntaryChurn: { kind: "value", value: "₦27M", heat: 1 },
      abandonment: { kind: "value", value: "₦34M", heat: 1 },
      refunds: { kind: "value", value: "₦9M", heat: 1 },
      discountDependency: { kind: "value", value: "₦31M", heat: 1 },
    },
  },
  {
    key: "lapsed",
    label: "Lapsed",
    cells: {
      repeatDecay: { kind: "value", value: "₦188M", heat: 3 },
      involuntaryChurn: {
        kind: "gap",
        missingSource: "no dunning feed",
        explanation:
          "No dunning feed is connected, so Flolyt cannot see which lapsed customers left and which had a card fail.",
        wouldUnlock: STRIPE_UNLOCK,
      },
      abandonment: { kind: "value", value: "₦11M", heat: 1 },
      refunds: { kind: "value", value: "₦4M", heat: 1 },
      discountDependency: { kind: "value", value: "₦52M", heat: 2 },
    },
  },
  {
    key: "reactivated",
    label: "Reactivated",
    cells: {
      repeatDecay: { kind: "value", value: "₦34M", heat: 1 },
      involuntaryChurn: { kind: "value", value: "₦8M", heat: 1 },
      abandonment: { kind: "value", value: "₦14M", heat: 1 },
      refunds: {
        kind: "gap",
        missingSource: "no dunning feed",
        explanation:
          "No dunning feed is connected, so Flolyt cannot see which reactivated customers were refunded and which simply churned again.",
        wouldUnlock: STRIPE_UNLOCK,
      },
      discountDependency: { kind: "value", value: "₦74M", heat: 2 },
    },
  },
];

/** The one authored worked example — every other cell only carries what the matrix itself already shows. */
export const FEATURED_CELL = {
  rowKey: "slipping",
  columnKey: "repeatDecay" as MatrixColumnKey,
  atRiskWindow: "at risk · 90 days",
  customersInCell: "18,402",
  secondOrderRateFrom: "38%",
  secondOrderRateTo: "27%",
  since: "4 March",
  room: { id: "second-order-never-happened", label: "Room 2471 is open on this cell" },
};

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

export const HOW_ITS_CALCULATED =
  "Each cell totals the product and billing events tied to customers in that state who moved through that leak category in the selected window. A dashed cell means no connected source can measure that combination yet. Connecting one fills it in; it is never estimated.";
