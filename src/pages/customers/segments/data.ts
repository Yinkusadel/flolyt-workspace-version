import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, AMARA, IFEOMA, KUNLE, RAVI, ZAINAB } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Customers · Segments — sourced from
 * flolyt-figma-designs/Customers Screens/flolyt-segments/flolyt-segments/
 * (16 frames, SG01-SG16). Content transcribed from the export's own `sg.py`
 * generator source, same approach as the Revenue sections. See
 * docs/build-tracker.md.
 */

export type SgTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const SG_TONE_CLASS: Record<SgTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const SG_CHIP_TONE: Record<SgTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const SG_KPI_TONE: Record<SgTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type SegmentsState = "empty" | "first" | "full";
export const SEGMENTS_STATE: SegmentsState = "full";

export const SG_TABS = ["All segments", "Reachability", "Overlap", "Drift", "Retired"] as const;
export type SgTab = (typeof SG_TABS)[number];

// ───────────────────────── SG01 · NO SEGMENTS YET ─────────────────────────

export const SG01_OBSERVATION_ROWS: {
  observation: string;
  agent: AgentRef;
  size: string;
  sizeTone: SgTone;
  wouldSegment: string;
  wouldSegmentTone: SgTone;
  whyNot: string;
  whyNotTone: SgTone;
}[] = [
  {
    observation: "Customers using two features behave differently",
    agent: { initials: "RD", name: "Repeat & Decay" },
    size: "89,000",
    sizeTone: "num",
    wouldSegment: "probably",
    wouldSegmentTone: "warn",
    whyNot: "nobody has said what for",
    whyNotTone: "muted",
  },
  {
    observation: "A cluster stopped ordering in the same fortnight",
    agent: { initials: "RD", name: "Repeat & Decay" },
    size: "148,000",
    sizeTone: "warn",
    wouldSegment: "probably",
    wouldSegmentTone: "warn",
    whyNot: "no room, no owner",
    whyNotTone: "muted",
  },
  {
    observation: "Guest-checkout orders cannot be joined to anyone",
    agent: { initials: "AQ", name: "Acquisition Quality" },
    size: "42,000",
    sizeTone: "risk",
    wouldSegment: "never",
    wouldSegmentTone: "risk",
    whyNot: "no identity to group by",
    whyNotTone: "risk",
  },
  {
    observation: "Card failures cluster at midnight",
    agent: { initials: "IC", name: "Involuntary Churn" },
    size: "21,400",
    sizeTone: "num",
    wouldSegment: "probably",
    wouldSegmentTone: "warn",
    whyNot: "nobody has said what for",
    whyNotTone: "muted",
  },
];

// ───────────────────────── SG02 · THE FIRST SEGMENT ─────────────────────────

export const SG02_STATS: { eyebrow: string; value: string; note: string; tone: SgTone }[] = [
  { eyebrow: "Matched the definition", value: "148,000", note: "the agent's cluster", tone: "num" },
  { eyebrow: "In the segment", value: "100,000", note: "reachable, and she said so", tone: "ok" },
  { eyebrow: "Excluded and named", value: "48,000", note: "guest checkout and opt-outs", tone: "warn" },
  { eyebrow: "Decaying", value: "4,100 a day", note: "past the 90-day boundary", tone: "risk" },
];

export const SG02_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "A segment is a written definition", value: "not a saved filter · it has an author, a date and a purpose" },
  { label: "Matched and included are different numbers", value: "both shown, always · the gap is the interesting part", tone: "ok" },
  { label: "Exclusions are named, not silently applied", value: "48,000 people with a reason each", tone: "ok" },
  { label: "It says what it is for", value: "the Retain room · a segment with no use is retired, not kept", tone: "warn" },
  { label: "It decays", value: "4,100 a day age out · the size on this screen is today's", tone: "risk" },
];

// ───────────────────────── SG03 · ALL SEGMENTS ─────────────────────────

export type SegmentListState = "in-use" | "unused" | "frozen" | "retired" | "count-only";

export type SegmentRow = {
  id: string;
  name: string;
  matched: string;
  matchedTone: SgTone;
  included: string;
  includedTone: SgTone;
  excluded: string;
  excludedTone: SgTone;
  usedFor: string;
  owner: string;
  ownerTone: SgTone;
  state: string;
  stateTone: SgTone;
  listState: SegmentListState;
  /** Only these three rows have a wired row action, matching the export's own three modal frames (SG12/13/14). */
  rowAction?: "freeze" | "retire" | "use";
};

export const SG03_STATS: { eyebrow: string; value: string; note: string; tone: SgTone }[] = [
  { eyebrow: "Defined", value: "34", note: "by 7 people", tone: "num" },
  { eyebrow: "In use by a room or a play", value: "11", note: "the rest are unused", tone: "warn" },
  { eyebrow: "Frozen", value: "6", note: "definition locked mid-experiment", tone: "ai" },
  { eyebrow: "Retired", value: "3", note: "kept, readable, unusable", tone: "muted" },
];

export const SEGMENT_ROWS: SegmentRow[] = [
  {
    id: "lapsed-fee",
    name: "Lapsed after the fee change",
    matched: "148,000",
    matchedTone: "num",
    included: "100,000",
    includedTone: "ok",
    excluded: "48,000",
    excludedTone: "warn",
    usedFor: "Retain · room 8f2c",
    owner: "Ifeoma",
    ownerTone: "muted",
    state: "in use",
    stateTone: "ai",
    listState: "in-use",
    rowAction: "freeze",
  },
  {
    id: "two-features-week-one",
    name: "Two features in week one",
    matched: "89,000",
    matchedTone: "num",
    included: "89,000",
    includedTone: "ok",
    excluded: "—",
    excludedTone: "muted",
    usedFor: "Nothing · no owner for Adopt",
    owner: "nobody",
    ownerTone: "risk",
    state: "unused",
    stateTone: "risk",
    listState: "unused",
    rowAction: "use",
  },
  {
    id: "card-failed-renewal-night",
    name: "Card failed on renewal night",
    matched: "21,400",
    matchedTone: "num",
    included: "19,260",
    includedTone: "ok",
    excluded: "2,140",
    excludedTone: "warn",
    usedFor: "Renew · closed room",
    owner: "Ravi",
    ownerTone: "muted",
    state: "frozen",
    stateTone: "ai",
    listState: "frozen",
  },
  {
    id: "discount-only-buyers",
    name: "Discount-only buyers",
    matched: "47,000",
    matchedTone: "num",
    included: "45,100",
    includedTone: "ok",
    excluded: "1,900",
    excludedTone: "warn",
    usedFor: "Price · closed room",
    owner: "Ravi",
    ownerTone: "muted",
    state: "frozen",
    stateTone: "ai",
    listState: "frozen",
  },
  {
    id: "ghana-starter-plan",
    name: "Ghana starter plan",
    matched: "88,000",
    matchedTone: "num",
    included: "88,000",
    includedTone: "ok",
    excluded: "—",
    excludedTone: "muted",
    usedFor: "Nothing · scenario S-097, blocked",
    owner: "Kunle",
    ownerTone: "muted",
    state: "unused",
    stateTone: "warn",
    listState: "unused",
  },
  {
    id: "referred-by-a-customer",
    name: "Referred by a customer",
    matched: "124,000",
    matchedTone: "num",
    included: "118,900",
    includedTone: "ok",
    excluded: "5,100",
    excludedTone: "warn",
    usedFor: "Nothing · Advocate has no owner",
    owner: "nobody",
    ownerTone: "risk",
    state: "unused",
    stateTone: "risk",
    listState: "unused",
  },
  {
    id: "guest-checkout",
    name: "Guest checkout",
    matched: "42,000",
    matchedTone: "warn",
    included: "0",
    includedTone: "risk",
    excluded: "42,000",
    excludedTone: "risk",
    usedFor: "Counting only · can never be contacted",
    owner: "data",
    ownerTone: "muted",
    state: "count only",
    stateTone: "neutral",
    listState: "count-only",
  },
  {
    id: "lagos-order-failed-march",
    name: "Lagos, order failed in March",
    matched: "3,100",
    matchedTone: "num",
    included: "3,100",
    includedTone: "ok",
    excluded: "—",
    excludedTone: "muted",
    usedFor: "Support · closed room",
    owner: "Amara",
    ownerTone: "muted",
    state: "retired",
    stateTone: "muted",
    listState: "retired",
    rowAction: "retire",
  },
];

export const SG03_NOTE =
  "Two of the unused ones are the largest behavioural groups in the workspace — 89,000 customers whose feature depth predicts repeat better than anything else, and 124,000 referrers at ₦0 acquisition cost. Both are unused for the same reason: the stages they belong to have no owner. A segment library fills up faster than the org can act on it, and this column is where that becomes visible.";

export const SG03_CANNOT_BE_ROWS: { label: string; value: string; tone: SgTone }[] = [
  { label: "A single customer", value: "the minimum is 100 · a group of one is an account, and rooms are about cohorts", tone: "risk" },
  { label: "An unwritten filter", value: "a saved query with no author, purpose or date is not offered", tone: "risk" },
  { label: "Silently resized", value: "if a definition changes, the old one is kept and both sizes are shown", tone: "ok" },
  { label: "Shared without its exclusions", value: "the excluded count travels with every export", tone: "ok" },
];

// ───────────────────────── SG04 · ONE SEGMENT ─────────────────────────

export const SG04_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "Who is in", value: "ordered at least twice before 4 March, and not once since" },
  { label: "The window", value: "4 March to today · 151 days" },
  { label: "Markets", value: "Nigeria and Kenya · the two that received the change" },
  { label: "Written by", value: "Ifeoma Nwosu · 2 August · unchanged since" },
  { label: "What it is for", value: "room 8f2c · Second order never happened" },
  { label: "What would retire it", value: "the room closing, or the 90-day boundary emptying it", tone: "warn" },
];

export const SG04_EXCLUDED_ROWS: { excluded: string; people: string; peopleTone: SgTone; why: string; setBy: string; couldChange: string; couldChangeTone: SgTone }[] = [
  { excluded: "Guest checkout", people: "42,000", peopleTone: "risk", why: "No customer record to attach an order to", setBy: "data", couldChange: "one field would fix it", couldChangeTone: "warn" },
  { excluded: "Opted out of contact", people: "6,100", peopleTone: "warn", why: "Consent · applies to being studied too", setBy: "product", couldChange: "no", couldChangeTone: "risk" },
  { excluded: "Open complaint", people: "—", peopleTone: "muted", why: "None in this segment · checked nightly", setBy: "product", couldChange: "no", couldChangeTone: "risk" },
  { excluded: "Already in two other segments in use", people: "—", peopleTone: "muted", why: "None · checked at every send", setBy: "product", couldChange: "no", couldChangeTone: "risk" },
];

// ───────────────────────── SG05 · REACHABILITY ─────────────────────────

export const SG05_BAR_ROWS: { label: string; count: number; tone: SgTone }[] = [
  { label: "Reachable · a valid channel and consent", count: 3679900, tone: "ok" },
  { label: "Suppressed · inactive over 18 months", count: 254000, tone: "muted" },
  { label: "No valid channel · bounced or dead", count: 218000, tone: "warn" },
  { label: "Opted out of contact", count: 6100, tone: "warn" },
  { label: "Guest checkout · no identity at all", count: 42000, tone: "risk" },
];

export const SG05_TERM_ROWS: { term: string; meaning: string; count: string; usedFor: string }[] = [
  { term: "Reachable", meaning: "A valid channel, consent, and not suppressed", count: "3,679,900", usedFor: "audiences and holdouts" },
  { term: "Measurable", meaning: "Can be joined to orders · reachable or not", count: "4,158,000", usedFor: "every figure in Revenue" },
  { term: "Identifiable", meaning: "Has a customer record at all", count: "4,158,000", usedFor: "segments and cohorts" },
  { term: "Counted", meaning: "Exists in the base", count: "4,200,000", usedFor: "nothing else" },
];

// ───────────────────────── SG06 · OVERLAP ─────────────────────────

export const SG06_STATS: { eyebrow: string; value: string; note: string; tone: SgTone }[] = [
  { eyebrow: "In more than one segment in use", value: "41,300", note: "across 4 rooms", tone: "warn" },
  { eyebrow: "In three or more", value: "2,900", note: "excluded from all holdouts", tone: "risk" },
  { eyebrow: "Contacted twice in seven days", value: "0", note: "the cap holds", tone: "ok" },
  { eyebrow: "Suppressed by the cap this week", value: "6,400", note: "and told to nobody", tone: "warn" },
];

export const SG06_ROWS: { overlap: string; people: string; peopleTone: SgTone; segments: string; whatHappens: string; whoDecided: string }[] = [
  { overlap: "Lapsed ∩ discount-only", people: "22,800", peopleTone: "warn", segments: "Retain and Price", whatHappens: "First send wins · second is suppressed", whoDecided: "Ada · standing rule" },
  { overlap: "Lapsed ∩ card failed", people: "9,200", peopleTone: "num", segments: "Retain and Renew", whatHappens: "Renew wins · payment beats marketing", whoDecided: "Ada · standing rule" },
  { overlap: "Referred ∩ two features", people: "6,400", peopleTone: "num", segments: "Advocate and Adopt", whatHappens: "Neither · both segments are unused", whoDecided: "nobody" },
  { overlap: "In three or more", people: "2,900", peopleTone: "risk", segments: "Four segments", whatHappens: "Excluded from every holdout", whoDecided: "product · not overridable" },
];

// ───────────────────────── SG07 · DRIFT ─────────────────────────

export const SG07_ROWS: { segment: string; then: string; now: string; change: string; changeTone: SgTone; why: string; edited: string; editedTone: SgTone }[] = [
  { segment: "Lapsed after the fee change", then: "148,000", now: "100,000", change: "−32%", changeTone: "risk", why: "The 90-day boundary · 4,100 a day", edited: "no", editedTone: "ok" },
  { segment: "Two features in week one", then: "61,000", now: "89,000", change: "+46%", changeTone: "ok", why: "More weeks have happened · it accumulates", edited: "no", editedTone: "ok" },
  { segment: "Discount-only buyers", then: "47,000", now: "31,200", change: "−34%", changeTone: "warn", why: "The code was withdrawn on 28 March", edited: "no", editedTone: "ok" },
  { segment: "Reached value in 30 days", then: "104,000", now: "71,000", change: "−32%", changeTone: "risk", why: "The window was narrowed on 11 July", edited: "yes · 11 Jul", editedTone: "risk" },
  { segment: "Ghana starter plan", then: "88,000", now: "88,000", change: "0%", changeTone: "muted", why: "Nothing has happened in this market", edited: "no", editedTone: "ok" },
];

export const SG07_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "A frozen segment does not drift", value: "6 are frozen · their definition and membership are locked", tone: "ai" },
  { label: "A running holdout uses the frozen list", value: "the people held on day one are the people held on day nine", tone: "ok" },
  { label: "An unfrozen segment in a play", value: "resolves at send · which is why audiences and segments differ", tone: "warn" },
  { label: "Reported sizes carry their date", value: "every export says when the count was taken", tone: "ok" },
  { label: "Nothing is recomputed retroactively", value: "yesterday's send reached yesterday's list, permanently", tone: "ok" },
];

// ───────────────────────── SG08 · SEARCH ─────────────────────────

export const SG08_RESULT_ROWS: { result: string; kind: string; kindTone: SgTone; size: string; sizeTone: SgTone; state: string; why: string }[] = [
  { result: "Lapsed after the fee change", kind: "segment", kindTone: "ai", size: "100,000", sizeTone: "ok", state: "in use", why: "name" },
  { result: "Lapsed · Kenya only", kind: "segment", kindTone: "ai", size: "14,900", sizeTone: "num", state: "unused", why: "name" },
  { result: "Lapsed · Q1, superseded", kind: "retired", kindTone: "neutral", size: "81,000", sizeTone: "muted", state: "retired 2 Aug", why: "name" },
  { result: "Second order never happened", kind: "room", kindTone: "neutral", size: "100,000", sizeTone: "ok", state: "open", why: "uses a lapsed segment" },
  { result: "Reactivation · wave three", kind: "play", kindTone: "warn", size: "52,000", sizeTone: "warn", state: "held", why: "draws from it" },
  { result: "“lapsed” has no agreed definition here", kind: "note", kindTone: "neutral", size: "—", sizeTone: "muted", state: "—", why: "knowledge" },
];

export const SG08_FILTER_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "State", value: "in use · unused · frozen · retired · count-only" },
  { label: "Size", value: "any · the minimum a segment can be is 100 people", tone: "muted" },
  { label: "Owner", value: "seven people · plus “nobody”, which returns four", tone: "warn" },
  { label: "Has a purpose", value: "yes / no · the “no” filter returns 23 of 34", tone: "risk" },
  { label: "Hide retired", value: "not offered · a retired segment still explains an old number", tone: "risk" },
];

// ───────────────────────── SG09 · NEW · WHO IS IN IT ─────────────────────────

export const SG09_STATS: { eyebrow: string; value: string; note: string; tone: SgTone }[] = [
  { eyebrow: "Matches today", value: "162,000", note: "3.9% of the base", tone: "num" },
  { eyebrow: "Reachable of those", value: "148,600", note: "13,400 are not", tone: "warn" },
  { eyebrow: "Repeat rate in this group", value: "12.8%", note: "against 27.2% overall", tone: "risk" },
  { eyebrow: "Confidence in the definition", value: "5 / 5", note: "one field, no interpretation", tone: "ok" },
];

export const SG09_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "The gap it describes", value: "12.8% against 70.2% for people who used two features", tone: "risk" },
  { label: "What that is in money", value: "Unavailable · nobody has priced Adopt", tone: "muted" },
  { label: "Who owns the stage it belongs to", value: "nobody · Adopt has had no owner for 214 days", tone: "risk" },
  { label: "What it could be used for", value: "a prompt, a test, or an argument for giving Adopt an owner" },
  { label: "What it must not be used for", value: "a health score · one signal is not a verdict", tone: "warn" },
];

// ───────────────────────── SG10 · NEW · WHO IS LEFT OUT ─────────────────────────

export const SG10_AUTO_EXCLUDED_ROWS: { excluded: string; people: string; peopleTone: SgTone; why: string; setBy: string; overridable: string }[] = [
  { excluded: "Guest checkout", people: "2,100", peopleTone: "warn", why: "No customer record to group", setBy: "data", overridable: "no" },
  { excluded: "Opted out of contact", people: "4,900", peopleTone: "warn", why: "Consent covers being studied too", setBy: "product", overridable: "no" },
  { excluded: "Open complaint", people: "1,840", peopleTone: "warn", why: "Measurement is not a reason to ignore somebody", setBy: "product", overridable: "no" },
  { excluded: "Owed a refund", people: "410", peopleTone: "muted", why: "Money owed is not an experimental condition", setBy: "product", overridable: "no" },
  { excluded: "Suppressed · inactive 18 months", people: "4,150", peopleTone: "muted", why: "Ada's suppression policy", setBy: "Ada", overridable: "by Ada" },
];

export const SG10_MANUAL_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "Under 14 days since signup", value: "3,200 · they have not had thirty days yet", tone: "ok" },
  { label: "Ghana", value: "18,400 · the fee ships there on 14 September and would confound it", tone: "warn" },
  { label: "Anyone in the reactivation holdout", value: "not offered here · holdout membership is decided at send, not now", tone: "muted" },
  { label: "Anything else you want to exclude", value: "requires a typed reason · it travels with the segment", tone: "ok" },
];

// ───────────────────────── SG11 · NEW · REVIEW ─────────────────────────

export const SG11_NEAR_MATCH_ROWS: { name: string; size: string; howDiffers: string; overlap: string; overlapTone: SgTone; suggestion: string; suggestionTone: SgTone }[] = [
  { name: "Two features in week one", size: "89,000", howDiffers: "This is broadly its inverse, on a 30-day window not 7", overlap: "1,200", overlapTone: "muted", suggestion: "not a duplicate", suggestionTone: "ok" },
  { name: "Reached value in 30 days", size: "71,000", howDiffers: "Different signal · orders, not features", overlap: "41,000", overlapTone: "warn", suggestion: "check the purpose", suggestionTone: "warn" },
];

export const SG11_KV_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "A name", value: "Single-feature customers at day 30 · yours to change" },
  { label: "What it is for", value: "“Nothing yet — this is an argument for giving Adopt an owner”", tone: "warn" },
  { label: "Who owns it", value: "Zainab Yusuf · she owns Adopt on paper even without a goal" },
  { label: "Review date", value: "1 October · a segment with no purpose is reviewed, not deleted", tone: "ok" },
  { label: "Frozen?", value: "no · it will drift as more people reach day thirty", tone: "muted" },
];

// ───────────────────────── SG12 · FREEZE (modal preset) ─────────────────────────

export const SG12_FREEZE_PRESET = {
  subject: "Lapsed after the fee change",
  subjectDetail: "100,000 today · 4,100 leaving a day · used by room 8f2c",
  effects: [
    { label: "Membership is fixed at today's list", sub: "100,000 people, by ID, for as long as it is frozen", tone: "ok" as SgTone },
    { label: "It stops decaying", sub: "the 4,100 a day keep ageing out of the world, not the list", tone: "warn" as SgTone },
    { label: "The holdout becomes stable", sub: "the people held on day one are held on day nine", tone: "ok" as SgTone },
    { label: "The list goes stale", sub: "in three weeks it contains 86,000 people who no longer match", tone: "risk" as SgTone },
  ],
  untilOptions: [
    { label: "Until the holdout closes", sub: "21 August · 12 days · the reason you are freezing it", selected: true, blocked: false },
    { label: "A date you choose", sub: "any date · it thaws itself and says so", selected: false, blocked: false },
    { label: "Indefinitely", sub: "not offered · a permanent freeze is a retired segment", selected: false, blocked: true },
  ],
  closingNote:
    "Every play drawing from this list while it is frozen will reach people who have since stopped matching. That is the correct trade for twelve days of a clean holdout and a bad idea on day forty, which is why the freeze has to end on a date somebody chose.",
};

// ───────────────────────── SG13 · RETIRE (modal preset + retired tab) ─────────────────────────

export const SG13_RETIRED_ROWS: { name: string; sizeAtRetirement: string; retired: string; why: string; stillReadable: string }[] = [
  { name: "Lapsed · Q1, superseded", sizeAtRetirement: "81,000", retired: "2 Aug", why: "Replaced by a dated definition", stillReadable: "yes" },
  { name: "Weekend orderers", sizeAtRetirement: "204,000", retired: "17 Mar", why: "Never used · reviewed and dropped", stillReadable: "yes" },
];

export const SG13_RETIRE_PRESET = {
  subject: "Lagos, order failed in March",
  subjectDetail: "3,100 people · used by one room, closed 21 March",
  reason:
    "The room closed in March and every order was refunded. Nobody should build an audience of people we already apologised to.",
  effects: [
    { label: "It cannot be used in a play or a room again", sub: "the only thing that actually changes", tone: "ok" as SgTone },
    { label: "It stays readable, permanently", sub: "with its definition, size and this reason", tone: "ok" as SgTone },
    { label: "Closed rooms keep pointing at it", sub: "the ₦9M Lagos figure still resolves to these 3,100 people", tone: "ok" as SgTone },
    { label: "It is not deleted", sub: "a deleted segment makes an old number unexplainable", tone: "risk" as SgTone },
    { label: "It can be un-retired", sub: "by a person, with a reason, and both are kept", tone: "muted" as SgTone },
  ],
  closingNote:
    "Three segments are retired and all three are still doing work — they are what a closed room's numbers mean. The reason this is a typed field rather than a delete button is that in November somebody will ask who the 3,100 were, and “Amara retired it because we had already apologised to them” is the answer.",
};

// ───────────────────────── SG14 · USE A SEGMENT (modal preset) ─────────────────────────

export const SG14_USE_PRESET = {
  subject: "Two features in week one",
  subjectDetail: "89,000 people · unused since 6 April · no owner for Adopt",
  actions: [
    { label: "Open a room about it", sub: "a cohort and a named person · the room is about the group", selected: true, blocked: false },
    { label: "Use it as a comparison group", sub: "in Benchmarks · against the single-feature segment", selected: false, blocked: false },
    { label: "Send something to it", sub: "not from here · a play needs a room, a holdout and an approver", selected: false, blocked: true },
    { label: "Export the list of people", sub: "not offered · a segment is a definition, not a spreadsheet", selected: false, blocked: true },
  ],
  warningTitle: "Opening a room means naming somebody, and Adopt has nobody",
  warningBody: "Zainab owns the stage on paper. She has eight rooms and no goal here. The room cannot be opened without her agreeing to it.",
  closingNote:
    "A segment leaves this product as a definition and a count, never as a list of names. It is the difference between a workspace where cohorts are reasoned about and one where lists get emailed around, and it is enforced here rather than in a policy document.",
};

// ───────────────────────── SG15 · SETTINGS ─────────────────────────

export const SG15_RULE_ROWS: { rule: string; currently: string; who: string; canChange: boolean; state: string; stateTone: SgTone }[] = [
  { rule: "A segment has an author, a date and a purpose", currently: "34", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Matched and included are both shown", currently: "34", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Exclusions are named, never silent", currently: "9 kinds", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Retired segments stay readable", currently: "3", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Minimum segment size", currently: "100", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Suppression after inactivity", currently: "18 months", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Frequency cap", currently: "1 in 7 days", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Review date on purposeless segments", currently: "90 days", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "A segment of one customer", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Exporting the people in a segment", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Agents defining segments", currently: "—", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const SG15_USED_ELSEWHERE_ROWS: { label: string; value: string; tone?: SgTone }[] = [
  { label: "Rooms", value: "a room is about a cohort · that cohort is a segment", tone: "ai" },
  { label: "Campaigns", value: "an audience is a segment resolved at send, minus the caps", tone: "warn" },
  { label: "Experiments", value: "holdouts are drawn from a frozen segment, never a live one", tone: "ok" },
  { label: "Benchmarks", value: "cohort comparisons name the segments on both sides", tone: "ok" },
  { label: "Revenue", value: "the value ledger never names people · only the segment", tone: "ok" },
];

// ───────────────────────── People reused across screens ─────────────────────────

export const SG_PEOPLE: Record<string, PersonRef | undefined> = {
  Ifeoma: IFEOMA,
  Ravi: RAVI,
  Kunle: KUNLE,
  Amara: AMARA,
  Ada: ADA,
  Zainab: ZAINAB,
};
