import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Data · Data health — sourced from
 * flolyt-figma-designs/Data Screens & Specs/flolyt-data-health (1)/flolyt-data-health/
 * (16 frames, DH01-DH16). Content transcribed from the export's own `dh.py`
 * generator source, same approach as every prior section. See
 * docs/build-tracker.md.
 */

export type DhTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const DH_TONE_CLASS: Record<DhTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const DH_CHIP_TONE: Record<DhTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const DH_KPI_TONE: Record<DhTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** The block-tone palette for the 24-hour freshness bars. */
export const DH_BLOCK_CLASS: Record<"ok" | "warn" | "risk" | "muted", string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  muted: "bg-paper-3",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/first states. */
export type DataHealthState = "empty" | "first" | "full";
export const DATA_HEALTH_STATE: DataHealthState = "full";

export const DH_TABS = ["Right now", "Freshness", "Completeness", "What it broke", "Incidents", "Backfill"] as const;
export type DhTab = (typeof DH_TABS)[number];

// ───────────────────────── DH01 · NOTHING TO CHECK YET ──────────────────────

export const DH01_CHECK_ROWS: { check: string; compares: string; fires: string; firesTone: DhTone; goesTo: string; goesToTone: DhTone }[] = [
  { check: "Freshness", compares: "Time since the last delivery against the expected interval", fires: "2× the interval", firesTone: "muted", goesTo: "Sam", goesToTone: "muted" },
  { check: "Volume", compares: "Rows this delivery against the trailing average", fires: "±40%", firesTone: "muted", goesTo: "Sam", goesToTone: "muted" },
  { check: "Completeness", compares: "Empty values in a field against yesterday", fires: "+10 points", firesTone: "muted", goesTo: "the field's owner", goesToTone: "muted" },
  { check: "Schema", compares: "Columns and types against the last delivery", fires: "any change", firesTone: "muted", goesTo: "Sam", goesToTone: "muted" },
  { check: "Shape", compares: "Distributions against the trailing month", fires: "a step change", firesTone: "warn", goesTo: "the stage owner", goesToTone: "warn" },
];

// ───────────────────────── DH02 · THE FIRST FAILURE ─────────────────────────

export const DH02_STATS: { eyebrow: string; value: string; note: string; tone: DhTone }[] = [
  { eyebrow: "Detected", value: "1 day", note: "13 January, automatically", tone: "ok" },
  { eyebrow: "Acted on", value: "6 weeks", note: "when somebody asked", tone: "risk" },
  { eyebrow: "Still not fixed", value: "219 days", note: "and it is a conversation", tone: "risk" },
  { eyebrow: "Figures blocked since", value: "11", note: "every one names this source", tone: "risk" },
];

export const DH02_KV: { label: string; value: string; tone: DhTone }[] = [
  { label: "Detection", value: "one day · the check fired exactly as designed", tone: "ok" },
  { label: "Honesty", value: "margin went to Unavailable immediately, never to stale or zero", tone: "ok" },
  { label: "Routing", value: "to Sam, by name, with what it blocked", tone: "ok" },
  { label: "Escalation", value: "none · nothing here escalates, by design", tone: "warn" },
  { label: "Outcome", value: "219 days, eleven blocked figures, and a paused agent", tone: "risk" },
];

// ───────────────────────── DH03 · RIGHT NOW ──────────────────────────────────

export const DH03_STATS: { eyebrow: string; value: string; note: string; tone: DhTone }[] = [
  { eyebrow: "Healthy", value: "8 of 10", note: "delivering as expected", tone: "ok" },
  { eyebrow: "Degraded", value: "1", note: "checkout_events · 6h 41m", tone: "risk" },
  { eyebrow: "Connected but silent", value: "1", note: "loyalty_events · a year", tone: "warn" },
  { eyebrow: "Figures Unavailable now", value: "6", note: "each naming its source", tone: "risk" },
];

export const DH03_SOURCE_ROWS: {
  source: string;
  lastDelivery: string;
  lastDeliveryTone: DhTone;
  expected: string;
  rows: string;
  rowsTone: DhTone;
  trailing: string;
  trailingTone: DhTone;
  state: string;
  stateTone: DhTone;
}[] = [
  { source: "`orders`", lastDelivery: "14 min ago", lastDeliveryTone: "ok", expected: "every 14 min", rows: "3,412", rowsTone: "num", trailing: "+2%", trailingTone: "ok", state: "healthy", stateTone: "ok" },
  { source: "`customers`", lastDelivery: "14 min ago", lastDeliveryTone: "ok", expected: "every 14 min", rows: "1,880", rowsTone: "num", trailing: "−1%", trailingTone: "ok", state: "healthy", stateTone: "ok" },
  { source: "`payments`", lastDelivery: "6 min ago", lastDeliveryTone: "ok", expected: "every 6 min", rows: "904", rowsTone: "num", trailing: "+4%", trailingTone: "ok", state: "healthy", stateTone: "ok" },
  { source: "`tickets`", lastDelivery: "41 min ago", lastDeliveryTone: "ok", expected: "every 2 hours", rows: "118", rowsTone: "num", trailing: "+31%", trailingTone: "warn", state: "healthy · busy", stateTone: "warn" },
  { source: "`delivery`", lastDelivery: "22 min ago", lastDeliveryTone: "ok", expected: "every hour", rows: "2,104", rowsTone: "num", trailing: "+1%", trailingTone: "ok", state: "healthy", stateTone: "ok" },
  { source: "`feature_events`", lastDelivery: "4 min ago", lastDeliveryTone: "ok", expected: "every 5 min", rows: "88,412", rowsTone: "num", trailing: "−3%", trailingTone: "ok", state: "healthy", stateTone: "ok" },
  { source: "`checkout_events`", lastDelivery: "6h 41m ago", lastDeliveryTone: "risk", expected: "every 5 min", rows: "0", rowsTone: "risk", trailing: "−100%", trailingTone: "risk", state: "degraded", stateTone: "risk" },
  { source: "`loyalty_events`", lastDelivery: "Aug 2024", lastDeliveryTone: "warn", expected: "on use", rows: "0", rowsTone: "warn", trailing: "—", trailingTone: "muted", state: "silent", stateTone: "warn" },
  { source: "`cost_of_goods`", lastDelivery: "12 Jan", lastDeliveryTone: "risk", expected: "nightly", rows: "0", rowsTone: "risk", trailing: "—", trailingTone: "muted", state: "not delivering", stateTone: "risk" },
];

// ───────────────────────── DH04 · FRESHNESS ──────────────────────────────────

const OK24 = Array<"ok">(24).fill("ok");

export const DH04_FRESHNESS_BARS: { source: string; sub: string; blocks: ("ok" | "warn" | "risk" | "muted")[] }[] = [
  { source: "`orders`", sub: "every 14 min · no gaps", blocks: OK24 },
  { source: "`payments`", sub: "every 6 min · no gaps", blocks: OK24 },
  { source: "`checkout_events`", sub: "stopped at 04:12", blocks: [...Array<"ok">(17).fill("ok"), ...Array<"risk">(7).fill("risk")] },
  {
    source: "`tickets`",
    sub: "every 2 hours · two late",
    blocks: [...Array(9).fill("ok"), "warn", ...Array(5).fill("ok"), "warn", ...Array(8).fill("ok")] as ("ok" | "warn")[],
  },
  { source: "`cost_of_goods`", sub: "nothing since 12 January", blocks: Array<"muted">(24).fill("muted") },
];

export const DH04_THRESHOLD_ROWS: {
  source: string;
  expected: string;
  lateAt: string;
  degradedAt: string;
  whatChanges: string;
  rowAction?: "threshold";
}[] = [
  { source: "`orders`", expected: "14 min", lateAt: "28 min", degradedAt: "2 hours", whatChanges: "Late is shown · degraded pauses three agents" },
  { source: "`payments`", expected: "6 min", lateAt: "12 min", degradedAt: "1 hour", whatChanges: "Degraded blocks renewal work only" },
  { source: "`checkout_events`", expected: "5 min", lateAt: "10 min", degradedAt: "30 min", whatChanges: "Degraded blanks two funnel steps", rowAction: "threshold" },
  { source: "`tickets`", expected: "2 hours", lateAt: "4 hours", degradedAt: "12 hours", whatChanges: "Degraded stops theme grouping" },
  { source: "`cost_of_goods`", expected: "nightly", lateAt: "36 hours", degradedAt: "48 hours", whatChanges: "Degraded turns margin Unavailable" },
];

// ───────────────────────── DH05 · COMPLETENESS ───────────────────────────────

export const DH05_FIELD_ROWS: {
  field: string;
  empty: string;
  emptyTone: DhTone;
  was: string;
  wasTone: DhTone;
  costs: string;
  fixableBy: string;
  fixableByTone: DhTone;
  since: string;
  sinceTone: DhTone;
}[] = [
  { field: "`tickets.churn_reason`", empty: "71%", emptyTone: "risk", was: "68%", wasTone: "warn", costs: "Churn reasons cannot be grouped", fixableBy: "Support · a form change", fixableByTone: "warn", since: "always", sinceTone: "risk" },
  { field: "`orders.customer_reference`", empty: "100%", emptyTone: "risk", was: "—", wasTone: "muted", costs: "42,000 guest orders join to nobody", fixableBy: "Engineering · one column", fixableByTone: "warn", since: "always", sinceTone: "risk" },
  { field: "`customers.timezone`", empty: "2%", emptyTone: "ok", was: "2%", wasTone: "ok", costs: "84,000 people cannot be sent to at 09:00", fixableBy: "nothing · they never gave one", fixableByTone: "muted", since: "always", sinceTone: "muted" },
  { field: "`delivery.failure_reason`", empty: "18%", emptyTone: "warn", was: "31%", wasTone: "ok", costs: "Some delivery failures cannot be classified", fixableBy: "Operations · improving", fixableByTone: "ok", since: "Mar", sinceTone: "muted" },
  { field: "`subscriptions.term`", empty: "0%", emptyTone: "ok", was: "0%", wasTone: "ok", costs: "—", fixableBy: "—", fixableByTone: "muted", since: "—", sinceTone: "muted" },
];

// ───────────────────────── DH06 · WHAT IT BROKE ──────────────────────────────

export const DH06_UNAVAILABLE_ROWS: {
  what: string;
  where: string;
  source: string;
  sourceTone: DhTone;
  since: string;
  sinceTone: DhTone;
  wouldReturn: string;
  wouldReturnTone: DhTone;
}[] = [
  { what: "Reached checkout · funnel step", where: "Funnel, two stage screens", source: "checkout_events", sourceTone: "risk", since: "6h 41m", sinceTone: "risk", wouldReturn: "on recovery, with backfill", wouldReturnTone: "ok" },
  { what: "Placed a first order · funnel step", where: "Funnel", source: "checkout_events", sourceTone: "risk", since: "6h 41m", sinceTone: "risk", wouldReturn: "on recovery, with backfill", wouldReturnTone: "ok" },
  { what: "Margin · Price stage", where: "Leakage map, forecast, two scenarios", source: "cost_of_goods", sourceTone: "risk", since: "219 days", sinceTone: "risk", wouldReturn: "on connection", wouldReturnTone: "warn" },
  { what: "Any net figure", where: "The value ledger", source: "cost_of_goods and two others", sourceTone: "risk", since: "always", sinceTone: "risk", wouldReturn: "not from this alone", wouldReturnTone: "risk" },
  { what: "Acquire · realised loss", where: "Leakage map", source: "orders.customer_reference", sourceTone: "risk", since: "always", sinceTone: "risk", wouldReturn: "on one column", wouldReturnTone: "warn" },
  { what: "Saw the loyalty tier · funnel step", where: "Funnel", source: "loyalty_events", sourceTone: "warn", since: "Aug 2024", sinceTone: "warn", wouldReturn: "if the event ever fires", wouldReturnTone: "warn" },
  { what: "Referral revenue", where: "Advocate · everything", source: "nothing exists", sourceTone: "risk", since: "always", sinceTone: "risk", wouldReturn: "if it is ever built", wouldReturnTone: "risk" },
];

// ───────────────────────── DH07 · ONE INCIDENT (checkout) ───────────────────

export const DH07_TIMELINE_ROWS: { time: string; what: string; who: string; whoTone: DhTone; effect: string; effectTone: DhTone }[] = [
  { time: "04:12", what: "Last delivery · 41M rows total, then nothing", who: "—", whoTone: "muted", effect: "—", effectTone: "muted" },
  { time: "04:14", what: "Data Integrity fires · two minutes past the degraded threshold", who: "an agent", whoTone: "ai", effect: "finding written", effectTone: "ok" },
  { time: "04:14", what: "Activation paused automatically", who: "the system", whoTone: "muted", effect: "it does not guess", effectTone: "ok" },
  { time: "04:14", what: "Two funnel steps go to Unavailable", who: "the system", whoTone: "muted", effect: "not to zero", effectTone: "ok" },
  { time: "06:00", what: "Digest sent · marked incomplete, with the source named", who: "the system", whoTone: "muted", effect: "read by 9 people", effectTone: "ok" },
  { time: "07:30", what: "Sam acknowledges · upstream queue backed up overnight", who: "a person", whoTone: "ok", effect: "cause known", effectTone: "ok" },
  { time: "now", what: "Waiting · rows are queued upstream and will backfill", who: "—", whoTone: "muted", effect: "nothing lost", effectTone: "ok" },
];

// ───────────────────────── DH08 · BACKFILL ───────────────────────────────────

export const DH08_STEP_ROWS: { step: string; what: string; marked: string; markedTone: DhTone; who: string; whoTone: DhTone }[] = [
  { step: "1", what: "Queued rows arrive · 6h 41m of checkout events", marked: "—", markedTone: "muted", who: "nobody", whoTone: "muted" },
  { step: "2", what: "The two funnel steps recompute for the gap", marked: "backfilled", markedTone: "warn", who: "nobody yet", whoTone: "muted" },
  { step: "3", what: "Today's figures are labelled backfilled, not just complete", marked: "backfilled", markedTone: "warn", who: "anybody reading them", whoTone: "ok" },
  { step: "4", what: "Activation resumes and notes it was paused", marked: "—", markedTone: "muted", who: "its findings say so", whoTone: "ok" },
  { step: "5", what: "If anything moved more than expected, a finding is written", marked: "a finding", markedTone: "ai", who: "Zainab", whoTone: "muted" },
  { step: "6", what: "The label stays for seven days, then the figure is normal", marked: "—", markedTone: "muted", who: "nobody", whoTone: "muted" },
];

export const DH08_HISTORY_ROWS: {
  source: string;
  when: string;
  gap: string;
  gapTone: DhTone;
  rowsRecovered: string;
  rowsRecoveredTone: DhTone;
  materialChange: string;
  materialChangeTone: DhTone;
}[] = [
  { source: "`orders`", when: "15 Aug", gap: "8 hours", gapTone: "warn", rowsRecovered: "41,204", rowsRecoveredTone: "num", materialChange: "no · figures held", materialChangeTone: "ok" },
  { source: "`feature_events`", when: "2 Jul", gap: "40 min", gapTone: "muted", rowsRecovered: "2.1M", rowsRecoveredTone: "num", materialChange: "no", materialChangeTone: "ok" },
  { source: "`tickets`", when: "11 Jun", gap: "14 hours", gapTone: "risk", rowsRecovered: "1,882", rowsRecoveredTone: "num", materialChange: "yes · a theme appeared", materialChangeTone: "warn" },
  { source: "`checkout_events`", when: "in progress", gap: "6h 41m", gapTone: "risk", rowsRecovered: "pending", rowsRecoveredTone: "muted", materialChange: "—", materialChangeTone: "muted" },
];

// ───────────────────────── DH09 · INCIDENTS ──────────────────────────────────

export const DH09_INCIDENT_ROWS: {
  when: string;
  source: string;
  sourceHref?: string;
  duration: string;
  durationTone: DhTone;
  detectedIn: string;
  detectedInTone: DhTone;
  actedOnIn: string;
  actedOnInTone: DhTone;
  cost: string;
}[] = [
  { when: "today", source: "`checkout_events`", sourceHref: "/data-health/incidents/checkout", duration: "6h 41m", durationTone: "warn", detectedIn: "2 min", detectedInTone: "ok", actedOnIn: "3h 18m", actedOnInTone: "warn", cost: "Two funnel steps, one agent" },
  { when: "15 Aug", source: "`orders`", duration: "8 hours", durationTone: "warn", detectedIn: "2 min", detectedInTone: "ok", actedOnIn: "1h 04m", actedOnInTone: "ok", cost: "A digest, three agents, eight rooms" },
  { when: "11 Jun", source: "`ad_spend`", duration: "6 months", durationTone: "risk", detectedIn: "6 months", detectedInTone: "risk", actedOnIn: "1 day", actedOnInTone: "ok", cost: "Four CAC figures restated 22%" },
  { when: "11 Jun", source: "`tickets`", duration: "14 hours", durationTone: "warn", detectedIn: "4 hours", detectedInTone: "warn", actedOnIn: "6 hours", actedOnInTone: "warn", cost: "A theme was invisible for a day" },
  { when: "12 Jan", source: "`cost_of_goods`", duration: "219 days", durationTone: "risk", detectedIn: "1 day", detectedInTone: "ok", actedOnIn: "6 weeks", actedOnInTone: "risk", cost: "Eleven figures, still blocked" },
];

// ───────────────────────── DH10 · SHAPE ──────────────────────────────────────

export const DH10_SHAPE_ROWS: {
  whatMoved: string;
  source: string;
  when: string;
  classification: string;
  classificationTone: DhTone;
  wentTo: string;
  wentToTone: DhTone;
}[] = [
  { whatMoved: "Ad spend fell 22% in a day", source: "`ad_spend`", when: "11 Jun", classification: "data · agency fees excluded", classificationTone: "risk", wentTo: "Ravi, then Sam", wentToTone: "muted" },
  { whatMoved: "Churn reason 68% → 71% empty", source: "`tickets`", when: "Jul", classification: "data · a form nobody fills in", classificationTone: "warn", wentTo: "nobody · Churn", wentToTone: "risk" },
  { whatMoved: "Repeat rate fell 10.2 points", source: "`orders`", when: "11 Mar", classification: "business · the fee change", classificationTone: "ok", wentTo: "Ifeoma", wentToTone: "muted" },
  { whatMoved: "Tickets up 31% this morning", source: "`tickets`", when: "today", classification: "business · the checkout outage", classificationTone: "ok", wentTo: "Amara", wentToTone: "muted" },
  { whatMoved: "Delivery failure reason 31% → 18% empty", source: "`delivery`", when: "Mar", classification: "data · Operations improved it", classificationTone: "ok", wentTo: "nobody · it got better", wentToTone: "muted" },
];

// ───────────────────────── DH11 · CHANGE A THRESHOLD (modal) ────────────────

export const DH11_WOULD_HAVE_DONE: { label: string; value: string; tone: DhTone }[] = [
  { label: "Incidents in the last 90 days", value: "4 → 1", tone: "warn" },
  { label: "Today's incident", value: "detected at 06:12, not 04:14", tone: "risk" },
  { label: "The funnel between those times", value: "would have shown a number that was wrong", tone: "risk" },
  { label: "The morning digest", value: "would not have said it was incomplete", tone: "risk" },
];

// ───────────────────────── DH12 · REPORT A PROBLEM (modal) ──────────────────

export const DH12_HAPPENS_NEXT: { label: string; sub: string; tone: DhTone }[] = [
  { label: "The source is marked disputed, not degraded", sub: "it keeps delivering and every figure says disputed", tone: "warn" },
  { label: "Data Integrity re-checks shape, not arrival", sub: "arrival was never the problem", tone: "ai" },
  { label: "It goes to Sam and to Ravi", sub: "one owns the pipe, one owns the definition", tone: "ok" },
  { label: "Figures are not withdrawn yet", sub: "until somebody confirms · a report is not a finding", tone: "ok" },
];

// ───────────────────────── DH13 · WHO IS TOLD ────────────────────────────────

export const DH13_EVENT_ROWS: {
  event: string;
  immediately: string;
  immediatelyTone: DhTone;
  digest: string;
  digestTone: DhTone;
  never: string;
  neverTone: DhTone;
  why: string;
}[] = [
  { event: "A source stops", immediately: "Sam", immediatelyTone: "ok", digest: "everybody", digestTone: "ok", never: "—", neverTone: "muted", why: "It affects what the whole workspace can say" },
  { event: "A source is late", immediately: "nobody", immediatelyTone: "muted", digest: "nobody", digestTone: "muted", never: "—", neverTone: "muted", why: "Shown on this screen · late is not broken" },
  { event: "A field gets emptier", immediately: "the field's owner", immediatelyTone: "warn", digest: "nobody", digestTone: "muted", never: "—", neverTone: "muted", why: "Slow, and it needs the person who could fix it" },
  { event: "A schema changes", immediately: "Sam", immediatelyTone: "ok", digest: "nobody", digestTone: "muted", never: "—", neverTone: "muted", why: "Usually harmless, occasionally not" },
  { event: "A shape changes", immediately: "the stage owner", immediatelyTone: "warn", digest: "nobody", digestTone: "muted", never: "—", neverTone: "muted", why: "It may be the business, not the data" },
  { event: "A backfill completes", immediately: "nobody", immediatelyTone: "muted", digest: "nobody", digestTone: "muted", never: "everybody", neverTone: "muted", why: "The label on the figure is the notification" },
];

// ───────────────────────── DH14 · WHAT THIS CANNOT CATCH ────────────────────

export const DH14_LIMIT_ROWS: { problem: string; caught: string; caughtTone: DhTone; why: string; wouldCatch: string; wouldCatchTone: DhTone }[] = [
  { problem: "A source stops delivering", caught: "yes", caughtTone: "ok", why: "Freshness · within minutes", wouldCatch: "this section", wouldCatchTone: "ai" },
  { problem: "Half the rows go missing", caught: "yes", caughtTone: "ok", why: "Volume against the trailing average", wouldCatch: "this section", wouldCatchTone: "ai" },
  { problem: "A column disappears", caught: "yes", caughtTone: "ok", why: "Schema comparison", wouldCatch: "this section", wouldCatchTone: "ai" },
  { problem: "A field starts arriving empty", caught: "yes", caughtTone: "ok", why: "Completeness against yesterday", wouldCatch: "this section", wouldCatchTone: "ai" },
  { problem: "A definition quietly changes upstream", caught: "sometimes", caughtTone: "warn", why: "Only if the shape moves enough to notice", wouldCatch: "a person who knows", wouldCatchTone: "warn" },
  { problem: "Data that is complete and wrong", caught: "no", caughtTone: "risk", why: "It looks perfect by every automatic measure", wouldCatch: "a person who knows", wouldCatchTone: "risk" },
  { problem: "Data that is right and misunderstood here", caught: "no", caughtTone: "risk", why: "Nothing about the pipe is wrong", wouldCatch: "business memory · a definition", wouldCatchTone: "risk" },
];

// ───────────────────────── DH15 · SETTINGS ───────────────────────────────────

export const DH15_RULE_ROWS: { rule: string; currently: string; currentlyTone: DhTone; who: string; canChange: boolean; state: string; stateTone: DhTone }[] = [
  { rule: "A degraded source produces Unavailable", currently: "6 figures", currentlyTone: "risk", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Nothing is carried forward silently", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Backfilled figures are labelled for 7 days", currently: "3 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Agents pause when their source degrades", currently: "1 paused", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Freshness thresholds", currently: "per source", currentlyTone: "neutral", who: "Sam", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Volume tolerance", currently: "±40%", currentlyTone: "neutral", who: "Sam", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who is paged when a source stops", currently: "Sam", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Estimating a figure from a partial source", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Hiding a degraded source from dashboards", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "A single health score per source", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const DH15_OWES_KV: { label: string; value: string; tone: DhTone }[] = [
  { label: "Every Unavailable", value: "traceable to a source and a date, everywhere it appears", tone: "ok" },
  { label: "Every paused agent", value: "with the source that paused it, in Governance", tone: "ok" },
  { label: "Every stale figure", value: "labelled with when it was last true, not left to age", tone: "ok" },
  { label: "Every backfill", value: "labelled for a week, so a gap that filled is visible", tone: "ok" },
  { label: "Every restatement", value: "when a source is corrected, published rather than quiet", tone: "ok" },
];
