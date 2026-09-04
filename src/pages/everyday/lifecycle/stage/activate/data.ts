/**
 * Mock content for the Activate stage — screens AC01-AC13 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "AC06 · Activate · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { CheckedRow, ActionCard } from "@/pages/everyday/lifecycle/stage/detail/detail-drilldown";
import type { LeakRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { DefinitionData } from "@/pages/everyday/lifecycle/stage/definition/definition-route";

// ---- Overview (AC02) --------------------------------------------------

export const ACTIVATE_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Acquired · 12 months", value: "894,000", note: "enter this stage" },
  { eyebrow: "Reach value", value: "366,000", tone: "rose", note: "41.0% · was 52.1%" },
  { eyebrow: "At stake", value: "₦188M", tone: "rose", note: "second-largest leak in the lifecycle" },
  { eyebrow: "Median time to value", value: "6.1 days", tone: "rose", note: "was 3.4 days" },
];

export const ACTIVATE_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "abandoned-delivery-fee",
    where: "Abandoned at the delivery-fee step",
    customers: "308,000",
    value: "₦124M",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · 4 Mar", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "order-delivered-late-cold",
    where: "Order delivered late or cold",
    customers: "71,000",
    value: "₦29M",
    valueTone: "rose",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "delivered-never-returned",
    where: "Delivered fine, never returned",
    customers: "116,000",
    value: "₦31M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "no reading", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "first-order-failed",
    where: "First order failed entirely",
    customers: "33,000",
    value: "₦4M",
    valueTone: "amber",
    trend: "improving",
    trendTone: "teal",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "closed", tone: "teal" },
  },
];

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

// ---- Definition (AC01) -------------------------------------------------

export const ACTIVATE_DEFINITION: DefinitionData = {
  title: "What counts as activated",
  subtitle: "Activate · owned by Product · last changed 12 January by Zainab Yusuf",
  insightTitle: "Activation is the moment a customer learns the product works",
  insightBody:
    "Not the moment they pay. A first order that arrives late, cold or not at all is a transaction, not an activation — and every downstream stage behaves as though it never happened. This definition is why Retain's numbers are what they are.",
  candidatesEyebrow: "A customer is activated when",
  candidates: [
    {
      id: "first-order",
      label: "They place a first order",
      description: "The weakest definition. It counts the 71,000 whose order never arrived.",
      field: "orders.first_order · 894,000",
    },
    {
      id: "first-order-delivered",
      label: "Their first order is delivered",
      description: "Better. Still counts the 187,000 who never came back after it.",
      field: "delivery.completed · 823,000",
    },
    {
      id: "delivered-and-returned",
      label: "Delivered, and they return within 14 days",
      description: "41% of acquired. The only one of the three that predicts a second order.",
      field: "delivery.completed + session · 366,000",
      selected: true,
    },
  ],
  verdictEyebrow: "How the third definition was chosen",
  verdictRows: [
    { id: "placed-first-order", signal: "Placed a first order", customers: "894,000", reach: "27.2%", reachTone: "ink", predictive: "barely", predictiveTone: "amber", verdict: "too weak", verdictTone: "amber" },
    { id: "first-order-delivered", signal: "First order delivered", customers: "823,000", reach: "29.6%", reachTone: "ink", predictive: "weak", predictiveTone: "amber", verdict: "too weak", verdictTone: "amber" },
    { id: "delivered-returned-14", signal: "Delivered + returned in 14 days", customers: "366,000", reach: "61.4%", reachTone: "teal", predictive: "strong", predictiveTone: "teal", verdict: "chosen", verdictTone: "teal" },
    { id: "delivered-rated-4", signal: "Delivered + rated 4 or better", customers: "241,000", reach: "64.1%", reachTone: "teal", predictive: "strong", predictiveTone: "teal", verdict: "too few rate", verdictTone: "amber" },
    { id: "two-orders-30", signal: "Two orders in 30 days", customers: "198,000", reach: "100%", reachTone: "neutral", predictive: "circular", predictiveTone: "rose", verdict: "measures itself", verdictTone: "rose" },
  ],
  mistakeTitle: "The last row is the mistake most activation definitions make",
  mistakeBody:
    "“Two orders in 30 days” predicts a second order perfectly, because it is a second order. A definition that contains its own outcome cannot be used to find out what causes it — it just renames the thing you were trying to explain.",
};

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

// ---- Cohorts (AC06, stage-specific layout) -------------------------------

export type ActivateCohortRow = {
  id: string;
  cohort: string;
  acquired: string;
  activated: string;
  rate: string;
  rateTone: "teal" | "rose";
  medianDays: string;
  medianTone: "teal" | "rose" | "neutral";
  guestShare: string;
  guestShareTone: "ink" | "amber";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const ACTIVATE_COHORT_ROWS: ActivateCohortRow[] = [
  { id: "january", cohort: "January", acquired: "61,200", activated: "31,900", rate: "52.1%", rateTone: "teal", medianDays: "3.2", medianTone: "teal", guestShare: "18.1%", guestShareTone: "ink", vsFeb: "+0.4", vsFebTone: "teal" },
  { id: "february", cohort: "February", acquired: "64,900", activated: "33,800", rate: "52.1%", rateTone: "teal", medianDays: "3.4", medianTone: "teal", guestShare: "18.9%", guestShareTone: "ink", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", acquired: "82,100", activated: "34,100", rate: "41.5%", rateTone: "rose", medianDays: "6.0", medianTone: "rose", guestShare: "24.1%", guestShareTone: "amber", vsFeb: "−10.6", vsFebTone: "rose" },
  { id: "april", cohort: "April", acquired: "78,300", activated: "32,200", rate: "41.1%", rateTone: "rose", medianDays: "6.2", medianTone: "rose", guestShare: "25.4%", guestShareTone: "amber", vsFeb: "−11.0", vsFebTone: "rose" },
  { id: "may", cohort: "May", acquired: "77,600", activated: "32,600", rate: "42.0%", rateTone: "rose", medianDays: "6.1", medianTone: "rose", guestShare: "24.9%", guestShareTone: "amber", vsFeb: "−10.1", vsFebTone: "rose" },
  { id: "june", cohort: "June", acquired: "76,100", activated: "30,900", rate: "40.6%", rateTone: "rose", medianDays: "Unavailable", medianTone: "neutral", guestShare: "26.1%", guestShareTone: "amber", vsFeb: "—", vsFebTone: "neutral" },
];

export const ACTIVATE_COHORT_CAUSE_CARDS: InsightCard[] = [
  {
    id: "cause-one-fee",
    agentTag: "PR",
    meta: "Cause one · the fee",
    title: "−7.4 points of the −10.6",
    body: "Measured against the UK and Ghana, where the fee did not ship until June. Those markets held at 51.8% through the same period.",
    footnote: "causal · high confidence",
    tone: "rose",
  },
  {
    id: "cause-two-channel-mix",
    agentTag: "AQ",
    meta: "Cause two · the channel mix",
    title: "−3.2 points of the −10.6",
    body: "Guest share rose from 18.9% to 24.1% because the Ghana campaign and paid social both land on web, where guest checkout is the default. Guests activate at 12%.",
    footnote: "causal · from Acquire",
    tone: "amber",
  },
  {
    id: "what-is-left",
    meta: "WHAT IS LEFT",
    title: "Nothing unexplained",
    body: "−7.4 and −3.2 account for the full −10.6 within measurement error. This is unusual and worth saying — most cohort breaks leave a residual nobody can name.",
    footnote: "fully attributed",
    tone: "teal",
  },
];

// ---- Markets (AC07, stage-specific layout) --------------------------------

export type ActivateMarketRow = {
  id: string;
  market: string;
  enter: string;
  activate: string;
  rate: string;
  rateTone: "teal" | "rose";
  medianDays: string;
  medianTone: "teal" | "rose";
  guestShare: string;
  guestShareTone: "teal" | "amber" | "rose";
  atStake: string;
  atStakeTone: "teal" | "amber" | "rose" | "neutral";
  trend: "worsening" | "improving" | "flat";
};

export const ACTIVATE_MARKET_ROWS: ActivateMarketRow[] = [
  { id: "nigeria", market: "Nigeria", enter: "610,000", activate: "241,000", rate: "39.5%", rateTone: "rose", medianDays: "6.4", medianTone: "rose", guestShare: "24.8%", guestShareTone: "amber", atStake: "₦148M", atStakeTone: "rose", trend: "worsening" },
  { id: "kenya", market: "Kenya", enter: "121,000", activate: "62,900", rate: "52.0%", rateTone: "teal", medianDays: "3.9", medianTone: "teal", guestShare: "14.1%", guestShareTone: "teal", atStake: "KES 9.4M", atStakeTone: "amber", trend: "improving" },
  { id: "ghana", market: "Ghana", enter: "94,000", activate: "31,000", rate: "33.0%", rateTone: "rose", medianDays: "8.1", medianTone: "rose", guestShare: "31.2%", guestShareTone: "rose", atStake: "GHS 4.1M", atStakeTone: "rose", trend: "worsening" },
  { id: "uk", market: "United Kingdom", enter: "69,000", activate: "31,100", rate: "45.1%", rateTone: "teal", medianDays: "4.1", medianTone: "teal", guestShare: "11.9%", guestShareTone: "teal", atStake: "£31k", atStakeTone: "neutral", trend: "flat" },
];

export const ACTIVATE_MARKET_KENYA_INSIGHT = {
  title: "Kenya activates 12.5 points better than Nigeria and nobody has ever asked why",
  body: "Lower guest share, faster delivery windows and a market where the fee did not ship until June. Two of those three are copyable into Nigeria today. Kenya is 14% of the base and is currently treated as a smaller version of the main market rather than as the working example.",
};

export const ACTIVATE_MARKET_GHANA_ROWS: { label: string; value: string; tone: "amber" | "rose" }[] = [
  { label: "Guest share", value: "31.2% · the highest of any market · web-heavy acquisition", tone: "rose" },
  { label: "Median time to value", value: "8.1 days · slowest · delivery windows are 2–4 hours wider", tone: "rose" },
  { label: "Delivery feed", value: "not connected · so late-delivery effects cannot be measured here", tone: "amber" },
  { label: "Fee ships here", value: "14 September · the only market where this is still preventable", tone: "amber" },
  { label: "Rooms open in Ghana", value: "1 · the Accra acquisition room, with no owner", tone: "rose" },
];

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

// ---- Agents (AC10) --------------------------------------------------------

export type ActivateAgentCard = {
  id: string;
  initials: string;
  status: string;
  name: string;
  body: string;
  footnote: string;
  tone: "ultra" | "amber";
};

export const ACTIVATE_AGENT_CARDS: ActivateAgentCard[] = [
  {
    id: "product-reason",
    initials: "PR",
    status: "Lead agent · reading since 12 Jan",
    name: "Product Reason",
    body: "Watches activation rate, time to value and path mix. It holds every release against this stage for fourteen days automatically — which is how the 4 March finding was made without anyone asking.",
    footnote: "6 rooms · 4 closed",
    tone: "ultra",
  },
  {
    id: "support-signal",
    initials: "SS",
    status: "Supporting · reading since 12 Jan",
    name: "Support Signal",
    body: "Reclassifies contact drivers as activation blockers. It found that “where is my order” was a revenue signal, not a support volume problem, in the first week of March.",
    footnote: "found it, nobody escalated",
    tone: "ultra",
  },
  {
    id: "ghana-delivery-feed",
    initials: "PR",
    status: "Blocked",
    name: "Ghana has no delivery feed",
    body: "Product Reason cannot measure late-delivery effects in Ghana because no delivery source exists there. It reports Ghana's delivery figures as unavailable rather than assuming Nigeria's.",
    footnote: "one market, partially blind",
    tone: "amber",
  },
];

export type ActivateThresholdRow = {
  id: string;
  condition: string;
  threshold: string;
  currently: string;
  currentlyTone: "teal" | "rose" | "amber";
  status: "already-open" | "not-opened" | "opens-automatically";
  owner?: { name: string; initials: string; color: string };
  noOwner?: boolean;
};

export const ACTIVATE_THRESHOLD_ROWS: ActivateThresholdRow[] = [
  { id: "activation-falls", condition: "Activation rate falls", threshold: "more than 2 pts, 7 days", currently: "−10.6", currentlyTone: "rose", status: "already-open", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "ttv-rises", condition: "Median time to value rises", threshold: "more than 1 day", currently: "+2.7 days", currentlyTone: "rose", status: "already-open", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "release-moves-stage", condition: "A release moves this stage", threshold: "any measurable effect, 14 days", currently: "2 this quarter", currentlyTone: "amber", status: "opens-automatically", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "guest-share-rises", condition: "Guest share rises", threshold: "more than 3 pts", currently: "+7.2 pts", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "path-below-floor", condition: "A path falls below 20% activation", threshold: "hard floor", currently: "guest at 12.1%", currentlyTone: "rose", status: "not-opened", noOwner: true },
];

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

// ---- History (AC11) -------------------------------------------------------

export type ActivateGoalRow = {
  id: string;
  goal: string;
  owner: { name: string; initials: string; color: string };
  target: string;
  today: string;
  todayTone: "amber";
  paceLabel: string;
  paceTone: "rose" | "amber";
  part: string;
  partTone: "rose";
};

export const ACTIVATE_GOAL_ROWS: ActivateGoalRow[] = [
  { id: "repeat-rate", goal: "90-day repeat rate", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" }, target: "36.4%", today: "29.2%", todayTone: "amber", paceLabel: "7.2 behind", paceTone: "rose", part: "activation is the upstream cause", partTone: "rose" },
  { id: "net-revenue", goal: "Net revenue", owner: { name: "Ada", initials: "AD", color: "#2E8B7F" }, target: "₦4.90B", today: "₦4.71B proj", todayTone: "amber", paceLabel: "94% of pace", paceTone: "amber", part: "₦188M of the ₦186M gap", partTone: "rose" },
];

export type ActivateTriedRow = {
  id: string;
  what: string;
  when: string;
  whenTone?: "neutral" | "amber";
  result: string;
  resultTone: "teal" | "amber" | "neutral";
  measuredHow: string;
  learningKept: "validated" | "superseded" | "validated · no effect" | "suggested twice";
};

export const ACTIVATE_TRIED_ROWS: ActivateTriedRow[] = [
  { id: "one-tap-reorder", what: "One-tap reorder", when: "18 Mar", result: "+2.1 pts, app users only", resultTone: "teal", measuredHow: "before/after · 14 days", learningKept: "validated" },
  { id: "welcome-sequence", what: "Welcome sequence · 3 emails", when: "Feb", result: "+0.4 pts · not significant", resultTone: "neutral", measuredHow: "holdout · 20%", learningKept: "validated · no effect" },
  { id: "free-first-delivery", what: "Free first delivery · 2024", when: "Sep 2024", result: "+11 pts activation, −6 pts margin", resultTone: "amber", measuredHow: "holdout · 15%", learningKept: "superseded" },
  { id: "new-address-picker", what: "New address picker", when: "2 Apr", result: "no measurable effect", resultTone: "neutral", measuredHow: "A/B · 50/50", learningKept: "validated" },
  { id: "account-after-checkout", what: "Account after checkout", when: "never", whenTone: "amber", result: "untried", resultTone: "amber", measuredHow: "—", learningKept: "suggested twice" },
];

// ---- Compare periods (AC12) -----------------------------------------------

export type ActivateCompareRow = {
  id: string;
  metric: string;
  before: string;
  after: string;
  change: string;
  changeTone: "teal" | "rose";
  whatMovedIt: string;
};

export const ACTIVATE_COMPARE_ROWS: ActivateCompareRow[] = [
  { id: "activation-rate", metric: "Activation rate", before: "52.1%", after: "41.5%", change: "−10.6 pts", changeTone: "rose", whatMovedIt: "The fee (−7.4) and guest share (−3.2)" },
  { id: "median-ttv", metric: "Median time to value", before: "3.4 days", after: "6.1 days", change: "+79.4%", changeTone: "rose", whatMovedIt: "Same cause · slower decisions" },
  { id: "same-day-activation", metric: "Same-day activation", before: "13.8%", after: "11.2%", change: "−2.6 pts", changeTone: "rose", whatMovedIt: "The fee step interrupts the first session" },
  { id: "guest-checkout-share", metric: "Guest checkout share", before: "18.9%", after: "24.9%", change: "+6.0 pts", changeTone: "rose", whatMovedIt: "Web-heavy Ghana and paid social" },
  { id: "customers-entering", metric: "Customers entering the stage", before: "64,900/mo", after: "78,500/mo", change: "+21.0%", changeTone: "teal", whatMovedIt: "Acquisition spend up 31%" },
  { id: "customers-reaching-value", metric: "Customers reaching value", before: "33,800/mo", after: "32,400/mo", change: "−4.1%", changeTone: "rose", whatMovedIt: "More in, fewer through" },
];
