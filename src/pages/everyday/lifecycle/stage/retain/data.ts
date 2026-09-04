/**
 * Mock content for the Retain stage — screens RT01-RT13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "RT07 · Retain · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { DefinitionCandidate } from "@/pages/everyday/lifecycle/stage/definition/definition-route";
import type { LeakRow, AgentCard, ThresholdRow, CompareRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (RT01) -----------------------------------------------

export type RetainWindowRow = {
  id: string;
  window: string;
  stillReachable: string;
  stillReachableTone: "teal" | "amber";
  reactivationResponse: string;
  reactivationResponseTone: "teal" | "amber" | "rose";
  costPerRecovery: string;
  costPerRecoveryTone: "teal" | "amber" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export type RetainDefinitionData = {
  title: string;
  subtitle: string;
  insightTitle: string;
  insightBody: string;
  candidatesEyebrow: string;
  candidates: DefinitionCandidate[];
  windowEyebrow: string;
  windowRows: RetainWindowRow[];
  closingTitle: string;
  closingBody: string;
};

export const RETAIN_DEFINITION: RetainDefinitionData = {
  title: "What counts as retained",
  subtitle: "Retain · owned by Marketing · last changed 12 January by Ifeoma Nwosu",
  insightTitle: "Retention here is one specific event, not a state of mind",
  insightBody:
    "A customer is retained when they place a second order. Not when they open the app, not when they stay subscribed, not when they say they are satisfied. This is the strictest definition in the lifecycle and it is the one every other stage is ultimately judged against.",
  candidatesEyebrow: "A customer is retained when",
  candidates: [
    {
      id: "opens-app-again",
      label: "They open the app again",
      description: "Measures curiosity. 71% of these people never order again.",
      field: "session · 2.14M",
    },
    {
      id: "second-order-ever",
      label: "They place a second order, ever",
      description: "No window. A second order after eleven months counts the same as one after a week.",
      field: "orders · 1.19M",
    },
    {
      id: "second-order-90-days",
      label: "They place a second order within 90 days",
      description: "The window where reactivation still works. After it, almost nothing does.",
      field: "orders · 1.02M · 27.2% of acquired",
      selected: true,
    },
  ],
  windowEyebrow: "Why ninety days, and not sixty or a hundred and twenty",
  windowRows: [
    { id: "0-30", window: "0–30", stillReachable: "100%", stillReachableTone: "teal", reactivationResponse: "31.4%", reactivationResponseTone: "teal", costPerRecovery: "₦140", costPerRecoveryTone: "teal", verdict: "cheap", verdictTone: "teal" },
    { id: "31-60", window: "31–60", stillReachable: "98%", stillReachableTone: "teal", reactivationResponse: "22.1%", reactivationResponseTone: "teal", costPerRecovery: "₦210", costPerRecoveryTone: "teal", verdict: "cheap", verdictTone: "teal" },
    { id: "61-90", window: "61–90", stillReachable: "94%", stillReachableTone: "teal", reactivationResponse: "16.1%", reactivationResponseTone: "amber", costPerRecovery: "₦380", costPerRecoveryTone: "amber", verdict: "the last useful window", verdictTone: "amber" },
    { id: "91-120", window: "91–120", stillReachable: "89%", stillReachableTone: "amber", reactivationResponse: "4.2%", reactivationResponseTone: "rose", costPerRecovery: "₦1,940", costPerRecoveryTone: "rose", verdict: "collapses", verdictTone: "rose" },
    { id: "121-plus", window: "121+", stillReachable: "81%", stillReachableTone: "amber", reactivationResponse: "1.1%", reactivationResponseTone: "rose", costPerRecovery: "₦8,100", costPerRecoveryTone: "rose", verdict: "not worth sending", verdictTone: "rose" },
  ],
  closingTitle: "The window is where the cliff is, not where the quarter ends",
  closingBody:
    "Response falls from 16.1% to 4.2% between day 90 and day 91-plus. That is not a gradual decay, it is a cliff — and it is the single most consequential number in this stage, because it turns “we should get to that” into “about 4,100 customers become unreachable every day”.",
};

// ---- Overview (RT02) ---------------------------------------------------

export const RETAIN_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Acquired · 12 months", value: "894,000", note: "enter this stage" },
  { eyebrow: "Placed a second order in 90 days", value: "243,000", tone: "rose", note: "27.2% · was 38.1%" },
  { eyebrow: "At stake", value: "₦412M", tone: "rose", note: "the largest leak in the lifecycle" },
  { eyebrow: "Ageing out", value: "≈4,100 / day", tone: "rose", note: "past 90 days, unreachable" },
];

export const RETAIN_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "acquired-mar-may",
    where: "Acquired Mar–May · the fee cohort",
    customers: "148,000",
    value: "₦412M",
    valueTone: "rose",
    trend: "94%",
    trendTone: "teal",
    causeKnown: { label: "causal · 4 Mar", tone: "ultra" },
    room: { label: "open · 8f2c", tone: "amber" },
    detailHref: "/lifecycle/retain/segments/acquired-mar-may",
  },
  {
    id: "guest-checkout",
    where: "Guest checkout · no contact details",
    customers: "142,000",
    value: "₦38M",
    valueTone: "rose",
    trend: "0%",
    trendTone: "rose",
    causeKnown: { label: "causal · Activate", tone: "ultra" },
    room: { label: "cannot act", tone: "rose" },
  },
  {
    id: "first-delivery-late-failed",
    where: "First delivery late or failed",
    customers: "71,000",
    value: "₦29M",
    valueTone: "rose",
    trend: "91%",
    trendTone: "teal",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "discount-only",
    where: "Discount-only · bought once at 20% off",
    customers: "94,000",
    value: "₦19M",
    valueTone: "amber",
    trend: "88%",
    trendTone: "teal",
    causeKnown: { label: "causal · Price", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "no-reading",
    where: "No reading",
    customers: "196,000",
    value: "₦31M",
    valueTone: "amber",
    trend: "87%",
    trendTone: "teal",
    causeKnown: { label: "nothing found", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
];

export const RETAIN_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Acquired Mar–May · the fee cohort",
  carriedIn: [
    { label: "Stage", value: "Retain" },
    { label: "Entered", value: "Mar–May" },
    { label: "Placed a second order", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "148,000 customers · ₦412M at stake",
  countedNote: "Counted 6 minutes ago · 94% still reachable inside the window",
  participants: [
    { initials: "IN", kind: "human", color: "#79883A" },
    { initials: "RD", kind: "agent" },
  ],
  participantsNote: "Repeat & Decay leads · Ifeoma owns the stage, so she owns this",
};

export const RETAIN_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Retain · overview · Nigeria",
  snapshotLabel: "Retain · overview · Nigeria · as of 13 Aug 08:12",
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
    "142,000 of these customers cannot be contacted by anybody, ever — that travels with the file rather than being dropped from it. An export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Repeat curve (RT03) -----------------------------------------------

export const RETAIN_CURVE_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Within 7 days", value: "71,000 · 29.2%", percent: 29, tone: "teal" },
  { label: "8–30 days", value: "94,000 · 38.7%", percent: 39, tone: "teal" },
  { label: "31–60 days", value: "51,000 · 21.0%", percent: 21, tone: "teal" },
  { label: "61–90 days", value: "27,000 · 11.1%", percent: 11, tone: "amber" },
  { label: "Never · 651,000 of those acquired", value: "72.8%", percent: 73, tone: "rose" },
];

export type RetainCurveCompareRow = {
  id: string;
  window: string;
  before: string;
  after: string;
  change: string;
  changeTone: "teal" | "rose" | "amber" | "neutral";
  meaning: string;
};

export const RETAIN_CURVE_COMPARE_ROWS: RetainCurveCompareRow[] = [
  { id: "within-7", window: "Within 7 days", before: "34.1%", after: "29.2%", change: "−4.9 pts", changeTone: "rose", meaning: "Fewer impulse repeats" },
  { id: "8-30", window: "8–30 days", before: "39.4%", after: "38.7%", change: "−0.7 pts", changeTone: "neutral", meaning: "Broadly unchanged" },
  { id: "31-60", window: "31–60 days", before: "18.1%", after: "21.0%", change: "+2.9 pts", changeTone: "amber", meaning: "Repeats are slower, not just fewer" },
  { id: "61-90", window: "61–90 days", before: "8.4%", after: "11.1%", change: "+2.7 pts", changeTone: "amber", meaning: "Same · the tail got heavier" },
  { id: "overall", window: "Overall repeat rate", before: "38.1%", after: "27.2%", change: "−10.9 pts", changeTone: "rose", meaning: "Fewer, and later" },
];

// ---- Segments (RT04) + one-segment drilldown (RT05) ---------------------

export type RetainSegmentRow = {
  id: string;
  segment: string;
  customers: string;
  repeatRate: string;
  repeatRateTone: "teal" | "rose";
  vsBase: string;
  vsBaseTone: "teal" | "rose";
  reachable: string;
  reachableTone: "teal" | "rose";
  atStake: string;
  atStakeTone: "rose" | "amber" | "neutral";
  verdict: string;
  verdictTone: ChipTone;
};

export const RETAIN_SEGMENT_ROWS: RetainSegmentRow[] = [
  { id: "first-delivery-on-time", segment: "First delivery on time", customers: "761,000", repeatRate: "29.1%", repeatRateTone: "teal", vsBase: "+1.9", vsBaseTone: "teal", reachable: "94%", reachableTone: "teal", atStake: "—", atStakeTone: "neutral", verdict: "the baseline", verdictTone: "teal" },
  { id: "first-delivery-late", segment: "First delivery late", customers: "62,000", repeatRate: "18.4%", repeatRateTone: "rose", vsBase: "−8.8", vsBaseTone: "rose", reachable: "91%", reachableTone: "teal", atStake: "₦24M", atStakeTone: "rose", verdict: "fixable", verdictTone: "amber" },
  { id: "first-delivery-failed", segment: "First delivery failed", customers: "9,000", repeatRate: "0.4%", repeatRateTone: "rose", vsBase: "−26.8", vsBaseTone: "rose", reachable: "88%", reachableTone: "teal", atStake: "₦5M", atStakeTone: "amber", verdict: "near total loss", verdictTone: "rose" },
  { id: "used-2-plus-features", segment: "Used 2+ features", customers: "218,000", repeatRate: "61.1%", repeatRateTone: "teal", vsBase: "+33.9", vsBaseTone: "teal", reachable: "97%", reachableTone: "teal", atStake: "—", atStakeTone: "neutral", verdict: "best", verdictTone: "teal" },
  { id: "guest-checkout", segment: "Guest checkout", customers: "186,000", repeatRate: "8.4%", repeatRateTone: "rose", vsBase: "−18.8", vsBaseTone: "rose", reachable: "24%", reachableTone: "rose", atStake: "₦38M", atStakeTone: "rose", verdict: "mostly unreachable", verdictTone: "rose" },
  { id: "bought-20-percent-discount", segment: "Bought with a 20% discount", customers: "94,000", repeatRate: "11.1%", repeatRateTone: "rose", vsBase: "−16.1", vsBaseTone: "rose", reachable: "88%", reachableTone: "teal", atStake: "₦19M", atStakeTone: "amber", verdict: "bought the discount", verdictTone: "rose" },
  { id: "referred", segment: "Referred by another customer", customers: "278,000", repeatRate: "41.2%", repeatRateTone: "teal", vsBase: "+14.0", vsBaseTone: "teal", reachable: "96%", reachableTone: "teal", atStake: "—", atStakeTone: "neutral", verdict: "best channel", verdictTone: "teal" },
];

export type RetainOverlapRow = { label: string; value: string; tone: "amber" | "rose" | "muted" | "ink" };

export const RETAIN_OVERLAP_ROWS: RetainOverlapRow[] = [
  { label: "Guest checkout ∩ discounted", value: "31,000 customers · counted once, in guest", tone: "amber" },
  { label: "Late delivery ∩ guest checkout", value: "14,000 · counted once, in late delivery", tone: "amber" },
  { label: "Total at stake across segments", value: "₦86M · not ₦412M · these are subsets", tone: "muted" },
  { label: "The ₦412M figure", value: "the Mar–May cohort · overlaps all of the above", tone: "rose" },
  { label: "How Flolyt handles it", value: "each customer belongs to their most specific segment only", tone: "ink" },
];

export type RetainSegmentDetailRow = {
  id: string;
  subSegment: string;
  customers: string;
  reachable: string;
  reachableTone: "teal" | "rose";
  expectedResponse: string;
  expectedResponseTone: "teal" | "amber" | "neutral";
  recoverableValue: string;
  recoverableValueTone: "teal" | "amber" | "rose";
  inTheWave: string;
  inTheWaveTone: ChipTone;
};

export type RetainSegmentDetail = {
  title: string;
  headline: string;
  kpis: Kpi[];
  tableEyebrow: string;
  rows: RetainSegmentDetailRow[];
  closingTitle: string;
  closingBody: string;
  costEyebrow: string;
  costRows: { label: string; value: string; percent: number; tone: BarTone }[];
  finalTitle: string;
  finalBody: string;
};

export const RETAIN_SEGMENT_DETAILS: Record<string, RetainSegmentDetail> = {
  "acquired-mar-may": {
    title: "Acquired March to May",
    headline: "148,000 customers · 100,000 actually reachable · ₦2.1M a day of decay",
    kpis: [
      { eyebrow: "Customers", value: "148,000", note: "acquired 1 Mar – 31 May" },
      { eyebrow: "Placed a second order", value: "0", tone: "rose", note: "by definition" },
      { eyebrow: "At stake", value: "₦412M", tone: "rose", note: "over 90 days" },
      { eyebrow: "Ageing out", value: "4,100 / day", tone: "rose", note: "past the 90-day cliff" },
    ],
    tableEyebrow: "Who is actually in the 148,000",
    rows: [
      { id: "ordinary", subSegment: "Ordinary · fee is the only known cause", customers: "71,000", reachable: "98%", reachableTone: "teal", expectedResponse: "16.1%", expectedResponseTone: "teal", recoverableValue: "₦198M", recoverableValueTone: "teal", inTheWave: "yes", inTheWaveTone: "teal" },
      { id: "guest-checkout", subSegment: "Guest checkout · no contact details", customers: "42,000", reachable: "0%", reachableTone: "rose", expectedResponse: "—", expectedResponseTone: "neutral", recoverableValue: "₦0", recoverableValueTone: "rose", inTheWave: "dropped at send", inTheWaveTone: "rose" },
      { id: "late-or-failed-delivery", subSegment: "Late or failed first delivery", customers: "18,000", reachable: "91%", reachableTone: "teal", expectedResponse: "9.1%", expectedResponseTone: "amber", recoverableValue: "₦41M", recoverableValueTone: "amber", inTheWave: "yes · different message", inTheWaveTone: "amber" },
      { id: "bought-at-20-off", subSegment: "Bought at 20% off", customers: "11,000", reachable: "88%", reachableTone: "teal", expectedResponse: "11.1%", expectedResponseTone: "amber", recoverableValue: "₦19M", recoverableValueTone: "amber", inTheWave: "yes · no offer", inTheWaveTone: "amber" },
      { id: "already-in-thursday", subSegment: "Already in Thursday's win-back", customers: "6,000", reachable: "100%", reachableTone: "teal", expectedResponse: "—", expectedResponseTone: "neutral", recoverableValue: "—", recoverableValueTone: "amber", inTheWave: "excluded · cap", inTheWaveTone: "rose" },
    ],
    closingTitle: "The room says 148,000. The wave will reach 100,000.",
    closingBody:
      "42,000 have no contact details and 6,000 would breach the frequency cap. Neither number appears on the room header and both are known before anything sends. A play that says 148,000 and delivers to 100,000 is how a 16% response rate quietly becomes an 11% one in the review.",
    costEyebrow: "What the cost of waiting actually is",
    costRows: [
      { label: "Recoverable today · 100,000 reachable", value: "₦258M at 16.1% response", percent: 100, tone: "teal" },
      { label: "In 14 days · 57,400 age out", value: "₦110M", percent: 43, tone: "amber" },
      { label: "In 30 days · 100% past the cliff", value: "₦18M at 4.2% response", percent: 7, tone: "rose" },
    ],
    finalTitle: "₦2.1M a day, and it is not linear",
    finalBody:
      "About 4,100 customers cross the 90-day line daily and their response rate falls from 16.1% to 4.2% the moment they do. The approval has been waiting nineteen hours, which is roughly 3,300 customers and ₦8M already past saving.",
  },
};

// ---- Reactivation (RT06) + build an audience (RT13) ----------------------

export const RETAIN_REACTIVATION_KPIS: Kpi[] = [
  { eyebrow: "Reactivable today", value: "218,000", note: "inside the 90-day window" },
  { eyebrow: "Currently in a wave", value: "0", tone: "rose", note: "one is waiting on approval" },
  { eyebrow: "Sent in the last 90 days", value: "412,000", note: "across four campaigns" },
  { eyebrow: "Recovered", value: "9.4%", tone: "amber", note: "against a 12% target" },
];

export type RetainCampaignRow = {
  id: string;
  campaign: string;
  sent: string;
  window: string;
  windowTone: "teal" | "amber";
  offer: string;
  offerTone: "teal" | "amber" | "rose";
  recovered: string;
  recoveredTone: "teal" | "amber" | "rose";
  vsHoldout: string;
  vsHoldoutTone: "teal" | "amber";
  verdict: string;
  verdictTone: ChipTone;
};

export const RETAIN_CAMPAIGN_ROWS: RetainCampaignRow[] = [
  { id: "thursday-winback", campaign: "Thursday win-back · weekly", sent: "218,000", window: "60–90 days", windowTone: "amber", offer: "20% off", offerTone: "amber", recovered: "9.4%", recoveredTone: "amber", vsHoldout: "+4.1 pts", vsHoldoutTone: "teal", verdict: "works, aimed late", verdictTone: "amber" },
  { id: "ghana-reactivation", campaign: "Ghana reactivation", sent: "41,000", window: "30–90 days", windowTone: "teal", offer: "free delivery", offerTone: "rose", recovered: "2.1%", recoveredTone: "rose", vsHoldout: "no holdout", vsHoldoutTone: "amber", verdict: "promised what we do not do", verdictTone: "rose" },
  { id: "lagos-apology", campaign: "Lagos apology · failed delivery", sent: "9,000", window: "0–30 days", windowTone: "teal", offer: "refund + credit", offerTone: "teal", recovered: "31.4%", recoveredTone: "teal", vsHoldout: "+22 pts", vsHoldoutTone: "teal", verdict: "best result here", verdictTone: "teal" },
  { id: "kenya-scheduled-nudge", campaign: "Kenya scheduled-order nudge", sent: "144,000", window: "0–60 days", windowTone: "teal", offer: "none", offerTone: "teal", recovered: "18.1%", recoveredTone: "teal", vsHoldout: "+11 pts", vsHoldoutTone: "teal", verdict: "works with no offer", verdictTone: "teal" },
];

export type RetainReactivationCard = {
  id: string;
  agentTag: string;
  meta: string;
  title: string;
  body: string;
  footnote: string;
  tone: "teal" | "amber" | "ultra";
};

export const RETAIN_REACTIVATION_CARDS: RetainReactivationCard[] = [
  {
    id: "kenya-no-offer",
    agentTag: "RD",
    meta: "Kenya · 144,000 · no offer",
    title: "18.1% recovered with nothing off",
    body: "Twice the Thursday campaign's rate at a third of the cost, sent earlier and with no discount at all. The message was a reminder that scheduling exists, not a price.",
    footnote: "+11 points against a holdout",
    tone: "teal",
  },
  {
    id: "thursday-aimed-late",
    agentTag: "RD",
    meta: "Thursday · 218,000 · 20% off",
    title: "9.4%, and aimed at day 60–90",
    body: "It works — 4.1 points above holdout — but it fires in the window where response is already halving, and it teaches 218,000 customers a week to wait for a discount.",
    footnote: "the default campaign since 2024",
    tone: "amber",
  },
  {
    id: "no-offer-day-7-30",
    agentTag: "RD",
    meta: "What nobody has run",
    title: "No offer, day 7–30",
    body: "The window with the highest response and the message with the best economics have never been combined. Wave one of the pending play is exactly this test, which is why holding the discount matters.",
    footnote: "the pending approval",
    tone: "ultra",
  },
];

export type BuildAudienceCriteriaRow = { label: string; value: string };
export type BuildAudienceExclusionRow = { label: string; value: string; note?: string; final?: boolean };

export type BuildAudiencePreset = {
  subtitle: string;
  criteriaEyebrow: string;
  criteria: BuildAudienceCriteriaRow[];
  exclusionsEyebrow: string;
  matchedLabel: string;
  matchedValue: string;
  exclusions: BuildAudienceExclusionRow[];
  finalLabel: string;
  finalValue: string;
  summaryTitle: string;
  summaryBody: string;
  closingTitle: string;
  closingBody: string;
};

export const RETAIN_BUILD_AUDIENCE_PRESET: BuildAudiencePreset = {
  subtitle: "Exclusions are applied and shown before you build, not at send",
  criteriaEyebrow: "Who",
  criteria: [
    { label: "Acquired between", value: "1 Mar and 31 May" },
    { label: "Orders placed", value: "exactly 1" },
    { label: "Days since first order", value: "7 to 90 · inside the window" },
    { label: "Markets", value: "Nigeria" },
  ],
  exclusionsEyebrow: "Who drops out, and why · shown before you build",
  matchedLabel: "Matched the condition",
  matchedValue: "148,000",
  exclusions: [
    { label: "No contact details · guest checkout", value: "−42,000", note: "cannot be reached by anyone" },
    { label: "Frequency cap · Thursday win-back", value: "−6,000", note: "would be a second message in 48 hrs" },
    { label: "Opted out or erasure requested", value: "−2,400", note: "excluded permanently" },
  ],
  finalLabel: "Will actually receive it",
  finalValue: "100,000",
  summaryTitle: "100,000 reachable · ₦258M recoverable",
  summaryBody: "At 16.1% response · three waves of 33,000 · 10% held back",
  closingTitle: "The audience number is the reachable one, everywhere",
  closingBody:
    "The room header, the play, the approval and the result all say 100,000. Building an audience that quietly shrinks by a third between approval and send is how a campaign that worked gets reviewed as one that did not.",
};

// ---- Cohorts (RT07, stage-specific layout) -------------------------------

export type RetainCohortRow = {
  id: string;
  cohort: string;
  acquired: string;
  day30: string;
  day60: string;
  day90: string;
  day90Tone: "teal" | "rose" | "neutral";
  medianDays: string;
  medianDaysTone: "ink" | "rose";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const RETAIN_COHORT_ROWS: RetainCohortRow[] = [
  { id: "january", cohort: "January", acquired: "61,200", day30: "22.4%", day60: "33.8%", day90: "38.1%", day90Tone: "teal", medianDays: "14", medianDaysTone: "ink", vsFeb: "+0.7", vsFebTone: "teal" },
  { id: "february", cohort: "February", acquired: "64,900", day30: "21.9%", day60: "33.1%", day90: "37.4%", day90Tone: "teal", medianDays: "15", medianDaysTone: "ink", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", acquired: "82,100", day30: "14.1%", day60: "22.6%", day90: "27.2%", day90Tone: "rose", medianDays: "24", medianDaysTone: "rose", vsFeb: "−10.2", vsFebTone: "rose" },
  { id: "april", cohort: "April", acquired: "78,300", day30: "13.8%", day60: "22.1%", day90: "26.8%", day90Tone: "rose", medianDays: "25", medianDaysTone: "rose", vsFeb: "−10.6", vsFebTone: "rose" },
  { id: "may", cohort: "May", acquired: "77,600", day30: "13.9%", day60: "22.4%", day90: "27.1%", day90Tone: "rose", medianDays: "24", medianDaysTone: "rose", vsFeb: "−10.3", vsFebTone: "rose" },
  { id: "june", cohort: "June", acquired: "76,100", day30: "14.2%", day60: "22.9%", day90: "Unavailable", day90Tone: "neutral", medianDays: "Unavailable", medianDaysTone: "ink", vsFeb: "—", vsFebTone: "neutral" },
];

export const RETAIN_COHORT_FOOTNOTE = {
  title: "June has no 90-day figure and it is left blank",
  body: "The cohort is 61 days old. Filling it with a projection would put an estimate in the same column as five measurements, and the column would stop meaning one thing.",
};

export const RETAIN_COHORT_BREAK_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Jan–Feb · before 4 March", value: "37.8% average", percent: 38, tone: "teal" },
  { label: "Mar–May · after", value: "27.0% average", percent: 27, tone: "rose" },
  { label: "UK and Ghana · fee shipped in June", value: "37.6%", percent: 38, tone: "teal" },
  { label: "Kenya · fee shipped 9 June", value: "34.1% · falling since June", percent: 34, tone: "amber" },
];

export const RETAIN_COHORT_CLOSING = {
  title: "Kenya is the same story, one quarter behind, and it is still happening",
  body: "Kenya held at 37% until 9 June and has fallen 3 points since. It is the only market where this cause is currently in progress rather than historical — and Ghana ships the same release on 14 September with no room open about it.",
};

// ---- Markets (RT08, stage-specific layout) --------------------------------

export type RetainMarketRow = {
  id: string;
  market: string;
  acquired: string;
  repeatRate: string;
  repeatRateTone: "teal" | "amber" | "rose";
  medianDays: string;
  medianDaysTone: "teal" | "rose";
  reactivableNow: string;
  atStake: string;
  atStakeTone: "rose" | "amber" | "neutral";
  feeShipped: string;
  feeShippedTone: "teal" | "amber" | "rose";
  trend: string;
  trendTone: "rose" | "amber" | "teal" | "neutral";
};

export const RETAIN_MARKET_ROWS: RetainMarketRow[] = [
  { id: "nigeria", market: "Nigeria", acquired: "610,000", repeatRate: "26.1%", repeatRateTone: "rose", medianDays: "25", medianDaysTone: "rose", reactivableNow: "148,000", atStake: "₦412M", atStakeTone: "rose", feeShipped: "4 Mar", feeShippedTone: "rose", trend: "flat, low", trendTone: "rose" },
  { id: "kenya", market: "Kenya", acquired: "121,000", repeatRate: "34.1%", repeatRateTone: "amber", medianDays: "18", medianDaysTone: "teal", reactivableNow: "31,000", atStake: "KES 18.2M", atStakeTone: "rose", feeShipped: "9 Jun", feeShippedTone: "amber", trend: "falling", trendTone: "rose" },
  { id: "ghana", market: "Ghana", acquired: "94,000", repeatRate: "31.1%", repeatRateTone: "amber", medianDays: "21", medianDaysTone: "teal", reactivableNow: "24,000", atStake: "GHS 2.4M", atStakeTone: "amber", feeShipped: "14 Sep", feeShippedTone: "amber", trend: "flat", trendTone: "neutral" },
  { id: "uk", market: "United Kingdom", acquired: "69,000", repeatRate: "41.1%", repeatRateTone: "teal", medianDays: "12", medianDaysTone: "teal", reactivableNow: "9,000", atStake: "£31k", atStakeTone: "neutral", feeShipped: "not planned", feeShippedTone: "teal", trend: "improving", trendTone: "teal" },
];

export const RETAIN_MARKET_CLOSING = {
  title: "Ghana is the only market where this is still preventable",
  body: "The release ships there on 14 September — 31 days away. Nigeria lost ₦412M to it and Kenya is losing KES 18.2M now. Nothing is open about Ghana in this stage, and the one Ghana room in the workspace is about acquisition and has had no owner since 10 August.",
};

export const RETAIN_MARKET_PREVENT_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Ghana · if the fee ships at checkout as planned", value: "≈GHS 2.4M lost over two quarters", percent: 100, tone: "rose" },
  { label: "Ghana · if it ships at basket instead", value: "≈GHS 0.3M · the Nigeria fix, applied first", percent: 12, tone: "teal" },
  { label: "Cost of applying the fix now", value: "one release · already built and shipped in Nigeria", percent: 4, tone: "teal" },
];

// ---- What changed (RT09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (RT10) ----------------------------------------------------------

export const RETAIN_AGENT_CARDS: AgentCard[] = [
  {
    id: "repeat-and-decay",
    initials: "RD",
    status: "Lead agent · reading since 12 Jan",
    name: "Repeat & Decay",
    body: "Watches repeat rate, the second-order curve, segment drift and reactivation response. It opened room 8f2c and produced the causal finding that connected five stages.",
    footnote: "11 rooms · 7 closed",
    tone: "ultra",
  },
  {
    id: "acquisition-quality",
    initials: "AQ",
    status: "Supporting",
    name: "Acquisition Quality",
    body: "Joins because half of this stage's segments are decided upstream. It contributed the channel-mix component of the March break and disagreed with Repeat & Decay on the size of it.",
    footnote: "disagreement recorded, not resolved",
    tone: "ultra",
  },
  {
    id: "orchestrator",
    initials: "MO",
    status: "Arbitrating",
    name: "Orchestrator",
    body: "Present only because two agents disagreed. It raised the growth-versus-finance conflict in room 8f2c and did not pick a side — it named the trade and handed it to Ifeoma.",
    footnote: "raised 1 conflict, resolved 0",
    tone: "amber",
    footnoteTone: "amber",
  },
];

export const RETAIN_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "repeat-rate-falls", condition: "Repeat rate falls", threshold: "more than 2 pts, 7 days", currently: "−10.9", currentlyTone: "rose", status: "already-open", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
  { id: "cohort-breaks", condition: "A cohort breaks from the one before", threshold: "more than 5 pts", currently: "March −10.2", currentlyTone: "rose", status: "already-open", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
  { id: "ageing-past-window", condition: "Customers ageing past the window", threshold: "more than 2,000 / day", currently: "4,100 / day", currentlyTone: "rose", status: "already-open", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
  { id: "release-ships-lost-market", condition: "A release ships in a market that lost this before", threshold: "any", currently: "Ghana · 14 Sep", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "reactivation-response-falls", condition: "Reactivation response falls", threshold: "more than 3 pts", currently: "−2.7", currentlyTone: "amber", status: "no", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
];

export const RETAIN_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Repeat rate falls", note: "second orders ÷ acquired, 90-day window" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "market, cohort", note: "so a single market's drift is findable, not averaged away" },
  routesTo: { name: "The Retain stage owner · Ifeoma Nwosu" },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 4 March, when the delivery fee shipped — still open. Once on 9 June, when Kenya shipped the same change — still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (RT11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (RT12) -----------------------------------------------

export const RETAIN_COMPARE_ROWS: CompareRow[] = [
  { id: "90-day-repeat-rate", metric: "90-day repeat rate", before: "37.4%", after: "27.2%", change: "−10.2 pts", changeTone: "rose", whatMovedIt: "The fee (−7.1) and discount depth (−3.1)" },
  { id: "median-days-second-order", metric: "Median days to second order", before: "15", after: "24", change: "+60.0%", changeTone: "rose", whatMovedIt: "Hesitation · matches Activate's +2.7 days" },
  { id: "second-orders-placed", metric: "Second orders placed", before: "16,793/mo", after: "14,171/mo", change: "−15.6%", changeTone: "rose", whatMovedIt: "Rate fell faster than volume rose" },
  { id: "customers-entering", metric: "Customers entering the stage", before: "64,900/mo", after: "78,500/mo", change: "+21.0%", changeTone: "teal", whatMovedIt: "Acquisition spend up 31%" },
  { id: "revenue-per-customer", metric: "Revenue per customer", before: "₦4,180", after: "₦3,020", change: "−27.8%", changeTone: "rose", whatMovedIt: "Fewer second orders, same basket" },
  { id: "reactivable-population", metric: "Reactivable population", before: "94,000", after: "218,000", change: "+132%", changeTone: "rose", whatMovedIt: "More people to win back is not good news" },
];
