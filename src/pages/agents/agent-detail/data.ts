import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Agents · Agent details — sourced from
 * flolyt-figma-designs/Agents Screens/flolyt-agent-details/flolyt-agent-details/
 * (16 frames, AN01-AN16). Content transcribed from the export's own `an.py`
 * generator source, same approach as every other Agents section. Fifth and
 * final section of the Agents group, after [[flolyt_agent_builder_rebuild]].
 *
 * Unlike Marketplace/Governance/Agent Builder (which each pair a section
 * landing page with several detail rows), this whole export IS one agent's
 * detail page — Repeat & Decay's. There is no list-of-agents frame anywhere
 * in AN01-16, so the sidebar's static "Agent detail" entry (/agent-detail,
 * no :id) points straight at Repeat & Decay's page rather than an index.
 *
 * AN16 (mobile) has no dedicated route — its "waiting for you"-equivalent
 * highlight is folded into the default Overview state, per
 * [[flolyt_mobile_design]].
 */

export type AnTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const AN_TONE_CLASS: Record<AnTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const AN_CHIP_TONE: Record<AnTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const AN_KPI_TONE: Record<AnTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same convention as every prior rebuild's empty state. Only two states exist in this section's own source (no "first" edge state). */
export type AgentDetailState = "nothing" | "full";
export const AGENT_DETAIL_STATE: AgentDetailState = "full";

export const AN_TABS = ["Overview", "What it watches", "What it reads", "Findings", "Runs", "Record"] as const;
export type AnTab = (typeof AN_TABS)[number];

export const AGENT_HEADER = {
  initials: "RD",
  name: "Repeat & Decay",
  roleLabel: "LEAD · RETAIN",
  since: "reading since 12 December",
};

export const AN_FINDING_TITLES: Record<string, string> = {
  "1": "Repeat rate fell 10.2 points",
};

export const AN_RUN_TITLES: Record<string, string> = {
  "2aug": "Run · 2 August 08:09",
};

// ───────────────────────── AN01 · BEFORE IT HAS READ ANYTHING ─────────────────────────

export const AN01_EMPTY = {
  heading: "This agent has read nothing, so there is nothing to show",
  body: "It has been given four sources and no permission to do anything except read them. The first run starts tonight and will take about three hours.",
  subtitle: "Connected 12 December · has not read anything yet",
};

export const AN01_ROWS: { will: string; example: string; never: string; reason: string }[] = [
  { will: "Read four sources nightly", example: "orders, customers, tickets, ad_spend", never: "Write to any of them", reason: "read-only credentials" },
  { will: "State findings with a claim type", example: "association, causal, insufficient", never: "Decide which type is right", reason: "only a person promotes a claim" },
  { will: "Route to a named person", example: "Ifeoma, who owns Retain", never: "Pick somebody if the field is empty", reason: "no auto-assignment anywhere" },
  { will: "Propose a play in a room", example: "with an audience and a holdout", never: "Send it", reason: "a person re-authenticates" },
];

// ───────────────────────── AN02 · THE AGENT (Overview) ─────────────────────────

export const AN02_SUBTITLE = "Watches repeat rate, the second-order curve, segment drift and reactivation response";

export const AN02_STATS: { eyebrow: string; value: string; note: string; tone: AnTone; href?: string }[] = [
  { eyebrow: "Findings", value: "19", note: "11 became rooms", tone: "num" },
  { eyebrow: "Claims tested", value: "2 of 19", note: "1 held, 1 did not", tone: "warn" },
  { eyebrow: "Runs this month", value: "119", note: "₦2,140 in compute", tone: "num" },
  { eyebrow: "Redirected by people", value: "6", note: "4 changed nothing", tone: "ai", href: "/agent-detail/steering" },
];

export const AN02_KV: { label: string; value: string; tone?: AnTone; href?: string }[] = [
  { label: "Opened room 8f2c", value: "the ₦412M second-order room · its largest single finding", tone: "ok", href: "/rooms/8f2c" },
  { label: "Connected five stages", value: "the causal finding that dated the fee change to 4 March", tone: "ok" },
  { label: "Disagreed with Acquisition Quality", value: "about how much of the March break is channel mix · unresolved 160 days", tone: "warn", href: "/agent-detail/conflicts" },
  { label: "Been wrong once, in public", value: "day-of-week affects reactivation · wave one disproved it", tone: "ai" },
  { label: "Held a finding for 20 days", value: "it would not state the ninety-day curve without a baseline", tone: "ok" },
  { label: "Never sent anything", value: "19 findings, 11 rooms, 6 plays proposed, 0 sends", tone: "muted" },
];

// ───────────────────────── AN03 · WHAT IT WATCHES ─────────────────────────

export const AN03_ROWS: {
  condition: string;
  threshold: string;
  currently: string;
  currentlyTone: AnTone;
  wouldOpen: string;
  wouldOpenTone: AnTone;
  goesTo: string;
  editable: boolean;
}[] = [
  { condition: "Repeat rate falls", threshold: "2 pts in 7 days", currently: "−10.9", currentlyTone: "risk", wouldOpen: "already open", wouldOpenTone: "warn", goesTo: "Ifeoma", editable: false },
  { condition: "A cohort breaks from the one before", threshold: "5 pts", currently: "March −10.2", currentlyTone: "risk", wouldOpen: "already open", wouldOpenTone: "warn", goesTo: "Ifeoma", editable: false },
  { condition: "Customers ageing past the window", threshold: "2,000 a day", currently: "4,100 a day", currentlyTone: "risk", wouldOpen: "already open", wouldOpenTone: "warn", goesTo: "Ifeoma", editable: false },
  { condition: "A release ships where this was lost before", threshold: "any", currently: "Ghana · 14 Sep", currentlyTone: "risk", wouldOpen: "not opened", wouldOpenTone: "risk", goesTo: "nobody", editable: true },
  { condition: "Reactivation response falls", threshold: "3 pts", currently: "−2.7", currentlyTone: "warn", wouldOpen: "no", wouldOpenTone: "muted", goesTo: "Ifeoma", editable: false },
];

export const AN03_KV: { label: string; value: string; tone?: AnTone }[] = [
  { label: "Evaluate them", value: "nightly, and on any change to a source it reads", tone: "ok" },
  { label: "Suggest a new one", value: "it has suggested two · both were edited by a person before use", tone: "ai" },
  { label: "Change one", value: "never · a threshold is a person's judgement about what matters", tone: "risk" },
  { label: "Route around an empty owner field", value: "never · it fires and it waits", tone: "risk" },
  { label: "Stop firing a condition that never gets picked up", value: "never · nine breaches so far", tone: "warn" },
];

// ───────────────────────── AN04 · WHAT IT READS ─────────────────────────

export const AN04_ROWS: { source: string; rows: string; freshness: string; freshnessTone: AnTone; access: string; accessTone: AnTone; use: string; ifFails: string; ifFailsTone: AnTone }[] = [
  { source: "orders", rows: "1.24M", freshness: "14 min", freshnessTone: "ok", access: "read-only", accessTone: "ok", use: "Repeat rate, second orders, cohorts", ifFails: "pauses", ifFailsTone: "warn" },
  { source: "customers", rows: "4.16M", freshness: "14 min", freshnessTone: "ok", access: "read-only", accessTone: "ok", use: "Segments, signup cohorts, markets", ifFails: "pauses", ifFailsTone: "warn" },
  { source: "tickets", rows: "12.8k", freshness: "2 hours", freshnessTone: "ok", access: "read-only", accessTone: "ok", use: "Whether a cohort complained first", ifFails: "degrades", ifFailsTone: "muted" },
  { source: "releases", rows: "412", freshness: "live", freshnessTone: "ok", access: "read-only", accessTone: "ok", use: "Dating a change to a week", ifFails: "degrades", ifFailsTone: "muted" },
  { source: "order_lines", rows: "—", freshness: "never", freshnessTone: "risk", access: "not connected", accessTone: "risk", use: "Basket composition · would strengthen 4 claims", ifFails: "—", ifFailsTone: "muted" },
];

// ───────────────────────── AN05 · FINDINGS ─────────────────────────

export const AN05_ROWS: {
  finding: string;
  id?: string;
  claim: string;
  claimTone: AnTone;
  confidence: string;
  confidenceTone: AnTone;
  n: string;
  became: string;
  becameTone: AnTone;
  tested: string;
  testedTone: AnTone;
}[] = [
  { finding: "Repeat rate fell 10.2 points, dated to 4 March", id: "1", claim: "causal", claimTone: "ai", confidence: "5 / 5", confidenceTone: "ok", n: "1.24M", became: "room 8f2c", becameTone: "ok", tested: "yes · held", testedTone: "ok" },
  { finding: "Reactivation decays past the 90-day boundary", claim: "association", claimTone: "warn", confidence: "5 / 5", confidenceTone: "ok", n: "148k", became: "a segment", becameTone: "ok", tested: "no", testedTone: "warn" },
  { finding: "Day of week affects reactivation response", claim: "association", claimTone: "warn", confidence: "3 / 5", confidenceTone: "warn", n: "46k", became: "a playbook", becameTone: "muted", tested: "yes · did not hold", testedTone: "risk" },
  { finding: "Fee transparency beats an offer", claim: "causal", claimTone: "ai", confidence: "4 / 5", confidenceTone: "ok", n: "90k", became: "a learning", becameTone: "ok", tested: "yes · held", testedTone: "ok" },
  { finding: "Guest-checkout customers cannot be followed", claim: "insufficient", claimTone: "neutral", confidence: "—", confidenceTone: "muted", n: "42k", became: "a constraint", becameTone: "ok", tested: "n/a", testedTone: "muted" },
  { finding: "Kenya moved with Nigeria, the UK did not", claim: "causal", claimTone: "ai", confidence: "5 / 5", confidenceTone: "ok", n: "3.5M", became: "the map", becameTone: "ok", tested: "no", testedTone: "warn" },
];

// ───────────────────────── AN06 · ONE FINDING (1) ─────────────────────────

export const AN06_QUOTE = {
  quote: "Repeat rate fell from 37.4% to 27.2% in the fortnight after 4 March, in Nigeria and Kenya but not in the UK or Ghana.",
  meta: "Stated 2 August · causal · confidence 5 of 5 · n = 1.24M · routed to Ifeoma Nwosu",
};

export const AN06_ROWS: { input: string; source: string; rows: string; contribution: string; contributionTone: AnTone }[] = [
  { input: "The fall itself", source: "orders · second orders by cohort", rows: "1.24M", contribution: "the observation", contributionTone: "muted" },
  { input: "The date", source: "releases · 2024.03.04-b", rows: "412", contribution: "what turns a fall into a cause", contributionTone: "ok" },
  { input: "The markets that did not move", source: "customers · UK and Ghana", rows: "679k", contribution: "the control", contributionTone: "ok" },
  { input: "Three rival explanations, ruled out", source: "Ramadan, a competitor, fuel prices", rows: "—", contribution: "why it is causal", contributionTone: "ok" },
  { input: "The one not ruled out", source: "app version 4.2 · the same release", rows: "—", contribution: "stated, not hidden", contributionTone: "warn" },
];

export const AN06_KV: { label: string; value: string; tone?: AnTone }[] = [
  { label: "Routed to", value: "Ifeoma Nwosu · owner of Retain · 2 August, 08:14" },
  { label: "Became", value: "room 8f2c · ₦412M at risk · open 2 days at the time", tone: "ok" },
  { label: "Cited in", value: "the leakage map, the funnel, two learnings", tone: "ok" },
  { label: "Challenged by", value: "Acquisition Quality · about the size, not the cause", tone: "warn" },
  { label: "Tested", value: "wave one · 18.2% against 6.2% held · the mechanism held", tone: "ok" },
];

// ───────────────────────── AN07 · RUNS ─────────────────────────

export const AN07_ROWS: {
  when: string;
  id?: string;
  doing: string;
  turns: string;
  turnsTone: AnTone;
  rows: string;
  cost: string;
  outcome: string;
  outcomeTone: AnTone;
}[] = [
  { when: "now", doing: "Attribution split · fee versus channel mix", turns: "4 of 6", turnsTone: "ai", rows: "4.3M", cost: "₦18", outcome: "redirect queued", outcomeTone: "warn" },
  { when: "today 04:00", doing: "Nightly · repeat curve and segment drift", turns: "3 of 3", turnsTone: "ok", rows: "2.9M", cost: "₦12", outcome: "no finding", outcomeTone: "muted" },
  { when: "yesterday", doing: "Nightly · repeat curve and segment drift", turns: "3 of 3", turnsTone: "ok", rows: "2.9M", cost: "₦12", outcome: "no finding", outcomeTone: "muted" },
  { when: "2 Aug 08:09", id: "2aug", doing: "Joining the releases table to the repeat curve", turns: "6 of 6", turnsTone: "ok", rows: "5.1M", cost: "₦24", outcome: "the causal finding", outcomeTone: "ok" },
  { when: "2 Aug 04:00", doing: "Nightly · repeat curve and segment drift", turns: "3 of 3", turnsTone: "ok", rows: "2.8M", cost: "₦12", outcome: "threshold breached", outcomeTone: "warn" },
  { when: "1 Aug 04:00", doing: "Nightly · cancelled by Ifeoma at turn 2", turns: "2 of 3", turnsTone: "warn", rows: "1.1M", cost: "₦8", outcome: "partial · kept and marked", outcomeTone: "warn" },
];

// ───────────────────────── AN08 · ONE RUN (2aug) ─────────────────────────

export const AN08_HERO = {
  leftLabel: "the run that connected five stages",
  leftBig: "4 hours",
  sub: "Six turns, 5.1M rows, ₦24 in compute, and the causal finding that dated ₦1.08B to a single week.",
  rightLabel: "what it changed",
  rightBig: "151 days",
  rightSub: "of not knowing, ended",
};

export const AN08_ROWS: { turn: string; did: string; rows: string; time: string; result: string; resultTone: AnTone }[] = [
  { turn: "1", did: "Read the releases table for the first time", rows: "412", time: "0.4s", result: "2024.03.04-b found", resultTone: "ok" },
  { turn: "2", did: "Joined releases to the repeat curve by week", rows: "1.24M", time: "1.9s", result: "the fall lines up", resultTone: "ok" },
  { turn: "3", did: "Checked the same join in four markets", rows: "3.5M", time: "4.1s", result: "UK and Ghana flat", resultTone: "ok" },
  { turn: "4", did: "Tested three rival explanations", rows: "118k", time: "2.2s", result: "all three ruled out", resultTone: "ok" },
  { turn: "5", did: "Took Ravi's redirect · net off refunds", rows: "1.24M", time: "1.7s", result: "₦412M becomes ₦386M", resultTone: "warn" },
  { turn: "6", did: "Stated the finding and routed it", rows: "—", time: "0.2s", result: "to Ifeoma, 08:14", resultTone: "ok" },
];

// ───────────────────────── AN09 · RECORD ─────────────────────────

export const AN09_ROWS: { claim: string; statedAt: string; statedAtTone: AnTone; testedBy: string; result: string; resultTone: AnTone; means: string; meansTone: AnTone }[] = [
  { claim: "Fee transparency beats an offer on reactivation", statedAt: "4 / 5", statedAtTone: "ok", testedBy: "Wave one · 10,000 held", result: "held", resultTone: "ok", means: "18.2% against 6.2%", meansTone: "ok" },
  { claim: "Day of week affects reactivation response", statedAt: "3 / 5", statedAtTone: "warn", testedBy: "Wave one · same run", result: "did not hold", resultTone: "risk", means: "no effect at all", meansTone: "risk" },
  { claim: "Reactivation decays past 90 days", statedAt: "5 / 5", statedAtTone: "ok", testedBy: "not tested", result: "—", resultTone: "muted", means: "16.1% to 4.2% is observational", meansTone: "warn" },
  { claim: "The fee change caused the fall", statedAt: "5 / 5", statedAtTone: "ok", testedBy: "the UK is a control", result: "held", resultTone: "ok", means: "an accident, not a design", meansTone: "warn" },
  { claim: "Guest customers cannot be followed", statedAt: "—", statedAtTone: "muted", testedBy: "not testable", result: "constraint", resultTone: "ok", means: "it is a fact about the schema", meansTone: "ok" },
];

// ───────────────────────── AN10 · DISAGREEMENTS ─────────────────────────

export const AN10_CARDS: { eyebrow: string; heading: string; body: string; footer: string; tone: AnTone }[] = [
  { eyebrow: "Repeat & Decay says", heading: "Mostly the fee", tone: "ai", body: "The fall lines up with the release week in two markets and not in the two that did not receive it. Channel mix moved 2 points in the same period and cannot account for 10.2.", footer: "confidence 5 of 5 · n = 1.24M" },
  { eyebrow: "Acquisition Quality says", heading: "More channel than that", tone: "warn", body: "Paid social share rose 9 points in February and those cohorts repeat 7 points lower. That is 3 to 4 points of the fall, not 2, and it started before the release.", footer: "confidence 4 of 5 · n = 211k" },
  { eyebrow: "The Orchestrator says", heading: "Both are supported", tone: "muted", body: "It named the disagreement, priced neither reading, and handed it to Ifeoma. It has not picked a side and will not, and it cannot propose a way to settle it.", footer: "raised 11 March · unresolved" },
];

export const AN10_ROWS: { what: string; how: string; howTone: AnTone; cost: string; costTone: AnTone; who: string; started: string; startedTone: AnTone }[] = [
  { what: "Hold the paid-social cohort out of one wave", how: "18 days", howTone: "ok", cost: "≈₦1.4M held", costTone: "warn", who: "Ifeoma", started: "never proposed", startedTone: "risk" },
  { what: "Compare Kenya, where channel mix did not move", how: "today", howTone: "muted", cost: "nothing", costTone: "ok", who: "anyone", started: "not done", startedTone: "warn" },
  { what: "Split the difference at 3 points", how: "today", howTone: "muted", cost: "a number neither believes", costTone: "risk", who: "nobody", started: "refused", startedTone: "risk" },
  { what: "Leave it", how: "160 days", howTone: "risk", cost: "both readings stay attached", costTone: "warn", who: "nobody", started: "what is happening", startedTone: "risk" },
];

// ───────────────────────── AN11 · STEERING HISTORY ─────────────────────────

export const AN11_ROWS: {
  when: string;
  initials: string;
  team: string;
  name: string;
  said: string;
  effectOnNumber: string;
  effectOnNumberTone: AnTone;
  effectOnConclusion: string;
  effectOnConclusionTone: AnTone;
}[] = [
  { when: "2 Aug", initials: "RM", team: "Finance", name: "Ravi", said: "Net off refunds before attributing", effectOnNumber: "₦412M → ₦386M", effectOnNumberTone: "warn", effectOnConclusion: "none", effectOnConclusionTone: "muted" },
  { when: "2 Aug", initials: "IN", team: "Marketing", name: "Ifeoma", said: "Check Ghana as well as the UK", effectOnNumber: "—", effectOnNumberTone: "muted", effectOnConclusion: "strengthened it", effectOnConclusionTone: "ok" },
  { when: "19 Jul", initials: "TB", team: "Sales", name: "Tunde", said: "Exclude wholesale accounts", effectOnNumber: "−2,100 customers", effectOnNumberTone: "muted", effectOnConclusion: "none", effectOnConclusionTone: "muted" },
  { when: "6 Jun", initials: "IN", team: "Marketing", name: "Ifeoma", said: "Use 90 days, not 60", effectOnNumber: "37.4% → 36.1%", effectOnNumberTone: "warn", effectOnConclusion: "none", effectOnConclusionTone: "muted" },
  { when: "2 May", initials: "ZY", team: "Product", name: "Zainab", said: "Segment by device before concluding", effectOnNumber: "—", effectOnNumberTone: "muted", effectOnConclusion: "changed it", effectOnConclusionTone: "risk" },
  { when: "1 Aug", initials: "IN", team: "Marketing", name: "Ifeoma", said: "Cancelled at turn 2 · do releases first", effectOnNumber: "—", effectOnNumberTone: "muted", effectOnConclusion: "run kept as partial", effectOnConclusionTone: "warn" },
];

// ───────────────────────── AN12 · WHAT IT WILL NOT DO ─────────────────────────

export const AN12_REFUSED_ROWS: { refused: string; when: string; said: string; askedBy: string }[] = [
  { refused: "To state the 90-day curve without a baseline", when: "Dec", said: "“There is nothing to compare this to yet”", askedBy: "nobody · itself" },
  { refused: "To estimate margin from order value", when: "Feb", said: "“COGS is missing · this would be a guess”", askedBy: "Ravi · Finance" },
  { refused: "To rank customers by churn risk", when: "Apr", said: "“Risk is a property of a cohort here”", askedBy: "Tunde · Sales" },
  { refused: "To split wave three into two sends", when: "today", said: "“The cap is 50,000 · this is 52,000”", askedBy: "Orchestrator" },
];

export const AN12_KV: { label: string; value: string; tone?: AnTone }[] = [
  { label: "Send anything", value: "no credential, no endpoint, no permission level" },
  { label: "Approve anything", value: "approval requires a re-authentication it cannot perform", tone: "ok" },
  { label: "Open a room", value: "it proposes · a person names an owner" },
  { label: "Change a threshold", value: "it suggests · a person edits" },
  { label: "Promote its own claim", value: "only a person changes a claim type", tone: "ai" },
  { label: "Write to any source", value: "read-only credentials on all four", tone: "ok" },
  { label: "Fill a gap with an estimate", value: "it says Unavailable and names what is missing", tone: "warn" },
  { label: "Escalate to a different person", value: "it routes once, to the named owner, and waits", tone: "risk" },
  { label: "Stop firing a condition nobody reads", value: "nine breaches into an empty field so far", tone: "risk" },
];

// ───────────────────────── AN13 · EDIT A THRESHOLD (modal) ─────────────────────────

export const AN13_PRESET = {
  title: "A release ships where this was lost before",
  meta: "Suggested by Repeat & Decay in June · edited by nobody since",
  options: [
    { label: "Ifeoma · owns Retain", sub: "the loss is hers · the release is not", state: "selected" as const },
    { label: "Sam · owns releases", sub: "the release is his · the loss is not", state: "available" as const },
    { label: "Whoever runs the market", sub: "there is nobody for Ghana", state: "blocked" as const },
    { label: "All three", sub: "not offered · a finding with three owners has none", state: "blocked" as const },
  ],
  warnTitle: "This condition fires on 14 September whatever you choose",
  warnBody: "Ghana receives the same release that cost ₦1.08B in three markets. Routing it to somebody today is the difference between a warning arriving and a warning existing.",
  footnote: "The agent suggested this condition and cannot pick who it goes to. Repeat & Decay proposed the rule in June after Kenya moved. Choosing the destination is a judgement about who owns a problem that spans three people's work, which is exactly the kind of thing an agent should surface and never settle.",
};

// ───────────────────────── AN14 · ASK IT SOMETHING (modal) ─────────────────────────

export const AN14_PRESET = {
  title: "Ask Repeat & Decay · during a run",
  meta: "Turn 4 of 6 · the run keeps going while it answers",
  question: "Did channel mix move in Kenya the same way?",
  willDo: [
    { label: "Answer in the thread", sub: "without stopping or restarting the run", tone: "ok" as AnTone },
    { label: "Not treat it as an instruction", sub: "a question is not a redirect · nothing changes", tone: "ok" as AnTone },
    { label: "Read only what it already has access to", sub: "four sources · nothing new is connected to answer you", tone: "ok" as AnTone },
    { label: "Say if it cannot tell", sub: "the most likely answer to most questions here", tone: "warn" as AnTone },
  ],
  tealTitle: "This question settles a 160-day disagreement",
  tealBody: "Kenya received the release and its channel mix barely moved, which separates the two explanations almost perfectly.",
  footnote: "Asking is free and changes nothing about the run. A question does not queue, does not wait for a turn boundary and does not alter what the agent is doing. If you want it to work differently, that is a redirect, and it lands at the next turn with your words on the record.",
};

// ───────────────────────── AN15 · SETTINGS ─────────────────────────

export const AN15_ROWS: { rule: string; currently: string; currentlyTone: AnTone; who: string; canChange: boolean; state: string; stateTone: AnTone }[] = [
  { rule: "Sources it may read", currently: "4 · read-only", currentlyTone: "ok", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Conditions it watches", currently: "5", currentlyTone: "num", who: "Ifeoma", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Where findings route", currently: "Ifeoma · 4 of 5", currentlyTone: "warn", who: "Ifeoma", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Run frequency", currently: "nightly · plus on change", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Who may redirect it", currently: "anyone in the room", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Every finding carries a claim type and an n", currently: "19", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "It pauses when a source fails", currently: "0 times", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Wrong claims stay in its findings list", currently: "1", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "An accuracy score", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Write access to any source", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Escalating a finding nobody picks up", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const AN15_COST_KV: { label: string; value: string; tone?: AnTone }[] = [
  { label: "This month", value: "₦2,140 · 119 runs · 312M rows" },
  { label: "Per finding", value: "₦113 · the highest in the workspace", tone: "warn" },
  { label: "What it opened", value: "11 rooms, including the ₦412M one", tone: "ok" },
  { label: "What it refused", value: "four requests, two of them from people, all recorded", tone: "ok" },
  { label: "If it were switched off", value: "nine stages still watched · Retain would have none", tone: "risk" },
];

// ───────────────────────── AN16 · MOBILE (folded into Overview) ─────────────────────────

export const AN16_QUARTER: { label: string; value: string; note: string; tone: AnTone }[] = [
  { label: "Findings", value: "19", note: "11 became rooms", tone: "num" },
  { label: "Claims tested", value: "2", note: "1 held, 1 did not", tone: "warn" },
  { label: "Runs this month", value: "119", note: "117 found nothing", tone: "muted" },
  { label: "Compute", value: "₦2,140", note: "₦113 a finding", tone: "muted" },
  { label: "Sends, approvals, decisions", value: "0", note: "and it never can", tone: "muted" },
];
