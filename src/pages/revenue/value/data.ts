import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, AMARA, KUNLE, RAVI, SAM } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Value — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-value/flolyt-value/ (20 frames,
 * VL01-VL20). Content transcribed from the export's own `vl.py` generator
 * source, same approach as leakage map/funnel/scenario/attribution. Screen
 * numbers below follow the generator's actual save-call order (which is what
 * renumbers the files on disk), not the literal strings passed to `S.save`.
 */

export type VlTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const VL_TONE_CLASS: Record<VlTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const VL_CHIP_TONE: Record<VlTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const VL_TONE_BG_CLASS: Record<VlTone, string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-4",
  num: "bg-ink-4",
};

export const VL_KPI_TONE: Record<VlTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type ValueState = "empty" | "first" | "full";
export const VALUE_STATE: ValueState = "full";

/** Scoped to /value/reconciliation only — VL11's degraded/held edge case, wired but unreachable with the default. */
export type ReconciliationState = "clean" | "broken";
export const RECONCILIATION_STATE: ReconciliationState = "clean";

export const VL_TABS = ["The ledger", "By market", "By room", "What it cost", "Reconciliation", "For the board"] as const;
export type VlTab = (typeof VL_TABS)[number];

export const VL_ROOM_DETAIL_TITLES: Record<string, string> = {
  "8a1f": "Cards failing on renewal night",
};

// ───────────────────────── VL01 · NOTHING RECOVERED YET ─────────────────────────

export const VL01_ROWS: {
  room: string;
  atRisk: string;
  atRiskTone: VlTone;
  open: string;
  howMeasured: string;
  willProduce: string;
  willProduceTone: VlTone;
}[] = [
  { room: "Cards failing on renewal night", atRisk: "₦88M", atRiskTone: "warn", open: "9 days", howMeasured: "Holdout · 10% left on midnight retry", willProduce: "yes", willProduceTone: "ok" },
  { room: "Discount-only buyers", atRisk: "₦46M", atRiskTone: "warn", open: "14 days", howMeasured: "Holdout · 10% still offered the code", willProduce: "yes", willProduceTone: "ok" },
  { room: "Lagos delivery failures", atRisk: "₦9M", atRiskTone: "muted", open: "27 days", howMeasured: "Nothing withheld · Amara refused", willProduce: "no", willProduceTone: "risk" },
  { room: "Second order never happened", atRisk: "₦412M", atRiskTone: "risk", open: "2 days", howMeasured: "Holdout planned · not yet designed", willProduce: "not yet", willProduceTone: "warn" },
];

// ───────────────────────── VL02 · THE FIRST RECOVERY ─────────────────────────

export const VL02_STATS: { eyebrow: string; value: string; note: string; tone: VlTone }[] = [
  { eyebrow: "Money returned", value: "₦9M", note: "3,100 orders", tone: "ok" },
  { eyebrow: "Attributable", value: "No", note: "nothing was withheld", tone: "muted" },
  { eyebrow: "In the ledger", value: "Yes", note: "as money that moved", tone: "ok" },
  { eyebrow: "In the causal total", value: "No", note: "and never will be", tone: "muted" },
];

export const VL02_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "It records money that moved", value: "not money that was proven to have moved because of us", tone: "ok" },
  { label: "It records how each figure was measured", value: "in the row, not in a methods note", tone: "ok" },
  { label: "It keeps the two apart", value: "₦9M unmeasurable will never be added to a holdout figure", tone: "ok" },
  { label: "It does not reward measurability", value: "a room that could not be measured still closes and still counts", tone: "ok" },
  { label: "It does not credit a person", value: "not Amara, not Support · the credit field takes a metric" },
];

// ───────────────────────── VL03 · THE LEDGER ─────────────────────────

export const VL03_STATS: { eyebrow: string; value: string; note: string; tone: VlTone }[] = [
  { eyebrow: "Recovered · Nigeria", value: "₦411M", note: "31 rooms closed", tone: "ok" },
  { eyebrow: "Kenya", value: "KES 18.2M", note: "7 rooms", tone: "ok" },
  { eyebrow: "Ghana", value: "GHS 1.4M", note: "2 rooms", tone: "warn" },
  { eyebrow: "UK", value: "£61k", note: "1 room", tone: "ok" },
];

export const VL03_LEDGER_ROWS: {
  room: string;
  closed: string;
  atRisk: string;
  atRiskTone: VlTone;
  recovered: string;
  recoveredTone: VlTone;
  howMeasured: string;
  strength: string;
  strengthTone: VlTone;
  creditedTo: string;
  restatable?: boolean;
}[] = [
  { room: "Cards failing on renewal night", closed: "2 Apr", atRisk: "₦88M", atRiskTone: "warn", recovered: "₦62M", recoveredTone: "ok", howMeasured: "Holdout · 10%", strength: "causal", strengthTone: "ai", creditedTo: "Involuntary churn" },
  { room: "Discount-only buyers", closed: "28 Mar", atRisk: "₦46M", atRiskTone: "warn", recovered: "₦31M", recoveredTone: "ok", howMeasured: "Holdout · 10%", strength: "causal", strengthTone: "ai", creditedTo: "Net revenue" },
  { room: "Onboarding email rewrite", closed: "19 Feb", atRisk: "₦240M", atRiskTone: "risk", recovered: "₦188M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn", creditedTo: "Activation", restatable: true },
  { room: "Basket prompt at checkout", closed: "5 Feb", atRisk: "₦96M", atRiskTone: "risk", recovered: "₦72M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn", creditedTo: "Expansion" },
  { room: "Twelve smaller rooms", closed: "Jan–Jul", atRisk: "₦61M", atRiskTone: "warn", recovered: "₦37M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn", creditedTo: "six metrics" },
  { room: "Lagos delivery failures", closed: "21 Mar", atRisk: "₦9M", atRiskTone: "muted", recovered: "₦9M", recoveredTone: "muted", howMeasured: "Nothing withheld", strength: "unmeasurable", strengthTone: "neutral", creditedTo: "90-day repeat" },
  { room: "Weekend push fatigue", closed: "17 Mar", atRisk: "₦12M", atRiskTone: "muted", recovered: "₦12M", recoveredTone: "muted", howMeasured: "No holdout was possible", strength: "unmeasurable", strengthTone: "neutral", creditedTo: "—" },
  { room: "Second order never happened", closed: "Open", atRisk: "₦412M", atRiskTone: "risk", recovered: "—", recoveredTone: "muted", howMeasured: "Holdout planned · 10%", strength: "—", strengthTone: "neutral", creditedTo: "90-day repeat" },
];

export const VL03_WONT_DO_KV: { label: string; value: string; tone?: VlTone }[] = [
  { label: "Attribute a recovery to a person", value: "never · the credit field takes a metric and rejects a name", tone: "ok" },
  { label: "Annualise anything", value: "not offered · 41 rooms across 151 days is not a run rate", tone: "risk" },
  { label: "Absorb the unmeasurable rows", value: "₦21M · listed here, excluded from every causal figure", tone: "warn" },
  { label: "Net off what the work cost", value: "shown separately · a net figure hides both halves", tone: "muted" },
];

// ───────────────────────── VL04 · BY MARKET ─────────────────────────

export const VL04_ROWS: {
  market: string;
  rooms: string;
  recovered: string;
  recoveredTone: VlTone;
  holdout: string;
  holdoutTone: VlTone;
  weaker: string;
  weakerTone: VlTone;
  unmeasurable: string;
  unmeasurableTone: VlTone;
  share: string;
}[] = [
  { market: "Nigeria", rooms: "31 closed · 9 open", recovered: "₦411M", recoveredTone: "ok", holdout: "₦93M", holdoutTone: "ok", weaker: "₦297M", weakerTone: "warn", unmeasurable: "₦21M", unmeasurableTone: "warn", share: "2.91M" },
  { market: "Kenya", rooms: "7 closed · 1 open", recovered: "KES 18.2M", recoveredTone: "ok", holdout: "KES 1.0M", holdoutTone: "ok", weaker: "KES 17.2M", weakerTone: "warn", unmeasurable: "KES 0", unmeasurableTone: "muted", share: "610k" },
  { market: "Ghana", rooms: "2 closed · 1 unowned", recovered: "GHS 1.4M", recoveredTone: "warn", holdout: "GHS 0", holdoutTone: "risk", weaker: "GHS 1.4M", weakerTone: "warn", unmeasurable: "GHS 380k", unmeasurableTone: "warn", share: "410k" },
  { market: "UK", rooms: "1 closed", recovered: "£61k", recoveredTone: "ok", holdout: "£61k", holdoutTone: "ok", weaker: "£0", weakerTone: "muted", unmeasurable: "£0", unmeasurableTone: "muted", share: "269k" },
];

export const VL04_GHANA_KV: { label: string; value: string; tone?: VlTone }[] = [
  { label: "Recovered", value: "GHS 1.4M across two rooms · neither had a holdout", tone: "warn" },
  { label: "Unmeasurable", value: "GHS 380k · Accra ran before the market had a baseline", tone: "warn" },
  { label: "Why no holdouts", value: "no repeat-rate baseline until 90 days of history exists", tone: "risk" },
  { label: "The unowned room", value: "eleven days · nobody has been named to it", tone: "risk" },
  { label: "What happens on 14 September", value: "the fee ships · Ghana stops being a control for every other market", tone: "risk" },
];

// ───────────────────────── VL05 · BY ROOM ─────────────────────────

export const VL05_ROWS: {
  howEnded: string;
  rooms: string;
  recovered: string;
  recoveredTone: VlTone;
  meaning: string;
  example: string;
}[] = [
  { howEnded: "Measured against a holdout", rooms: "3", recovered: "₦93M", recoveredTone: "ok", meaning: "A causal figure · the strongest thing here", example: "Retry cards at 09:00" },
  { howEnded: "Measured against before and after", rooms: "14", recovered: "₦297M", recoveredTone: "warn", meaning: "Real money, weaker evidence, marked as such", example: "Onboarding rewrite" },
  { howEnded: "Closed as unmeasurable", rooms: "3", recovered: "₦21M", recoveredTone: "muted", meaning: "Money moved · nothing can be claimed", example: "Lagos refund" },
  { howEnded: "Closed with nothing to recover", rooms: "15", recovered: "₦0", recoveredTone: "muted", meaning: "The condition resolved, or never held", example: "Weekend fatigue · KE" },
  { howEnded: "Closed because it was the wrong room", rooms: "6", recovered: "₦0", recoveredTone: "muted", meaning: "Reopened elsewhere · the work moved", example: "Basket size · Q1" },
];

export const VL05_TIME_KV: { label: string; value: string; tone?: VlTone }[] = [
  { label: "Fastest", value: "9 days · Retry cards at 09:00, the one with the cleanest holdout", tone: "ok" },
  { label: "Slowest", value: "94 days · Basket size, which was the wrong room for most of it", tone: "warn" },
  { label: "Median", value: "31 days" },
  { label: "Still open past 60 days", value: "2 · both have named owners and stated reasons", tone: "warn" },
  { label: "Closed automatically by age", value: "none · a room is closed by a person or it stays open", tone: "ok" },
];

// ───────────────────────── VL06 · ONE ROOM, END TO END (rooms/8a1f) ─────────────────────────

export const VL06_STATS: { eyebrow: string; value: string; note: string; tone: VlTone }[] = [
  { eyebrow: "At risk when it opened", value: "₦88M", note: "24 March", tone: "warn" },
  { eyebrow: "Recovered", value: "₦62M", note: "measured on a holdout", tone: "ok" },
  { eyebrow: "Not recovered", value: "₦26M", note: "and the reason is known", tone: "warn" },
  { eyebrow: "What it cost to find out", value: "₦6.9M", note: "borne by 2,140 held customers", tone: "warn" },
];

export const VL06_TIMELINE: {
  when: string;
  what: string;
  figure: string;
  figureTone: VlTone;
  who: { kind: "agent"; ref: AgentRef } | { kind: "human"; ref: PersonRef };
}[] = [
  { when: "19 Mar", what: "Involuntary Churn flags failures clustering at midnight", figure: "₦88M at risk", figureTone: "warn", who: { kind: "agent", ref: { initials: "IC", name: "Involuntary Churn" } } },
  { when: "24 Mar", what: "Room opened · holdout designed and failure condition written", figure: "—", figureTone: "muted", who: { kind: "human", ref: RAVI } },
  { when: "24 Mar", what: "Approved with re-auth · 09:12", figure: "21,400 treated", figureTone: "num", who: { kind: "human", ref: RAVI } },
  { when: "27 Mar", what: "Recovery at 68% · above the 40% failure line", figure: "on track", figureTone: "ok", who: { kind: "agent", ref: { initials: "IC", name: "Involuntary Churn" } } },
  { when: "2 Apr", what: "Closed · 70.5% against 25.0% held", figure: "₦62M", figureTone: "ok", who: { kind: "human", ref: RAVI } },
  { when: "9 Apr", what: "Overlap with Nairobi dunning subtracted", figure: "−KES 0.4M", figureTone: "muted", who: { kind: "human", ref: RAVI } },
  { when: "Today", what: "Reused in Kenya · closing, day 9 of 9", figure: "KES 1.0M attributable", figureTone: "ok", who: { kind: "human", ref: RAVI } },
];

export const VL06_PLAYS_ROWS: {
  play: string;
  audience: string;
  holdout: string;
  approvedBy: string;
  where: string;
}[] = [
  { play: "Retry at 09:00 local · Nigeria", audience: "19,260", holdout: "2,140", approvedBy: "Ravi · re-auth 09:12", where: "Room 8a1f" },
  { play: "Retry at 09:00 local · Kenya", audience: "4,410", holdout: "490", approvedBy: "Ravi · re-auth 08:04", where: "Room 8a1f" },
  { play: "Failed-card notice", audience: "21,400", holdout: "—", approvedBy: "Ravi · re-auth 09:12", where: "Room 8a1f" },
];

export const VL06_OTHER_KV: { label: string; value: string; tone?: VlTone }[] = [
  { label: "A reusable design", value: "the 09:00 window · running in Kenya, blocked in Ghana", tone: "ok" },
  { label: "A written failure condition", value: "the first one in the workspace · now required on every holdout", tone: "ok" },
  { label: "A known cost", value: "₦6.9M of recovery withheld from 2,140 people, published", tone: "warn" },
  { label: "An unanswered question", value: "why cards fail at midnight at all · never asked", tone: "warn" },
];

// ───────────────────────── VL07 · WHAT IT COST ─────────────────────────

export const VL07_ROWS: {
  cost: string;
  amount: string;
  amountTone: VlTone;
  what: string;
  known: boolean;
  who: string;
  whoTone?: VlTone;
}[] = [
  { cost: "Discount and offer value given away", amount: "₦47M", amountTone: "warn", what: "Codes, credits and free delivery inside plays", known: true, who: "Finance" },
  { cost: "Message sending", amount: "₦18M", amountTone: "warn", what: "Push, SMS and email across 41 rooms", known: true, who: "Marketing" },
  { cost: "Recovery withheld from holdouts", amount: "₦8.2M", amountTone: "warn", what: "What held customers lost so the rest could be measured", known: true, who: "this section" },
  { cost: "Refunds issued", amount: "₦9M", amountTone: "muted", what: "Lagos · returned, not spent", known: true, who: "Finance" },
  { cost: "Engineering time", amount: "Unavailable", amountTone: "muted", what: "Nobody has been asked to size any of it", known: false, who: "nobody", whoTone: "risk" },
  { cost: "Support cost of the plays", amount: "Unavailable", amountTone: "muted", what: "Tickets are counted, never costed", known: false, who: "nobody", whoTone: "risk" },
  { cost: "Cost of goods on recovered orders", amount: "Unavailable", amountTone: "muted", what: "No COGS source since 12 January", known: false, who: "Sam", whoTone: "warn" },
];

export const VL07_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "What it is", value: "₦8.2M of recovery withheld from customers in holdouts", tone: "warn" },
  { label: "Who bore it", value: "2,140 on the card retry · 490 in Kenya · 15,000 in reactivation", tone: "warn" },
  { label: "What it bought", value: "₦93M of causal figures instead of ₦93M of association", tone: "ok" },
  { label: "Whether it was worth it", value: "not a question the ledger answers · both numbers are printed" },
  { label: "Who could reduce it", value: "Ada · the default holdout size is hers", tone: "muted" },
];

// ───────────────────────── VL08 · UNMEASURABLE ─────────────────────────

export const VL08_ROWS: {
  room: string;
  amount: string;
  amountTone: VlTone;
  why: string;
  avoidable: string;
  avoidableTone: VlTone;
  rule: string;
}[] = [
  { room: "Lagos refund and apology", amount: "₦9M", amountTone: "warn", why: "Amara refused to withhold an apology from 310 people", avoidable: "no", avoidableTone: "ok", rule: "none · and none needed" },
  { room: "Weekend push fatigue", amount: "₦12M", amountTone: "warn", why: "The cadence changed for everyone at once", avoidable: "yes", avoidableTone: "warn", rule: "hold a group before changing cadence" },
  { room: "Accra reactivation", amount: "GHS 380k", amountTone: "warn", why: "Ran before Ghana had a repeat-rate baseline", avoidable: "yes", avoidableTone: "warn", rule: "no plays before a baseline locks" },
];

export const VL08_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "It stays in the ledger", value: "as a row, with the reason attached, permanently", tone: "ok" },
  { label: "It never enters a causal total", value: "₦93M excludes all of it, in every export", tone: "ok" },
  { label: "It is counted separately", value: "₦21M plus GHS 380k · never inside another figure", tone: "warn" },
  { label: "The room still closes", value: "closing is not conditional on producing a number", tone: "ok" },
  { label: "Deleting the row", value: "not offered · a removed row and one that never ran look identical", tone: "risk" },
  { label: "Restating it later", value: "allowed if a method appears · the original entry is kept", tone: "muted" },
];

// ───────────────────────── VL09 · VALUE OVER TIME ─────────────────────────

export const VL09_BARS: { label: string; sub: string; percent: number; tone: VlTone }[] = [
  { label: "Identified · realised loss", sub: "₦1.08B across eight stages", percent: 100, tone: "risk" },
  { label: "Recovered · all methods", sub: "₦411M · 38% of what was found", percent: 38, tone: "warn" },
  { label: "Recovered on a holdout", sub: "₦93M · 9% of what was found", percent: 9, tone: "ok" },
  { label: "Still at risk in open rooms", sub: "₦512M · mostly one room", percent: 47, tone: "warn" },
  { label: "Cannot be measured either way", sub: "₦95M-equivalent · found and recovered", percent: 9, tone: "muted" },
];

export const VL09_MONTH_ROWS: {
  month: string;
  closed: string;
  recovered: string;
  holdout: string;
  identified: string;
  identifiedTone: VlTone;
  ratio: string;
  ratioTone: VlTone;
}[] = [
  { month: "January", closed: "4", recovered: "₦21M", holdout: "₦0", identified: "₦96M", identifiedTone: "warn", ratio: "0.22", ratioTone: "warn" },
  { month: "February", closed: "9", recovered: "₦260M", holdout: "₦0", identified: "₦214M", identifiedTone: "warn", ratio: "1.21", ratioTone: "warn" },
  { month: "March", closed: "11", recovered: "₦52M", holdout: "₦31M", identified: "₦402M", identifiedTone: "risk", ratio: "0.13", ratioTone: "risk" },
  { month: "April", closed: "8", recovered: "₦62M", holdout: "₦62M", identified: "₦188M", identifiedTone: "warn", ratio: "0.33", ratioTone: "num" },
  { month: "May to July", closed: "9", recovered: "₦16M", holdout: "₦0", identified: "₦180M", identifiedTone: "warn", ratio: "0.09", ratioTone: "risk" },
];

// ───────────────────────── VL10 / VL11 · RECONCILIATION ─────────────────────────

export const VL10_STATS: { eyebrow: string; value: string; note: string; tone: VlTone }[] = [
  { eyebrow: "This ledger says", value: "₦411M", note: "41 closed rooms", tone: "ok" },
  { eyebrow: "Finance recognises", value: "₦386M", note: "same period", tone: "warn" },
  { eyebrow: "Difference", value: "₦25M", note: "explained, line by line", tone: "warn" },
  { eyebrow: "Unexplained", value: "₦0", note: "as of this morning", tone: "ok" },
];

export const VL10_ROWS: {
  difference: string;
  amount: string;
  amountTone: VlTone;
  why: string;
  whoIsRight: string;
  willClose: string;
  willCloseTone: VlTone;
}[] = [
  { difference: "Orders placed, not yet delivered", amount: "₦14M", amountTone: "warn", why: "Finance recognises on delivery · this ledger counts the order", whoIsRight: "Finance", willClose: "never", willCloseTone: "ok" },
  { difference: "Refunds after the room closed", amount: "₦6M", amountTone: "warn", why: "Returned in the following period", whoIsRight: "Finance", willClose: "timing", willCloseTone: "ok" },
  { difference: "Overlap subtracted here, not there", amount: "₦4M", amountTone: "muted", why: "Finance sees the gross figure from two rooms", whoIsRight: "this ledger", willClose: "in progress", willCloseTone: "warn" },
  { difference: "Kenya conversion timing", amount: "₦1M", amountTone: "muted", why: "Finance converts at month end · this ledger never converts", whoIsRight: "neither", willClose: "by design", willCloseTone: "ok" },
];

export const VL10_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "When", value: "every morning at 06:00 · against the bank settlement file" },
  { label: "What happens if a difference cannot be explained", value: "the ledger shows it as unexplained and nothing is published", tone: "risk" },
  { label: "Longest it has ever been unexplained", value: "3 days in February · the onboarding figure, since restated", tone: "warn" },
  { label: "Who signs it", value: "Ravi Mehta · the ledger does not sign itself", tone: "ok" },
  { label: "What the board pack carries", value: "both figures, and this table", tone: "ok" },
];

export const VL11_STATS: { eyebrow: string; value: string; note: string; tone: VlTone }[] = [
  { eyebrow: "This ledger would say", value: "₦411M", note: "computed, not published", tone: "muted" },
  { eyebrow: "Finance file shows", value: "₦367M", note: "truncated · 3 days missing", tone: "risk" },
  { eyebrow: "Unexplained", value: "₦19M", note: "the first time since February", tone: "risk" },
  { eyebrow: "Last figure anybody can quote", value: "yesterday", note: "17 Aug · marked as such", tone: "warn" },
];

export const VL11_SURFACE_ROWS: {
  surface: string;
  state: string;
  stateTone: VlTone;
  why: string;
  who: string;
}[] = [
  { surface: "The board pack", state: "blocked", stateTone: "risk", why: "It cannot carry an unexplained difference", who: "Ravi, at 06:04" },
  { surface: "The ledger total", state: "held", stateTone: "risk", why: "Shows yesterday's figure, dated, not today's", who: "everyone" },
  { surface: "Individual room figures", state: "fine", stateTone: "ok", why: "Each room's own measurement is unaffected", who: "nobody · nothing changed" },
  { surface: "The leakage map", state: "fine", stateTone: "ok", why: "Identified loss does not depend on settlement", who: "nobody" },
  { surface: "Attribution", state: "fine", stateTone: "ok", why: "Holdout differences do not depend on settlement", who: "nobody" },
  { surface: "Exports already sent", state: "stale", stateTone: "warn", why: "Three downloads carry 17 August figures", who: "recipients, automatically" },
];

export const VL11_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "Cause", value: "settlement file truncated · three days missing · not a Flolyt fault", tone: "muted" },
  { label: "Re-requested", value: "06:11 · automatically · from the bank feed", tone: "ok" },
  { label: "Owner", value: "Ravi Mehta · acknowledged 06:40" },
  { label: "If it is not resolved today", value: "the ledger stays held · it does not degrade to an estimate", tone: "risk" },
  { label: "What will not happen", value: "no partial publication, no interpolation, no rounding to hide it", tone: "ok" },
];

// ───────────────────────── VL12 · FOR THE BOARD ─────────────────────────

export const VL12_ROWS: {
  included: string;
  why: string;
  optional: string;
  optionalTone: VlTone;
  format: string;
}[] = [
  { included: "Four currency figures, never summed", why: "There is no single number and there will not be one", optional: "no", optionalTone: "risk", format: "all" },
  { included: "The method beside every figure", why: "₦93M causal and ₦297M association are different claims", optional: "no", optionalTone: "risk", format: "all" },
  { included: "The three unmeasurable rows", why: "₦21M moved and cannot be claimed", optional: "no", optionalTone: "risk", format: "all" },
  { included: "The identified figure alongside", why: "₦1.08B found against ₦411M recovered", optional: "no", optionalTone: "risk", format: "all" },
  { included: "The reconciliation table", why: "Finance sees ₦386M · the difference is explained", optional: "yes", optionalTone: "ok", format: "PDF" },
  { included: "Cost of the holdouts", why: "₦8.2M withheld from customers to produce the evidence", optional: "yes", optionalTone: "ok", format: "PDF, CSV" },
  { included: "A net figure", why: "Three cost categories are Unavailable", optional: "never", optionalTone: "risk", format: "—" },
  { included: "A quarter-on-quarter trend", why: "Two quarters of data, one definition change", optional: "never", optionalTone: "risk", format: "—" },
];

export const VL12_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "Sent", value: "14 August · Ravi Mehta · PDF · 11 recipients" },
  { label: "Changed since", value: "one figure restated · the ₦188M onboarding row, method corrected", tone: "warn" },
  { label: "Recipients notified", value: "yes · automatically, with what changed and why", tone: "ok" },
  { label: "Downloads outside the workspace", value: "3 · they carry the export date and go stale silently", tone: "warn" },
];

// ───────────────────────── VL13 · MY ROOMS (lens, ?as=owner) ─────────────────────────

export const VL13_STATS: { eyebrow: string; value: string; note: string; tone?: VlTone }[] = [
  { eyebrow: "His rooms", value: "8", note: "7 closed · 1 open" },
  { eyebrow: "Recovered", value: "KES 18.2M", note: "not ₦-equivalent · never converted", tone: "ok" },
  { eyebrow: "On a holdout", value: "KES 1.0M", note: "one room of seven", tone: "warn" },
  { eyebrow: "Overdue against him", value: "1", note: "the re-forecast · 4 days", tone: "risk" },
];

export const VL13_ROWS: {
  room: string;
  closed: string;
  recovered: string;
  recoveredTone: VlTone;
  howMeasured: string;
  strength: string;
  strengthTone: VlTone;
  creditable?: boolean;
}[] = [
  { room: "Kenya retry window", closed: "today", recovered: "KES 1.0M", recoveredTone: "ok", howMeasured: "Holdout · 490 at 10%", strength: "causal", strengthTone: "ai", creditable: true },
  { room: "Nairobi dunning", closed: "2 Aug", recovered: "KES 4.1M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn" },
  { room: "Renewal night reminders", closed: "14 Jul", recovered: "KES 6.2M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn" },
  { room: "Five smaller rooms", closed: "Feb–Jun", recovered: "KES 6.9M", recoveredTone: "warn", howMeasured: "Before and after", strength: "association", strengthTone: "warn" },
  { room: "East Africa card failures", closed: "Open · 31 days", recovered: "—", recoveredTone: "muted", howMeasured: "Holdout planned", strength: "—", strengthTone: "neutral" },
];

// ───────────────────────── VL14 · CREDIT A RECOVERY (modal) ─────────────────────────

export const VL14_PRESET = {
  subject: "Kenya retry window",
  subjectDetail: "Closing today · KES 1.1M observed · day 9 of 9",
  rows: [
    { label: "At risk when it opened", value: "KES 3.4M", sub: "the failing renewal balances", tone: "warn" as VlTone },
    { label: "Observed recovery", value: "KES 1.1M", sub: "treated group, nine days", tone: "ok" as VlTone },
    { label: "Holdout recovery", value: "KES 0.09M", sub: "490 customers on the old pattern", tone: "muted" as VlTone },
    { label: "Attributable", value: "KES 1.0M", sub: "the difference · this is what enters the ledger", tone: "ok" as VlTone },
  ],
  warning: "The held group recovered something too. Crediting the full observed figure would count what would have happened anyway.",
  creditedTo: "Involuntary churn",
  creditedToMeta: "not Renew · not Ravi",
  amount: "KES 1.0M",
};

// ───────────────────────── VL15 · MARK IT UNMEASURABLE (modal) ─────────────────────────

export const VL15_PRESET = {
  subject: "Accra reactivation",
  subjectDetail: "GHS 2.1M at risk · closed 9 July · GHS 380k observed",
  reason: "Ghana had no repeat-rate baseline in July, so the GHS 380k that arrived cannot be separated from what would have arrived anyway. No holdout was set.",
  outcomes: [
    { label: "It stays on the ledger", sub: "as a row, with this reason attached, permanently", tone: "ok" as VlTone },
    { label: "It is counted in a separate figure", sub: "GHS 380k unmeasurable · never inside GHS 1.4M", tone: "warn" as VlTone },
    { label: "It is not deleted, hidden or archived", sub: "a removed row is indistinguishable from one that never ran", tone: "risk" as VlTone },
    { label: "The baseline gap becomes a task", sub: "Ghana baseline · assigned to whoever owns the market", tone: "ai" as VlTone },
  ],
};

// ───────────────────────── VL16 · CLOSE A ROOM WITH NO NUMBER (modal) ─────────────────────────

export const VL16_PRESET = {
  subject: "Weekend push fatigue · Kenya",
  subjectDetail: "Open 41 days · KES 2.4M at risk · nothing recovered",
  reasons: [
    { label: "The condition stopped holding", sub: "unsubscribes fell back on their own · nothing was done", on: true },
    { label: "It was the wrong room", sub: "the work carries on somewhere else · name it", on: false },
    { label: "It was measured and produced a figure", sub: "not this one · nothing was recovered", on: false },
    { label: "It cannot be measured", sub: "different · that keeps the money and loses the method", on: false },
  ],
};

// ───────────────────────── VL17 · RESTATE A FIGURE (modal) ─────────────────────────

export const VL17_PRESET = {
  subject: "Onboarding email rewrite · ₦188M",
  subjectDetail: "Closed 19 February · in the board pack sent 14 August",
  explanation: "The before-and-after window overlapped the 4 March release by eleven days. The comparison period is being cut short, and the figure falls from ₦188M to ₦164M.",
  from: "₦188M",
  to: "₦164M",
  effects: [
    { label: "The original figure is kept", sub: "₦188M stays readable, with its date and its reason", tone: "ok" as VlTone },
    { label: "Eleven recipients are told", sub: "the pack went out on 14 August · they get what changed and why", tone: "warn" as VlTone },
    { label: "Three downstream figures move", sub: "the ledger, the month total and the reconciliation", tone: "warn" as VlTone },
    { label: "The strength does not change", sub: "it was association before and it is association now", tone: "muted" as VlTone },
  ],
};

// ───────────────────────── VL18 · EXCHANGE RATES ─────────────────────────

export const VL18_ROWS: {
  where: string;
  whatFor: string;
  rate: string;
  rateTone: VlTone;
  date: string;
  indicative: string;
  indicativeTone: VlTone;
}[] = [
  { where: "The sidebar figure", whatFor: "One combined number, for orientation only", rate: "indicative", rateTone: "warn", date: "17 Aug", indicative: "yes", indicativeTone: "ok" },
  { where: "The value ledger", whatFor: "Nothing · four columns, four currencies", rate: "—", rateTone: "muted", date: "—", indicative: "not used", indicativeTone: "ok" },
  { where: "The leakage map", whatFor: "Nothing", rate: "—", rateTone: "muted", date: "—", indicative: "not used", indicativeTone: "ok" },
  { where: "Scenarios", whatFor: "Nothing · a scenario runs in one currency or not at all", rate: "—", rateTone: "muted", date: "—", indicative: "not used", indicativeTone: "ok" },
  { where: "The board pack", whatFor: "Nothing · four figures travel as four figures", rate: "—", rateTone: "muted", date: "—", indicative: "not used", indicativeTone: "ok" },
  { where: "Reconciliation", whatFor: "Finance converts at month end · this ledger does not", rate: "theirs", rateTone: "muted", date: "31 Jul", indicative: "theirs, not ours", indicativeTone: "warn" },
];

export const VL18_KV_ROWS: { label: string; value: string; tone?: VlTone }[] = [
  { label: "The problem", value: "151 days of movement converted at one rate gives one wrong answer", tone: "risk" },
  { label: "The alternative", value: "converting each day at that day's rate · defensible and unreadable", tone: "warn" },
  { label: "What either would produce", value: "a naira figure for Kenyan money that nobody could reproduce", tone: "risk" },
  { label: "What is offered instead", value: "four columns and the share-of-base denominator beside them", tone: "ok" },
  { label: "Who has asked for a combined total", value: "four people since January · all four are recorded here", tone: "muted" },
];

// ───────────────────────── VL19 · SETTINGS ─────────────────────────

export const VL19_ROWS: {
  rule: string;
  currently: string;
  currentlyTone: VlTone;
  who: string;
  canChange: boolean;
  state: string;
  stateTone: VlTone;
}[] = [
  { rule: "Revenue is recognised on delivery, not on order", currently: "—", currentlyTone: "muted", who: "Finance", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Refunds are subtracted in the period of the order", currently: "—", currentlyTone: "muted", who: "Finance", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Recovery requires a method or a typed reason", currently: "41 rooms", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Unmeasurable rows stay visible", currently: "3 rows", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Currencies are never combined into one total", currently: "4 markets", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The identified figure travels with the recovered one", currently: "₦1.08B", currentlyTone: "risk", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Restatements keep the original figure", currently: "6 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Recovery is credited to a person", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Rooms close automatically after 90 days", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "A net figure is published", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

// Re-exported for the People columns across the tables above.
export { ADA, AMARA, KUNLE, RAVI, SAM };
export type { AgentRef, PersonRef };
