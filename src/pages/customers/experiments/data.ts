import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import { ADA, AMARA, IFEOMA, RAVI, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";

/**
 * Customers · Experiments — sourced from
 * flolyt-figma-designs/Customers Screens/flolyt-experiments/flolyt-experiments/
 * (16 frames, XP01-XP16). Content transcribed from the export's own `xp.py`
 * generator source, same approach as Segments/Customer health/Campaigns. See
 * docs/build-tracker.md.
 */

export type ExTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const EX_TONE_CLASS: Record<ExTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const EX_CHIP_TONE: Record<ExTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const EX_KPI_TONE: Record<ExTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const EX_BAR_TONE: Record<ExTone, BarTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior mock flag. */
export type ExperimentsState = "nothing" | "first" | "full";
export const EXPERIMENTS_STATE: ExperimentsState = "full";

export const EX_TABS = ["Running", "Results", "Never included", "Readability", "History"] as const;
export type ExTab = (typeof EX_TABS)[number];

// ───────────────────────── XP01 · NOTHING TO MEASURE YET ─────────────────────────

export const XP01_CANDIDATE_ROWS: {
  campaign: string;
  audience: string;
  holdout: string;
  holdoutTone: ExTone;
  answerIn: string;
  answerInTone: ExTone;
  cost: string;
  costTone: ExTone;
}[] = [
  { campaign: "Retry cards at 09:00 local", audience: "21,400", holdout: "2,140", holdoutTone: "warn", answerIn: "9 days", answerInTone: "ok", cost: "≈₦6.9M of recovery", costTone: "warn" },
  { campaign: "Discount withdrawal", audience: "47,000", holdout: "4,700", holdoutTone: "warn", answerIn: "14 days", answerInTone: "ok", cost: "≈₦1.1M forgone", costTone: "warn" },
  { campaign: "Reactivation · lapsed", audience: "100,000", holdout: "10,000", holdoutTone: "warn", answerIn: "18 days", answerInTone: "warn", cost: "≈₦1.0M of decay", costTone: "warn" },
  { campaign: "Lagos refund and apology", audience: "3,100", holdout: "310", holdoutTone: "risk", answerIn: "14 days", answerInTone: "ok", cost: "an apology withheld", costTone: "risk" },
];

// ───────────────────────── XP02 · THE FIRST RESULT ─────────────────────────

export const XP02_STATS: { eyebrow: string; value: string; note: string; tone: ExTone }[] = [
  { eyebrow: "Treated", value: "70.5%", note: "13,595 of 19,260", tone: "ok" },
  { eyebrow: "Held", value: "25.0%", note: "535 of 2,140", tone: "muted" },
  { eyebrow: "Difference", value: "+45.5 pts", note: "p<0.001", tone: "ok" },
  { eyebrow: "Days to an answer", value: "9", note: "and it was pre-registered", tone: "ok" },
];

export const XP02_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "A causal claim", value: "the first one · ₦62M that does not need the word probably", tone: "ok" },
  { label: "A reusable design", value: "copied to Kenya · blocked in Ghana for lack of a baseline", tone: "ok" },
  { label: "A written failure condition", value: "now required on every experiment in the workspace", tone: "ok" },
  { label: "A published cost", value: "₦6.9M of recovery withheld from 2,140 people", tone: "warn" },
  { label: "It did not make the other fourteen rooms causal", value: "they remain before-and-after, and are marked as such", tone: "risk" },
];

// ───────────────────────── XP03 · RUNNING ─────────────────────────

export const XP03_STATS: { eyebrow: string; value: string; note: string; tone: ExTone }[] = [
  { eyebrow: "Running", value: "4", note: "across 3 rooms", tone: "num" },
  { eyebrow: "Held right now", value: "17,076", note: "people receiving nothing", tone: "warn" },
  { eyebrow: "Compromised", value: "1", note: "wave one · 1,204 treated", tone: "risk" },
  { eyebrow: "Cost of holding this fortnight", value: "≈₦1.3M", note: "borne by customers", tone: "warn" },
];

export type ExperimentRow = {
  experiment: string;
  /** Only set on the two rows with a built `:id` detail page (`kenya-retry`, `weekend-cadence`). */
  id?: string;
  campaign: string;
  held: string;
  heldTone: ExTone;
  of: string;
  day: string;
  ends: string;
  state: string;
  stateTone: ExTone;
  /** Set on the row XP08's own contaminated route describes, and the row XP13's own modal targets. */
  rowAction?: "contaminated" | "stop";
};

export const XP03_ROWS: ExperimentRow[] = [
  { experiment: "Reactivation · wave one", campaign: "Reactivation wave one", held: "10,000", heldTone: "warn", of: "100,000", day: "12", ends: "21 Aug", state: "contaminated", stateTone: "risk", rowAction: "contaminated" },
  { experiment: "Reactivation · wave two", campaign: "Reactivation wave two", held: "5,000", heldTone: "ok", of: "51,000", day: "3", ends: "30 Aug", state: "clean", stateTone: "ok", rowAction: "stop" },
  { experiment: "Kenya retry window", id: "kenya-retry", campaign: "Retry cards · Kenya", held: "490", heldTone: "ok", of: "4,900", day: "9", ends: "today", state: "closing", stateTone: "ok" },
  { experiment: "Basket prompt · rerun", campaign: "Basket prompt rerun", held: "1,586", heldTone: "ok", of: "15,860", day: "1", ends: "14 Sep", state: "clean", stateTone: "ok" },
];

export type ConditionRow = {
  experiment: string;
  failsIf: string;
  written: string;
  breached: string;
  breachedTone: ExTone;
  wouldStop: boolean;
  /** Set on the row XP14's own modal targets. */
  rowAction?: "changeCondition";
};

export const XP03_CONDITION_ROWS: ConditionRow[] = [
  { experiment: "Reactivation · wave one", failsIf: "Reactivation below 6% in 14 days", written: "2 Aug", breached: "no · 11.2%", breachedTone: "ok", wouldStop: true },
  { experiment: "Reactivation · wave two", failsIf: "Reactivation below 6% in 14 days", written: "13 Aug", breached: "no · day 3", breachedTone: "muted", wouldStop: true },
  { experiment: "Kenya retry window", failsIf: "Recovery below 40% in 72 hours", written: "9 Aug", breached: "no · 68.4%", breachedTone: "ok", wouldStop: true },
  { experiment: "Basket prompt · rerun", failsIf: "Basket lift below 2 points in 18 days", written: "17 Aug", breached: "no · day 1", breachedTone: "muted", wouldStop: true, rowAction: "changeCondition" },
];

// ───────────────────────── XP04 · ONE EXPERIMENT (kenya-retry) ─────────────────────────

export const XP04_DESIGN_ROWS: { field: string; written: string; changed: boolean }[] = [
  { field: "The question", written: "Does moving the retry to 09:00 work in Kenya as it did in Nigeria?", changed: false },
  { field: "What would say it failed", written: "Recovery below 40% in 72 hours", changed: false },
  { field: "Holdout", written: "10% · 490 customers, left on the midnight retry", changed: false },
  { field: "How long", written: "9 days · matching the Nigerian run so the two compare", changed: false },
  { field: "What it will not tell us", written: "Why cards fail at midnight at all", changed: false },
  { field: "Who signed it", written: "Ravi Mehta · re-auth 08:04 on 9 August", changed: false },
];

export const XP04_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "What they got", value: "the midnight retry · the behaviour everyone had until March", tone: "muted" },
  { label: "What it cost them", value: "44.3 points of recovery · about KES 110,000 across the group", tone: "warn" },
  { label: "How they were chosen", value: "at random, from the eligible pool after exclusions", tone: "ok" },
  { label: "Whether they were told", value: "no · and the design says so in those words", tone: "warn" },
  { label: "What happens to them now", value: "they move to the 09:00 retry today, with everyone else", tone: "ok" },
];

// ───────────────────────── XP05 · NEVER INCLUDED ─────────────────────────

export const XP05_ROWS: {
  excluded: string;
  people: string;
  peopleTone: ExTone;
  why: string;
  setBy: string;
  overridable: string;
  overridableTone: ExTone;
}[] = [
  { excluded: "Open complaint", people: "1,840", peopleTone: "warn", why: "Measurement is not a reason to ignore somebody", setBy: "product", overridable: "no", overridableTone: "risk" },
  { excluded: "Owed a refund", people: "410", peopleTone: "muted", why: "Money owed is not an experimental condition", setBy: "product", overridable: "no", overridableTone: "risk" },
  { excluded: "Opted out of being studied", people: "6,100", peopleTone: "warn", why: "Consent covers this, not only contact", setBy: "the customer", overridable: "never", overridableTone: "risk" },
  { excluded: "Already in two holdouts", people: "2,900", peopleTone: "warn", why: "Three simultaneous holds is neglect, not a control", setBy: "product", overridable: "no", overridableTone: "risk" },
  { excluded: "Ghana · no baseline", people: "410,000", peopleTone: "risk", why: "A holdout there would measure nothing", setBy: "data", overridable: "no · until 90 days pass", overridableTone: "warn" },
  { excluded: "Guest checkout", people: "42,000", peopleTone: "risk", why: "Cannot be identified, so cannot be assigned to a group", setBy: "data", overridable: "one field", overridableTone: "warn" },
];

// ───────────────────────── XP06 · RESULTS ─────────────────────────

export type ResultRow = {
  experiment: string;
  /** Only set on the one row with a built `:id` detail page (`weekend-cadence`). */
  id?: string;
  closed: string;
  treated: string;
  held: string;
  difference: string;
  result: string;
  resultTone: ExTone;
  preRegistered: string;
  preRegisteredTone: ExTone;
};

export const XP06_ROWS: ResultRow[] = [
  { experiment: "Retry cards at 09:00 · NG", closed: "2 Apr", treated: "70.5%", held: "25.0%", difference: "+45.5", result: "₦62M · causal", resultTone: "ok", preRegistered: "yes", preRegisteredTone: "ok" },
  { experiment: "Discount withdrawal", closed: "28 Mar", treated: "₦8,420", held: "₦8,100", difference: "+₦320", result: "₦31M · causal", resultTone: "ok", preRegistered: "yes", preRegisteredTone: "ok" },
  { experiment: "Kenya retry window", closed: "today", treated: "68.4%", held: "24.1%", difference: "+44.3", result: "KES 1.0M · causal", resultTone: "ok", preRegistered: "yes", preRegisteredTone: "ok" },
  { experiment: "Weekend cadence change", id: "weekend-cadence", closed: "17 Mar", treated: "—", held: "—", difference: "—", result: "₦12M · unattributable", resultTone: "muted", preRegistered: "no holdout", preRegisteredTone: "risk" },
  { experiment: "Onboarding rewrite", closed: "19 Feb", treated: "—", held: "—", difference: "—", result: "₦188M · association", resultTone: "warn", preRegistered: "no holdout", preRegisteredTone: "risk" },
];

export const XP06_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "The registered design", value: "question, condition, holdout size, duration, signer" },
  { label: "Both groups' numbers", value: "not only the difference · the held figure is half the finding", tone: "ok" },
  { label: "The cost of holding", value: "what the held group lost, in points and in money", tone: "warn" },
  { label: "Whether it was pre-registered", value: "and if not, why not", tone: "warn" },
  { label: "What it does not tell you", value: "written at design time, before the result was known", tone: "ai" },
];

// ───────────────────────── XP07 · A RESULT THAT FAILED (weekend-cadence) ─────────────────────────

export const XP07_DESIGN_ROWS: { field: string; whatExists: string; present: boolean; consequence: string }[] = [
  { field: "The question", whatExists: "Do fewer weekend pushes reduce unsubscribes?", present: true, consequence: "—" },
  { field: "What would say it failed", whatExists: "Nothing was written", present: false, consequence: "no way to have been wrong" },
  { field: "A held group", whatExists: "None · 310,000 people all changed together", present: false, consequence: "no comparison exists" },
  { field: "A duration", whatExists: "Two weeks", present: true, consequence: "—" },
  { field: "A signer", whatExists: "Ifeoma Nwosu · 17 March", present: true, consequence: "—" },
  { field: "A result", whatExists: "Unsubscribes fell 18% · ₦12M attributed to nothing", present: true, consequence: "association at best" },
];

export const XP07_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "A held group of 31,000", value: "10% kept on the old cadence for a fortnight", tone: "warn" },
  { label: "What that would have cost them", value: "more weekend pushes · the thing being reduced", tone: "warn" },
  { label: "What it would have bought", value: "a causal figure instead of ₦12M of nothing", tone: "ok" },
  { label: "Why it was not done", value: "nobody thought of it · this was before the first holdout closed", tone: "muted" },
  { label: "The rule it produced", value: "hold a group before changing cadence · inherited by every play since", tone: "ok" },
];

// ───────────────────────── XP08 · WHEN ONE BREAKS ─────────────────────────

export const XP08_STATS: { eyebrow: string; value: string; note: string; tone: ExTone }[] = [
  { eyebrow: "Held group", value: "10,000", note: "wave one, day 12", tone: "num" },
  { eyebrow: "Contaminated", value: "1,204", note: "12.0%", tone: "risk" },
  { eyebrow: "Usable if they are dropped", value: "8,796", note: "and no longer random", tone: "warn" },
  { eyebrow: "Provisional figure", value: "Withdrawn", note: "₦9.1M no longer stated", tone: "risk" },
];

export const XP08_OPTION_ROWS: { option: string; whatItDoes: string; answerBy: string; cost: string; state: string; stateTone: ExTone }[] = [
  { option: "Exclude the 1,204 and continue", whatItDoes: "90,000 treated against 8,796 held", answerBy: "21 Aug", cost: "the held group is no longer random", state: "not chosen", stateTone: "muted" },
  { option: "Restart the holdout", whatItDoes: "A fresh 10,000, held from today", answerBy: "14 Sep", cost: "24 more days · about ₦2.4M held", state: "not chosen", stateTone: "muted" },
  { option: "Close it as unattributable", whatItDoes: "₦9.1M moves to unattributable", answerBy: "today", cost: "no causal figure from wave one", state: "not chosen", stateTone: "muted" },
  { option: "Report it as if nothing happened", whatItDoes: "Not offered", answerBy: "—", cost: "every future figure becomes deniable", state: "never", stateTone: "risk" },
];

// ───────────────────────── XP09 · NEW · 1 · THE QUESTION ─────────────────────────

export const XP09_QUESTION = {
  headline: "Does prompting one feature at day three raise the second-order rate?",
  detail: "Adopt · single-feature customers at day 30 · 127,000 in the segment",
};

export const XP09_REQUIRED_ROWS: { field: string; written: string; required: boolean; lockedOnceStarted: boolean }[] = [
  { field: "What would say it failed", written: "Second-order rate below +2 points at 21 days", required: true, lockedOnceStarted: true },
  { field: "What it will not tell you", written: "Whether the effect lasts past 90 days", required: true, lockedOnceStarted: true },
  { field: "What you expect", written: "+6 to +12 points · from the 43-point cohort gap", required: true, lockedOnceStarted: true },
  { field: "Who signs it", written: "Zainab Yusuf · owns Adopt", required: true, lockedOnceStarted: true },
  { field: "What happens if it works", written: "Written now: ship to all four markets", required: true, lockedOnceStarted: false },
];

// ───────────────────────── XP10 · NEW · 2 · THE HOLDOUT ─────────────────────────

export const XP10_SIZE_ROWS: { holdout: string; held: string; treated: string; detects: string; time: string; timeTone: ExTone; cost: string }[] = [
  { holdout: "5%", held: "5,900", treated: "112,300", detects: "4.1 points", time: "34 days", timeTone: "warn", cost: "no prompt · small" },
  { holdout: "10%", held: "11,800", treated: "106,400", detects: "2.9 points", time: "21 days", timeTone: "ok", cost: "no prompt · small" },
  { holdout: "20%", held: "23,700", treated: "94,500", detects: "2.1 points", time: "16 days", timeTone: "ok", cost: "no prompt · small" },
  { holdout: "50%", held: "59,100", treated: "59,100", detects: "1.6 points", time: "13 days", timeTone: "ok", cost: "no prompt · small" },
];

export const XP10_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "Eligible before exclusions", value: "127,000 · the segment" },
  { label: "Removed", value: "8,140 permanent, plus 9,860 in Ghana until 14 September", tone: "warn" },
  { label: "Eligible after", value: "109,000 · the holdout is drawn from these", tone: "ok" },
  { label: "Held at 10%", value: "10,900 · not 11,800 · the size follows the eligible pool", tone: "warn" },
  { label: "Effect on the answer", value: "detects 3.1 points instead of 2.9 · about two days longer", tone: "warn" },
  { label: "Raising the rate to get 11,800 back", value: "not offered · it concentrates the hold on the least protected", tone: "risk" },
];

// ───────────────────────── XP11 · NEW · 3 · REVIEW ─────────────────────────

export const XP11_REGISTERED_ROWS: { field: string; value: string; editable: string; editableTone: ExTone }[] = [
  { field: "The question", value: "Does a day-three prompt raise second orders?", editable: "no", editableTone: "risk" },
  { field: "What would say it failed", value: "Below +2 points at 21 days", editable: "no", editableTone: "risk" },
  { field: "What you expect", value: "+6 to +12 points", editable: "no", editableTone: "risk" },
  { field: "Holdout", value: "10,900 · 10% of the eligible pool", editable: "no", editableTone: "risk" },
  { field: "Duration", value: "21 days · ends 8 September", editable: "extendable, with a new signature", editableTone: "warn" },
  { field: "What happens if it works", value: "Ship to all four markets", editable: "yes · it is a plan, not a result", editableTone: "ok" },
  { field: "Signer", value: "Zainab Yusuf · re-auth required", editable: "no", editableTone: "risk" },
];

// ───────────────────────── XP12 · READABILITY ─────────────────────────

export const XP12_BARS: { label: string; note: string; percent: number; tone: ExTone }[] = [
  { label: "Kenya retry · day 9 of 9", note: "readable · +44.3 points, far past the threshold", percent: 100, tone: "ok" },
  { label: "Reactivation wave two · day 3 of 18", note: "not yet · needs 15 more days for a 2-point change", percent: 17, tone: "warn" },
  { label: "Basket prompt rerun · day 1 of 18", note: "not yet · needs 17 more days", percent: 6, tone: "warn" },
  { label: "Reactivation wave one · day 12 of 14", note: "never · the holdout was contaminated", percent: 0.1, tone: "risk" },
];

export const XP12_ROWS: { experiment: string; held: string; baseline: string; change: string; changeTone: ExTone; daysNeeded: string; daysElapsed: string; daysElapsedTone: ExTone }[] = [
  { experiment: "Reactivation wave two", held: "5,000", baseline: "9.8%", change: "2.0 pts", changeTone: "ok", daysNeeded: "18", daysElapsed: "3", daysElapsedTone: "warn" },
  { experiment: "Basket prompt rerun", held: "1,586", baseline: "1.4×", change: "2.9 pts", changeTone: "ok", daysNeeded: "18", daysElapsed: "1", daysElapsedTone: "warn" },
  { experiment: "Kenya retry window", held: "490", baseline: "24.1%", change: "8.0 pts", changeTone: "warn", daysNeeded: "9", daysElapsed: "9", daysElapsedTone: "ok" },
  { experiment: "Day-three prompt · proposed", held: "10,900", baseline: "29.1%", change: "3.1 pts", changeTone: "ok", daysNeeded: "21", daysElapsed: "—", daysElapsedTone: "muted" },
];

// ───────────────────────── XP13 · STOP EARLY (modal) ─────────────────────────

export const XP13_BASE_ROWS: { experiment: string; held: string; day: string; ends: string; state: string }[] = [
  { experiment: "Reactivation · wave two", held: "5,000", day: "3", ends: "30 Aug", state: "clean" },
  { experiment: "Basket prompt · rerun", held: "1,586", day: "1", ends: "14 Sep", state: "clean" },
];

export const XP13_STOP_PRESET = {
  subject: "Reactivation · wave two",
  subjectDetail: "Day 3 of 18 · 5,000 held · registered 13 August by Ifeoma",
  reasons: [
    { label: "The failure condition breached", sub: "not this one · it is at 10.4% against a 6% line", on: false, blocked: true },
    { label: "Somebody is being harmed", sub: "always available · nothing else is needed", on: false, blocked: false },
    { label: "The measurement is broken", sub: "contamination, a data outage, a duplicated send", on: true, blocked: false },
    { label: "It looks like it is working", sub: "not offered · this is the reason it would be stopped for", on: false, blocked: true },
  ],
  consequenceTitle: "Stopping on day three because it looks good is how a result becomes a wish",
  consequenceBody:
    "At day three the difference is 0.6 points and the experiment can detect 2.0. Stopping now would produce a number, and the number would be whatever the last three days happened to look like.",
  closingNote:
    "Harm is always a reason and needs nothing else typed. The second option has no conditions on it, no threshold and no approval. If a person believes customers are being hurt, the experiment stops and the argument happens afterwards. Every other reason on this screen requires the thing that has gone wrong to be named.",
};

// ───────────────────────── XP14 · CHANGE THE CONDITION (modal) ─────────────────────────

export const XP14_BASE_ROWS: { experiment: string; failsIf: string; written: string; breached: string }[] = [
  { experiment: "Reactivation · wave one", failsIf: "Reactivation below 6% in 14 days", written: "2 Aug", breached: "no · 11.2%" },
  { experiment: "Basket prompt · rerun", failsIf: "Basket lift below 2 points in 18 days", written: "17 Aug", breached: "no · day 1" },
];

export const XP14_CHANGE_PRESET = {
  subject: "Basket prompt · rerun",
  subjectDetail: "Registered 17 August · day 1 of 18 · signed by Tunde Bakare",
  original: "Basket lift below 2 points at 18 days",
  changedTo: "Basket lift below 1 point at 18 days",
  warningTitle: "This is allowed on day one and would not be on day twelve",
  warningBody:
    "Nothing has been observed yet, so lowering the bar cannot be a response to the data. The change is recorded with the day it was made, and any change after the first reading is refused outright rather than flagged.",
  visibleForever: [
    { label: "The original condition", sub: "2 points · with the date it was registered" },
    { label: "The change", sub: "to 1 point, on day 1, by Tunde, with this reason" },
    { label: "On the result", sub: "“condition revised before any data was read”" },
  ],
  closingNote:
    "A pre-registration that can be edited quietly is not a pre-registration. The window for changing a condition is the period before anything has been read, and it closes automatically. After that the field is not editable by anybody — not the signer, not Ada, not an administrator — because the entire value of the condition is that it was written by someone who did not yet know the answer.",
};

// ───────────────────────── XP15 · SETTINGS ─────────────────────────

export const XP15_RULE_ROWS: { rule: string; currently: string; whoSetIt: string; canChange: boolean; state: string; stateTone: ExTone }[] = [
  { rule: "A failure condition before it starts", currently: "4 running", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "An expectation, written before any data", currently: "4 running", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Conditions lock after the first reading", currently: "—", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The permanent exclusion list", currently: "8,140", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The cost of holding is published", currently: "₦8.2M", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Default holdout size", currently: "10%", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Minimum holdout size", currently: "5%", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Maximum simultaneous holds per person", currently: "2", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Preliminary results", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Stopping because it looks good", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Agents designing or signing experiments", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const XP15_KV_ROWS: { label: string; value: string; tone?: ExTone }[] = [
  { label: "Experiments closed", value: "3 · and two things that were not experiments, shown beside them", tone: "warn" },
  { label: "People held right now", value: "17,076 · receiving nothing so four numbers can be believed", tone: "warn" },
  { label: "Cost borne by held customers", value: "≈₦8.2M since January · never netted off any result", tone: "warn" },
  { label: "People permanently excluded", value: "8,140 · and the bias that creates on every causal figure", tone: "risk" },
  { label: "Experiments compromised", value: "1 of 4 · found in 14 hours by the nightly overlap check", tone: "risk" },
];

// ───────────────────────── HISTORY (no dedicated frame · grounded in the workspace's own audit-trail vocabulary) ─────────────────────────

export const EX_HISTORY_ROWS: { when: string; action: string; experiment: string; who: string; detail: string; detailTone: ExTone }[] = [
  { when: "2 Apr", action: "Closed", experiment: "Retry cards at 09:00 · NG", who: "Ravi Mehta", detail: "+45.5 points · ₦62M causal, pre-registered", detailTone: "ok" },
  { when: "9 Aug, 08:04", action: "Signed", experiment: "Kenya retry window", who: "Ravi Mehta", detail: "re-authenticated · design locked from this moment", detailTone: "ai" },
  { when: "13 Aug", action: "Signed", experiment: "Reactivation · wave two", who: "Ifeoma Nwosu", detail: "failure condition written before day one", detailTone: "ai" },
  { when: "14 Aug", action: "Result withdrawn", experiment: "Reactivation · wave one", who: "Ifeoma Nwosu", detail: "₦9.1M provisional figure withdrawn, not adjusted", detailTone: "risk" },
  { when: "15 Aug, 04:00", action: "Contamination detected", experiment: "Reactivation · wave one", who: "the overlap check", detail: "1,204 held customers reached by a direct resend", detailTone: "risk" },
  { when: "17 Aug", action: "Condition changed", experiment: "Basket prompt · rerun", who: "Tunde Bakare", detail: "2 points to 1 point, on day 1, before any data was read", detailTone: "warn" },
  { when: "today", action: "Closed", experiment: "Kenya retry window", who: "Ravi Mehta", detail: "+44.3 points · KES 1.0M causal", detailTone: "ok" },
];

// ───────────────────────── People referenced ─────────────────────────

export const EX_PEOPLE = { ADA, AMARA, IFEOMA, RAVI, TUNDE, ZAINAB };
