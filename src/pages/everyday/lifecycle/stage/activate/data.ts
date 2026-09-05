/**
 * Mock content for the Activate stage — screens AC01-AC13 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "AC06 · Activate · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { CheckedRow, ActionCard } from "@/pages/everyday/lifecycle/stage/detail/detail-drilldown";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Overview (AC02) --------------------------------------------------
// KPI row and leak table both wired to GET /lifecycle/stages/activate (buildStageKpis +
// departures[] in overview-tab.tsx) — see docs/endpoints/lifecycle.md.

export const ACTIVATE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Abandoned at the delivery-fee step",
  carriedIn: [
    { label: "Stage", value: "Activate" },
    { label: "Entered", value: "last 12 months" },
    { label: "Reached the fee step", value: "true" },
    { label: "Markets", value: "Nigeria, Kenya" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "308,000 customers · ₦124M at stake",
  countedNote: "Counted 6 minutes ago · causal since 4 March",
  participants: [
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "PR", kind: "agent" },
    { initials: "SS", kind: "agent" },
  ],
  participantsNote: "Product Reason leads · Zainab owns the stage, so she owns this",
};

export const ACTIVATE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Activate · overview · Nigeria",
  snapshotLabel: "Activate · overview · Nigeria · as of 13 Aug 08:12",
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
    "116,000 customers with no reading behind them travel with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Definition (AC01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the candidate-signal
// verdict table it used to render (reach/predictive/verdict columns), so it isn't reproducible
// from live data; dropped.

// ---- Time to value (AC03) and Paths (AC04) are wired to
// GET /lifecycle/activate/time-to-value and GET /lifecycle/activate/paths — see
// docs/endpoints/lifecycle.md. Neither endpoint has a cohort-by-month or per-route
// median-days/at-stake/verdict shape, so those mock rows were dropped rather than kept unused.

// ---- One-path drilldown (AC05) -------------------------------------------

export type InsightCard = {
  id: string;
  agentTag?: string;
  meta: string;
  title: string;
  body: string;
  footnote: string;
  tone: "teal" | "amber" | "rose";
};

export type PathDetail = {
  path: string;
  headline: string;
  kpis: Kpi[];
  eyebrow: string;
  checkedRows: CheckedRow[];
  causeTitle: string;
  causeBody: string;
  actionCards: ActionCard[];
};

export const ACTIVATE_PATH_DETAILS: Record<string, PathDetail> = {
  "guest-checkout": {
    path: "Guest checkout",
    headline: "186,000 customers · activates at 12.1% · 142,000 can never be contacted",
    kpis: [
      { eyebrow: "Customers", value: "186,000", note: "21% of first orders" },
      { eyebrow: "Activate", value: "12.1%", tone: "rose", note: "against 44.2% on app signup" },
      { eyebrow: "At stake", value: "₦74M", tone: "rose", note: "39% of this stage's leak" },
      { eyebrow: "Median time to value", value: "11.4 days", tone: "rose", note: "when it happens at all" },
    ],
    eyebrow: "What a guest customer does not have",
    checkedRows: [
      { id: "no-push", question: "No push token", finding: "Cannot be told their order is out for delivery, or that anything is back in stock", extra: "186,000", extraTone: "ink", verdict: "only with an account", verdictTone: "rose" },
      { id: "no-saved-address", question: "No saved address", finding: "Re-enters it every time · median 94 seconds on mobile", extra: "186,000", extraTone: "ink", verdict: "only with an account", verdictTone: "rose" },
      { id: "no-order-history", question: "No order history", finding: "Cannot reorder in one tap, which is the single strongest repeat driver", extra: "186,000", extraTone: "ink", verdict: "only with an account", verdictTone: "rose" },
      { id: "no-email-consent", question: "No email or consent", finding: "Cannot be included in any reactivation wave, ever", extra: "142,000", extraTone: "ink", verdict: "never", verdictTone: "rose" },
      { id: "phone-number", question: "A phone number", finding: "44,000 gave one · these can be contacted and activate at 24%", extra: "44,000", extraTone: "teal", verdict: "yes", verdictTone: "teal" },
    ],
    causeTitle: "142,000 of these customers cannot be contacted by anyone, for any reason, forever",
    causeBody:
      "No email, no consent, no push. They are inside the 148,000 in the Retain reactivation room and they will be silently dropped from it at send time. This is the clearest example in the product of a leak that cannot be fixed downstream — only upstream, at the moment the account is offered.",
    actionCards: [
      {
        id: "behave-differently",
        eyebrow: "They behave differently",
        tone: "teal",
        title: "24% activate, against 8% for the rest",
        body: "A guest who volunteers a phone number is a guest who intends to come back. Three times the activation rate of guests who did not, on an otherwise identical journey.",
        footnote: "a free signal, already collected",
      },
      {
        id: "reachable",
        eyebrow: "They are reachable",
        tone: "amber",
        title: "SMS consent covers order updates only",
        body: "Transactional consent, not marketing. They can be told their order is late. They cannot be sent a reactivation wave without asking first.",
        footnote: "one consent ask away",
      },
      {
        id: "nobody-asking",
        eyebrow: "Nobody is asking",
        tone: "rose",
        title: "No room, no play, no owner",
        body: "44,000 customers who signalled intent, are reachable, and have never been asked for marketing consent. Worth roughly ₦18M and currently nobody's job.",
        footnote: "₦18M · open a room",
      },
    ],
  },
};

export const ACTIVATE_PATH_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Guest checkout never becomes an account",
  carriedIn: [
    { label: "Stage", value: "Activate" },
    { label: "Path", value: "Guest checkout → no account" },
    { label: "Entered", value: "last 12 months" },
    { label: "Still no account", value: "true" },
    { label: "Markets", value: "all four" },
  ],
  countedSummary: "186,000 customers · ₦74M at stake",
  countedNote: "142,000 of these cannot be contacted at all — no email, no consent",
  participants: [
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "PR", kind: "agent" },
    { initials: "AQ", kind: "agent" },
    { initials: "MO", kind: "agent" },
  ],
  participantsNote: "Product Reason leads · Acquisition Quality joins, the cause is upstream",
};

// ---- Cohorts (AC06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (AC07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (AC08) -------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Release impact drilldown (AC09) --------------------------------------

export type StageImpactRow = {
  id: string;
  stage: string;
  symptom: string;
  effect: string;
  effectTone: "rose" | "amber";
  value: string;
  valueTone: "rose" | "amber";
  department: string;
  departmentColor: string;
  whatTheyCalledIt: string;
};

export type ReleaseImpactDetail = {
  title: string;
  subtitle: string;
  kpis: Kpi[];
  windowEyebrow: string;
  windowRows: { label: string; value: string; percent: number; tone: BarTone }[];
  controlTitle: string;
  controlBody: string;
  impactEyebrow: string;
  impactRows: StageImpactRow[];
  summaryTitle: string;
  summaryBody: string;
};

export const ACTIVATE_RELEASE_IMPACT: Record<string, ReleaseImpactDetail> = {
  "delivery-fee-checkout": {
    title: "Delivery fee at checkout",
    subtitle: "Shipped 4 March by Engineering · measured against two held-back markets",
    kpis: [
      { eyebrow: "Shipped", value: "4 March", note: "Engineering · release 2024.3.11" },
      { eyebrow: "Customers after", value: "308,000", note: "reached the fee step" },
      { eyebrow: "Activation effect", value: "−7.4 pts", tone: "rose", note: "against a held-back market" },
      { eyebrow: "Attributed value", value: "₦124M", tone: "rose", note: "in this stage only" },
    ],
    windowEyebrow: "Fourteen days before, fourteen days after, and the markets that did not get it",
    windowRows: [
      { label: "14 days before · all markets", value: "51.9% activated", percent: 52, tone: "teal" },
      { label: "14 days after · Nigeria and Kenya", value: "44.5%", percent: 45, tone: "rose" },
      { label: "14 days after · UK and Ghana · fee not shipped", value: "51.6%", percent: 52, tone: "teal" },
      { label: "Today · Nigeria", value: "39.5%", percent: 40, tone: "rose" },
      { label: "Today · UK", value: "45.1%", percent: 45, tone: "amber" },
    ],
    controlTitle: "The comparison group is what makes this causal rather than coincidental",
    controlBody:
      "The fee did not ship in the UK or Ghana until June. Those markets held flat across exactly the fourteen days in which Nigeria and Kenya dropped 7.4 points. Without that held-back group this would be a strong correlation in a busy quarter and nothing more.",
    impactEyebrow: "What this release did across every stage it touched",
    impactRows: [
      { id: "activate", stage: "Activate", symptom: "Abandonment at the fee step rose 3.1×", effect: "−7.4 pts", effectTone: "rose", value: "₦124M", valueTone: "rose", department: "Product", departmentColor: "#7A5AA8", whatTheyCalledIt: "seasonality" },
      { id: "retain", stage: "Retain", symptom: "Second-order rate fell", effect: "−11.0 pts", effectTone: "rose", value: "₦412M", valueTone: "rose", department: "Marketing", departmentColor: "#79883A", whatTheyCalledIt: "a weak campaign" },
      { id: "support", stage: "Support", symptom: "“Where is my order” became top driver", effect: "+41%", effectTone: "rose", value: "₦9M", valueTone: "amber", department: "Support", departmentColor: "#C56A2E", whatTheyCalledIt: "a delivery issue" },
      { id: "renew", stage: "Renew", symptom: "Subscription pauses rose", effect: "+22%", effectTone: "rose", value: "₦88M", valueTone: "rose", department: "Customer Success", departmentColor: "#2E8B7F", whatTheyCalledIt: "no cause found" },
      { id: "advocate", stage: "Advocate", symptom: "Referral rate fell first time in 2 years", effect: "−9%", effectTone: "rose", value: "₦0 CAC lost", valueTone: "amber", department: "Marketing", departmentColor: "#79883A", whatTheyCalledIt: "unexplained" },
    ],
    summaryTitle: "One release, ₦633M, twenty weeks, five teams, five different names for it",
    summaryBody:
      "Nothing on this table is double counted — each figure is the effect measured inside that stage. The release passed every test it had, shipped clean, and nobody was watching revenue for fourteen days afterwards. That obligation now exists, and it is the one Engineering has still not accepted.",
  },
};

// ---- Agents (AC10) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const ACTIVATE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Activation rate falls", note: "activated ÷ entered this stage" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "market, path", note: "so “guest checkout only” is findable, not averaged away" },
  routesTo: { name: "The Activate stage owner · Zainab Yusuf" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 4 March, when the delivery fee shipped — ₦124M, still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (AC11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (AC12) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
