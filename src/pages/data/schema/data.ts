import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Data · Schema — sourced from
 * flolyt-figma-designs/Data Screens & Specs/flolyt-schema/flolyt-schema/
 * (16 frames, SM01-SM16). Content transcribed from the export's own `sm.py`
 * generator source, same approach as every prior section. See
 * docs/build-tracker.md.
 */

export type SmTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const SM_TONE_CLASS: Record<SmTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const SM_CHIP_TONE: Record<SmTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const SM_KPI_TONE: Record<SmTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/first states. */
export type SchemaState = "empty" | "first" | "full";
export const SCHEMA_STATE: SchemaState = "full";

export const SM_TABS = ["Fields", "Events", "Changes", "Requested", "Definitions", "Unused"] as const;
export type SmTab = (typeof SM_TABS)[number];

export const SM_FIELD_TITLES: Record<string, string> = {
  "customers-market": "customers.market",
};

// ───────────────────────── SM01 · NOTHING MAPPED YET ────────────────────────

export const SM01_COMMIT_ROWS: { label: string; value: string; reversible: string; reversibleTone: SmTone }[] = [
  { label: "A metric depends on it", value: "Every figure computed from it names this field", reversible: "yes", reversibleTone: "ok" },
  { label: "A change to it becomes an event", value: "Renames, type changes and disappearances are watched", reversible: "yes", reversibleTone: "ok" },
  { label: "It appears in the agent access table", value: "Governance shows which agents can read it", reversible: "yes", reversibleTone: "ok" },
  { label: "It carries a meaning", value: "Written here, cited in memory, argued with in rooms", reversible: "yes", reversibleTone: "ok" },
];

// ───────────────────────── SM02 · THE FIRST FIELD MAPPED ────────────────────

export const SM02_STATS: { eyebrow: string; value: string; note: string; tone: SmTone }[] = [
  { eyebrow: "Field", value: "orders.total", note: "1.24M rows", tone: "num" },
  { eyebrow: "Metrics that depend on it", value: "14", note: "across six stages", tone: "num" },
  { eyebrow: "Meaning", value: "written", note: "and cited 3 times", tone: "ok" },
  { eyebrow: "Changed since", value: "0 times", note: "watched daily", tone: "ok" },
];

export const SM02_KV: { label: string; value: string; tone?: SmTone }[] = [
  { label: "The column", value: "`orders.total` · decimal · never null in 1.24M rows" },
  { label: "What it means here", value: "gross of tax, net of discount, delivery included", tone: "ok" },
  { label: "Who decided that", value: "Ravi Mehta · Finance · 12 December", tone: "ok" },
  { label: "What depends on it", value: "order value, basket, CAC payback, 11 more", tone: "warn" },
  { label: "What happens if it changes", value: "14 metrics restate · the change is an event, not a surprise", tone: "warn" },
];

// ───────────────────────── SM03 · FIELDS ─────────────────────────────────────

export const SM03_STATS: { eyebrow: string; value: string; note: string; tone: SmTone }[] = [
  { eyebrow: "Mapped", value: "94", note: "of 340 available", tone: "num" },
  { eyebrow: "With a written meaning", value: "71", note: "23 have none", tone: "warn" },
  { eyebrow: "Personal", value: "1", note: "one agent reads it", tone: "warn" },
  { eyebrow: "Changed in 90 days", value: "3", note: "all handled", tone: "ok" },
];

export type FieldRow = {
  field: string;
  slug: string;
  meaning: string;
  type: string;
  dependents: string;
  dependentsTone: SmTone;
  meaningState: string;
  meaningStateTone: SmTone;
  state: string;
  stateTone: SmTone;
};

export const SM03_FIELD_ROWS: FieldRow[] = [
  { field: "`orders.total`", slug: "orders-total", meaning: "Gross of tax, net of discount, delivery in", type: "decimal", dependents: "14", dependentsTone: "warn", meaningState: "written", meaningStateTone: "ok", state: "stable", stateTone: "ok" },
  { field: "`orders.created_at`", slug: "orders-created-at", meaning: "When the order was placed, not dispatched", type: "timestamp", dependents: "22", dependentsTone: "risk", meaningState: "written", meaningStateTone: "ok", state: "stable", stateTone: "ok" },
  { field: "`customers.created_at`", slug: "customers-created-at", meaning: "Account creation · not first purchase", type: "timestamp", dependents: "18", dependentsTone: "warn", meaningState: "written", meaningStateTone: "ok", state: "stable", stateTone: "ok" },
  { field: "`customers.market`", slug: "customers-market", meaning: "Billing market, not delivery market", type: "enum", dependents: "31", dependentsTone: "risk", meaningState: "written", meaningStateTone: "ok", state: "stable", stateTone: "ok" },
  { field: "`payments.outcome`", slug: "payments-outcome", meaning: "Final outcome after all retries", type: "enum", dependents: "9", dependentsTone: "num", meaningState: "written", meaningStateTone: "ok", state: "values added", stateTone: "warn" },
  { field: "`tickets.body`", slug: "tickets-body", meaning: "What the customer wrote, verbatim", type: "text", dependents: "4", dependentsTone: "num", meaningState: "written", meaningStateTone: "ok", state: "personal", stateTone: "warn" },
  { field: "`tickets.churn_reason`", slug: "tickets-churn-reason", meaning: "Agent-selected reason · optional field", type: "enum", dependents: "6", dependentsTone: "num", meaningState: "written", meaningStateTone: "ok", state: "71% empty", stateTone: "risk" },
  { field: "`orders.discount_code`", slug: "orders-discount-code", meaning: "No written meaning", type: "string", dependents: "7", dependentsTone: "num", meaningState: "none", meaningStateTone: "risk", state: "stable", stateTone: "ok" },
];

// ───────────────────────── SM04 · ONE FIELD (customers.market) ──────────────

export const SM04_WHAT_ROWS: { label: string; value: string; note: string; noteTone: SmTone }[] = [
  { label: "Column", value: "`customers.market`", note: "enum · 4 values", noteTone: "muted" },
  { label: "What it means here", value: "The market a customer is billed in", note: "written · Ravi · Dec", noteTone: "ok" },
  { label: "What it does not mean", value: "Where an order is delivered", note: "the common misreading", noteTone: "warn" },
  { label: "Empty", value: "0.0% · 12 rows in 4.16M", note: "negligible", noteTone: "ok" },
  { label: "Values seen", value: "NG, KE, GH, UK", note: "no new value in 8 months", noteTone: "ok" },
  { label: "Personal", value: "No", note: "—", noteTone: "muted" },
];

export const SM04_BREAKS_ROWS: { if: string; happens: string; detectedBy: string; detectedByTone: SmTone; effect: string; effectTone: SmTone }[] = [
  { if: "A fifth value appears", happens: "Every market view gains a column with no owner", detectedBy: "schema check", detectedByTone: "ok", effect: "a stage with no reader", effectTone: "warn" },
  { if: "It is renamed", happens: "31 metrics stop computing within one delivery", detectedBy: "schema check", detectedByTone: "ok", effect: "Unavailable, source named", effectTone: "risk" },
  { if: "Its meaning changes upstream", happens: "Every historical market figure is quietly wrong", detectedBy: "nothing automatic", detectedByTone: "risk", effect: "a person notices, or nobody does", effectTone: "risk" },
  { if: "It starts arriving empty", happens: "Market comparisons lose their denominator", detectedBy: "completeness check", detectedByTone: "ok", effect: "Unavailable per market", effectTone: "warn" },
];

// ───────────────────────── SM05 · EVENTS ─────────────────────────────────────

export const SM05_EVENT_ROWS: {
  event: string;
  marks: string;
  volume: string;
  volumeTone: SmTone;
  markets: string;
  marketsTone: SmTone;
  usedBy: string;
  usedByTone: SmTone;
  state: string;
  stateTone: SmTone;
}[] = [
  { event: "`order.created`", marks: "An order is placed", volume: "173,412", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", usedBy: "6 steps, 8 metrics", usedByTone: "num", state: "firing", stateTone: "ok" },
  { event: "`checkout.opened`", marks: "Checkout is entered", volume: "271,004", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", usedBy: "1 step", usedByTone: "num", state: "firing", stateTone: "ok" },
  { event: "`signup.started`", marks: "Signup begins", volume: "402,118", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", usedBy: "1 step", usedByTone: "num", state: "firing · new", stateTone: "ai" },
  { event: "`feature.used`", marks: "Any in-product action", volume: "88M", volumeTone: "num", markets: "4 of 4", marketsTone: "ok", usedBy: "depth, 6 metrics", usedByTone: "num", state: "firing", stateTone: "ok" },
  { event: "`checkout.fee_shown`", marks: "The fee line is displayed", volume: "0", volumeTone: "risk", markets: "0 of 4", marketsTone: "risk", usedBy: "1 step · blocked", usedByTone: "risk", state: "never built", stateTone: "risk" },
  { event: "`checkout.abandoned`", marks: "Checkout is left", volume: "0", volumeTone: "risk", markets: "0 of 4", marketsTone: "risk", usedBy: "nothing yet", usedByTone: "warn", state: "never built", stateTone: "risk" },
  { event: "`loyalty.tier_shown`", marks: "A tier is displayed", volume: "0", volumeTone: "warn", markets: "0 of 4", marketsTone: "warn", usedBy: "1 step · blocked", usedByTone: "warn", state: "built, silent", stateTone: "warn" },
  { event: "`referral.made`", marks: "A referral is sent", volume: "0", volumeTone: "risk", markets: "0 of 4", marketsTone: "risk", usedBy: "a whole stage", usedByTone: "risk", state: "never built", stateTone: "risk" },
];

// ───────────────────────── SM06 · CHANGES ────────────────────────────────────

export const SM06_CHANGE_ROWS: {
  when: string;
  what: string;
  kind: string;
  kindTone: SmTone;
  detected: string;
  detectedTone: SmTone;
  effect: string;
  effectTone: SmTone;
  by: string;
  rowAction?: "rename";
}[] = [
  { when: "11 Aug", what: "`payments.outcome` gained two values", kind: "new values", kindTone: "warn", detected: "same day", detectedTone: "ok", effect: "2 metrics needed a rule", effectTone: "warn", by: "Sam" },
  { when: "2 Aug", what: "`releases` connected · six fields mapped", kind: "new source", kindTone: "ok", detected: "—", detectedTone: "muted", effect: "one causal finding", effectTone: "ok", by: "Sam" },
  { when: "17 Jul", what: "`orders.channel` renamed upstream", kind: "rename", kindTone: "risk", detected: "same day", detectedTone: "ok", effect: "4 metrics Unavailable for 6h", effectTone: "warn", by: "Sam", rowAction: "rename" },
  { when: "11 Jun", what: "`ad_spend.amount` meaning changed", kind: "meaning", kindTone: "risk", detected: "6 months", detectedTone: "risk", effect: "4 figures restated 22%", effectTone: "risk", by: "Ravi" },
  { when: "Mar", what: "`delivery.failure_reason` values consolidated", kind: "values removed", kindTone: "warn", detected: "same day", detectedTone: "ok", effect: "driver grouping restated", effectTone: "warn", by: "Amara" },
];

export const SM06_WHAT_HAPPENS_KV: { label: string; value: string; tone: SmTone }[] = [
  { label: "A rename", value: "dependent metrics go Unavailable within one delivery, naming the field", tone: "warn" },
  { label: "A new enum value", value: "no metric breaks · a rule is requested from whoever owns the meaning", tone: "ok" },
  { label: "A removed value", value: "historical figures keep the old value; the change is marked on charts", tone: "ok" },
  { label: "A type change", value: "the field is unmapped automatically and everything depending on it stops", tone: "risk" },
  { label: "A meaning change", value: "nothing automatic · this is the one that needs a person", tone: "risk" },
];

// ───────────────────────── SM07 · REQUESTED ──────────────────────────────────

export const SM07_REQUESTED_ROWS: {
  what: string;
  kind: string;
  unblocks: string;
  firstAsked: string;
  firstAskedTone: SmTone;
  asked: string;
  askedTone: SmTone;
  overdue: string;
  overdueTone: SmTone;
  owner: string;
  ownerTone: SmTone;
}[] = [
  { what: "`orders.customer_reference`", kind: "field", unblocks: "42,000 guest orders joining to a customer · 5 things", firstAsked: "28 Jul", firstAskedTone: "warn", asked: "2", askedTone: "num", overdue: "21 days", overdueTone: "risk", owner: "Sam", ownerTone: "muted" },
  { what: "`checkout.fee_shown`", kind: "event", unblocks: "One funnel step · one causal upgrade", firstAsked: "6 Apr", firstAskedTone: "risk", asked: "5", askedTone: "risk", overdue: "133 days", overdueTone: "risk", owner: "Sam", ownerTone: "muted" },
  { what: "`order_lines`", kind: "table", unblocks: "Basket composition · four claims · margin", firstAsked: "28 Jul", firstAskedTone: "warn", asked: "2", askedTone: "num", overdue: "21 days", overdueTone: "risk", owner: "Sam", ownerTone: "muted" },
  { what: "`checkout.abandoned`", kind: "event", unblocks: "Where inside checkout people stop", firstAsked: "6 Apr", firstAskedTone: "risk", asked: "5", askedTone: "risk", overdue: "133 days", overdueTone: "risk", owner: "Sam", ownerTone: "muted" },
  { what: "`referral.made`", kind: "event", unblocks: "A whole stage", firstAsked: "never", firstAskedTone: "risk", asked: "0", askedTone: "risk", overdue: "—", overdueTone: "muted", owner: "nobody", ownerTone: "risk" },
];

// ───────────────────────── SM08 · DEFINITIONS ────────────────────────────────

export const SM08_DEFINITION_ROWS: {
  term: string;
  meaning: string;
  setBy: string;
  cited: string;
  disputed: string;
  disputedTone: SmTone;
  rowAction?: "dispute";
}[] = [
  { term: "Order value", meaning: "`orders.total` · gross of tax, net of discount", setBy: "Ravi", cited: "11", disputed: "no", disputedTone: "ok" },
  { term: "Market", meaning: "Billing market · not delivery market", setBy: "Ravi", cited: "9", disputed: "no", disputedTone: "ok" },
  { term: "Customer", meaning: "One account · duplicates merged on the identity key", setBy: "Ada", cited: "14", disputed: "no", disputedTone: "ok" },
  { term: "Discount", meaning: "A code, a price change or a credit · three meanings in use", setBy: "Ravi", cited: "6", disputed: "resolved by naming all three", disputedTone: "warn" },
  { term: "Active", meaning: "Ordered in the last 90 days", setBy: "Ifeoma", cited: "8", disputed: "yes · Sales uses 180", disputedTone: "risk", rowAction: "dispute" },
  { term: "Churned", meaning: "No order in 90 days and no open subscription", setBy: "Ada", cited: "7", disputed: "no", disputedTone: "ok" },
];

// ───────────────────────── SM09 · UNUSED ─────────────────────────────────────

export const SM09_UNUSED_ROWS: {
  field: string;
  mapped: string;
  why: string;
  dependents: string;
  dependentsTone: SmTone;
  readBy: string;
  action: string;
  actionTone: SmTone;
  rowAction?: "unmap";
}[] = [
  { field: "`orders.gift_message`", mapped: "Dec", why: "Taken with the first connection", dependents: "0", dependentsTone: "warn", readBy: "no agent", action: "unmap", actionTone: "ai", rowAction: "unmap" },
  { field: "`customers.referral_source`", mapped: "Dec", why: "For a stage that never got an owner", dependents: "0", dependentsTone: "warn", readBy: "no agent", action: "keep · Advocate", actionTone: "warn" },
  { field: "`subscriptions.trial_end`", mapped: "Feb", why: "A room that closed in March", dependents: "0", dependentsTone: "warn", readBy: "no agent", action: "unmap", actionTone: "ai" },
  { field: "`tickets.agent_notes`", mapped: "—", why: "Requested and declined · about staff", dependents: "0", dependentsTone: "muted", readBy: "never granted", action: "—", actionTone: "muted" },
];

// ───────────────────────── SM10 · MAP A FIELD (modal) ───────────────────────

export const SM10_COMMITS: { label: string; sub: string; tone: SmTone }[] = [
  { label: "Two metrics will depend on it", sub: "basket breadth · expansion eligibility", tone: "ok" },
  { label: "Changes to it become events", sub: "rename, type change and new values are watched", tone: "ok" },
  { label: "It joins the agent access table", sub: "one agent would need it · Expansion", tone: "warn" },
  { label: "The meaning is citable", sub: "it becomes a definition in business memory", tone: "ai" },
];

// ───────────────────────── SM11 · CONFIRM A RENAME (modal) ──────────────────

export const SM11_AUTOMATIC_ROWS: { label: string; sub: string; tone: SmTone }[] = [
  { label: "Four metrics went Unavailable", sub: "naming the field, not the source", tone: "ok" },
  { label: "One agent paused", sub: "Acquisition Quality · it reads this field", tone: "ok" },
  { label: "Nothing was guessed", sub: "the new column was not assumed to be the old one", tone: "ok" },
  { label: "Sam was told", sub: "immediately · a rename is one of two paging events", tone: "ok" },
];

// ───────────────────────── SM12 · A DISPUTED DEFINITION (modal) ─────────────

export const SM12_TWO_DEFINITIONS: { label: string; who: string; uses: string; tone: SmTone }[] = [
  { label: "Ordered in the last 90 days", who: "Ifeoma · Retention", uses: "8 metrics", tone: "ok" },
  { label: "Ordered in the last 180 days", who: "Tunde · Sales", uses: "3 metrics", tone: "warn" },
];

export const SM12_WILL_DO: { label: string; sub: string; on: boolean; blocked: boolean }[] = [
  { label: "Name both, and show which metrics use which", sub: "the disagreement becomes visible instead of invisible", on: true, blocked: false },
  { label: "Route it to Ifeoma and Tunde to settle", sub: "they own the two sides · neither is wrong", on: false, blocked: false },
  { label: "Pick one and restate the other metrics", sub: "not from here · that is a definition change with a preview", on: false, blocked: true },
  { label: "Average the two windows", sub: "never offered", on: false, blocked: true },
];

// ───────────────────────── SM13 · UNMAP A FIELD (modal) ─────────────────────

export const SM13_HAPPENS: { label: string; sub: string; tone: SmTone }[] = [
  { label: "Flolyt stops reading the column", sub: "it is removed from the credential scope", tone: "ok" },
  { label: "It leaves the agent access table", sub: "one fewer row in every access review", tone: "ok" },
  { label: "Its meaning stays readable", sub: "unmapping is not deletion", tone: "ok" },
  { label: "Nothing recomputes", sub: "no figure depended on it", tone: "muted" },
];

// ───────────────────────── SM14 · WHAT A CHANGE COSTS ────────────────────────

export const SM14_COST_ROWS: { kind: string; detected: string; detectedTone: SmTone; response: string; needsPerson: string; needsPersonTone: SmTone; cost: string }[] = [
  { kind: "A column renamed", detected: "same delivery", detectedTone: "ok", response: "Dependent metrics go Unavailable", needsPerson: "confirm it is the same field", needsPersonTone: "warn", cost: "Hours" },
  { kind: "A column removed", detected: "same delivery", detectedTone: "ok", response: "Dependent metrics go Unavailable", needsPerson: "decide what replaces it", needsPersonTone: "warn", cost: "Days" },
  { kind: "A type changed", detected: "same delivery", detectedTone: "ok", response: "The field is unmapped automatically", needsPerson: "remap or replace", needsPersonTone: "warn", cost: "Days" },
  { kind: "A new enum value", detected: "same delivery", detectedTone: "ok", response: "Nothing breaks", needsPerson: "write a rule for it", needsPersonTone: "muted", cost: "Minutes" },
  { kind: "A value removed", detected: "same delivery", detectedTone: "ok", response: "History keeps the old value", needsPerson: "mark it on charts", needsPersonTone: "muted", cost: "Minutes" },
  { kind: "A field starts arriving empty", detected: "within a day", detectedTone: "ok", response: "Completeness alert", needsPerson: "chase the upstream owner", needsPersonTone: "warn", cost: "Weeks" },
  { kind: "The meaning changes upstream", detected: "never", detectedTone: "risk", response: "Nothing", needsPerson: "somebody has to notice", needsPersonTone: "risk", cost: "Months" },
];

// ───────────────────────── SM15 · SETTINGS ───────────────────────────────────

export const SM15_RULE_ROWS: { rule: string; currently: string; currentlyTone: SmTone; who: string; canChange: boolean; state: string; stateTone: SmTone }[] = [
  { rule: "A mapped field requires a written meaning", currently: "71 of 94", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A rename is confirmed by a person", currently: "1 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A type change unmaps the field", currently: "0 so far", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Dependent metrics go Unavailable, never coerced", currently: "4 metrics once", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Definitions are attached to the fields they govern", currently: "6", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Who may map a field", currently: "Sam, with approval", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who may write a definition", currently: "anyone", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Auto-matching a renamed column", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Inferring a field's meaning from its name", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Auto-unmapping unused fields", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const SM15_USED_KV: { label: string; value: string; tone: SmTone }[] = [
  { label: "Every metric in the product", value: "each names the fields it computes from", tone: "ai" },
  { label: "Governance", value: "the agent access table is this list, per agent", tone: "ok" },
  { label: "Business memory", value: "definitions written here are citable objects there", tone: "ok" },
  { label: "Data health", value: "the schema check compares each delivery against this", tone: "ok" },
  { label: "Lifecycle", value: "a stage definition binds to an event listed here", tone: "ok" },
];
