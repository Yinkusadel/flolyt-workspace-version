import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { AgentRef } from "@/pages/everyday/rooms/types";

/**
 * Agents · AI Teammates — sourced from
 * flolyt-figma-designs/Agents Screens/flolyt-ai-teammates/flolyt-ai-teammates/
 * (18 frames, TM01-TM18). Content transcribed from the export's own `tm.py`
 * generator source, same approach as attribution/benchmarks/forecast. See
 * docs/build-tracker.md.
 */

export type TmTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const TM_TONE_CLASS: Record<TmTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const TM_CHIP_TONE: Record<TmTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const TM_KPI_TONE: Record<TmTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const TM_BAR_TONE: Record<TmTone, BarTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type TeammatesState = "nothing" | "first" | "full";
export const TEAMMATES_STATE: TeammatesState = "full";

export const TM_TABS = ["The roster", "Reading now", "Coverage", "Disagreements", "Paused", "What they cost"] as const;
export type TmTab = (typeof TM_TABS)[number];

// The twelve agents.
export const MO: AgentRef = { initials: "MO", name: "Orchestrator" };
export const RD: AgentRef = { initials: "RD", name: "Repeat & Decay" };
export const AC: AgentRef = { initials: "AC", name: "Activation" };
export const IC: AgentRef = { initials: "IC", name: "Involuntary Churn" };
export const PR: AgentRef = { initials: "PR", name: "Product Reason" };
export const AQ: AgentRef = { initials: "AQ", name: "Acquisition Quality" };
export const PX: AgentRef = { initials: "PX", name: "Price & Margin" };
export const CH: AgentRef = { initials: "CH", name: "Churn Reason" };
export const EX: AgentRef = { initials: "EX", name: "Expansion" };
export const SU: AgentRef = { initials: "SU", name: "Support Signal" };
export const AS: AgentRef = { initials: "AS", name: "Attribution Signal" };
export const DI: AgentRef = { initials: "DI", name: "Data Integrity" };

// ───────────────────────── TM01 · NOBODY IS READING YET ─────────────────────────

export const TM01_TABLE: { itWill: string; always: TmTone; itWillNever: string; ever: TmTone }[] = [
  { itWill: "Read the sources you connect", always: "ok", itWillNever: "Send a message to a customer", ever: "risk" },
  { itWill: "State a finding with a claim type", always: "ok", itWillNever: "Approve a play", ever: "risk" },
  { itWill: "Route it to a named person", always: "ok", itWillNever: "Open a room on its own", ever: "risk" },
  { itWill: "Say when it cannot tell", always: "ok", itWillNever: "Change a threshold", ever: "risk" },
  { itWill: "Stop when its source fails", always: "ok", itWillNever: "Write a learning about customers", ever: "risk" },
];

// ───────────────────────── TM02 · THE FIRST AGENT ─────────────────────────

export const TM02_STATS: { eyebrow: string; value: string; note: string; tone: TmTone }[] = [
  { eyebrow: "Rows read", value: "4.2M", note: "in three hours", tone: "num" },
  { eyebrow: "Findings so far", value: "0", note: "and it says why", tone: "muted" },
  { eyebrow: "Cost", value: "₦54", note: "three runs at ₦18", tone: "muted" },
  { eyebrow: "Can it act?", value: "No", note: "not now, not later", tone: "muted" },
];

export const TM02_KV: { label: string; value: string; tone?: TmTone }[] = [
  { label: "What it noticed", value: "the second-order curve flattens around day 90", tone: "ai" },
  { label: "Why it is not a finding", value: "no baseline · everything is a comparison and there is nothing to compare to", tone: "warn" },
  { label: "When it becomes one", value: "1 January, when the baseline locks", tone: "muted" },
  { label: "What it will say then", value: "a rate, an n, a claim type, and who it routes to", tone: "ok" },
  { label: "What it will not say", value: "what to do about it · that is a proposal, and it needs a room", tone: "ai" },
];

// ───────────────────────── TM03 · THE ROSTER ─────────────────────────

export const TM03_STATS: { eyebrow: string; value: string; note: string; tone: TmTone }[] = [
  { eyebrow: "Agents", value: "12", note: "9 stages of 10 covered", tone: "num" },
  { eyebrow: "Reading now", value: "3", note: "one run has a redirect queued", tone: "ai" },
  { eyebrow: "Paused", value: "2", note: "and they do not guess", tone: "warn" },
  { eyebrow: "Findings this quarter", value: "141", note: "97 routed to a person", tone: "warn" },
];

export const TM03_ROWS: {
  agent: AgentRef;
  watches: string;
  role: string;
  findings: string;
  findingsTone: TmTone;
  rooms: string;
  roomsTone: TmTone;
  state: string;
  stateTone: TmTone;
}[] = [
  { agent: RD, watches: "Repeat rate, second orders, segment drift", role: "lead · Retain", findings: "19", findingsTone: "ok", rooms: "11", roomsTone: "ok", state: "reading", stateTone: "ai" },
  { agent: AC, watches: "Time to first value, checkout events", role: "lead · Activate", findings: "14", findingsTone: "num", rooms: "3", roomsTone: "num", state: "paused 04:12", stateTone: "risk" },
  { agent: IC, watches: "Failed payments, retry outcomes", role: "lead · Renew", findings: "12", findingsTone: "num", rooms: "5", roomsTone: "num", state: "reading", stateTone: "ai" },
  { agent: PR, watches: "Feature use, depth, onboarding paths", role: "lead · Adopt", findings: "19", findingsTone: "ok", rooms: "0", roomsTone: "risk", state: "reading", stateTone: "ai" },
  { agent: AQ, watches: "Channel mix, cohort quality, CAC", role: "lead · Acquire", findings: "11", findingsTone: "num", rooms: "2", roomsTone: "num", state: "idle", stateTone: "muted" },
  { agent: PX, watches: "Prices, plans, discounts, margin", role: "lead · Price", findings: "8", findingsTone: "num", rooms: "3", roomsTone: "num", state: "paused · no COGS", stateTone: "risk" },
  { agent: CH, watches: "Churn reasons, win-back response", role: "lead · Churn", findings: "17", findingsTone: "ok", rooms: "0", roomsTone: "risk", state: "idle", stateTone: "muted" },
  { agent: SU, watches: "Contact drivers, reply themes", role: "lead · Support", findings: "13", findingsTone: "num", rooms: "7", roomsTone: "ok", state: "idle", stateTone: "muted" },
  { agent: AS, watches: "Holdouts, overlap, what caused what", role: "across stages", findings: "9", findingsTone: "num", rooms: "1", roomsTone: "num", state: "idle", stateTone: "muted" },
  { agent: MO, watches: "Conflicts between two agents", role: "arbitrating", findings: "0", findingsTone: "muted", rooms: "0", roomsTone: "muted", state: "cannot propose", stateTone: "neutral" },
];

// ───────────────────────── TM04 · COVERAGE ─────────────────────────

export const TM04_ROWS: {
  stage: string;
  agent: AgentRef | null;
  owner: string;
  ownerTone: TmTone;
  findings: string;
  findingsTone: TmTone;
  rooms: string;
  roomsTone: TmTone;
  where: string;
  whereTone: TmTone;
}[] = [
  { stage: "Acquire", agent: AQ, owner: "Tunde", ownerTone: "muted", findings: "11", findingsTone: "num", rooms: "2", roomsTone: "num", where: "a person", whereTone: "ok" },
  { stage: "Activate", agent: AC, owner: "Zainab", ownerTone: "muted", findings: "14", findingsTone: "num", rooms: "3", roomsTone: "num", where: "a person", whereTone: "ok" },
  { stage: "Adopt", agent: PR, owner: "nobody", ownerTone: "risk", findings: "19", findingsTone: "warn", rooms: "0", roomsTone: "risk", where: "an empty field", whereTone: "risk" },
  { stage: "Retain", agent: RD, owner: "Ifeoma", ownerTone: "muted", findings: "19", findingsTone: "num", rooms: "11", roomsTone: "ok", where: "a person", whereTone: "ok" },
  { stage: "Expand", agent: EX, owner: "Tunde", ownerTone: "muted", findings: "6", findingsTone: "num", rooms: "4", roomsTone: "num", where: "a person", whereTone: "ok" },
  { stage: "Price", agent: PX, owner: "Ravi", ownerTone: "muted", findings: "8", findingsTone: "num", rooms: "3", roomsTone: "num", where: "a person", whereTone: "ok" },
  { stage: "Support", agent: SU, owner: "Amara", ownerTone: "muted", findings: "13", findingsTone: "num", rooms: "7", roomsTone: "ok", where: "a person", whereTone: "ok" },
  { stage: "Renew", agent: IC, owner: "Kunle", ownerTone: "muted", findings: "12", findingsTone: "num", rooms: "5", roomsTone: "num", where: "a person", whereTone: "ok" },
  { stage: "Churn", agent: CH, owner: "nobody", ownerTone: "risk", findings: "17", findingsTone: "warn", rooms: "0", roomsTone: "risk", where: "an empty field", whereTone: "risk" },
  { stage: "Advocate", agent: null, owner: "nobody", ownerTone: "risk", findings: "0", findingsTone: "muted", rooms: "0", roomsTone: "muted", where: "nowhere · nothing reads it", whereTone: "risk" },
];

// ───────────────────────── TM05 · READING NOW ─────────────────────────

export const TM05_RUNS: { label: string; sub: string; done: number; total: number; tone: TmTone }[] = [
  { label: "Repeat & Decay · attribution split", sub: "turn 4 of 6 · 4.3M rows · 3m 41s · ₦18", done: 4, total: 6, tone: "ai" },
  { label: "Involuntary Churn · Kenya retry close-out", sub: "turn 2 of 3 · 84k rows · 41s · ₦4", done: 2, total: 3, tone: "ai" },
  { label: "Data Integrity · nightly source check", sub: "turn 1 of 2 · 12 sources · 8s · ₦1", done: 1, total: 2, tone: "ok" },
];

export const TM05_KV: { label: string; value: string; tone?: TmTone }[] = [
  { label: "Turn", value: "4 of an expected 6 · in progress", tone: "ai" },
  { label: "Redirects queued", value: "1 · from Ravi at 08:11 · “net off refunds first” · applies at turn 5", tone: "warn" },
  { label: "Rows read so far", value: "4.3M · orders and ad_spend" },
  { label: "Elapsed", value: "3m 41s" },
  { label: "Cost so far", value: "₦18 in compute" },
  { label: "Plays proposed during this run", value: "0 · nothing new is proposed while a run is open", tone: "ai" },
];

// ───────────────────────── TM06 · DISAGREEMENTS ─────────────────────────

export const TM06_ROWS: {
  disagreement: string;
  between: string;
  raised: string;
  orchestrator: string;
  waitingOn: string;
  waitingOnTone: TmTone;
  age: string;
  ageTone: TmTone;
}[] = [
  { disagreement: "How much of the March break is channel mix", between: "RD and AQ", raised: "11 Mar", orchestrator: "named it, picked nobody", waitingOn: "Ifeoma", waitingOnTone: "muted", age: "160 days", ageTone: "risk" },
  { disagreement: "Whether the basket prompt or the discount moved 9,200", between: "EX and PX", raised: "2 Aug", orchestrator: "named it, picked nobody", waitingOn: "nobody", waitingOnTone: "risk", age: "23 days", ageTone: "risk" },
  { disagreement: "Whether support contact predicts churn", between: "SU and CH", raised: "6 Aug", orchestrator: "named it, picked nobody", waitingOn: "nobody · Churn", waitingOnTone: "risk", age: "19 days", ageTone: "risk" },
  { disagreement: "Whether wave three should be split in two", between: "RD and MO", raised: "today", orchestrator: "refused the split", waitingOn: "Ada", waitingOnTone: "warn", age: "19 hours", ageTone: "warn" },
];

// ───────────────────────── TM07 · THE ORCHESTRATOR ─────────────────────────

export const TM07_HERO = {
  leftLabel: "conflicts raised · resolved",
  leftBig: "4 · 0",
  sub: "It appears only when two agents disagree. It names the trade, prices it if a price exists, and hands it to two people.",
  rightLabel: "things it has proposed",
  rightBig: "0",
  rightSub: "and it never can",
};

export const TM07_ROWS: { action: string; can: string; canTone: TmTone; why: string; where: string }[] = [
  { action: "Name a disagreement between two agents", can: "yes", canTone: "ok", why: "Nobody else is watching for it", where: "4 conflicts" },
  { action: "Price the trade-off", can: "where a price exists", canTone: "warn", why: "₦16M held out of the ledger, for example", where: "Attribution" },
  { action: "Hand it to the two owners and the person above", can: "yes", canTone: "ok", why: "A conflict with no destination is noise", where: "Inbox, Handoff" },
  { action: "Pick a side", can: "never", canTone: "risk", why: "It has no evidence the two agents do not have", where: "—" },
  { action: "Average two readings", can: "never", canTone: "risk", why: "It would produce a number nobody proposed", where: "—" },
  { action: "Propose a play, a room or a finding", can: "never", canTone: "risk", why: "Arbitration and proposal cannot be the same role", where: "—" },
];

// ───────────────────────── TM08 · THE BOUNDARY ─────────────────────────

export const TM08_ROWS: { may: string; instead: string; where: string }[] = [
  { may: "Send anything to a customer", instead: "It proposes a play · a person re-authenticates", where: "delivery layer" },
  { may: "Approve a play", instead: "It waits · 19 hours on wave three today", where: "approval layer" },
  { may: "Open a room", instead: "It proposes one · a person names an owner", where: "rooms" },
  { may: "Change a threshold", instead: "It suggests one · a person edits it", where: "thresholds" },
  { may: "Promote its own claim", instead: "Only a person may change a claim type", where: "business memory" },
  { may: "Write a learning about customers", instead: "It writes constraints about data only", where: "business memory" },
  { may: "Recognise a person", instead: "Recognition is between people", where: "recognition" },
  { may: "Sign a forecast", instead: "A forecast is a person owing a number", where: "forecast" },
  { may: "Fill a missing figure with an estimate", instead: "It says Unavailable and names what is missing", where: "everywhere" },
];

export const TM08_KV: { label: string; value: string; tone?: TmTone }[] = [
  { label: "Read everything connected", value: "4.2M customers, 1.24M orders, 12.8k tickets, nightly", tone: "ok" },
  { label: "Say what they think is happening", value: "with a claim type, an n, and a confidence", tone: "ok" },
  { label: "Disagree with each other in writing", value: "four open conflicts, none averaged away", tone: "ok" },
  { label: "Refuse", value: "the Orchestrator refused a split this morning", tone: "ok" },
  { label: "Say they cannot tell", value: "the most common thing they do · 44 Unavailable figures", tone: "warn" },
  { label: "Be redirected mid-run", value: "by anybody in the room, applied at the next turn", tone: "ai" },
];

// ───────────────────────── TM09 · WORKING WITH ONE ─────────────────────────

export const TM09_ROWS: { action: string; what: string; when: string; whenTone: TmTone; scope: string }[] = [
  { action: "Ask a question", what: "Answered in the thread, the run keeps going", when: "immediately", whenTone: "ok", scope: "this run" },
  { action: "Add a constraint", what: "“Net off refunds before attributing”", when: "next turn", whenTone: "warn", scope: "this run" },
  { action: "Redirect it", what: "“Look at Kenya instead” · current turn finishes", when: "next turn", whenTone: "warn", scope: "this run" },
  { action: "Cancel it", what: "Partial work is kept and marked partial", when: "immediately", whenTone: "warn", scope: "this run" },
  { action: "Pause the agent", what: "Stops it in every room, not just this one", when: "immediately", whenTone: "risk", scope: "everywhere" },
];

export const TM09_HISTORY: { when: string; what: string; effect: string }[] = [
  { when: "08:09", what: "Repeat & Decay is working on the fee-versus-channel split", effect: "turn 4" },
  { when: "08:11", what: "Ravi: net off refunds before you attribute anything · ₦26M was given back", effect: "queued" },
  { when: "08:12", what: "Repeat & Decay takes it in at the start of turn 5", effect: "applied" },
  { when: "08:12", what: "₦412M becomes ₦386M · the split between causes does not change", effect: "conclusion held" },
];

// ───────────────────────── TM10 · PAUSED ─────────────────────────

export const TM10_ROWS: {
  agent: AgentRef;
  since: string;
  sinceTone: TmTone;
  why: string;
  notWatched: string;
  who: string;
  autoResume: string;
}[] = [
  { agent: PX, since: "12 Jan", sinceTone: "risk", why: "No COGS source · every figure it makes needs margin", notWatched: "Discounting, plan mix, margin drift", who: "Sam", autoResume: "when the source lands" },
  { agent: AC, since: "04:12 today", sinceTone: "warn", why: "The checkout event stream stopped", notWatched: "Time to first value, checkout drop-off", who: "Sam · acknowledged 07:30", autoResume: "when the stream returns" },
];

export const TM10_KV: { label: string; value: string; tone?: TmTone }[] = [
  { label: "Its findings", value: "nothing new · the existing ones stay, with their dates", tone: "ok" },
  { label: "Its thresholds", value: "not evaluated · nothing silently fails to fire", tone: "warn" },
  { label: "Its stage", value: "shows Unavailable, not last-known", tone: "ok" },
  { label: "Anybody depending on it", value: "told once, on the day, in the digest", tone: "ok" },
  { label: "Cost", value: "₦0 · a paused agent is not reading anything", tone: "muted" },
  { label: "Resuming", value: "automatic when the source returns · with a note that it was out", tone: "ok" },
];

// ───────────────────────── TM11 · WHAT THEY COST ─────────────────────────

export const TM11_STATS: { eyebrow: string; value: string; note: string; tone: TmTone }[] = [
  { eyebrow: "This month", value: "₦7,400", note: "412 runs", tone: "num" },
  { eyebrow: "Average run", value: "₦18", note: "4.2M rows is the big one", tone: "muted" },
  { eyebrow: "Most expensive agent", value: "Repeat & Decay", note: "₦2,140 · 119 runs", tone: "num" },
  { eyebrow: "Cost of the two paused", value: "₦0", note: "they are not reading", tone: "muted" },
];

export const TM11_ROWS: {
  agent: AgentRef;
  runs: string;
  rowsRead: string;
  cost: string;
  costTone: TmTone;
  findings: string;
  costPerFinding: string;
}[] = [
  { agent: RD, runs: "119", rowsRead: "312M", cost: "₦2,140", costTone: "num", findings: "19", costPerFinding: "₦113" },
  { agent: DI, runs: "124", rowsRead: "2M", cost: "₦620", costTone: "muted", findings: "6", costPerFinding: "₦103" },
  { agent: IC, runs: "61", rowsRead: "41M", cost: "₦980", costTone: "muted", findings: "12", costPerFinding: "₦82" },
  { agent: SU, runs: "44", rowsRead: "9M", cost: "₦720", costTone: "muted", findings: "13", costPerFinding: "₦55" },
  { agent: PR, runs: "38", rowsRead: "88M", cost: "₦1,180", costTone: "num", findings: "19", costPerFinding: "₦62" },
  { agent: CH, runs: "26", rowsRead: "52M", cost: "₦840", costTone: "muted", findings: "17", costPerFinding: "₦49" },
];

// ───────────────────────── TM12 · THEIR RECORD ─────────────────────────

export const TM12_ROWS: {
  agent: AgentRef;
  claims: string;
  tested: string;
  held: string;
  heldTone: TmTone;
  didNotHold: string;
  neverTested: string;
  neverTestedTone: TmTone;
}[] = [
  { agent: IC, claims: "12", tested: "3", held: "3", heldTone: "ok", didNotHold: "0", neverTested: "9", neverTestedTone: "warn" },
  { agent: RD, claims: "19", tested: "2", held: "1", heldTone: "num", didNotHold: "1", neverTested: "17", neverTestedTone: "warn" },
  { agent: SU, claims: "13", tested: "1", held: "1", heldTone: "ok", didNotHold: "0", neverTested: "12", neverTestedTone: "warn" },
  { agent: PX, claims: "8", tested: "1", held: "1", heldTone: "ok", didNotHold: "0", neverTested: "7", neverTestedTone: "warn" },
  { agent: PR, claims: "19", tested: "0", held: "—", heldTone: "muted", didNotHold: "—", neverTested: "19", neverTestedTone: "risk" },
  { agent: CH, claims: "17", tested: "0", held: "—", heldTone: "muted", didNotHold: "—", neverTested: "17", neverTestedTone: "risk" },
];

// ───────────────────────── TM13 · PAUSE AN AGENT (modal) ─────────────────────────

export const TM13_PRESET = {
  agent: PR,
  meta: "19 findings · 9 breached thresholds · 0 rooms · Adopt has no owner",
  reasons: [
    { label: "Its source has failed", sub: "not this one · feature events are reading fine", on: false, blocked: true },
    { label: "It is producing findings nobody reads", sub: "true · 19 of them, to an empty field", on: true, blocked: false },
    { label: "It is too expensive", sub: "₦1,180 this month · available as a reason", on: false, blocked: false },
    { label: "It is wrong too often", sub: "not offered · nothing it says has ever been tested", on: false, blocked: true },
  ],
  warningTitle: "Pausing this makes the Adopt problem invisible rather than solved",
  warningBody: "The 19 unread findings are the strongest argument that Adopt needs an owner. Silence them and the stage looks quiet — which it already is, and which is the problem.",
};

// ───────────────────────── TM14 · REDIRECT A RUN (modal) ─────────────────────────

export const TM14_PRESET = {
  label: "Repeat & Decay · turn 4 of 6",
  meta: "Reading orders · 4.3M rows so far · 3m 41s · ₦18",
  instruction: "Net off refunds before you attribute anything — ₦26M of that is money we gave back.",
  effects: [
    { label: "It is queued, not applied", sub: "the current turn finishes first", tone: "warn" as TmTone },
    { label: "It lands at the start of turn 5", sub: "roughly 40 seconds from now", tone: "ok" as TmTone },
    { label: "The current read completes", sub: "interrupting would give a partial table that looks complete", tone: "risk" as TmTone },
    { label: "Your words are kept on the run", sub: "with your name, whether or not the conclusion changes", tone: "ok" as TmTone },
  ],
};

// ───────────────────────── TM15 · ADD ONE TO A ROOM (modal) ─────────────────────────

export const TM15_PRESET = {
  agent: SU,
  roomLabel: "Add Support Signal to room 8f2c",
  roomMeta: "Second order never happened · 3 agents, 4 people already",
  why: "11.2% of this cohort wrote to support before they lapsed, against a 2.9% base. Support Signal is the only agent reading those messages.",
  willDo: [
    { label: "Read the room's cohort against its own sources", sub: "100,000 people · their tickets and replies", tone: "ok" as TmTone },
    { label: "State findings in the thread, with a claim type", sub: "alongside three other agents", tone: "ok" as TmTone },
    { label: "Possibly disagree with Repeat & Decay", sub: "it already does, about whether contact predicts churn", tone: "warn" as TmTone },
    { label: "Cost roughly ₦18 a run", sub: "added to the room's own cost line", tone: "muted" as TmTone },
  ],
};

// ───────────────────────── TM16 · A STAGE NOBODY WATCHES ─────────────────────────

export const TM16_HERO = {
  leftLabel: "agents watching advocate",
  leftBig: "0",
  sub: "Not because nobody assigned one. Because there is nothing instrumented for an agent to read.",
  rightLabel: "referrers",
  rightBig: "124,000",
  rightSub: "at ₦0 acquisition cost",
};

export const TM16_ROWS: { would: string; exists: string; existsTone: TmTone; since: string; who: string; asked: string; askedTone: TmTone }[] = [
  { would: "A referral event when somebody refers", exists: "no", existsTone: "risk", since: "always", who: "Sam", asked: "never", askedTone: "risk" },
  { would: "A link between referrer and referred customer", exists: "no", existsTone: "risk", since: "always", who: "Sam", asked: "never", askedTone: "risk" },
  { would: "Referred customers' order history", exists: "yes", existsTone: "ok", since: "12 Jan", who: "—", asked: "—", askedTone: "muted" },
  { would: "A reward or credit record", exists: "partial", existsTone: "warn", since: "Apr", who: "Sam", asked: "never", askedTone: "risk" },
];

// ───────────────────────── TM17 · SETTINGS ─────────────────────────

export const TM17_ROWS: { rule: string; currently: string; currentlyTone: TmTone; who: string; canChange: boolean; state: string; stateTone: TmTone }[] = [
  { rule: "An agent reads, states and routes · nothing else", currently: "12", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Every finding carries a claim type and an n", currently: "141", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "An agent pauses when its source fails", currently: "2 paused", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Redirects land between turns, never inside one", currently: "6 so far", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Nothing new is proposed while a run is open", currently: "3 running", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Who may pause an agent", currently: "anyone", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who may redirect a run", currently: "anyone in the room", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Run frequency", currently: "nightly, plus on change", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "An accuracy score per agent", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Agents estimating a missing figure", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Auto-assigning a finding to the nearest person", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const TM17_ELSEWHERE_KV: { label: string; value: string; tone?: TmTone }[] = [
  { label: "Rooms", value: "in the thread, alongside people · redirected mid-run", tone: "ai" },
  { label: "Lifecycle", value: "an Agents tab on every stage, with its thresholds", tone: "ok" },
  { label: "Business memory", value: "they may write constraints about data and nothing else", tone: "ok" },
  { label: "What to do today", value: "their findings, ranked, with confidence and n", tone: "ok" },
  { label: "Recognition", value: "never · recognition is between people", tone: "risk" },
];
