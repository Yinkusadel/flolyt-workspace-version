import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { AgentRef } from "@/pages/everyday/rooms/types";

/**
 * Customers · Customer health — sourced from
 * flolyt-figma-designs/Customers Screens/flolyt-customer-health/flolyt-customer-health/
 * (16 frames, HL01-HL16). Content transcribed from the export's own `hl.py`
 * generator source, same approach as Segments. See docs/build-tracker.md.
 */

export type HlTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const HL_TONE_CLASS: Record<HlTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const HL_CHIP_TONE: Record<HlTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const HL_KPI_TONE: Record<HlTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const HL_BAR_TONE: Record<HlTone, "teal" | "amber" | "rose" | "ink" | "ultra"> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as Segments' SEGMENTS_STATE. */
export type HealthState = "nothing" | "first" | "full";
export const HEALTH_STATE: HealthState = "full";

export const HL_TABS = ["Signals", "By cohort", "Coverage", "What changed", "Thresholds"] as const;
export type HlTab = (typeof HL_TABS)[number];

// ───────────────────────── HL01 · NOTHING TO READ YET ─────────────────────────

export const HL01_SIGNAL_ROWS: {
  signal: string;
  predicts: string;
  strength: string;
  strengthTone: HlTone;
  source: string;
  ready: string;
  readyTone: HlTone;
}[] = [
  { signal: "Feature depth in week one", predicts: "90-day repeat", strength: "expected strong", strengthTone: "ai", source: "feature_events", ready: "1 Jan", readyTone: "warn" },
  { signal: "Second order within 30 days", predicts: "90-day repeat", strength: "expected strong", strengthTone: "ai", source: "orders", ready: "1 Jan", readyTone: "warn" },
  { signal: "Card failure history", predicts: "Involuntary churn", strength: "expected strong", strengthTone: "ai", source: "payments", ready: "1 Jan", readyTone: "warn" },
  { signal: "Contacted support about a fee", predicts: "Voluntary churn", strength: "expected moderate", strengthTone: "warn", source: "tickets", ready: "1 Jan", readyTone: "warn" },
  { signal: "Discount dependence", predicts: "Margin, not churn", strength: "expected weak", strengthTone: "warn", source: "orders", ready: "1 Jan", readyTone: "warn" },
  { signal: "Made a referral", predicts: "Repeat and lifetime value", strength: "expected strong", strengthTone: "ai", source: "not instrumented", ready: "never", readyTone: "risk" },
];

// ───────────────────────── HL02 · THE FIRST SIGNAL ─────────────────────────

export const HL02_STATS: { eyebrow: string; value: string; note: string; tone: HlTone }[] = [
  { eyebrow: "The gap", value: "43 points", note: "70.2% against 12.8%", tone: "risk" },
  { eyebrow: "Holds in", value: "4 of 4 markets", note: "and every cohort tested", tone: "ok" },
  { eyebrow: "Claim type", value: "Association", note: "no test has been run", tone: "warn" },
  { eyebrow: "Rooms opened about it", value: "0", note: "in the 214 days since", tone: "risk" },
];

export const HL02_ROWS: { whatItWouldTake: string; howLong: string; howLongTone: HlTone; cost: string; costTone: HlTone; who: string; started: string; startedTone: HlTone }[] = [
  { whatItWouldTake: "Prompt one feature at day three, hold a group", howLong: "21 days", howLongTone: "ok", cost: "≈₦1.4M held", costTone: "warn", who: "Zainab · owns Adopt", started: "never proposed", startedTone: "risk" },
  { whatItWouldTake: "Compare markets where onboarding differs", howLong: "today", howLongTone: "muted", cost: "nothing", costTone: "ok", who: "anyone", started: "not done", startedTone: "warn" },
  { whatItWouldTake: "Wait and watch it stay 43 points", howLong: "indefinite", howLongTone: "risk", cost: "nothing", costTone: "muted", who: "nobody", started: "what is happening", startedTone: "risk" },
];

// ───────────────────────── HL03 · THE SIGNALS ─────────────────────────

export const HL03_STATS: { eyebrow: string; value: string; note: string; tone: HlTone }[] = [
  { eyebrow: "Signals reading", value: "5 of 6", note: "one never instrumented", tone: "warn" },
  { eyebrow: "Causal", value: "1", note: "the card retry, from a holdout", tone: "ok" },
  { eyebrow: "Association", value: "4", note: "and marked as such", tone: "warn" },
  { eyebrow: "Customers with no signals at all", value: "42,000", note: "guest checkout", tone: "risk" },
];

export type SignalRow = {
  signal: string;
  predicts: string;
  effect: string;
  effectTone: HlTone;
  claimType: string;
  claimTypeTone: HlTone;
  covers: string;
  coversTone: HlTone;
  owner: string;
  ownerTone: HlTone;
};

export const HL03_SIGNAL_ROWS: SignalRow[] = [
  { signal: "Feature depth in week one", predicts: "90-day repeat", effect: "+43 pts", effectTone: "risk", claimType: "association", claimTypeTone: "warn", covers: "3.1M", coversTone: "num", owner: "nobody · Adopt", ownerTone: "risk" },
  { signal: "Second order within 30 days", predicts: "90-day repeat", effect: "+31 pts", effectTone: "risk", claimType: "association", claimTypeTone: "warn", covers: "4.16M", coversTone: "num", owner: "Ifeoma · Retain", ownerTone: "muted" },
  { signal: "Card failure history", predicts: "Involuntary churn", effect: "+45.5 pts recovered", effectTone: "ok", claimType: "causal", claimTypeTone: "ai", covers: "612k", coversTone: "num", owner: "Kunle · Renew", ownerTone: "muted" },
  { signal: "Contacted support about the fee", predicts: "Voluntary churn", effect: "+2.1 pts", effectTone: "warn", claimType: "association", claimTypeTone: "warn", covers: "12.8k", coversTone: "num", owner: "Amara · Support", ownerTone: "muted" },
  { signal: "Discount dependence", predicts: "Margin", effect: "Unavailable", effectTone: "muted", claimType: "insufficient", claimTypeTone: "neutral", covers: "47k", coversTone: "num", owner: "Ravi · Price", ownerTone: "muted" },
  { signal: "Made a referral", predicts: "Repeat and lifetime value", effect: "Unavailable", effectTone: "muted", claimType: "insufficient", claimTypeTone: "neutral", covers: "0", coversTone: "risk", owner: "nobody · Advocate", ownerTone: "risk" },
];

// ───────────────────────── HL04 · WHY THERE IS NO SCORE ─────────────────────────

export const HL04_CARDS: { k: string; b: string; t: string; f: string; acc: "muted" | "warn" | "ai" }[] = [
  { k: "What a score would be", b: "One number, 0–100", acc: "muted", t: "Six signals, weighted by something, averaged into a figure per customer. Sortable, rankable, and available this afternoon.", f: "asked for five times since February" },
  { k: "What it would hide", b: "Which signal moved", acc: "warn", t: "A customer at 34 could be there from feature depth, a card failure, or a support contact. Three completely different actions, one identical number.", f: "the disqualifying problem" },
  { k: "What is offered instead", b: "Five signals, separately", acc: "ai", t: "Each with what it predicts, how strongly, and what claim it supports. Harder to sort. Impossible to misread.", f: "and one that cannot be read" },
];

export const HL04_WEIGHT_ROWS: { signal: string; effect: string; effectTone: HlTone; weight: string; whoseCall: string; reviewed: string }[] = [
  { signal: "Feature depth", effect: "+43 pts", effectTone: "risk", weight: "Largest · but it is an association", whoseCall: "nobody", reviewed: "never" },
  { signal: "Second order in 30 days", effect: "+31 pts", effectTone: "risk", weight: "Large · and it overlaps feature depth", whoseCall: "nobody", reviewed: "never" },
  { signal: "Card failure history", effect: "causal", effectTone: "ok", weight: "Small population, strongest evidence", whoseCall: "nobody", reviewed: "never" },
  { signal: "Support contact", effect: "+2.1 pts", effectTone: "warn", weight: "Small · and it means the opposite for some", whoseCall: "nobody", reviewed: "never" },
  { signal: "Discount dependence", effect: "Unavailable", effectTone: "muted", weight: "Unknown · it predicts margin, not churn", whoseCall: "nobody", reviewed: "never" },
];

export const HL04_QUESTION_ROWS: { question: string; askedBy: string; answer: string; where: string; whereTone: HlTone }[] = [
  { question: "Which customers should we worry about?", askedBy: "Ada", answer: "The cohorts reading badly, and who owns them", where: "At risk with no owner", whereTone: "ai" },
  { question: "Is this account about to leave?", askedBy: "Tunde", answer: "Nothing · and no score would have answered it either", where: "—", whereTone: "muted" },
  { question: "Where should the team spend next week?", askedBy: "Ada", answer: "The leakage map · money, not health", where: "Revenue", whereTone: "ai" },
  { question: "How do I explain churn to the board?", askedBy: "Ravi", answer: "Five signals with what each predicts", where: "this section", whereTone: "ai" },
];

// ───────────────────────── HL05 · BY COHORT ─────────────────────────

export const HL05_COHORT_ROWS: {
  id: string;
  cohort: string;
  people: string;
  peopleTone: HlTone;
  featureDepth: string;
  featureDepthTone: HlTone;
  secondOrder: string;
  secondOrderTone: HlTone;
  cardFailures: string;
  cardFailuresTone: HlTone;
  supportContact: string;
  supportContactTone: HlTone;
  owner: string;
  ownerTone: HlTone;
}[] = [
  { id: "signed-up-in-app", cohort: "Signed up in-app", people: "398,000", peopleTone: "num", featureDepth: "2.4", featureDepthTone: "num", secondOrder: "44.2%", secondOrderTone: "num", cardFailures: "3.1%", cardFailuresTone: "num", supportContact: "2.9%", supportContactTone: "num", owner: "Tunde", ownerTone: "muted" },
  { id: "referred-by-a-customer", cohort: "Referred by a customer", people: "124,000", peopleTone: "num", featureDepth: "3.1", featureDepthTone: "ok", secondOrder: "68.1%", secondOrderTone: "ok", cardFailures: "2.2%", cardFailuresTone: "ok", supportContact: "1.4%", supportContactTone: "ok", owner: "nobody", ownerTone: "risk" },
  { id: "paid-social", cohort: "Paid social", people: "211,000", peopleTone: "num", featureDepth: "1.6", featureDepthTone: "warn", secondOrder: "31.0%", secondOrderTone: "warn", cardFailures: "4.1%", cardFailuresTone: "warn", supportContact: "4.8%", supportContactTone: "warn", owner: "Tunde", ownerTone: "muted" },
  { id: "lapsed-fee", cohort: "Lapsed after the fee change", people: "100,000", peopleTone: "warn", featureDepth: "1.9", featureDepthTone: "warn", secondOrder: "0%", secondOrderTone: "risk", cardFailures: "3.4%", cardFailuresTone: "num", supportContact: "11.2%", supportContactTone: "risk", owner: "Ifeoma", ownerTone: "muted" },
  { id: "ghana-starter-plan", cohort: "Ghana starter plan", people: "88,000", peopleTone: "num", featureDepth: "1.4", featureDepthTone: "risk", secondOrder: "28.1%", secondOrderTone: "warn", cardFailures: "Unavailable", cardFailuresTone: "muted", supportContact: "3.2%", supportContactTone: "num", owner: "Kunle", ownerTone: "muted" },
  { id: "guest-checkout", cohort: "Guest checkout", people: "42,000", peopleTone: "risk", featureDepth: "Unavailable", featureDepthTone: "muted", secondOrder: "Unavailable", secondOrderTone: "muted", cardFailures: "Unavailable", cardFailuresTone: "muted", supportContact: "Unavailable", supportContactTone: "muted", owner: "nobody", ownerTone: "risk" },
];

// ───────────────────────── HL06 · ONE COHORT (lapsed-fee) ─────────────────────────

export const HL06_BARS: { label: string; sub: string; percent: number; tone: HlTone }[] = [
  { label: "Support contact · 11.2%", sub: "base 2.9% · the earliest warning available", percent: 100, tone: "risk" },
  { label: "Second order in 30 days · 0%", sub: "base 44.2% · this is the definition of the cohort", percent: 0.1, tone: "muted" },
  { label: "Feature depth · 1.9", sub: "base 2.4 · they used less before they left", percent: 79, tone: "warn" },
  { label: "Card failures · 3.4%", sub: "base 3.1% · not meaningfully different", percent: 96, tone: "muted" },
  { label: "Discount use · 31%", sub: "base 18% · they were price-sensitive first", percent: 58, tone: "warn" },
];

export const HL06_KV_ROWS: { label: string; value: string; tone?: HlTone }[] = [
  { label: "Room 8f2c", value: "Second order never happened · Ifeoma · open 2 days" },
  { label: "Segment", value: "Lapsed after the fee change · 100,000 of 148,000 reachable" },
  { label: "Plays", value: "reactivation waves one and two · wave three held at 52,000", tone: "warn" },
  { label: "Holdout", value: "10,000 held · contaminated on 14 August · 1,204 treated anyway", tone: "risk" },
  { label: "What is not offered", value: "a list of the 100,000 · this is a cohort, not a spreadsheet", tone: "ok" },
];

// ───────────────────────── HL07 · ONE CUSTOMER (4118207) ─────────────────────────

export const HL07_SIGNAL_ROWS: { signal: string; reading: string; readingTone: HlTone; meaning: string; claimType: string; claimTypeTone: HlTone; cohortContext: string }[] = [
  { signal: "Feature depth", reading: "1", readingTone: "warn", meaning: "Used one feature in week one", claimType: "association", claimTypeTone: "warn", cohortContext: "base 2.4" },
  { signal: "Second order", reading: "yes", readingTone: "ok", meaning: "Ordered again 9 days after the first", claimType: "association", claimTypeTone: "warn", cohortContext: "base 44.2%" },
  { signal: "Card failures", reading: "0", readingTone: "ok", meaning: "No failed payment on record", claimType: "causal", claimTypeTone: "ai", cohortContext: "base 3.1%" },
  { signal: "Support contact", reading: "1", readingTone: "warn", meaning: "Wrote in on 7 March about a delivery fee", claimType: "association", claimTypeTone: "warn", cohortContext: "base 2.9%" },
  { signal: "Discount use", reading: "4 of 6 orders", readingTone: "warn", meaning: "Price-sensitive before the change", claimType: "insufficient", claimTypeTone: "neutral", cohortContext: "base 18%" },
];

export const HL07_CANNOT_ROWS: { action: string; offered: string; offeredTone: HlTone; why: string; where: string }[] = [
  { action: "Open a room about this person", offered: "no", offeredTone: "risk", why: "A room is about a cohort · one person is an account", where: "Rooms · via a segment" },
  { action: "Send them something", offered: "no", offeredTone: "risk", why: "No agent can send and no screen sends one message", where: "Campaigns · via a play" },
  { action: "Give them a score", offered: "never", offeredTone: "risk", why: "There is no score anywhere in this product", where: "—" },
  { action: "Flag them as at risk", offered: "no", offeredTone: "risk", why: "Risk is a property of a cohort here, not a person", where: "the cohorts they are in" },
  { action: "See which cohorts they are in", offered: "yes", offeredTone: "ok", why: "Three · and each one has an owner or does not", where: "this screen" },
  { action: "Answer their reply", offered: "yes", offeredTone: "ok", why: "They wrote to the company · that is a conversation", where: "Replies" },
];

// ───────────────────────── HL08 · AT RISK, NO OWNER ─────────────────────────

export const HL08_STATS: { eyebrow: string; value: string; note: string; tone: HlTone }[] = [
  { eyebrow: "Cohorts reading badly", value: "7", note: "on at least two signals", tone: "warn" },
  { eyebrow: "With an owner", value: "4", note: "and a room each", tone: "ok" },
  { eyebrow: "With no owner", value: "3", note: "and no room between them", tone: "risk" },
  { eyebrow: "People in the unowned three", value: "254,000", note: "6% of the base", tone: "risk" },
];

export const HL08_ROWS: { cohort: string; people: string; peopleTone: HlTone; worstSignals: string; since: string; sinceTone: HlTone; stage: string; stageTone: HlTone; findingsRouted: string }[] = [
  { cohort: "Single-feature at day 30", people: "162,000", peopleTone: "risk", worstSignals: "Depth 1.0 · repeat 12.8%", since: "6 Apr", sinceTone: "risk", stage: "Adopt · no owner", stageTone: "risk", findingsRouted: "19" },
  { cohort: "Referred but never referred back", people: "124,000", peopleTone: "warn", worstSignals: "No signal readable at all", since: "always", sinceTone: "risk", stage: "Advocate · no owner", stageTone: "risk", findingsRouted: "11" },
  { cohort: "Lapsed with no reason recorded", people: "118,000", peopleTone: "risk", worstSignals: "Support 8.1% · depth 1.7", since: "15 Mar", sinceTone: "risk", stage: "Churn · no owner", stageTone: "risk", findingsRouted: "17" },
  { cohort: "Paid social, first 30 days", people: "211,000", peopleTone: "warn", worstSignals: "Depth 1.6 · repeat 31%", since: "Feb", sinceTone: "muted", stage: "Acquire · Tunde", stageTone: "muted", findingsRouted: "6" },
];

// ───────────────────────── HL09 · COVERAGE ─────────────────────────

export const HL09_BAR_ROWS: { label: string; count: number; tone: HlTone }[] = [
  { label: "All five signals readable", count: 2860000, tone: "ok" },
  { label: "Four of five · no feature events", count: 890000, tone: "warn" },
  { label: "Two of five · orders only", count: 366000, tone: "warn" },
  { label: "None · guest checkout", count: 42000, tone: "risk" },
  { label: "None · counted but not identifiable", count: 42000, tone: "muted" },
];

export const HL09_ROWS: { signal: string; covers: string; coversTone: HlTone; ofBase: string; ofBaseTone: HlTone; missing: string; fixable: string; fixableTone: HlTone }[] = [
  { signal: "Second order within 30 days", covers: "4,158,000", coversTone: "ok", ofBase: "99.0%", ofBaseTone: "ok", missing: "Guest checkout only", fixable: "one field", fixableTone: "warn" },
  { signal: "Card failure history", covers: "612,000", coversTone: "num", ofBase: "14.6%", ofBaseTone: "muted", missing: "Everyone without a stored card", fixable: "no · correctly", fixableTone: "ok" },
  { signal: "Support contact", covers: "4,158,000", coversTone: "ok", ofBase: "99.0%", ofBaseTone: "ok", missing: "Guest checkout only", fixable: "one field", fixableTone: "warn" },
  { signal: "Feature depth in week one", covers: "3,100,000", coversTone: "warn", ofBase: "73.8%", ofBaseTone: "warn", missing: "Anyone who signed up before Aug 2024", fixable: "no · the week has passed", fixableTone: "risk" },
  { signal: "Discount dependence", covers: "4,158,000", coversTone: "ok", ofBase: "99.0%", ofBaseTone: "ok", missing: "Guest checkout only", fixable: "one field", fixableTone: "warn" },
  { signal: "Made a referral", covers: "0", coversTone: "risk", ofBase: "0%", ofBaseTone: "risk", missing: "Everyone · never instrumented", fixable: "never asked for", fixableTone: "risk" },
];

// ───────────────────────── HL10 · WHAT CHANGED ─────────────────────────

export const HL10_ROWS: { change: string; signal: string; was: string; wasTone: HlTone; now: string; nowTone: HlTone; why: string; customerChanged: string; customerChangedTone: HlTone }[] = [
  { change: "Coverage rose", signal: "Second order", was: "97.1%", wasTone: "muted", now: "99.0%", nowTone: "ok", why: "`signup.started` shipped · more records join", customerChanged: "no", customerChangedTone: "muted" },
  { change: "Cohort reading worse", signal: "Support contact · paid social", was: "3.9%", wasTone: "muted", now: "4.8%", nowTone: "warn", why: "A billing email went out on Tuesday", customerChanged: "yes", customerChangedTone: "warn" },
  { change: "Signal withdrawn", signal: "Discount dependence", was: "weak", wasTone: "muted", now: "Unavailable", nowTone: "muted", why: "It predicts margin · COGS still missing", customerChanged: "no", customerChangedTone: "muted" },
  { change: "Strength revised", signal: "Feature depth", was: "+38 pts", wasTone: "muted", now: "+43 pts", nowTone: "risk", why: "A fuller cohort · not a stronger effect", customerChanged: "no", customerChangedTone: "risk" },
  { change: "Cohort emptied", signal: "Lapsed after the fee change", was: "128,700", wasTone: "muted", now: "100,000", nowTone: "warn", why: "4,100 a day cross the 90-day boundary", customerChanged: "yes · they left", customerChangedTone: "risk" },
];

export const HL10_KV_ROWS: { label: string; value: string; tone?: HlTone }[] = [
  { label: "Feature depth", value: "3 revisions · +38, +41, +43 · all from cohort size, none from behaviour", tone: "warn" },
  { label: "Second order", value: "1 revision · +29 to +31 · guest checkout removed from the denominator" },
  { label: "Card failure", value: "0 revisions · it came from a holdout and has not moved", tone: "ok" },
  { label: "Who may revise a strength", value: "an agent may recompute · only a person may change a claim type", tone: "ai" },
  { label: "What is never done", value: "smoothing · a signal that jumps is shown jumping", tone: "risk" },
];

// ───────────────────────── HL11 · THRESHOLDS ─────────────────────────

export const HL11_ROWS: { signal: string; threshold: string; breached: string; breachedTone: HlTone; lastBreach: string; lastBreachTone: HlTone; routesTo: string; routesToTone: HlTone; arrived: string; arrivedTone: HlTone }[] = [
  { signal: "Feature depth", threshold: "Cohort mean below 1.5", breached: "9 times", breachedTone: "risk", lastBreach: "today", lastBreachTone: "risk", routesTo: "Adopt · owner", routesToTone: "risk", arrived: "empty field", arrivedTone: "risk" },
  { signal: "Second order", threshold: "Cohort rate falls 5 points in 14 days", breached: "2 times", breachedTone: "warn", lastBreach: "11 Mar", lastBreachTone: "muted", routesTo: "Retain · Ifeoma", routesToTone: "muted", arrived: "yes", arrivedTone: "ok" },
  { signal: "Card failure", threshold: "Recovery below 40% in 72 hours", breached: "0 times", breachedTone: "ok", lastBreach: "—", lastBreachTone: "muted", routesTo: "Renew · Kunle", routesToTone: "muted", arrived: "yes", arrivedTone: "ok" },
  { signal: "Support contact", threshold: "Cohort rate above 3× the base", breached: "4 times", breachedTone: "warn", lastBreach: "15 Mar", lastBreachTone: "muted", routesTo: "Support · Amara", routesToTone: "muted", arrived: "yes", arrivedTone: "ok" },
  { signal: "Discount dependence", threshold: "No threshold · the signal is Unavailable", breached: "—", breachedTone: "muted", lastBreach: "—", lastBreachTone: "muted", routesTo: "Price · Ravi", routesToTone: "muted", arrived: "n/a", arrivedTone: "muted" },
];

export const HL11_KV_ROWS: { label: string; value: string; tone?: HlTone }[] = [
  { label: "A score crossing a line", value: "there is no score · thresholds are per signal, per cohort", tone: "ok" },
  { label: "A rule about one customer", value: "the minimum population is a cohort · one person cannot breach anything", tone: "ok" },
  { label: "Self-adjusting", value: "a threshold that moves to stop firing is a threshold that has stopped working", tone: "risk" },
  { label: "Muted", value: "not offered · it can be changed by a person, with a reason, and both are kept", tone: "risk" },
  { label: "Routed to a team", value: "no · to a named person, or to a field that stays empty", tone: "warn" },
];

// ───────────────────────── HL12 · ADD A SIGNAL (modal preset) ─────────────────────────

export const HL12_ADD_SIGNAL_PRESET = {
  subject: "Reordered the same item",
  subjectDetail: "Proposed by Repeat & Decay · readable for 4.16M customers",
  fields: [
    { label: "What it predicts", value: "90-day repeat · not “health”, not “risk”", tone: "ok" as HlTone },
    { label: "How strongly", value: "+19 points · measured, not assumed", tone: "ok" as HlTone },
    { label: "Claim type", value: "Association · no test has been run", tone: "warn" as HlTone },
    { label: "What it overlaps", value: "Second order · 71% of the same customers", tone: "risk" as HlTone },
    { label: "Who owns the stage", value: "Ifeoma · Retain", tone: "ok" as HlTone },
  ],
  overlapTitle: "This overlaps an existing signal by 71% and is being added anyway",
  overlapBody:
    "Because there is no score, two overlapping signals do not double-count anything. They are read separately and the overlap is stated. In a scored system this would have to be resolved with a weight.",
  closingNote:
    "Repeat & Decay found the effect, measured it at +19 points and stated it as an association. A person decides whether the workspace should carry a sixth thing to look at, because every signal added is a permanent claim on somebody's attention.",
};

// ───────────────────────── HL13 · CHANGE A THRESHOLD (modal preset) ─────────────────────────

export const HL13_THRESHOLD_PRESET = {
  subject: "Feature depth · cohort mean below 1.5",
  subjectDetail: "Breached 9 times since April · every one routed to an empty field",
  changeTo: "Cohort mean below 1.2",
  was: "was 1.5",
  effects: [
    { label: "Breaches since April", value: "9 → 2", tone: "warn" as HlTone },
    { label: "Cohorts that would stop firing", value: "7 · including single-feature at day 30", tone: "risk" as HlTone },
    { label: "People in those cohorts", value: "302,000", tone: "risk" as HlTone },
    { label: "What would have changed for them", value: "nothing · nobody was reading the breaches", tone: "muted" as HlTone },
  ],
  warningTitle: "You are quietening an alarm nobody is listening to",
  warningBody:
    "The breaches are not wrong and are not noise. They route to the owner of Adopt, and there is no owner of Adopt. Moving the line makes the count smaller and changes nothing else.",
  closingNote:
    "Nobody is stopped from doing this. What happens instead is that the threshold carries the date it was lowered, by whom and from what, so a quiet quarter in the autumn can be read correctly by whoever is looking at it in the spring.",
};

// ───────────────────────── HL14 · CONTACT THIS PERSON (modal preset) ─────────────────────────

export const HL14_CONTACT_PRESET = {
  subject: "Customer 4,118,207",
  subjectDetail: "In 3 cohorts · wrote in on 7 March · no reply was sent",
  reasons: [
    { label: "They wrote to us and got no answer", sub: "goes to Replies · a conversation, not a campaign", selected: true, blocked: false },
    { label: "They are in a cohort we are working on", sub: "goes to the room · the play reaches all 100,000 or none", selected: false, blocked: false },
    { label: "They look like they are about to leave", sub: "not offered · that is a cohort judgement, not a personal one", selected: false, blocked: true },
    { label: "Somebody senior asked about this account", sub: "not offered · and it is the most common reason", selected: false, blocked: true },
  ],
  confirmTitle: "This one is allowed, and it is not a message from Flolyt",
  confirmBody:
    "They asked a question 164 days ago. Answering it opens their thread in Replies, where a person writes and a person sends.",
  closingNote:
    "Contacting somebody because they look at risk, or because their name came up in a meeting, are both decisions about one person taken from a screen full of cohort statistics. Neither has a holdout, an audience or an approver, and both would be invisible in every measurement this product makes.",
};

// ───────────────────────── HL15 · SETTINGS ─────────────────────────

export const HL15_RULE_ROWS: { rule: string; currently: string; who: string; canChange: boolean; state: string; stateTone: HlTone }[] = [
  { rule: "Signals are shown separately, never combined", currently: "6", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Every signal states what it predicts", currently: "6", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Every signal states its claim type", currently: "6", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Coverage is shown beside every signal", currently: "6", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Thresholds route to a person or nowhere", currently: "5", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Threshold values", currently: "5 set", who: "stage owners", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Minimum cohort size for a reading", currently: "500", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "A composite health score", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Per-customer risk flags", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Ranking customers by anything", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Thresholds that adjust themselves", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const HL15_USED_ELSEWHERE_ROWS: { label: string; value: string; tone?: HlTone }[] = [
  { label: "Segments", value: "a signal is often the definition · single-feature at day 30", tone: "ai" },
  { label: "Benchmarks", value: "cohort against cohort, signal by signal · never a composite", tone: "ok" },
  { label: "Experiments", value: "signals are what a holdout measures a change against", tone: "ok" },
  { label: "Revenue", value: "feature depth is the ₦134M line on the leakage map", tone: "warn" },
  { label: "Replies", value: "a support contact is a signal here and a conversation there", tone: "ok" },
];

// ───────────────────────── Agent that read the first signal (HL02) ─────────────────────────

export const HL_AGENT_RD: AgentRef = { initials: "RD", name: "Repeat & Decay" };
