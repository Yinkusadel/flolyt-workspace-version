import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";

/**
 * Agents · Governance — sourced from
 * flolyt-figma-designs/Agents Screens/flolyt-governance/flolyt-governance/
 * (18 frames, GV01-GV18). Content transcribed from the export's own `gv.py`
 * generator source, same approach as ai-teammates and marketplace. Third
 * section of the Agents group, after [[flolyt_marketplace_rebuild]].
 *
 * GV18 (mobile) has no dedicated route — its content (the six-item quarter
 * summary, the overdue-review callout, the closing line) is folded into the
 * default "The log" state below, same call as every earlier section's
 * "design responsive breakpoints myself" convention.
 */

export type GvTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const GV_TONE_CLASS: Record<GvTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const GV_CHIP_TONE: Record<GvTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const GV_KPI_TONE: Record<GvTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const GV_BAR_TONE: Record<GvTone, BarTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same convention as every prior rebuild's empty/edge states. */
export type GovernanceState = "nothing" | "first" | "full";
export const GOVERNANCE_STATE: GovernanceState = "full";

export const GV_TABS = ["The log", "Data access", "Permissions", "Spend", "Reviews", "Incidents"] as const;
export type GvTab = (typeof GV_TABS)[number];

export const GOVERNANCE_ENTRY_TITLES: Record<string, string> = {
  "411904": "Entry 411,904",
};

export const GOVERNANCE_ACCESS_TITLES: Record<string, string> = {
  su: "Support Signal · access",
};

// ───────────────────────── GV01 · NOTHING TO GOVERN YET ─────────────────────────

export const GV01_EMPTY = {
  heading: "Nothing has happened yet, so there is nothing to show you",
  body: "Every read, every finding, every proposal and every approval is written here as it happens. The log starts empty and cannot be edited, cleared or turned off — by an administrator, by Flolyt, or by anybody on any plan.",
  footnote: "The point of this section is that the claims made elsewhere in the product can be checked rather than believed.",
};

export const GV01_ROWS: { event: string; writtenBy: string; contains: string }[] = [
  { event: "An agent reads a source", writtenBy: "the system", contains: "which agent, which fields, how many rows, when" },
  { event: "An agent states a finding", writtenBy: "the system", contains: "the claim, the claim type, the n, who it routed to" },
  { event: "An agent proposes a play", writtenBy: "the system", contains: "the audience, the holdout, the copy" },
  { event: "A person approves something", writtenBy: "the system", contains: "who, when, the re-authentication, the tool signature" },
  { event: "A play executes", writtenBy: "the system", contains: "under the approver's identity, never the agent's" },
  { event: "An agent is paused, built or installed", writtenBy: "the system", contains: "who did it, the reason they typed" },
];

// ───────────────────────── GV02 · THE FIRST ENTRY ─────────────────────────

export const GV02_ENTRY = {
  meta: "12 DECEMBER · 22:04:11 · ENTRY 000001",
  line1: "repeat_decay · read · orders · 1,240,118 rows · fields: id, customer_id, created_at, total",
  line2: "credential: read-only · initiated by: schedule · no human present",
};

export const GV02_STATS: { eyebrow: string; value: string; note: string; tone: GvTone }[] = [
  { eyebrow: "Entries since", value: "412,088", note: "in eight months", tone: "num" },
  { eyebrow: "Written by a person", value: "0", note: "the system writes all of them", tone: "muted" },
  { eyebrow: "Edited or removed", value: "0", note: "and it is not possible", tone: "ok" },
  { eyebrow: "Sends by an agent", value: "0", note: "in 412,088 entries", tone: "ok" },
];

export const GV02_KV: { label: string; value: string; tone?: GvTone }[] = [
  { label: "It names the agent, not a service", value: "repeat_decay · not “system” or “flolyt”", tone: "ok" },
  { label: "It names the fields, not the table", value: "four columns of orders, not orders", tone: "ok" },
  { label: "It says who initiated it", value: "a schedule, a person, or another agent · always one of the three" },
  { label: "It records the credential used", value: "read-only · which is why the next line is checkable", tone: "ok" },
  { label: "It is numbered and sequential", value: "a gap in the sequence would itself be visible", tone: "ai" },
];

// ───────────────────────── GV03 · THE LOG ─────────────────────────

export const GV03_STATS: { eyebrow: string; value: string; note: string; tone: GvTone }[] = [
  { eyebrow: "Entries this quarter", value: "412,088", note: "412 runs · 141 findings", tone: "num" },
  { eyebrow: "Actions with a human identity", value: "18", note: "every send, every approval", tone: "ok" },
  { eyebrow: "Actions with an agent identity", value: "0", note: "and there is no way to produce one", tone: "ok" },
  { eyebrow: "Entries removed or edited", value: "0", note: "not possible for anybody", tone: "ok" },
];

export const GV03_ROWS: {
  time: string;
  entry: string;
  identity: string;
  identityTone: GvTone;
  kind: string;
  kindTone: GvTone;
  reauth: string;
  reauthTone: GvTone;
  id?: string;
}[] = [
  { time: "08:12", entry: "repeat_decay · finding · attribution split · association · n=4.3M · → Ifeoma", identity: "an agent", identityTone: "muted", kind: "read + state", kindTone: "ai", reauth: "—", reauthTone: "muted" },
  { time: "08:11", entry: "ravi.mehta · redirect · repeat_decay · queued for turn 5", identity: "a person", identityTone: "ok", kind: "steer", kindTone: "warn", reauth: "—", reauthTone: "muted" },
  { time: "07:30", entry: "sam.iyer · acknowledge · checkout stream outage", identity: "a person", identityTone: "ok", kind: "acknowledge", kindTone: "muted", reauth: "—", reauthTone: "muted" },
  { time: "04:12", entry: "data_integrity · finding · checkout stream stopped · constraint · → Sam", identity: "an agent", identityTone: "muted", kind: "read + state", kindTone: "ai", reauth: "—", reauthTone: "muted" },
  { time: "04:12", entry: "activation · paused · source unavailable · automatic", identity: "the system", identityTone: "muted", kind: "pause", kindTone: "warn", reauth: "—", reauthTone: "muted" },
  { time: "yesterday", entry: "ravi.mehta · approve + execute · kenya retry · 4,410 sent", identity: "a person", identityTone: "ok", kind: "send", kindTone: "risk", reauth: "08:04", reauthTone: "ok", id: "411904" },
  { time: "yesterday", entry: "involuntary_churn · propose · kenya retry · audience 4,900 · holdout 490", identity: "an agent", identityTone: "muted", kind: "propose", kindTone: "ai", reauth: "—", reauthTone: "muted" },
];

export const GV18_QUARTER: { label: string; value: string; note: string; tone: GvTone }[] = [
  { label: "Log entries", value: "412,088", note: "reads, findings, approvals", tone: "num" },
  { label: "Sends", value: "18", note: "all with a human re-auth", tone: "ok" },
  { label: "Personal fields read", value: "1", note: "ticket body · Support Signal", tone: "warn" },
  { label: "Write access, anywhere", value: "0", note: "including for people", tone: "ok" },
  { label: "Entries edited or removed", value: "0", note: "and it is not possible", tone: "ok" },
  { label: "Compute", value: "₦7,590", note: "of a ₦12,000 budget", tone: "muted" },
];

// ───────────────────────── GV04 · ONE ENTRY (411904) ─────────────────────────

export const GV04_ENTRY = {
  meta: "17 AUGUST · 08:04:31 · ENTRY 411,904 · SEND",
  lines: [
    "ravi.mehta · approve_and_execute · play kenya_retry_0900",
    "audience 4,410 · holdout 490 · channel: payment retry · no message content",
    "re-auth: passkey · 08:04:29 · device registered 14 Feb",
    "tool signature: play.execute · called by ravi.mehta, not by involuntary_churn",
  ],
};

export const GV04_ROWS: { line: string; proves: string; forged: string; forgedTone: GvTone }[] = [
  { line: "The identity is a person", proves: "A person, not a service account or an agent", forged: "not without their passkey", forgedTone: "ok" },
  { line: "The re-auth timestamp", proves: "They authenticated two seconds before, not this morning", forged: "no", forgedTone: "ok" },
  { line: "The tool signature", proves: "The execute call was made under their identity", forged: "no · agents have no such tool", forgedTone: "ok" },
  { line: "The agent that proposed it", proves: "Named separately, six minutes earlier, in its own entry", forged: "no", forgedTone: "ok" },
  { line: "No message content", proves: "The log records that a send happened, not what it said", forged: "—", forgedTone: "muted" },
];

// ───────────────────────── GV05 · CAN AN AGENT ACT? ─────────────────────────

export const GV05_CARDS: { eyebrow: string; heading: string; body: string; footer: string; tone: GvTone }[] = [
  { eyebrow: "The claim", heading: "No agent can act", tone: "ai", body: "Made on the boundary screen, in every settings table, and on the first screen a new person sees. It is the load-bearing claim of the entire product.", footer: "asserted in 40 places" },
  { eyebrow: "The weak evidence", heading: "It has not happened", tone: "warn", body: "412,088 log entries and zero actions under an agent identity. True, and it is the kind of evidence that only holds until the first time it does not.", footer: "absence, not impossibility" },
  { eyebrow: "The real evidence", heading: "The tool does not exist", tone: "ok", body: "Agent identities are issued a tool list that contains no send, no approve and no write. Not disabled — absent. The list is on this page.", footer: "checkable in one screen" },
];

export const GV05_ROWS: { tool: string; does: string; agents: string; agentsTone: GvTone; people: string; peopleTone: GvTone }[] = [
  { tool: "source.read", does: "Read granted fields from a granted source", agents: "yes", agentsTone: "ok", people: "yes", peopleTone: "ok" },
  { tool: "finding.state", does: "Write a finding with a claim type and an n", agents: "yes", agentsTone: "ok", people: "yes", peopleTone: "ok" },
  { tool: "play.propose", does: "Put a proposal in a room for a person to read", agents: "yes", agentsTone: "ok", people: "yes", peopleTone: "ok" },
  { tool: "play.execute", does: "Send something to customers", agents: "absent", agentsTone: "risk", people: "with re-auth", peopleTone: "warn" },
  { tool: "play.approve", does: "Approve a proposal", agents: "absent", agentsTone: "risk", people: "with re-auth", peopleTone: "warn" },
  { tool: "source.write", does: "Change anything in a source", agents: "absent", agentsTone: "risk", people: "no · nobody has it", peopleTone: "risk" },
  { tool: "threshold.set", does: "Change a threshold", agents: "absent", agentsTone: "risk", people: "yes", peopleTone: "ok" },
  { tool: "claim.promote", does: "Change a claim type", agents: "absent", agentsTone: "risk", people: "yes", peopleTone: "ok" },
];

// ───────────────────────── GV06 · DATA ACCESS ─────────────────────────

export const GV06_ROWS: {
  initials: string;
  agent: string;
  id?: string;
  sources: string;
  sourcesTone: GvTone;
  fields: string;
  fieldsTone: GvTone;
  personal: string;
  personalTone: GvTone;
  write: string;
  writeTone: GvTone;
  reviewed: string;
  reviewedTone: GvTone;
}[] = [
  { initials: "RD", agent: "Repeat & Decay", sources: "4", sourcesTone: "num", fields: "19", fieldsTone: "num", personal: "none", personalTone: "ok", write: "none", writeTone: "ok", reviewed: "Jun", reviewedTone: "warn" },
  { initials: "IC", agent: "Involuntary Churn", sources: "3", sourcesTone: "num", fields: "14", fieldsTone: "num", personal: "none", personalTone: "ok", write: "none", writeTone: "ok", reviewed: "Jun", reviewedTone: "warn" },
  { initials: "SU", agent: "Support Signal", id: "su", sources: "2", sourcesTone: "num", fields: "11", fieldsTone: "num", personal: "ticket body", personalTone: "warn", write: "none", writeTone: "ok", reviewed: "Jun", reviewedTone: "warn" },
  { initials: "PR", agent: "Product Reason", sources: "3", sourcesTone: "num", fields: "16", fieldsTone: "num", personal: "none", personalTone: "ok", write: "none", writeTone: "ok", reviewed: "Jun", reviewedTone: "warn" },
  { initials: "DI", agent: "Data Integrity", sources: "12", sourcesTone: "warn", fields: "0", fieldsTone: "ok", personal: "none", personalTone: "ok", write: "none", writeTone: "ok", reviewed: "Mar", reviewedTone: "risk" },
  { initials: "AS", agent: "Attribution Signal", sources: "2", sourcesTone: "num", fields: "6", fieldsTone: "num", personal: "none", personalTone: "ok", write: "none", writeTone: "ok", reviewed: "14 days ago", reviewedTone: "ok" },
];

// ───────────────────────── GV07 · ONE AGENT'S ACCESS (su) ─────────────────────────

export const GV07_HERO = {
  leftLabel: "the only agent reading a personal field",
  leftBig: "1",
  sub: "It reads the body of a support ticket, because a contact driver cannot be derived from metadata.",
  rightLabel: "reviewed",
  rightBig: "Jun",
  rightSub: "due again in 4 weeks",
};

export const GV07_ROWS: { source: string; field: string; personal: string; personalTone: GvTone; why: string; without: string; withoutTone: GvTone }[] = [
  { source: "tickets", field: "body", personal: "yes", personalTone: "warn", why: "The contact driver is in the words", without: "no", withoutTone: "risk" },
  { source: "tickets", field: "created_at, channel, status", personal: "no", personalTone: "ok", why: "Volume, timing and resolution", without: "—", withoutTone: "muted" },
  { source: "tickets", field: "customer_id", personal: "pseudonymous", personalTone: "warn", why: "Joining a ticket to a cohort", without: "no", withoutTone: "risk" },
  { source: "tickets", field: "agent_notes", personal: "not granted", personalTone: "muted", why: "Internal notes about staff", without: "—", withoutTone: "muted" },
  { source: "customers", field: "market, created_at, segment", personal: "no", personalTone: "ok", why: "Which cohort a contact came from", without: "—", withoutTone: "muted" },
  { source: "customers", field: "name, email, phone", personal: "not granted", personalTone: "muted", why: "Never needed · it works on cohorts", without: "—", withoutTone: "muted" },
];

// ───────────────────────── GV08 · PERMISSIONS ─────────────────────────

export const GV08_ROWS: {
  action: string;
  anyone: string;
  anyoneTone: GvTone;
  stageOwner: string;
  stageOwnerTone: GvTone;
  ada: string;
  adaTone: GvTone;
  agent: string;
  agentTone: GvTone;
  reauth: string;
}[] = [
  { action: "Ask an agent a question", anyone: "yes", anyoneTone: "ok", stageOwner: "yes", stageOwnerTone: "ok", ada: "yes", adaTone: "ok", agent: "no", agentTone: "muted", reauth: "no" },
  { action: "Redirect a run", anyone: "in the room", anyoneTone: "ok", stageOwner: "yes", stageOwnerTone: "ok", ada: "yes", adaTone: "ok", agent: "no", agentTone: "muted", reauth: "no" },
  { action: "Pause an agent", anyone: "yes", anyoneTone: "ok", stageOwner: "yes", stageOwnerTone: "ok", ada: "yes", adaTone: "ok", agent: "no", agentTone: "muted", reauth: "no" },
  { action: "Build an agent", anyone: "yes", anyoneTone: "ok", stageOwner: "yes", stageOwnerTone: "ok", ada: "yes", adaTone: "ok", agent: "no", agentTone: "risk", reauth: "no" },
  { action: "Activate a built agent", anyone: "no", anyoneTone: "risk", stageOwner: "no", stageOwnerTone: "risk", ada: "yes", adaTone: "ok", agent: "no", agentTone: "risk", reauth: "yes" },
  { action: "Install from the marketplace", anyone: "no", anyoneTone: "risk", stageOwner: "no", stageOwnerTone: "risk", ada: "yes", adaTone: "ok", agent: "no", agentTone: "risk", reauth: "yes" },
  { action: "Grant a field", anyone: "no", anyoneTone: "risk", stageOwner: "no", stageOwnerTone: "risk", ada: "yes", adaTone: "ok", agent: "no", agentTone: "risk", reauth: "yes" },
  { action: "Approve a play an agent proposed", anyone: "no", anyoneTone: "risk", stageOwner: "yes", stageOwnerTone: "ok", ada: "yes", adaTone: "ok", agent: "no", agentTone: "risk", reauth: "yes" },
  { action: "Edit the log", anyone: "never", anyoneTone: "risk", stageOwner: "never", stageOwnerTone: "risk", ada: "never", adaTone: "risk", agent: "never", agentTone: "risk", reauth: "—" },
];

// ───────────────────────── GV09 · SPEND ─────────────────────────

export const GV09_STATS: { eyebrow: string; value: string; note: string; tone: GvTone; href?: string }[] = [
  { eyebrow: "This month", value: "₦7,590", note: "412 runs · 12 agents", tone: "num" },
  { eyebrow: "Budget", value: "₦12,000", note: "set by Ada in March", tone: "muted" },
  { eyebrow: "At this rate", value: "₦8,900", note: "by month end", tone: "ok" },
  { eyebrow: "What happens at the cap", value: "agents pause", note: "in a stated order", tone: "warn", href: "/governance/cap" },
];

export const GV09_BARS: { label: string; value: string; percent: number; tone: GvTone }[] = [
  { label: "Repeat & Decay · 119 runs", value: "₦2,140 · 312M rows", percent: 100, tone: "ai" },
  { label: "Product Reason · 38 runs", value: "₦1,180 · 88M rows", percent: 55, tone: "ai" },
  { label: "Involuntary Churn · 61 runs", value: "₦980 · 41M rows", percent: 46, tone: "ai" },
  { label: "Churn Reason · 26 runs", value: "₦840 · 52M rows", percent: 39, tone: "ai" },
  { label: "Support Signal · 44 runs", value: "₦720 · 9M rows", percent: 34, tone: "ai" },
  { label: "Everything else · 124 runs", value: "₦1,730", percent: 81, tone: "muted" },
];

export const GV09_KV: { label: string; value: string; tone?: GvTone }[] = [
  { label: "Set by", value: "Ada · March · ₦12,000 a month" },
  { label: "Why it exists", value: "not cost · ₦7,590 is a rounding error against ₦4.2 billion", tone: "muted" },
  { label: "What it is really for", value: "noticing when something starts reading far more than it used to", tone: "ai" },
  { label: "What would trigger a look", value: "any agent up 50% week on week · none currently", tone: "ok" },
  { label: "Where the invoice lives", value: "Settings · billing · this section holds the policy", tone: "muted" },
];

// ───────────────────────── GV10 · AT THE CAP ─────────────────────────

export const GV10_ROWS: { order: string; agent: string; why: string; stops: string; stopsTone: GvTone; told: string }[] = [
  { order: "1", agent: "Churn Reason", why: "17 findings, 0 rooms · nobody reads them", stops: "Churn · already unowned", stopsTone: "muted", told: "Ada" },
  { order: "2", agent: "Product Reason", why: "19 findings, 0 rooms · nobody reads them", stops: "Adopt · already unowned", stopsTone: "muted", told: "Ada" },
  { order: "3", agent: "Acquisition Quality", why: "Lowest finding rate of the owned stages", stops: "Acquire", stopsTone: "muted", told: "Tunde, Ada" },
  { order: "4", agent: "Expansion", why: "Four rooms, all closed", stops: "Expand", stopsTone: "muted", told: "Tunde, Ada" },
  { order: "—", agent: "Data Integrity", why: "Never stops · it is how anybody knows a source failed", stops: "—", stopsTone: "muted", told: "—" },
  { order: "—", agent: "Involuntary Churn", why: "Never stops · it watches money leaving today", stops: "—", stopsTone: "muted", told: "—" },
];

export const GV10_KV: { label: string; value: string; tone?: GvTone }[] = [
  { label: "Agents pause in the order above", value: "one at a time, as the spend requires", tone: "warn" },
  { label: "Every pause is logged", value: "with the reason: budget cap, not source failure", tone: "ok" },
  { label: "Stages show Unavailable", value: "not last-known · the same rule as everywhere else", tone: "ok" },
  { label: "Ada is told before the first pause", value: "at 90% · with the order and what it would cost", tone: "ok" },
  { label: "Nothing degrades quietly", value: "an agent stopped by a budget looks different from one stopped by a source", tone: "ai" },
  { label: "It has never happened", value: "closest was 71% in April, when the map was being built", tone: "muted" },
];

// ───────────────────────── GV11 · REVIEWS ─────────────────────────

export const GV11_ROWS: { review: string; when: string; whenTone: GvTone; agents: string; changed: string; changedTone: GvTone; found: string; by: string }[] = [
  { review: "Quarterly access review", when: "Jun", whenTone: "muted", agents: "12", changed: "2", changedTone: "warn", found: "Two agents had fields they no longer used", by: "Ada" },
  { review: "After the resend incident", when: "15 Aug", whenTone: "warn", agents: "3", changed: "0", changedTone: "muted", found: "Nothing · it was not an access problem", by: "Ada" },
  { review: "On installing Attribution Signal", when: "14 days ago", whenTone: "muted", agents: "1", changed: "1", changedTone: "ok", found: "Two requested fields declined at install", by: "Ada" },
  { review: "Quarterly access review", when: "Mar", whenTone: "muted", agents: "9", changed: "3", changedTone: "warn", found: "Three agents predated the field-level model", by: "Ada" },
  { review: "Next", when: "due Sep", whenTone: "warn", agents: "13", changed: "—", changedTone: "muted", found: "Data Integrity has not been reviewed since March", by: "—" },
];

// ───────────────────────── GV12 · AN INCIDENT (1) ─────────────────────────

export const GV12_ROWS: { time: string; entry: string; identity: string; identityTone: GvTone; tells: string; tellsTone: GvTone }[] = [
  { time: "14 Aug 11:02", entry: "ifeoma.nwosu · create · resend list from saved segment", identity: "a person", identityTone: "ok", tells: "built outside the play", tellsTone: "risk" },
  { time: "14 Aug 11:04", entry: "ifeoma.nwosu · approve_and_execute · direct send · 38,412", identity: "a person", identityTone: "ok", tells: "a valid send, correctly authorised", tellsTone: "warn" },
  { time: "14 Aug 11:04", entry: "system · frequency cap applied · 0 suppressed", identity: "the system", identityTone: "muted", tells: "the cap ran · the hold list did not", tellsTone: "risk" },
  { time: "15 Aug 04:00", entry: "hold_list_integrity · finding · 1,204 held customers were sent to", identity: "an agent", identityTone: "muted", tells: "14 hours later", tellsTone: "ok" },
  { time: "15 Aug 04:00", entry: "system · withdraw · provisional figure ₦9.1M", identity: "the system", identityTone: "muted", tells: "automatic on contamination", tellsTone: "ok" },
  { time: "15 Aug 09:12", entry: "ada.obi · review · access unchanged", identity: "a person", identityTone: "ok", tells: "not an access problem", tellsTone: "muted" },
];

// ───────────────────────── GV13 · REVOKE A FIELD (modal, su) ─────────────────────────

export const GV13_PRESET = {
  title: "Revoke tickets.body from Support Signal",
  meta: "The only personal field any agent in this workspace reads",
  stops: [
    { label: "Contact drivers", sub: "31% of tickets were about the fee · that reading ends", tone: "risk" as GvTone },
    { label: "Reply themes", sub: "the five themes in Replies are built from this", tone: "risk" as GvTone },
    { label: "The support health signal", sub: "11.2% in the lapsed cohort · becomes Unavailable", tone: "risk" as GvTone },
    { label: "Ticket volume and timing", sub: "unaffected · that is metadata", tone: "ok" as GvTone },
  ],
  warnTitle: "This field produced the earliest correct signal about the fee change",
  warnBody: "3,968 people described it in their own words from 11 March. Revoking is a defensible privacy decision and it costs the workspace its cheapest early warning.",
  footnote: "Revoking takes effect on the next run and nothing is retrospective. Findings already made from this field stay, with their dates. The agent pauses the parts of its work that need it and continues with the rest, marked as reading fewer fields than it used to. Both the revocation and the reason go in the log under your identity.",
};

// ───────────────────────── GV14 · SET A CAP (modal) ─────────────────────────

export const GV14_PRESET = {
  title: "Monthly compute budget",
  meta: "₦12,000 · set March · running at ₦8,900 by month end",
  newValue: "₦9,000",
  was: "was ₦12,000",
  effects: [
    { label: "At the current rate", value: "the cap is reached on 27 August", tone: "risk" as GvTone },
    { label: "First agent to pause", value: "Churn Reason · 17 findings, 0 rooms", tone: "warn" as GvTone },
    { label: "Second", value: "Product Reason · 19 findings, 0 rooms", tone: "warn" as GvTone },
    { label: "What that saves", value: "₦2,020 a month", tone: "muted" as GvTone },
  ],
  warnTitle: "This saves ₦2,020 and stops watching two stages",
  warnBody: "Both are unowned, so nobody would notice. That is the argument for doing it and the reason to be careful about it.",
  footnote: "A budget here is a tripwire, not a cost control. ₦7,590 a month against a business this size is not worth managing. What the cap is for is noticing when something starts reading far more than it used to — and setting it just above the current run rate turns a tripwire into a monthly outage nobody chose.",
};

// ───────────────────────── GV15 · EXPORT FOR AN AUDITOR ─────────────────────────

export const GV15_ROWS: { included: string; lets: string; optional: string; optionalTone: GvTone; format: string }[] = [
  { included: "The complete log, numbered and sequential", lets: "That nothing has been removed", optional: "no", optionalTone: "risk", format: "CSV, JSON" },
  { included: "The tool list per identity", lets: "That agents have no send, approve or write tool", optional: "no", optionalTone: "risk", format: "JSON" },
  { included: "Every field grant, with dates and who", lets: "What each agent could see, and when", optional: "no", optionalTone: "risk", format: "CSV" },
  { included: "Every re-authentication", lets: "That each send had a person behind it", optional: "no", optionalTone: "risk", format: "CSV" },
  { included: "Access reviews and their outcomes", lets: "That access is checked, including when nothing changed", optional: "yes", optionalTone: "ok", format: "PDF" },
  { included: "Message content", lets: "Nothing · it is not in the log", optional: "never", optionalTone: "risk", format: "—" },
  { included: "Customer data of any kind", lets: "Nothing · this is a record of actions", optional: "never", optionalTone: "risk", format: "—" },
];

export const GV15_KV: { label: string; value: string; tone?: GvTone }[] = [
  { label: "Ravi Mehta", value: "14 August · for the board pack appendix · nothing followed" },
  { label: "A prospective enterprise buyer", value: "June · their security review · via Ada", tone: "muted" },
  { label: "Nobody external", value: "no regulator, no auditor, no incident · not yet", tone: "muted" },
  { label: "What the export does not do", value: "prove the agents are useful · only that they are bounded", tone: "ai" },
];

// ───────────────────────── GV16 · WHAT THIS CANNOT TELL YOU ─────────────────────────

export const GV16_ROWS: { question: string; can: string; canTone: GvTone; why: string; what: string; whatTone: GvTone }[] = [
  { question: "Did an agent send anything?", can: "yes", canTone: "ok", why: "Every send has an identity and a re-auth", what: "this section", whatTone: "ai" },
  { question: "Could an agent send anything?", can: "yes", canTone: "ok", why: "The tool is absent from its identity", what: "the capability screen", whatTone: "ai" },
  { question: "What did an agent read?", can: "yes", canTone: "ok", why: "Fields and row counts, per run", what: "this section", whatTone: "ai" },
  { question: "Was a finding correct?", can: "no", canTone: "risk", why: "The log records claims, not truth", what: "Experiments · a holdout", whatTone: "muted" },
  { question: "Was a finding useful?", can: "no", canTone: "risk", why: "Reading is not recorded · nobody logs attention", what: "nothing · it is unmeasured", whatTone: "risk" },
  { question: "Did the right person get it?", can: "partly", canTone: "warn", why: "It records who it routed to, not whether they read it", what: "Handoff, Inbox", whatTone: "muted" },
  { question: "Should this agent exist?", can: "no", canTone: "risk", why: "That is a judgement about value, not a record", what: "its record and its cost", whatTone: "muted" },
];

// ───────────────────────── GV17 · SETTINGS ─────────────────────────

export const GV17_ROWS: { rule: string; currently: string; currentlyTone: GvTone; who: string; canChange: boolean; state: string; stateTone: GvTone }[] = [
  { rule: "Every read, finding and action is logged", currently: "412,088", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The log is sequential and cannot be edited", currently: "0 gaps", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Agent identities have no send, approve or write tool", currently: "4 absent", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Field grants, not table grants", currently: "12 agents", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A new field needs an approval", currently: "1 waiting", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Monthly budget", currently: "₦12,000", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "The order agents pause in at the cap", currently: "6 ranked", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Access review cadence", currently: "quarterly", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Log retention", currently: "forever", currentlyTone: "neutral", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Logging who read a finding", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Turning the log off, for anybody", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const GV17_ELSEWHERE_KV: { label: string; value: string; tone?: GvTone }[] = [
  { label: "Here", value: "the log, tool lists, field grants, permissions, budget policy, reviews" },
  { label: "Settings · billing", value: "the invoice · what this compute actually costs to buy", tone: "muted" },
  { label: "Agent details", value: "one agent's record, findings and steering history", tone: "muted" },
  { label: "Data", value: "whether a source is healthy · this section only records who read it", tone: "muted" },
  { label: "Rooms", value: "what a play said · the log records that it was sent, not its words", tone: "muted" },
];
