/**
 * Mock content for the Acquire stage — screens A01-A16 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "A06 · Acquire · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";

// ---- Overview (A02) --------------------------------------------------
// The KPI row is wired live (see overview-tab.tsx's buildAcquireKpis) — no mock export here
// anymore, per feedback_no_hardcoded_fallback.

export const ACQUIRE_OVERVIEW_BAR_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Acquired · last year", value: "682,000 · 38.1% reached a second order", percent: 68, tone: "teal" },
  { label: "Acquired · this year", value: "894,000 · 27.2% reached a second order", percent: 89, tone: "rose" },
  { label: "Second orders · last year", value: "260,000", percent: 26, tone: "teal" },
  { label: "Second orders · this year", value: "243,000", percent: 24, tone: "rose" },
];

// The leak table (all 10 stages, shared) is wired to GET /lifecycle/stages/{stageKey}'s
// `departures[]` — see overview-tab.tsx. No per-stage mock row list here anymore.

// ---- Funnel (A03) ------------------------------------------------------
// Steps are wired live (see funnel-tab.tsx, GET /lifecycle/acquire/funnel) — no mock export
// here anymore. Only the action cards below stay mock; the endpoint has no field for them.

export type FunnelActionCard = {
  id: string;
  tone: "rose" | "neutral";
  agentTag?: string;
  meta: string;
  title: string;
  body: string;
  footnote: string;
  footnoteTone: "rose" | "neutral";
};

export const ACQUIRE_FUNNEL_ACTION_CARDS: FunnelActionCard[] = [
  {
    id: "phone-number-step",
    tone: "rose",
    agentTag: "AQ",
    meta: "₦31M · 412,000 customers",
    title: "The phone-number step",
    body: "412,000 create an account and never verify. 118,000 of those never receive the SMS at all — the delivery rate to MTN Nigeria is 71% against 96% on every other carrier.",
    footnote: "carrier problem, not a design problem",
    footnoteTone: "rose",
  },
  {
    id: "delivery-fee-step",
    tone: "rose",
    agentTag: "AQ",
    meta: "₦24M · 67,000 customers",
    title: "The delivery-fee step",
    body: "The same 4 March change that broke Retain also sits here, at first order. It has been counted in the Retain room and is not double counted in the ₦74M above.",
    footnote: "already in room 8f2c",
    footnoteTone: "rose",
  },
  {
    id: "never-start",
    tone: "neutral",
    meta: "NOT WORTH ACTING ON",
    title: "The 74.5% who never start",
    body: "Eight million visits produce two million signups and that is normal for this category. It is the largest number on the screen and the least interesting one.",
    footnote: "shown, deliberately unranked",
    footnoteTone: "neutral",
  },
];

// ---- Channels (A04) -----------------------------------------------------
// The channel list + spend breakdown are wired live (see channels-tab.tsx, GET
// /lifecycle/acquire/channels) — no mock export here anymore. ACQUIRE_CHANNEL_DETAILS below
// (the A05 one-channel drilldown) stays mock — no endpoint covers its narrative content at all.

export type ChannelDetail = {
  channel: string;
  headline: string;
  kpis: Kpi[];
  eyebrow: string;
  checkedRows: { id: string; question: string; finding: string; verdict: string; verdictTone: "teal" | "amber" | "rose" | "neutral" }[];
  causeTitle: string;
  causeBody: string;
  actionCards: {
    id: string;
    eyebrow: string;
    tone: "teal" | "amber" | "neutral";
    title: string;
    body: string;
    footnote: string;
  }[];
};

export const ACQUIRE_CHANNEL_DETAILS: Record<string, ChannelDetail> = {
  "paid-social-ghana": {
    channel: "Paid social · Ghana",
    headline: "31,200 acquired · ₦188M spent · 4.1% ever place a second order",
    kpis: [
      { eyebrow: "Acquired", value: "31,200", note: "in five months" },
      { eyebrow: "Spend", value: "₦188M", tone: "rose", note: "GHS 12.4M" },
      { eyebrow: "CAC", value: "₦6,026", tone: "rose", note: "3.3× blended" },
      { eyebrow: "Reach a second order", value: "4.1%", tone: "rose", note: "against 27.2% blended" },
    ],
    eyebrow: "Every other channel converts between 24% and 41%. This one converts at 4%.",
    checkedRows: [
      { id: "real-people", question: "Are they real people?", finding: "Yes. 94% verify a phone number, in line with every other channel.", verdict: "ruled out", verdictTone: "teal" },
      { id: "product-available", question: "Is the product available to them?", finding: "Yes. All 31,200 are in Accra, which is fully served.", verdict: "ruled out", verdictTone: "teal" },
      { id: "different-price", question: "Do they see a different price?", finding: "Yes. GHS pricing is 22% higher than the naira equivalent.", verdict: "contributing", verdictTone: "amber" },
      { id: "creative-promise", question: "What does the creative promise?", finding: "Free delivery. Ghana has never had free delivery.", verdict: "the cause", verdictTone: "rose" },
      { id: "delivery-slower", question: "Is delivery slower there?", finding: "Unavailable — no delivery feed for Ghana.", verdict: "unknown", verdictTone: "neutral" },
    ],
    causeTitle: "The creative promises something the product does not do",
    causeBody:
      "31,200 people signed up for free delivery in a market that has never offered it. They verify, they open the app, they see a delivery fee, and 96% of them never order. The campaign was measured on signups and hit its target every single week for five months.",
    actionCards: [
      {
        id: "stop-it",
        eyebrow: "Stop it",
        tone: "teal",
        title: "Saves ₦37M a month",
        body: "Immediate, reversible, and needs Ravi because it changes committed spend. The 31,200 already acquired stay acquired and stay in every cohort.",
        footnote: "Ravi Mehta · needs approval",
      },
      {
        id: "fix-the-creative",
        eyebrow: "Fix the creative",
        tone: "amber",
        title: "Test against a holdout",
        body: "Run honest pricing creative to half the audience for three weeks. Costs ₦18M to learn whether the channel works at all when it tells the truth.",
        footnote: "Marketing Ghana · no owner yet",
      },
      {
        id: "do-neither",
        eyebrow: "Do neither, knowingly",
        tone: "neutral",
        title: "A defensible answer",
        body: "Ghana is a land-grab market and 31,200 accounts may be worth ₦188M for reasons that are not in the orders feed. If that is the call, it should be a call — recorded here, not a default.",
        footnote: "record the decision",
      },
    ],
  },
};

// ---- Cohorts (A06) is wired to GET /lifecycle/stages/{stageKey}/cohorts (shared across all 10
// stages) — see cohorts-tab.tsx and docs/endpoints/lifecycle.md. That endpoint returns one
// generic age-aligned shape (entered/stillInStageShare/values), not the per-stage CAC/day30-90
// or repeat-rate/ARPU-style columns every stage's old bespoke mock had.

// ---- Unit economics (A07) ------------------------------------------------

export const ACQUIRE_UNIT_ECON_KPIS: Kpi[] = [
  { eyebrow: "Blended CAC", value: "₦1,840", note: "was ₦1,410" },
  { eyebrow: "Revenue per customer · 12mo", value: "₦7,100", tone: "rose", note: "was ₦9,200" },
  { eyebrow: "Payback", value: "Unavailable", tone: "amber", note: "needs contribution margin" },
  { eyebrow: "Ratio", value: "3.9×", note: "on revenue, not margin" },
];

export type UnitEconRow = {
  id: string;
  channel: string;
  cac: string;
  cacTone: "teal" | "amber" | "rose";
  revenuePerCustomer: string;
  ratio: string;
  ratioTone: "teal" | "amber" | "rose";
};

export const ACQUIRE_UNIT_ECON_ROWS: UnitEconRow[] = [
  { id: "referral", channel: "Referral", cac: "₦0", cacTone: "teal", revenuePerCustomer: "₦11,400", ratio: "∞", ratioTone: "teal" },
  { id: "partner-fuel-stations", channel: "Partner · fuel stations", cac: "₦649", cacTone: "teal", revenuePerCustomer: "₦8,100", ratio: "12.5×", ratioTone: "teal" },
  { id: "paid-search", channel: "Paid search", cac: "₦1,213", cacTone: "teal", revenuePerCustomer: "₦7,800", ratio: "6.4×", ratioTone: "teal" },
  { id: "paid-social-nigeria", channel: "Paid social · Nigeria", cac: "₦1,925", cacTone: "amber", revenuePerCustomer: "₦6,900", ratio: "3.6×", ratioTone: "amber" },
  { id: "paid-social-ghana", channel: "Paid social · Ghana", cac: "₦6,026", cacTone: "rose", revenuePerCustomer: "₦1,140", ratio: "0.19×", ratioTone: "rose" },
];

export const ACQUIRE_UNIT_ECON_UNLOCK_ROWS: { label: string; value: string; tone: "teal" | "amber" | "neutral" }[] = [
  { label: "This screen", value: "true payback per channel, and margin-based ratios", tone: "teal" },
  { label: "Price stage", value: "a margin baseline, which currently blocks one company goal", tone: "amber" },
  { label: "Goals", value: "the contribution-margin goal, currently unsettable", tone: "amber" },
  { label: "Value ledger", value: "recovered margin rather than recovered revenue", tone: "neutral" },
  { label: "Estimated effort", value: "one CSV export a month would be enough to start", tone: "teal" },
];

// ---- Markets (A08) --------------------------------------------------------

// ---- Markets (A08) is wired to GET /lifecycle/stages/{stageKey}/markets (shared across all 10
// stages) — see markets-tab.tsx and docs/endpoints/lifecycle.md. That endpoint only ever returns
// population/atStake/primaryConversion per market — the per-market spend/CAC/reach-a-second-order
// columns and narrative spotlight cards every stage's old mock had are dropped, no field backs
// them.

// ---- What changed (A09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore, same for every other stage's *_CHANGE_ROWS.

// ---- Agents (A10) is wired to GET /lifecycle/stages/{stageKey}/agents (shared across all 10
// stages) — see agents-tab.tsx and docs/endpoints/lifecycle.md. The agent cards and conditions
// table now read the endpoint's own `agents[]`/`conditions[]`; "Currently" and "who it goes to"
// are dropped since neither is a confirmed field on the (spec-marked-truncated) condition object.

// ---- History (A14) is wired to GET /lifecycle/stages/{stageKey}/history (shared across all 10
// stages) — see history-tab.tsx and docs/endpoints/lifecycle.md. The "goals that depend on this
// stage" table is dropped (goalDependencies is permanently null on that endpoint); the "what has
// already been tried" table now reads its `attempts[]`, which uses a fixed 6-value
// learningState vocabulary (validated/observation/constraint/superseded/rejected/room-open), not
// the ~20 freeform labels these mocks used.

// ---- Compare periods (A16) is wired to GET /lifecycle/stages/{stageKey}/compare (shared across
// all 10 stages) — see compare-route.tsx and docs/endpoints/lifecycle.md. That endpoint only ever
// compares population and conversion, never CAC/repeat-rate/value-per-customer, so the fuller
// mock table (and Acquire's "how this comparison is built" notes) is dropped rather than faked.

// ---- Shared modal presets (A11/A12/A13/A15) ---------------------------------

import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { MapAFieldPreset } from "@/pages/everyday/lifecycle/stage/modals/map-a-field-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

export const ACQUIRE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Verification rate falls", note: "identity.verified ÷ identity.created" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "3 days", note: "one bad day is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "carrier, market", note: "so “MTN Nigeria only” is findable, not averaged away" },
  routesTo: {
    name: "The Acquire stage owner · Tunde Bakare",
    note: "This rule previously routed to “verification owner”, which nobody holds",
  },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 2 April, when the MTN route changed — ₦9M, still open and unowned. Once on 14 November last year, which resolved itself in two days. A threshold that would have fired forty times is a threshold that will be ignored.",
  },
};

export const ACQUIRE_MAP_FIELD_PRESET: MapAFieldPreset = {
  needTitle: "Cost of goods, per order",
  needNote: "Unlocks payback here, a margin baseline in Price, and one blocked goal",
  candidates: [
    { id: "order-lines-unit-cost", field: "order_lines.unit_cost", source: "orders feed · 94% · numeric, per line, currency-tagged" },
    { id: "order-total-cost", field: "order.total_cost", source: "orders feed · 41% · populated on 12% of rows" },
    { id: "monthly-cogs", field: "monthly_cogs", source: "finance CSV · monthly total only · not per order" },
  ],
  noneOption: "None of these — I will connect a source instead",
  warningTitle: "Nothing is backfilled without you seeing it first",
  warningBody:
    "Mapping this recomputes payback for every cohort and every channel from 12 January onward. The preview shows the four figures that change and by how much before anything is written.",
};

export const ACQUIRE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Signed up but never verified",
  carriedIn: [
    { label: "Stage", value: "Acquire" },
    { label: "Entered", value: "last 12 months" },
    { label: "Never verified", value: "true" },
    { label: "Markets", value: "Nigeria only" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "412,000 customers · ₦31M at stake",
  countedNote: "Counted 6 minutes ago · 118,000 of these never received the SMS",
  participants: [
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "AQ", kind: "agent" },
    { initials: "MO", kind: "agent" },
  ],
  participantsNote: "Acquisition Quality leads · Tunde owns the stage, so he owns this",
};

export const ACQUIRE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Acquire · overview · Nigeria",
  snapshotLabel: "Acquire · overview · Nigeria · as of 13 Aug 08:12",
  shareOptions: [
    { id: "workspace", title: "Anyone at Lagos Foods with lifecycle access", note: "412 people · the default" },
    { id: "link", title: "This link, for anyone who has it", note: "expires in 7 days · no customer-level data ever travels" },
    { id: "snapshot", title: "A dated snapshot instead", note: "frozen at today's figures · for a board pack" },
  ],
  exportFormats: [
    { id: "csv", label: "CSV", note: "the tables" },
    { id: "pdf", label: "PDF", note: "board-ready" },
    { id: "png", label: "PNG", note: "one chart" },
  ],
  caveatTitle: "Every export carries its own asterisks",
  caveatBody:
    "Payback is unavailable and June's 90-day figure is blank. Both travel with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};
