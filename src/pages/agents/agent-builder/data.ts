import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Agents · Agent Builder — sourced from
 * flolyt-figma-designs/Agents Screens/flolyt-agent-builder/flolyt-agent-builder/
 * (16 frames, AB01-AB16). Content transcribed from the export's own `ab.py`
 * generator source, same approach as ai-teammates/marketplace/governance.
 * Fourth section of the Agents group.
 *
 * AB16 (mobile) has no dedicated route — its "waiting for you" highlight is
 * folded into the default "Built here" state below, per [[flolyt_mobile_design]].
 */

export type AbTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const AB_TONE_CLASS: Record<AbTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const AB_CHIP_TONE: Record<AbTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const AB_KPI_TONE: Record<AbTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same convention as every prior rebuild's empty/edge states. */
export type AgentBuilderState = "nothing" | "first" | "full";
export const AGENT_BUILDER_STATE: AgentBuilderState = "full";

export const AB_TABS = ["Built here", "Waiting for approval", "Test runs", "Retired"] as const;
export type AbTab = (typeof AB_TABS)[number];

export const AGENT_BUILDER_DETAIL_TITLES: Record<string, string> = {
  "data-integrity": "Data Integrity",
};

// ───────────────────────── AB01 · NOTHING BUILT YET ─────────────────────────

export const AB01_EMPTY = {
  heading: "Nothing has been built here yet",
  body: "Twelve agents came with Flolyt and they cover nine stages. Building one is for the thing none of them watches — usually a condition that spans two people's work, which is why nobody has written it down anywhere else either.",
  footnote: "Anybody can build one. Activating it needs an approval, because activation points a reader at production data.",
};

export const AB01_ROWS: { unwatched: string; why: string; owner: string; ownerTone: AbTone; worth: string; worthTone: AbTone }[] = [
  { unwatched: "A release shipping into a market that lost this before", why: "It spans Engineering, a market and a stage", owner: "nobody", ownerTone: "risk", worth: "Ghana · 14 Sep", worthTone: "risk" },
  { unwatched: "Referral revenue", why: "Nothing is instrumented for an agent to read", owner: "nobody", ownerTone: "risk", worth: "Unavailable", worthTone: "muted" },
  { unwatched: "Reseller payment behaviour in Kenya", why: "Two accounts pay in arrears · only Peter knew", owner: "Kunle", ownerTone: "warn", worth: "KES 2.1M", worthTone: "warn" },
  { unwatched: "Whether a holdout has been contaminated", why: "Attribution Signal checks nightly, not at send", owner: "Ifeoma", ownerTone: "muted", worth: "₦9.1M once", worthTone: "warn" },
];

// ───────────────────────── AB02 · THE FIRST ONE BUILT ─────────────────────────

export const AB02_BANNER = {
  heading: "Ifeoma built an agent to catch the thing that has no owner",
  body: "Release Watch reads the releases table and the leakage map, and fires when a change ships into a market that lost money to the same change before.",
  highlight: "It took eleven minutes to build. It has been waiting four hours for Ada to activate it.",
};

export const AB02_STATS: { eyebrow: string; value: string; note: string; tone: AbTone }[] = [
  { eyebrow: "Built in", value: "11 minutes", note: "by somebody who is not an engineer", tone: "ok" },
  { eyebrow: "Would have fired", value: "twice", note: "Kenya in June, Ghana on 14 Sep", tone: "ai" },
  { eyebrow: "Findings so far", value: "0", note: "it has not been activated", tone: "muted" },
  { eyebrow: "Waiting for", value: "Ada", note: "4 hours · activation needs approval", tone: "warn" },
];

export const AB02_KV: { label: string; value: string; tone?: AbTone }[] = [
  { label: "What it reads", value: "releases and the leakage map · both read-only", tone: "ok" },
  { label: "What it watches for", value: "a release shipping into a market with a prior loss on that change", tone: "ok" },
  { label: "Where it routes", value: "Ifeoma, Sam and whoever runs the market · she had to pick one", tone: "warn" },
  { label: "What it may say", value: "association only · it can date a coincidence, not prove a cause", tone: "ai" },
  { label: "What it cannot do", value: "the same nine things no agent can do, unchanged", tone: "muted" },
];

// ───────────────────────── AB03 · BUILT HERE ─────────────────────────

export const AB03_STATS: { eyebrow: string; value: string; note: string; tone: AbTone }[] = [
  { eyebrow: "Built here", value: "4", note: "by three people", tone: "num" },
  { eyebrow: "Active", value: "1", note: "Data Integrity, since March", tone: "ok" },
  { eyebrow: "Waiting for approval", value: "1", note: "Release Watch · 4 hours", tone: "warn" },
  { eyebrow: "Retired", value: "2", note: "kept, readable, unrunnable", tone: "muted" },
];

export const AB03_ROWS: {
  agent: string;
  id?: string;
  builderInitials: string;
  builderTeam: string;
  builderName: string;
  built: string;
  watches: string;
  findings: string;
  findingsTone: AbTone;
  state: string;
  stateTone: AbTone;
}[] = [
  { agent: "Data Integrity", id: "data-integrity", builderInitials: "SM", builderTeam: "Engineering", builderName: "Sam", built: "Mar", watches: "Twelve sources · freshness, row counts, schema drift", findings: "6", findingsTone: "num", state: "active", stateTone: "ok" },
  { agent: "Release Watch", builderInitials: "IN", builderTeam: "Marketing", builderName: "Ifeoma", built: "today", watches: "Releases shipping into markets with a prior loss", findings: "0", findingsTone: "muted", state: "awaiting Ada", stateTone: "warn" },
  { agent: "Reseller Terms", builderInitials: "KO", builderTeam: "Customer Success", builderName: "Kunle", built: "Aug", watches: "Kenyan accounts paying outside standard terms", findings: "2", findingsTone: "num", state: "retired", stateTone: "muted" },
  { agent: "Weekend Watch", builderInitials: "IN", builderTeam: "Marketing", builderName: "Ifeoma", built: "Mar", watches: "Unsubscribes after a cadence change", findings: "0", findingsTone: "muted", state: "retired", stateTone: "muted" },
];

export const AB16_WAITING_FOR_YOU = {
  agent: "Release Watch",
  note: "4 hours · fires in 27 days",
};

// ───────────────────────── AB04 · NEW · WHAT IT WATCHES ─────────────────────────

export const AB04_SELECTED = {
  title: "A release shipping into a market that lost money to the same change before",
  meta: "Suggested by Repeat & Decay in June · routing nowhere since",
};

export const AB04_ROWS: { source: string; count: string; countTone: AbTone; example: string; picked: boolean }[] = [
  { source: "A condition inside an existing agent with no owner", count: "1", countTone: "risk", example: "Release Watch · fires 14 September", picked: true },
  { source: "A learning in business memory nobody watches", count: "6", countTone: "warn", example: "Ghanaian signup completion has been 61% for 11 months", picked: false },
  { source: "An open question", count: "5", countTone: "warn", example: "Why do cards fail at midnight at all?", picked: false },
  { source: "Something you have noticed yourself", count: "—", countTone: "muted", example: "Type it and the next step will ask what would show it", picked: false },
  { source: "A gap another company has published", count: "6", countTone: "num", example: "Community · constraints, not agents", picked: false },
];

// ───────────────────────── AB05 · NEW · WHAT IT READS ─────────────────────────

export const AB05_ROWS: { source: string; rows: string; access: string; accessTone: AbTone; grant: string; grantTone: AbTone; use: string }[] = [
  { source: "releases", rows: "412", access: "read", accessTone: "ok", grant: "granted", grantTone: "ai", use: "The date and market of every change" },
  { source: "The leakage map", rows: "10 lines", access: "read", accessTone: "ok", grant: "granted", grantTone: "ai", use: "Which markets lost money to which change" },
  { source: "orders", rows: "1.24M", access: "read", accessTone: "ok", grant: "not granted", grantTone: "muted", use: "Not needed · it does not measure the loss" },
  { source: "customers", rows: "4.16M", access: "read", accessTone: "ok", grant: "not granted", grantTone: "muted", use: "Not needed · it never looks at a person" },
  { source: "payments", rows: "612k", access: "none", accessTone: "risk", grant: "cannot grant", grantTone: "risk", use: "You do not have access, so it cannot" },
];

// ───────────────────────── AB06 · NEW · CONDITIONS ─────────────────────────

export const AB06_ROWS: { condition: string; threshold: string; thresholdTone: AbTone; fired: string; firedTone: AbTone; frequency: string; frequencyTone: AbTone; keep: boolean }[] = [
  { condition: "A release ships into a market with a prior loss on it", threshold: "any", thresholdTone: "muted", fired: "2 times in 8 months", firedTone: "ok", frequency: "rare", frequencyTone: "ok", keep: true },
  { condition: "A release ships into any market", threshold: "any", thresholdTone: "risk", fired: "412 times", firedTone: "risk", frequency: "daily", frequencyTone: "risk", keep: false },
  { condition: "A release ships and a metric falls within 14 days", threshold: "2 pts", thresholdTone: "warn", fired: "31 times", firedTone: "warn", frequency: "weekly", frequencyTone: "warn", keep: false },
  { condition: "The same release reaches a fourth market", threshold: "any", thresholdTone: "muted", fired: "0 times", firedTone: "muted", frequency: "never yet", frequencyTone: "muted", keep: true },
];

// ───────────────────────── AB07 · NEW · WHERE FINDINGS GO ─────────────────────────

export const AB07_ROWS: { destination: string; why: string; load: string; loadTone: AbTone; wouldAct: string; wouldActTone: AbTone; picked: boolean }[] = [
  { destination: "Ifeoma Nwosu · owns Retain", why: "The loss is hers · she built this", load: "14 rooms", loadTone: "warn", wouldAct: "yes", wouldActTone: "ok", picked: true },
  { destination: "Sam Iyer · owns releases", why: "The release is his", load: "41 obligations, 14 overdue", loadTone: "risk", wouldAct: "eventually", wouldActTone: "warn", picked: false },
  { destination: "Whoever runs the market", why: "The market is theirs", load: "nobody for Ghana", loadTone: "risk", wouldAct: "no · empty field", wouldActTone: "risk", picked: false },
  { destination: "A team, not a person", why: "Not offered · a team is not accountable", load: "—", loadTone: "muted", wouldAct: "never", wouldActTone: "risk", picked: false },
  { destination: "Nobody · log it only", why: "Not offered · that is an agent nobody reads", load: "—", loadTone: "muted", wouldAct: "never", wouldActTone: "risk", picked: false },
];

// ───────────────────────── AB08 · NEW · WHAT IT MAY SAY ─────────────────────────

export const AB08_ROWS: { claim: string; means: string; available: string; availableTone: AbTone; why: string; whyTone: AbTone }[] = [
  { claim: "Insufficient evidence", means: "A release shipped and it cannot tell what will happen", available: "yes", availableTone: "ok", why: "always available", whyTone: "muted" },
  { claim: "Association", means: "This release matches one that cost money before", available: "yes", availableTone: "ai", why: "the strongest this agent may make", whyTone: "ok" },
  { claim: "Causal", means: "This release will cost money in this market", available: "no", availableTone: "risk", why: "it has no control and no holdout", whyTone: "risk" },
  { claim: "A figure", means: "It will cost approximately ₦X", available: "no", availableTone: "risk", why: "it reads no orders · it cannot price anything", whyTone: "risk" },
];

export const AB08_KV: { label: string; value: string; tone?: AbTone }[] = [
  { label: "A claim type", value: "association · shown on every finding it produces", tone: "ok" },
  { label: "What it is comparing to", value: "the prior loss, named, with its date and market", tone: "ok" },
  { label: "What it does not know", value: "whether this market will behave the same way", tone: "warn" },
  { label: "An n", value: "how many prior instances · currently one", tone: "warn" },
  { label: "Who it went to", value: "Ifeoma, by name, at the time it fired", tone: "ok" },
];

// ───────────────────────── AB09 · NEW · REVIEW ─────────────────────────

export const AB09_HERO = {
  leftLabel: "release watch · built in",
  leftBig: "11 minutes",
  sub: "Two sources, two conditions, one destination, association at most. It has no record and will not have one for a while.",
  rightLabel: "needs",
  rightBig: "Ada",
  rightSub: "activation requires approval",
};

export const AB09_ROWS: { field: string; chose: string; changeable: string; changeableTone: AbTone }[] = [
  { field: "Reads", chose: "releases and the leakage map · read-only, derived from your access", changeable: "yes", changeableTone: "ok" },
  { field: "Watches", chose: "A release into a market with a prior loss · and a release reaching a fourth market", changeable: "yes", changeableTone: "ok" },
  { field: "Routes to", chose: "Ifeoma Nwosu", changeable: "yes", changeableTone: "ok" },
  { field: "May say at most", chose: "Association · derived from what it reads", changeable: "no · derived", changeableTone: "risk" },
  { field: "May never", chose: "Send, approve, open a room, change a threshold, estimate a figure", changeable: "no", changeableTone: "risk" },
  { field: "Costs", chose: "Roughly ₦2 a run · it reads 412 rows, not 4.2M", changeable: "—", changeableTone: "muted" },
];

// ───────────────────────── AB10 · THE TEST RUN ─────────────────────────

export const AB10_ROWS: { when: string; what: string; fired: string; firedTone: AbTone; to: string; context: string; contextTone: AbTone }[] = [
  { when: "4 Mar", what: "The fee change ships to Nigeria and Kenya", fired: "no", firedTone: "muted", to: "—", context: "no prior loss to compare to", contextTone: "muted" },
  { when: "11 Mar", what: "Kenya shows the same fall as Nigeria", fired: "no", firedTone: "muted", to: "—", context: "the loss was not on the map yet", contextTone: "warn" },
  { when: "6 Jun", what: "The same release reaches a third market", fired: "yes", firedTone: "ok", to: "Ifeoma", context: "Nigeria's loss was on the map", contextTone: "ok" },
  { when: "2 Aug", what: "The map dates ₦1.08B to the 4 March release", fired: "no", firedTone: "muted", to: "—", context: "no new release that day", contextTone: "muted" },
  { when: "14 Sep", what: "The fee change is scheduled for Ghana", fired: "yes", firedTone: "risk", to: "Ifeoma", context: "410,000 customers", contextTone: "risk" },
];

// ───────────────────────── AB11 · WAITING FOR APPROVAL ─────────────────────────

export const AB11_STATS: { eyebrow: string; value: string; note: string; tone: AbTone }[] = [
  { eyebrow: "Waiting", value: "1", note: "Release Watch", tone: "warn" },
  { eyebrow: "Waiting for", value: "4 hours", note: "Ada Obi", tone: "warn" },
  { eyebrow: "Fires in", value: "27 days", note: "14 September", tone: "risk" },
  { eyebrow: "Ways around the approval", value: "0", note: "including for the person who built it", tone: "ok" },
];

export const AB11_ROWS: { grants: string; detail: string; reversible: string; reversibleTone: AbTone }[] = [
  { grants: "A read of two sources, nightly", detail: "releases · 412 rows · the leakage map · 10 lines", reversible: "yes · pause it", reversibleTone: "ok" },
  { grants: "The ability to put findings in a person's queue", detail: "Ifeoma's · she agreed, she built it", reversible: "yes", reversibleTone: "ok" },
  { grants: "Compute spend", detail: "Roughly ₦2 a run · about ₦60 a month", reversible: "yes", reversibleTone: "ok" },
  { grants: "A thirteenth agent on the roster", detail: "Visible to everybody, with its builder's name on it", reversible: "yes · retire it", reversibleTone: "ok" },
  { grants: "Nothing else", detail: "No send, no approval, no write access, no new power", reversible: "—", reversibleTone: "muted" },
];

// ───────────────────────── AB12 · ONE BUILT AGENT (data-integrity) ─────────────────────────

export const AB12_HERO = {
  leftLabel: "built by sam in march · findings",
  leftBig: "6",
  sub: "Twelve sources checked nightly for freshness, row counts and schema drift. Every constraint in business memory about a missing source came from here.",
  rightLabel: "cost",
  rightBig: "₦620",
  rightSub: "124 runs a month",
};

export const AB12_ROWS: { finding: string; when: string; whenTone: AbTone; claim: string; became: string; stillTrue: string; stillTrueTone: AbTone }[] = [
  { finding: "COGS has stopped arriving", when: "12 Jan", whenTone: "risk", claim: "constraint", became: "Price & Margin paused · 11 blocked figures", stillTrue: "yes · 219 days", stillTrueTone: "risk" },
  { finding: "Guest orders have no customer reference", when: "12 Jan", whenTone: "muted", claim: "constraint", became: "The most cited constraint in memory", stillTrue: "yes", stillTrueTone: "risk" },
  { finding: "loyalty.tier_shown has never fired", when: "Aug 2024", whenTone: "muted", claim: "constraint", became: "A funnel step reading Unavailable", stillTrue: "yes", stillTrueTone: "risk" },
  { finding: "The checkout stream stopped at 04:12", when: "today", whenTone: "warn", claim: "constraint", became: "Activation paused · two funnel steps blank", stillTrue: "yes · 6h", stillTrueTone: "warn" },
  { finding: "order_lines was never connected", when: "28 Jul", whenTone: "muted", claim: "constraint", became: "Four claims that cannot be strengthened", stillTrue: "yes", stillTrueTone: "risk" },
  { finding: "Ghana card volume has under 90 days", when: "9 Jul", whenTone: "muted", claim: "constraint", became: "A playbook precondition that refuses Ghana", stillTrue: "until Oct", stillTrueTone: "warn" },
];

// ───────────────────────── AB13 · ACTIVATE (modal, Release Watch) ─────────────────────────

export const AB13_PRESET = {
  title: "Activate Release Watch",
  meta: "Built by Ifeoma · would have fired twice in eight months",
  approving: [
    { label: "Two read-only sources", sub: "releases and the leakage map · 422 rows between them", tone: "ok" as AbTone },
    { label: "Findings into Ifeoma's queue", sub: "she built it and chose herself · 14 rooms already", tone: "warn" as AbTone },
    { label: "About ₦60 a month", sub: "roughly ₦2 a run · the twelve cost ₦7,400", tone: "muted" as AbTone },
    { label: "A thirteenth agent on the roster", sub: "with her name on it, visible to everybody", tone: "ok" as AbTone },
  ],
  warnTitle: "It fires in 27 days, whether or not it is active",
  warnBody: "The fee change reaches 410,000 Ghanaian customers on 14 September. Activating decides whether anybody is told on the day.",
  approverName: "Ada Obi",
  approverTeam: "Customer Success",
  approverNote: "activation is a re-auth · pausing it later is not",
  footnote: "Activating is harder than pausing on purpose. Switching an agent on takes a re-authentication from somebody who did not build it. Switching one off takes a click from anybody. The asymmetry is deliberate: the failure mode worth guarding against is a workspace slowly filling with agents nobody decided to add.",
};

// ───────────────────────── AB14 · RETIRE (modal, worked example: Reseller Terms) ─────────────────────────

export const AB14_RETIRED_ROWS: { agent: string; builder: string; retired: string; why: string; findingsKept: string; findingsKeptTone: AbTone }[] = [
  { agent: "Weekend Watch", builder: "Ifeoma", retired: "Mar", why: "Could never produce a finding · frequency is global", findingsKept: "0", findingsKeptTone: "muted" },
  { agent: "Reseller Terms", builder: "Kunle", retired: "Aug", why: "Its two findings became a learning in memory", findingsKept: "2", findingsKeptTone: "ok" },
];

export const AB14_PRESET = {
  title: "Reseller Terms",
  meta: "Built by Kunle in August · two findings · both became a learning",
  reason: "The two resellers who pay in arrears are now written into business memory with their terms. Watching for it nightly adds nothing.",
  effects: [
    { label: "It stops reading", sub: "₦0 from tonight", tone: "ok" as AbTone },
    { label: "Its findings stay", sub: "both of them, with their dates and what they became", tone: "ok" as AbTone },
    { label: "Its definition stays readable", sub: "sources, conditions, routing · somebody may rebuild it", tone: "ok" as AbTone },
    { label: "It is not deleted", sub: "a deleted agent makes an old finding unexplainable", tone: "risk" as AbTone },
  ],
  footnote: "An agent retired because its knowledge moved somewhere better is the good ending. It watched a pattern until the pattern was written down, and then it was unnecessary. Peter left four days after Kunle built it and the terms would otherwise have gone with him. Retiring this is the success case, and the reason is worth the sentence it takes to type.",
};

// ───────────────────────── AB15 · SETTINGS ─────────────────────────

export const AB15_ROWS: { rule: string; currently: string; currentlyTone: AbTone; who: string; canChange: boolean; state: string; stateTone: AbTone }[] = [
  { rule: "Anyone may build an agent", currently: "4 built", currentlyTone: "num", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Activation needs an approval", currently: "1 waiting", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A builder cannot activate their own agent", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Source access is derived from the builder's", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Claim ceiling is derived from what it reads", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Conditions are tested against history first", currently: "4 tested", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Findings must route to a named person", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Who may approve an activation", currently: "Ada", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Granting an agent more access than you have", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Building an agent that can send or approve", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Routing findings to a team or to a log", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const AB15_INHERITS_KV: { label: string; value: string; tone?: AbTone }[] = [
  { label: "The nine limits", value: "identical to the twelve · no send, no approve, no write", tone: "ok" },
  { label: "Pausing when a source fails", value: "it will stop rather than read a stale table", tone: "ok" },
  { label: "Claim types on every finding", value: "with an n and what it is comparing to", tone: "ok" },
  { label: "Appearing on the roster", value: "with its builder's name, visible to everybody", tone: "ok" },
  { label: "A cost line in Governance", value: "counted against the same budget as the twelve", tone: "ok" },
];

// ───────────────────────── New-agent wizard ─────────────────────────

export const NEW_AGENT_STEPS = ["What it watches", "What it reads", "Conditions", "Where findings go", "What it may say", "Review"] as const;
