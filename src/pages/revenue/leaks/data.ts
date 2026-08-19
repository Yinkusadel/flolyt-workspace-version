import { DEPARTMENT_COLORS, type Department } from "@/pages/everyday/lifecycle/data";
import type { AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import {
  ADA,
  AMARA,
  EXPANSION,
  IFEOMA,
  INVOLUNTARY_CHURN,
  KUNLE,
  PRICE_MARGIN,
  RAVI,
  REPEAT_DECAY,
  SAM,
  TUNDE,
  ZAINAB,
} from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Leakage map — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-leakage-map/ (19 frames,
 * LK01-LK19). Content transcribed from the export's own `lk.py` generator
 * source rather than parsed off the rendered SVGs — it holds the exact copy
 * as literal Python strings, which is more reliable than re-deriving it from
 * rendered text nodes. See docs/build-tracker.md section 6a.
 */

export type LkTone = "ultra" | "rose" | "amber" | "teal" | "neutral" | "muted";

export const LK_TONE_CLASS: Record<LkTone, string> = {
  ultra: "text-ultra",
  rose: "text-rose",
  amber: "text-amber",
  teal: "text-teal",
  neutral: "text-ink-3",
  muted: "text-ink-4",
};

export const LK_CHIP_TONE: Record<LkTone, "ultra" | "rose" | "amber" | "teal" | "neutral"> = {
  ultra: "ultra",
  rose: "rose",
  amber: "amber",
  teal: "teal",
  neutral: "neutral",
  muted: "neutral",
};

export type ClaimType = "causal" | "association" | "insufficient";

export const CLAIM_LABEL: Record<ClaimType, string> = {
  causal: "causal",
  association: "association",
  insufficient: "insufficient",
};

export const CLAIM_CHIP_TONE: Record<ClaimType, "ultra" | "amber" | "neutral"> = {
  causal: "ultra",
  association: "amber",
  insufficient: "neutral",
};

/** New agents this section introduces — every named person matches an existing rooms/data.ts PersonRef, reused as-is. */
export const PRODUCT_REASON: AgentRef = { initials: "PR", name: "Product Reason" };
export const CHURN_REASON: AgentRef = { initials: "CH", name: "Churn Reason" };

export type LeakageMapState = "empty" | "first-finding" | "full";
/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export const LEAKAGE_MAP_STATE: LeakageMapState = "full";

// ───────────────────────── LK03 · THE MAP (main table, reused by LK07/09/11/17/19) ─────────────────────────

export type LeakMapRow = {
  stage: string;
  team: Department | "Everyone";
  realised: string;
  realisedTone?: LkTone;
  atStake: string;
  atStakeTone?: LkTone;
  claimType: ClaimType;
  roomLabel: string;
  roomTone?: LkTone;
  /** Only Retain and Renew's rooms match an already-built /rooms/:id exactly. */
  roomHref?: string;
  /** Only these three rows have a wired row action, matching the export's own three modal frames. */
  roomAction?: "open-room" | "dispute" | "reclassify";
  owner: PersonRef | null;
};

export const LEAK_MAP_ROWS: LeakMapRow[] = [
  {
    stage: "Retain",
    team: "Marketing",
    realised: "₦437M",
    realisedTone: "rose",
    atStake: "₦412M",
    atStakeTone: "rose",
    claimType: "causal",
    roomLabel: "Second order never happened",
    roomHref: "/rooms/second-order-never-happened",
    owner: IFEOMA,
  },
  {
    stage: "Activate",
    team: "Product",
    realised: "₦201M",
    realisedTone: "rose",
    atStake: "₦188M",
    atStakeTone: "rose",
    claimType: "causal",
    roomLabel: "Fee shown before value",
    owner: ZAINAB,
  },
  {
    stage: "Adopt",
    team: "Product",
    realised: "₦134M",
    realisedTone: "rose",
    atStake: "₦112M",
    atStakeTone: "amber",
    claimType: "association",
    roomLabel: "none",
    roomTone: "rose",
    roomAction: "open-room",
    owner: null,
  },
  {
    stage: "Churn",
    team: "Customer Success",
    realised: "₦118M",
    realisedTone: "rose",
    atStake: "₦124M",
    atStakeTone: "rose",
    claimType: "association",
    roomLabel: "none",
    roomTone: "rose",
    owner: null,
  },
  {
    stage: "Renew",
    team: "Customer Success",
    realised: "₦79M",
    realisedTone: "amber",
    atStake: "₦88M",
    atStakeTone: "amber",
    claimType: "association",
    roomLabel: "Cards failing on renewal night",
    roomHref: "/rooms/cards-failing-on-renewal-night",
    owner: KUNLE,
  },
  {
    stage: "Expand",
    team: "Sales",
    realised: "₦52M",
    realisedTone: "amber",
    atStake: "₦61M",
    atStakeTone: "amber",
    claimType: "association",
    roomLabel: "Basket size after checkout",
    owner: TUNDE,
  },
  {
    stage: "Price",
    team: "Finance",
    realised: "₦31M",
    realisedTone: "amber",
    atStake: "₦46M",
    atStakeTone: "amber",
    claimType: "association",
    roomLabel: "Discount-only buyers",
    roomAction: "dispute",
    owner: RAVI,
  },
  {
    stage: "Support",
    team: "Support",
    realised: "₦28M",
    realisedTone: "amber",
    atStake: "₦9M",
    atStakeTone: "muted",
    claimType: "causal",
    roomLabel: "Lagos delivery failures",
    roomAction: "reclassify",
    owner: AMARA,
  },
  {
    stage: "Acquire",
    team: "Marketing",
    realised: "Unavailable",
    realisedTone: "muted",
    atStake: "₦74M",
    atStakeTone: "amber",
    claimType: "insufficient",
    roomLabel: "Guest checkout cannot be joined",
    owner: TUNDE,
  },
  {
    stage: "Advocate",
    team: "Everyone",
    realised: "Unavailable",
    realisedTone: "muted",
    atStake: "—",
    atStakeTone: "muted",
    claimType: "insufficient",
    roomLabel: "none",
    roomTone: "rose",
    owner: null,
  },
];

export const LK_TABS = ["The map", "By market", "By claim", "What changed", "Unmeasurable", "Detection"] as const;
export type LkTab = (typeof LK_TABS)[number];

// ───────────────────────── LK01 · NOTHING MEASURED YET ─────────────────────────

export const LK01_AGENT_ROWS: { agent: AgentRef; reading: string; since: string; canPrice: string; canPriceTone: LkTone }[] = [
  { agent: REPEAT_DECAY, reading: "Order history · 1.24M orders, 18 months", since: "12 Dec", canPrice: "not until a baseline is locked", canPriceTone: "muted" },
  { agent: PRICE_MARGIN, reading: "Prices and plans · six, four currencies", since: "12 Dec", canPrice: "no · COGS source not connected", canPriceTone: "rose" },
  { agent: INVOLUNTARY_CHURN, reading: "Failed payments · retry outcomes", since: "14 Dec", canPrice: "not until a baseline is locked", canPriceTone: "muted" },
];

// ───────────────────────── LK02 · THE FIRST LEAK ─────────────────────────

export const LK02_MISSING_ROWS: { missing: string; why: string; who: PersonRef; asked: string }[] = [
  { missing: "A release log for 4 March", why: "Turns a dated change into a named change", who: SAM, asked: "today" },
  { missing: "Checkout step events", why: "Would show where in the flow people stop", who: ZAINAB, asked: "today" },
  { missing: "A market that did not receive it", why: "Ghana and the UK look like one, unconfirmed", who: SAM, asked: "today" },
];

export const LK02_WHAT_NEXT_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "A room is offered, not opened", value: "the agent can propose one · opening it means naming a person", tone: "ultra" },
  { label: "Nothing is sent to anybody", value: "no agent can act · this has reached three people and no customers", tone: "teal" },
  { label: "It will not be promoted by age", value: "if it is still an association in a month, it is still an association", tone: "amber" },
  { label: "If none of the three requests arrives", value: "it stays an association permanently · it does not decay into a cause", tone: "rose" },
];

// ───────────────────────── LK03 · THE MAP ─────────────────────────

export const LK03_NOT_ON_MAP_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "Advocate", value: "124k referrers at ₦0 CAC · no owner for 214 days · no figure has ever been produced", tone: "amber" },
  { label: "Feature depth", value: "two features against none is +43 points on repeat · no goal, no owner, never proposed", tone: "rose" },
  { label: "The routing gap", value: "12 cross-stage conditions with no destination · three of them carry money", tone: "rose" },
  { label: "Anything before 1 January", value: "no baseline · this map starts where the measurement starts", tone: "muted" },
];

// ───────────────────────── LK04 · ONE LEAK, ALL TEN STAGES ─────────────────────────

export const LK04_CARDS: { kicker: string; bold: string; body: string; footer: string; tone: LkTone }[] = [
  {
    kicker: "The change",
    bold: "One line, shipped clean",
    body: "On 4 March Engineering moved the delivery fee out of the basket subtotal and into checkout. It was reviewed, tested, flagged to nobody and correct by every standard applied to it.",
    footer: "release 2024.03.04-b",
    tone: "ultra",
  },
  {
    kicker: "What each desk saw",
    bold: "Five symptoms, five names",
    body: "Marketing called it a repeat-rate drop. Product called it a checkout regression. Support called it a delivery complaint. Finance called it discount dependence. Sales called it basket shrinkage.",
    footer: "none of them was wrong",
    tone: "amber",
  },
  {
    kicker: "The gap",
    bold: "151 days",
    body: "Every symptom was visible within eleven days. The five were joined into one cause on 2 August, in four hours, once they were in the same room.",
    footer: "₦7.2M a day, on average",
    tone: "rose",
  },
];

export const LK04_STAGE_ROWS: { stage: string; whatItLooked: string; realised: string; realisedTone: LkTone; firstSeen: string; namedAsCause: string; namedTone: LkTone }[] = [
  { stage: "Activate", whatItLooked: "41% reach first value · was 58%", realised: "₦201M", realisedTone: "rose", firstSeen: "9 Mar", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Retain", whatItLooked: "Repeat rate 37.4% → 27.2%", realised: "₦437M", realisedTone: "rose", firstSeen: "11 Mar", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Adopt", whatItLooked: "2.1 features average · was 2.9", realised: "₦134M", realisedTone: "rose", firstSeen: "6 Apr", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Support", whatItLooked: "12.8k tickets · 31% about the fee", realised: "₦28M", realisedTone: "amber", firstSeen: "7 Mar", namedAsCause: "21 Mar", namedTone: "teal" },
  { stage: "Expand", whatItLooked: "Basket 1.4× ARPU · was 1.7×", realised: "₦52M", realisedTone: "amber", firstSeen: "2 Apr", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Price", whatItLooked: "Discount attach rate up 14 points", realised: "₦31M", realisedTone: "amber", firstSeen: "19 Mar", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Renew", whatItLooked: "Dunning failures up · larger balances", realised: "₦79M", realisedTone: "amber", firstSeen: "28 Mar", namedAsCause: "2 Aug", namedTone: "rose" },
  { stage: "Churn", whatItLooked: "3.1% a month · reason field empty", realised: "₦118M", realisedTone: "rose", firstSeen: "15 Mar", namedAsCause: "2 Aug", namedTone: "rose" },
];

export const LK04_UNPRICED_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "Acquire", value: "42,000 guest-checkout customers cannot be joined to an order · no figure exists", tone: "muted" },
  { label: "Advocate", value: "no owner for 214 days · referrals are counted, their revenue never has been", tone: "muted" },
  { label: "So ₦1.08B is eight stages of ten", value: "a floor, not a total, and it is labelled that way everywhere", tone: "rose" },
];

// ───────────────────────── LK05 · BY MARKET ─────────────────────────

export const LK05_MARKET_ROWS: {
  market: string;
  base: string;
  realised: string;
  realisedTone: LkTone;
  worstStage: string;
  worseThanNg: string;
  worseThanNgTone: LkTone;
  feeShipped: string;
  feeShippedTone: LkTone;
  owner: PersonRef | null;
}[] = [
  { market: "Nigeria", base: "2.91M", realised: "₦1.08B", realisedTone: "rose", worstStage: "Retain · ₦437M", worseThanNg: "—", worseThanNgTone: "muted", feeShipped: "4 Mar", feeShippedTone: "rose", owner: ADA },
  { market: "Kenya", base: "610k", realised: "KES 41.2M", realisedTone: "amber", worstStage: "Renew · KES 12.1M", worseThanNg: "2 of 10", worseThanNgTone: "amber", feeShipped: "4 Mar", feeShippedTone: "rose", owner: KUNLE },
  { market: "Ghana", base: "410k", realised: "GHS 2.9M", realisedTone: "amber", worstStage: "Acquire · GHS 1.1M", worseThanNg: "9 of 10", worseThanNgTone: "rose", feeShipped: "14 Sep", feeShippedTone: "rose", owner: null },
  { market: "UK", base: "269k", realised: "£0", realisedTone: "teal", worstStage: "none · flat across 151 days", worseThanNg: "0 of 10", worseThanNgTone: "teal", feeShipped: "not scheduled", feeShippedTone: "teal", owner: RAVI },
];

export const LK05_GHANA_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "What is already wrong", value: "22% price premium unrevised since August 2024 · no local margin baseline", tone: "rose" },
  { label: "What is scheduled", value: "the same release, 14 September, 410,000 customers", tone: "rose" },
  { label: "Rooms open", value: "one · and it has had no owner for eleven days", tone: "rose" },
  { label: "Recovered here so far", value: "GHS 1.4M · one of two closed rooms had a holdout", tone: "amber" },
  { label: "Who could stop the release", value: "Sam Iyer · nobody has asked him to", tone: "amber" },
];

// ───────────────────────── LK06 · BY CLAIM TYPE ─────────────────────────

export const LK06_CARDS: { kicker: string; bold: string; body: string; footer: string; tone: LkTone }[] = [
  {
    kicker: "Causal finding",
    bold: "₦666M · 3 stages",
    body: "A dated change, a market that did not receive it, and a mechanism that survives being argued with. Retain, Activate and Support.",
    footer: "can justify a play",
    tone: "ultra",
  },
  {
    kicker: "Strong association",
    bold: "₦414M · 5 stages",
    body: "Moves with the release and has no rival explanation anyone has offered. It has never been tested against a control. Adopt, Churn, Renew, Expand, Price.",
    footer: "can justify a test, not a play",
    tone: "amber",
  },
  {
    kicker: "Insufficient evidence",
    bold: "Unavailable · 2 stages",
    body: "The data needed to make any claim does not exist. Acquire cannot be joined to orders; Advocate has never been instrumented.",
    footer: "can justify a request",
    tone: "muted",
  },
];

export const LK06_UPGRADE_ROWS: { stage: string; claimNow: ClaimType; whatMissing: string; who: PersonRef | null; wouldBecome: ClaimType }[] = [
  { stage: "Adopt", claimNow: "association", whatMissing: "A feature-depth holdout · never run anywhere", who: ZAINAB, wouldBecome: "causal" },
  { stage: "Churn", claimNow: "association", whatMissing: "A reason field that is filled in · 71% empty", who: null, wouldBecome: "causal" },
  { stage: "Renew", claimNow: "association", whatMissing: "Balance size at failure · in `order_lines`", who: SAM, wouldBecome: "causal" },
  { stage: "Expand", claimNow: "association", whatMissing: "Basket composition before 4 March", who: SAM, wouldBecome: "causal" },
  { stage: "Price", claimNow: "association", whatMissing: "COGS · missing since 12 January", who: SAM, wouldBecome: "causal" },
  { stage: "Acquire", claimNow: "insufficient", whatMissing: "A customer reference on guest orders", who: SAM, wouldBecome: "association" },
  { stage: "Advocate", claimNow: "insufficient", whatMissing: "Referral attribution · never built", who: null, wouldBecome: "association" },
];

// ───────────────────────── LK07 · SAVED VIEWS AND FILTERS ─────────────────────────

export const LK07_VIEW_ROWS: { view: string; holds: string; lines: string; realised: string; realisedTone: LkTone; sharedWith: string; owner: PersonRef }[] = [
  { view: "Unowned money", holds: "Any line with no room or no owner", lines: "2", realised: "₦252M", realisedTone: "rose", sharedWith: "Everyone", owner: ADA },
  { view: "Causal only", holds: "Excludes association and insufficient evidence", lines: "3", realised: "₦666M", realisedTone: "muted", sharedWith: "Finance", owner: RAVI },
  { view: "Ghana", holds: "One market, all ten stages", lines: "10", realised: "GHS 2.9M", realisedTone: "amber", sharedWith: "Everyone", owner: KUNLE },
  { view: "Measurable only", holds: "Drops every line with no denominator", lines: "8", realised: "₦1.08B", realisedTone: "muted", sharedWith: "private", owner: IFEOMA },
  { view: "Not attributed to 4 March", holds: "The residual after the release is removed", lines: "2", realised: "Unavailable", realisedTone: "muted", sharedWith: "private", owner: ADA },
];

export const LK07_FILTER_ROWS: { label: string; value: string; tone?: LkTone }[] = [
  { label: "Market", value: "Nigeria, Kenya, Ghana, UK · never summed into one figure" },
  { label: "Claim type", value: "causal · association · insufficient · shown separately, never averaged", tone: "ultra" },
  { label: "Stage", value: "any of ten · Advocate and Churn return rows with no owner", tone: "amber" },
  { label: "Has a room", value: "yes / no · the “no” filter is the one Ada has pinned", tone: "amber" },
  { label: "Hide unavailable", value: "not offered · unavailable lines stay on every view", tone: "rose" },
  { label: "Sort by age", value: "not offered · age is displayed and never scored", tone: "rose" },
];

// ───────────────────────── LK08 · SEARCH ─────────────────────────

export const LK08_RESULT_ROWS: { result: string; kind: string; kindTone: LkTone; where: string; realised: string; realisedTone: LkTone; match: string }[] = [
  { result: "The delivery fee moved to checkout", kind: "release", kindTone: "ultra", where: "8 stages", realised: "₦1.08B", realisedTone: "rose", match: "exact" },
  { result: "Second order never happened", kind: "room", kindTone: "neutral", where: "Retain", realised: "₦437M", realisedTone: "rose", match: "named in" },
  { result: "Fee shown before value", kind: "room", kindTone: "neutral", where: "Activate", realised: "₦201M", realisedTone: "rose", match: "named in" },
  { result: "Lagos delivery failures", kind: "room", kindTone: "neutral", where: "Support", realised: "₦28M", realisedTone: "amber", match: "named in" },
  { result: "31% of tickets mention the fee", kind: "finding", kindTone: "ultra", where: "Support · 21 Mar", realised: "—", realisedTone: "muted", match: "body" },
  { result: "`checkout.fee_shown`", kind: "event", kindTone: "amber", where: "not instrumented", realised: "—", realisedTone: "muted", match: "field name" },
  { result: "Ghana · fee ships 14 September", kind: "scheduled", kindTone: "rose", where: "Ghana", realised: "Unavailable", realisedTone: "muted", match: "body" },
];

export const LK08_NOT_SHOWN_ROWS: { label: string; value: string; tone?: LkTone }[] = [
  { label: "Customer records", value: "search a cohort in Customers · this index is stages, rooms and fields" },
  { label: "Anything in a restricted room", value: "one match suppressed · the count is shown, the row is not", tone: "amber" },
  { label: "Results ranked by recency", value: "no · ranked by money, then by kind" },
];

// ───────────────────────── LK09 · WHAT CHANGED ─────────────────────────

export const LK09_MOVEMENT_ROWS: { change: string; line: string; was: string; now: string; nowTone: LkTone; why: string; whyTone: LkTone; when: string }[] = [
  { change: "New line", line: "Expand · basket after checkout", was: "—", now: "₦52M", nowTone: "amber", why: "a room was opened", whyTone: "muted", when: "Mon" },
  { change: "Claim strengthened", line: "Support · Lagos delivery failures", was: "association", now: "causal", nowTone: "ultra", why: "the refund holdout closed", whyTone: "teal", when: "Tue" },
  { change: "Figure revised down", line: "Renew · dunning", was: "₦91M", now: "₦79M", nowTone: "amber", why: "double-count with Churn removed", whyTone: "teal", when: "Wed" },
  { change: "Went unavailable", line: "Price · margin", was: "₦46M", now: "Unavailable", nowTone: "muted", why: "COGS feed stopped 12 Jan", whyTone: "rose", when: "Thu" },
];

export const LK09_REVISION_ROWS: { line: string; revisions: string; reason: string; direction: string; who: PersonRef }[] = [
  { line: "Renew · dunning", revisions: "3", reason: "Overlap with Churn subtracted", direction: "down ₦12M", who: RAVI },
  { line: "Retain · second order", revisions: "2", reason: "Guest-checkout cohort removed from the denominator", direction: "down ₦9M", who: IFEOMA },
  { line: "Price · margin", revisions: "4", reason: "Source unavailable · figure withdrawn", direction: "withdrawn", who: RAVI },
  { line: "Support · Lagos", revisions: "1", reason: "Refunds confirmed against bank settlement", direction: "up ₦3M", who: AMARA },
];

// ───────────────────────── LK10 · A LINE WITH NO OWNER ─────────────────────────

export const LK10_FINDING_ROWS: { agent: AgentRef; finding: string; confidence: string; confidenceTone: LkTone; routedTo: string; outcome: string }[] = [
  { agent: REPEAT_DECAY, finding: "Two features against none is +43 points on 90-day repeat", confidence: "5 / 5", confidenceTone: "teal", routedTo: "Adopt · owner", outcome: "no owner" },
  { agent: PRODUCT_REASON, finding: "Depth fell from 2.9 to 2.1 in the fortnight after 4 March", confidence: "4 / 5", confidenceTone: "teal", routedTo: "Adopt · owner", outcome: "no owner" },
  { agent: CHURN_REASON, finding: "Single-feature customers churn at 4.9% a month", confidence: "4 / 5", confidenceTone: "teal", routedTo: "Churn · owner", outcome: "no owner" },
  { agent: EXPANSION, finding: "Depth predicts upgrade better than tenure or basket", confidence: "3 / 5", confidenceTone: "muted", routedTo: "Expand · Tunde", outcome: "read, not acted on" },
];

export const LK10_ENDS_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "Somebody owns Adopt", value: "one click · Zainab is the obvious candidate and has 8 rooms already", tone: "teal" },
  { label: "The line is explicitly parked", value: "with a name and a reason · it stays on the map, marked parked", tone: "amber" },
  { label: "Nothing happens", value: "the default · it stays here, unowned, and the count keeps rising", tone: "rose" },
  { label: "What is not offered", value: "hiding it, archiving it, or routing it to a team automatically", tone: "rose" },
];

// ───────────────────────── LK11 · MY STAGE (lens, ?as=owner) ─────────────────────────

export const LK11_HERS_ROWS: { line: string; realised: string; realisedTone: LkTone; atStake: string; atStakeTone: LkTone; claimType: ClaimType; room: string; state: string; stateTone: LkTone }[] = [
  { line: "Second order never happened", realised: "₦437M", realisedTone: "rose", atStake: "₦412M", atStakeTone: "rose", claimType: "causal", room: "Open · 2 days", state: "no holdout yet", stateTone: "amber" },
  { line: "Weekend push fatigue", realised: "₦12M", realisedTone: "muted", atStake: "—", atStakeTone: "muted", claimType: "insufficient", room: "Closed 17 Mar", state: "closed at ₦12M", stateTone: "muted" },
];

export const LK11_BELOW_LINE_ROWS: { line: string; realised: string; why: string; owner: PersonRef | null; whatSheCanDo: string; whatSheCanDoTone: LkTone }[] = [
  { line: "Adopt · feature depth", realised: "₦134M", why: "+43 points on repeat · the strongest predictor of her metric", owner: null, whatSheCanDo: "ask for an owner", whatSheCanDoTone: "amber" },
  { line: "Activate · fee before value", realised: "₦201M", why: "Her cohort arrives from this step · 41% reach value", owner: ZAINAB, whatSheCanDo: "join the room", whatSheCanDoTone: "teal" },
  { line: "Churn · reason unknown", realised: "₦118M", why: "Her lapsed customers land here and are not counted twice", owner: null, whatSheCanDo: "ask for an owner", whatSheCanDoTone: "amber" },
];

// ───────────────────────── LK12 · UNMEASURABLE ─────────────────────────

export const LK12_ROWS: { figure: string; stage: string; whyNot: string; blockedSince: string; blockedTone: LkTone; wouldNeed: string; wouldNeedTone: LkTone; asked: string }[] = [
  { figure: "Acquire · realised loss", stage: "Acquire", whyNot: "42,000 guest orders have no customer reference", blockedSince: "12 Jan", blockedTone: "rose", wouldNeed: "a field on `orders`", wouldNeedTone: "amber", asked: "28 Jul" },
  { figure: "Advocate · anything at all", stage: "Advocate", whyNot: "Referral attribution was never built", blockedSince: "always", blockedTone: "rose", wouldNeed: "an owner first", wouldNeedTone: "rose", asked: "never" },
  { figure: "Price · margin", stage: "Price", whyNot: "COGS source stopped delivering", blockedSince: "12 Jan", blockedTone: "rose", wouldNeed: "`order_lines`", wouldNeedTone: "amber", asked: "28 Jul" },
  { figure: "Adopt · depth by feature", stage: "Adopt", whyNot: "`loyalty.tier_shown` never fired", blockedSince: "Aug 2024", blockedTone: "rose", wouldNeed: "one event mapped", wouldNeedTone: "amber", asked: "6 Apr" },
  { figure: "Ghana · card recovery", stage: "Renew", whyNot: "No card volume baseline in the market", blockedSince: "always", blockedTone: "amber", wouldNeed: "90 days of history", wouldNeedTone: "amber", asked: "9 Jul" },
  { figure: "Support · cost per contact", stage: "Support", whyNot: "Tickets are counted, never costed", blockedSince: "always", blockedTone: "amber", wouldNeed: "a rate from Finance", wouldNeedTone: "amber", asked: "today" },
];

export const LK12_COST_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "Figures blocked", value: "6 · across 4 stages · 2 of them are whole stages", tone: "rose" },
  { label: "Rooms that cannot close properly", value: "3 · they will close as unmeasurable and say so", tone: "amber" },
  { label: "Money involved", value: "at least ₦74M-equivalent · the true figure is one of the things blocked", tone: "muted" },
  { label: "Estimated substitute figures in use", value: "none · this is the point of the screen", tone: "teal" },
];

// ───────────────────────── LK13 · DETECTION ─────────────────────────

export const LK13_STAGE_BARS: { label: string; sub: string; percent: number; tone: "teal" | "amber" | "rose" }[] = [
  { label: "Support · saw 7 Mar, named 21 Mar", sub: "3 days to see · 17 to name · then it stopped there", percent: 11, tone: "teal" },
  { label: "Activate · saw 9 Mar, named 2 Aug", sub: "5 days to see · 151 to name", percent: 100, tone: "rose" },
  { label: "Retain · saw 11 Mar, named 2 Aug", sub: "7 days to see · 151 to name", percent: 100, tone: "rose" },
  { label: "Churn · saw 15 Mar, named 2 Aug", sub: "11 days to see · 151 to name", percent: 100, tone: "rose" },
  { label: "Price · saw 19 Mar, named 2 Aug", sub: "15 days to see · 151 to name", percent: 100, tone: "rose" },
];

export const LK13_WOULD_HELP_ROWS: { label: string; value: string; tone: LkTone }[] = [
  { label: "A destination for a cross-stage symptom", value: "the routing gap · 12 conditions still have none", tone: "rose" },
  { label: "A release feed joined to metrics", value: "connected 2 Aug · the join that ended it", tone: "teal" },
  { label: "The UK marked as a control", value: "it always was one · nobody had said so", tone: "amber" },
  { label: "More agents", value: "would not have helped · every symptom was already found", tone: "muted" },
  { label: "A lower alert threshold", value: "would not have helped · nine thresholds had already breached", tone: "muted" },
];

// ───────────────────────── LK17 · SHARE AND EXPORT ─────────────────────────

export const LK17_INCLUDED_ROWS: { included: string; why: string; optional: string; optionalTone: LkTone; format: string }[] = [
  { included: "Every line, including the unavailable ones", why: "A map with the gaps removed is a different map", optional: "no", optionalTone: "rose", format: "all" },
  { included: "Claim type on every figure", why: "A causal ₦437M and an association ₦134M are not the same claim", optional: "no", optionalTone: "rose", format: "all" },
  { included: "The date the baseline locked", why: "Every figure is measured from it", optional: "no", optionalTone: "rose", format: "all" },
  { included: "Open disputes", why: "One line is disputed by Tunde · it travels marked", optional: "no", optionalTone: "rose", format: "all" },
  { included: "Revision history", why: "Four figures have changed · previous values readable", optional: "yes", optionalTone: "teal", format: "CSV, PDF" },
  { included: "Room links", why: "Only resolve for people already in the workspace", optional: "yes", optionalTone: "teal", format: "PDF" },
  { included: "A combined total", why: "Four currencies · there is no such number", optional: "never", optionalTone: "rose", format: "—" },
];

export const LK17_WENT_ROWS: { label: string; value: string; tone?: LkTone }[] = [
  { label: "Board pack · 14 August", value: "Ravi Mehta · PDF · included the dispute and two unavailable rows" },
  { label: "Ghana review · 11 August", value: "Kunle Ade · CSV · nine of ten stages worse, sent with the caveat", tone: "amber" },
  { label: "Engineering · 3 August", value: "Sam Iyer · link · the day after the connection was made" },
  { label: "Downloads outside the workspace", value: "3 · they carry the export date and go stale silently", tone: "amber" },
];

// ───────────────────────── LK18 · SETTINGS ─────────────────────────

export const LK18_RULE_ROWS: {
  rule: string;
  currently: string;
  who: string;
  canChange: boolean;
  state: string;
  stateTone: LkTone;
}[] = [
  { rule: "A line appears when a threshold breaches", currently: "10 lines", who: "thresholds", canChange: true, state: "on", stateTone: "teal" },
  { rule: "Minimum to show a line", currently: "₦1M", who: "Ada", canChange: true, state: "on", stateTone: "teal" },
  { rule: "Realised and at stake shown separately", currently: "—", who: "product", canChange: false, state: "on", stateTone: "teal" },
  { rule: "Claim type shown on every figure", currently: "—", who: "product", canChange: false, state: "on", stateTone: "teal" },
  { rule: "Unavailable lines stay visible", currently: "2 lines", who: "product", canChange: false, state: "on", stateTone: "teal" },
  { rule: "Figures are annualised", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Lines are ranked by age", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Unowned lines auto-assign to a team", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const LK18_SOURCE_ROWS: { label: string; value: string; tone?: LkTone }[] = [
  { label: "Realised", value: "elapsed loss against the locked baseline · recomputed nightly" },
  { label: "At stake", value: "the stage's own 90-day figure · owned by the stage, not by this map" },
  { label: "Attribution to a release", value: "the release feed joined to metrics · connected 2 August", tone: "teal" },
  { label: "Claim type", value: "the agent states it · only a person can change it", tone: "ultra" },
  { label: "Currency", value: "the market's own · never converted for a figure on this map", tone: "teal" },
];

// ───────────────────────── LK14/15/16 · modal presets ─────────────────────────

export const LK14_OPEN_ROOM_PRESET = {
  subject: "Adopt · feature depth",
  subjectDetail: "₦134M realised · association · 19 findings · unowned 214 days",
  condition: "Customers using one feature or none, 30 days after signup",
  cohortWarning: "318,000 customers match. This cannot be narrowed to one account, one ticket or one campaign, and the field will not accept one.",
  candidates: [
    { person: ZAINAB, reason: "Owns Activate and Adopt", load: "8 rooms", selected: true },
    { person: IFEOMA, reason: "Retain depends on this", load: "14 rooms · high", selected: false },
    { person: ADA, reason: "Owns everything, owns nothing directly", load: "—", selected: false },
  ],
  closingNote: "The room does not fix anything, does not send anything and does not make the association a cause. It gives nineteen findings a destination and one person the ability to say no to them, which is precisely what has been missing.",
};

export const LK15_DISPUTE_PRESET = {
  subject: "Price · ₦31M attributed to the 4 March release",
  subjectDetail: "Claimed by Price & Margin · association · discount attach rate up 14 points",
  options: [
    { title: "The cause", body: "the rise is real, the release did not cause it", selected: true },
    { title: "The figure", body: "the ₦31M arithmetic is wrong", selected: false },
    { title: "The claim type", body: "it is weaker than association", selected: false },
    { title: "That it is a leak at all", body: "the discounting was deliberate and worked", selected: false },
  ],
  argument: "We raised the discount budget on 2 March, two days before the release. The attach rate rose because we spent more, not because the fee moved.",
  whileOpenTitle: "What happens to the ₦31M while this is open",
  whileOpenBody: "It stays on the map, marked disputed, with your name on it. It is not removed and not greyed out. Price & Margin must answer within its next run or the claim drops a category.",
  closingNote: "If Price & Margin holds its position, the conflict is named and both readings stay attached to the line until a person settles it. Splitting the difference at ₦15.5M would produce a number neither of you believes and nobody could defend.",
};

// ───────────────────────── LK10 · "Assign an owner" (reuses the shared lifecycle modal) ─────────────────────────

export const LK10_ASSIGN_OWNER_PRESET: AssignOwnerPreset = {
  description: "Nineteen findings have named Adopt · feature depth. None has ever reached a person.",
  unownedTitle: "₦134M · unowned 214 days",
  statsLine: "19 findings · 9 breached thresholds · 0 rooms opened",
  candidatesEyebrow: "The obvious candidate",
  candidates: [
    {
      id: ZAINAB.initials,
      initials: ZAINAB.initials,
      color: DEPARTMENT_COLORS[ZAINAB.department],
      name: ZAINAB.name,
      reason: "Already owns Activate and Adopt · 8 rooms",
      selected: true,
    },
  ],
  consequencesEyebrow: "What is not offered instead",
  consequences: [
    { label: "Explicitly parked, with a name and a reason", value: "stays on the map, marked parked", tone: "amber" },
    { label: "Auto-assigned to the nearest team", value: "not offered", tone: "amber" },
    { label: "Archived or hidden", value: "not offered", tone: "amber" },
  ],
  closingTitle: "Nineteen findings, nine breached thresholds and zero rooms is not an agent failure",
  closingBody:
    "Every one of these was produced, ranked and routed correctly. They arrived at a field that is empty, and an empty field is not a person. Flolyt will not auto-assign this to the nearest plausible team, because an owner who did not agree to be one is how a ₦134M line sits untouched for 214 days while looking assigned.",
  confirmLabel: "Assign Zainab",
};

export const LK16_RECLASSIFY_PRESET = {
  subject: "Support · Lagos delivery failures",
  subjectDetail: "₦28M · currently association · 3,100 orders refunded, no holdout",
  options: [
    { title: "Causal finding", body: "a mechanism, a date and a group it did not reach", selected: true, blocked: false },
    { title: "Strong association", body: "where it is now", selected: false, blocked: false },
    { title: "Insufficient evidence", body: "downgrade · allowed, and used twice this month", selected: false, blocked: false },
    { title: "Confirmed by the agent that raised it", body: "not offered · an agent cannot promote its own claim", selected: false, blocked: true },
  ],
  evidence: [
    { label: "The group it did not reach", value: "310 orders outside the affected postcodes" },
    { label: "The mechanism", value: "driver app cached a stale fee and quoted it twice" },
    { label: "The date", value: "7 March · matches the release, not the weather" },
  ],
  closingNote: "The agent produced all three pieces of evidence and is not allowed to draw the conclusion from them. A person has to look at the mechanism and say it holds — and their name stays on the chip, so anyone who doubts it later knows exactly who to ask.",
};
