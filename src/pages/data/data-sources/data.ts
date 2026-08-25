import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Data · Data sources — sourced from
 * flolyt-figma-designs/Data Screens & Specs/flolyt-data-sources (1)/flolyt-data-sources/
 * (18 frames, DS01-DS18). Content transcribed from the export's own `ds.py`
 * generator source, same approach as every prior section. See
 * docs/build-tracker.md.
 */

export type DsTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const DS_TONE_CLASS: Record<DsTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const DS_CHIP_TONE: Record<DsTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const DS_KPI_TONE: Record<DsTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type DataSourcesState = "empty" | "first" | "full";
export const DATA_SOURCES_STATE: DataSourcesState = "full";

export const DS_TABS = ["Connected", "Not connected", "What depends on it", "Credentials", "History"] as const;
export type DsTab = (typeof DS_TABS)[number];

export const DS_DETAIL_TITLES: Record<string, string> = {
  orders: "orders",
  "ad-spend": "ad_spend",
};

// ───────────────────────── DS01 · NOTHING CONNECTED ─────────────────────────

export const DS01_STEP_ROWS: { step: string; what: string; how: string; howTone: DsTone; reversible: string; reversibleTone: DsTone }[] = [
  { step: "1", what: "A read-only credential, scoped to fields you pick", how: "minutes", howTone: "muted", reversible: "yes", reversibleTone: "ok" },
  { step: "2", what: "A first read · 18 months of history where it exists", how: "hours", howTone: "muted", reversible: "yes", reversibleTone: "ok" },
  { step: "3", what: "Agents begin reading and produce nothing", how: "days", howTone: "muted", reversible: "yes", reversibleTone: "ok" },
  { step: "4", what: "A baseline locks and figures become comparisons", how: "1 January", howTone: "warn", reversible: "no · it is a date", reversibleTone: "risk" },
];

// ───────────────────────── DS02 · THE FIRST SOURCE ──────────────────────────

export const DS02_STATS: { eyebrow: string; value: string; note: string; tone: DsTone }[] = [
  { eyebrow: "Rows", value: "1.24M", note: "18 months", tone: "num" },
  { eyebrow: "Fields", value: "4", note: "of 31 available", tone: "ok" },
  { eyebrow: "Access", value: "read-only", note: "it cannot write", tone: "ok" },
  { eyebrow: "What it unblocks", value: "6 of 9 stages", note: "once a baseline exists", tone: "warn" },
];

export const DS02_FIELD_ROWS: { field: string; taken: string; takenTone: DsTone; why: string; enables: string }[] = [
  { field: "id, customer_id, created_at, total", taken: "yes", takenTone: "ok", why: "Repeat rate, cohorts, second orders", enables: "Six stages" },
  { field: "shipping_address, phone", taken: "no", takenTone: "muted", why: "Personal · nothing here needs it", enables: "—" },
  { field: "line_items", taken: "not available", takenTone: "risk", why: "Lives in `order_lines` · not connected", enables: "Basket composition, margin" },
  { field: "discount_code", taken: "yes", takenTone: "ok", why: "Discount dependence, price work", enables: "Two stages" },
  { field: "twenty-six others", taken: "no", takenTone: "muted", why: "Nothing has needed them yet", enables: "—" },
];

// ───────────────────────── DS03 · CONNECTED ──────────────────────────────────

export const DS03_STATS: { eyebrow: string; value: string; note: string; tone: DsTone }[] = [
  { eyebrow: "Connected", value: "10", note: "of twelve known sources", tone: "num" },
  { eyebrow: "Delivering", value: "8", note: "one degraded, one silent", tone: "warn" },
  { eyebrow: "Never connected", value: "2", note: "COGS and referral", tone: "risk" },
  { eyebrow: "Fields read", value: "94", note: "of 340 available", tone: "ok" },
];

export type SourceRow = {
  id: string;
  name: string;
  carries: string;
  rows: string;
  rowsTone: DsTone;
  fresh: string;
  freshTone: DsTone;
  fields: string;
  fieldsTone: DsTone;
  state: string;
  stateTone: DsTone;
  /** Opens a modal instead of just being a chip — same single-target pattern as every prior section's rowAction. */
  rowAction?: "disconnect";
};

export const DS03_SOURCE_ROWS: SourceRow[] = [
  { id: "orders", name: "`orders`", carries: "Every order, without line items", rows: "1.24M", rowsTone: "num", fresh: "14 min", freshTone: "ok", fields: "5", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "customers", name: "`customers`", carries: "Accounts, markets, timezones, consent", rows: "4.16M", rowsTone: "num", fresh: "14 min", freshTone: "ok", fields: "11", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "payments", name: "`payments`", carries: "Attempts, outcomes, retries", rows: "612k", rowsTone: "num", fresh: "6 min", freshTone: "ok", fields: "9", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "tickets", name: "`tickets`", carries: "Support contacts and replies", rows: "12.8k", rowsTone: "num", fresh: "2 hours", freshTone: "ok", fields: "8", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "delivery", name: "`delivery`", carries: "Dispatch, failure and refund events", rows: "1.9M", rowsTone: "num", fresh: "1 hour", freshTone: "ok", fields: "7", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "subscriptions", name: "`subscriptions`", carries: "Plans, terms, renewal dates", rows: "218k", rowsTone: "num", fresh: "30 min", freshTone: "ok", fields: "12", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "feature_events", name: "`feature_events`", carries: "In-product actions", rows: "88M", rowsTone: "num", fresh: "5 min", freshTone: "ok", fields: "6", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "releases", name: "`releases`", carries: "What shipped, when, to which market", rows: "412", rowsTone: "num", fresh: "live", freshTone: "ok", fields: "6", fieldsTone: "num", state: "healthy", stateTone: "ok" },
  { id: "checkout_events", name: "`checkout_events`", carries: "Steps inside checkout", rows: "41M", rowsTone: "num", fresh: "stopped 04:12", freshTone: "risk", fields: "5", fieldsTone: "num", state: "degraded", stateTone: "risk" },
  { id: "loyalty_events", name: "`loyalty_events`", carries: "Tier displays and redemptions", rows: "0", rowsTone: "risk", fresh: "silent since Aug 2024", freshTone: "warn", fields: "4", fieldsTone: "num", state: "connected, empty", stateTone: "warn", rowAction: "disconnect" },
];

// ───────────────────────── DS04 · ONE SOURCE (orders) ────────────────────────

export const DS04_CONNECTION_ROWS: { label: string; value: string; changed: string; changedTone: DsTone }[] = [
  { label: "Credential", value: "Read-only, scoped to five named fields", changed: "once · Mar", changedTone: "warn" },
  { label: "Method", value: "Direct read replica · not an export, not a webhook", changed: "no", changedTone: "ok" },
  { label: "Frequency", value: "Every 14 minutes · full delta since last read", changed: "no", changedTone: "ok" },
  { label: "History taken at connection", value: "18 months · everything that existed", changed: "—", changedTone: "muted" },
  { label: "Who connected it", value: "Sam Iyer · 12 December · with Ada's approval", changed: "—", changedTone: "muted" },
  { label: "Who can change it", value: "Sam, with an approval · nobody else", changed: "no", changedTone: "ok" },
];

export const DS04_BREAKS_ROWS: { what: string; effect: string; effectTone: DsTone; instead: string; how: string; howTone: DsTone }[] = [
  { what: "Repeat rate, cohorts, second orders", effect: "stops", effectTone: "risk", instead: "Unavailable, with the source named", how: "immediately", howTone: "risk" },
  { what: "Three agents", effect: "pause", effectTone: "warn", instead: "Paused · they do not guess", how: "immediately", howTone: "risk" },
  { what: "Eight rooms' figures", effect: "go stale", effectTone: "warn", instead: "Last read at, with the timestamp", how: "hours", howTone: "warn" },
  { what: "Two goals", effect: "unmeasurable", effectTone: "warn", instead: "Unavailable for today", how: "a day", howTone: "warn" },
  { what: "Approved plays", effect: "unaffected", effectTone: "ok", instead: "They continue · the audience is built", how: "—", howTone: "muted" },
  { what: "The value ledger", effect: "unaffected", effectTone: "ok", instead: "Closed rooms keep their figures", how: "—", howTone: "muted" },
];

// ───────────────────────── DS05 · NOT CONNECTED ─────────────────────────────

export const DS05_MISSING_ROWS: {
  source: string;
  carries: string;
  blocks: string;
  blocksTone: DsTone;
  asked: string;
  askedTone: DsTone;
  overdue: string;
  overdueTone: DsTone;
  who: string;
  whoTone: DsTone;
}[] = [
  { source: "Cost of goods", carries: "Unit cost per product, per market", blocks: "11 figures", blocksTone: "risk", asked: "28 Jul", askedTone: "warn", overdue: "21 days", overdueTone: "risk", who: "Sam · needs Finance's system", whoTone: "warn" },
  { source: "`order_lines`", carries: "What was in each basket", blocks: "4 claims", blocksTone: "warn", asked: "28 Jul", askedTone: "warn", overdue: "21 days", overdueTone: "risk", who: "Sam", whoTone: "warn" },
  { source: "Referral attribution", carries: "Referrer to referred customer", blocks: "a whole stage", blocksTone: "risk", asked: "never", askedTone: "risk", overdue: "—", overdueTone: "muted", who: "nobody · Advocate has no owner", whoTone: "risk" },
  { source: "Payday calendar", carries: "Local pay dates by market", blocks: "1 scenario input", blocksTone: "muted", asked: "never", askedTone: "warn", overdue: "—", overdueTone: "muted", who: "anybody · it is public data", whoTone: "warn" },
];

// ───────────────────────── DS06 · WHAT DEPENDS ON IT ────────────────────────

export const DS06_DEPENDENCY_ROWS: {
  source: string;
  stages: string;
  stagesTone: DsTone;
  agents: string;
  agentsTone: DsTone;
  goals: string;
  goalsTone: DsTone;
  figures: string;
  figuresTone: DsTone;
  ifStopped: string;
  ifStoppedTone: DsTone;
}[] = [
  { source: "`orders`", stages: "6", stagesTone: "risk", agents: "3", agentsTone: "risk", goals: "2", goalsTone: "warn", figures: "41", figuresTone: "risk", ifStopped: "most of the product goes quiet", ifStoppedTone: "risk" },
  { source: "`customers`", stages: "9", stagesTone: "risk", agents: "7", agentsTone: "risk", goals: "3", goalsTone: "risk", figures: "60+", figuresTone: "risk", ifStopped: "everything cohort-shaped stops", ifStoppedTone: "risk" },
  { source: "`payments`", stages: "2", stagesTone: "warn", agents: "2", agentsTone: "warn", goals: "1", goalsTone: "muted", figures: "9", figuresTone: "warn", ifStopped: "renewal work stops", ifStoppedTone: "warn" },
  { source: "`tickets`", stages: "1", stagesTone: "muted", agents: "1", agentsTone: "muted", goals: "0", goalsTone: "muted", figures: "6", figuresTone: "muted", ifStopped: "themes and one health signal stop", ifStoppedTone: "muted" },
  { source: "`feature_events`", stages: "2", stagesTone: "warn", agents: "2", agentsTone: "warn", goals: "0", goalsTone: "muted", figures: "8", figuresTone: "warn", ifStopped: "depth readings stop", ifStoppedTone: "warn" },
  { source: "`checkout_events`", stages: "1", stagesTone: "muted", agents: "1", agentsTone: "muted", goals: "0", goalsTone: "muted", figures: "4", figuresTone: "muted", ifStopped: "two funnel steps · it is out now", ifStoppedTone: "risk" },
  { source: "`releases`", stages: "0", stagesTone: "muted", agents: "2", agentsTone: "warn", goals: "0", goalsTone: "muted", figures: "1", figuresTone: "muted", ifStopped: "nothing today · everything in hindsight", ifStoppedTone: "warn" },
];

// ───────────────────────── DS07 · CONNECT · WHAT ────────────────────────────

export const DS07_CANDIDATE_ROWS: { source: string; where: string; rows: string; rowsTone: DsTone; unblocks: string; selected: boolean }[] = [
  { source: "Cost of goods", where: "Finance · a spreadsheet, exported nightly", rows: "~4,000", rowsTone: "num", unblocks: "11 figures, margin everywhere, one agent", selected: true },
  { source: "`order_lines`", where: "The same database as orders", rows: "6.1M", rowsTone: "num", unblocks: "Basket composition, 4 claims", selected: false },
  { source: "Payday calendar", where: "Public · a file per market", rows: "48", rowsTone: "muted", unblocks: "One scenario input", selected: false },
  { source: "Referral attribution", where: "Does not exist anywhere yet", rows: "—", rowsTone: "risk", unblocks: "A whole stage · needs building first", selected: false },
];

// ───────────────────────── DS08 · CONNECT · FIELDS ──────────────────────────

export const DS08_FIELD_ROWS: { field: string; what: string; take: boolean; enables: string; personal: boolean }[] = [
  { field: "sku", what: "Product identifier", take: true, enables: "Joining cost to an order line", personal: false },
  { field: "unit_cost", what: "Cost per unit, per market", take: true, enables: "Margin · eleven blocked figures", personal: false },
  { field: "currency", what: "The currency the cost is in", take: true, enables: "Keeping four markets apart", personal: false },
  { field: "effective_from", what: "When this cost started applying", take: true, enables: "Margin on historical orders", personal: false },
  { field: "supplier_name", what: "Who it was bought from", take: false, enables: "Nothing here needs it", personal: false },
  { field: "supplier_terms", what: "Payment terms with the supplier", take: false, enables: "Nothing here needs it", personal: false },
  { field: "margin_target", what: "Finance's internal target", take: false, enables: "It would look like a goal and is not one", personal: false },
];

// ───────────────────────── DS09 · CONNECT · HOW ─────────────────────────────

export const DS09_METHOD_ROWS: { method: string; what: string; fresh: string; freshTone: DsTone; available: string; availableTone: DsTone; selected: boolean }[] = [
  { method: "Read replica", what: "Flolyt reads the database directly", fresh: "minutes", freshTone: "ok", available: "no · it is a file", availableTone: "muted", selected: false },
  { method: "Nightly file", what: "Finance exports · Flolyt reads what arrives", fresh: "up to 24h", freshTone: "warn", available: "yes", availableTone: "ok", selected: true },
  { method: "Webhook", what: "Finance's system pushes on change", fresh: "live", freshTone: "ok", available: "no · they cannot", availableTone: "muted", selected: false },
  { method: "Manual upload", what: "Somebody uploads it when they remember", fresh: "unknowable", freshTone: "risk", available: "offered · not advised", availableTone: "risk", selected: false },
];

export const DS09_MISSED_FILE_KV: { label: string; value: string; tone: DsTone }[] = [
  { label: "The source goes stale, not empty", value: "the last file is used and every figure says when it was from", tone: "warn" },
  { label: "After 48 hours", value: "margin figures go to Unavailable rather than staying stale", tone: "risk" },
  { label: "Who is told", value: "Ravi, on the first missed night · Ada on the second", tone: "ok" },
  { label: "What is never done", value: "carrying the last file forward silently past two days", tone: "risk" },
  { label: "Backfill", value: "when a file arrives, historical margin recomputes and says it changed", tone: "ok" },
];

// ───────────────────────── DS10 · CONNECT · REVIEW ──────────────────────────

export const DS10_CHANGE_ROWS: { what: string; now: string; nowTone: DsTone; after: string; afterTone: DsTone; caveat: string; caveatTone: DsTone }[] = [
  { what: "Price & Margin agent", now: "paused 219 days", nowTone: "risk", after: "reading", afterTone: "ok", caveat: "—", caveatTone: "muted" },
  { what: "Margin figures", now: "Unavailable", nowTone: "muted", after: "readable", afterTone: "ok", caveat: "up to a day old", caveatTone: "warn" },
  { what: "Scenario S-097 · Ghana repricing", now: "blocked", nowTone: "risk", after: "runnable", afterTone: "ok", caveat: "margin is nightly", caveatTone: "warn" },
  { what: "Reprice on local margin · playbook", now: "blocked", nowTone: "risk", after: "runnable", afterTone: "ok", caveat: "margin is nightly", caveatTone: "warn" },
  { what: "The Price stage", now: "2 of 4 figures", nowTone: "warn", after: "4 of 4", afterTone: "ok", caveat: "—", caveatTone: "muted" },
  { what: "Net figures anywhere in the ledger", now: "still refused", nowTone: "risk", after: "still refused", afterTone: "risk", caveat: "two other costs are still missing", caveatTone: "risk" },
];

// ───────────────────────── DS11 · CREDENTIALS ───────────────────────────────

export const DS11_CREDENTIAL_ROWS: { source: string; access: string; scope: string; scopeTone: DsTone; rotated: string; rotatedTone: DsTone; expires: string; expiresTone: DsTone }[] = [
  { source: "`orders`", access: "read-only", scope: "5 fields", scopeTone: "ok", rotated: "Mar", rotatedTone: "warn", expires: "never", expiresTone: "warn" },
  { source: "`customers`", access: "read-only", scope: "11 fields", scopeTone: "ok", rotated: "Mar", rotatedTone: "warn", expires: "never", expiresTone: "warn" },
  { source: "`payments`", access: "read-only", scope: "9 fields · no card data", scopeTone: "ok", rotated: "Jun", rotatedTone: "ok", expires: "never", expiresTone: "warn" },
  { source: "`tickets`", access: "read-only", scope: "8 fields · includes body", scopeTone: "warn", rotated: "Mar", rotatedTone: "warn", expires: "never", expiresTone: "warn" },
  { source: "`feature_events`", access: "read-only", scope: "6 fields", scopeTone: "ok", rotated: "Mar", rotatedTone: "warn", expires: "never", expiresTone: "warn" },
  { source: "`releases`", access: "read-only", scope: "6 fields", scopeTone: "ok", rotated: "Aug", rotatedTone: "ok", expires: "never", expiresTone: "warn" },
];

export const DS11_PROTECTS_KV: { label: string; value: string; tone: DsTone }[] = [
  { label: "Flolyt changing your data", value: "impossible · the credential cannot write", tone: "ok" },
  { label: "An agent changing your data", value: "impossible · same credential, and no write tool exists", tone: "ok" },
  { label: "Reading more fields than agreed", value: "the scope is enforced at the connection, not in the app", tone: "ok" },
  { label: "Somebody at Flolyt reading your data", value: "not this · that is a different control, in Settings", tone: "warn" },
  { label: "A credential outliving its purpose", value: "nothing · they do not expire and rotation is manual", tone: "risk" },
];

// ───────────────────────── DS12 · HISTORY ───────────────────────────────────

export const DS12_HISTORY_ROWS: { when: string; what: string; by: string; effect: string; effectTone: DsTone; approved: string }[] = [
  { when: "2 Aug", what: "`releases` connected · 412 rows, six fields", by: "Sam", effect: "one causal finding, four hours later", effectTone: "ok", approved: "Ada" },
  { when: "28 Jul", what: "Requested: cost of goods and `order_lines`", by: "Ravi", effect: "still outstanding · 21 days", effectTone: "risk", approved: "—" },
  { when: "Jun", what: "`payments` credential rotated", by: "Sam", effect: "none · routine", effectTone: "muted", approved: "Ada" },
  { when: "6 Apr", what: "Requested: `checkout.fee_shown`", by: "Zainab", effect: "133 days · never built", effectTone: "risk", approved: "—" },
  { when: "Mar", what: "`orders` scope widened by one field", by: "Sam", effect: "discount work in Price became possible", effectTone: "ok", approved: "Ada" },
  { when: "12 Jan", what: "Cost of goods stopped delivering", by: "—", effect: "11 figures blocked, still", effectTone: "risk", approved: "—" },
  { when: "12 Dec", what: "First nine sources connected", by: "Sam", effect: "the workspace begins", effectTone: "ok", approved: "Ada" },
];

// ───────────────────────── DS13 · WIDEN A SCOPE (modal) ─────────────────────

export const DS13_UNBLOCKS: { label: string; sub: string; tone: DsTone }[] = [
  { label: "Three health signals", sub: "second order, support contact, discount use · 99% to complete", tone: "ok" },
  { label: "The Acquire line on the leakage map", sub: "currently Unavailable · 42,000 people unpriceable", tone: "ok" },
  { label: "42,000 people entering audiences", sub: "they can be reached for the first time", tone: "warn" },
  { label: "One funnel cohort", sub: "guest checkout stops being a row that reads Unavailable", tone: "ok" },
];

// ───────────────────────── DS14 · DISCONNECT A SOURCE (modal) ───────────────

export const DS14_HAPPENS: { label: string; sub: string; tone: DsTone }[] = [
  { label: "One funnel step disappears", sub: "“Saw the loyalty tier” · currently Unavailable", tone: "warn" },
  { label: "One constraint stays in memory", sub: "“`loyalty.tier_shown` has never fired” · cited twice", tone: "ok" },
  { label: "The credential is revoked", sub: "immediately · it cannot be reused", tone: "ok" },
  { label: "Nothing else changes", sub: "no figure depended on it, because it carried nothing", tone: "muted" },
];

// ───────────────────────── DS15 · A SOURCE THAT LIES (ad_spend) ─────────────

export const DS15_TIMELINE_ROWS: { when: string; what: string; effect: string; effectTone: DsTone }[] = [
  { when: "Dec – Jun", what: "Delivering daily, no gaps, no errors", effect: "looked perfect", effectTone: "muted" },
  { when: "11 Jun", what: "Data Integrity noticed spend fell 22% on the day agency billing changed", effect: "a shape, not an error", effectTone: "ai" },
  { when: "12 Jun", what: "Ravi confirmed agency fees were never in the export", effect: "always missing, not newly", effectTone: "risk" },
  { when: "12 Jun", what: "Every CAC figure since December restated upward by 22%", effect: "4 figures, 2 findings", effectTone: "warn" },
  { when: "12 Jun", what: "One learning superseded · paid social looked cheaper than it was", effect: "kept, with the reason", effectTone: "ok" },
];

// ───────────────────────── DS16 · WHAT FLOLYT READS ─────────────────────────

export const DS16_QUESTION_ROWS: { question: string; answer: string; enforcedWhere: string; checkable: string; checkableTone: DsTone }[] = [
  { question: "Can Flolyt write to any of our systems?", answer: "No · every credential is read-only", enforcedWhere: "the credential", checkable: "yes · here", checkableTone: "ok" },
  { question: "Can an agent write?", answer: "No · same credential, and no write tool exists", enforcedWhere: "the tool list", checkable: "yes · Governance", checkableTone: "ok" },
  { question: "Does Flolyt read personal data?", answer: "One field · the body of a support ticket", enforcedWhere: "the field scope", checkable: "yes · here", checkableTone: "ok" },
  { question: "Does it read card numbers?", answer: "No · the payments scope excludes them", enforcedWhere: "the field scope", checkable: "yes · here", checkableTone: "ok" },
  { question: "Does it copy our data out?", answer: "It reads into this workspace · it exports nothing", enforcedWhere: "the export controls", checkable: "yes · Settings", checkableTone: "ok" },
  { question: "Do other companies see any of it?", answer: "No · methods travel in Community, figures never do", enforcedWhere: "Community", checkable: "yes · Community", checkableTone: "ok" },
  { question: "Does Flolyt staff read it?", answer: "A separate control · not answered on this screen", enforcedWhere: "Settings", checkable: "in Settings", checkableTone: "warn" },
];

export const DS16_PERSONAL_FIELD_KV: { label: string; value: string; tone?: DsTone }[] = [
  { label: "What", value: "`tickets.body` · the words a customer wrote" },
  { label: "Read by", value: "Support Signal · one agent of twelve", tone: "warn" },
  { label: "Why", value: "a contact driver cannot be derived from metadata", tone: "ok" },
  { label: "What it produced", value: "31% of tickets were about the fee · the earliest correct signal", tone: "ok" },
  { label: "How to remove it", value: "Governance · revoke the field · three things stop working", tone: "muted" },
];

// ───────────────────────── DS17 · SETTINGS ───────────────────────────────────

export const DS17_RULE_ROWS: { rule: string; currently: string; currentlyTone: DsTone; who: string; canChange: boolean; state: string; stateTone: DsTone }[] = [
  { rule: "Every credential is read-only", currently: "10", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Access is granted per field, not per table", currently: "94 fields", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A stopped source produces Unavailable, not stale", currently: "after 48h", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Restatements are published when a source is corrected", currently: "1 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Who may connect a source", currently: "Sam, with approval", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who may widen a scope", currently: "Sam, with approval", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Credential rotation", currently: "manual", currentlyTone: "warn", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Flolyt writing to a source", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Carrying a stale figure forward silently", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Taking every field a source offers", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const DS17_ELSEWHERE_KV: { label: string; value: string; tone: DsTone }[] = [
  { label: "Data health", value: "freshness, gaps and what is degraded right now", tone: "ai" },
  { label: "Schema", value: "the fields themselves, and what has changed", tone: "ai" },
  { label: "Identity", value: "the 42,000 orders that cannot be joined to anybody", tone: "ai" },
  { label: "Governance", value: "which agent reads which field, and the review", tone: "ok" },
  { label: "Everywhere else", value: "every Unavailable in this product names a row on this screen", tone: "ok" },
];
