import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, IFEOMA, KUNLE, PRICE_MARGIN, RAVI, REPEAT_DECAY, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Scenario — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-scenario/flolyt-scenario/ (15
 * frames, SC01-SC15). Content transcribed from the export's own `sc.py`
 * generator source, same approach as leakage map/funnel. See
 * docs/build-tracker.md section 6c.
 */

export type ScTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const SC_TONE_CLASS: Record<ScTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const SC_CHIP_TONE: Record<ScTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const SC_KPI_TONE: Record<ScTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const SC_CALLOUT_TONE: Record<ScTone, "amber" | "teal" | "rose" | "ultra" | "neutral"> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type ScenarioState = "empty" | "first" | "full";
export const SCENARIO_STATE: ScenarioState = "full";

export const SC_TABS = ["Saved", "Blocked", "Against what happened", "History"] as const;
export type ScTab = (typeof SC_TABS)[number];

export const WIZ_STEPS = ["The change", "Who it reaches", "Assumptions", "The result"] as const;

// ───────────────────────── SC01 · NO SCENARIOS YET ─────────────────────────

export const SC01_ROWS: { change: string; from: string; can: "yes" | "no"; why: string; whyTone?: ScTone }[] = [
  { change: "Reverse the delivery fee", from: "Leakage map · Retain, Activate", can: "yes", why: "—", whyTone: "muted" },
  { change: "Hold the fee from Ghana", from: "Forecast · ships 14 September", can: "yes", why: "—", whyTone: "muted" },
  { change: "Retry cards at 09:00 in Ghana", from: "Attribution · closed in NG and KE", can: "no", why: "no card volume baseline", whyTone: "warn" },
  { change: "Reprice the Ghana starter plan", from: "Leakage map · Price", can: "no", why: "no COGS since 12 January", whyTone: "risk" },
  { change: "Prompt feature depth at day 7", from: "Funnel · the 43-point cohort gap", can: "no", why: "Adopt has no owner to model for", whyTone: "risk" },
];

// ───────────────────────── SC02 · THE FIRST SCENARIO ─────────────────────────

export const SC02_STATS: { eyebrow: string; value: string; note: string; tone: ScTone }[] = [
  { eyebrow: "The answer", value: "₦188M – ₦512M", note: "90 days · NG and KE", tone: "warn" },
  { eyebrow: "Profit", value: "Unavailable", note: "no COGS since 12 Jan", tone: "muted" },
  { eyebrow: "Assumptions", value: "8", note: "three of them blocked", tone: "warn" },
  { eyebrow: "Confidence", value: "2 / 5", note: "the weakest input governs", tone: "risk" },
];

export const SC02_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "A range is the output", value: "there is no mid-point, no headline figure and no summary mode", tone: "ok" },
  { label: "Assumptions are visible before the answer", value: "step 3 of 4 · you see the inputs before you see the number", tone: "ok" },
  { label: "A blocked input blocks the figure it feeds", value: "revenue ran, profit did not", tone: "warn" },
  { label: "Nothing is auto-filled", value: "three rows read Unavailable rather than borrowing an industry number", tone: "ok" },
  { label: "It is a question, not a plan", value: "S-114 has never been acted on and cannot enter the forecast", tone: "ai" },
];

// ───────────────────────── SC03 · SAVED SCENARIOS ─────────────────────────

export type ScStatus = "open" | "waiting on Ada" | "blocked" | "it happened";

export const SC_STATUS_TONE: Record<ScStatus, ScTone> = {
  open: "ai",
  "waiting on Ada": "warn",
  blocked: "risk",
  "it happened": "ok",
};

export const SC03_ROWS: {
  id: string;
  change: string;
  range: string;
  rangeTone: ScTone;
  profit: string;
  profitTone: ScTone;
  confidence: string;
  confidenceTone: ScTone;
  status: ScStatus;
  owner: PersonRef;
  canShare?: boolean;
}[] = [
  { id: "S-114", change: "Reverse the fee · NG and KE", range: "₦188M – ₦512M", rangeTone: "warn", profit: "Unavailable", profitTone: "muted", confidence: "2 / 5", confidenceTone: "risk", status: "open", owner: ADA, canShare: true },
  { id: "S-121", change: "Hold the fee from Ghana", range: "GHS 0 – 4.1M", rangeTone: "warn", profit: "Unavailable", profitTone: "muted", confidence: "3 / 5", confidenceTone: "warn", status: "open", owner: KUNLE },
  { id: "S-131", change: "Reactivation wave three · 52,000", range: "₦31M – ₦58M", rangeTone: "warn", profit: "₦24M – ₦46M", profitTone: "num", confidence: "4 / 5", confidenceTone: "ok", status: "waiting on Ada", owner: IFEOMA },
  { id: "S-108", change: "Retry at 09:00 in Ghana", range: "Unavailable", rangeTone: "muted", profit: "Unavailable", profitTone: "muted", confidence: "—", confidenceTone: "muted", status: "blocked", owner: RAVI },
  { id: "S-097", change: "Reprice the Ghana starter plan", range: "Unavailable", rangeTone: "muted", profit: "Unavailable", profitTone: "muted", confidence: "—", confidenceTone: "muted", status: "blocked", owner: RAVI },
  { id: "S-089", change: "Stop the 20% code for full-price buyers", range: "₦18M – ₦44M", rangeTone: "muted", profit: "₦14M – ₦36M", profitTone: "muted", confidence: "4 / 5", confidenceTone: "ok", status: "it happened", owner: TUNDE },
];

export const SC03_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Not a forecast", value: "nothing here feeds the forecast, a goal or a plan", tone: "ai" },
  { label: "Not a proposal", value: "no agent produced any of these · a person opened each one" },
  { label: "Not comparable across currencies", value: "S-121 is in GHS and stays in GHS", tone: "muted" },
  { label: "Not a single number, ever", value: "every row is a range · the export carries the range too", tone: "ok" },
];

// ───────────────────────── SC04 · NEW · THE CHANGE ─────────────────────────

export const SC04_ROWS: { change: string; where: string; affects: string; affectsTone: ScTone; measured: string; measuredTone: ScTone; selected?: boolean }[] = [
  { change: "Move the delivery fee back into the subtotal", where: "NG, KE · reverses 4 March", affects: "6 stages", affectsTone: "warn", measured: "no · never reversed anywhere", measuredTone: "risk", selected: true },
  { change: "Hold the fee change from Ghana", where: "GHS · blocks the 14 Sep release", affects: "6 stages", affectsTone: "warn", measured: "no · the analogue is 151 days old", measuredTone: "warn" },
  { change: "Retry cards at 09:00 in Ghana", where: "GHS · copy of a closed room", affects: "1 stage", affectsTone: "muted", measured: "yes · ₦62M in NG, KES 1.0M in KE", measuredTone: "ok" },
  { change: "Stop the 20% code for full-price buyers", where: "All markets", affects: "2 stages", affectsTone: "muted", measured: "yes · ₦31M, closed 28 Mar", measuredTone: "ok" },
  { change: "Prompt feature depth at day seven", where: "All markets", affects: "3 stages", affectsTone: "warn", measured: "no · never run anywhere", measuredTone: "risk" },
];

export const SC04_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "The mechanism", value: "delivery fee displayed in the basket subtotal, as before 4 March" },
  { label: "Not included", value: "the fee amount · this models where it is shown, not what it costs", tone: "warn" },
  { label: "Release it would reverse", value: "2024.03.04-b · the same one on the leakage map" },
  { label: "Who would ship it", value: "Engineering · Sam Iyer · has not been asked to size it", tone: "warn" },
];

// ───────────────────────── SC05 · NEW · WHO IT REACHES ─────────────────────────

export const SC05_ROWS: { group: string; size: string; sizeTone: ScTone; inModel: "yes" | "partly" | "no"; why: string; whyTone: ScTone; effect: string; effectTone: ScTone }[] = [
  { group: "Customers who ordered since 4 March", size: "831,000", sizeTone: "num", inModel: "yes", why: "they see the new placement", whyTone: "muted", effect: "the main population", effectTone: "muted" },
  { group: "Customers who lapsed after 4 March", size: "148,000", sizeTone: "warn", inModel: "partly", why: "100,000 reachable · 48,000 not", whyTone: "warn", effect: "widens it", effectTone: "warn" },
  { group: "Guest checkout", size: "42,000", sizeTone: "warn", inModel: "no", why: "cannot be joined to a customer", whyTone: "risk", effect: "excluded from both ends", effectTone: "muted" },
  { group: "Ghana", size: "410,000", sizeTone: "num", inModel: "no", why: "never received the change", whyTone: "muted", effect: "stays a control", effectTone: "ok" },
  { group: "UK", size: "269,000", sizeTone: "num", inModel: "no", why: "never received the change", whyTone: "muted", effect: "stays a control", effectTone: "ok" },
];

export const SC_IN_MODEL_CHIP: Record<"yes" | "partly" | "no", ChipTone> = { yes: "teal", partly: "amber", no: "rose" };

// ───────────────────────── SC06 · NEW · ASSUMPTIONS ─────────────────────────

export type ScYours = "yes" | "no" | "blocked";
export const SC_YOURS_CHIP: Record<ScYours, ChipTone> = { yes: "teal", no: "rose", blocked: "rose" };

export const SC06_ROWS: { assumption: string; value: string; source: string; confidence: string; confidenceTone: ScTone; yours: ScYours }[] = [
  { assumption: "Repeat rate returns to", value: "37.4%", source: "the pre-4-March baseline", confidence: "3 / 5", confidenceTone: "warn", yours: "yes" },
  { assumption: "It returns over", value: "9 weeks", source: "how long the fall took, mirrored", confidence: "2 / 5", confidenceTone: "risk", yours: "yes" },
  { assumption: "Customers past 90 days", value: "do not return", source: "16.1% → 4.2% at the boundary", confidence: "5 / 5", confidenceTone: "ok", yours: "no" },
  { assumption: "Order value holds at", value: "₦8,420", source: "trailing 30 days", confidence: "4 / 5", confidenceTone: "ok", yours: "yes" },
  { assumption: "Checkout conversion returns to", value: "74.1%", source: "the UK is at 76.8% and did not move", confidence: "4 / 5", confidenceTone: "ok", yours: "yes" },
  { assumption: "Gross margin", value: "Unavailable", source: "no COGS source since 12 January", confidence: "—", confidenceTone: "muted", yours: "blocked" },
  { assumption: "Support cost of the change", value: "Unavailable", source: "tickets are counted, never costed", confidence: "—", confidenceTone: "muted", yours: "blocked" },
  { assumption: "Engineering cost to reverse", value: "Unavailable", source: "nobody has been asked to size it", confidence: "—", confidenceTone: "muted", yours: "blocked" },
];

// ───────────────────────── SC07 · NEW · THE RESULT ─────────────────────────

export const SC07_BARS: { label: string; sub: string; percent: number; tone: ScTone }[] = [
  { label: "Recovery curve · 9 weeks, confidence 2 of 5", sub: "±₦211M · two thirds of the whole range", percent: 67, tone: "risk" },
  { label: "Whether past-90-day customers return", sub: "±₦74M", percent: 24, tone: "warn" },
  { label: "Order value holding at ₦8,420", sub: "±₦31M", percent: 10, tone: "num" },
];

export const SC07_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Not a forecast", value: "nothing here enters the forecast or any goal · it is a question, not a plan" },
  { label: "Not a recommendation", value: "no agent proposed reversing the release · no agent could act on one either", tone: "ai" },
  { label: "Not measurable in advance", value: "the only real test is shipping it into one market and holding another", tone: "warn" },
  { label: "Shareable", value: "yes · with the assumptions attached, never as a number on its own", tone: "ok" },
  { label: "Recorded", value: "as S-114, with your name and today's date" },
];

// ───────────────────────── SC08 · ONE SCENARIO (S-114) ─────────────────────────

export const S114_STATS: { eyebrow: string; value: string; note: string; tone: ScTone }[] = [
  { eyebrow: "Range", value: "₦188M – ₦512M", note: "90 days · NG and KE", tone: "warn" },
  { eyebrow: "Modelled", value: "14 days ago", note: "by Ada Obi", tone: "neutral" },
  { eyebrow: "Assumptions changed since", value: "2", note: "by two people", tone: "warn" },
  { eyebrow: "Acted on", value: "No", note: "and it was never meant to be", tone: "muted" },
];

export const S114_TIMELINE: { when: string; what: string; who: PersonRef | AgentRef; whoKind: "human" | "agent"; effect: string; effectTone: ScTone }[] = [
  { when: "14 days ago", what: "Modelled and saved", who: ADA, whoKind: "human", effect: "₦188M – ₦512M", effectTone: "muted" },
  { when: "11 days ago", what: "Recovery window changed from 9 weeks to 14", who: ZAINAB, whoKind: "human", effect: "₦188M → ₦141M at the low end", effectTone: "warn" },
  { when: "9 days ago", what: "Order value refreshed · ₦8,420 from ₦8,190", who: PRICE_MARGIN, whoKind: "agent", effect: "+₦9M at both ends", effectTone: "muted" },
  { when: "6 days ago", what: "Ravi asked for a profit figure", who: RAVI, whoKind: "human", effect: "none · still Unavailable", effectTone: "risk" },
  { when: "6 days ago", what: "Sizing request sent to Engineering", who: ADA, whoKind: "human", effect: "unanswered · not in the range", effectTone: "warn" },
  { when: "Today", what: "Ghana ship date confirmed for 14 September", who: REPEAT_DECAY, whoKind: "agent", effect: "does not affect this scenario", effectTone: "muted" },
];

export const S114_WHERE_KV: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Board pack · not included", value: "Ravi withdrew it when the profit line stayed Unavailable", tone: "warn" },
  { label: "The Retain room", value: "attached to the decision doc as context, marked as a question" },
  { label: "Engineering", value: "with the sizing request · unanswered for six days", tone: "warn" },
  { label: "Anybody who asked for a single number", value: "told no · four times, by the export, not by a person", tone: "ok" },
];

// ───────────────────────── SC13 · TURN INTO SOMETHING base (S-131) ─────────────────────────

export const S131_STATS: { eyebrow: string; value: string; note: string; tone: ScTone }[] = [
  { eyebrow: "Range", value: "₦31M – ₦58M", note: "wave three · 52,000", tone: "warn" },
  { eyebrow: "Confidence", value: "4 / 5", note: "two waves already measured", tone: "ok" },
  { eyebrow: "Blocked by", value: "Standing authority", note: "cap is 50,000", tone: "warn" },
  { eyebrow: "Waiting", value: "19 hours", note: "≈₦1.7M", tone: "risk" },
];

export const S131_BECOME: { label: string; sub: string; on: boolean; blocked: boolean }[] = [
  { label: "Context on an existing room", sub: "attached to Second order never happened, as a question", on: true, blocked: false },
  { label: "A proposal in that room", sub: "a person proposes it · it then needs approval like any play", on: false, blocked: false },
  { label: "A play that runs", sub: "not from here · a scenario has no audience, no guardrails, no holdout", on: false, blocked: true },
  { label: "An entry in the forecast", sub: "not offered · a question is not a plan", on: false, blocked: true },
];

export const SC_DETAIL_TITLES: Record<string, string> = {
  "s-114": "S-114 · Reverse the delivery fee",
  "s-131": "S-131 · Reactivation wave three",
};

// ───────────────────────── SC09 · AGAINST WHAT HAPPENED ─────────────────────────

export const SC09_ROWS: { id: string; what: string; range: string; actual: string; actualTone: ScTone; inside: "yes" | "no · high" | "unknown"; why: string }[] = [
  { id: "S-089", what: "Stop the 20% code", range: "₦18M – ₦44M", actual: "₦31M", actualTone: "ok", inside: "yes", why: "mid · no single reason" },
  { id: "S-062", what: "Retry cards at 09:00 · NG", range: "₦34M – ₦51M", actual: "₦62M", actualTone: "warn", inside: "no · high", why: "payday effect was not modelled" },
  { id: "S-071", what: "Lagos refund and apology", range: "₦6M – ₦14M", actual: "Unavailable", actualTone: "muted", inside: "unknown", why: "no holdout was possible" },
  { id: "S-044", what: "Weekend push cadence", range: "₦9M – ₦21M", actual: "Unavailable", actualTone: "muted", inside: "unknown", why: "no holdout was possible" },
];

export const SC09_INSIDE_CHIP: Record<"yes" | "no · high" | "unknown", ChipTone> = { "yes": "teal", "no · high": "amber", unknown: "neutral" };

export const SC09_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Payday cycles matter in Nigeria and Kenya", value: "now an available input · used in S-131", tone: "ok" },
  { label: "Reactivation ranges are too narrow", value: "the 90-day boundary effect widened them by roughly a third", tone: "ok" },
  { label: "Two of four could not be scored", value: "both were interventions no holdout could be withheld from", tone: "warn" },
  { label: "Nothing is auto-tuned", value: "an input changes because a person read a miss and edited it", tone: "ai" },
];

// ───────────────────────── SC10 · BLOCKED ─────────────────────────

export const SC10_ROWS: { id: string; change: string; missing: string; blockedSince: string; blockedTone: ScTone; who: string; asked: string }[] = [
  { id: "S-097", change: "Reprice the Ghana starter plan", missing: "COGS · every repricing needs a margin denominator", blockedSince: "12 Jan", blockedTone: "risk", who: "Sam", asked: "28 Jul" },
  { id: "S-108", change: "Retry at 09:00 in Ghana", missing: "90 days of card volume history in the market", blockedSince: "always", blockedTone: "warn", who: "time", asked: "—" },
];

export const S097_KV: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Population", value: "88,000 Ghanaian starter-plan customers · ready" },
  { label: "Current price", value: "GHS 24 · a 22% premium over Nigeria, unrevised since August 2024" },
  { label: "Price sensitivity", value: "Unavailable · no test has ever been run in the market", tone: "warn" },
  { label: "Volume effect", value: "modelled · elasticity borrowed from Nigeria would be a guess", tone: "warn" },
  { label: "Margin", value: "Unavailable · this is the one that stops it", tone: "risk" },
  { label: "What it would produce without margin", value: "a revenue range for a decision that is entirely about margin", tone: "risk" },
];

// ───────────────────────── SC11 · CHANGE AN ASSUMPTION (modal) ─────────────────────────

export const SC11_PRESET = {
  current: "It returns over 9 weeks",
  currentMeta: "Confidence 2 of 5 · source: how long the fall took, mirrored",
  proposed: "14 weeks",
  was: "was 9",
  rangeEffect: [
    { label: "Low end", before: "₦188M", after: "₦141M", tone: "risk" as ScTone },
    { label: "High end", before: "₦512M", after: "₦498M", tone: "warn" as ScTone },
    { label: "Width", before: "₦324M", after: "₦357M", tone: "risk" as ScTone },
  ],
  reason: "Habits form faster than they break. Nine weeks assumes symmetry and there is no evidence for it.",
};

// ───────────────────────── SC12 · SHARE A SCENARIO (modal) ─────────────────────────

export const SC12_PRESET = {
  subject: "S-114 · Reverse the delivery fee",
  subjectDetail: "₦188M – ₦512M · profit Unavailable · confidence 2 of 5",
  travels: [
    { label: "The range, never a mid-point", sub: "both ends, always · there is no single number to send", fixed: true },
    { label: "All eight assumptions", sub: "including the three that read Unavailable", fixed: true },
    { label: "Confidence on every input", sub: "and the two that were changed since, with names", fixed: true },
    { label: "The date and who modelled it", sub: "14 days ago · Ada Obi", fixed: true },
    { label: "The change history", sub: "optional · two edits, both signed", fixed: false },
  ],
  warning: "There is no copy-as-figure, no headline export and no summary mode. A range detached from a 2-of-5 assumption is how ₦512M ends up in a slide as a plan.",
};

// ───────────────────────── SC14 · SETTINGS ─────────────────────────

export const SC14_ROWS: { rule: string; currently: string; currentlyTone: ScTone; who: string; canChange: boolean; state: string; stateTone: ScTone }[] = [
  { rule: "Results are ranges, never mid-points", currently: "6 scenarios", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Assumptions travel with every export", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Unavailable inputs block the figure they feed", currently: "3 inputs", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Scenarios that were run keep their record", currently: "4 scored", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Default horizon", currently: "90 days", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who can model a change", currently: "anyone", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Agents may open a scenario", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "A scenario may enter the forecast", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Missing inputs filled from an industry figure", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const SC14_KV_ROWS: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Every scenario", value: "permanently · including the four that were later run and scored", tone: "ok" },
  { label: "Every assumption edit", value: "with the name, the reason and the effect on the range" },
  { label: "Scenarios that turned out wrong", value: "kept and shown · S-062 was ₦11M under", tone: "warn" },
  { label: "Deleting a scenario", value: "not offered · it can be closed, and closed ones stay searchable", tone: "risk" },
];

// ───────────────────────── HISTORY (no dedicated frame in the export — built consistent with the timeline vocabulary above) ─────────────────────────

export const SC_HISTORY_ROWS: { when: string; scenario: string; what: string; who: PersonRef | AgentRef; whoKind: "human" | "agent"; effect: string; effectTone: ScTone }[] = [
  { when: "Today", scenario: "S-114", what: "Ghana ship date confirmed for 14 September", who: REPEAT_DECAY, whoKind: "agent", effect: "does not affect this scenario", effectTone: "muted" },
  { when: "6 days ago", scenario: "S-114", what: "Sizing request sent to Engineering", who: ADA, whoKind: "human", effect: "unanswered · not in the range", effectTone: "warn" },
  { when: "6 days ago", scenario: "S-114", what: "Ravi asked for a profit figure", who: RAVI, whoKind: "human", effect: "none · still Unavailable", effectTone: "risk" },
  { when: "9 days ago", scenario: "S-114", what: "Order value refreshed · ₦8,420 from ₦8,190", who: PRICE_MARGIN, whoKind: "agent", effect: "+₦9M at both ends", effectTone: "muted" },
  { when: "11 days ago", scenario: "S-114", what: "Recovery window changed from 9 weeks to 14", who: ZAINAB, whoKind: "human", effect: "₦188M → ₦141M at the low end", effectTone: "warn" },
  { when: "12 days ago", scenario: "S-131", what: "Flagged against the 50,000 standing-authority cap", who: IFEOMA, whoKind: "human", effect: "waiting on Ada · ≈₦1.7M held per 19 hours", effectTone: "warn" },
  { when: "14 days ago", scenario: "S-114", what: "Modelled and saved", who: ADA, whoKind: "human", effect: "₦188M – ₦512M", effectTone: "muted" },
  { when: "19 days ago", scenario: "S-121", what: "Modelled and saved", who: KUNLE, whoKind: "human", effect: "GHS 0 – 4.1M", effectTone: "muted" },
];

export const SC_HISTORY_KV: { label: string; value: string; tone?: ScTone }[] = [
  { label: "Every assumption edit is signed", value: "the name and typed reason travel with the scenario permanently", tone: "ok" },
  { label: "An agent can refresh a figure it owns", value: "and cannot touch an assumption a person set", tone: "ai" },
  { label: "Nothing here is auto-tuned", value: "a range moves because a person read something and changed it" },
  { label: "Scenarios are never deleted", value: "only closed · closed ones stay searchable here", tone: "muted" },
];

export const SECOND_ORDER_ROOM_HREF = "/rooms/second-order-never-happened";
