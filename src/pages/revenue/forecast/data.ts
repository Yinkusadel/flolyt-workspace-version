import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AMARA, IFEOMA, KUNLE, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";
import type { PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Forecast — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-forecast/flolyt-forecast/
 * (14 frames, FC01-FC14 on disk; content transcribed from the export's own
 * `fc.py` generator source, same approach as every other Revenue section).
 * Per REVENUE-GROUP.md, Forecast is the Revenue group's fourth child
 * (between Scenario and Attribution). See docs/build-tracker.md section 6c'.
 */

export type FcTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const FC_TONE_CLASS: Record<FcTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const FC_CHIP_TONE: Record<FcTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const FC_KPI_TONE: Record<FcTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same situation as every prior rebuild's empty/edge states. */
export type ForecastState = "empty" | "first" | "full";
export const FORECAST_STATE: ForecastState = "full";

export const FC_TABS = ["Next 90 days", "By stage", "By market", "Blocked", "Against actuals", "History"] as const;
export type FcTab = (typeof FC_TABS)[number];

export const FC_DETAIL_TITLES: Record<string, string> = {
  renew: "Renew · projected renewal rate",
};

// ───────────────────────── FC01 · NOTHING TO FORECAST FROM ─────────────────────────

export const FC01_ROWS: { stage: string; owner: string; ownerTone: FcTone; what: string; needs: string; ready: string; readyTone: FcTone }[] = [
  { stage: "Renew", owner: "Kunle", ownerTone: "muted", what: "Projected renewal rate, 90 days", needs: "90 days of renewal history", ready: "1 Jan", readyTone: "warn" },
  { stage: "Retain", owner: "Ifeoma", ownerTone: "muted", what: "Repeat rate, 90 days", needs: "the locked baseline", ready: "1 Jan", readyTone: "warn" },
  { stage: "Price", owner: "Ravi", ownerTone: "muted", what: "Margin", needs: "COGS · not connected", ready: "no", readyTone: "risk" },
  { stage: "Adopt", owner: "nobody", ownerTone: "risk", what: "Feature depth", needs: "an owner first", ready: "no", readyTone: "risk" },
  { stage: "Advocate", owner: "nobody", ownerTone: "risk", what: "—", needs: "the stage to exist", ready: "no", readyTone: "risk" },
];

// ───────────────────────── FC02 · THE FIRST FORECAST ─────────────────────────

export const FC02_STATS: { eyebrow: string; value: string; note: string; tone?: FcTone }[] = [
  { eyebrow: "His number", value: "88.4%", note: "90 days · signed", tone: "ai" },
  { eyebrow: "The model said", value: "87.9%", note: "kept beside it", tone: "muted" },
  { eyebrow: "What would say he is wrong", value: "below 86%", note: "written before, not after", tone: "ok" },
  { eyebrow: "Re-forecast due", value: "every 14 days", note: "next on 1 September" },
];

export const FC02_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "It goes in with his name", value: "not the team's, not the model's · one person answers for it", tone: "ai" },
  { label: "The model's figure is not deleted", value: "87.9% stays visible beside 88.4% for the whole period", tone: "ok" },
  { label: "The failure condition is written first", value: "below 86% · so it cannot be renegotiated in October", tone: "ok" },
  { label: "It cannot be revised silently", value: "a revision keeps the original and says who moved it and why", tone: "ok" },
  { label: "It is not a goal", value: "goals live in Goals · this is a prediction, not a commitment to act", tone: "warn" },
];

// ───────────────────────── FC03 · NEXT 90 DAYS ─────────────────────────

export const FC03_STATS: { eyebrow: string; value: string; note: string; tone?: FcTone }[] = [
  { eyebrow: "Stages forecast", value: "5 of 10", note: "three blocked, two unowned", tone: "warn" },
  { eyebrow: "Signed by a person", value: "5", note: "every figure has a name", tone: "ok" },
  { eyebrow: "Overdue re-forecasts", value: "1", note: "Kunle · 4 days", tone: "risk" },
  { eyebrow: "Figures the model produced alone", value: "0", note: "and there is no such state", tone: "ok" },
];

export const FC03_ROWS: {
  stage: string;
  now: string; nowTone: FcTone;
  forecast: string; forecastTone: FcTone;
  range: string;
  dependsOn: string;
  owner: string; ownerTone: FcTone;
  state: string; stateTone: FcTone;
  detailId?: string;
}[] = [
  { stage: "Retain · repeat rate", now: "27.2%", nowTone: "risk", forecast: "29.8%", forecastTone: "warn", range: "26.4 – 33.1", dependsOn: "Whether wave three is ever approved", owner: "Ifeoma", ownerTone: "muted", state: "wide", stateTone: "warn" },
  { stage: "Renew · projected", now: "89.1%", nowTone: "warn", forecast: "88.4%", forecastTone: "warn", range: "86.0 – 90.2", dependsOn: "East African card fixes holding", owner: "Kunle", ownerTone: "muted", state: "overdue", stateTone: "risk", detailId: "renew" },
  { stage: "Activate · reach value", now: "41.0%", nowTone: "risk", forecast: "41.0%", forecastTone: "risk", range: "41 – 41", dependsOn: "Flat because nothing has been decided", owner: "Zainab", ownerTone: "muted", state: "flat", stateTone: "muted" },
  { stage: "Expand · basket", now: "1.4×", nowTone: "warn", forecast: "1.5×", forecastTone: "warn", range: "1.4 – 1.7", dependsOn: "The basket prompt rerun, mid-holdout", owner: "Tunde", ownerTone: "muted", state: "measuring", stateTone: "ai" },
  { stage: "Support · tickets", now: "12.8k", nowTone: "warn", forecast: "11.2k", forecastTone: "ok", range: "10.1 – 12.4", dependsOn: "The fee complaints continuing to decay", owner: "Amara", ownerTone: "muted", state: "narrow", stateTone: "ok" },
  { stage: "Churn · monthly", now: "3.1%", nowTone: "risk", forecast: "Unavailable", forecastTone: "muted", range: "—", dependsOn: "No owner · nobody to sign a number", owner: "nobody", ownerTone: "risk", state: "unowned", stateTone: "risk" },
  { stage: "Adopt · feature depth", now: "2.1", nowTone: "risk", forecast: "Unavailable", forecastTone: "muted", range: "—", dependsOn: "No owner · nobody to sign a number", owner: "nobody", ownerTone: "risk", state: "unowned", stateTone: "risk" },
  { stage: "Price · margin", now: "Unavailable", nowTone: "muted", forecast: "Unavailable", forecastTone: "muted", range: "—", dependsOn: "COGS source missing since 12 January", owner: "Ravi", ownerTone: "muted", state: "blocked", stateTone: "risk" },
  { stage: "Ghana · all stages", now: "—", nowTone: "muted", forecast: "Unavailable", forecastTone: "muted", range: "—", dependsOn: "The fee ships there on 14 September", owner: "nobody", ownerTone: "risk", state: "known event", stateTone: "risk" },
];

// ───────────────────────── FC04 · ONE FORECAST (renew) ─────────────────────────

export const FC04_HERO = {
  label: "projected renewal · 90 days · signed by kunle ade",
  big: "88.4%",
  sub: "Committed 14 days ago. The model said 87.9% and that figure is still on this screen.",
  late: "4 days late",
  due: "due 14 August",
};

export const FC04_ROWS: { input: string; value: string; valueTone?: FcTone; source: string; confidence: string; confidenceTone: FcTone; view: string; viewTone: FcTone }[] = [
  { input: "Renewals due in the period", value: "41,200", valueTone: "num", source: "`subscriptions` · contract dates", confidence: "5 / 5", confidenceTone: "ok", view: "agrees", viewTone: "muted" },
  { input: "Base renewal rate", value: "86.1%", valueTone: "num", source: "Trailing 90 days", confidence: "5 / 5", confidenceTone: "ok", view: "agrees", viewTone: "muted" },
  { input: "Card failure recovery", value: "+2.3", valueTone: "ok", source: "The 09:00 retry, now live in Kenya", confidence: "4 / 5", confidenceTone: "ok", view: "+2.8 · he is more confident", viewTone: "warn" },
  { input: "Fee-change drag", value: "−0.5", valueTone: "warn", source: "Repeat-rate decay reaching renewal", confidence: "3 / 5", confidenceTone: "warn", view: "agrees", viewTone: "muted" },
  { input: "Peter Kariuki leaving", value: "Unavailable", valueTone: "muted", source: "Nobody has modelled account coverage", confidence: "—", confidenceTone: "muted", view: "noted, not estimated", viewTone: "warn" },
  { input: "Margin effect", value: "Unavailable", valueTone: "muted", source: "No COGS since 12 January", confidence: "—", confidenceTone: "muted", view: "blocked", viewTone: "risk" },
];

export const FC04_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "The number stays", value: "88.4% remains, with the date it was last stood behind", tone: "warn" },
  { label: "It is marked", value: "4 days late · on this screen, in Handoff, and in the digest", tone: "warn" },
  { label: "It is not extrapolated", value: "no automatic roll-forward · a stale forecast stays stale and says so", tone: "risk" },
  { label: "Who is told", value: "Kunle, on the day it went overdue · Ada, after seven days" },
  { label: "What it blocks", value: "the 90-day revenue view · one figure in the board pack", tone: "warn" },
];

// ───────────────────────── FC05 · BY MARKET ─────────────────────────

export const FC05_ROWS: { market: string; base: string; now: string; nowTone: FcTone; forecast: string; forecastTone: FcTone; range: string; owner: string; ownerTone: FcTone; state: string; stateTone: FcTone }[] = [
  { market: "Nigeria", base: "2.91M", now: "89.4%", nowTone: "warn", forecast: "88.9%", forecastTone: "warn", range: "87.1 – 90.4", owner: "Kunle", ownerTone: "muted", state: "signed", stateTone: "ai" },
  { market: "Kenya", base: "610k", now: "87.2%", nowTone: "warn", forecast: "88.1%", forecastTone: "ok", range: "85.4 – 90.8", owner: "Kunle", ownerTone: "muted", state: "signed", stateTone: "ai" },
  { market: "Ghana", base: "410k", now: "84.1%", nowTone: "risk", forecast: "Unavailable", forecastTone: "muted", range: "—", owner: "nobody", ownerTone: "risk", state: "not forecast", stateTone: "risk" },
  { market: "UK", base: "269k", now: "94.2%", nowTone: "ok", forecast: "94.0%", forecastTone: "ok", range: "92.1 – 95.2", owner: "Ravi", ownerTone: "muted", state: "signed", stateTone: "ai" },
];

export const FC05_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "They do not roll up", value: "there is no group renewal forecast · four markets, four numbers", tone: "ok" },
  { label: "They do not share a range", value: "the UK's ±1.5 points and Kenya's ±2.7 are not averaged", tone: "ok" },
  { label: "They are not weighted by revenue", value: "that would make Ghana disappear rather than appear", tone: "warn" },
  { label: "They do not carry into a currency figure", value: "a renewal rate is a rate · nothing is converted", tone: "ok" },
  { label: "Kenya's is wider on purpose", value: "610k customers and six days of retry data", tone: "warn" },
];

// ───────────────────────── FC06 · BLOCKED ─────────────────────────

export const FC06_ROWS: { forecast: string; blockedBy: string; kind: string; kindTone: FcTone; since: string; sinceTone: FcTone; who: string; asked: string; askedTone: FcTone }[] = [
  { forecast: "Price · margin", blockedBy: "No COGS source", kind: "data", kindTone: "risk", since: "12 Jan", sinceTone: "risk", who: "Sam", asked: "28 Jul", askedTone: "warn" },
  { forecast: "Churn · monthly", blockedBy: "No owner to sign it", kind: "person", kindTone: "warn", since: "214 days", sinceTone: "risk", who: "Ada", asked: "never", askedTone: "risk" },
  { forecast: "Adopt · feature depth", blockedBy: "No owner to sign it", kind: "person", kindTone: "warn", since: "214 days", sinceTone: "risk", who: "Ada", asked: "never", askedTone: "risk" },
  { forecast: "Advocate · anything", blockedBy: "The stage has never been instrumented", kind: "data", kindTone: "risk", since: "always", sinceTone: "risk", who: "nobody", asked: "never", askedTone: "risk" },
  { forecast: "Ghana · all stages", blockedBy: "A known release on 14 September", kind: "event", kindTone: "risk", since: "today", sinceTone: "warn", who: "Sam · could hold it", asked: "no", askedTone: "risk" },
];

export const FC06_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "The word Unavailable", value: "in the forecast column, on every screen it would appear", tone: "ok" },
  { label: "What is missing", value: "named · a source, a person, or a dated event", tone: "ok" },
  { label: "The current figure", value: "still shown · Churn is 3.1% today whether or not it is forecast", tone: "ok" },
  { label: "A model-only projection", value: "not offered · a projection nobody signed is not a forecast", tone: "risk" },
  { label: "Last quarter's number carried forward", value: "not offered · stale and current look identical in a chart", tone: "risk" },
];

// ───────────────────────── FC07 · AGAINST ACTUALS ─────────────────────────

export const FC07_ROWS: { period: string; stage: string; forecast: string; actual: string; actualTone: FcTone; inside: string; insideTone: FcTone; signer: string; why: string }[] = [
  { period: "Q1", stage: "Renew", forecast: "91.2%", actual: "89.4%", actualTone: "warn", inside: "no · low", insideTone: "warn", signer: "Kunle", why: "The fee change was not in the model" },
  { period: "Q1", stage: "Retain", forecast: "36.8%", actual: "27.2%", actualTone: "risk", inside: "no · low", insideTone: "risk", signer: "Ifeoma", why: "Nobody forecast a release" },
  { period: "Q1", stage: "Support", forecast: "9.1k", actual: "12.8k", actualTone: "risk", inside: "no · high", insideTone: "risk", signer: "Amara", why: "Same release, seen first here" },
  { period: "Q2", stage: "Renew", forecast: "88.9%", actual: "89.1%", actualTone: "ok", inside: "yes", insideTone: "ok", signer: "Kunle", why: "Card retry landed as expected" },
  { period: "Q2", stage: "Support", forecast: "13.4k", actual: "12.8k", actualTone: "ok", inside: "yes", insideTone: "ok", signer: "Amara", why: "Fee complaints decaying on schedule" },
  { period: "Q2", stage: "Expand", forecast: "1.6×", actual: "1.4×", actualTone: "warn", inside: "no · low", insideTone: "warn", signer: "Tunde", why: "Basket prompt effect over-estimated" },
];

export const FC07_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "Kept permanently", value: "every forecast, its range, its signer and what happened", tone: "ok" },
  { label: "Read before the next one", value: "shown when a person opens the re-forecast screen", tone: "ok" },
  { label: "Not scored", value: "there is no accuracy percentage per person and never will be", tone: "risk" },
  { label: "Not used to auto-correct", value: "no model learns from these · a person reads them and adjusts", tone: "ai" },
  { label: "What changed because of Q1", value: "release dates now appear on the forecast screen", tone: "ok" },
];

// ───────────────────────── FC08 · RE-FORECAST · 1 (what has changed) ─────────────────────────

export const FC08_ROWS: { what: string; effect: string; effectTone: FcTone; direction: string; directionTone: FcTone; source: string; inLast: string; inLastTone: FcTone }[] = [
  { what: "Kenya retry closed at 68.4%", effect: "+0.4", effectTone: "ok", direction: "up", directionTone: "ok", source: "Attribution · causal, holdout", inLast: "assumed", inLastTone: "warn" },
  { what: "Repeat rate flat for 21 weeks", effect: "−0.1", effectTone: "muted", direction: "down", directionTone: "muted", source: "Leakage map", inLast: "yes", inLastTone: "ok" },
  { what: "Peter Kariuki leaving on 22 August", effect: "Unavailable", effectTone: "muted", direction: "—", directionTone: "muted", source: "Handoff · 41 accounts", inLast: "no", inLastTone: "risk" },
  { what: "Ghana fee ships 14 September", effect: "Unavailable", effectTone: "muted", direction: "—", directionTone: "muted", source: "Release calendar", inLast: "no", inLastTone: "risk" },
  { what: "Basket prompt holdout started", effect: "0", effectTone: "muted", direction: "—", directionTone: "muted", source: "Attribution · day 1", inLast: "no", inLastTone: "muted" },
];

// ───────────────────────── FC09 · RE-FORECAST · 2 (your number) ─────────────────────────

export const FC09_MODEL = { label: "THE MODEL SAYS", value: "88.2%", note: "86.1 – 90.3 · unchanged inputs since 4 Aug" };
export const FC09_YOURS = { label: "YOUR NUMBER", value: "87.6%", note: "you are moving it down 0.6 points" };

export const FC09_ROWS: { field: string; written: string; required: boolean; kept: string }[] = [
  { field: "Which input you are moving", written: "Account coverage after 22 August", required: true, kept: "permanently" },
  { field: "Why", written: "Peter holds 41 renewals in the window and there is no cover plan yet", required: true, kept: "permanently" },
  { field: "What would say you were wrong", written: "Above 89% · it would mean coverage was never the risk", required: true, kept: "permanently" },
  { field: "When you will next look", written: "1 September · 14 days", required: true, kept: "permanently" },
  { field: "A note for whoever reads this in November", written: "optional · nobody has ever filled it in", required: false, kept: "permanently" },
];

// ───────────────────────── FC10 · AN OVERDUE RE-FORECAST (modal) ─────────────────────────

export const FC10_CONTEXT = {
  title: "Renew · projected renewal rate",
  sub: "Signed 88.4% on 31 July · re-forecast due 14 August · 4 days late",
};

export const FC10_HAPPENING: { label: string; sub: string; tone: FcTone }[] = [
  { label: "The number is still shown", sub: "88.4%, with the date it was last stood behind", tone: "warn" },
  { label: "It is marked late everywhere it appears", sub: "here, in Handoff, in the digest, in the board pack", tone: "warn" },
  { label: "Nothing is rolled forward", sub: "no automatic extension · the figure does not quietly age", tone: "ok" },
  { label: "One figure downstream is blocked", sub: "the 90-day revenue view cannot be assembled", tone: "risk" },
];

export const FC10_ACTIONS: { label: string; sub: string; on: boolean; blocked: boolean }[] = [
  { label: "Ask Kunle", sub: "he was told on 14 August · this is a second, dated ask", on: true, blocked: false },
  { label: "Take it over", sub: "you become the signer · his name stays on the July figure", on: false, blocked: false },
  { label: "Mark it not needed this cycle", sub: "with a reason · the stage shows no forecast rather than a stale one", on: false, blocked: false },
  { label: "Let the model sign it", sub: "not offered · a forecast is a person or it is nothing", on: false, blocked: true },
];

// ───────────────────────── FC11 · REVISE A SIGNED FORECAST (modal) ─────────────────────────

export const FC11_CONTEXT = {
  title: "Retain · repeat rate · 29.8%",
  sub: "Signed by Ifeoma Nwosu on 2 August · 51 days of the period remain",
  newValue: "27.9%",
  wasValue: "was 29.8% · down 1.9",
  whichInput: "Reactivation wave three. It has been held at 52,000 for nineteen days waiting on Ada, and I assumed it would run in August.",
  warningTitle: "You are revising downward because of a decision somebody else has not made",
  warningBody: "Flolyt will record that. The revision is attached to the standing-authority hold, so the cost of nineteen days of waiting appears on Ada's list rather than only in your number.",
};

// ───────────────────────── FC12 · HISTORY ─────────────────────────

export const FC12_ROWS: { stage: string; signed: string; figure: string; figureTone: FcTone; revisions: string; revisionsTone: FcTone; reason: string; signer: PersonRef }[] = [
  { stage: "Renew", signed: "31 Jul", figure: "88.4%", figureTone: "warn", revisions: "2", revisionsTone: "num", reason: "Kenya retry landing better than modelled", signer: KUNLE },
  { stage: "Retain", signed: "2 Aug", figure: "29.8%", figureTone: "warn", revisions: "1", revisionsTone: "num", reason: "Assumed wave three would run in August", signer: IFEOMA },
  { stage: "Support", signed: "28 Jul", figure: "11.2k", figureTone: "ok", revisions: "0", revisionsTone: "muted", reason: "—", signer: AMARA },
  { stage: "Expand", signed: "4 Aug", figure: "1.5×", figureTone: "warn", revisions: "1", revisionsTone: "num", reason: "Basket prompt rerun, holdout started", signer: TUNDE },
  { stage: "Activate", signed: "19 Jul", figure: "41.0%", figureTone: "risk", revisions: "3", revisionsTone: "num", reason: "Flat · nothing has been decided since April", signer: ZAINAB },
  { stage: "Renew · Q1", signed: "2 Jan", figure: "91.2%", figureTone: "muted", revisions: "0", revisionsTone: "muted", reason: "Closed · actual 89.4%, outside the range", signer: KUNLE },
];

export const FC12_KV_ROWS: { label: string; value: string; tone?: FcTone }[] = [
  { label: "Every figure, range and reason", value: "permanently · including the Q1 misses", tone: "ok" },
  { label: "Who signed and who revised", value: "with dates · a forecast always has exactly one owner", tone: "ok" },
  { label: "A per-person accuracy score", value: "never · it would make people forecast to be safe rather than right", tone: "risk" },
  { label: "A model trained on the history", value: "no · people read the record, the model does not", tone: "ai" },
  { label: "Deleting a forecast", value: "not offered · it can be closed, and closed ones stay readable", tone: "risk" },
];

// ───────────────────────── FC13 · SETTINGS ─────────────────────────

export const FC13_ROWS: { rule: string; currently: string; currentlyTone: FcTone; who: string; canChange: boolean; state: string; stateTone: FcTone }[] = [
  { rule: "Every forecast is signed by one person", currently: "5", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The model's figure is kept beside the signed one", currently: "5", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A revision must name the input that moved", currently: "7 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A failure condition is written before signing", currently: "5", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Forecasts are checked against actuals and kept", currently: "6 closed", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Re-forecast cadence", currently: "14 days", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Horizon", currently: "90 days", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "A model may sign a forecast", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Stale forecasts roll forward automatically", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Per-person forecast accuracy is scored", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "A scenario may become a forecast", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const FC13_RELATED_KV: { label: string; value: string; tone?: FcTone }[] = [
  { label: "Scenario", value: "asks what a change would be worth · cannot enter a forecast", tone: "ai" },
  { label: "Goals", value: "a commitment to act · a forecast is a prediction, and they are not the same field", tone: "ok" },
  { label: "Attribution", value: "supplies measured effects as inputs · Kenya retry moved Renew by +0.4", tone: "ok" },
  { label: "Benchmarks", value: "compares what happened · never compares against a forecast", tone: "risk" },
  { label: "Value", value: "the ledger records what moved · a forecast never enters it", tone: "ok" },
];
