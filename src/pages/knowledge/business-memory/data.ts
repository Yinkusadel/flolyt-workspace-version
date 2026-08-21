import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { KUNLE, ORCHESTRATOR, REPEAT_DECAY, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";
import { PETER } from "@/pages/everyday/digest/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Knowledge · Business memory — sourced from
 * flolyt-figma-designs/Knowledge Screens/flolyt-business-memory/flolyt-business-memory/
 * (18 frames, ME01-ME18). Content transcribed from the export's own `me.py`
 * generator source (plus shared `know.py` chrome), same "read the .py, don't
 * parse the SVG" approach as every prior section. This is the first section
 * of a new Knowledge group, sibling to Every day/Revenue/Customers — three
 * more sections (Playbooks, Community, Recognition) are documented as
 * sibling folders in the same export, not yet built. See
 * docs/build-tracker.md.
 */

export type BmTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const BM_TONE_CLASS: Record<BmTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const BM_CHIP_TONE: Record<BmTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const BM_KPI_TONE: Record<BmTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Agent introduced by this export — not on the existing rooms/lifecycle roster (RD/MO/IC/AQ/PX/SS/EX). */
export const ACTIVATION: AgentRef = { initials: "AC", name: "Activation" };

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type MemoryState = "nothing" | "first" | "full";
export const MEMORY_STATE: MemoryState = "full";

export const BM_TABS = [
  "Learnings",
  "Constraints",
  "Superseded",
  "Challenged",
  "Open questions",
  "Due for review",
] as const;
export type BmTab = (typeof BM_TABS)[number];

// ───────────────────────── ME01 · NOTHING LEARNED YET ─────────────────────

export const ME01_ENDS_HOW_ROWS: {
  how: string;
  writes: string;
  state: string;
  stateTone: BmTone;
  often: string;
}[] = [
  { how: "Money recovered", writes: "What worked, and what it was measured against", state: "validated", stateTone: "ok", often: "3 of 41" },
  { how: "No action needed", writes: "The finding, so nobody rediscovers it", state: "observation", stateTone: "warn", often: "8 of 41" },
  { how: "Unmeasurable", writes: "What happened, and why it could not be measured", state: "observation + constraint", stateTone: "warn", often: "3 of 41" },
  { how: "Superseded", writes: "A pointer to the room that took it over", state: "superseded", stateTone: "muted", often: "6 of 41" },
  { how: "Disproven", writes: "That the evidence stopped supporting it", state: "validated", stateTone: "ok", often: "2 of 41" },
];

// ───────────────────────── ME02 · THE FIRST LEARNING ──────────────────────

export const ME02_QUOTE = {
  text: "Push frequency cannot be held back per customer.",
  source: "Written 17 March · from Weekend push fatigue, closed as unmeasurable · state: constraint, validated",
};

export const ME02_STATS: { eyebrow: string; value: string; note: string; tone: BmTone }[] = [
  { eyebrow: "What the room recovered", value: "₦0", note: "nothing was claimed", tone: "muted" },
  { eyebrow: "What it wrote here", value: "2 lines", note: "one observation, one constraint", tone: "ok" },
  { eyebrow: "Times cited since", value: "4", note: "all of them before a design", tone: "ok" },
  { eyebrow: "Weeks it has saved", value: "3 each time", note: "by Ifeoma's estimate", tone: "warn" },
];

export const ME02_LINES_ROWS: { line: string; state: string; stateTone: BmTone; why: string; citable: string; citableTone: BmTone }[] = [
  {
    line: "Unsubscribes fell 41% after the change",
    state: "observation",
    stateTone: "warn",
    why: "Ramadan began in the same window · nothing separates them",
    citable: "as context only",
    citableTone: "warn",
  },
  {
    line: "Push frequency cannot be held back per customer",
    state: "constraint",
    stateTone: "ok",
    why: "It is a fact about the product, not about customers",
    citable: "yes",
    citableTone: "ok",
  },
];

// ───────────────────────── ME03 · BUSINESS MEMORY (full index) ────────────

export const ME03_STATS: { eyebrow: string; value: string; note: string; tone: BmTone }[] = [
  { eyebrow: "Learnings", value: "61", note: "written by 41 closed rooms and 20 elsewhere", tone: "neutral" },
  { eyebrow: "Validated", value: "25", note: "two independent readings agree", tone: "ok" },
  { eyebrow: "Cited this quarter", value: "34", note: "in rooms, before a decision", tone: "ok" },
  { eyebrow: "Never cited", value: "27", note: "written and never used", tone: "warn" },
];

export type LearningRow = {
  id: string;
  learning: string;
  state: string;
  stateTone: BmTone;
  evidence: string;
  cited: string;
  citedTone: BmTone;
  written: string;
  stage: string;
  /** Only the "Unsubscribes fell 41%…" row has a wired action — opens the Cite modal (ME15). */
  rowAction?: "cite";
};

export const LEARNING_ROWS: LearningRow[] = [
  {
    id: "first-order-discount",
    learning: "Discounting the first order buys volume that does not repeat",
    state: "validated",
    stateTone: "ok",
    evidence: "Holdout · 10% · Nov 2024",
    cited: "4",
    citedTone: "ok",
    written: "Nov 2024",
    stage: "Acquire",
  },
  {
    id: "fee-transparency-beats-discounting",
    learning: "Fee transparency beats discounting on reactivation",
    state: "validated",
    stateTone: "ok",
    evidence: "Two independent measurements",
    cited: "3",
    citedTone: "ok",
    written: "9 Sep",
    stage: "Retain",
  },
  {
    id: "push-frequency-constraint",
    learning: "Push frequency cannot be held back per customer",
    state: "constraint",
    stateTone: "ok",
    evidence: "A fact about the product",
    cited: "4",
    citedTone: "ok",
    written: "17 Mar",
    stage: "Retain",
  },
  {
    id: "referral-reward-1000",
    learning: "Raising the referral reward to ₦1,000 lifts referrals 22%",
    state: "validated",
    stateTone: "ok",
    evidence: "Holdout · 20% of referrers",
    cited: "2",
    citedTone: "num",
    written: "18 Apr",
    stage: "Advocate",
  },
  {
    id: "shorter-signup-form",
    learning: "Shortening the signup form changes nothing",
    state: "validated",
    stateTone: "ok",
    evidence: "A/B · 50/50, four weeks",
    cited: "2",
    citedTone: "num",
    written: "6 May",
    stage: "Acquire",
  },
  {
    id: "uk-checkout-not-worth-fixing",
    learning: "UK checkout is 1.4s slower on 3G and not worth fixing",
    state: "observation",
    stateTone: "warn",
    evidence: "69,000 sessions · a judgement",
    cited: "1",
    citedTone: "num",
    written: "22 Aug",
    stage: "Activate",
  },
  {
    id: "unsubscribes-fell-41",
    learning: "Unsubscribes fell 41% after the cadence change",
    state: "observation",
    stateTone: "warn",
    evidence: "Confounded by Ramadan",
    cited: "0",
    citedTone: "muted",
    written: "17 Mar",
    stage: "Retain",
    rowAction: "cite",
  },
  {
    id: "guest-checkout-cannot-join",
    learning: "Guest-checkout orders cannot be joined to a customer",
    state: "constraint",
    stateTone: "ok",
    evidence: "A fact about the schema",
    cited: "9",
    citedTone: "ok",
    written: "12 Jan",
    stage: "Acquire",
  },
];

export const ME03_NOTES = {
  neverCited:
    "Some of them are about stages nobody owns. Some are true and dull. Some describe a market that has since changed. The count is shown because a memory that fills up faster than it is read stops being a memory and becomes an archive, and the only way to notice is to count.",
  mostCited:
    "“Discounting the first order buys volume that does not repeat” came out of a 2024 campaign with a real holdout, and has been used four times since to argue against a discount — most recently in the Retain reactivation, where it won. Age is displayed on every row and is never used to rank them.",
};

export const ME03_EVIDENCE_BEHIND: { label: string; value: string; tone: BmTone }[] = [
  { label: "A holdout", value: "11", tone: "ok" },
  { label: "A comparison", value: "14", tone: "warn" },
  { label: "A room's judgement", value: "17", tone: "warn" },
  { label: "Somebody said so", value: "19", tone: "risk" },
];

// ───────────────────────── ME04 · ONE LEARNING ─────────────────────────────

export const ME04_QUOTE = {
  text: "Discounting the first order buys volume that does not repeat.",
  source: "Written November 2024 · Acquire · validated · cited in four rooms · superseded in one market",
};

export const ME04_EVIDENCE_ROWS: { what: string; when: string; result: string; resultTone: BmTone; measured: string; confidence: string; confidenceTone: BmTone }[] = [
  { what: "First-order discount, all markets", when: "Nov 2024", result: "+41% volume", resultTone: "num", measured: "Holdout · 10% got no discount", confidence: "5 / 5", confidenceTone: "ok" },
  { what: "The same cohort, 90 days later", when: "Feb 2025", result: "−14 pts repeat", resultTone: "risk", measured: "The same holdout, followed", confidence: "5 / 5", confidenceTone: "ok" },
  { what: "Ghana repeat, discounted cohort", when: "Jun", result: "−2 pts repeat", resultTone: "warn", measured: "No holdout · market comparison", confidence: "2 / 5", confidenceTone: "warn" },
];

export const ME04_CITATION_ROWS: { room: string; when: string; usedFor: string; outcome: string; outcomeTone: BmTone; held: string; heldTone: BmTone }[] = [
  { room: "Retain · reactivation", when: "2 Aug", usedFor: "Arguing against a 20% win-back offer", outcome: "offer deferred", outcomeTone: "ok", held: "yes · 18.2% with no offer", heldTone: "ok" },
  { room: "Price · discount-only buyers", when: "19 Mar", usedFor: "Arguing to withdraw the code", outcome: "code withdrawn", outcomeTone: "ok", held: "yes · ₦31M", heldTone: "ok" },
  { room: "Acquire · Ghana paid social", when: "11 Mar", usedFor: "Arguing against a launch discount", outcome: "discount ran anyway", outcomeTone: "warn", held: "no · see below", heldTone: "risk" },
  { room: "Activate · onboarding rewrite", when: "19 Feb", usedFor: "Background · not decisive", outcome: "—", outcomeTone: "muted", held: "not tested", heldTone: "muted" },
];

export const ME04_NOTE =
  "Kunle argued that a new market needs a reason to try it, ran the discount, and Ghanaian repeat fell only 2 points rather than 14. He may have been right, and the evidence is weak — no holdout, a market comparison. The learning is marked superseded in Ghana only, and it remains validated everywhere else.";

export const ME04_OVERTURN_ROWS: { label: string; value: string; tone: BmTone }[] = [
  { label: "A holdout in a new market", value: "the Ghana reading has none · that is the whole weakness", tone: "warn" },
  { label: "A discount that is not on the first order", value: "out of scope · this learning is about first orders only", tone: "muted" },
  { label: "Time", value: "nothing · a learning does not decay with age here", tone: "risk" },
  { label: "Who could supersede it", value: "anybody, with a newer reading and a stated scope", tone: "ok" },
];

// ───────────────────────── ME05 · SUPERSEDED ───────────────────────────────

export type SupersededRow = {
  id: string;
  learning: string;
  where: string;
  whereTone: BmTone;
  by: string;
  when: string;
  stillTrue: string;
  stillTrueTone: BmTone;
  /** Only "Reactivation works best on a Thursday" has a wired action — opens the Supersede modal (ME16). */
  rowAction?: "supersede";
};

export const SUPERSEDED_ROWS: SupersededRow[] = [
  {
    id: "first-order-discount-ghana",
    learning: "Discounting the first order buys volume that does not repeat",
    where: "Ghana only",
    whereTone: "warn",
    by: "A weaker market reading, no holdout",
    when: "Jun",
    stillTrue: "yes · 3 markets",
    stillTrueTone: "ok",
  },
  {
    id: "reactivation-thursday",
    learning: "Reactivation works best on a Thursday",
    where: "everywhere",
    whereTone: "risk",
    by: "Wave one · day of week had no effect",
    when: "2 Aug",
    stillTrue: "no",
    stillTrueTone: "risk",
    rowAction: "supersede",
  },
  {
    id: "repeat-rate-374",
    learning: "Repeat rate is 37.4%",
    where: "after 4 March",
    whereTone: "warn",
    by: "The fee change · it is 27.2% now",
    when: "2 Aug",
    stillTrue: "as history",
    stillTrueTone: "muted",
  },
  {
    id: "card-retries-midnight",
    learning: "Card retries should run at midnight",
    where: "everywhere",
    whereTone: "risk",
    by: "A holdout · 09:00 recovers 45.5 points more",
    when: "2 Apr",
    stillTrue: "no",
    stillTrueTone: "risk",
  },
  {
    id: "support-tickets-delivery",
    learning: "Support tickets about delivery are about delivery",
    where: "since 4 March",
    whereTone: "risk",
    by: "31% of them were about the fee",
    when: "21 Mar",
    stillTrue: "before March",
    stillTrueTone: "muted",
  },
];

export const ME05_NOTES = {
  scoped:
    "Two of these are dead everywhere. Three are dead in one market, or after one date, or in one condition — and remain the best available answer outside it. A memory that superseded globally would have thrown away the first-order discount finding because of one unheld Ghanaian reading, which is exactly backwards.",
  keptAsHistory:
    "“Repeat rate is 37.4%” was correct for eighteen months. It is now wrong, it is not deleted, and it is what makes the ₦437M line on the leakage map legible to somebody reading it next year. A superseded figure explains an old decision; a deleted one makes the decision look mad.",
};

// ───────────────────────── ME06 · CONSTRAINTS ──────────────────────────────

export const CONSTRAINT_ROWS: { constraint: string; foundBy: string; when: string; cited: string; citedTone: BmTone; stillTrue: string; stillTrueTone: BmTone; who: string; whoTone: BmTone }[] = [
  { constraint: "Push frequency cannot be held back per customer", foundBy: "Weekend push fatigue · unmeasurable", when: "17 Mar", cited: "4", citedTone: "ok", stillTrue: "yes", stillTrueTone: "warn", who: "Sam · open 38 days", whoTone: "warn" },
  { constraint: "Guest-checkout orders cannot be joined to a customer", foundBy: "Acquire · at connection", when: "12 Jan", cited: "9", citedTone: "ok", stillTrue: "yes", stillTrueTone: "risk", who: "Sam · asked 28 Jul", whoTone: "warn" },
  { constraint: "Ghana has no repeat-rate baseline until 90 days pass", foundBy: "Accra reactivation · unmeasurable", when: "9 Jul", cited: "3", citedTone: "ok", stillTrue: "until Oct", stillTrueTone: "warn", who: "time", whoTone: "muted" },
  { constraint: "Margin cannot be computed · no COGS source", foundBy: "Price · at connection", when: "12 Jan", cited: "11", citedTone: "ok", stillTrue: "yes", stillTrueTone: "risk", who: "Sam · asked 28 Jul", whoTone: "warn" },
  { constraint: "Referral revenue has never been instrumented", foundBy: "Advocate · no owner", when: "always", cited: "2", citedTone: "num", stillTrue: "yes", stillTrueTone: "risk", who: "nobody", whoTone: "risk" },
  { constraint: "A play cannot enforce a hold list built outside it", foundBy: "The 14 August resend", when: "15 Aug", cited: "1", citedTone: "num", stillTrue: "yes", stillTrueTone: "risk", who: "Sam · today", whoTone: "warn" },
];

export const ME06_NOTES = {
  mostCited:
    "Thirty citations between six lines, every one of them saving somebody from designing something that cannot work. Four of the six are one engineering change away from being false, and all four sit with the same person. This is the same backlog that appears in Handoff as obligations and in Revenue as blocked figures — here it is what the company cannot currently learn.",
  latest:
    "The resend that contaminated the reactivation holdout produced a constraint nobody had written down: guardrails live on the play, so anything sent another way misses them. It is cited once already, in the design of the next experiment. An incident that produces a constraint has at least been paid for.",
};

// ───────────────────────── ME07 · WHERE THESE COME FROM ───────────────────

export const ME07_SOURCE_ROWS: { source: string; count: string; writes: string; state: string; stateTone: BmTone; needsPerson: string; needsPersonTone: BmTone }[] = [
  { source: "A room closing with money recovered", count: "3", writes: "What worked and what it was measured against", state: "validated", stateTone: "ok", needsPerson: "yes · at close", needsPersonTone: "ok" },
  { source: "A room closing with no action needed", count: "8", writes: "The finding, so it is not rediscovered", state: "observation", stateTone: "warn", needsPerson: "yes · at close", needsPersonTone: "ok" },
  { source: "A room closing as unmeasurable", count: "6", writes: "What happened, and why it could not be measured", state: "observation + constraint", stateTone: "warn", needsPerson: "yes · at close", needsPersonTone: "ok" },
  { source: "A room being disproven", count: "2", writes: "That the evidence stopped supporting it", state: "validated", stateTone: "ok", needsPerson: "yes · at close", needsPersonTone: "ok" },
  { source: "A rejected proposal", count: "11", writes: "The reason, cited next time something similar comes up", state: "observation", stateTone: "warn", needsPerson: "yes · the rejecter", needsPersonTone: "ok" },
  { source: "A closed experiment", count: "3", writes: "The result, and the cost of the holdout", state: "validated", stateTone: "ok", needsPerson: "yes · the signer", needsPersonTone: "ok" },
  { source: "A connection failing", count: "6", writes: "What cannot be computed and why", state: "constraint", stateTone: "ok", needsPerson: "no · automatic", needsPersonTone: "warn" },
  { source: "Somebody writing one directly", count: "22", writes: "Whatever they typed, with their name on it", state: "observation", stateTone: "warn", needsPerson: "yes", needsPersonTone: "ok" },
];

export const ME07_NOTES = {
  rejections:
    "A rejected proposal writes its reason into memory, so the next agent that suggests a ₦500 credit for the 42,000 unreachable customers is met with the record of the last time somebody explained why they cannot be reached. Most knowledge systems only keep what was done, which makes the same bad idea arrive every quarter looking new.",
  connectionFailing:
    "A connection failing produces a constraint — margin cannot be computed, the guest join does not exist — and nothing else. No agent writes a learning about customers, a market or a decision, because a learning is a claim, and claims in this product belong to people whose names go on them.",
};

// ───────────────────────── ME08 · SEARCH ───────────────────────────────────

export const ME08_RESULT_ROWS: { result: string; kind: string; kindTone: BmTone; state: string; stateTone: BmTone; cited: string; citedTone: BmTone; matched: string }[] = [
  { result: "Discounting the first order buys volume that does not repeat", kind: "learning", kindTone: "ai", state: "validated", stateTone: "ok", cited: "4", citedTone: "ok", matched: "the claim itself" },
  { result: "Fee transparency beats discounting on reactivation", kind: "learning", kindTone: "ai", state: "validated", stateTone: "ok", cited: "3", citedTone: "ok", matched: "the claim itself" },
  { result: "20% reactivation discount", kind: "rejected proposal", kindTone: "warn", state: "deferred", stateTone: "warn", cited: "1", citedTone: "num", matched: "dissent recorded by Tunde" },
  { result: "Discount-only buyers", kind: "closed room", kindTone: "neutral", state: "₦31M", stateTone: "ok", cited: "2", citedTone: "num", matched: "room title" },
  { result: "Ghana launch discount", kind: "superseded", kindTone: "muted", state: "in Ghana only", stateTone: "warn", cited: "0", citedTone: "muted", matched: "supersedes result one" },
  { result: "“Discount” has three meanings in this workspace", kind: "note", kindTone: "neutral", state: "—", stateTone: "muted", cited: "6", citedTone: "ok", matched: "written by Ravi in April" },
];

export const ME08_NOTE =
  "Ravi wrote it in April after a meeting in which three people used “discount” to mean a code, a price change and a credit. It is not a finding and cannot be cited as evidence. It appears first in more searches than anything else in this section, which suggests the most useful thing in a memory is often a definition.";

export const ME08_NOT_ROWS: { label: string; value: string; tone: BmTone }[] = [
  { label: "Rank by recency", value: "no · by citations, then by state · age is shown and never scored", tone: "ok" },
  { label: "Hide superseded results", value: "no · a superseded line explains an old decision", tone: "risk" },
  { label: "Return learnings from other companies", value: "never · Community is a separate section with a wall around it", tone: "risk" },
  { label: "Search inside restricted rooms", value: "one match suppressed · the count is shown, the line is not", tone: "warn" },
];

// ───────────────────────── ME09 · CHALLENGED ───────────────────────────────

export const CHALLENGED_ROWS: { learning: string; by: PersonRef; argument: string; since: string; state: string; stateTone: BmTone; resolvesHow: string }[] = [
  { learning: "Discounting the first order buys volume", by: KUNLE, argument: "New markets need a reason to try", since: "Jun", state: "scoped", stateTone: "warn", resolvesHow: "a Ghana holdout" },
  { learning: "Fee transparency beats discounting", by: TUNDE, argument: "Two readings, both from one cohort", since: "9 Sep", state: "open", stateTone: "risk", resolvesHow: "a third reading" },
  { learning: "UK checkout is not worth fixing", by: ZAINAB, argument: "£14k assumed UK volume stays flat", since: "22 Aug", state: "open", stateTone: "risk", resolvesHow: "the revisit threshold" },
  { learning: "Shortening the signup form changes nothing", by: TUNDE, argument: "Four weeks was too short to see repeat", since: "May", state: "withdrawn", stateTone: "muted", resolvesHow: "he withdrew it" },
];

export const ME09_NOTES = {
  staysCited:
    "When Tunde's objection to the fee-transparency finding is cited in a room, his argument travels alongside the learning rather than replacing it. Nothing is hidden while a disagreement is open, because a memory that goes quiet during an argument is a memory that stops being read during exactly the periods when it matters most.",
  noAdjudication:
    "The UK challenge has an automatic answer: Ravi wrote a revisit condition into Activate that reopens the room if UK volume triples. The other two need a reading somebody has to run. There is no adjudication process, no vote and no seniority rule — the argument stays open until evidence arrives or the challenger withdraws, which is what Tunde did in May.",
};

// ───────────────────────── ME10 · OPEN QUESTIONS ───────────────────────────

export const OPEN_QUESTION_ROWS: { question: string; why: string; whyTone: BmTone; asked: string; askedTone: BmTone; blockedBy: string; blockedByTone: BmTone; who: string; worth: string; worthTone: BmTone }[] = [
  { question: "Why do cards fail at midnight at all?", why: "The fix moved the retry · nobody asked the cause", whyTone: "warn", asked: "2 Apr", askedTone: "warn", blockedBy: "nobody has asked", blockedByTone: "risk", who: "Sam", worth: "₦88M a year", worthTone: "warn" },
  { question: "Does feature depth cause repeat, or follow it?", why: "43 points, never tested", whyTone: "risk", asked: "6 Apr", askedTone: "risk", blockedBy: "no owner for Adopt", blockedByTone: "risk", who: "Zainab", worth: "₦134M", worthTone: "risk" },
  { question: "What is a referral actually worth?", why: "Never instrumented", whyTone: "risk", asked: "always", askedTone: "risk", blockedBy: "no owner for Advocate", blockedByTone: "risk", who: "nobody", worth: "Unavailable", worthTone: "muted" },
  { question: "Would reversing the fee recover anything?", why: "Modelled as S-114 · never run", whyTone: "warn", asked: "2 Aug", askedTone: "warn", blockedBy: "nobody has decided", blockedByTone: "warn", who: "Ada", worth: "₦188M–₦512M", worthTone: "warn" },
  { question: "Why is Ghanaian signup completion 61%?", why: "It has been since the market opened", whyTone: "risk", asked: "11 months", askedTone: "risk", blockedBy: "nobody has asked", blockedByTone: "risk", who: "Kunle", worth: "Unavailable", worthTone: "muted" },
];

export const ME10_NOTES = {
  notABacklog:
    "Nothing here is assigned, nothing is overdue and nothing escalates. It is a list of the things this company would need to know to be sure of what it is doing, kept where somebody planning a quarter would see it. Two of the five have been open since April and are blocked by an empty owner field rather than by any technical difficulty.",
  neverAsked:
    "The card retry moved to 09:00, recovered ₦62M and became the most reused playbook in the workspace. Nobody has asked why 21,400 cards fail at midnight in the first place. Fixing the cause would be worth more than the retry and would need one engineer to look for a week, and it is on this list because it is otherwise invisible — a well-handled symptom stops looking like a problem.",
};

// ───────────────────────── ME11 · NOT WRITTEN DOWN ─────────────────────────

export const ME11_HERO = {
  person: PETER,
  daysLeft: "4 days",
  subtitle: "41 renewal accounts, eleven months in Nairobi, and nine things only he appears to know.",
  writtenLabel: "written into memory",
  written: "0 of 9",
  lastDay: "22 August",
};

export const ME11_ROWS: { what: string; how: string; citedFrom: string; citedFromTone: BmTone; written: string; who: string }[] = [
  { what: "Which Nairobi accounts renew late by habit", how: "He answered it in a room, from memory", citedFrom: "3 rooms", citedFromTone: "warn", written: "no", who: "Kunle" },
  { what: "Why the Kenya dunning window is 4 days", how: "He set it · no reason is recorded", citedFrom: "1 room", citedFromTone: "warn", written: "no", who: "Kunle" },
  { what: "Which two resellers pay in arrears", how: "Mentioned in Handoff, never in memory", citedFrom: "2 rooms", citedFromTone: "warn", written: "no", who: "Kunle" },
  { what: "What the 2024 Nairobi price test showed", how: "Referenced twice · no record exists", citedFrom: "2 rooms", citedFromTone: "risk", written: "no", who: "nobody" },
  { what: "Five more, less specific", how: "He is the only person who has answered them", citedFrom: "5 rooms", citedFromTone: "warn", written: "no", who: "Kunle" },
];

export const ME11_NOTES = {
  assembled:
    "Nine times in eleven months, a question in a room was resolved by Peter saying something nobody could cite afterwards. That pattern is visible without any surveillance: it is just the rooms. The list is shown to him and to Kunle rather than to a manager, because it is a handover aid and would be an unpleasant thing to be measured by.",
  notEnoughTime:
    "Nine learnings cannot be extracted from somebody in four days, and the fourth row — a price test from 2024 with no record — may simply be lost. What is realistic is the two that are cited most and the one that is a constraint. The Handoff chain has the accounts; this has the reasons, which is the half that usually disappears.",
};

// ───────────────────────── ME12/13 · WRITE A LEARNING ─────────────────────

export const ME12_CLAIM = {
  text: "Customers who contact support before lapsing are telling us the reason",
  detail: "From the lapsed cohort · 11.2% contacted support against a 2.9% base",
};

export const ME12_KIND_ROWS: { kind: string; means: string; citable: string; citableTone: BmTone; needs: string; selected: boolean }[] = [
  { kind: "Validated learning", means: "Two independent readings agree", citable: "yes", citableTone: "ok", needs: "two readings", selected: false },
  { kind: "Observation", means: "One reading, or a confounded one", citable: "as context", citableTone: "warn", needs: "a source", selected: true },
  { kind: "Constraint", means: "A fact about the product or the data", citable: "yes", citableTone: "ok", needs: "a source", selected: false },
  { kind: "Definition", means: "What a word means here", citable: "no · it is not evidence", citableTone: "muted", needs: "nothing", selected: false },
];

export const ME12_NOTE =
  "11.2% against a 2.9% base is a single cohort in a single market during a period when one release was affecting everything. It is a strong hint and it is not two independent measurements. Anybody can cite it as context tomorrow; nobody can cite it to justify a play, and the difference is enforced rather than left to judgement.";

export const ME13_SCOPE_ROWS: { field: string; value: string; required: boolean; why: string }[] = [
  { field: "Markets", value: "Nigeria and Kenya · not Ghana or the UK", required: true, why: "So it can be superseded in one market and not others" },
  { field: "Period", value: "Since 4 March · a release is in the window", required: true, why: "So a reader knows what else was happening" },
  { field: "Stage", value: "Churn · which has no owner", required: true, why: "So it appears in that stage's history" },
  { field: "Evidence", value: "The lapsed cohort · 100,000 people · one reading", required: true, why: "So the claim can be checked, not just believed" },
  { field: "What would overturn it", value: "A lapsed cohort with a normal contact rate", required: true, why: "So somebody knows what to look for" },
  { field: "What it does not say", value: "That contacting support causes lapsing", required: true, why: "The most common way a learning gets misused" },
];

export const ME13_NOTES = {
  lastTwo:
    "Every line in this section will eventually be read by a person who did not write it, in a meeting, out of context. “What it does not say” is the sentence that stops this becoming “support contact predicts churn” by November — which is a different claim, and one this evidence does not support.",
  unownedStage:
    "This will appear in Churn's history where nobody is reading it. It will also appear in the count of learnings belonging to unowned stages, which is currently nine and is one of the arguments for giving Churn an owner.",
};

// ───────────────────────── ME14 · DUE FOR REVIEW ───────────────────────────

export const REVIEW_ROWS: { learning: string; changed: string; written: string; flaggedBy: AgentRef; means: string; meansTone: BmTone }[] = [
  { learning: "Repeat rate is 37.4%", changed: "The fee change · it is 27.2% now", written: "Jan", flaggedBy: REPEAT_DECAY, means: "already superseded", meansTone: "muted" },
  { learning: "Reactivation decays after 90 days", changed: "Unchanged · but the cohort is four times larger", written: "Feb", flaggedBy: REPEAT_DECAY, means: "recheck the boundary", meansTone: "warn" },
  { learning: "Ghana has no repeat-rate baseline", changed: "90 days pass in October", written: "9 Jul", flaggedBy: ORCHESTRATOR, means: "it stops being true", meansTone: "ok" },
  { learning: "Card retries should run at 09:00", changed: "It has not been tested in Ghana", written: "2 Apr", flaggedBy: { initials: "IC", name: "Involuntary Churn" }, means: "scope, not truth", meansTone: "warn" },
  { learning: "UK checkout is not worth fixing", changed: "UK volume is up 31% since August", written: "22 Aug", flaggedBy: ACTIVATION, means: "the revisit condition", meansTone: "risk" },
];

export const ME14_NOTES = {
  noExpiry:
    "Every row was flagged because a condition it depends on has moved — a rate, a market, a volume — and an agent noticed. The alternative, an expiry date on every line, would send half the section for review every quarter and teach everybody to click through it. Nine learnings are flagged; fifty-two are old and untouched and nobody is asked about them.",
  ukRow:
    "He closed the UK latency room as not worth fixing and wrote a revisit threshold into Activate: if UK volume triples, reopen. Volume is up 31%, not 200%, so the room stays closed and the learning is flagged rather than reopened. A decision not to act, with a condition attached, is the only kind that ages well.",
};

// ───────────────────────── ME15 · CITE A LEARNING (modal) ─────────────────

export const ME15_PRESET = {
  subject: "Unsubscribes fell 41% after the cadence change",
  subjectDetail: "Observation · confounded by Ramadan · never cited",
  citingIn: "Reactivation wave four",
  options: [
    { label: "As context in the decision doc", sub: "readers see it, and see that it is confounded", selected: true, blocked: false },
    { label: "As background in the thread", sub: "no weight · a thing worth knowing", selected: false, blocked: false },
    { label: "As evidence for the proposal", sub: "not offered · an observation cannot justify a play", selected: false, blocked: true },
    { label: "As the reason for a guardrail", sub: "not offered · that needs a constraint or a validated learning", selected: false, blocked: true },
  ],
  confoundNote: "Wherever this appears, the words “Ramadan began in the same window” appear underneath it. There is no way to cite the 41% on its own.",
  closingNote:
    "This will read “cited once” tomorrow and will still be an observation. Nothing in this section is promoted by use, because a line that becomes evidence through repetition is how a hunch turns into a fact somewhere between March and September.",
};

// ───────────────────────── ME16 · SUPERSEDE A LEARNING (modal) ────────────

export const ME16_PRESET = {
  subject: "Reactivation works best on a Thursday",
  subjectDetail: "Written Feb · observation · cited twice · both before wave one",
  replacementBody:
    "Wave one ran across every day of the week and day of week explained none of the variance. 90,000 customers, one holdout.",
  scopeOptions: [
    { label: "Everywhere", sub: "the new reading covers all four markets and all days", selected: true },
    { label: "One market", sub: "if the newer reading only covers one", selected: false },
    { label: "After a date", sub: "if something changed and the old reading was right before it", selected: false },
    { label: "Under one condition", sub: "the narrowest scope · used three times so far", selected: false },
  ],
  closingNote:
    "Two rooms decided something in February partly because of this. Deleting it would make those two decisions look arbitrary to whoever reads them next year. Superseding says the company knows better now and still knows what it thought then, which are different facts and both worth keeping.",
};

// ───────────────────────── ME17 · SETTINGS ─────────────────────────────────

export const ME17_RULE_ROWS: { rule: string; currently: string; who: string; canChange: boolean; state: string; stateTone: "on" | "off" }[] = [
  { rule: "Every learning names its evidence and its scope", currently: "61", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "An observation cannot be cited as evidence", currently: "36", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Superseding requires a scope", currently: "14", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Nothing is deleted", currently: "0 deleted", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Closing a room writes a learning", currently: "41 rooms", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Who may write one directly", currently: "anyone", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Review flags from agents", currently: "on", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Learnings expiring on a date", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Promotion by citation count", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Agents writing learnings about customers", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Learnings from other companies appearing here", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "off" },
];

export const ME17_NOTE =
  "It would rank the section usefully and would mean that a line cited eight times becomes stronger than one measured against a holdout. The most cited thing in this workspace is a note about what the word discount means. Citation count is displayed on every row and feeds nothing.";

export const ME17_USED_ELSEWHERE_ROWS: { label: string; value: string; tone: BmTone }[] = [
  { label: "Every stage history screen", value: "“Search business memory” · ten stages, ten entry points", tone: "ai" },
  { label: "Room decision docs", value: "citations appear inline, with their state and confounds", tone: "ok" },
  { label: "Rejected proposals", value: "the reason is cited the next time something similar is proposed", tone: "ok" },
  { label: "Playbooks", value: "a playbook's preconditions are constraints from this section", tone: "ai" },
  { label: "Community", value: "nothing crosses automatically · that section has a wall around it", tone: "risk" },
];
