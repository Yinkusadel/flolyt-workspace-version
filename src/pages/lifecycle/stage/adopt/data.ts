/**
 * Mock content for the Adopt stage — screens AD01-AD13 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "AD07 · Adopt · cohorts").
 */

import type { Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/lifecycle/stage/chip";
import type { ActionCard } from "@/pages/lifecycle/stage/detail/detail-drilldown";
import type { DefinitionCandidate } from "@/pages/lifecycle/stage/definition/definition-route";
import type { LeakRow, ChangeRow, AgentCard, ThresholdRow, GoalRow, TriedRow, CompareRow } from "@/pages/lifecycle/stage/acquire/data";
import type { InsightCard } from "@/pages/lifecycle/stage/activate/data";
import type { ThresholdPreset } from "@/pages/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (AD01) -----------------------------------------------

export type AdoptDefinitionVerdictRow = {
  id: string;
  featuresUsed: string;
  customers: string;
  stillOrdering90d: string;
  stillOrderingTone: "rose" | "amber" | "teal";
  ordersPerMonth: string;
  verdict: string;
  verdictTone: ChipTone;
};

export type AdoptDefinitionData = {
  title: string;
  subtitle: string;
  insightTitle: string;
  insightBody: string;
  candidatesEyebrow: string;
  candidates: DefinitionCandidate[];
  verdictEyebrow: string;
  verdictRows: AdoptDefinitionVerdictRow[];
  closingTitle: string;
  closingBody: string;
};

export const ADOPT_DEFINITION: AdoptDefinitionData = {
  title: "What counts as adopting",
  subtitle: "Adopt · owned by Product · last changed 12 January by Zainab Yusuf",
  insightTitle: "Adoption is breadth, not usage",
  insightBody:
    "A customer who orders forty times and only ever taps “order again” has used one feature forty times. A customer who orders eight times using reorder, scheduled delivery, a saved address and the wallet has adopted the product. The second one stays. This stage measures the second thing.",
  candidatesEyebrow: "A customer is adopting when",
  candidates: [
    {
      id: "ordered-more-than-once",
      label: "They have ordered more than once",
      description: "That is Retain's question, not this one. It measures whether they came back, not what they use.",
      field: "orders · 1.19M",
    },
    {
      id: "any-feature-beyond-ordering",
      label: "They use any feature beyond ordering",
      description: "Too generous. Saving one address counts the same as running a weekly schedule.",
      field: "events · 782,000",
    },
    {
      id: "two-or-more-features",
      label: "They use two or more features beyond ordering",
      description: "The point at which the next order stops being a decision and starts being a habit.",
      field: "events · 411,000 · 2.1 average",
      selected: true,
    },
  ],
  verdictEyebrow: "Why two, and not three or one",
  verdictRows: [
    { id: "0", featuresUsed: "0 · ordering only", customers: "781,000", stillOrdering90d: "18.1%", stillOrderingTone: "rose", ordersPerMonth: "1.1", verdict: "at risk", verdictTone: "rose" },
    { id: "1", featuresUsed: "1", customers: "371,000", stillOrdering90d: "31.4%", stillOrderingTone: "amber", ordersPerMonth: "2.4", verdict: "fragile", verdictTone: "amber" },
    { id: "2", featuresUsed: "2", customers: "218,000", stillOrdering90d: "61.1%", stillOrderingTone: "teal", ordersPerMonth: "4.9", verdict: "the step change", verdictTone: "teal" },
    { id: "3", featuresUsed: "3", customers: "131,000", stillOrdering90d: "68.4%", stillOrderingTone: "teal", ordersPerMonth: "6.8", verdict: "strong", verdictTone: "teal" },
    { id: "4", featuresUsed: "4 or more", customers: "62,000", stillOrdering90d: "74.1%", stillOrderingTone: "teal", ordersPerMonth: "9.1", verdict: "strongest", verdictTone: "teal" },
  ],
  closingTitle: "The jump from one feature to two is 30 points. Every jump after that is seven.",
  closingBody:
    "That is where the definition sits, and it is the only line on this table that is not a smooth curve. Two features is not a target anybody set — it is where the data changes shape, which is the only defensible place to put a threshold.",
};

// ---- Overview (AD02) ---------------------------------------------------

export const ADOPT_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Customers who could adopt", value: "1.19M", note: "have ordered more than once" },
  { eyebrow: "Adopting · 2+ features", value: "411,000", tone: "rose", note: "34.5% · was 41.2%" },
  { eyebrow: "Features per customer", value: "2.1", tone: "rose", note: "was 2.6" },
  { eyebrow: "At stake", value: "₦112M", tone: "rose", note: "third-largest leak" },
];

export const ADOPT_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "guest-checkout-no-features",
    where: "Guest checkout · no account, so no features",
    customers: "186,000",
    value: "₦41M",
    valueTone: "rose",
    trend: "structurally excluded",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "open · Activate", tone: "amber" },
  },
  {
    id: "ordered-twice-never-explored",
    where: "Ordered twice, never explored",
    customers: "312,000",
    value: "₦38M",
    valueTone: "rose",
    trend: "no prompt exists",
    trendTone: "amber",
    causeKnown: { label: "no reading", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "scheduled-orders-abandoned",
    where: "Scheduled orders abandoned after the fee",
    customers: "94,000",
    value: "₦24M",
    valueTone: "rose",
    trend: "the 4 March change",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "wallet-funded-once",
    where: "Wallet · funded once, never reused",
    customers: "128,000",
    value: "₦9M",
    valueTone: "amber",
    trend: "no reason to return to it",
    trendTone: "amber",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "loyalty-tiers",
    where: "Loyalty tiers",
    customers: "Unavailable",
    value: "Unavailable",
    valueTone: "ink",
    trend: "never instrumented",
    trendTone: "rose",
    causeKnown: { label: "cannot say", tone: "amber" },
    room: { label: "blocked", tone: "rose" },
  },
];

export const ADOPT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Ordered twice, never explored a second feature",
  carriedIn: [
    { label: "Stage", value: "Adopt" },
    { label: "Entered", value: "last 12 months" },
    { label: "Explored a feature", value: "false" },
    { label: "Markets", value: "all four" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "312,000 customers · ₦38M at stake",
  countedNote: "Counted 6 minutes ago · no prompt exists for this group",
  participants: [
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "PR", kind: "agent" },
  ],
  participantsNote: "Product Reason leads · Zainab owns the stage, so she owns this",
};

export const ADOPT_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Adopt · overview · Nigeria",
  snapshotLabel: "Adopt · overview · Nigeria · as of 13 Aug 08:12",
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
    "Loyalty tiers is unavailable everywhere on this screen — it travels with the file rather than being dropped from it, an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Features (AD03) + one-feature drilldown (AD04) ----------------------

export type FeatureRow = {
  id: string;
  feature: string;
  everUsed: string;
  usedTwice: string;
  usedTwiceTone: "teal" | "amber" | "rose";
  stillUsing: string;
  stillUsingTone: "teal" | "amber" | "rose";
  ordersPerMonthAfter: string;
  ordersTone: "ink" | "teal";
  shipped: string;
  verdict: string;
  verdictTone: ChipTone;
};

export const ADOPT_FEATURE_ROWS: FeatureRow[] = [
  { id: "order-again", feature: "Order again · one tap", everUsed: "612,000", usedTwice: "481,000", usedTwiceTone: "teal", stillUsing: "78.6%", stillUsingTone: "teal", ordersPerMonthAfter: "6.1", ordersTone: "teal", shipped: "18 Mar", verdict: "works", verdictTone: "teal" },
  { id: "saved-addresses", feature: "Saved addresses", everUsed: "598,000", usedTwice: "541,000", usedTwiceTone: "teal", stillUsing: "90.5%", stillUsingTone: "teal", ordersPerMonthAfter: "4.8", ordersTone: "teal", shipped: "2022", verdict: "works", verdictTone: "teal" },
  { id: "scheduled-delivery", feature: "Scheduled delivery", everUsed: "241,000", usedTwice: "109,000", usedTwiceTone: "amber", stillUsing: "45.2%", stillUsingTone: "rose", ordersPerMonthAfter: "8.9", ordersTone: "teal", shipped: "2023", verdict: "broke in March", verdictTone: "rose" },
  { id: "wallet", feature: "Wallet", everUsed: "184,000", usedTwice: "56,000", usedTwiceTone: "rose", stillUsing: "30.4%", stillUsingTone: "rose", ordersPerMonthAfter: "5.1", ordersTone: "teal", shipped: "Nov 2025", verdict: "no reason to return", verdictTone: "rose" },
  { id: "group-ordering", feature: "Group ordering", everUsed: "94,000", usedTwice: "71,000", usedTwiceTone: "teal", stillUsing: "75.5%", stillUsingTone: "teal", ordersPerMonthAfter: "11.4", ordersTone: "teal", shipped: "2024", verdict: "small and excellent", verdictTone: "teal" },
  { id: "ratings", feature: "Ratings", everUsed: "241,000", usedTwice: "112,000", usedTwiceTone: "amber", stillUsing: "46.5%", stillUsingTone: "amber", ordersPerMonthAfter: "4.2", ordersTone: "ink", shipped: "2022", verdict: "declining", verdictTone: "amber" },
  { id: "loyalty-tiers", feature: "Loyalty tiers", everUsed: "Unavailable", usedTwice: "Unavailable", usedTwiceTone: "amber", stillUsing: "Unavailable", stillUsingTone: "amber", ordersPerMonthAfter: "Unavailable", ordersTone: "ink", shipped: "Apr", verdict: "not instrumented", verdictTone: "rose" },
];

export const ADOPT_FEATURE_INSIGHT_CARDS: InsightCard[] = [
  {
    id: "scheduled-delivery-broke",
    agentTag: "PR",
    meta: "94,000 customers · ₦24M",
    title: "Scheduled delivery broke in March",
    body: "Second use fell from 71% to 45% in the week of 4 March. A scheduled order shows the delivery fee every single week, where a one-off order shows it once — the same change, felt seven times harder.",
    footnote: "causal · the highest-value feature",
    tone: "rose",
  },
  {
    id: "wallet-funded-forgotten",
    agentTag: "PR",
    meta: "128,000 customers · ₦9M",
    title: "The wallet is funded once and forgotten",
    body: "184,000 funded it, 56,000 used it twice. There is no balance reminder, no auto-top-up and no reason to open it. It is not broken — nothing ever brings anyone back to it.",
    footnote: "shipped Nov 2025, never followed up",
    tone: "amber",
  },
  {
    id: "group-ordering-unmarketed",
    meta: "94,000 CUSTOMERS",
    title: "Group ordering is the best feature nobody has",
    body: "11.4 orders a month, 75% second use, highest of anything here. It is 8% of the base and has never been promoted to the other 92%.",
    footnote: "small, excellent, unmarketed",
    tone: "teal",
  },
];

export type AdoptOutcomeRow = {
  id: string;
  whatTheyDidInstead: string;
  customers: string;
  ordersPerMonthNow: string;
  ordersNowTone: "ink" | "teal" | "amber" | "rose";
  was: string;
  stillCustomer90d: string;
  stillCustomerTone: "ink" | "teal" | "amber" | "rose";
};

export type FeatureDetail = {
  feature: string;
  headline: string;
  kpis: Kpi[];
  frictionEyebrow: string;
  frictionTitle: string;
  frictionRows: { label: string; value: string; percent: number; tone: BarTone }[];
  frictionCauseTitle: string;
  frictionCauseBody: string;
  outcomeEyebrow: string;
  outcomeRows: AdoptOutcomeRow[];
  closingTitle: string;
  closingBody: string;
};

export const ADOPT_FEATURE_DETAILS: Record<string, FeatureDetail> = {
  "scheduled-delivery": {
    feature: "Scheduled delivery",
    headline: "241,000 ever used · second use fell from 71% to 45% in the week of 4 March",
    kpis: [
      { eyebrow: "Ever used", value: "241,000", note: "20% of eligible customers" },
      { eyebrow: "Still using", value: "45.2%", tone: "rose", note: "was 71.4% before 4 March" },
      { eyebrow: "Orders per month while using", value: "8.9", tone: "teal", note: "highest of any feature" },
      { eyebrow: "At stake", value: "₦24M", tone: "rose", note: "and compounding" },
    ],
    frictionEyebrow: "The same change, felt seven times harder",
    frictionTitle: "The same change, felt seven times harder",
    frictionRows: [
      { label: "One-off orderer · sees the fee", value: "once per order · 1.4 orders/month", percent: 14, tone: "amber" },
      { label: "Scheduled weekly · sees the fee", value: "every week · 4.3 orders/month", percent: 43, tone: "rose" },
      { label: "Scheduled twice weekly", value: "every time · 8.9 orders/month", percent: 89, tone: "rose" },
    ],
    frictionCauseTitle: "A recurring customer meets a new fee more often than anyone else",
    frictionCauseBody:
      "The 4 March change added ₦350 at checkout. A weekly scheduled customer met it 22 times before June. Someone ordering occasionally met it four times. Scheduled delivery is the feature that most predicts retention and it took the largest share of the damage — which is the opposite of what anyone would have designed.",
    outcomeEyebrow: "What happened to the 132,000 who stopped scheduling",
    outcomeRows: [
      { id: "switched-one-off", whatTheyDidInstead: "Switched to one-off ordering", customers: "71,000", ordersPerMonthNow: "2.1", ordersNowTone: "amber", was: "8.4", stillCustomer90d: "64.1%", stillCustomerTone: "amber" },
      { id: "stopped-entirely", whatTheyDidInstead: "Stopped ordering entirely", customers: "41,000", ordersPerMonthNow: "0", ordersNowTone: "rose", was: "9.1", stillCustomer90d: "0%", stillCustomerTone: "rose" },
      { id: "moved-competitor", whatTheyDidInstead: "Moved to a competitor · inferred", customers: "Unavailable", ordersPerMonthNow: "—", ordersNowTone: "ink", was: "—", stillCustomer90d: "no source", stillCustomerTone: "ink" },
      { id: "reduced-monthly", whatTheyDidInstead: "Reduced to monthly scheduling", customers: "20,000", ordersPerMonthNow: "1.9", ordersNowTone: "amber", was: "8.8", stillCustomer90d: "81.4%", stillCustomerTone: "teal" },
    ],
    closingTitle: "41,000 of the company's best customers left without a single support ticket",
    closingBody:
      "They had the highest order frequency in the base and they did not complain, cancel a subscription or contact anyone. They stopped scheduling and then stopped ordering. Nothing in any tool at Lagos Foods would have flagged this — the only visible signal was a feature-usage number on a screen nobody owned.",
  },
};

// ---- Depth (AD05) -----------------------------------------------------

export const ADOPT_DEPTH_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "0 features · ordering only", value: "781,000 · 65.5%", percent: 66, tone: "rose" },
  { label: "1 feature", value: "371,000 · 31.2%", percent: 31, tone: "amber" },
  { label: "2 features", value: "218,000 · 18.3%", percent: 18, tone: "teal" },
  { label: "3 features", value: "131,000 · 11.0%", percent: 11, tone: "teal" },
  { label: "4 or more", value: "62,000 · 5.2%", percent: 5, tone: "teal" },
];

export type SecondFeatureRow = {
  id: string;
  firstFeature: string;
  mostCommonSecond: string;
  customers: string;
  retentionAt2: string;
  retentionTone: "teal" | "amber";
  liftOver1: string;
  liftTone: "teal" | "amber" | "neutral";
  prompted: string;
  promptedTone: "teal" | "rose";
};

export const ADOPT_SECOND_FEATURE_ROWS: SecondFeatureRow[] = [
  { id: "saved-addresses-order-again", firstFeature: "Saved addresses", mostCommonSecond: "Order again", customers: "184,000", retentionAt2: "64.1%", retentionTone: "teal", liftOver1: "+31 pts", liftTone: "teal", prompted: "yes · in-app", promptedTone: "teal" },
  { id: "order-again-scheduled", firstFeature: "Order again", mostCommonSecond: "Scheduled delivery", customers: "71,000", retentionAt2: "71.4%", retentionTone: "teal", liftOver1: "+38 pts", liftTone: "teal", prompted: "no prompt", promptedTone: "rose" },
  { id: "saved-addresses-wallet", firstFeature: "Saved addresses", mostCommonSecond: "Wallet", customers: "41,000", retentionAt2: "48.1%", retentionTone: "amber", liftOver1: "+15 pts", liftTone: "amber", prompted: "yes · at checkout", promptedTone: "teal" },
  { id: "order-again-group", firstFeature: "Order again", mostCommonSecond: "Group ordering", customers: "19,000", retentionAt2: "78.9%", retentionTone: "teal", liftOver1: "+45 pts", liftTone: "teal", prompted: "no prompt", promptedTone: "rose" },
  { id: "any-ratings", firstFeature: "Any", mostCommonSecond: "Ratings", customers: "112,000", retentionAt2: "39.4%", retentionTone: "amber", liftOver1: "+6 pts", liftTone: "neutral", prompted: "yes · after delivery", promptedTone: "teal" },
];

// ---- Not instrumented / blind spots (AD06) --------------------------------

export type BlindSpotRow = {
  id: string;
  what: string;
  shipped: string;
  whyInvisible: string;
  whyInvisibleTone: "rose" | "amber";
  whoCouldFix?: { name: string; color: string };
  noOwner?: boolean;
  requested: string;
  requestedTone: "neutral" | "amber";
  state: string;
  stateTone: ChipTone;
};

export const ADOPT_BLIND_SPOT_ROWS: BlindSpotRow[] = [
  { id: "loyalty-tiers", what: "Loyalty tiers", shipped: "Apr 2026", whyInvisible: "renamed, event never updated", whyInvisibleTone: "rose", whoCouldFix: { name: "Engineering", color: "#4E7080" }, requested: "2 Aug", requestedTone: "neutral", state: "34 days overdue", stateTone: "rose" },
  { id: "basket-contents", what: "Basket contents", shipped: "2022", whyInvisible: "order_lines not in the feed", whyInvisibleTone: "rose", whoCouldFix: { name: "Engineering", color: "#4E7080" }, requested: "28 Jul", requestedTone: "neutral", state: "41 days overdue", stateTone: "rose" },
  { id: "in-app-search", what: "In-app search", shipped: "2023", whyInvisible: "never instrumented", whyInvisibleTone: "amber", whoCouldFix: { name: "Engineering", color: "#4E7080" }, requested: "never asked", requestedTone: "amber", state: "no request", stateTone: "amber" },
  { id: "push-notification-opens", what: "Push notification opens", shipped: "2024", whyInvisible: "provider reports sends, not opens", whyInvisibleTone: "amber", whoCouldFix: { name: "Engineering", color: "#4E7080" }, requested: "never asked", requestedTone: "amber", state: "no request", stateTone: "amber" },
  { id: "referral-link-shares", what: "Referral link shares", shipped: "2024", whyInvisible: "attribution only on redemption", whyInvisibleTone: "amber", noOwner: true, requested: "never asked", requestedTone: "amber", state: "Advocate unowned", stateTone: "rose" },
];

export const ADOPT_BLIND_SPOT_COST_CARDS: ActionCard[] = [
  {
    id: "loyalty-tiers-cost",
    eyebrow: "Loyalty tiers",
    tone: "rose",
    title: "A rename that cannot be evaluated",
    body: "It shipped in April and may have helped, hurt or done nothing. Four months of a live feature with no reading. The instrumentation request has sat with Engineering for 34 days.",
    footnote: "second-largest overdue obligation",
  },
  {
    id: "basket-contents-cost",
    eyebrow: "Basket contents",
    tone: "rose",
    title: "Blocks cost of goods entirely",
    body: "Without order lines there is no per-item cost, which is why margin is unavailable across the whole product. One field in one feed unblocks six figures in four stages.",
    footnote: "the root of the Price problem",
  },
  {
    id: "nobody-asked-for",
    eyebrow: "The two nobody asked for",
    tone: "amber",
    title: "Search and push opens",
    body: "Not overdue — never requested. Both would be small asks. They are listed here because “nobody asked” is a different failure from “nobody delivered”, and only one of them is Engineering's.",
    footnote: "our omission, not theirs",
  },
];

// ---- Cohorts (AD07, stage-specific layout) --------------------------------

export type AdoptCohortRow = {
  id: string;
  cohort: string;
  eligible: string;
  twoPlusFeatures: string;
  rate: string;
  rateTone: "teal" | "rose";
  avgFeatures: string;
  avgFeaturesTone: "teal" | "rose";
  scheduledDelivery: string;
  scheduledTone: "teal" | "rose";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const ADOPT_COHORT_ROWS: AdoptCohortRow[] = [
  { id: "january", cohort: "January", eligible: "42,100", twoPlusFeatures: "17,400", rate: "41.3%", rateTone: "teal", avgFeatures: "2.6", avgFeaturesTone: "teal", scheduledDelivery: "21.1%", scheduledTone: "teal", vsFeb: "+0.2", vsFebTone: "teal" },
  { id: "february", cohort: "February", eligible: "44,800", twoPlusFeatures: "18,400", rate: "41.1%", rateTone: "teal", avgFeatures: "2.6", avgFeaturesTone: "teal", scheduledDelivery: "20.8%", scheduledTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", eligible: "48,900", twoPlusFeatures: "16,800", rate: "34.4%", rateTone: "rose", avgFeatures: "2.1", avgFeaturesTone: "rose", scheduledDelivery: "11.4%", scheduledTone: "rose", vsFeb: "−6.7", vsFebTone: "rose" },
  { id: "april", cohort: "April", eligible: "46,200", twoPlusFeatures: "15,700", rate: "34.0%", rateTone: "rose", avgFeatures: "2.1", avgFeaturesTone: "rose", scheduledDelivery: "10.9%", scheduledTone: "rose", vsFeb: "−7.1", vsFebTone: "rose" },
  { id: "may", cohort: "May", eligible: "45,800", twoPlusFeatures: "15,800", rate: "34.5%", rateTone: "rose", avgFeatures: "2.1", avgFeaturesTone: "rose", scheduledDelivery: "11.2%", scheduledTone: "rose", vsFeb: "−6.6", vsFebTone: "rose" },
  { id: "june", cohort: "June", eligible: "44,100", twoPlusFeatures: "Unavailable", rate: "Unavailable", rateTone: "rose", avgFeatures: "Unavailable", avgFeaturesTone: "rose", scheduledDelivery: "11.1%", scheduledTone: "rose", vsFeb: "—", vsFebTone: "neutral" },
];

export const ADOPT_COHORT_CAUSE_CARDS: InsightCard[] = [
  {
    id: "scheduled-delivery-cause",
    agentTag: "PR",
    meta: "−4.1 points",
    title: "Scheduled delivery",
    body: "The fee is met weekly rather than occasionally. Measured against the UK and Ghana, where scheduling held at 20.4% through the same period.",
    footnote: "causal · high confidence",
    tone: "rose",
  },
  {
    id: "guest-share-rising",
    agentTag: "AQ",
    meta: "−1.9 points",
    title: "Guest share rising",
    body: "Guest customers have no account and therefore structurally cannot adopt anything. Guest share rose 6 points, so the eligible population got diluted.",
    footnote: "causal · from Acquire",
    tone: "amber",
  },
  {
    id: "unattributed-residual",
    meta: "−0.7 POINTS",
    title: "Unattributed",
    body: "Within measurement error and left as unexplained rather than assigned to the two causes above. Small residuals are stated, not absorbed.",
    footnote: "honestly unexplained",
    tone: "teal",
  },
];

// ---- Markets (AD08, stage-specific layout) --------------------------------

export type AdoptMarketRow = {
  id: string;
  market: string;
  eligible: string;
  twoPlusFeatures: string;
  twoPlusTone: "teal" | "rose";
  avgFeatures: string;
  avgFeaturesTone: "teal" | "rose";
  topSecondFeature: string;
  atStake: string;
  atStakeTone: "rose" | "amber" | "neutral";
  trend: "worsening" | "flat" | "improving";
};

export const ADOPT_MARKET_ROWS: AdoptMarketRow[] = [
  { id: "nigeria", market: "Nigeria", eligible: "781,000", twoPlusFeatures: "31.1%", twoPlusTone: "rose", avgFeatures: "2.0", avgFeaturesTone: "rose", topSecondFeature: "Order again", atStake: "₦88M", atStakeTone: "rose", trend: "worsening" },
  { id: "kenya", market: "Kenya", eligible: "218,000", twoPlusFeatures: "44.2%", twoPlusTone: "teal", avgFeatures: "2.8", avgFeaturesTone: "teal", topSecondFeature: "Scheduled delivery", atStake: "KES 4.1M", atStakeTone: "amber", trend: "flat" },
  { id: "ghana", market: "Ghana", eligible: "112,000", twoPlusFeatures: "24.1%", twoPlusTone: "rose", avgFeatures: "1.6", avgFeaturesTone: "rose", topSecondFeature: "Saved addresses", atStake: "GHS 1.9M", atStakeTone: "rose", trend: "worsening" },
  { id: "uk", market: "United Kingdom", eligible: "79,000", twoPlusFeatures: "48.9%", twoPlusTone: "teal", avgFeatures: "3.1", avgFeaturesTone: "teal", topSecondFeature: "Group ordering", atStake: "£19k", atStakeTone: "neutral", trend: "improving" },
];

export const ADOPT_MARKET_INSIGHT = {
  title: "Kenya schedules and the UK orders in groups. Nigeria does neither.",
  body: "The two markets with the highest adoption each lean on a different high-lift feature, and both discovered it without a campaign. Nigeria's most common second feature is “order again”, which is the lowest-effort and lowest-lift of the seven. Nobody has ever tried to move Nigeria toward what Kenya does naturally.",
};

export const ADOPT_MARKET_GHANA_ROWS: { label: string; value: string; tone: "amber" | "rose" }[] = [
  { label: "Average features", value: "1.6 · the lowest of any market", tone: "rose" },
  { label: "Why, in part", value: "31% guest share · guests cannot adopt anything", tone: "rose" },
  { label: "Why, in part", value: "no delivery feed, so scheduling cannot be offered reliably", tone: "amber" },
  { label: "Price", value: "22% above Nigeria and unrevised since 2024", tone: "rose" },
  { label: "Rooms open in Ghana", value: "1 · about acquisition · with no owner", tone: "rose" },
];

export const ADOPT_MARKET_CLOSING = {
  title: "This is the fourth stage in a row where Ghana is worst and nobody owns it",
  body: "Acquire, Activate, Price and now Adopt each independently flag Ghana. There is one Ghana room, it is about a campaign, and it has had no owner since 10 August. The market is 410,000 customers and it does not have a person.",
};

// ---- What changed (AD09) ---------------------------------------------------

export const ADOPT_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee-checkout", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "Scheduled delivery second use 71% → 45%", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "one-tap-reorder", date: "18 Mar", team: "Product", teamColor: "#7A5AA8", title: "One-tap reorder shipped", effect: "612,000 ever used · +2.1 pts activation", effectTone: "teal", badge: "causal finding", badgeTone: "ultra" },
  { id: "ghana-campaign", date: "11 Mar", team: "Marketing", teamColor: "#79883A", title: "Ghana campaign · web-heavy, guest-default", effect: "Eligible population diluted 6 pts", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "wallet-shipped", date: "Nov 2025", team: "Product", teamColor: "#7A5AA8", title: "Wallet shipped", effect: "184,000 funded · 56,000 used twice", effectTone: "amber", badge: "causal finding", badgeTone: "ultra" },
  { id: "loyalty-tiers-renamed", date: "19 Apr", team: "Marketing", teamColor: "#79883A", title: "Loyalty tiers renamed", effect: "Unavailable · event never updated", effectTone: "amber", badge: "not instrumented", badgeTone: "amber" },
  { id: "new-address-picker", date: "2 Apr", team: "Product", teamColor: "#7A5AA8", title: "New address picker", effect: "No measurable effect on saved addresses", effectTone: "neutral", badge: "no effect", badgeTone: "neutral" },
];

// ---- Agents (AD10) ----------------------------------------------------------

export const ADOPT_AGENT_CARDS: AgentCard[] = [
  {
    id: "product-reason",
    initials: "PR",
    status: "Lead agent · reading since 12 Jan",
    name: "Product Reason",
    body: "The same agent that leads Activate. It watches feature adoption, depth and second-feature progression, and it holds every release against this stage for fourteen days.",
    footnote: "shares one memory with Activate",
    tone: "ultra",
  },
  {
    id: "scheduled-delivery-break",
    initials: "PR",
    status: "What it found unprompted",
    name: "The scheduled-delivery break",
    body: "Nobody asked it to check whether a checkout change would affect a recurring feature. It held the 4 March release against every stage automatically and this is where the second-largest effect landed.",
    footnote: "found 2 August, 151 days late",
    tone: "ultra",
  },
  {
    id: "what-it-cannot-see",
    initials: "",
    status: "What it cannot see",
    name: "One feature entirely",
    body: "Loyalty tiers emit no event. The agent reports the feature as unavailable on every run rather than omitting it, which is why it appears on four screens in this stage as a gap.",
    footnote: "blocked on Engineering",
    tone: "rose",
  },
];

export const ADOPT_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "avg-features-falls", condition: "Average features per customer falls", threshold: "more than 0.3", currently: "−0.5", currentlyTone: "rose", status: "already-open", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "second-use-falls", condition: "A feature's second use falls", threshold: "more than 10 pts", currently: "scheduled −26 pts", currentlyTone: "rose", status: "already-open", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "shipped-feature-no-events", condition: "A shipped feature emits no events", threshold: "14 days after release", currently: "loyalty tiers · 118 days", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "release-moves-stage", condition: "A release moves this stage", threshold: "any effect, 14 days", currently: "2 this quarter", currentlyTone: "amber", status: "opens-automatically", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "feature-funded-abandoned", condition: "A feature is funded and abandoned", threshold: "second use below 40%", currently: "wallet at 30.4%", currentlyTone: "rose", status: "not-opened", noOwner: true },
];

export const ADOPT_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Average features per customer falls", note: "features used ÷ eligible customers" },
  byMoreThan: { label: "By more than", value: "0.3 features", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "market, feature", note: "so a single feature's drift is findable, not averaged away" },
  routesTo: { name: "The Adopt stage owner · Zainab Yusuf" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 4 March, when the delivery fee shipped and scheduled delivery broke — still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (AD11) ----------------------------------------------------------

export const ADOPT_GOAL_ROWS: GoalRow[] = [
  { id: "90-day-repeat-rate", goal: "90-day repeat rate", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" }, target: "36.4%", today: "29.2%", todayTone: "amber", paceLabel: "7.2 behind", paceTone: "rose", part: "depth is the strongest predictor", partTone: "rose" },
];

export const ADOPT_TRIED_ROWS: TriedRow[] = [
  { id: "one-tap-reorder", what: "One-tap reorder", when: "18 Mar", result: "612,000 adopted · +2.1 pts", resultTone: "teal", measuredHow: "before/after · 14 days", learningKept: "validated" },
  { id: "wallet-launch", what: "Wallet launch", when: "Nov 2025", result: "184,000 funded, 56,000 reused", resultTone: "amber", measuredHow: "no follow-up measured", learningKept: "incomplete" },
  { id: "rate-your-delivery", what: "Rate-your-delivery prompt", when: "2022", result: "241,000 rated · +6 pts retention", resultTone: "neutral", measuredHow: "holdout · 10%", learningKept: "validated · low lift" },
  { id: "group-ordering-launch", what: "Group ordering launch", when: "2024", result: "94,000 · highest orders/month", resultTone: "teal", measuredHow: "no holdout", learningKept: "never promoted" },
  { id: "prompt-toward-scheduled", what: "Prompt toward scheduled delivery", when: "never", whenTone: "amber", result: "untried · +38 pts available", resultTone: "amber", measuredHow: "—", learningKept: "never proposed" },
];

// ---- Compare periods (AD12) -----------------------------------------------

export const ADOPT_COMPARE_ROWS: CompareRow[] = [
  { id: "avg-features-per-customer", metric: "Average features per customer", before: "2.6", after: "2.1", change: "−0.5", changeTone: "rose", whatMovedIt: "Scheduled delivery, almost entirely" },
  { id: "adopting-2-or-more", metric: "Adopting · 2 or more", before: "41.1%", after: "34.4%", change: "−6.7 pts", changeTone: "rose", whatMovedIt: "−4.1 scheduling, −1.9 guest dilution" },
  { id: "scheduled-delivery-second-use", metric: "Scheduled delivery · second use", before: "71.4%", after: "45.2%", change: "−26.2 pts", changeTone: "rose", whatMovedIt: "The fee, met weekly instead of occasionally" },
  { id: "saved-addresses-second-use", metric: "Saved addresses · second use", before: "90.1%", after: "90.5%", change: "+0.4 pts", changeTone: "teal", whatMovedIt: "Unaffected · rules out a general cause" },
  { id: "order-again-second-use", metric: "Order again · second use", before: "—", after: "78.6%", change: "new", changeTone: "teal", whatMovedIt: "Shipped 18 March" },
  { id: "loyalty-tiers-compare", metric: "Loyalty tiers", before: "Unavailable", after: "Unavailable", change: "—", changeTone: "neutral", whatMovedIt: "No event, before or after" },
];

// ---- Request instrumentation (AD13, stage-specific modal) -----------------

export type ProposedEvent = { id: string; name: string; description: string };
export type UnblockRow = { label: string; value: string; tone: "neutral" | "amber" | "rose" };

export type RequestInstrumentationPreset = {
  subtitle: string;
  invisibleTitle: string;
  invisibleBody: string;
  needsEyebrow: string;
  events: ProposedEvent[];
  unblockEyebrow: string;
  unblockRows: UnblockRow[];
  obligationTitle: string;
  obligationBody: string;
};

export const ADOPT_REQUEST_INSTRUMENTATION_PRESET: RequestInstrumentationPreset = {
  subtitle: "Loyalty tiers · live 118 days with no reading",
  invisibleTitle: "Loyalty tiers · renamed 19 April",
  invisibleBody: "118 days live · no event · cannot be evaluated at all",
  needsEyebrow: "What Flolyt needs",
  events: [
    { id: "tier-shown", name: "loyalty.tier_shown", description: "when a customer sees their tier" },
    { id: "tier-changed", name: "loyalty.tier_changed", description: "when they move between tiers" },
    { id: "reward-redeemed", name: "loyalty.reward_redeemed", description: "when a tier benefit is used" },
  ],
  unblockEyebrow: "What this would unblock",
  unblockRows: [
    { label: "Adopt · features", value: "one of seven rows stops reading unavailable", tone: "neutral" },
    { label: "Adopt · what changed", value: "the April rename becomes evaluable", tone: "amber" },
    { label: "Advocate", value: "tier-driven referral behaviour, currently invisible", tone: "amber" },
    { label: "A 2026 decision", value: "whether to keep the rename or revert it", tone: "rose" },
  ],
  obligationTitle: "This becomes an obligation, not a message",
  obligationBody:
    "It goes to Engineering with an owner, a date and a state, and it appears on their handoff load. Engineering currently holds 41 obligations, 14 of them overdue and 11 of those instrumentation — which is context this request will arrive with.",
};
