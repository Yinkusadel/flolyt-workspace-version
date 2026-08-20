import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, AMARA, IFEOMA, KUNLE, RAVI, SAM, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Attribution — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-attribution/flolyt-attribution/
 * (16 frames, AT01-AT16). Content transcribed from the export's own `at.py`
 * generator source, same approach as leakage map/funnel/scenario. See
 * docs/build-tracker.md section 6d.
 */

export type AtTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const AT_TONE_CLASS: Record<AtTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const AT_CHIP_TONE: Record<AtTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const AT_KPI_TONE: Record<AtTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type AttributionState = "empty" | "first" | "full";
export const ATTRIBUTION_STATE: AttributionState = "full";

/** Scoped to the Holdouts tab only — the resend-contamination edge case (AT14), wired but unreachable with the default. */
export type HoldoutState = "clean" | "contaminated";
export const HOLDOUT_STATE: HoldoutState = "clean";

export const AT_TABS = ["Attributed", "Holdouts", "Overlap", "Unattributable", "Methods"] as const;
export type AtTab = (typeof AT_TABS)[number];

/** A new agent for this section — none of the seven existing rooms/data.ts agents fit "reads two before-and-after claims and refuses to pick a winner." */
export const ATTRIBUTION_SIGNAL: AgentRef = { initials: "AS", name: "Attribution Signal" };

export const ATTRIBUTION_DETAIL_TITLES: Record<string, string> = {
  "retry-0900": "Retry cards at 09:00 local",
};

export const DISPUTE_TITLES: Record<string, string> = {
  "1": "₦16M claimed twice",
};

// ───────────────────────── AT01 · NOTHING ATTRIBUTED YET ─────────────────────────

export const AT01_ROWS: {
  intervention: string;
  started: string;
  holdout: string;
  holdoutTone: AtTone;
  closes: string;
  willSay: string;
  willSayTone: AtTone;
}[] = [
  { intervention: "Retry cards at 09:00 local", started: "24 Mar", holdout: "2,140 · 10%", holdoutTone: "ok", closes: "2 Apr", willSay: "a causal figure", willSayTone: "ok" },
  { intervention: "Discount-only buyers", started: "19 Mar", holdout: "1,900 · 10%", holdoutTone: "ok", closes: "28 Mar", willSay: "a causal figure", willSayTone: "ok" },
  { intervention: "Lagos refund and apology", started: "7 Mar", holdout: "none", holdoutTone: "risk", closes: "21 Mar", willSay: "that it happened, and nothing more", willSayTone: "risk" },
];

// ───────────────────────── AT02 · THE FIRST HOLDOUT CLOSES ─────────────────────────

export const AT02_STATS: { eyebrow: string; value: string; note: string; tone: AtTone }[] = [
  { eyebrow: "Attributed", value: "₦31M", note: "against a real control", tone: "ok" },
  { eyebrow: "Held", value: "1,900", note: "10% · kept the code", tone: "num" },
  { eyebrow: "What holding cost them", value: "₦1.1M", note: "forgone, and published", tone: "warn" },
  { eyebrow: "Everything else so far", value: "Unattributed", note: "14 rooms, no control", tone: "muted" },
];

export const AT02_KV_ROWS: { label: string; value: string; tone?: AtTone }[] = [
  { label: "The ledger gets two columns", value: "₦31M causal beside everything measured before and after", tone: "ok" },
  { label: "The weaker figures are not withdrawn", value: "they are marked, in the same table, at the same size", tone: "warn" },
  { label: "A method for reuse", value: "written down · the next four holdouts copy this design", tone: "ok" },
  { label: "A cost nobody had counted", value: "₦1.1M borne by 1,900 customers · now a standing column", tone: "warn" },
  { label: "What it does not do", value: "make the fourteen before-and-after rooms retroactively causal", tone: "risk" },
];

// ───────────────────────── AT03 · THE ATTRIBUTION BOARD ─────────────────────────

export const AT03_STATS: { eyebrow: string; value: string; note: string; tone: AtTone }[] = [
  { eyebrow: "Attributed to a holdout", value: "₦93M", note: "3 of 41 closed rooms", tone: "ok" },
  { eyebrow: "Attributed by another method", value: "₦297M", note: "14 rooms · weaker, and marked", tone: "warn" },
  { eyebrow: "Cannot be attributed", value: "₦21M", note: "3 rooms · no method existed", tone: "muted" },
  { eyebrow: "Attributed to a person", value: "₦0", note: "not a field that exists", tone: "muted" },
];

export const AT03_ROWS: {
  whatWasDone: string;
  creditedTo: string;
  amount: string;
  amountTone: AtTone;
  method: string;
  strength: string;
  strengthTone: AtTone;
  signed: string;
}[] = [
  { whatWasDone: "Retry cards at 09:00 local", creditedTo: "Involuntary churn", amount: "₦62M", amountTone: "ok", method: "Holdout · 2,140 at 10%", strength: "causal", strengthTone: "ai", signed: "Ravi" },
  { whatWasDone: "Discount-only buyers", creditedTo: "Net revenue", amount: "₦31M", amountTone: "ok", method: "Holdout · 1,900 at 10%", strength: "causal", strengthTone: "ai", signed: "Ravi" },
  { whatWasDone: "Kenya retry window", creditedTo: "Involuntary churn", amount: "KES 1.0M", amountTone: "ok", method: "Holdout · 490 at 10%", strength: "causal", strengthTone: "ai", signed: "Ravi" },
  { whatWasDone: "Reactivation · wave one", creditedTo: "90-day repeat", amount: "₦9.1M", amountTone: "warn", method: "Holdout · still running, day 12", strength: "provisional", strengthTone: "warn", signed: "Ifeoma" },
  { whatWasDone: "Onboarding email rewrite", creditedTo: "Activation", amount: "₦188M", amountTone: "warn", method: "Before and after · no control", strength: "association", strengthTone: "warn", signed: "Zainab" },
  { whatWasDone: "Basket prompt at checkout", creditedTo: "Expansion", amount: "₦72M", amountTone: "warn", method: "Before and after · no control", strength: "association", strengthTone: "warn", signed: "Tunde" },
  { whatWasDone: "Twelve smaller rooms", creditedTo: "Six metrics", amount: "₦37M", amountTone: "warn", method: "Before and after · no control", strength: "association", strengthTone: "warn", signed: "various" },
  { whatWasDone: "Lagos refund and apology", creditedTo: "90-day repeat", amount: "₦9M", amountTone: "muted", method: "Nothing was withheld", strength: "unattributable", strengthTone: "neutral", signed: "Amara" },
  { whatWasDone: "Weekend push fatigue", creditedTo: "—", amount: "₦12M", amountTone: "muted", method: "No holdout was possible", strength: "unattributable", strengthTone: "neutral", signed: "Ifeoma" },
];

export const AT03_REFUSE_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "Sum the two columns into one figure", value: "₦411M with no method beside it is the number people quote", tone: "risk" },
  { label: "Credit anything to a person", value: "the field takes a metric and will not accept a name", tone: "ok" },
  { label: "Promote a figure over time", value: "an association measured for six months is the same association", tone: "ai" },
  { label: "Drop the unattributable rows", value: "₦21M moved and belongs on the same page as the rest", tone: "warn" },
];

// ───────────────────────── AT04 · ONE MEASURED INTERVENTION (retry-0900) ─────────────────────────

export const AT04_STATS: { eyebrow: string; value: string; note: string; tone?: AtTone }[] = [
  { eyebrow: "Recovery rate", value: "70.5%", note: "was 25.0% at midnight", tone: "ok" },
  { eyebrow: "Attributed", value: "₦62M", note: "over 9 days", tone: "ok" },
  { eyebrow: "Holdout", value: "2,140", note: "10% · still retried at midnight" },
  { eyebrow: "Confidence", value: "5 / 5", note: "n=21,400 · p<0.001", tone: "ok" },
];

export const AT04_BARS: { label: string; sub: string; percent: number; tone: AtTone }[] = [
  { label: "Treated · retried 09:00 local", sub: "70.5% recovered · 13,595 of 19,260", percent: 70.5, tone: "ok" },
  { label: "Holdout · retried at midnight", sub: "25.0% recovered · 535 of 2,140", percent: 25.0, tone: "muted" },
  { label: "Nigeria", sub: "72.1%", percent: 72.1, tone: "ok" },
  { label: "Kenya · day 9 of 9, closing today", sub: "68.4%", percent: 68.4, tone: "ai" },
];

export const AT04_GHANA_ROW = "Ghana · not shipped · Unavailable, no card volume baseline · the row is kept so the gap has a place to be";

export const AT04_KV_ROWS: { label: string; value: string; tone?: AtTone }[] = [
  { label: "What would say it failed", value: "recovery below 40% in the first 72 hours · written 24 Mar", tone: "ok" },
  { label: "Who approved it", value: "Ravi Mehta · re-auth at 09:12 on 24 March" },
  { label: "Recorded dissent", value: "none on this one", tone: "muted" },
  { label: "Why 09:00 and not payday", value: "the payday calendar was Unavailable · noted, not estimated", tone: "warn" },
  { label: "Credited to", value: "Involuntary churn · not to Renew, not to Finance, not to Ravi" },
  { label: "What the 2,140 held customers lost", value: "45.5 points of recovery · ₦6.9M, and it is stated", tone: "warn" },
];

// ───────────────────────── AT05 · HOLDOUTS ─────────────────────────

export const AT05_ROWS: {
  intervention: string;
  held: string;
  of: string;
  day: string;
  ends: string;
  endsTone: AtTone;
  instead: string;
  cost: string;
  costTone: AtTone;
}[] = [
  { intervention: "Reactivation · wave one", held: "10,000", of: "90,000", day: "12", ends: "21 Aug", endsTone: "muted", instead: "Nothing · no contact", cost: "≈₦1.0M", costTone: "warn" },
  { intervention: "Reactivation · wave two", held: "5,000", of: "46,000", day: "3", ends: "30 Aug", endsTone: "muted", instead: "Nothing · no contact", cost: "≈₦260k", costTone: "muted" },
  { intervention: "Kenya retry window", held: "490", of: "4,900", day: "9", ends: "today", endsTone: "warn", instead: "Midnight retry · the old behaviour", cost: "≈KES 110k", costTone: "warn" },
  { intervention: "Basket prompt · rerun", held: "2,400", of: "24,000", day: "1", ends: "14 Sep", endsTone: "muted", instead: "The checkout as it is today", cost: "unknown yet", costTone: "muted" },
];

/** Shared by AT05's "who is never held back" table and AT12's wizard exclusions step — identical content in the export. */
export const AT_EXCLUDED_ROWS: { group: string; size: string; sizeTone: AtTone; why: string; setBy: string }[] = [
  { group: "Anyone with an open complaint", size: "1,840", sizeTone: "num", why: "Measurement is not a reason to ignore somebody", setBy: "product" },
  { group: "Anyone owed a refund", size: "410", sizeTone: "num", why: "Money owed is not an experimental condition", setBy: "product" },
  { group: "Anyone who has opted out", size: "6,100", sizeTone: "num", why: "Consent applies to being studied too", setBy: "product" },
  { group: "Ghana", size: "410,000", sizeTone: "warn", why: "No baseline · a holdout there measures nothing", setBy: "data" },
  { group: "Customers in two other holdouts", size: "2,900", sizeTone: "num", why: "Three simultaneous holds is not a control, it is neglect", setBy: "product" },
];

// ───────────────────────── AT06 · OVERLAP ─────────────────────────

export const AT06_STATS: { eyebrow: string; value: string; note: string; tone: AtTone }[] = [
  { eyebrow: "Customers in more than one room", value: "41,300", note: "across 4 rooms", tone: "warn" },
  { eyebrow: "Money claimed twice", value: "₦47M", note: "before subtraction", tone: "risk" },
  { eyebrow: "Counted once, after subtraction", value: "₦31M", note: "in the ledger", tone: "ok" },
  { eyebrow: "Still disputed", value: "₦16M", note: "two rooms, both argue", tone: "risk" },
];

export const AT06_ROWS: {
  overlap: string;
  people: string;
  claimedByA: string;
  claimedByATone: AtTone;
  claimedByB: string;
  claimedByBTone: AtTone;
  resolution: string;
  resolutionTone: AtTone;
  whoDecided: string;
  whoDecidedTone?: AtTone;
}[] = [
  { overlap: "Nairobi dunning ∩ Kenya retry", people: "4,100", claimedByA: "KES 1.0M", claimedByATone: "warn", claimedByB: "KES 0.9M", claimedByBTone: "warn", resolution: "split by first touch", resolutionTone: "ok", whoDecided: "Ravi" },
  { overlap: "Reactivation ∩ Second order", people: "22,800", claimedByA: "₦9.1M", claimedByATone: "warn", claimedByB: "₦9.1M", claimedByBTone: "warn", resolution: "one room · same play", resolutionTone: "ok", whoDecided: "Ifeoma" },
  { overlap: "Discount-only ∩ Basket prompt", people: "9,200", claimedByA: "₦31M", claimedByATone: "warn", claimedByB: "₦16M", claimedByBTone: "risk", resolution: "unresolved", resolutionTone: "risk", whoDecided: "nobody", whoDecidedTone: "risk" },
  { overlap: "Lagos refund ∩ Reactivation", people: "5,200", claimedByA: "₦9M", claimedByATone: "muted", claimedByB: "₦2.1M", claimedByBTone: "muted", resolution: "refund counted, prompt not", resolutionTone: "ok", whoDecided: "Amara" },
];

export const AT06_KV_ROWS: { label: string; value: string; tone?: AtTone }[] = [
  { label: "How", value: "audience lists are intersected nightly · every room, every play" },
  { label: "What it catches", value: "the same customer credited to two closed rooms", tone: "ok" },
  { label: "What it cannot catch", value: "the same customer affected by something with no audience list", tone: "warn" },
  { label: "Guest checkout", value: "42,000 people can never be intersected with anything", tone: "risk" },
  { label: "Default when unresolved", value: "none · the money waits rather than being split", tone: "ok" },
];

// ───────────────────────── AT07 · UNATTRIBUTABLE ─────────────────────────

export const AT07_ROWS: {
  what: string;
  amount: string;
  amountTone: AtTone;
  why: string;
  whoseCall: string;
  fixable: string;
  fixableTone: AtTone;
}[] = [
  { what: "Lagos refund and apology", amount: "₦9M", amountTone: "warn", why: "Nothing was withheld · Amara refused to hold 310 people", whoseCall: "Amara", fixable: "no · and correctly so", fixableTone: "ok" },
  { what: "Weekend push fatigue", amount: "₦12M", amountTone: "warn", why: "Cadence changed for everyone at once", whoseCall: "Ifeoma", fixable: "yes · next time", fixableTone: "warn" },
  { what: "Accra reactivation", amount: "GHS 380k", amountTone: "warn", why: "Ran before Ghana had a repeat-rate baseline", whoseCall: "Kunle", fixable: "yes · after 90 days", fixableTone: "warn" },
  { what: "Guest-checkout recoveries", amount: "Unavailable", amountTone: "muted", why: "42,000 orders cannot be joined to a customer", whoseCall: "data", fixable: "yes · one field", fixableTone: "warn" },
];

export const AT07_KV_ROWS: { label: string; value: string; tone?: AtTone }[] = [
  { label: "It stays in the value ledger", value: "as money that moved, with the reason attached", tone: "ok" },
  { label: "It never enters a causal figure", value: "the ₦93M attributed to holdouts excludes all of it", tone: "ok" },
  { label: "It is counted separately", value: "₦21M plus GHS 380k · never inside another total", tone: "warn" },
  { label: "The room still closes", value: "as unmeasurable · closing is not conditional on a number" },
  { label: "The lesson is written down", value: "three of four produced a rule the next play inherits", tone: "ok" },
];

// ───────────────────────── AT08 · METHODS ─────────────────────────

export const AT08_ROWS: {
  method: string;
  compares: string;
  strength: string;
  strengthTone: AtTone;
  used: string;
  usedTone: AtTone;
  available: string;
  availableTone: AtTone;
  whyNot: string;
  whyNotTone: AtTone;
}[] = [
  { method: "Holdout", compares: "Treated against a randomly held group", strength: "causal", strengthTone: "ai", used: "3 rooms", usedTone: "num", available: "yes", availableTone: "ok", whyNot: "—", whyNotTone: "muted" },
  { method: "A market that did not receive it", compares: "Nigeria against the UK", strength: "causal", strengthTone: "ai", used: "1 room", usedTone: "num", available: "partly", availableTone: "warn", whyNot: "Ghana loses it on 14 Sep", whyNotTone: "warn" },
  { method: "Regression discontinuity", compares: "Either side of a hard threshold", strength: "causal", strengthTone: "ai", used: "0 rooms", usedTone: "muted", available: "yes", availableTone: "ok", whyNot: "nobody has used it", whyNotTone: "muted" },
  { method: "Before and after", compares: "The same group either side of a date", strength: "association", strengthTone: "warn", used: "14 rooms", usedTone: "warn", available: "yes", availableTone: "ok", whyNot: "—", whyNotTone: "muted" },
  { method: "Matched cohorts", compares: "Similar customers who did not get it", strength: "association", strengthTone: "warn", used: "2 rooms", usedTone: "num", available: "no", availableTone: "risk", whyNot: "needs COGS to match on value", whyNotTone: "risk" },
  { method: "Against forecast", compares: "What happened against what was predicted", strength: "not a method", strengthTone: "neutral", used: "0 rooms", usedTone: "muted", available: "never", availableTone: "risk", whyNot: "a forecast is not a measurement", whyNotTone: "risk" },
];

// ───────────────────────── AT09 · CREDIT A RECOVERY (modal) ─────────────────────────

export const AT09_PRESET = {
  subject: "Kenya retry window",
  subjectDetail: "Closing today · KES 1.1M observed, KES 1.0M attributable",
  methods: [
    { label: "Against a holdout", sub: "490 customers left on the midnight retry", on: true, blocked: false },
    { label: "Against a market that did not receive it", sub: "not available · Ghana has no card baseline", on: false, blocked: true },
    { label: "Against the pre-change baseline", sub: "offered · strength drops to association", on: false, blocked: false },
    { label: "Against forecast", sub: "never offered · a forecast is not a measurement", on: false, blocked: true },
  ],
  creditedTo: "Involuntary churn",
  creditedToMeta: "not Renew · not Ravi",
  overlapWarning: "4,100 of these customers sit in both. Counted here once, named there too, and the ledger gets the net figure.",
  amount: "KES 1.0M",
};

// ───────────────────────── AT10 · MARK IT UNATTRIBUTABLE (modal) ─────────────────────────

export const AT10_PRESET = {
  subject: "Accra reactivation",
  subjectDetail: "GHS 2.1M at risk · GHS 380k observed · closed 9 July",
  reason: "Ghana had no repeat-rate baseline in July, so the GHS 380k that arrived cannot be separated from what would have arrived anyway. No holdout was set.",
  avoidable: [
    { label: "Yes · we should have waited for the baseline", sub: "becomes a rule the next Ghana play inherits", on: true },
    { label: "Yes · but the timing was worth more than the measurement", sub: "a defensible trade, recorded as one", on: false },
    { label: "No · nothing could have been withheld", sub: "the Lagos refund answer · not this one", on: false },
  ],
};

// ───────────────────────── AT11 · DESIGN A HOLDOUT · SIZE ─────────────────────────

export const AT11_SUBJECT = {
  title: "Basket prompt at checkout · rerun with a control",
  sub: "The first run claimed ₦72M on before-and-after · this is the attempt to check it",
};

export const AT11_SIZE_ROWS: {
  pct: string;
  held: string;
  treated: string;
  detects: string;
  detectsTone: AtTone;
  timeToAnswer: string;
  timeToAnswerTone: AtTone;
  cost: string;
  costTone: AtTone;
}[] = [
  { pct: "5%", held: "1,200", treated: "22,800", detects: "4.1 points", detectsTone: "warn", timeToAnswer: "31 days", timeToAnswerTone: "warn", cost: "≈₦1.1M", costTone: "ok" },
  { pct: "10%", held: "2,400", treated: "21,600", detects: "2.9 points", detectsTone: "ok", timeToAnswer: "18 days", timeToAnswerTone: "ok", cost: "≈₦2.2M", costTone: "warn" },
  { pct: "20%", held: "4,800", treated: "19,200", detects: "2.1 points", detectsTone: "ok", timeToAnswer: "13 days", timeToAnswerTone: "ok", cost: "≈₦4.4M", costTone: "risk" },
  { pct: "50%", held: "12,000", treated: "12,000", detects: "1.6 points", detectsTone: "ok", timeToAnswer: "11 days", timeToAnswerTone: "ok", cost: "≈₦11M", costTone: "risk" },
];

export const AT11_DURATION_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "Minimum", value: "18 days at 10% · below that the result is not readable", tone: "warn" },
  { label: "Proposed end", value: "14 September · fixed at the start, visible to everyone" },
  { label: "Extending it", value: "same approval as starting it · appears as a separate row", tone: "warn" },
  { label: "Stopping early", value: "allowed if the failure condition breaches · nothing else", tone: "ok" },
  { label: "What is written before it starts", value: "what result would say this failed · required to continue", tone: "ok" },
];

// ───────────────────────── AT12 · DESIGN A HOLDOUT · EXCLUSIONS ─────────────────────────

export const AT12_IMPACT_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "Eligible before exclusions", value: "24,000 · the full checkout population this fortnight" },
  { label: "Removed", value: "8,140 · a third of them opted out rather than complained", tone: "warn" },
  { label: "Eligible after", value: "15,860 · the holdout is drawn from these", tone: "ok" },
  { label: "Held", value: "1,586 at 10% · not 2,400 · the size follows the eligible pool", tone: "warn" },
  { label: "Effect on the answer", value: "detects 3.4 points instead of 2.9 · about 4 days longer", tone: "warn" },
  { label: "What is not offered", value: "raising the percentage to get back to 2,400", tone: "risk" },
];

// ───────────────────────── AT13 · A DISAGREEMENT (disputes/1) ─────────────────────────

export const AT13_HERO = {
  label: "claimed by two rooms · held out of the ledger",
  big: "₦16M",
  sub: "9,200 customers, two explanations, and no default has been applied.",
  rightLab: "unresolved for",
  rightBig: "23 days",
  rightSub: "no decision owner",
};

export const AT13_CARDS: { kicker: string; bold: string; body: string; footer: string; acc: "warn" | "ai" }[] = [
  {
    kicker: "Expansion · Tunde",
    bold: "The prompt moved them",
    body: "Basket size rose 18% in the treated weeks among customers who saw the checkout prompt, and the rise is concentrated in the categories the prompt names.",
    footer: "before and after · no control",
    acc: "warn",
  },
  {
    kicker: "Price & Margin · Ravi",
    bold: "They were discount-only",
    body: "All 9,200 had used a code in the prior 60 days. The discount-only room closed in the same fortnight and these customers convert at that rate with or without a prompt.",
    footer: "before and after · no control",
    acc: "warn",
  },
  {
    kicker: "The agent's position",
    bold: "Both are consistent with the data",
    body: "Attribution Signal has stated it cannot separate the two effects with the evidence available, and has not chosen. It named what would separate them instead.",
    footer: "insufficient evidence",
    acc: "ai",
  },
];

export const AT13_SETTLE_ROWS: {
  wouldSettle: string;
  howLong: string;
  howLongTone: AtTone;
  cost: string;
  costTone: AtTone;
  who: string;
  started: string;
  startedTone: AtTone;
}[] = [
  { wouldSettle: "A holdout on the basket prompt", howLong: "18 days", howLongTone: "ok", cost: "≈₦2.2M held", costTone: "warn", who: "Tunde", started: "designed today", startedTone: "ai" },
  { wouldSettle: "Splitting the ₦16M by first touch", howLong: "today", howLongTone: "muted", cost: "a number neither believes", costTone: "risk", who: "either of them", started: "refused", startedTone: "risk" },
  { wouldSettle: "Giving it to the more senior person", howLong: "today", howLongTone: "muted", cost: "the habit, permanently", costTone: "risk", who: "Ada", started: "not offered", startedTone: "risk" },
  { wouldSettle: "Leaving it out of the ledger", howLong: "indefinite", howLongTone: "warn", cost: "₦16M invisible", costTone: "warn", who: "nobody", started: "what is happening", startedTone: "warn" },
];

export const AT13_RISK_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "If Tunde is right", value: "the ₦72M basket-prompt figure holds and the prompt gets rebuilt in two more markets" },
  { label: "If Ravi is right", value: "₦72M drops to ₦56M and one closed room reopens", tone: "warn" },
  { label: "If the holdout says neither", value: "the likeliest outcome · both effects are real and small", tone: "muted" },
  { label: "What neither of them loses", value: "nothing · no figure here is attached to a person's record", tone: "ok" },
];

// ───────────────────────── AT14 · A CONTAMINATED HOLDOUT ─────────────────────────

export const AT14_ALERT = {
  title: "1,204 people in the reactivation holdout received the message anyway",
  body: "A resend triggered on 14 August ignored the hold list. Twelve per cent of the held group is now treated, and the comparison this holdout exists to produce is no longer clean.",
};

export const AT14_STATS: { eyebrow: string; value: string; note: string; tone?: AtTone }[] = [
  { eyebrow: "Held group", value: "10,000", note: "wave one, day 12" },
  { eyebrow: "Contaminated", value: "1,204", note: "12.0% · received the resend", tone: "risk" },
  { eyebrow: "Usable holdout now", value: "8,796", note: "if the 1,204 are excluded", tone: "warn" },
  { eyebrow: "Provisional figure", value: "Withdrawn", note: "₦9.1M · no longer stated", tone: "risk" },
];

export const AT14_OPTIONS: {
  option: string;
  whatItDoes: string;
  answerBy: string;
  answerByTone: AtTone;
  cost: string;
  costTone: AtTone;
  state: string;
  stateTone: AtTone;
}[] = [
  { option: "Exclude the 1,204 and continue", whatItDoes: "90,000 treated against 8,796 held", answerBy: "21 Aug", answerByTone: "ok", cost: "the held group is no longer random", costTone: "risk", state: "not chosen", stateTone: "muted" },
  { option: "Restart the holdout", whatItDoes: "A fresh 10,000, held from today", answerBy: "14 Sep", answerByTone: "warn", cost: "24 more days · about ₦2.4M held", costTone: "warn", state: "not chosen", stateTone: "muted" },
  { option: "Close it as unattributable", whatItDoes: "₦9.1M moves to unattributable", answerBy: "today", answerByTone: "muted", cost: "no causal figure from wave one", costTone: "warn", state: "not chosen", stateTone: "muted" },
  { option: "Report it as if nothing happened", whatItDoes: "Not offered", answerBy: "—", answerByTone: "muted", cost: "every future figure becomes deniable", costTone: "risk", state: "never", stateTone: "risk" },
];

export const AT14_OTHER_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "Wave two", value: "unaffected · the resend was scoped to wave one", tone: "ok" },
  { label: "Kenya retry", value: "unaffected · different channel entirely", tone: "ok" },
  { label: "Basket prompt", value: "unaffected · day 1, no sends involved", tone: "ok" },
  { label: "The cause", value: "a resend built outside the play, bypassing the hold list", tone: "risk" },
  { label: "The fix", value: "hold lists enforced at send, not at build · assigned to Sam, today", tone: "warn" },
];

// ───────────────────────── AT15 · SETTINGS ─────────────────────────

export const AT15_ROWS: {
  rule: string;
  currently: string;
  currentlyTone: AtTone;
  who: string;
  canChange: boolean;
  state: string;
  stateTone: AtTone;
}[] = [
  { rule: "Method and strength shown on every figure", currently: "8 rows", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Overlap subtracted before the ledger", currently: "₦16M held", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Unattributable rows stay visible", currently: "4 rows", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The permanent exclusion list", currently: "8,140", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Default holdout size", currently: "10%", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Minimum holdout size", currently: "5%", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Attribution to a person", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Unresolved overlap split automatically", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Attribution against forecast", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const AT15_PUBLISH_KV: { label: string; value: string; tone?: AtTone }[] = [
  { label: "Share of the ledger on holdouts", value: "₦93M of ₦411M · 23% · published, not buried", tone: "warn" },
  { label: "Rooms closed without any method", value: "3 of 41 · listed by name", tone: "warn" },
  { label: "People permanently outside every experiment", value: "8,140 · and the bias that creates", tone: "warn" },
  { label: "Disputed money", value: "₦16M · out of the ledger for 23 days", tone: "risk" },
  { label: "Cost of the holdouts running now", value: "≈₦1.3M this fortnight · to the held customers, not to the company" },
];

// Re-exported for the People columns across the tables above.
export { ADA, AMARA, IFEOMA, KUNLE, RAVI, SAM, TUNDE, ZAINAB };
export type { PersonRef };
