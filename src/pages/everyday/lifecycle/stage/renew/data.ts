/**
 * Mock content for the Renew stage — screens RN01-RN13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "RN06 · Renew · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { LeakRow, ChangeRow, AgentCard, ThresholdRow, GoalRow, TriedRow, CompareRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { ReForecastBookPreset } from "@/pages/everyday/lifecycle/stage/modals/re-forecast-the-book-modal";

// ---- Definition (RN01) -------------------------------------------------

export type RenewOutcomeRow = {
  id: string;
  outcome: string;
  customersPerYr: string;
  value: string;
  valueTone: "teal" | "amber" | "rose";
  choseIt: string;
  choseItTone: ChipTone;
  recoverable: string;
  recoverableTone: "teal" | "amber" | "neutral";
  owner?: { name: string; color: string };
  noOwner?: boolean;
};

export const RENEW_DEFINITION = {
  title: "What counts as renewal",
  subtitle: "Renew · owned by Customer Success · last changed 12 January by Kunle Ade",
  insightTitle: "Renewal separates the customers who decided to leave from the ones whose card failed",
  insightBody:
    "Both look identical in a revenue report and they are completely different problems. One needs a conversation, the other needs a retry at a different hour. Conflating them is why involuntary churn is the cheapest revenue in most companies and the last to be recovered.",
  candidatesEyebrow: "A customer is in Renew when",
  candidates: [
    {
      id: "subscription-comes-up",
      label: "Their subscription comes up for renewal",
      description: "Only the 1.11M on paid plans. Excludes 2.91M pay-as-you-go customers entirely.",
      field: "billing · 1.11M / yr",
    },
    {
      id: "recurring-payment-attempted",
      label: "Any recurring payment is attempted",
      description: "Includes saved-card reorders. Blurs subscription renewal with ordinary payment.",
      field: "payments · 1.31M / yr",
    },
    {
      id: "decision-or-payment-due",
      label: "A renewal decision or a renewal payment is due",
      description: "Both the decision and the mechanism, counted separately and never merged.",
      field: "billing + payments · 1.11M · 88.4% projected",
      selected: true,
    },
  ],
  tableEyebrow: "The split that this stage exists to hold",
  rows: [
    { id: "renewed", outcome: "Renewed", customersPerYr: "981,000", value: "₦2.4B", valueTone: "teal", choseIt: "yes", choseItTone: "teal", recoverable: "—", recoverableTone: "neutral", owner: { name: "Customer Success", color: "#2E8B7F" } },
    { id: "cancelled-deliberately", outcome: "Cancelled deliberately", customersPerYr: "67,000", value: "₦164M", valueTone: "rose", choseIt: "yes", choseItTone: "amber", recoverable: "hard · needs a reason", recoverableTone: "amber", owner: { name: "Customer Success", color: "#2E8B7F" } },
    { id: "paused", outcome: "Paused", customersPerYr: "41,000", value: "₦88M", valueTone: "amber", choseIt: "yes", choseItTone: "amber", recoverable: "moderate · timing", recoverableTone: "amber", owner: { name: "Customer Success", color: "#2E8B7F" } },
    { id: "card-failed", outcome: "Card failed · involuntary", customersPerYr: "61,400", value: "₦88M", valueTone: "rose", choseIt: "no", choseItTone: "rose", recoverable: "easy · a retry", recoverableTone: "teal", owner: { name: "Finance", color: "#5D6BB8" } },
    { id: "lapsed-silently", outcome: "Lapsed silently", customersPerYr: "18,000", value: "₦41M", valueTone: "rose", choseIt: "unknown", choseItTone: "amber", recoverable: "unknown", recoverableTone: "neutral", noOwner: true },
  ] satisfies RenewOutcomeRow[],
  closingTitle: "18,000 customers a year lapse without a cancellation, a pause or a failed payment",
  closingBody:
    "Their subscription simply ends and no event explains why. It is ₦41M and it has no owner because nobody can say which of the four rows above it actually belongs to. Flolyt lists it as its own outcome rather than distributing it across the others.",
};

// ---- Overview (RN02) ----------------------------------------------------

export const RENEW_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Coming up for renewal", value: "1.11M / yr", note: "on paid plans" },
  { eyebrow: "Projected renewal rate", value: "88.4%", tone: "rose", note: "was 91.1%" },
  { eyebrow: "At stake", value: "₦88M", tone: "rose", note: "involuntary only · recoverable" },
  { eyebrow: "Recovered so far", value: "₦62M", tone: "teal", note: "against a holdout" },
];

export const RENEW_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "cards-retried-midnight",
    where: "Cards retried at midnight local",
    customers: "61,400",
    value: "₦88M",
    valueTone: "rose",
    trend: "improving",
    trendTone: "teal",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "closed · ₦62M", tone: "teal" },
  },
  {
    id: "pauses-after-delivery-fee",
    where: "Pauses after the delivery fee",
    customers: "9,100",
    value: "₦22M",
    valueTone: "amber",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · 4 Mar", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "expired-cards-never-prompted",
    where: "Expired cards, never prompted",
    customers: "14,200",
    value: "₦19M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "book-built-on-old-repeat-rate",
    where: "Renewal book built on the old repeat rate",
    customers: "—",
    value: "₦88M overstated",
    valueTone: "rose",
    trend: "—",
    trendTone: "neutral",
    causeKnown: { label: "causal · 2 Aug", tone: "ultra" },
    room: { label: "obligation overdue", tone: "rose" },
    detailHref: "/lifecycle/renew/book",
  },
  {
    id: "lapsed-silently-leak",
    where: "Lapsed silently",
    customers: "18,000",
    value: "₦41M",
    valueTone: "rose",
    trend: "unknown",
    trendTone: "neutral",
    causeKnown: { label: "nothing found", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
];

export const RENEW_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Pauses after the delivery fee",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "last 90 days" },
    { label: "Paused", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "9,100 customers · ₦22M at stake",
  countedNote: "Counted 6 minutes ago · worsening since 4 March",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Ngozi owns the stage, so she owns this",
};

export const RENEW_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Renew · overview · Nigeria",
  snapshotLabel: "Renew · overview · Nigeria · as of 13 Aug 08:12",
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
    "The ₦88M overstatement in the renewal book travels with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Renewal book (RN03, route path "book") ------------------------------

export const RENEW_BOOK_KPIS: Kpi[] = [
  { eyebrow: "Renewing in 90 days", value: "281,000", note: "₦688M" },
  { eyebrow: "Projected to renew", value: "88.4%", tone: "amber", note: "₦608M" },
  { eyebrow: "Book built on", value: "the pre-March repeat rate", tone: "rose", note: "overstated" },
  { eyebrow: "Re-forecast", value: "4 days overdue", tone: "rose", note: "with Kunle Ade" },
];

export const RENEW_BOOK_WARNING = {
  title: "This book is overstated by roughly ₦88M and everyone downstream is using it",
  body: "It was built in July on a 37.4% repeat rate. The actual rate is 27.2%. The re-forecast was obliged by room 8f2c on 2 August, accepted by Kunle, due 9 August, and has not started.",
};

export type RenewBookRow = {
  id: string;
  renewing: string;
  customers: string;
  value: string;
  projectedRate: string;
  projectedRateTone: "amber" | "rose";
  confidence: string;
  confidenceTone: "teal" | "amber" | "rose" | "neutral";
  basis: string;
  basisTone: "teal" | "amber" | "rose" | "neutral";
  owner?: { name: string; initials: string; color: string };
  noOwner?: boolean;
  /** When set, the row's "renewing" label links to its own account drilldown (e.g. RN13's Kano Textiles). */
  detailHref?: string;
};

export const RENEW_BOOK_ROWS: RenewBookRow[] = [
  { id: "within-30-days", renewing: "Within 30 days", customers: "94,000", value: "₦231M", projectedRate: "88.9%", projectedRateTone: "amber", confidence: "low", confidenceTone: "rose", basis: "old repeat rate", basisTone: "rose", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "31-60-days", renewing: "31–60 days", customers: "91,000", value: "₦224M", projectedRate: "88.4%", projectedRateTone: "amber", confidence: "low", confidenceTone: "rose", basis: "old repeat rate", basisTone: "rose", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "61-90-days", renewing: "61–90 days", customers: "96,000", value: "₦233M", projectedRate: "87.9%", projectedRateTone: "amber", confidence: "low", confidenceTone: "rose", basis: "old repeat rate", basisTone: "rose", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "business-90-days", renewing: "Business accounts · 90 days", customers: "212", value: "₦31M", projectedRate: "74.1%", projectedRateTone: "rose", confidence: "medium", confidenceTone: "amber", basis: "seat utilisation", basisTone: "amber", owner: { name: "Tunde", initials: "TB", color: "#B4568F" }, detailHref: "/lifecycle/renew/book/kano-textiles" },
  { id: "business-unowned", renewing: "Business accounts · unowned", customers: "119", value: "₦18M", projectedRate: "Unavailable", projectedRateTone: "rose", confidence: "none", confidenceTone: "rose", basis: "nobody has looked", basisTone: "rose", noOwner: true },
];

export const RENEW_BOOK_CLOSING = {
  title: "Three quarters of a billion naira is being forecast on a number known to be wrong since 2 August",
  body: "The correction is a four-day-overdue obligation held by one person. Until it lands, Finance, the board pack and Ada's projection all carry the same ₦88M error — and none of them can see that they do, because a forecast does not show its own inputs.",
};

export const RENEW_REFORECAST_PRESET: ReForecastBookPreset = {
  description: "Four days overdue · everyone downstream is using the old figure",
  currentAssumptionsEyebrow: "What the book currently assumes",
  currentAssumptions: [
    { label: "90-day repeat rate", value: "37.4% · measured February" },
    { label: "Built", value: "July, from a June extract" },
    { label: "Known wrong since", value: "2 August · room 8f2c" },
  ],
  rebuildEyebrow: "Rebuild it on",
  options: [
    { id: "current-repeat-rate", title: "The current repeat rate · 27.2%", subtitle: "What is actually happening today", selected: true },
    { id: "blended-rate", title: "A blended rate · 31.1%", subtitle: "Weights pre and post March cohorts by how many renew when" },
    { id: "post-fix-projection", title: "Post-fix projection · 33.4%", subtitle: "Assumes the 7 August basket fix works · not yet measured" },
  ],
  numberChange: {
    from: "₦608M",
    to: "₦520M",
    delta: "−₦88M · flows into Ada's projection, the board pack and Finance",
    note: "Everyone currently using the old figure is told, with the reason",
  },
  warningTitle: "The third option is offered and is not the default",
  warningBody:
    "Assuming the August fix works would produce a friendlier number that nobody can defend yet. Flolyt will build it if Kunle chooses it, labelled as a projection on an unmeasured change — but the default is what is currently true.",
};

// ---- Dunning (RN04) ------------------------------------------------------

export const RENEW_DUNNING_KPIS: Kpi[] = [
  { eyebrow: "Cards failing", value: "61,400 / yr", tone: "rose", note: "on renewal night" },
  { eyebrow: "Recovered", value: "₦62M", tone: "teal", note: "of ₦88M · measured" },
  { eyebrow: "Still failing", value: "₦26M", tone: "amber", note: "expired cards, mostly" },
  { eyebrow: "Retry window", value: "09:00 local", tone: "teal", note: "was midnight" },
];

export type RenewDunningRow = {
  id: string;
  window: string;
  attempts: string;
  cleared: string;
  rate: string;
  rateTone: "teal" | "rose";
  note: string;
  state: string;
  stateTone: ChipTone;
};

export const RENEW_DUNNING_ROWS: RenewDunningRow[] = [
  { id: "midnight-until-april", window: "00:00 local · until April", attempts: "12,400", cleared: "3,100", rate: "25.0%", rateTone: "rose", note: "Balance is lowest just after midnight", state: "retired", stateTone: "neutral" },
  { id: "0900-march-test", window: "09:00 local · March test", attempts: "12,400", cleared: "8,900", rate: "71.8%", rateTone: "teal", note: "Same cards, same amounts, nine hours later", state: "adopted", stateTone: "teal" },
  { id: "0900-in-production", window: "09:00 local · in production", attempts: "61,400", cleared: "43,300", rate: "70.5%", rateTone: "teal", note: "Held up at full scale", state: "live", stateTone: "teal" },
  { id: "payday-plus-1", window: "Payday +1 · proposed", attempts: "—", cleared: "Unavailable", rate: "—", rateTone: "rose", note: "Would need a payday calendar per market", state: "awaiting approval", stateTone: "amber" },
  { id: "expired-cards-any-window", window: "Expired cards · any window", attempts: "14,200", cleared: "0", rate: "0%", rateTone: "rose", note: "A retry cannot fix an expired card", state: "needs a prompt", stateTone: "rose" },
];

export const RENEW_DUNNING_CLOSING = {
  title: "The 14,200 expired cards are the remaining ₦19M and no retry will ever recover them",
  body: "They need a customer to update a card, which needs a message, which needs a person to approve one. It is the cheapest outstanding recovery in the lifecycle and it has no room, no owner and no play — it survived only because the dunning room closed once the retry window was fixed.",
};

export const RENEW_DUNNING_RECOVERY_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "At risk when the room opened", value: "₦88M · 61,400 cards", percent: 100, tone: "rose" },
  { label: "Recovered · retry window change", value: "₦62M · measured against a 10% holdout", percent: 70, tone: "teal" },
  { label: "Still failing · expired cards", value: "₦19M · needs a different action", percent: 22, tone: "amber" },
  { label: "Genuinely unrecoverable", value: "₦7M · closed accounts, dead cards", percent: 8, tone: "ink" },
];

export const RENEW_DUNNING_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Expired cards, never prompted",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "last 12 months" },
    { label: "Card expired", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "14,200 customers · ₦19M at stake",
  countedNote: "Counted 6 minutes ago · the cheapest outstanding recovery in the lifecycle",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Ngozi owns the stage, so she owns this",
};

// ---- Pauses (RN05) --------------------------------------------------------

export const RENEW_PAUSES_KPIS: Kpi[] = [
  { eyebrow: "Paused", value: "41,000", tone: "rose", note: "up 22% since March" },
  { eyebrow: "Returned within 90 days", value: "31.4%", tone: "rose", note: "was 58.1%" },
  { eyebrow: "At stake", value: "₦22M", tone: "amber", note: "on the ones who will not return" },
  { eyebrow: "Reason given", value: "optional", tone: "amber", note: "68% skip it" },
];

export const RENEW_PAUSES_RETURN_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Paused before 4 March · returned in 90 days", value: "58.1%", percent: 58, tone: "teal" },
  { label: "Paused after 4 March · returned", value: "31.4%", percent: 31, tone: "rose" },
  { label: "Paused after 4 March, gave a reason", value: "44.1%", percent: 44, tone: "amber" },
  { label: "Paused after 4 March, gave no reason", value: "24.8%", percent: 25, tone: "rose" },
];

export const RENEW_PAUSES_INSIGHT = {
  title: "A customer who tells you why they paused is nearly twice as likely to come back",
  body: "44.1% against 24.8%. The reason field is optional and 68% skip it. That single design decision costs visibility on 27,900 customers a year — and the correlation is not causal, but it makes the reason field the cheapest diagnostic available in this stage.",
};

export type RenewPauseReasonRow = {
  id: string;
  reason: string;
  customers: string;
  share: string;
  shareTone: "teal" | "amber" | "rose" | "neutral";
  returned90: string;
  returned90Tone: "teal" | "amber" | "rose";
  vsFeb: string;
  vsFebTone: "teal" | "amber" | "rose" | "neutral";
  reallyA: string;
  reallyATone: ChipTone;
};

export const RENEW_PAUSE_REASON_ROWS: RenewPauseReasonRow[] = [
  { id: "too-expensive", reason: "Too expensive", customers: "4,900", share: "37.3%", shareTone: "rose", returned90: "31.1%", returned90Tone: "amber", vsFeb: "+18 pts share", vsFebTone: "rose", reallyA: "the fee", reallyATone: "ultra" },
  { id: "travelling-away", reason: "Travelling or away", customers: "3,100", share: "23.6%", shareTone: "teal", returned90: "71.4%", returned90Tone: "teal", vsFeb: "−4 pts", vsFebTone: "teal", reallyA: "a real pause", reallyATone: "teal" },
  { id: "delivery-problems", reason: "Delivery problems", customers: "2,400", share: "18.3%", shareTone: "amber", returned90: "22.1%", returned90Tone: "rose", vsFeb: "+6 pts", vsFebTone: "amber", reallyA: "Support", reallyATone: "amber" },
  { id: "not-using-enough", reason: "Not using it enough", customers: "1,900", share: "14.5%", shareTone: "amber", returned90: "18.4%", returned90Tone: "rose", vsFeb: "+2 pts", vsFebTone: "amber", reallyA: "Adopt", reallyATone: "amber" },
  { id: "other", reason: "Other", customers: "820", share: "6.3%", shareTone: "neutral", returned90: "41.1%", returned90Tone: "teal", vsFeb: "−1 pt", vsFebTone: "neutral", reallyA: "mixed", reallyATone: "neutral" },
];

export const RENEW_PAUSES_CLOSING = {
  title: "“Too expensive” went from 19% of stated reasons to 37% in the week of 4 March",
  body: "Nobody changed the subscription price. The customers saying this are describing a delivery fee that appears at checkout on every order, which they experience as the service costing more. The word customers use and the field that changed are in two different stages.",
};

export const RENEW_PAUSES_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Paused, cited “too expensive” since 4 March",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "since 4 March" },
    { label: "Reason", value: "too expensive" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "4,900 customers · +18 pts share since February",
  countedNote: "Counted 6 minutes ago · describing the delivery fee, not the subscription price",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "CH", kind: "agent" },
  ],
  participantsNote: "Churn Reason leads · Ngozi owns the stage, so she owns this",
};

// ---- Cohorts (RN06, stage-specific layout) --------------------------------

export type RenewCohortRow = {
  id: string;
  cohort: string;
  renewing: string;
  renewed: string;
  rate: string;
  rateTone: "teal" | "rose" | "neutral";
  cancelled: string;
  cancelledTone: "teal" | "amber" | "neutral";
  paused: string;
  pausedTone: "teal" | "rose" | "neutral";
  cardFailed: string;
  cardFailedTone: "teal" | "neutral";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const RENEW_COHORT_ROWS: RenewCohortRow[] = [
  { id: "january", cohort: "January", renewing: "18,900", renewed: "17,200", rate: "91.0%", rateTone: "teal", cancelled: "4.1%", cancelledTone: "teal", paused: "2.9%", pausedTone: "teal", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "+0.2", vsFebTone: "teal" },
  { id: "february", cohort: "February", renewing: "19,800", renewed: "18,000", rate: "90.9%", rateTone: "teal", cancelled: "4.2%", cancelledTone: "teal", paused: "2.9%", pausedTone: "teal", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", renewing: "18,100", renewed: "15,900", rate: "87.8%", rateTone: "rose", cancelled: "5.8%", cancelledTone: "amber", paused: "4.4%", pausedTone: "rose", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "−3.1", vsFebTone: "rose" },
  { id: "april", cohort: "April", renewing: "17,300", renewed: "15,100", rate: "87.3%", rateTone: "rose", cancelled: "6.1%", cancelledTone: "amber", paused: "4.6%", pausedTone: "rose", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "−3.6", vsFebTone: "rose" },
  { id: "may", cohort: "May", renewing: "17,100", renewed: "15,000", rate: "87.7%", rateTone: "rose", cancelled: "5.9%", cancelledTone: "amber", paused: "4.4%", pausedTone: "rose", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "−3.2", vsFebTone: "rose" },
  { id: "june", cohort: "June", renewing: "16,800", renewed: "Unavailable", rate: "Unavailable", rateTone: "neutral", cancelled: "Unavailable", cancelledTone: "neutral", paused: "Unavailable", pausedTone: "neutral", cardFailed: "2.0%", cardFailedTone: "teal", vsFeb: "—", vsFebTone: "neutral" },
];

export const RENEW_COHORT_CLOSING = {
  title: "Card failure is 2.0% in every single cohort and that is the point",
  body: "Involuntary churn does not care which month a customer was acquired in — it is a mechanism, not a decision. Cancellations and pauses moved with the March cohorts; card failures did not move at all. Two problems that look the same in a revenue report, separated cleanly by one column.",
};

export const RENEW_COHORT_ATTRIBUTION_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Cancellations · “too expensive”", value: "−1.7 pts", percent: 53, tone: "rose" },
  { label: "Pauses that became exits", value: "−1.5 pts", percent: 47, tone: "rose" },
  { label: "Card failures", value: "0.0 pts · unchanged", percent: 0, tone: "teal" },
];

// ---- Markets (RN07, stage-specific layout) --------------------------------

export type RenewMarketRow = {
  id: string;
  market: string;
  renewing: string;
  rate: string;
  rateTone: "teal" | "rose";
  cardFailure: string;
  cardFailureTone: "teal" | "rose";
  retryWindow: string;
  retryWindowTone: "teal" | "rose";
  paused: string;
  pausedTone: "teal" | "rose";
  atStake: string;
  atStakeTone: "teal" | "amber" | "rose" | "neutral";
  trend: "worsening" | "flat" | "improving";
};

export const RENEW_MARKET_ROWS: RenewMarketRow[] = [
  { id: "nigeria", market: "Nigeria", renewing: "781,000", rate: "87.9%", rateTone: "rose", cardFailure: "5.9%", cardFailureTone: "rose", retryWindow: "09:00 WAT", retryWindowTone: "teal", paused: "4.4%", pausedTone: "rose", atStake: "₦74M", atStakeTone: "rose", trend: "improving" },
  { id: "kenya", market: "Kenya", renewing: "189,000", rate: "91.2%", rateTone: "teal", cardFailure: "3.1%", cardFailureTone: "teal", retryWindow: "09:00 EAT", retryWindowTone: "teal", paused: "2.9%", pausedTone: "teal", atStake: "KES 4.1M", atStakeTone: "amber", trend: "flat" },
  { id: "ghana", market: "Ghana", renewing: "94,000", rate: "84.1%", rateTone: "rose", cardFailure: "8.4%", cardFailureTone: "rose", retryWindow: "00:00 GMT", retryWindowTone: "rose", paused: "5.1%", pausedTone: "rose", atStake: "GHS 890k", atStakeTone: "rose", trend: "worsening" },
  { id: "uk", market: "United Kingdom", renewing: "46,000", rate: "93.1%", rateTone: "teal", cardFailure: "1.9%", cardFailureTone: "teal", retryWindow: "09:00 BST", retryWindowTone: "teal", paused: "2.1%", pausedTone: "teal", atStake: "£12k", atStakeTone: "neutral", trend: "improving" },
];

export const RENEW_MARKET_CLOSING = {
  title: "Ghana is still retrying cards at midnight, four months after everyone else stopped",
  body: "The retry-window change was approved in April and rolled out per market. Ghana was missed. Its card failure rate is 8.4% against Nigeria's 5.9%, and the fix is a configuration change that has already been made three times. Nobody noticed because Ghana has no owner in this stage either.",
};

export const RENEW_MARKET_GHANA_ROWS: { label: string; value: string }[] = [
  { label: "Ghana renewal rate", value: "84.1% · lowest of four markets" },
  { label: "Ghana card failure", value: "8.4% · a fix already deployed elsewhere" },
  { label: "Value of the missed rollout", value: "≈GHS 890k a year · one configuration change" },
  { label: "Ghana pause rate", value: "5.1% · highest" },
  { label: "Rooms open about Ghana", value: "1 · about a campaign · no owner since 10 August" },
];

// ---- What changed (RN08) ---------------------------------------------------

export const RENEW_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee-checkout", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "Pauses +22% · “too expensive” 19% → 37%", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "card-retry-0900", date: "2 Apr", team: "Finance", teamColor: "#5D6BB8", title: "Card retry moved to 09:00 local", effect: "Recovery 25% → 70.5% · ₦62M", effectTone: "teal", badge: "causal finding", badgeTone: "ultra" },
  { id: "ghana-retry-not-rolled-out", date: "2 Apr", team: "Finance", teamColor: "#5D6BB8", title: "Retry change not rolled out to Ghana", effect: "Ghana card failure 8.4% vs 5.9%", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "book-built-old-rate", date: "Jul", team: "Customer Success", teamColor: "#2E8B7F", title: "Renewal book built on the old repeat rate", effect: "₦88M overstatement, still live", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "room-obliged-reforecast", date: "2 Aug", team: "Customer Success", teamColor: "#2E8B7F", title: "Room 8f2c obliged a re-forecast", effect: "Accepted, due 9 Aug, not started", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "pause-reason-optional", date: "2023", team: "Product", teamColor: "#7A5AA8", title: "Pause reason field made optional", effect: "68% skip it · diagnostic lost", effectTone: "amber", badge: "causal finding", badgeTone: "ultra" },
];

// ---- Agents (RN09) ----------------------------------------------------------

export const RENEW_AGENT_CARDS: AgentCard[] = [
  {
    id: "involuntary-churn",
    initials: "IC",
    status: "Lead agent · reading since 12 Jan",
    name: "Involuntary Churn",
    body: "Watches card failures, retry windows and recovery by hour. It found the midnight retry problem in February and its room closed in nine days with ₦62M recovered against a holdout.",
    footnote: "3 rooms · 2 closed · fastest in the workspace",
    tone: "ultra",
  },
  {
    id: "churn-reason",
    initials: "CH",
    status: "Supporting",
    name: "Churn Reason",
    body: "Reads cancellation and pause reasons, including the 68% who leave the field blank. It flagged “too expensive” doubling in the week of 4 March, twelve days after Support Signal flagged its own version of the same thing.",
    footnote: "second signal, also unrouted",
    tone: "ultra",
  },
  {
    id: "chase-a-person",
    initials: "",
    status: "WHAT NEITHER CAN DO",
    name: "Chase a person",
    body: "Both agents know the renewal book is overstated by ₦88M and that the correction is four days overdue. Neither can escalate an obligation — that rule now exists in handoff settings and did not on 9 August.",
    footnote: "the gap that let it slip",
    tone: "amber",
    footnoteTone: "amber",
  },
];

export const RENEW_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "card-failure-rises", condition: "Card failure rate rises", threshold: "more than 1 pt", currently: "Ghana +2.5", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "fix-not-rolled-out", condition: "A fix is not rolled out to every market", threshold: "14 days after the first", currently: "Ghana · 134 days", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "pause-return-falls", condition: "Pause return rate falls", threshold: "more than 5 pts", currently: "−26.7", currentlyTone: "rose", status: "already-open", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "forecast-input-stale", condition: "A forecast input is known to be stale", threshold: "any", currently: "repeat rate · since 2 Aug", currentlyTone: "rose", status: "opens-automatically", statusLabel: "opens now", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
  { id: "cancellation-reasons-shift", condition: "Cancellation reasons shift", threshold: "more than 10 pts share", currently: "+18 · too expensive", currentlyTone: "rose", status: "already-open", owner: { name: "Kunle", initials: "KO", color: "#2E8B7F" } },
];

export const RENEW_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A fix is not rolled out to every market", note: "a change proven to work in one market has not reached another" },
  byMoreThan: { label: "By more than", value: "14 days after the first", note: "the gap between when it worked somewhere and everywhere" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately once the 14-day window passes" },
  segmentedBy: { label: "Segmented by", value: "market, fix", note: "so a single market's gap is findable, not averaged away" },
  routesTo: { name: "The Renew stage owner · Ngozi Bello" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 2 April, when the retry-window fix rolled out everywhere except Ghana — 134 days ago and still unrouted. It is why Ghana is still retrying cards at midnight.",
  },
};

// ---- History (RN10) ----------------------------------------------------------

export const RENEW_GOAL_ROWS: GoalRow[] = [
  { id: "involuntary-churn-goal", goal: "Involuntary churn", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" }, target: "1.8%/mo", today: "1.9%/mo", todayTone: "teal", paceLabel: "on target", paceTone: "teal", part: "the retry window did it", partTone: "teal" },
  { id: "net-revenue", goal: "Net revenue", owner: { name: "Ada", initials: "AD", color: "#2E8B7F" }, target: "₦4.90B", today: "₦4.71B proj", todayTone: "amber", paceLabel: "94% of pace", paceTone: "amber", part: "₦88M of the projection is wrong", partTone: "rose" },
];

export const RENEW_HISTORY_INSIGHT = {
  title: "This is the only goal in the company that is on target, and it is on target because of one change",
  body: "Involuntary churn went from 3.1% to 1.9% because Ravi approved moving card retries nine hours later. One decision, nine days from room opening to close, ₦62M recovered and measured against a holdout. It is the clearest example in the workspace of the product working exactly as intended.",
};

export const RENEW_TRIED_ROWS: TriedRow[] = [
  { id: "card-retry-0900-local", what: "Card retry at 09:00 local", when: "2 Apr", result: "₦62M recovered · 25% → 70.5%", resultTone: "teal", measuredHow: "holdout · 10% not retried", learningKept: "validated" },
  { id: "retry-payday-plus-1", what: "Retry at payday +1", when: "pending", whenTone: "amber", result: "untried · awaiting approval", resultTone: "amber", measuredHow: "holdout planned", learningKept: "4 hrs waiting" },
  { id: "pause-reason-made-optional", what: "Pause reason made optional", when: "2023", result: "68% skip · diagnostic lost", resultTone: "amber", measuredHow: "never measured", learningKept: "reverse it" },
  { id: "winback-pause-expiry", what: "Win-back on pause expiry", when: "2024", result: "+11 pts return rate", resultTone: "teal", measuredHow: "holdout · 20%", learningKept: "validated" },
  { id: "prompt-expired-card", what: "Prompt to update an expired card", when: "never", whenTone: "rose", result: "untried · ₦19M identified", resultTone: "rose", measuredHow: "—", learningKept: "never proposed", learningKeptTone: "rose" },
];

// ---- Compare periods (RN11) -----------------------------------------------

export const RENEW_COMPARE_ROWS: CompareRow[] = [
  { id: "renewal-rate", metric: "Renewal rate", before: "90.9%", after: "87.7%", change: "−3.2 pts", changeTone: "rose", whatMovedIt: "Cancellations and pauses, not cards" },
  { id: "cancellations", metric: "Cancellations", before: "4.2%", after: "5.9%", change: "+1.7 pts", changeTone: "rose", whatMovedIt: "“Too expensive” · the delivery fee" },
  { id: "pauses", metric: "Pauses", before: "2.9%", after: "4.4%", change: "+1.5 pts", changeTone: "rose", whatMovedIt: "Same cause · pauses became exits" },
  { id: "pause-return-rate", metric: "Pause return rate", before: "58.1%", after: "31.4%", change: "−26.7 pts", changeTone: "rose", whatMovedIt: "A pause is no longer a delay" },
  { id: "card-failure-rate", metric: "Card failure rate", before: "2.0%", after: "2.0%", change: "0.0 pts", changeTone: "teal", whatMovedIt: "A mechanism, not a decision" },
  { id: "involuntary-churn-recovered", metric: "Involuntary churn recovered", before: "25.0%", after: "70.5%", change: "+45.5 pts", changeTone: "teal", whatMovedIt: "The retry window · the one win" },
];

// ---- One account (RN13, /lifecycle/renew/book/:id) -------------------------

export type RenewAccountEvent = {
  id: string;
  date: string;
  title: string;
  titleTone: "teal" | "amber" | "rose";
  body: string;
  actor: string;
};

export type RenewAccountDetail = {
  title: string;
  subtitle: string;
  modeBadge: string;
  kpis: Kpi[];
  timelineEyebrow: string;
  events: RenewAccountEvent[];
  closingTitle: string;
  closingBody: string;
};

export const RENEW_ACCOUNT_DETAILS: Record<string, RenewAccountDetail> = {
  "kano-textiles": {
    title: "Kano Textiles",
    subtitle: "₦2.1M · 120 seats · utilisation 71% → 34% since March · renews in 31 days",
    modeBadge: "Accounts mode · one business, not a cohort",
    kpis: [
      { eyebrow: "Annual value", value: "₦2.1M", note: "120 seats" },
      { eyebrow: "Renews", value: "14 September", tone: "amber", note: "31 days" },
      { eyebrow: "Seat utilisation", value: "34%", tone: "rose", note: "41 of 120 ordered this month" },
      { eyebrow: "Health", value: "At risk", tone: "rose", note: "since 4 March" },
    ],
    timelineEyebrow: "What happened to this account, in order",
    events: [
      { id: "signed", date: "Jan 2026", title: "Signed · 120 seats", titleTone: "teal", body: "₦2.1M annual", actor: "Tunde Bakare" },
      { id: "utilisation-71", date: "Feb", title: "Seat utilisation 71%", titleTone: "teal", body: "85 of 120 ordering", actor: "—" },
      { id: "fee-moved", date: "4 Mar", title: "Delivery fee moved to checkout", titleTone: "rose", body: "Every order now shows a fee", actor: "Engineering" },
      { id: "utilisation-52", date: "Apr", title: "Utilisation 52%", titleTone: "amber", body: "62 of 120 ordering", actor: "—" },
      { id: "office-manager-asked", date: "Jun", title: "Office manager asked about the fee", titleTone: "amber", body: "Answered in 3 min · resolved · no escalation", actor: "Support" },
      { id: "utilisation-34", date: "Aug", title: "Utilisation 34%", titleTone: "rose", body: "41 of 120 · below the renewal threshold", actor: "—" },
      { id: "renews", date: "14 Sep", title: "Renews", titleTone: "rose", body: "No conversation has happened yet", actor: "Tunde Bakare" },
    ],
    closingTitle: "A 120-seat account has been quietly halving since March and the only human contact was a three-minute support ticket",
    closingBody:
      "Everything Flolyt needed was in the data from April. Seat utilisation is a stage metric, the fee is a release, the support ticket is a contact driver — three signals in three stages, one account, and no room. It renews in 31 days.",
  },
};

export const RENEW_ACCOUNT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Seat utilisation halved since a fee changed, no conversation yet",
  carriedIn: [
    { label: "Account", value: "Kano Textiles" },
    { label: "Renews", value: "14 September · 31 days" },
    { label: "Utilisation", value: "34% · was 71%" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "₦2.1M annual · 120 seats",
  countedNote: "Counted 6 minutes ago · at risk since 4 March",
  participants: [
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Tunde owns the account",
};
