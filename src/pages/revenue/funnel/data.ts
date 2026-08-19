import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ACQUISITION_QUALITY, IFEOMA, PRICE_MARGIN, RAVI, REPEAT_DECAY, SAM, ZAINAB } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";
import { PRODUCT_REASON } from "@/pages/revenue/leakage-map/data";

/**
 * Revenue · Funnel — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-funnel/ (15 frames, FN01-FN15).
 * Content transcribed from the export's own `fn.py` generator source, same
 * approach as the leakage map build. See docs/build-tracker.md section 6b.
 */

export type FnTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const FN_TONE_CLASS: Record<FnTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const FN_CHIP_TONE: Record<FnTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const FN_BAR_TONE: Record<FnTone, BarTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const FN_KPI_TONE: Record<FnTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export type FunnelState = "not-instrumented" | "first-step" | "degraded" | "full";
/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export const FUNNEL_STATE: FunnelState = "full";

export const FN_TABS = ["The funnel", "By market", "By cohort", "Not instrumented", "Compare", "History"] as const;
export type FnTab = (typeof FN_TABS)[number];

// ───────────────────────── FN01 · NOT INSTRUMENTED YET ─────────────────────────

export const FN01_ROWS: { step: string; source: string; readable: boolean; cannotTell: string; cannotTellTone?: FnTone }[] = [
  { step: "Completed signup", source: "customers · created_at", readable: true, cannotTell: "how many started and gave up", cannotTellTone: "muted" },
  { step: "Placed first order", source: "orders · first per customer", readable: true, cannotTell: "where in checkout the rest went", cannotTellTone: "muted" },
  { step: "Ordered again in 90 days", source: "orders · second per customer", readable: true, cannotTell: "why they did not", cannotTellTone: "muted" },
  { step: "Reached checkout", source: "no event", readable: false, cannotTell: "the biggest drop in the funnel", cannotTellTone: "risk" },
  { step: "Saw the delivery fee", source: "checkout.fee_shown · never fired", readable: false, cannotTell: "whether the fee is the reason", cannotTellTone: "risk" },
];

// ───────────────────────── FN02 · THE FIRST STEP INSTRUMENTED ─────────────────────────

export const FN02_STATS: { eyebrow: string; value: string; note: string; tone: FnTone }[] = [
  { eyebrow: "New step", value: "Started signup", note: "position 2 of 8", tone: "ok" },
  { eyebrow: "First reading", value: "402,000", note: "against 318,000 completed", tone: "num" },
  { eyebrow: "Newly visible", value: "84,000", note: "a quarter, lost at signup", tone: "risk" },
  { eyebrow: "Steps still dark", value: "4", note: "the four that matter most", tone: "warn" },
];

export const FN02_KV_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "It gives one drop-off a number", value: "20.9% of people who start do not finish", tone: "ok" },
  { label: "It does not say why", value: "no field-level events · the form could be anything", tone: "warn" },
  { label: "It starts today, not in January", value: "no backfill is possible · the step has no history", tone: "risk" },
  { label: "It does not change any figure below it", value: "checkout and orders read from the orders table, untouched" },
  { label: "It closes one of five requests", value: "four remain, three of them older", tone: "warn" },
];

// ───────────────────────── FN03 · THE FUNNEL (main) ─────────────────────────

export type FunnelStepRow = { label: string; count: string; percent: number; drop: string; tone: FnTone };

export const FN03_STEPS: FunnelStepRow[] = [
  { label: "Visited", count: "1,240,000", percent: 100, drop: "—", tone: "ai" },
  { label: "Started signup", count: "402,000", percent: 32.4, drop: "−67.6%", tone: "warn" },
  { label: "Completed signup", count: "318,000", percent: 25.6, drop: "−20.9%", tone: "warn" },
  { label: "Reached checkout", count: "271,000", percent: 21.9, drop: "−14.8%", tone: "warn" },
  { label: "Saw the delivery fee", count: "Unavailable", percent: 0, drop: "not instrumented", tone: "muted" },
  { label: "Placed a first order", count: "173,000", percent: 14.0, drop: "−36.2%", tone: "risk" },
  { label: "Reached value · 2 orders in 30 days", count: "71,000", percent: 5.7, drop: "−59.0%", tone: "risk" },
  { label: "Ordered again within 90 days", count: "47,000", percent: 3.8, drop: "−33.8%", tone: "risk" },
];

export const FN03_COMPARE_ROWS: { step: string; before: string; now: string; change: string; customers: string; tone: FnTone }[] = [
  { step: "Started signup → completed", before: "79.8%", now: "79.1%", change: "−0.7", customers: "−2,800", tone: "muted" },
  { step: "Completed → reached checkout", before: "85.9%", now: "85.2%", change: "−0.7", customers: "−2,200", tone: "muted" },
  { step: "Checkout → first order", before: "74.1%", now: "63.8%", change: "−10.3", customers: "−27,900", tone: "risk" },
  { step: "First order → reached value", before: "58.0%", now: "41.0%", change: "−17.0", customers: "−29,400", tone: "risk" },
  { step: "First order → ordered again in 90 days", before: "37.4%", now: "27.2%", change: "−10.2", customers: "−17,600", tone: "risk" },
];

// ───────────────────────── FN04 · ONE STEP (checkout-to-order) ─────────────────────────

export const FN04_INSIDE_ROWS: { what: string; source: string; figure: string; figureTone: FnTone; confidence: string; confidenceTone: FnTone }[] = [
  { what: "They reached checkout", source: "checkout.opened", figure: "271,000", figureTone: "num", confidence: "5 / 5", confidenceTone: "ok" },
  { what: "They placed an order", source: "orders", figure: "173,000", figureTone: "num", confidence: "5 / 5", confidenceTone: "ok" },
  { what: "They saw the delivery fee", source: "no event exists", figure: "Unavailable", figureTone: "muted", confidence: "—", confidenceTone: "muted" },
  { what: "They saw the total change", source: "no event exists", figure: "Unavailable", figureTone: "muted", confidence: "—", confidenceTone: "muted" },
  { what: "They abandoned at the fee line", source: "no event exists", figure: "Unavailable", figureTone: "muted", confidence: "—", confidenceTone: "muted" },
  { what: "They complained about it", source: "tickets · 31% of 12,800", figure: "3,968", figureTone: "num", confidence: "4 / 5", confidenceTone: "ok" },
];

export const FN04_MARKET_ROWS: { market: string; conversion: string; conversionTone: FnTone; before: string; change: string; changeTone: FnTone; feeShipped: string; feeShippedTone: FnTone; sample: string }[] = [
  { market: "Nigeria", conversion: "63.8%", conversionTone: "risk", before: "74.1%", change: "−10.3", changeTone: "risk", feeShipped: "4 Mar", feeShippedTone: "risk", sample: "271,000" },
  { market: "Kenya", conversion: "66.2%", conversionTone: "risk", before: "75.9%", change: "−9.7", changeTone: "risk", feeShipped: "4 Mar", feeShippedTone: "risk", sample: "58,400" },
  { market: "Ghana", conversion: "71.4%", conversionTone: "warn", before: "71.9%", change: "−0.5", changeTone: "muted", feeShipped: "14 Sep", feeShippedTone: "warn", sample: "31,200" },
  { market: "UK", conversion: "76.8%", conversionTone: "ok", before: "76.4%", change: "+0.4", changeTone: "ok", feeShipped: "not scheduled", feeShippedTone: "ok", sample: "22,900" },
];

// ───────────────────────── FN05 · WHERE IT BENT (Compare) ─────────────────────────

export const FN05_WEEK_BARS: { label: string; sub: string; percent: number; tone: BarTone }[] = [
  { label: "Week of 19 Feb · before", sub: "74.3% · NG", percent: 74.3, tone: "teal" },
  { label: "Week of 26 Feb · before", sub: "74.1% · NG", percent: 74.1, tone: "teal" },
  { label: "Week of 4 March · the release", sub: "68.9% · NG", percent: 68.9, tone: "amber" },
  { label: "Week of 11 March · after", sub: "64.2% · NG", percent: 64.2, tone: "rose" },
  { label: "Week of 18 March · after", sub: "63.9% · NG", percent: 63.9, tone: "rose" },
  { label: "This week", sub: "63.8% · NG", percent: 63.8, tone: "rose" },
  { label: "This week · UK, no release", sub: "76.8%", percent: 76.8, tone: "teal" },
];

export const FN05_RULED_OUT_ROWS: { happened: string; when: string; because: string; agent: AgentRef }[] = [
  { happened: "Ramadan began", when: "10 Mar", because: "The UK and Ghana observed it too and did not move", agent: REPEAT_DECAY },
  { happened: "A competitor cut delivery fees", when: "6 Mar", because: "Nigeria only · Kenya moved identically without it", agent: ACQUISITION_QUALITY },
  { happened: "Fuel price rise", when: "1 Mar", because: "Would raise basket value · basket fell instead", agent: PRICE_MARGIN },
  { happened: "App version 4.2 shipped", when: "4 Mar", because: "Not ruled out · it is the same release", agent: PRODUCT_REASON },
];

// ───────────────────────── FN06 · BY MARKET ─────────────────────────

export const FN06_ROWS: { step: string; ng: string; ngTone: FnTone; ke: string; keTone: FnTone; gh: string; ghTone: FnTone; uk: string; ukTone: FnTone; spread: string; spreadTone: FnTone }[] = [
  { step: "Started signup", ng: "32.4%", ngTone: "num", ke: "29.1%", keTone: "num", gh: "24.2%", ghTone: "warn", uk: "41.0%", ukTone: "ok", spread: "16.8 pts", spreadTone: "warn" },
  { step: "Completed signup", ng: "79.1%", ngTone: "num", ke: "77.4%", keTone: "num", gh: "61.2%", ghTone: "risk", uk: "88.1%", ukTone: "ok", spread: "26.9 pts", spreadTone: "risk" },
  { step: "Reached checkout", ng: "85.2%", ngTone: "num", ke: "84.9%", keTone: "num", gh: "80.1%", ghTone: "warn", uk: "91.2%", ukTone: "ok", spread: "11.1 pts", spreadTone: "warn" },
  { step: "Placed a first order", ng: "63.8%", ngTone: "risk", ke: "66.2%", keTone: "risk", gh: "71.4%", ghTone: "warn", uk: "76.8%", ukTone: "ok", spread: "13.0 pts", spreadTone: "warn" },
  { step: "Reached value", ng: "41.0%", ngTone: "risk", ke: "44.1%", keTone: "risk", gh: "38.2%", ghTone: "risk", uk: "59.4%", ukTone: "ok", spread: "21.2 pts", spreadTone: "risk" },
  { step: "Ordered again", ng: "27.2%", ngTone: "risk", ke: "29.8%", keTone: "risk", gh: "22.1%", ghTone: "risk", uk: "38.9%", ukTone: "ok", spread: "16.8 pts", spreadTone: "risk" },
];

export const FN06_SAMPLE_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "Nigeria", value: "1,240,000 at the top · every step above 20,000 · all figures usable" },
  { label: "Kenya", value: "268,000 at the top · the last step is 6,900 · usable, wider intervals", tone: "muted" },
  { label: "Ghana", value: "141,000 at the top · the last step is 1,940 · treat with care", tone: "warn" },
  { label: "UK", value: "94,000 at the top · the last step is 2,100 · treat with care", tone: "warn" },
  { label: "Why no confidence intervals are drawn", value: "they would imply the sampling is the main uncertainty · it is not", tone: "muted" },
];

// ───────────────────────── FN07 · BY COHORT ─────────────────────────

export const FN07_ROWS: {
  cohort: string;
  size: string;
  sizeTone: FnTone;
  reachedValue: string;
  reachedValueTone: FnTone;
  orderedAgain: string;
  orderedAgainTone: FnTone;
  vsAverage: string;
  vsAverageTone: FnTone;
  canContact: "yes" | "never";
  canContactTone: FnTone;
}[] = [
  { cohort: "Referred by a customer", size: "124,000", sizeTone: "num", reachedValue: "68.1%", reachedValueTone: "ok", orderedAgain: "51.2%", orderedAgainTone: "ok", vsAverage: "+24.0", vsAverageTone: "ok", canContact: "yes", canContactTone: "ok" },
  { cohort: "Signed up in-app", size: "398,000", sizeTone: "num", reachedValue: "44.2%", reachedValueTone: "num", orderedAgain: "29.1%", orderedAgainTone: "num", vsAverage: "+1.9", vsAverageTone: "muted", canContact: "yes", canContactTone: "ok" },
  { cohort: "Paid social", size: "211,000", sizeTone: "num", reachedValue: "31.0%", reachedValueTone: "warn", orderedAgain: "19.4%", orderedAgainTone: "warn", vsAverage: "−7.8", vsAverageTone: "warn", canContact: "yes", canContactTone: "ok" },
  { cohort: "Guest checkout", size: "42,000", sizeTone: "warn", reachedValue: "Unavailable", reachedValueTone: "muted", orderedAgain: "Unavailable", orderedAgainTone: "muted", vsAverage: "—", vsAverageTone: "muted", canContact: "never", canContactTone: "risk" },
  { cohort: "Used two features in week one", size: "89,000", sizeTone: "num", reachedValue: "81.4%", reachedValueTone: "ok", orderedAgain: "70.2%", orderedAgainTone: "ok", vsAverage: "+43.0", vsAverageTone: "ok", canContact: "yes", canContactTone: "ok" },
  { cohort: "Used no features in week one", size: "162,000", sizeTone: "num", reachedValue: "22.1%", reachedValueTone: "risk", orderedAgain: "12.8%", orderedAgainTone: "risk", vsAverage: "−14.4", vsAverageTone: "risk", canContact: "yes", canContactTone: "ok" },
];

// ───────────────────────── FN08 · NOT INSTRUMENTED (gaps) ─────────────────────────

export const FN08_ROWS: { step: string; event: string; asked: string; overdue: string; overdueTone: FnTone; wouldSettle: string; wouldSettleTone: FnTone; owner: string }[] = [
  { step: "Reached the fee line", event: "checkout.fee_shown", asked: "6 Apr", overdue: "133 days", overdueTone: "risk", wouldSettle: "the whole argument", wouldSettleTone: "risk", owner: "Sam" },
  { step: "Abandoned at the fee line", event: "checkout.abandoned + step", asked: "6 Apr", overdue: "133 days", overdueTone: "risk", wouldSettle: "how many, and where", wouldSettleTone: "risk", owner: "Sam" },
  { step: "Saw the loyalty tier", event: "loyalty.tier_shown", asked: "Aug 2024", overdue: "367 days", overdueTone: "risk", wouldSettle: "whether tiers do anything", wouldSettleTone: "warn", owner: "Sam" },
  { step: "Started signup", event: "signup.started", asked: "11 Jul", overdue: "37 days", overdueTone: "warn", wouldSettle: "the top-of-funnel figure", wouldSettleTone: "warn", owner: "Sam" },
  { step: "Applied a discount code", event: "checkout.code_applied", asked: "never asked", overdue: "—", overdueTone: "muted", wouldSettle: "Price's whole line", wouldSettleTone: "warn", owner: "nobody" },
];

export const FN08_KV_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "The step appears in the funnel", value: "with Unavailable where the number would be", tone: "warn" },
  { label: "The gap is not interpolated", value: "no line is drawn between the two events either side", tone: "risk" },
  { label: "Nothing downstream is estimated", value: "the following step measures from the last real event" },
  { label: "The request appears in Handoff", value: "with a date, an owner and what it blocks", tone: "ok" },
  { label: "If it never arrives", value: "the step stays Unavailable indefinitely · it does not lapse quietly", tone: "risk" },
];

// ───────────────────────── FN09/FN10 · DEFINE A STEP (wizard) ─────────────────────────

export const FN09_POSITION_ROWS: { position: string; step: string; before: string; beforeTone: FnTone; after: string; afterTone: FnTone }[] = [
  { position: "4", step: "Reached checkout", before: "271,000", beforeTone: "num", after: "271,000", afterTone: "num" },
  { position: "5 · new", step: "Saw the delivery fee", before: "—", beforeTone: "muted", after: "Unavailable until the event fires", afterTone: "warn" },
  { position: "6", step: "Placed a first order", before: "173,000", beforeTone: "num", after: "173,000", afterTone: "num" },
];

export const FN09_RULE_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "One event, not a rule over several", value: "a step defined by a query drifts when the query is edited", tone: "warn" },
  { label: "It must be between two existing steps", value: "no floating steps · a funnel is an order or it is a list" },
  { label: "Its population cannot exceed the step above", value: "checked on save · a step that grows is a definition error", tone: "risk" },
  { label: "It applies to every market", value: "you cannot define a step that exists in Nigeria only", tone: "muted" },
];

export const FN10_EVENT_ROWS: { event: string; lastSeen: string; volume: string; volumeTone: FnTone; markets: string; marketsTone: FnTone; fit: string; fitTone: FnTone; selected?: boolean }[] = [
  { event: "checkout.opened", lastSeen: "2 minutes ago", volume: "271,004", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", fit: "already step 4", fitTone: "muted" },
  { event: "checkout.fee_shown", lastSeen: "never", volume: "0", volumeTone: "risk", markets: "0 of 4", marketsTone: "risk", fit: "selected", fitTone: "ai", selected: true },
  { event: "checkout.total_updated", lastSeen: "3 hours ago", volume: "18,200", volumeTone: "warn", markets: "1 of 4", marketsTone: "warn", fit: "fires on any change", fitTone: "warn" },
  { event: "order.created", lastSeen: "14 seconds ago", volume: "173,412", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", fit: "already step 6", fitTone: "muted" },
];

export const FN10_SAVE_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "The step appears immediately", value: "reading Unavailable, in position 5, in all four markets" },
  { label: "A request is created", value: "assigned to Sam Iyer · names this step as what it blocks", tone: "ok" },
  { label: "No historical backfill", value: "the step starts empty · it cannot be reconstructed from orders", tone: "risk" },
  { label: "The steps either side are unchanged", value: "271,000 and 173,000 stay exactly as they are", tone: "muted" },
  { label: "If the event never ships", value: "the step stays Unavailable · it is never removed automatically", tone: "warn" },
];

// ───────────────────────── FN11 · REQUEST INSTRUMENTATION (modal) ─────────────────────────

export const FN11_PRESET = {
  event: "checkout.fee_shown",
  eventMeta: "First asked 6 April · 133 days overdue · asked four times since",
  blocks: [
    { label: "One funnel step", value: "Saw the delivery fee · reads Unavailable in four markets", tone: "warn" as FnTone },
    { label: "One causal upgrade", value: "Activate · association → causal, if abandonment is where it is", tone: "warn" as FnTone },
    { label: "₦201M of attribution", value: "the Activate line on the leakage map", tone: "risk" as FnTone },
    { label: "One argument between three teams", value: "Product, Marketing and Engineering, running since March", tone: "risk" as FnTone },
  ],
  neededBy: [
    { label: "Before 14 September", sub: "Ghana still has no fee · after that there is no control left", on: true },
    { label: "Next sprint", sub: "the answer Sam gave in April, June and July", on: false },
    { label: "No date", sub: "not offered · a request without a date is a wish", on: false },
  ],
  closingNote:
    "Sam is not told it is urgent. He is told which funnel step, which claim and which ₦201M line stop being blocked, and that the window closes on 14 September when Ghana loses control status. Four previous requests are attached, so the age of this is visible without being scored.",
};

// ───────────────────────── FN12 · HISTORY ─────────────────────────

export const FN12_ROWS: { change: string; step: string; when: string; effect: string; effectTone: FnTone; who: PersonRef }[] = [
  { change: "Step added", step: "Saw the delivery fee", when: "today", effect: "none · reads Unavailable", effectTone: "warn", who: ZAINAB },
  { change: "Definition narrowed", step: "Reached value · 2 orders in 30 days", when: "11 Jul", effect: "58.0% → 54.1% retroactively", effectTone: "risk", who: IFEOMA },
  { change: "Cohort excluded", step: "Guest checkout removed from denominators", when: "2 Jul", effect: "every step +0.4 to +1.1", effectTone: "warn", who: IFEOMA },
  { change: "Step removed", step: "Saw the loyalty tier", when: "6 Apr", effect: "none · never fired", effectTone: "muted", who: ZAINAB },
  { change: "Baseline locked", step: "All steps", when: "1 Jan", effect: "everything measures from here", effectTone: "ok", who: RAVI },
];

export const FN12_KV_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "Old figures are not rewritten silently", value: "both definitions are kept · charts mark the changeover", tone: "ok" },
  { label: "Every export carries the definition", value: "and the date it was last changed", tone: "ok" },
  { label: "Comparing across a change", value: "allowed, and labelled on the chart itself", tone: "warn" },
  { label: "Who can change a definition", value: "the stage owner · Ifeoma for Retain, Zainab for Activate" },
  { label: "How often it has happened", value: "four times since January · all four are above", tone: "muted" },
];

// ───────────────────────── FN13 · WHAT COUNTS AS A STEP (settings) ─────────────────────────

export const FN13_RULE_ROWS: { rule: string; currently: string; currentlyTone: FnTone; who: string; canChange: boolean; state: string; stateTone: FnTone }[] = [
  { rule: "A step must map to exactly one event", currently: "8 steps", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Steps with no event read Unavailable", currently: "5 steps", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Missing steps are interpolated", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Definition changes are logged separately", currently: "5 changes", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Window for “reached value”", currently: "30 days", currentlyTone: "neutral", who: "Ifeoma", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Window for “ordered again”", currently: "90 days", currentlyTone: "neutral", who: "Ifeoma", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Guest checkout in the denominator", currently: "excluded", currentlyTone: "warn", who: "Ifeoma", canChange: true, state: "off", stateTone: "neutral" },
  { rule: "Markets shown side by side, never summed", currently: "4", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
];

export const FN13_REFUSE_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "Draw a line through a missing step", value: "the gap is drawn as a gap", tone: "risk" },
  { label: "Rank steps by how much they lose", value: "shown in order, not sorted by drop · the order is the funnel", tone: "muted" },
  { label: "Produce a single conversion figure", value: "1.24M to 47,000 is 3.8% and means almost nothing", tone: "risk" },
  { label: "Combine markets", value: "four funnels, side by side, always", tone: "ok" },
  { label: "Estimate the guest-checkout cohort", value: "42,000 people · counted, never modelled", tone: "risk" },
];

// ───────────────────────── FN14 · DEGRADED ─────────────────────────

export const FN14_STEPS: FunnelStepRow[] = [
  { label: "Visited", count: "1,240,000", percent: 100, drop: "—", tone: "ai" },
  { label: "Started signup", count: "402,000", percent: 32.4, drop: "−67.6%", tone: "warn" },
  { label: "Completed signup", count: "318,000", percent: 25.6, drop: "−20.9%", tone: "warn" },
  { label: "Reached checkout", count: "Unavailable", percent: 0, drop: "stream down 04:12", tone: "muted" },
  { label: "Placed a first order", count: "Unavailable", percent: 0, drop: "depends on the step above", tone: "muted" },
  { label: "Reached value · 2 orders in 30 days", count: "71,000", percent: 5.7, drop: "from orders · unaffected", tone: "ai" },
  { label: "Ordered again within 90 days", count: "47,000", percent: 3.8, drop: "from orders · unaffected", tone: "ai" },
];

export const FN14_KV_ROWS: { label: string; value: string; tone?: FnTone }[] = [
  { label: "Started", value: "04:12 today · 6 hours 41 minutes ago", tone: "risk" },
  { label: "Noticed by", value: "the pipeline, at 04:14 · nobody had to spot a strange number", tone: "ok" },
  { label: "Who is on it", value: "Sam Iyer · acknowledged 07:30", tone: "muted" },
  { label: "What is not affected", value: "everything sourced from orders and tickets", tone: "ok" },
  { label: "What happens on recovery", value: "the two steps backfill from the stream · today's figures are marked partial", tone: "warn" },
];

// ───────────────────────── Funnel step detail titles (for tabs.tsx + app-layout breadcrumb) ─────────────────────────

export const FUNNEL_STEP_TITLES: Record<string, string> = {
  "checkout-to-order": "Reached checkout → placed a first order",
};

export const SAM_REF = SAM;
