/**
 * Mock content for the Advocate stage — screens AV01-AV13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "AV06 · Advocate · cohorts").
 */

import type { Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/lifecycle/stage/chip";
import type { LeakRow, ChangeRow, AgentCard, ThresholdRow, GoalRow, TriedRow, CompareRow } from "@/pages/lifecycle/stage/acquire/data";
import type { InsightCard } from "@/pages/lifecycle/stage/activate/data";
import type { ThresholdPreset } from "@/pages/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/lifecycle/stage/modals/share-or-export-modal";
import type { AssignOwnerPreset } from "@/pages/lifecycle/stage/modals/assign-an-owner-modal";

// ---- Shared across Definition/Overview/Agents (AV01/AV02/AV09) -----------

export const ADVOCATE_ASSIGN_OWNER_PRESET: AssignOwnerPreset = {
  description: "Five rooms open the moment somebody's name is on this",
  unownedTitle: "Unowned since 12 January · 214 days",
  statsLine: "14 agent findings · 0 rooms · 5 breached thresholds · ₦278M of untested spend",
  candidatesEyebrow: "Who should own it",
  candidates: [
    { id: "ifeoma-nwosu", initials: "IN", color: "#79883A", name: "Ifeoma Nwosu", reason: "Owns Retain · referral is a retention behaviour · 14 rooms already" },
    { id: "tunde-bakare", initials: "TB", color: "#B4568F", name: "Tunde Bakare", reason: "Owns Acquire and Expand · referral is 31% of acquisition", selected: true },
    { id: "kunle-ade", initials: "KO", color: "#2E8B7F", name: "Kunle Ade", reason: "Owns Renew · Kenya refers at 19.8% and he owns Kenya" },
  ],
  consequencesEyebrow: "What happens the moment you assign",
  consequences: [
    { label: "Five breached thresholds route somewhere", value: "and open five rooms tonight", tone: "amber" },
    { label: "14 held findings are delivered", value: "in tomorrow's 06:00 digest", tone: "teal" },
    { label: "The Legacy Unlimited conflict surfaces", value: "to Tunde and Ravi together, not separately", tone: "amber" },
    { label: "A reward holdout becomes proposable", value: "₦278M · six weeks to an answer", tone: "teal" },
    { label: "Their load", value: "Tunde already owns 2 stages and 11 rooms", tone: "amber" },
  ],
  closingTitle: "Assigning this is the cheapest action available in the workspace today",
  closingBody:
    "No engineering, no budget, no customer contact. One name against one stage, and the highest-return channel in the company stops being nobody's job. It has been available since 12 January.",
  confirmLabel: "Assign Tunde",
};

// ---- Definition (AV01) ----------------------------------------------------

export type AdvocateWorthRow = {
  id: string;
  measure: string;
  figure: string;
  figureTone: "ink" | "teal" | "amber" | "rose";
  against: string;
  againstTone: "teal" | "neutral" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export const ADVOCATE_DEFINITION = {
  title: "What counts as advocacy",
  subtitle: "Advocate · owning team Marketing · no owner assigned since 12 January",
  insightTitle: "Advocacy is the only stage that produces customers instead of consuming them",
  insightBody:
    "Every other stage spends money to keep or grow someone. This one turns an existing customer into an acquisition channel at zero cost. It is also the only stage in the lifecycle with no owner, which is a sentence worth reading twice.",
  candidatesEyebrow: "A customer is advocating when",
  candidates: [
    {
      id: "says-something-positive",
      label: "They say something positive",
      description: "Sentiment. Pleasant, and it has never been shown to produce a customer.",
      field: "ratings + reviews · 241,000",
    },
    {
      id: "shares-a-referral-link",
      label: "They share a referral link",
      description: "The truest definition and Flolyt cannot measure it. Shares emit no event.",
      field: "Unavailable · not instrumented",
    },
    {
      id: "referred-first-order",
      label: "Someone they referred places a first order",
      description: "Attribution only on redemption. Measurable, conservative, and the only defensible option today.",
      field: "orders · 124,000 referrers · 278,000 referred",
      selected: true,
    },
  ],
  mistakeTitle: "The chosen definition undercounts advocacy and Flolyt says so rather than compensating",
  mistakeBody:
    "A customer who recommends us in a WhatsApp group without a link produces a real customer that this stage will never see. Referral shares are not instrumented, so the 124,000 is a floor, not a measurement. Nobody has ever asked Engineering to fix it.",
  tableEyebrow: "What this stage is worth, conservatively",
  rows: [
    { id: "customers-referred", measure: "Customers referred in 12 months", figure: "278,000", figureTone: "ink", against: "31% of all acquisition", againstTone: "teal", verdict: "largest single channel", verdictTone: "teal" },
    { id: "cac", measure: "CAC", figure: "₦0", figureTone: "teal", against: "₦1,840 blended", againstTone: "teal", verdict: "free", verdictTone: "teal" },
    { id: "reward-paid", measure: "Reward paid", figure: "₦278M", figureTone: "amber", against: "₦1,000 per referral", againstTone: "neutral", verdict: "a real cost", verdictTone: "amber" },
    { id: "effective-cac", measure: "Effective CAC after rewards", figure: "₦1,000", figureTone: "teal", against: "₦1,840 blended", againstTone: "teal", verdict: "still the cheapest", verdictTone: "teal" },
    { id: "repeat-rate", measure: "Repeat rate of referred customers", figure: "41.2%", figureTone: "teal", against: "27.2% base", againstTone: "teal", verdict: "and the best quality", verdictTone: "teal" },
    { id: "owner", measure: "Owner of this stage", figure: "Nobody", figureTone: "rose", against: "since 12 January", againstTone: "rose", verdict: "seven months", verdictTone: "rose" },
  ] satisfies AdvocateWorthRow[],
};

// ---- Overview (AV02) -------------------------------------------------------

export const ADVOCATE_OVERVIEW_LEAD = {
  title: "This stage has no owner and has not had one for seven months",
  body: "It produced 31% of last year's new customers at the lowest CAC and the highest repeat rate in the company. Rooms opened here have nobody's name on them and escalate to Ada by default.",
};

export const ADVOCATE_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Referrers", value: "124,000", note: "2.9% of the base" },
  { eyebrow: "Customers referred", value: "278,000", tone: "teal", note: "31% of acquisition" },
  { eyebrow: "Effective CAC", value: "₦1,000", tone: "teal", note: "against ₦1,840 blended" },
  { eyebrow: "Referral rate", value: "falling", tone: "rose", note: "first time in two years" },
];

export const ADVOCATE_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "referral-rate-falling",
    where: "Referral rate falling since March",
    customers: "—",
    value: "₦31M CAC lost",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · 4 Mar", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "referrers-stopped",
    where: "Referrers who stopped referring",
    customers: "18,000",
    value: "₦18M CAC lost",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "No owner", tone: "amber" },
  },
  {
    id: "rewards-would-have-come-anyway",
    where: "Rewards paid to referrals that would have come anyway",
    customers: "41,000",
    value: "₦41M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "never tested", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "legacy-unlimited-holders",
    where: "Legacy Unlimited holders · 4.1× referral rate",
    customers: "3,100",
    value: "₦12M",
    valueTone: "ink",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "conflicts with Price", tone: "rose" },
    detailHref: "/lifecycle/advocate/referrers/legacy-unlimited-holders",
  },
  {
    id: "referral-link-shares",
    where: "Referral link shares",
    customers: "Unavailable",
    value: "Unavailable",
    valueTone: "ink",
    trend: "unknown",
    trendTone: "neutral",
    causeKnown: { label: "not instrumented", tone: "amber" },
    room: { label: "blocked", tone: "rose" },
  },
];

export const ADVOCATE_OVERVIEW_INSIGHT = {
  title: "The fourth row is a direct conflict with a decision Price is trying to make",
  body: "Legacy Unlimited holders refer at 4.1× the base rate and 611 of them are top-decile referrers. Price wants to reprice them because they cost ₦410 a delivery against ₦93 of revenue. Both stages are right. Neither can settle it alone and neither has raised it, because one of them has no owner.",
};

export const ADVOCATE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Rewards paid to referrals that would have come anyway",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Entered", value: "last 12 months" },
    { label: "Referred more than once", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "41,000 customers · ₦41M at stake",
  countedNote: "Counted 6 minutes ago · never tested against a holdout",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

export const ADVOCATE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Advocate · overview · Nigeria",
  snapshotLabel: "Advocate · overview · Nigeria · as of 13 Aug 08:12",
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
    "The referral-link-share figure travels as \"unavailable\" rather than being dropped from the file — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Referrers (AV03, route path "referrers") ------------------------------

export type AdvocateReferrerRow = {
  id: string;
  group: string;
  customers: string;
  referralsEach: string;
  referralsEachTone: "teal" | "amber";
  totalReferred: string;
  totalReferredTone: "ink" | "rose";
  repeatRate: string;
  repeatRateTone: "teal" | "amber" | "rose";
  stillReferring: string;
  stillReferringTone: "teal" | "rose";
  verdict: string;
  verdictTone: ChipTone;
  detailHref?: string;
};

export const ADVOCATE_REFERRER_ROWS: AdvocateReferrerRow[] = [
  { id: "legacy-unlimited-holders", group: "Legacy Unlimited holders", customers: "3,100", referralsEach: "9.2", referralsEachTone: "teal", totalReferred: "28,500", totalReferredTone: "ink", repeatRate: "81.1%", repeatRateTone: "teal", stillReferring: "94%", stillReferringTone: "teal", verdict: "the best, by far", verdictTone: "teal", detailHref: "/lifecycle/advocate/referrers/legacy-unlimited-holders" },
  { id: "group-ordering-users", group: "Group ordering users", customers: "19,000", referralsEach: "4.1", referralsEachTone: "teal", totalReferred: "77,900", totalReferredTone: "ink", repeatRate: "71.4%", repeatRateTone: "teal", stillReferring: "88%", stillReferringTone: "teal", verdict: "excellent", verdictTone: "teal" },
  { id: "lagos-plus-subscribers", group: "Lagos Plus subscribers", customers: "61,000", referralsEach: "2.2", referralsEachTone: "teal", totalReferred: "134,200", totalReferredTone: "ink", repeatRate: "61.1%", repeatRateTone: "teal", stillReferring: "74%", stillReferringTone: "teal", verdict: "the volume", verdictTone: "teal" },
  { id: "pay-as-you-go-referred-once", group: "Pay as you go · referred once", customers: "38,000", referralsEach: "1.0", referralsEachTone: "amber", totalReferred: "38,000", totalReferredTone: "ink", repeatRate: "31.4%", repeatRateTone: "amber", stillReferring: "21%", stillReferringTone: "rose", verdict: "one and done", verdictTone: "amber" },
  { id: "stopped-referring-since-march", group: "Stopped referring since March", customers: "18,000", referralsEach: "was 2.8", referralsEachTone: "amber", totalReferred: "−50,400", totalReferredTone: "rose", repeatRate: "24.1%", repeatRateTone: "rose", stillReferring: "0%", stillReferringTone: "rose", verdict: "the loss", verdictTone: "rose" },
];

export const ADVOCATE_WHO_STOPPED_CARDS: InsightCard[] = [
  {
    id: "stopped-week-of-4-march",
    agentTag: "RF",
    meta: "18,000 referrers · ₦18M of CAC",
    title: "They stopped in the week of 4 March",
    body: "Not gradually. Referral volume from this group fell 71% in seven days and has not recovered. 14,200 of them are still active customers who simply stopped recommending us.",
    footnote: "causal · dated",
    tone: "rose",
  },
  {
    id: "why-they-stopped",
    agentTag: "RF",
    meta: "Why",
    title: "You do not refer a service you are unsure about",
    body: "The overlap is almost exact — 16,100 of the 18,000 had a delivery-fee complaint, a late delivery or a paused subscription in the same window. Advocacy is the first thing to go and the last thing anyone checks.",
    footnote: "strong association",
    tone: "amber",
  },
  {
    id: "what-nobody-did",
    meta: "WHAT NOBODY DID",
    title: "Nothing, for 151 days",
    body: "The referral rate falling for the first time in two years was one of the five signals in the delivery-fee chain. It was the only one of the five with no team looking at it, because this stage has no owner.",
    footnote: "the fifth signal",
    tone: "rose",
  },
];

export const ADVOCATE_REFERRERS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Referrers stopped referring since March",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Stopped since", value: "week of 4 March" },
    { label: "Still an active customer", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "18,000 referrers · ₦18M of CAC lost",
  countedNote: "Counted 6 minutes ago · fell 71% in seven days, has not recovered",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Referral quality (AV04, route path "quality") --------------------------

export const ADVOCATE_QUALITY_KPIS: Kpi[] = [
  { eyebrow: "Referred customers", value: "278,000", note: "31% of acquisition" },
  { eyebrow: "Repeat rate", value: "41.2%", tone: "teal", note: "against 27.2% base" },
  { eyebrow: "Value per customer", value: "₦11,400", tone: "teal", note: "against ₦7,100 base" },
  { eyebrow: "Effective CAC", value: "₦1,000", tone: "teal", note: "against ₦1,840" },
];

export type AdvocateQualityChannelRow = {
  id: string;
  channel: string;
  acquired: string;
  cac: string;
  cacTone: "teal" | "amber" | "rose" | "ink";
  repeatRate: string;
  repeatRateTone: "teal" | "amber" | "rose" | "ink";
  valuePerCustomer: string;
  valuePerCustomerTone: "teal" | "amber" | "rose" | "ink";
  featuresUsed: string;
  featuresUsedTone: "teal" | "amber" | "rose" | "ink";
  ratio: string;
  ratioTone: "teal" | "amber" | "rose" | "ink";
};

export const ADVOCATE_QUALITY_CHANNEL_ROWS: AdvocateQualityChannelRow[] = [
  { id: "referral", channel: "Referral", acquired: "278,000", cac: "₦1,000", cacTone: "teal", repeatRate: "41.2%", repeatRateTone: "teal", valuePerCustomer: "₦11,400", valuePerCustomerTone: "teal", featuresUsed: "2.9", featuresUsedTone: "teal", ratio: "11.4×", ratioTone: "teal" },
  { id: "organic-search", channel: "Organic search", acquired: "184,000", cac: "₦0", cacTone: "teal", repeatRate: "31.1%", repeatRateTone: "teal", valuePerCustomer: "₦8,600", valuePerCustomerTone: "teal", featuresUsed: "2.4", featuresUsedTone: "teal", ratio: "∞", ratioTone: "teal" },
  { id: "partner-fuel-stations", channel: "Partner · fuel stations", acquired: "94,000", cac: "₦649", cacTone: "teal", repeatRate: "29.4%", repeatRateTone: "teal", valuePerCustomer: "₦8,100", valuePerCustomerTone: "teal", featuresUsed: "2.1", featuresUsedTone: "ink", ratio: "12.5×", ratioTone: "teal" },
  { id: "paid-search", channel: "Paid search", acquired: "61,000", cac: "₦1,213", cacTone: "teal", repeatRate: "28.1%", repeatRateTone: "ink", valuePerCustomer: "₦7,800", valuePerCustomerTone: "ink", featuresUsed: "2.0", featuresUsedTone: "ink", ratio: "6.4×", ratioTone: "teal" },
  { id: "paid-social-nigeria", channel: "Paid social · Nigeria", acquired: "214,000", cac: "₦1,925", cacTone: "amber", repeatRate: "24.8%", repeatRateTone: "amber", valuePerCustomer: "₦6,900", valuePerCustomerTone: "amber", featuresUsed: "1.8", featuresUsedTone: "amber", ratio: "3.6×", ratioTone: "amber" },
  { id: "paid-social-ghana", channel: "Paid social · Ghana", acquired: "31,200", cac: "₦6,026", cacTone: "rose", repeatRate: "4.1%", repeatRateTone: "rose", valuePerCustomer: "₦1,140", valuePerCustomerTone: "rose", featuresUsed: "0.9", featuresUsedTone: "rose", ratio: "0.19×", ratioTone: "rose" },
];

export const ADVOCATE_QUALITY_INSIGHT = {
  title: "Referral is better than paid social on every measure and 2.4 times smaller",
  body: "₦188M went to a Ghana campaign returning 0.19×. ₦278M of rewards went to the channel returning 11.4×. Nobody has ever proposed moving budget between them, because one has a campaign manager, a dashboard and a weekly review, and the other has no owner.",
};

export const ADVOCATE_QUALITY_WHY_ROWS: { label: string; value: string; tone: "teal" | "amber" }[] = [
  { label: "They arrive with an expectation set by a person", value: "not by a creative · no promise mismatch", tone: "teal" },
  { label: "They are usually in the same city as their referrer", value: "delivery is already known to work there", tone: "teal" },
  { label: "They adopt 2.9 features against 2.1", value: "the referrer shows them how", tone: "teal" },
  { label: "They are referred into group ordering 3.1× more often", value: "the highest-lift feature in Adopt", tone: "teal" },
  { label: "What we cannot say", value: "whether the reward causes any of this · never tested", tone: "amber" },
];

export const ADVOCATE_QUALITY_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Referral outperforms paid social on every measure and gets no budget conversation",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Compared against", value: "Paid social · Ghana" },
    { label: "Ratio", value: "11.4× vs 0.19×" },
    { label: "Markets", value: "Nigeria, Ghana" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "278,000 referred customers · 11.4× value-to-CAC",
  countedNote: "Counted 6 minutes ago · 2.4× smaller than paid social and outperforms it",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Rewards (AV05) --------------------------------------------------------

export const ADVOCATE_REWARDS_KPIS: Kpi[] = [
  { eyebrow: "Reward per referral", value: "₦1,000", tone: "amber", note: "raised from ₦500 in April" },
  { eyebrow: "Paid in 12 months", value: "₦278M", tone: "amber", note: "to 124,000 referrers" },
  { eyebrow: "Incremental?", value: "Unavailable", tone: "rose", note: "no holdout has ever been run" },
  { eyebrow: "Margin cost", value: "Unavailable", tone: "amber", note: "no COGS source" },
];

export const ADVOCATE_REWARDS_WARNING = {
  title: "₦278M a year has been paid out with no test of whether it changes anything",
  body: "The reward has run since 2022 and been raised twice. It has never had a holdout. Nobody can say whether referrals would happen without it, at half of it, or at twice the volume with double.",
};

export type AdvocateRewardChangeRow = {
  id: string;
  what: string;
  before: string;
  after: string;
  change: string;
  changeTone: "teal" | "rose" | "neutral";
  reading: string;
};

export const ADVOCATE_REWARD_CHANGE_ROWS: AdvocateRewardChangeRow[] = [
  { id: "referrals-per-month", what: "Referrals per month", before: "21,400", after: "26,100", change: "+22.0%", changeTone: "teal", reading: "Volume rose" },
  { id: "reward-paid-per-month", what: "Reward paid per month", before: "₦10.7M", after: "₦26.1M", change: "+144%", changeTone: "rose", reading: "Cost rose faster" },
  { id: "cost-per-referral", what: "Cost per referral", before: "₦500", after: "₦1,000", change: "+100%", changeTone: "rose", reading: "By definition" },
  { id: "referred-repeat-rate", what: "Referred customer repeat rate", before: "41.4%", after: "41.1%", change: "−0.3 pts", changeTone: "neutral", reading: "Quality unchanged" },
  { id: "referrers-more-than-once", what: "Referrers who referred more than once", before: "38.1%", after: "38.4%", change: "+0.3 pts", changeTone: "neutral", reading: "Behaviour unchanged" },
  { id: "any-incremental", what: "Was any of it incremental?", before: "—", after: "Unavailable", change: "—", changeTone: "neutral", reading: "No holdout · no answer" },
];

export const ADVOCATE_REWARDS_TRADE_INSIGHT = {
  title: "Doubling the reward bought 22% more referrals and cost 144% more",
  body: "On the face of it that is a bad trade. It might still be a good one if those 4,700 extra monthly referrals would not otherwise exist — but with no holdout, the 21,400 who were already referring at ₦500 are now being paid ₦1,000 for the same behaviour. That alone is roughly ₦128M a year, and it is not on anybody's list.",
};

export const ADVOCATE_REWARDS_HOLDOUT_INSIGHT = {
  title: "A holdout here costs nothing and would settle it in six weeks",
  body: "Hold 10% of referrers at ₦500. It requires no product change, no engineering and no customer contact. It has not been proposed because proposing it is somebody's job and nobody has this stage.",
};

export const ADVOCATE_REWARDS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "A reward change runs without a holdout",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Reward", value: "₦500 → ₦1,000 · 18 April" },
    { label: "Holdout run", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "₦278M paid in 12 months · never tested",
  countedNote: "Counted 6 minutes ago · a 10% holdout would settle it in six weeks",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Cohorts (AV06, stage-specific layout) ---------------------------------

export type AdvocateCohortRow = {
  id: string;
  cohort: string;
  reached180: string;
  referredAnyone: string;
  rate: string;
  rateTone: "teal" | "rose" | "neutral";
  referralsEach: string;
  referralsEachTone: "teal" | "rose" | "neutral";
  referredCustomers: string;
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const ADVOCATE_COHORT_ROWS: AdvocateCohortRow[] = [
  { id: "january", cohort: "January", reached180: "23,300", referredAnyone: "3,100", rate: "13.3%", rateTone: "teal", referralsEach: "2.4", referralsEachTone: "teal", referredCustomers: "7,440", vsFeb: "+0.3", vsFebTone: "teal" },
  { id: "february", cohort: "February", reached180: "24,300", referredAnyone: "3,200", rate: "13.2%", rateTone: "teal", referralsEach: "2.4", referralsEachTone: "teal", referredCustomers: "7,680", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", reached180: "22,300", referredAnyone: "2,100", rate: "9.4%", rateTone: "rose", referralsEach: "1.9", referralsEachTone: "rose", referredCustomers: "3,990", vsFeb: "−3.8", vsFebTone: "rose" },
  { id: "april", cohort: "April", reached180: "21,000", referredAnyone: "1,900", rate: "9.0%", rateTone: "rose", referralsEach: "1.9", referralsEachTone: "rose", referredCustomers: "3,610", vsFeb: "−4.2", vsFebTone: "rose" },
  { id: "may", cohort: "May", reached180: "21,000", referredAnyone: "2,000", rate: "9.5%", rateTone: "rose", referralsEach: "1.8", referralsEachTone: "rose", referredCustomers: "3,600", vsFeb: "−3.7", vsFebTone: "rose" },
  { id: "june", cohort: "June", reached180: "Unavailable", referredAnyone: "Unavailable", rate: "Unavailable", rateTone: "neutral", referralsEach: "Unavailable", referralsEachTone: "neutral", referredCustomers: "Unavailable", vsFeb: "—", vsFebTone: "neutral" },
];

export const ADVOCATE_COHORT_CLOSING = {
  title: "The compounding loss nobody has costed",
  body: "Cohorts acquired after March refer 3.8 points less often and each referral is 0.5 smaller. That is roughly 3,900 fewer referred customers per cohort — and referred customers refer at 13.3% themselves. A cohort that does not advocate does not just cost its own value, it costs the cohort behind it.",
};

export const ADVOCATE_COHORT_MARCH_BREAK_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Mar–May cohorts · referrals lost", value: "11,600 customers not acquired", percent: 100, tone: "rose" },
  { label: "Second generation · their referrals", value: "1,540 more not acquired", percent: 13, tone: "rose" },
  { label: "CAC value of both", value: "≈₦24M at blended CAC", percent: 21, tone: "rose" },
  { label: "Counted anywhere in the ₦412M", value: "no · this is separate", percent: 0, tone: "amber" },
];

export const ADVOCATE_COHORTS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Referral rate down 3.8 points since March, compounding across two generations",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Cohorts", value: "Mar–May" },
    { label: "Measured at", value: "180 days" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "11,600 customers not acquired · ≈₦24M at blended CAC",
  countedNote: "Counted 6 minutes ago · a second-generation loss, not counted in the ₦412M",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Markets (AV07, stage-specific layout) ---------------------------------

export type AdvocateMarketRow = {
  id: string;
  market: string;
  referrers: string;
  referralRate: string;
  referralRateTone: "teal" | "amber" | "rose";
  referredCustomers: string;
  shareOfAcquisition: string;
  shareOfAcquisitionTone: "teal" | "rose";
  reward: string;
  trend: "worsening" | "flat" | "improving";
};

export const ADVOCATE_MARKET_ROWS: AdvocateMarketRow[] = [
  { id: "nigeria", market: "Nigeria", referrers: "81,000", referralRate: "10.4%", referralRateTone: "amber", referredCustomers: "184,000", shareOfAcquisition: "30.2%", shareOfAcquisitionTone: "teal", reward: "₦1,000", trend: "worsening" },
  { id: "kenya", market: "Kenya", referrers: "24,000", referralRate: "19.8%", referralRateTone: "teal", referredCustomers: "58,000", shareOfAcquisition: "47.9%", shareOfAcquisitionTone: "teal", reward: "KES 90", trend: "flat" },
  { id: "ghana", market: "Ghana", referrers: "6,000", referralRate: "6.4%", referralRateTone: "rose", referredCustomers: "11,000", shareOfAcquisition: "11.7%", shareOfAcquisitionTone: "rose", reward: "GHS 18", trend: "worsening" },
  { id: "uk", market: "United Kingdom", referrers: "13,000", referralRate: "18.8%", referralRateTone: "teal", referredCustomers: "25,000", shareOfAcquisition: "36.2%", shareOfAcquisitionTone: "teal", reward: "£1.80", trend: "improving" },
];

export const ADVOCATE_MARKET_CLOSING = {
  title: "Nearly half of Kenya's new customers come from other Kenyan customers",
  body: "47.9% of acquisition at effectively zero cost, in a market with the second-highest repeat rate and the fastest time to value. Kenya is not a smaller Nigeria — it is a working example of what the whole company is trying to be, and no room has ever been opened to ask why.",
};

export const ADVOCATE_MARKET_GHANA_ROWS: { label: string; value: string }[] = [
  { label: "Ghana referral rate", value: "6.4% · a third of Kenya's" },
  { label: "Ghana share of acquisition from referral", value: "11.7% · lowest" },
  { label: "Ghana paid social CAC", value: "₦6,026 · to replace what referral would give free" },
  { label: "The connection nobody has drawn", value: "a market paying a 22% price premium does not recommend you" },
  { label: "Rooms open about Ghana", value: "1 · about a campaign · no owner since 10 August" },
];

export const ADVOCATE_MARKETS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Kenya gets 47.9% of acquisition from referral and nobody has asked why",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Market", value: "Kenya" },
    { label: "Share of acquisition", value: "47.9%" },
    { label: "Compare against", value: "Nigeria · 30.2%" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "58,000 referred customers · Kenya",
  countedNote: "Counted 6 minutes ago · second-highest repeat rate, fastest time to value",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- What changed (AV08) ---------------------------------------------------

export const ADVOCATE_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee-checkout", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "Referral rate fell · first time in two years", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "reward-raised-1000", date: "18 Apr", team: "Marketing", teamColor: "#79883A", title: "Referral reward raised ₦500 → ₦1,000", effect: "+22% referrals, +144% cost, no holdout", effectTone: "amber", badge: "causal finding", badgeTone: "ultra" },
  { id: "loyalty-tiers-renamed", date: "19 Apr", team: "Marketing", teamColor: "#79883A", title: "Loyalty tiers renamed", effect: "Unavailable · tier-driven referral invisible", effectTone: "amber", badge: "not instrumented", badgeTone: "amber" },
  { id: "legacy-unlimited-closed", date: "Mar 2022", team: "Finance", teamColor: "#5D6BB8", title: "Legacy Unlimited closed to new customers", effect: "Froze the highest-referring group at 3,100", effectTone: "amber", badge: "causal finding", badgeTone: "ultra" },
  { id: "attribution-on-redemption", date: "2024", team: "Engineering", teamColor: "#4E7080", title: "Referral attribution on redemption only", effect: "Shares invisible · the 124,000 is a floor", effectTone: "rose", badge: "not instrumented", badgeTone: "amber" },
  { id: "given-no-owner", date: "12 Jan", team: "nobody", teamColor: "#CE3F51", title: "This stage was given no owner", effect: "Five signals, seven months, no room", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
];

export const ADVOCATE_CHANGES_INSIGHT = {
  title: "The last row is on this list because an absence of ownership is a dated change with a measurable effect",
  body: "On 12 January every stage was assigned an owner except two. Advocate produced the fifth signal in the delivery-fee chain, lost 18,000 referrers, had its reward doubled untested and its measurement left broken — and none of those became a room, because a room needs a person and this stage has never had one.",
};

// ---- Agents (AV09) ----------------------------------------------------------

export const ADVOCATE_AGENT_CARDS: AgentCard[] = [
  {
    id: "referral-lead",
    initials: "RF",
    status: "Lead agent · reading since 12 Jan",
    name: "Referral",
    body: "Watches referral rate, referrer cohorts, reward economics and referred-customer quality. It has produced 14 findings in seven months and opened zero rooms.",
    footnote: "0 rooms · not for lack of findings",
    tone: "ultra",
  },
  {
    id: "why-zero",
    initials: "RF",
    status: "Why zero",
    name: "A room needs an owner",
    body: "Every threshold in this stage routes to the Advocate stage owner, which is nobody, and falls back to Ada. Ada owns 118 teams. Nothing has ever been picked up.",
    footnote: "14 findings, 0 rooms",
    tone: "rose",
    footnoteTone: "rose",
  },
  {
    id: "fifth-signal",
    initials: "RF",
    status: "What it found on 11 March",
    name: "The fifth signal",
    body: "Referral rate falling for the first time in two years, dated to the week of 4 March. Correct, in week one, and cited in room 8f2c five months later as evidence somebody else assembled.",
    footnote: "right, and unheard",
    tone: "rose",
    footnoteTone: "rose",
  },
];

export const ADVOCATE_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "referral-rate-falls", condition: "Referral rate falls", threshold: "more than 1 pt", currently: "−3.8", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "referrers-stop-referring", condition: "Referrers stop referring", threshold: "more than 5,000", currently: "18,000", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "reward-cost-rises", condition: "Reward cost per referral rises", threshold: "more than 20%", currently: "+100%", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "reward-change-no-holdout", condition: "A reward change runs without a holdout", threshold: "any", currently: "1 · 18 April", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "referral-share-falls", condition: "Referral share of acquisition falls", threshold: "more than 3 pts", currently: "−4.1", currentlyTone: "rose", status: "not-opened", noOwner: true },
];

export const ADVOCATE_AGENTS_INSIGHT = {
  title: "Five conditions, five breaches, five with no owner — and this time it is not the routing gap",
  body: "Everywhere else the problem was a condition spanning two stages with no natural destination. Here the destination exists and is simply empty. It is a one-line fix that has been available for seven months, and it is the single cheapest thing anyone could do in this workspace today.",
};

export const ADVOCATE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A reward change runs without a holdout", note: "any change to the referral reward amount goes live with no measurement plan" },
  byMoreThan: { label: "By more than", value: "any", note: "there is no tolerance — a reward change either has a holdout or it does not" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens the moment the change ships" },
  segmentedBy: { label: "Segmented by", value: "market, reward amount", note: "so a single market's change is findable, not averaged away" },
  routesTo: { name: "The Advocate stage owner", note: "currently nobody — falls back to Ada" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 18 April, when the reward was raised from ₦500 to ₦1,000 with no holdout — 117 days ago and still unrouted. It is why ₦278M has never been tested.",
  },
};

// ---- History (AV10) ----------------------------------------------------------

export const ADVOCATE_GOAL_ROWS: GoalRow[] = [
  { id: "second-orders", goal: "Second orders", owner: { name: "Tunde", initials: "TB", color: "#B4568F" }, target: "184,000", today: "ahead", todayTone: "teal", paceLabel: "ahead", paceTone: "teal", part: "31% of acquisition, unmanaged", partTone: "amber" },
];

export const ADVOCATE_HISTORY_MID_INSIGHT = {
  tone: "amber" as const,
  title: "The largest acquisition channel in the company contributes to exactly one goal and owns none",
  body: "Referral produces 278,000 customers a year with the best repeat rate and the lowest cost. It appears in no company goal, has no team target, and its only accountability is that its output rolls into somebody else's volume number.",
};

export const ADVOCATE_TRIED_ROWS: TriedRow[] = [
  { id: "reward-raised-1000", what: "Referral reward raised to ₦1,000", when: "18 Apr", result: "+22% volume, +144% cost", resultTone: "amber", measuredHow: "no holdout", learningKept: "unresolved" },
  { id: "reward-raised-500", what: "Reward raised ₦300 → ₦500", when: "2023", result: "+14% volume", resultTone: "neutral", measuredHow: "no holdout", learningKept: "unresolved" },
  { id: "rating-prompt", what: "Referral prompt after a 5-star rating", when: "2024", result: "+8% referrals", resultTone: "teal", measuredHow: "A/B · 50/50", learningKept: "validated" },
  { id: "group-ordering-cross-referral", what: "Group ordering cross-referral", when: "never", whenTone: "amber", result: "untried · 4.1 referrals each", resultTone: "amber", measuredHow: "—", learningKept: "never proposed", learningKeptTone: "rose" },
  { id: "reward-holdout", what: "A holdout on the reward", when: "never", whenTone: "rose", result: "untried · ₦278M unexplained", resultTone: "rose", measuredHow: "—", learningKept: "never proposed", learningKeptTone: "rose" },
];

export const ADVOCATE_HISTORY_INSIGHT = {
  title: "One test in five had a control, and it is the only one anybody can still argue from",
  body: "The 2024 rating prompt was A/B tested and returned +8%. Two reward increases totalling ₦278M a year were not tested at all. This is the least-measured stage in the lifecycle and the one with the highest return per naira — which are not unrelated facts.",
};

// ---- Compare periods (AV11) -----------------------------------------------

export const ADVOCATE_COMPARE_ROWS: CompareRow[] = [
  { id: "referral-rate", metric: "Referral rate", before: "13.2%", after: "9.3%", change: "−3.9 pts", changeTone: "rose", whatMovedIt: "The fee · first fall in two years" },
  { id: "referrals-per-referrer", metric: "Referrals per referrer", before: "2.4", after: "1.9", change: "−20.8%", changeTone: "rose", whatMovedIt: "Same cause · less enthusiasm" },
  { id: "referred-customers-per-month", metric: "Referred customers per month", before: "7,680", after: "3,730", change: "−51.4%", changeTone: "rose", whatMovedIt: "Both effects compounding" },
  { id: "referral-share", metric: "Referral share of acquisition", before: "34.1%", after: "30.0%", change: "−4.1 pts", changeTone: "rose", whatMovedIt: "Paid social filled the gap" },
  { id: "reward-paid-per-month", metric: "Reward paid per month", before: "₦10.7M", after: "₦26.1M", change: "+144%", changeTone: "rose", whatMovedIt: "The April increase" },
  { id: "cost-per-referred-customer", metric: "Cost per referred customer", before: "₦500", after: "₦1,000", change: "+100%", changeTone: "rose", whatMovedIt: "Paying twice as much for half as many" },
];

export const ADVOCATE_COMPARE_INSIGHT = {
  title: "Half as many referrals, at twice the price, in the same six months",
  body: "Referred customers per month fell 51% and the cost per one doubled. Neither of those two facts caused the other and nobody has seen them on the same screen before — the fee is not in this stage and the reward increase was a Marketing decision reviewed against its own volume number.",
};

// ---- One referrer group (AV13, /lifecycle/advocate/referrers/:id) ---------

export type AdvocateTradeRow = {
  id: string;
  label: string;
  priceReading: string;
  advocateReading: string;
  whoRight: string;
  whoRightTone: "amber" | "teal" | "rose";
};

export type AdvocateReferrerGroupDetail = {
  title: string;
  subtitle: string;
  kpis: Kpi[];
  warningTitle: string;
  warningBody: string;
  tradeEyebrow: string;
  tradeRows: AdvocateTradeRow[];
  closingTitle: string;
  closingBody: string;
};

export const ADVOCATE_REFERRER_GROUP_DETAILS: Record<string, AdvocateReferrerGroupDetail> = {
  "legacy-unlimited-holders": {
    title: "Legacy Unlimited holders",
    subtitle: "3,100 customers · 9.2 referrals each · the group Price wants to reprice",
    kpis: [
      { eyebrow: "Customers", value: "3,100", note: "0.07% of the base" },
      { eyebrow: "Referrals each", value: "9.2", tone: "teal", note: "4.1× the base rate" },
      { eyebrow: "Customers referred", value: "28,500", tone: "teal", note: "10.3% of all referrals" },
      { eyebrow: "Their own repeat rate", value: "81.1%", tone: "teal", note: "highest of any group" },
    ],
    warningTitle: "Price wants to reprice these customers. Advocate cannot afford to lose them.",
    warningBody:
      "They cost ₦410 a delivery against ₦93 of revenue — roughly ₦162M a year net. They also produce 28,500 customers a year at zero CAC, worth roughly ₦285M in avoided acquisition cost.",
    tradeEyebrow: "The trade, as far as either stage can currently see it",
    tradeRows: [
      { id: "the-cost", label: "The cost", priceReading: "₦410 delivery vs ₦93 revenue per order", advocateReading: "Not counted here", whoRight: "Price", whoRightTone: "amber" },
      { id: "annual-net-cost", label: "Annual net cost", priceReading: "≈₦162M", advocateReading: "Not counted here", whoRight: "Price", whoRightTone: "amber" },
      { id: "the-value", label: "The value", priceReading: "Not counted there", advocateReading: "28,500 referred customers a year", whoRight: "Advocate", whoRightTone: "teal" },
      { id: "avoided-cac", label: "Avoided acquisition cost", priceReading: "Not counted there", advocateReading: "≈₦285M at blended CAC", whoRight: "Advocate", whoRightTone: "teal" },
      { id: "contribution-margin", label: "Contribution margin", priceReading: "Unavailable", advocateReading: "Unavailable", whoRight: "neither", whoRightTone: "rose" },
      { id: "referrals-survive-repricing", label: "Whether referrals survive repricing", priceReading: "Unavailable", advocateReading: "Unavailable", whoRight: "neither", whoRightTone: "rose" },
    ],
    closingTitle: "Two stages, two correct readings, opposite conclusions, and no room",
    closingBody:
      "Ravi has been blocked on this since 2024 because margin is unavailable. The referral value has never entered the conversation because Advocate has no owner to bring it. The only honest next step is a holdout — reprice 300 of them and measure what happens to referrals — and it needs both stages in one room.",
  },
};

export const ADVOCATE_REFERRER_GROUP_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Price wants to reprice Legacy Unlimited holders · Advocate cannot afford to lose them",
  carriedIn: [
    { label: "Stage", value: "Advocate + Price" },
    { label: "Group", value: "Legacy Unlimited holders" },
    { label: "Blocked since", value: "2024" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "3,100 customers · ≈₦162M cost vs ≈₦285M avoided CAC",
  countedNote: "Counted 6 minutes ago · contribution margin unavailable to either stage",
  participants: [
    { initials: "RM", kind: "human", color: "#5D6BB8" },
    { initials: "AD", kind: "human", color: "#2E8B7F" },
  ],
  participantsNote: "Ravi owns Price · no Advocate owner, escalated to Ada by default",
};
