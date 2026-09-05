/**
 * Mock content for the Churn stage — screens CH01-CH12 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/ (CH13 "the whole
 * lifecycle, closed" lives at chain/index.tsx, not here). Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "CH06 · Churn · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { LeakRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
import type { InsightCard } from "@/pages/everyday/lifecycle/stage/activate/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import type { SendReasonUpstreamPreset } from "@/pages/everyday/lifecycle/stage/modals/send-reason-upstream-modal";

// ---- Shared across Definition/Overview/Agents (CH01/CH02/CH09) -----------

export const CHURN_ASSIGN_OWNER_PRESET: AssignOwnerPreset = {
  description: "Four breached thresholds route somewhere the moment somebody's name is on this",
  unownedTitle: "Unowned since 12 January",
  statsLine: "22 agent findings · 0 rooms · 4 breached thresholds · 31 unopened weekly lists",
  candidatesEyebrow: "Who should own it",
  candidates: [
    { id: "ngozi-bello", initials: "NB", color: "#2E8B7F", name: "Ngozi Bello", reason: "Already owns Renew, the stage every churned customer passed through last", selected: true },
    { id: "zainab-yusuf", initials: "ZY", color: "#7A5AA8", name: "Zainab Yusuf", reason: "Owns Activate · 51.8% of churn is attributed there" },
    { id: "amara-obi", initials: "AO", color: "#C56A2E", name: "Amara Obi", reason: "Owns Support · silent failures are the second-largest unowned reason" },
  ],
  consequencesEyebrow: "What happens the moment you assign",
  consequences: [
    { label: "Four breached thresholds route somewhere", value: "and open four rooms tonight", tone: "amber" },
    { label: "22 agent findings are delivered", value: "in tomorrow's 06:00 digest", tone: "teal" },
    { label: "The prediction model gets a first action", value: "₦31M · one approval, one wave", tone: "teal" },
    { label: "31 weekly lists stop going unopened", value: "starting with this week's", tone: "teal" },
    { label: "Their load", value: "Ngozi already owns Renew and 1 open room", tone: "amber" },
  ],
  closingTitle: "Assigning this is the cheapest action available in the workspace today",
  closingBody:
    "No engineering, no budget, no customer contact. One name against the stage every other stage empties into, and 31 weekly prediction lists stop being generated for nobody. It has been available since 12 January.",
  confirmLabel: "Assign Ngozi",
};

// ---- Definition (CH01) -----------------------------------------------------

export type ChurnDefinitionRow = {
  id: string;
  definition: string;
  churnedYr: string;
  churnedYrTone: "rose" | "amber" | "teal" | "ink";
  monthlyRate: string;
  monthlyRateTone: "rose" | "amber" | "teal" | "ink";
  returnUnaided: string;
  returnUnaidedTone: "rose" | "amber" | "teal";
  winbackResponse: string;
  winbackResponseTone: "rose" | "amber" | "teal";
  verdict: string;
  verdictTone: ChipTone;
};

export const CHURN_DEFINITION = {
  title: "What counts as churned",
  subtitle: "Churn · owning team Customer Success · no owner assigned since 12 January",
  insightTitle: "Churn is a date somebody chose, not an event that happened",
  insightBody:
    "Almost nobody tells you they have left. A consumer stops ordering and at some point you decide they are gone. Where that line sits changes the churn rate, the win-back window, the forecast and the size of every cohort — which is why this is the most consequential definition in the lifecycle and the one most often set by accident.",
  candidatesEyebrow: "A customer has churned when",
  candidates: [
    {
      id: "cancel-or-delete",
      label: "They cancel or delete their account",
      description: "Honest, and it counts 5% of the people who actually left.",
      field: "billing + identity · 67,000 / yr",
    },
    {
      id: "60-days-no-order",
      label: "60 days pass with no order",
      description: "Too aggressive. 31% of these come back on their own within 90 days.",
      field: "orders · 1.41M / yr",
    },
    {
      id: "90-days-no-order",
      label: "90 days pass with no order",
      description: "Where the return rate collapses to 4.2%. The same cliff Retain uses, one stage later.",
      field: "orders · 1.02M / yr · 3.1%/mo",
      selected: true,
    },
  ],
  tableEyebrow: "What moving the line by thirty days would do",
  rows: [
    { id: "30-days", definition: "30 days no order", churnedYr: "2.14M", churnedYrTone: "rose", monthlyRate: "6.1%", monthlyRateTone: "rose", returnUnaided: "48.1%", returnUnaidedTone: "rose", winbackResponse: "31.4%", winbackResponseTone: "teal", verdict: "counts живых customers", verdictTone: "rose" },
    { id: "60-days", definition: "60 days", churnedYr: "1.41M", churnedYrTone: "amber", monthlyRate: "4.4%", monthlyRateTone: "amber", returnUnaided: "31.1%", returnUnaidedTone: "amber", winbackResponse: "16.1%", winbackResponseTone: "teal", verdict: "still too early", verdictTone: "amber" },
    { id: "90-days-current", definition: "90 days · current", churnedYr: "1.02M", churnedYrTone: "ink", monthlyRate: "3.1%", monthlyRateTone: "ink", returnUnaided: "4.2%", returnUnaidedTone: "teal", winbackResponse: "4.2%", winbackResponseTone: "amber", verdict: "the cliff", verdictTone: "teal" },
    { id: "120-days", definition: "120 days", churnedYr: "881,000", churnedYrTone: "teal", monthlyRate: "2.6%", monthlyRateTone: "teal", returnUnaided: "1.1%", returnUnaidedTone: "teal", winbackResponse: "1.1%", winbackResponseTone: "rose", verdict: "flatters the rate", verdictTone: "amber" },
    { id: "180-days", definition: "180 days", churnedYr: "612,000", churnedYrTone: "teal", monthlyRate: "1.8%", monthlyRateTone: "teal", returnUnaided: "0.2%", returnUnaidedTone: "teal", winbackResponse: "0.4%", winbackResponseTone: "rose", verdict: "a vanity number", verdictTone: "rose" },
  ] satisfies ChurnDefinitionRow[],
  closingTitle: "Every row on this table is the same company",
  closingBody:
    "Churn is 1.8% a month or 6.1% a month depending only on where the line is drawn. Moving it to 180 days would halve the reported rate and change nothing about the business. Flolyt fixes it at the point where unaided return collapses — 90 days — and shows the alternatives so nobody can quietly move it later.",
};

// ---- Overview (CH02) --------------------------------------------------------

export const CHURN_OVERVIEW_LEAD = {
  title: "The second stage with no owner, and the one every other stage empties into",
  body: "1.02M customers left in twelve months. Nothing here is a cause — every reason on this screen was decided in one of the nine stages before it.",
};

export const CHURN_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Churned · 12 months", value: "1.02M", note: "3.1% a month" },
  { eyebrow: "At stake", value: "₦124M", tone: "rose", note: "the recoverable share" },
  { eyebrow: "Reason known", value: "31.4%", tone: "amber", note: "the rest is inferred or blank" },
  { eyebrow: "Ever won back", value: "4.2%", tone: "rose", note: "of those contacted" },
];

export const CHURN_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "never-activated-left-inside-90-days",
    where: "Never activated · left inside 90 days",
    customers: "528,000",
    value: "₦61M",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · Activate", tone: "ultra" },
    room: { label: "open · Activate", tone: "amber" },
  },
  {
    id: "churned-after-a-fee-complaint",
    where: "Churned after a fee complaint",
    customers: "94,000",
    value: "₦31M",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · 4 Mar", tone: "ultra" },
    room: { label: "open · 8f2c", tone: "amber" },
  },
  {
    id: "silent-failure-never-told-us",
    where: "Silent failure · never told us",
    customers: "39,600",
    value: "₦18M",
    valueTone: "rose",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "causal · Support", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "card-failed-never-recovered",
    where: "Card failed, never recovered",
    customers: "14,200",
    value: "₦9M",
    valueTone: "amber",
    trend: "improving",
    trendTone: "teal",
    causeKnown: { label: "causal · Renew", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "no-reason-found",
    where: "No reason found",
    customers: "196,000",
    value: "₦5M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "nothing", tone: "amber" },
    room: { label: "No owner", tone: "amber" },
  },
];

export const CHURN_OVERVIEW_INSIGHT = {
  title: "Four of five rows point at another stage, and that is the correct answer",
  body: "Churn is not a problem to be solved in Churn. It is where nine stages' unresolved problems arrive, counted honestly, several months late. The only work that belongs here is measuring what left, naming why, and getting the reason back to the stage that can act on it.",
};

export const CHURN_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Never activated, left inside 90 days",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "last 12 months" },
    { label: "Never activated", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "528,000 customers · ₦61M at stake",
  countedNote: "Counted 6 minutes ago · 58.5% of post-March cohorts",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

export const CHURN_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Churn · overview · Nigeria",
  snapshotLabel: "Churn · overview · Nigeria · as of 13 Aug 08:12",
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
    "19.2% of churn has no reason found and Ghana's reason data is unavailable entirely. Both travel with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Send the reason upstream (CH12, churn-only modal) ----------------------
// Declared ahead of the Reasons rows below so the "Never activated" row can
// reference it directly.

export const CHURN_SEND_UPSTREAM_PRESET: SendReasonUpstreamPreset = {
  description: "Churn cannot fix anything · it can name what left and tell the right stage",
  findingTitle: "528,000 churned without ever activating",
  findingMeta: "58.5% of post-March cohorts · median 48 days alive · ₦61M",
  sendToEyebrow: "Send it to",
  recipients: [
    { id: "activate-zainab", color: "#4C5FD5", name: "Activate · Zainab Yusuf", reason: "Owns the stage where these customers were lost", selected: true },
    { id: "retain-ifeoma", color: "#CFD4DF", name: "Retain · Ifeoma Nwosu", reason: "Owns the 90-day window · they never reached it" },
    { id: "room-8f2c", color: "#CFD4DF", name: "Room 8f2c", reason: "Already open on the same cause · add as evidence" },
  ],
  arrivesEyebrow: "What it arrives as",
  arrivesRows: [
    { label: "A finding, not a ticket", value: "evidence in their stage, with this stage cited" },
    { label: "Carrying the customers", value: "528,000 · still 61% reachable", tone: "teal" },
    { label: "And the counterfactual", value: "Jan–Feb cohorts churned at 47.9% on the same measure" },
    { label: "Logged both ends", value: "visible here and there · neither side can lose it" },
  ],
  closingTitle: "This is the only action that genuinely belongs in Churn",
  closingBody:
    "Nothing here can be fixed here. The work of this stage is to name what left, attribute it honestly, and get that back to the stage that can act — which is why the primary control on the reasons screen sends a finding upstream rather than starting a campaign.",
  confirmLabel: "Send to Activate",
};

// ---- Reasons (CH03, unique tab) ---------------------------------------------

export type ChurnReasonRow = {
  id: string;
  reason: string;
  customers: string;
  share: string;
  shareTone: "rose" | "amber" | "neutral";
  howWeKnow: string;
  howWeKnowTone: "ultra" | "teal" | "rose" | "amber";
  department?: { name: string; color: string };
  departmentChip?: { label: string; tone: ChipTone };
  vsFeb: string;
  vsFebTone: "rose" | "teal" | "neutral";
  actionable: string;
  actionableTone: ChipTone;
  /** Only "Never activated" has a modal preset — CH12 sends that exact finding upstream. */
  sendUpstreamPreset?: SendReasonUpstreamPreset;
};

export const CHURN_REASON_ROWS: ChurnReasonRow[] = [
  {
    id: "never-activated",
    reason: "Never activated",
    customers: "528,000",
    share: "51.8%",
    shareTone: "rose",
    howWeKnow: "inferred · order history",
    howWeKnowTone: "ultra",
    department: { name: "Product", color: "#7A5AA8" },
    vsFeb: "+8.1",
    vsFebTone: "rose",
    actionable: "yes · upstream",
    actionableTone: "teal",
    sendUpstreamPreset: CHURN_SEND_UPSTREAM_PRESET,
  },
  {
    id: "price-or-fee",
    reason: "Price or fee",
    customers: "94,000",
    share: "9.2%",
    shareTone: "amber",
    howWeKnow: "stated · pause reasons",
    howWeKnowTone: "teal",
    department: { name: "Engineering", color: "#4E7080" },
    vsFeb: "+4.9",
    vsFebTone: "rose",
    actionable: "yes · shipped Aug",
    actionableTone: "teal",
  },
  {
    id: "delivery-experience",
    reason: "Delivery experience",
    customers: "71,000",
    share: "7.0%",
    shareTone: "amber",
    howWeKnow: "inferred · delivery feed",
    howWeKnowTone: "ultra",
    department: { name: "Support", color: "#C56A2E" },
    vsFeb: "+0.4",
    vsFebTone: "neutral",
    actionable: "yes",
    actionableTone: "teal",
  },
  {
    id: "payment-failure",
    reason: "Payment failure",
    customers: "14,200",
    share: "1.4%",
    shareTone: "neutral",
    howWeKnow: "stated · billing",
    howWeKnowTone: "teal",
    department: { name: "Finance", color: "#5D6BB8" },
    vsFeb: "−1.1",
    vsFebTone: "teal",
    actionable: "yes",
    actionableTone: "teal",
  },
  {
    id: "moved-away-or-stopped-needing-it",
    reason: "Moved away or stopped needing it",
    customers: "41,000",
    share: "4.0%",
    shareTone: "neutral",
    howWeKnow: "stated · cancellation",
    howWeKnowTone: "teal",
    departmentChip: { label: "nobody", tone: "neutral" },
    vsFeb: "−0.2",
    vsFebTone: "neutral",
    actionable: "no",
    actionableTone: "neutral",
  },
  {
    id: "competitor",
    reason: "Competitor",
    customers: "Unavailable",
    share: "Unavailable",
    shareTone: "neutral",
    howWeKnow: "no source",
    howWeKnowTone: "rose",
    departmentChip: { label: "nobody", tone: "neutral" },
    vsFeb: "—",
    vsFebTone: "neutral",
    actionable: "unknown",
    actionableTone: "amber",
  },
  {
    id: "no-reason-found",
    reason: "No reason found",
    customers: "196,000",
    share: "19.2%",
    shareTone: "amber",
    howWeKnow: "nothing matched",
    howWeKnowTone: "amber",
    departmentChip: { label: "No owner", tone: "amber" },
    vsFeb: "−3.4",
    vsFebTone: "teal",
    actionable: "not yet",
    actionableTone: "amber",
  },
];

export const CHURN_REASONS_INSIGHT = {
  title: "19.2% has no reason and Flolyt will not give it one",
  body: "196,000 customers left and nothing in any connected source explains it. It would be easy to distribute them proportionally across the known reasons and produce a tidy pie chart. That would make the largest single category disappear into the others and quietly overstate every one of them.",
};

export const CHURN_REASONS_SPLIT_ROWS: { label: string; value: string; tone: "teal" | "ultra" | "amber" | "neutral" }[] = [
  { label: "Stated · the customer told us", value: "149,200 · 14.6% · cancellation and pause reasons", tone: "teal" },
  { label: "Inferred · behaviour we can read", value: "670,800 · 65.8% · order, delivery and billing history", tone: "ultra" },
  { label: "Neither", value: "196,000 · 19.2%", tone: "amber" },
  { label: "Why they are never merged", value: "a stated reason is evidence · an inferred one is a hypothesis", tone: "neutral" },
  { label: "Where the two disagree", value: "8,100 customers said “moved away” and kept ordering elsewhere in the app", tone: "amber" },
];

// ---- Prediction (CH04, unique tab) ------------------------------------------

export const CHURN_PREDICTION_KPIS: Kpi[] = [
  { eyebrow: "Predicted to churn in 30 days", value: "118,000", note: "at 71% precision" },
  { eyebrow: "Value behind them", value: "₦188M", tone: "rose", note: "if none are reached" },
  { eyebrow: "Currently being contacted", value: "0", tone: "rose", note: "no play, no owner" },
  { eyebrow: "Predicted last month", value: "112,000", tone: "amber", note: "of which 79,400 did churn" },
];

export type ChurnPredictionSignalRow = {
  id: string;
  signal: string;
  weight: string;
  available: string;
  availableTone: ChipTone;
  department?: { name: string; color: string };
  departmentChip?: { label: string; tone: ChipTone };
  leadTime: string;
  leadTimeTone: "teal" | "rose" | "neutral";
};

export const CHURN_PREDICTION_SIGNAL_ROWS: ChurnPredictionSignalRow[] = [
  { id: "days-since-last-order", signal: "Days since last order", weight: "31%", available: "yes", availableTone: "teal", department: { name: "Marketing", color: "#79883A" }, leadTime: "14 days", leadTimeTone: "teal" },
  { id: "scheduled-delivery-cancelled", signal: "Scheduled delivery cancelled", weight: "22%", available: "yes", availableTone: "teal", department: { name: "Product", color: "#7A5AA8" }, leadTime: "31 days", leadTimeTone: "teal" },
  { id: "feature-usage-falling", signal: "Feature usage falling", weight: "18%", available: "yes", availableTone: "teal", department: { name: "Product", color: "#7A5AA8" }, leadTime: "28 days", leadTimeTone: "teal" },
  { id: "support-contact-fees-delivery", signal: "Support contact about fees or delivery", weight: "14%", available: "yes", availableTone: "teal", department: { name: "Support", color: "#C56A2E" }, leadTime: "41 days", leadTimeTone: "teal" },
  { id: "referral-activity-stopping", signal: "Referral activity stopping", weight: "9%", available: "yes", availableTone: "teal", departmentChip: { label: "No owner", tone: "amber" }, leadTime: "47 days", leadTimeTone: "teal" },
  { id: "basket-composition-change", signal: "Basket composition change", weight: "—", available: "no · order_lines", availableTone: "rose", department: { name: "Engineering", color: "#4E7080" }, leadTime: "—", leadTimeTone: "neutral" },
  { id: "competitor-app-installed", signal: "Competitor app installed", weight: "—", available: "no source", availableTone: "rose", departmentChip: { label: "nobody", tone: "neutral" }, leadTime: "—", leadTimeTone: "neutral" },
];

export const CHURN_PREDICTION_INSIGHT = {
  title: "The earliest signal in the model comes from the stage with no owner",
  body: "Referral activity stopping predicts churn 47 days out — the longest lead time of anything available. It is 9% of the model's weight and it is produced by a stage nobody watches. The single best early-warning signal in this company arrives at an empty desk.",
};

export const CHURN_PREDICTION_CARDS: InsightCard[] = [
  {
    id: "predicted-ranked-untouched",
    agentTag: "CH",
    meta: "118,000 customers · ₦188M",
    title: "Predicted, ranked, and untouched",
    body: "The model has run weekly since January at 71% precision. It has produced 31 weekly lists. No play has ever been built from one, because building a play needs an owner.",
    footnote: "31 lists, 0 actions",
    tone: "rose",
  },
  {
    id: "what-71-percent-means",
    agentTag: "CH",
    meta: "What 71% precision means here",
    title: "Good enough to act, not to automate",
    body: "Contacting all 118,000 would reach 33,000 people who were never going to leave. At a ₦140 cost per contact inside the window that is defensible — it is a judgement, and it needs a person to make it.",
    footnote: "the judgement nobody owns",
    tone: "amber",
  },
  {
    id: "the-cheapest-version",
    agentTag: "CH",
    meta: "The cheapest version",
    title: "The top decile only",
    body: "11,800 customers at 91% precision, ₦31M at stake, ₦1.7M to contact. It would take one approval and one wave and has never been proposed.",
    footnote: "₦31M · one approval",
    tone: "teal",
  },
];

export const CHURN_PREDICTION_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Predicted to churn in 30 days",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "this week's list" },
    { label: "Predicted", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "118,000 customers · ₦188M at stake",
  countedNote: "Counted 6 minutes ago · 71% precision, 0 currently contacted",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- Win-back (CH05, unique tab) --------------------------------------------

export const CHURN_WINBACK_KPIS: Kpi[] = [
  { eyebrow: "Churned and reachable", value: "812,000", tone: "amber", note: "of 1.02M" },
  { eyebrow: "Contacted in 12 months", value: "94,000", tone: "rose", note: "11.6% of them" },
  { eyebrow: "Won back", value: "3,900", tone: "rose", note: "4.2% of those contacted" },
  { eyebrow: "Cost per recovery", value: "₦8,100", tone: "rose", note: "against ₦1,840 CAC" },
];

export const CHURN_WINBACK_COST_INSIGHT = {
  title: "Winning back a churned customer costs 4.4 times more than acquiring a new one",
  body: "That is not an argument against win-back — a recovered customer knows the product and repeats better. It is an argument for doing it before day 90, which is Retain's job, and for treating anything after that as expensive salvage rather than a growth channel.",
};

export type ChurnWinbackRow = {
  id: string;
  campaign: string;
  sent: string;
  daysSince: string;
  daysSinceTone: "rose" | "amber" | "neutral";
  offer: string;
  offerTone: "rose" | "teal" | "neutral";
  wonBack: string;
  wonBackTone: "rose" | "teal" | "amber" | "neutral";
  costPerRecovery: string;
  costPerRecoveryTone: "rose" | "teal" | "neutral";
  verdict: string;
  verdictTone: ChipTone;
};

export const CHURN_WINBACK_ROWS: ChurnWinbackRow[] = [
  { id: "annual-we-miss-you", campaign: "Annual “we miss you”", sent: "61,000", daysSince: "180+", daysSinceTone: "rose", offer: "30% off", offerTone: "rose", wonBack: "2.1%", wonBackTone: "rose", costPerRecovery: "₦14,200", costPerRecoveryTone: "rose", verdict: "stop it", verdictTone: "rose" },
  { id: "post-fee-fix-outreach-aug", campaign: "Post-fee-fix outreach · Aug", sent: "18,900", daysSince: "90–150", daysSinceTone: "amber", offer: "none · a fix notice", offerTone: "teal", wonBack: "9.4%", wonBackTone: "teal", costPerRecovery: "₦1,490", costPerRecoveryTone: "teal", verdict: "best result", verdictTone: "teal" },
  { id: "failed-delivery-apology-late", campaign: "Failed-delivery apology · late", sent: "8,200", daysSince: "90–120", daysSinceTone: "amber", offer: "refund + credit", offerTone: "teal", wonBack: "11.1%", wonBackTone: "teal", costPerRecovery: "₦2,100", costPerRecoveryTone: "teal", verdict: "works", verdictTone: "teal" },
  { id: "expired-card-prompt", campaign: "Expired card prompt", sent: "5,900", daysSince: "90+", daysSinceTone: "amber", offer: "none", offerTone: "teal", wonBack: "6.1%", wonBackTone: "amber", costPerRecovery: "₦900", costPerRecoveryTone: "teal", verdict: "cheapest", verdictTone: "teal" },
  { id: "everyone-else", campaign: "Everyone else", sent: "718,000", daysSince: "any", daysSinceTone: "neutral", offer: "never contacted", offerTone: "rose", wonBack: "—", wonBackTone: "neutral", costPerRecovery: "—", costPerRecoveryTone: "neutral", verdict: "untouched", verdictTone: "amber" },
];

export const CHURN_WINBACK_CLOSING = {
  title: "The one campaign with a discount performed worst by a factor of five",
  body: "“We miss you, here is 30% off” recovers 2.1% at ₦14,200 each. Telling people the specific thing they complained about has been fixed recovers 9.4% at ₦1,490. Business memory has held “fee transparency beats discounting on reactivation” since August and this table is the second, independent confirmation of it.",
};

export const CHURN_WINBACK_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Annual “we miss you” campaign underperforming",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "last 12 months" },
    { label: "Campaign", value: "annual “we miss you”" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "61,000 sent · 2.1% won back",
  countedNote: "Counted 6 minutes ago · costs 4.4× more than the best-performing campaign",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- Cohorts (CH06, stage-specific layout) ----------------------------------

export type ChurnCohortRow = {
  id: string;
  cohort: string;
  acquired: string;
  churnedBy180d: string;
  rate: string;
  rateTone: "teal" | "rose" | "neutral";
  neverActivated: string;
  neverActivatedTone: "teal" | "rose" | "neutral";
  medianDaysAlive: string;
  medianDaysAliveTone: "teal" | "rose" | "neutral";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const CHURN_COHORT_ROWS: ChurnCohortRow[] = [
  { id: "january", cohort: "January", acquired: "61,200", churnedBy180d: "34,900", rate: "57.0%", rateTone: "teal", neverActivated: "47.9%", neverActivatedTone: "teal", medianDaysAlive: "71", medianDaysAliveTone: "teal", vsFeb: "+0.4", vsFebTone: "teal" },
  { id: "february", cohort: "February", acquired: "64,900", churnedBy180d: "37,100", rate: "57.2%", rateTone: "teal", neverActivated: "47.9%", neverActivatedTone: "teal", medianDaysAlive: "70", medianDaysAliveTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", acquired: "82,100", churnedBy180d: "55,500", rate: "67.6%", rateTone: "rose", neverActivated: "58.5%", neverActivatedTone: "rose", medianDaysAlive: "48", medianDaysAliveTone: "rose", vsFeb: "+10.4", vsFebTone: "rose" },
  { id: "april", cohort: "April", acquired: "78,300", churnedBy180d: "53,300", rate: "68.1%", rateTone: "rose", neverActivated: "58.9%", neverActivatedTone: "rose", medianDaysAlive: "47", medianDaysAliveTone: "rose", vsFeb: "+10.9", vsFebTone: "rose" },
  { id: "may", cohort: "May", acquired: "77,600", churnedBy180d: "52,600", rate: "67.8%", rateTone: "rose", neverActivated: "58.0%", neverActivatedTone: "rose", medianDaysAlive: "48", medianDaysAliveTone: "rose", vsFeb: "+10.6", vsFebTone: "rose" },
  { id: "june", cohort: "June", acquired: "76,100", churnedBy180d: "Unavailable", rate: "Unavailable", rateTone: "neutral", neverActivated: "59.4%", neverActivatedTone: "rose", medianDaysAlive: "Unavailable", medianDaysAliveTone: "neutral", vsFeb: "—", vsFebTone: "neutral" },
];

export const CHURN_COHORT_CLOSING = {
  title: "Median days alive fell from 70 to 48 in the week of 4 March",
  body: "Post-March customers do not just churn more, they churn 22 days sooner — inside the win-back window rather than outside it. That is the one genuinely good thing on this screen: a customer who leaves at day 48 is still reachable, and 528,000 of them are sitting in the untouched row of the win-back table.",
};

export const CHURN_COHORT_ATTRIBUTION_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Never activated · the fee at checkout", value: "+8.1 pts", percent: 78, tone: "rose" },
  { label: "Fee complaint after activating", value: "+1.7 pts", percent: 16, tone: "rose" },
  { label: "Everything else", value: "+0.6 pts", percent: 6, tone: "amber" },
];

export const CHURN_COHORTS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "March cohort churn spike",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Cohort", value: "March" },
    { label: "Measured at", value: "180 days" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "82,100 acquired · 67.6% churned by 180 days",
  countedNote: "Counted 6 minutes ago · +10.4 pts vs February",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- Markets (CH07, stage-specific layout) ----------------------------------

export type ChurnMarketRow = {
  id: string;
  market: string;
  churnedYr: string;
  monthlyRate: string;
  monthlyRateTone: "rose" | "teal";
  reasonKnown: string;
  reasonKnownTone: "amber" | "teal" | "rose";
  reachable: string;
  reachableTone: "teal" | "amber";
  everContacted: string;
  everContactedTone: "rose" | "amber" | "teal";
  atStake: string;
  atStakeTone: "rose" | "amber" | "neutral";
  trend: "worsening" | "flat" | "improving";
};

export const CHURN_MARKET_ROWS: ChurnMarketRow[] = [
  { id: "nigeria", market: "Nigeria", churnedYr: "781,000", monthlyRate: "3.4%", monthlyRateTone: "rose", reasonKnown: "32.1%", reasonKnownTone: "amber", reachable: "79.4%", reachableTone: "teal", everContacted: "12.1%", everContactedTone: "rose", atStake: "₦98M", atStakeTone: "rose", trend: "worsening" },
  { id: "kenya", market: "Kenya", churnedYr: "121,000", monthlyRate: "2.1%", monthlyRateTone: "teal", reasonKnown: "41.4%", reasonKnownTone: "teal", reachable: "88.1%", reachableTone: "teal", everContacted: "18.4%", everContactedTone: "amber", atStake: "KES 8.1M", atStakeTone: "amber", trend: "flat" },
  { id: "ghana", market: "Ghana", churnedYr: "94,000", monthlyRate: "4.1%", monthlyRateTone: "rose", reasonKnown: "Unavailable", reasonKnownTone: "rose", reachable: "71.1%", reachableTone: "amber", everContacted: "0%", everContactedTone: "rose", atStake: "GHS 2.1M", atStakeTone: "rose", trend: "worsening" },
  { id: "uk", market: "United Kingdom", churnedYr: "28,000", monthlyRate: "1.6%", monthlyRateTone: "teal", reasonKnown: "48.1%", reasonKnownTone: "teal", reachable: "91.4%", reachableTone: "teal", everContacted: "31.1%", everContactedTone: "teal", atStake: "£41k", atStakeTone: "neutral", trend: "improving" },
];

export const CHURN_MARKET_CLOSING = {
  title: "Ghana has the highest churn rate, no reason data, and has never been sent a win-back",
  body: "94,000 customers a year leave a market where the delivery feed is not connected, so no reason can be inferred, and where no win-back campaign has ever run. Ghana's churn is the only figure on this screen that is both worst and completely unexplained.",
};

export type GhanaStageRow = {
  id: string;
  stage: string;
  reading: string;
  rank: string;
  rankTone: "rose" | "amber" | "neutral";
  owner?: { name: string; initials: string; color: string };
  noOwner?: boolean;
};

export const CHURN_GHANA_ACROSS_STAGES_ROWS: GhanaStageRow[] = [
  { id: "acquire", stage: "Acquire", reading: "CAC ₦6,026 · conversion 4.1%", rank: "4th", rankTone: "rose", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "activate", stage: "Activate", reading: "33.0% · slowest time to value", rank: "4th", rankTone: "rose", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "price", stage: "Price", reading: "22% premium, unrevised since 2024", rank: "4th", rankTone: "rose", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
  { id: "adopt", stage: "Adopt", reading: "1.6 features", rank: "4th", rankTone: "rose", owner: { name: "Zainab", initials: "ZY", color: "#7A5AA8" } },
  { id: "retain", stage: "Retain", reading: "fee ships 14 September", rank: "—", rankTone: "amber", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
  { id: "expand", stage: "Expand", reading: "12.5% · lowest ARPU multiple", rank: "4th", rankTone: "rose", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "support", stage: "Support", reading: "2.9 hr resolution · silent failures unmeasurable", rank: "4th", rankTone: "rose", owner: { name: "Amara", initials: "AO", color: "#C56A2E" } },
  { id: "renew", stage: "Renew", reading: "still retrying cards at midnight", rank: "4th", rankTone: "rose", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "advocate", stage: "Advocate", reading: "6.4% referral rate", rank: "4th", rankTone: "rose", noOwner: true },
  { id: "churn", stage: "Churn", reading: "4.1%/mo · no reason data · never contacted", rank: "4th", rankTone: "rose", noOwner: true },
];

export const CHURN_GHANA_CLOSING = {
  title: "Ten stages, nine worst-in-class readings, eight different owners, and one room with nobody on it",
  body: "No individual owner is wrong to treat Ghana as a small market with a local problem. This table only exists because the ten stages sit on one page — and it is the strongest argument in the whole product for why they do.",
};

export const CHURN_MARKETS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Ghana has no reason data and no win-back history",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "last 12 months" },
    { label: "Markets", value: "Ghana" },
    { label: "Reason known", value: "Unavailable" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "94,000 customers · GHS 2.1M at stake",
  countedNote: "Counted 6 minutes ago · worst rank of four markets, nine of ten stages",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- What changed (CH08) -----------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (CH09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const CHURN_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Predicted churn exceeds a threshold", note: "30-day prediction model output" },
  byMoreThan: { label: "By more than", value: "50,000 customers", note: "against the trailing weekly list" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately once the weekly list is produced" },
  segmentedBy: { label: "Segmented by", value: "market, reason", note: "so Ghana's blind spot is findable, not averaged away" },
  routesTo: {
    name: "The Churn stage owner",
    note: "This rule currently has no destination — the stage has no owner",
  },
  simulation: {
    title: "Against the last twelve months, this would have fired thirty-one times",
    body: "Every week since 12 January, when the prediction model went live. It has never opened a room because the rule routes to a stage owner and that condition has no owner assigned.",
  },
};

// ---- History (CH10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (CH11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
