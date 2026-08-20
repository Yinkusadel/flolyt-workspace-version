import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { REPEAT_DECAY } from "@/pages/everyday/rooms/data";
import type { AgentRef } from "@/pages/everyday/rooms/types";

/**
 * Revenue · Benchmarks — sourced from
 * flolyt-figma-designs/Revenue Screens/flolyt-benchmarks/flolyt-benchmarks/
 * (16 frames, BM00-BM15 on disk; content transcribed from the export's own
 * `bm.py` generator source, same approach as leakage map/funnel/scenario/
 * attribution). Note: `bm.py`'s own internal `S.save("BM02", ...)` id is
 * reused once (both "the first comparison" and "against our own past") — the
 * on-disk SVG filenames (BM01-BM15) are the ones treated as authoritative
 * here, same as every prior section. See docs/build-tracker.md section 6e.
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

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type BenchmarkState = "empty" | "first" | "full";
export const BENCHMARK_STATE: BenchmarkState = "full";

export const BM_TABS = ["Our own past", "Market vs market", "Stage vs stage", "Against a holdout", "Not compared"] as const;
export type BmTab = (typeof BM_TABS)[number];

/** RD — "Repeat & Decay" is an exact match for bm.py's own "RD" avatar on the first-comparison card (a repeat-rate figure). */
export const REPEAT_DECAY_AGENT: AgentRef = REPEAT_DECAY;

export const BM_DETAIL_TITLES: Record<string, string> = {
  "repeat-rate": "Repeat rate · 90 days",
};

// ───────────────────────── BM01 · NOTHING TO COMPARE YET ─────────────────────────

export const BM01_ROWS: { basis: string; compares: string; strength: string; strengthTone: BmTone; available: string; availableTone: BmTone }[] = [
  { basis: "Our own past", compares: "Now against the locked baseline, or against a dated change", strength: "association", strengthTone: "warn", available: "1 January", availableTone: "muted" },
  { basis: "Market against market", compares: "Nigeria against Kenya, Ghana, the UK", strength: "association", strengthTone: "warn", available: "1 January", availableTone: "muted" },
  { basis: "Stage against stage", compares: "The same metric at different points in the lifecycle", strength: "association", strengthTone: "warn", available: "1 January", availableTone: "muted" },
  { basis: "Cohort against a holdout", compares: "Treated against randomly held, same period", strength: "causal", strengthTone: "ai", available: "first closed holdout", availableTone: "muted" },
  { basis: "An industry figure", compares: "This company against a number bought from somebody", strength: "never", strengthTone: "risk", available: "never", availableTone: "risk" },
];

// ───────────────────────── BM02 · THE FIRST COMPARISON ─────────────────────────

export const BM02_STATS: { eyebrow: string; value: string; note: string; tone?: BmTone }[] = [
  { eyebrow: "Now", value: "37.1%", note: "1 day of observation" },
  { eyebrow: "Baseline · 1 Jan", value: "37.1%", note: "locked last night" },
  { eyebrow: "Difference", value: "0.0", note: "and it means nothing yet", tone: "muted" },
  { eyebrow: "Readable from", value: "~14 days", note: "for a 1-point difference", tone: "warn" },
];

export const BM02_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "It draws the comparison", value: "even when the answer is that nothing can be said yet", tone: "ok" },
  { label: "It names what would make it readable", value: "fourteen days · not “check back later”", tone: "ok" },
  { label: "It does not hide a thin result", value: "an empty screen would imply nothing is being measured", tone: "ok" },
  { label: "It will not borrow a number", value: "no industry figure will ever fill this gap", tone: "risk" },
  { label: "It compares four things, all internal", value: "our past, our markets, our stages, our holdouts", tone: "ai" },
];

// ───────────────────────── BM03 · AGAINST OUR OWN PAST ─────────────────────────

export const BM03_ROWS: {
  metric: string;
  now: string;
  nowTone: BmTone;
  baseline: string;
  before: string;
  change: string;
  changeTone: BmTone;
  sameDefinition: string;
  sameDefinitionTone: BmTone;
  detailId?: string;
}[] = [
  { metric: "Repeat rate · 90 days", now: "27.2%", nowTone: "risk", baseline: "37.1%", before: "37.4%", change: "−10.2", changeTone: "risk", sameDefinition: "yes", sameDefinitionTone: "ok", detailId: "repeat-rate" },
  { metric: "Reached value · 30 days", now: "41.0%", nowTone: "risk", baseline: "54.1%", before: "58.0%", change: "−17.0", changeTone: "risk", sameDefinition: "changed 11 Jul", sameDefinitionTone: "warn" },
  { metric: "Checkout conversion", now: "63.8%", nowTone: "risk", baseline: "74.0%", before: "74.1%", change: "−10.3", changeTone: "risk", sameDefinition: "yes", sameDefinitionTone: "ok" },
  { metric: "Feature depth · week one", now: "2.1", nowTone: "risk", baseline: "2.9", before: "2.9", change: "−0.8", changeTone: "risk", sameDefinition: "yes", sameDefinitionTone: "ok" },
  { metric: "Monthly churn", now: "3.1%", nowTone: "risk", baseline: "2.4%", before: "2.4%", change: "+0.7", changeTone: "risk", sameDefinition: "yes", sameDefinitionTone: "ok" },
  { metric: "Involuntary churn recovery", now: "70.5%", nowTone: "ok", baseline: "25.0%", before: "25.0%", change: "+45.5", changeTone: "ok", sameDefinition: "yes", sameDefinitionTone: "ok" },
  { metric: "Gross margin", now: "Unavailable", nowTone: "muted", baseline: "Unavailable", before: "Unavailable", change: "—", changeTone: "muted", sameDefinition: "no source", sameDefinitionTone: "risk" },
];

// ───────────────────────── BM04 · MARKET AGAINST MARKET ─────────────────────────

export const BM04_ROWS: {
  metric: string;
  ng: string; ngTone: BmTone;
  ke: string; keTone: BmTone;
  gh: string; ghTone: BmTone;
  uk: string; ukTone: BmTone;
  spread: string; spreadTone: BmTone;
  comparable: string; comparableTone: BmTone;
}[] = [
  { metric: "Repeat rate", ng: "27.2%", ngTone: "risk", ke: "29.8%", keTone: "risk", gh: "22.1%", ghTone: "risk", uk: "38.9%", ukTone: "ok", spread: "16.8", spreadTone: "warn", comparable: "yes", comparableTone: "ok" },
  { metric: "Checkout conversion", ng: "63.8%", ngTone: "risk", ke: "66.2%", keTone: "risk", gh: "71.4%", ghTone: "warn", uk: "76.8%", ukTone: "ok", spread: "13.0", spreadTone: "warn", comparable: "yes", comparableTone: "ok" },
  { metric: "Signup completion", ng: "79.1%", ngTone: "num", ke: "77.4%", keTone: "num", gh: "61.2%", ghTone: "risk", uk: "88.1%", ukTone: "ok", spread: "26.9", spreadTone: "risk", comparable: "yes", comparableTone: "ok" },
  { metric: "Monthly churn", ng: "3.1%", ngTone: "risk", ke: "2.9%", keTone: "warn", gh: "Unavailable", ghTone: "muted", uk: "1.8%", ukTone: "ok", spread: "—", spreadTone: "muted", comparable: "3 of 4", comparableTone: "warn" },
  { metric: "Card recovery", ng: "70.5%", ngTone: "ok", ke: "68.4%", keTone: "ok", gh: "Unavailable", ghTone: "muted", uk: "81.2%", ukTone: "ok", spread: "—", spreadTone: "muted", comparable: "3 of 4", comparableTone: "warn" },
  { metric: "Average order value", ng: "₦8,420", ngTone: "num", ke: "KES 940", keTone: "num", gh: "GHS 61", ghTone: "num", uk: "£14.10", ukTone: "num", spread: "—", spreadTone: "muted", comparable: "no · currency", comparableTone: "risk" },
];

export const BM04_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "The UK never received the 4 March change", value: "which is why it leads five of six rows", tone: "warn" },
  { label: "Ghana is eleven months old", value: "and its signup completion has been ~61% the whole time", tone: "risk" },
  { label: "Kenya and Nigeria received the same release", value: "on the same day · they move together throughout", tone: "muted" },
  { label: "Sample sizes differ by thirteen times", value: "1.24M against 94,000 · the last steps are small", tone: "warn" },
];

// ───────────────────────── BM05 · STAGE AGAINST STAGE ─────────────────────────

export const BM05_ROWS: {
  stage: string;
  owner: string; ownerTone: BmTone;
  metricNow: string; metricNowTone: BmTone;
  againstBaseline: string; againstBaselineTone: BmTone;
  rooms: string; roomsTone: BmTone;
  recovered: string; recoveredTone: BmTone;
  instrumented: string; instrumentedTone: BmTone;
}[] = [
  { stage: "Acquire", owner: "Tunde", ownerTone: "muted", metricNow: "894k a year", metricNowTone: "num", againstBaseline: "+2.1%", againstBaselineTone: "ok", rooms: "2", roomsTone: "num", recovered: "₦0", recoveredTone: "muted", instrumented: "partly", instrumentedTone: "warn" },
  { stage: "Activate", owner: "Zainab", ownerTone: "muted", metricNow: "41.0%", metricNowTone: "risk", againstBaseline: "−17.0", againstBaselineTone: "risk", rooms: "3", roomsTone: "num", recovered: "₦188M", recoveredTone: "warn", instrumented: "partly", instrumentedTone: "warn" },
  { stage: "Adopt", owner: "nobody", ownerTone: "risk", metricNow: "2.1", metricNowTone: "risk", againstBaseline: "−0.8", againstBaselineTone: "risk", rooms: "0", roomsTone: "risk", recovered: "₦0", recoveredTone: "muted", instrumented: "partly", instrumentedTone: "warn" },
  { stage: "Retain", owner: "Ifeoma", ownerTone: "muted", metricNow: "27.2%", metricNowTone: "risk", againstBaseline: "−9.9", againstBaselineTone: "risk", rooms: "6", roomsTone: "num", recovered: "₦12M", recoveredTone: "num", instrumented: "yes", instrumentedTone: "ok" },
  { stage: "Expand", owner: "Tunde", ownerTone: "muted", metricNow: "1.4×", metricNowTone: "warn", againstBaseline: "−0.3", againstBaselineTone: "warn", rooms: "4", roomsTone: "num", recovered: "₦72M", recoveredTone: "warn", instrumented: "yes", instrumentedTone: "ok" },
  { stage: "Renew", owner: "Kunle", ownerTone: "muted", metricNow: "88.4%", metricNowTone: "warn", againstBaseline: "−1.2", againstBaselineTone: "warn", rooms: "5", roomsTone: "num", recovered: "₦62M", recoveredTone: "ok", instrumented: "yes", instrumentedTone: "ok" },
  { stage: "Support", owner: "Amara", ownerTone: "muted", metricNow: "12.8k", metricNowTone: "warn", againstBaseline: "+31%", againstBaselineTone: "risk", rooms: "7", roomsTone: "num", recovered: "₦9M", recoveredTone: "muted", instrumented: "yes", instrumentedTone: "ok" },
  { stage: "Churn", owner: "nobody", ownerTone: "risk", metricNow: "3.1%", metricNowTone: "risk", againstBaseline: "+0.7", againstBaselineTone: "risk", rooms: "0", roomsTone: "risk", recovered: "₦0", recoveredTone: "muted", instrumented: "partly", instrumentedTone: "warn" },
  { stage: "Advocate", owner: "nobody", ownerTone: "risk", metricNow: "Unavailable", metricNowTone: "muted", againstBaseline: "—", againstBaselineTone: "muted", rooms: "0", roomsTone: "risk", recovered: "₦0", recoveredTone: "muted", instrumented: "no", instrumentedTone: "risk" },
  { stage: "Price", owner: "Ravi", ownerTone: "muted", metricNow: "Unavailable", metricNowTone: "muted", againstBaseline: "—", againstBaselineTone: "muted", rooms: "3", roomsTone: "num", recovered: "₦31M", recoveredTone: "ok", instrumented: "partly", instrumentedTone: "warn" },
];

export const BM05_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "Different units", value: "a rate, a count, a multiple and a ticket volume · four kinds of thing" },
  { label: "Different directions", value: "Support and Churn are better when they fall · the colours follow the metric, not the number", tone: "warn" },
  { label: "Different ages", value: "Advocate has never been instrumented · Retain has been since December", tone: "muted" },
  { label: "What is comparable across rows", value: "the owner column, the room count, and the recovered money · nothing else", tone: "ok" },
];

// ───────────────────────── BM06 · AGAINST A HOLDOUT ─────────────────────────

export const BM06_ROWS: {
  comparison: string;
  treated: string; treatedTone: BmTone;
  held: string; heldTone: BmTone;
  difference: string; differenceTone: BmTone;
  n: string;
  strength: string; strengthTone: BmTone;
  closed: string;
}[] = [
  { comparison: "Card retry at 09:00 vs midnight", treated: "70.5%", treatedTone: "ok", held: "25.0%", heldTone: "muted", difference: "+45.5", differenceTone: "ok", n: "21,400", strength: "causal", strengthTone: "ai", closed: "2 Apr" },
  { comparison: "Kenya retry window", treated: "68.4%", treatedTone: "ok", held: "24.1%", heldTone: "muted", difference: "+44.3", differenceTone: "ok", n: "4,900", strength: "causal", strengthTone: "ai", closed: "today" },
  { comparison: "Discount removed vs offered", treated: "₦8,420", treatedTone: "ok", held: "₦8,100", heldTone: "muted", difference: "+₦320", differenceTone: "ok", n: "19,000", strength: "causal", strengthTone: "ai", closed: "28 Mar" },
  { comparison: "Reactivation wave one", treated: "11.2%", treatedTone: "warn", held: "9.8%", heldTone: "muted", difference: "+1.4", differenceTone: "warn", n: "100,000", strength: "provisional", strengthTone: "warn", closed: "day 12" },
  { comparison: "Basket prompt · rerun", treated: "—", treatedTone: "muted", held: "—", heldTone: "muted", difference: "—", differenceTone: "muted", n: "17,446", strength: "day 1", strengthTone: "muted", closed: "14 Sep" },
];

export const BM06_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "Card retry", value: "2,140 people left on a pattern known to be worse · ≈₦6.9M", tone: "warn" },
  { label: "Kenya retry", value: "490 people · ≈KES 110k", tone: "warn" },
  { label: "Discount removal", value: "1,900 people kept a code the rest lost · ≈₦1.1M forgone", tone: "warn" },
  { label: "Reactivation wave one", value: "10,000 people contacted about nothing · ≈₦1.0M", tone: "warn" },
  { label: "Total borne by customers", value: "≈₦8.2M · published in the cost view, not netted off anything", tone: "risk" },
];

// ───────────────────────── BM07 · ONE COMPARISON IN FULL (repeat-rate) ─────────────────────────

export const BM07_HERO = {
  label: "repeat rate · 90 days · nigeria",
  big: "27.2%",
  sub: "Held against four reference points, three of which agree and one of which is the accident.",
  rightLab: "the honest reading",
  rightBig: "−10.2",
  rightSub: "against a like-for-like past",
};

export const BM07_ROWS: {
  comparedTo: string;
  figure: string;
  difference: string; differenceTone: BmTone;
  tells: string;
  strength: string; strengthTone: BmTone;
}[] = [
  { comparedTo: "Our own baseline · 1 Jan", figure: "37.1%", difference: "−9.9", differenceTone: "risk", tells: "Something changed since January", strength: "association", strengthTone: "warn" },
  { comparedTo: "The week before 4 March", figure: "37.4%", difference: "−10.2", differenceTone: "risk", tells: "It changed in a fortnight, not gradually", strength: "association", strengthTone: "warn" },
  { comparedTo: "The UK · never received the change", figure: "38.9%", difference: "−11.7", differenceTone: "risk", tells: "A market without the change did not move", strength: "causal", strengthTone: "ai" },
  { comparedTo: "Ghana · has not received it yet", figure: "22.1%", difference: "+5.1", differenceTone: "muted", tells: "Worse than us, for unrelated reasons", strength: "not comparable", strengthTone: "neutral" },
  { comparedTo: "Kenya · same release, same day", figure: "29.8%", difference: "−2.6", differenceTone: "muted", tells: "Moved with us · confirms the mechanism", strength: "association", strengthTone: "warn" },
  { comparedTo: "An industry figure", figure: "—", difference: "—", differenceTone: "muted", tells: "Not held · and it would not tell you anything", strength: "refused", strengthTone: "risk" },
];

export const BM07_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "Reversing the change in one market", value: "the only real test · modelled as S-114, never run", tone: "warn" },
  { label: "A checkout-step event", value: "would show where inside the step people stop · 133 days overdue", tone: "risk" },
  { label: "Ghana on 14 September", value: "the last market that could have been a control · loses it that day", tone: "risk" },
  { label: "Waiting longer", value: "adds nothing · twenty-one flat weeks is already the answer", tone: "muted" },
];

// ───────────────────────── BM08 · WHAT WE DO NOT COMPARE AGAINST ─────────────────────────

export const BM08_ROWS: { askedFor: string; by: string; when: string; whyNot: string; insteadOffered: string; insteadTone: BmTone }[] = [
  { askedFor: "An industry repeat-rate benchmark", by: "Ada", when: "Feb", whyNot: "Different definition, different market, unverifiable", insteadOffered: "the UK · a real control", insteadTone: "ok" },
  { askedFor: "A competitor's delivery fee", by: "Tunde", when: "Mar", whyNot: "Scraped once, changes weekly, no way to keep honest", insteadOffered: "our own before and after", insteadTone: "ok" },
  { askedFor: "A “companies like us” cohort", by: "Ravi", when: "Jun", whyNot: "Nobody can say who is like us · the set is the answer", insteadOffered: "market against market", insteadTone: "ok" },
  { askedFor: "A percentile ranking", by: "Ada", when: "Jun", whyNot: "Needs a peer set that does not exist", insteadOffered: "nothing · the question does not resolve", insteadTone: "warn" },
  { askedFor: "A score out of 100", by: "board", when: "Jul", whyNot: "Averages metrics that measure different things", insteadOffered: "the ten-stage table", insteadTone: "ok" },
];

export const BM08_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "It would be available today", value: "vendors sell them · it is the fastest thing on this list", tone: "warn" },
  { label: "It would look identical to a measured figure", value: "same column, same typeface, same table", tone: "risk" },
  { label: "Its definition would not match ours", value: "repeat rate over what window, counting whom, in which market", tone: "risk" },
  { label: "It could not be re-derived later", value: "nobody could check it in six months · that is the disqualifying part", tone: "risk" },
  { label: "What it would be good for", value: "one thing · knowing whether to be worried, which we already know", tone: "muted" },
];

// ───────────────────────── BM09 · WHERE COMPARISON BREAKS ─────────────────────────

export const BM09_ROWS: { comparison: string; sample: string; sampleTone: BmTone; difference: string; differenceTone: BmTone; wouldNeed: string; wouldNeedTone: BmTone; shownAs: string; shownAsTone: BmTone }[] = [
  { comparison: "Ghana repeat rate vs Nigeria", sample: "1,940", sampleTone: "warn", difference: "−5.1", differenceTone: "warn", wouldNeed: "~6,000 to be readable", wouldNeedTone: "warn", shownAs: "wide", shownAsTone: "warn" },
  { comparison: "UK card recovery vs Nigeria", sample: "2,100", sampleTone: "warn", difference: "+10.7", differenceTone: "warn", wouldNeed: "~3,400 to be readable", wouldNeedTone: "warn", shownAs: "wide", shownAsTone: "warn" },
  { comparison: "Ghana churn vs anything", sample: "Unavailable", sampleTone: "muted", difference: "—", differenceTone: "muted", wouldNeed: "an instrumented churn event", wouldNeedTone: "risk", shownAs: "not drawn", shownAsTone: "muted" },
  { comparison: "Advocate anything vs anything", sample: "Unavailable", sampleTone: "muted", difference: "—", differenceTone: "muted", wouldNeed: "the stage to exist first", wouldNeedTone: "risk", shownAs: "not drawn", shownAsTone: "muted" },
  { comparison: "This month vs last month", sample: "full", sampleTone: "ok", difference: "−0.4", differenceTone: "muted", wouldNeed: "nothing · it is readable and dull", wouldNeedTone: "muted", shownAs: "flat", shownAsTone: "muted" },
];

export const BM09_KV_ROWS: { label: string; value: string; tone?: BmTone }[] = [
  { label: "Extending the window", value: "not offered per-comparison · the window belongs to the metric", tone: "risk" },
  { label: "Combining markets", value: "Ghana plus Kenya is not a market and would not be one", tone: "risk" },
  { label: "Pooling months", value: "allowed, and it changes the label on the chart", tone: "warn" },
  { label: "Dropping the sample column", value: "not offered · it is the second column for a reason", tone: "risk" },
];

// ───────────────────────── BM10 · LIKE FOR LIKE ─────────────────────────

export const BM10_ROWS: { mustMatch: string; why: string; checked: string; checkedTone: BmTone; failuresNow: string; failuresNowTone: BmTone; whenItFails: string; whenItFailsTone: BmTone }[] = [
  { mustMatch: "The definition of the metric", why: "Reached value changed on 11 July", checked: "yes", checkedTone: "ok", failuresNow: "1", failuresNowTone: "warn", whenItFails: "both definitions shown, chart marked", whenItFailsTone: "warn" },
  { mustMatch: "The population", why: "Guest checkout left the denominator on 2 July", checked: "yes", checkedTone: "ok", failuresNow: "1", failuresNowTone: "warn", whenItFails: "restated, original kept", whenItFailsTone: "warn" },
  { mustMatch: "The window", why: "30-day and 60-day repeat are different metrics", checked: "yes", checkedTone: "ok", failuresNow: "0", failuresNowTone: "ok", whenItFails: "comparison refused", whenItFailsTone: "risk" },
  { mustMatch: "The market", why: "Rates compare · money does not", checked: "yes", checkedTone: "ok", failuresNow: "1", failuresNowTone: "warn", whenItFails: "currency rows never summed", whenItFailsTone: "ok" },
  { mustMatch: "The source", why: "An events-based figure and an orders-based one differ", checked: "yes", checkedTone: "ok", failuresNow: "2", failuresNowTone: "warn", whenItFails: "source printed on both", whenItFailsTone: "ok" },
  { mustMatch: "The period length", why: "Twenty-eight days against thirty-one is a 10% error", checked: "yes", checkedTone: "ok", failuresNow: "0", failuresNowTone: "ok", whenItFails: "normalised, and labelled", whenItFailsTone: "ok" },
];

// ───────────────────────── BM11 · BUILD A COMPARISON · 1 (what) ─────────────────────────

export const BM11_SUBJECTS = {
  left: { title: "Repeat rate · 90 days · Nigeria", sub: "27.2% · now · n = 831,000" },
  right: { title: "Repeat rate · 90 days · United Kingdom", sub: "38.9% · now · n = 2,100" },
};

export const BM11_BASIS_ROWS: { basis: string; meaning: string; strength: string; strengthTone: BmTone; selected: boolean }[] = [
  { basis: "Market against market", meaning: "Two markets, same period, same definition", strength: "association", strengthTone: "warn", selected: false },
  { basis: "A market that did not receive the change", meaning: "The UK never got the 4 March release · this is a control", strength: "causal", strengthTone: "ai", selected: true },
  { basis: "Our own past", meaning: "Nigeria now against Nigeria in February", strength: "association", strengthTone: "warn", selected: false },
  { basis: "Against a holdout", meaning: "Not available · no holdout exists on repeat rate", strength: "unavailable", strengthTone: "neutral", selected: false },
];

// ───────────────────────── BM12 · BUILD A COMPARISON · 2 (matching) ─────────────────────────

export const BM12_CHECK_ROWS: { check: string; nigeria: string; uk: string; match: string; matchTone: BmTone; effect: string; effectTone: BmTone }[] = [
  { check: "Definition", nigeria: "2 orders, 90 days", uk: "2 orders, 90 days", match: "yes", matchTone: "ok", effect: "—", effectTone: "muted" },
  { check: "Population", nigeria: "Excludes guest checkout", uk: "No guest checkout exists", match: "yes", matchTone: "ok", effect: "—", effectTone: "muted" },
  { check: "Window", nigeria: "90 days", uk: "90 days", match: "yes", matchTone: "ok", effect: "—", effectTone: "muted" },
  { check: "Source", nigeria: "`orders`", uk: "`orders`", match: "yes", matchTone: "ok", effect: "—", effectTone: "muted" },
  { check: "Period", nigeria: "1 Jan to today", uk: "1 Jan to today", match: "yes", matchTone: "ok", effect: "—", effectTone: "muted" },
  { check: "Sample", nigeria: "831,000", uk: "2,100", match: "no", matchTone: "warn", effect: "the difference is drawn wide", effectTone: "warn" },
];

export const BM12_SUMMARY_KV: { label: string; value: string; tone?: BmTone }[] = [
  { label: "The claim", value: "a market that did not receive the change did not move", tone: "ai" },
  { label: "The strength", value: "causal · and it is the only causal claim on repeat rate", tone: "ai" },
  { label: "The caveat that travels", value: "n = 2,100 · the difference is drawn wide", tone: "warn" },
  { label: "Who signs it", value: "you · calling the UK a control is a person's assertion", tone: "ok" },
  { label: "When it expires", value: "it does not · but Ghana stops being usable this way on 14 September", tone: "risk" },
];

// ───────────────────────── BM13 · ADD AN EXTERNAL BENCHMARK (modal) ─────────────────────────

export const BM13_PRESET = {
  askedRows: [
    { askedFor: "An industry repeat-rate benchmark", by: "Ada", when: "Feb", whyNot: "Different definition, different market, unverifiable" },
    { askedFor: "A percentile ranking", by: "Ada", when: "Jun", whyNot: "Needs a peer set that does not exist" },
  ],
  wouldBeAdding: { title: "Food delivery · repeat rate · emerging markets · 34%", sub: "Vendor report, Q1 · definition not published" },
  wouldBeTrue: [
    { label: "It cannot be re-derived", sub: "nobody here could reproduce 34% from anything", tone: "risk" as BmTone },
    { label: "Its definition is unknown", sub: "over what window, counting whom, in which countries", tone: "risk" as BmTone },
    { label: "It would look like a measured figure", sub: "same column, same typeface, beside the UK's 38.9%", tone: "risk" as BmTone },
    { label: "It would not change any decision", sub: "27.2% is already 10.2 below where this company was", tone: "muted" as BmTone },
  ],
};

// ───────────────────────── BM14 · SETTINGS ─────────────────────────

export const BM14_ROWS: { rule: string; currently: string; currentlyTone: BmTone; who: string; canChange: boolean; state: string; stateTone: BmTone }[] = [
  { rule: "Strength shown on every comparison", currently: "18", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Sample size shown beside every difference", currently: "18", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Mismatched windows are blocked", currently: "0 blocked", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Definition changes marked on every chart", currently: "1 change", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Currencies never compared as money", currently: "4", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Minimum sample before a difference is drawn", currently: "500", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Default reference point", currently: "the baseline", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "External benchmarks", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "A composite score across stages", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Ranking stages or markets by performance", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const BM14_PUBLISH_KV: { label: string; value: string; tone?: BmTone }[] = [
  { label: "Comparisons drawn", value: "18 · three of them causal, fifteen association", tone: "warn" },
  { label: "Comparisons refused", value: "5 external, 1 mismatched window · all recorded with the reason", tone: "muted" },
  { label: "Comparisons marked wide", value: "2 · Ghana and the UK, both on sample size", tone: "warn" },
  { label: "Metrics that cannot be compared at all", value: "3 · Advocate, Ghana churn, gross margin", tone: "risk" },
  { label: "Definition changes in the period", value: "1 · 11 July, marked on every chart that spans it", tone: "warn" },
];
