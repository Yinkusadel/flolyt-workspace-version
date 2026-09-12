import { agentInitialsFromName } from "@/pages/rooms/format";
import type { AgentRef } from "@/pages/rooms/types";
import { REPEAT_DECAY } from "@/pages/rooms/data";
import { ME, type PersonRef } from "@/pages/inbox/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/memory/svg/01–05. Business memory is a
 * search-first surface, not a browsing one — see index.html's own framing ("Designed,
 * Implemented, Healthy, Decaying"). Only five screens are authored in the export (the index in
 * its default and recall states, the empty state, and one entry in each of its two control
 * shapes), so this section stays a flat `/business-memory` + `/business-memory/:id` — no tab bar,
 * no settings, no wizard, unlike the old Knowledge-group build this replaces (src/oldpages).
 *
 * `REPEAT_DECAY` is the one agent this section shares with the rest of the app (Room 2412's
 * opener, per rooms/data.ts). `DISCOUNT_OPTIMIZER` has no existing roster entry — added locally
 * rather than to the shared roster, matching the old build's "one-off agent" precedent. `ME` and
 * `REVAN` (Dana O. and the Finance objector on Room 2471) are reused from inbox/data.ts so the
 * decision/objection on Room 2412 reads as the same two people, not a coincidence.
 */

export type ControlStatus = "healthy" | "decaying" | "no-control" | "unavailable";

export type EvidenceTier = "measured" | "corroborated" | "indicative";

export const DISCOUNT_OPTIMIZER: AgentRef = {
  initials: agentInitialsFromName("Discount Optimizer"),
  name: "Discount Optimizer",
};

const REVAN: PersonRef = { name: "Revan S.", initials: "RS", team: 1 };

export type Control = {
  status: ControlStatus;
  /** e.g. "Healthy · 3d ago", "No control designed", "Unavailable" — the index badge's own label. */
  badgeLabel: string;
};

export type Citation = { label: string; date: string };

export type Objection = { person: PersonRef; body: string; resolution: string };

export type Decision = { approver: PersonRef; role: string; date: string; objection?: Objection };

export type DecayPoint = { month: string; percent: number };

export type DecayDetail = {
  summary: string;
  chartTargetPercent: number;
  chart: DecayPoint[];
  whatChanged: string;
  stillGivesYou: string;
};

export type MemoryEntry = {
  id: string;
  room: string;
  title: string;
  closedShort: string;
  closedFull: string;
  openDays: number;
  openedBy?: AgentRef;
  preserved: string | null;
  measuredAgainst: string;
  control: Control;
  citedCount: number;
  /** Cited by a room opened this quarter — drives the index's "Cited this quarter" filter chip. */
  citedThisQuarter?: boolean;
  whatWorkedShort: string;
  recurrence?: string;
  whatBroke?: string;
  evidence?: { tier: EvidenceTier; text: string }[];
  triedFirst?: string;
  workedDetail?: string;
  decision?: Decision;
  citedSince?: Citation[];
  decay?: DecayDetail;
};

export const EVIDENCE_TIER_LABEL: Record<EvidenceTier, string> = {
  measured: "Measured",
  corroborated: "Corroborated",
  indicative: "Indicative",
};

/** Same tone mapping as inbox/approval-view.tsx's TIER_TONE — kept in step so the same evidence
 * tier reads the same way in both places. */
export const EVIDENCE_TIER_TONE: Record<EvidenceTier, "teal" | "neutral" | "amber"> = {
  measured: "teal",
  corroborated: "neutral",
  indicative: "amber",
};

export const CONTROL_CHIP_TONE: Record<ControlStatus, "teal" | "amber" | "rose" | "neutral"> = {
  healthy: "teal",
  decaying: "amber",
  "no-control": "rose",
  unavailable: "neutral",
};

export const MEMORY_ENTRIES: MemoryEntry[] = [
  {
    id: "room-2412",
    room: "Room 2412",
    title: "Delivery fee shown after the cart",
    closedShort: "14 Mar",
    closedFull: "14 March",
    openDays: 9,
    openedBy: REPEAT_DECAY,
    preserved: "₦312K",
    measuredAgainst: "10% holdout",
    control: { status: "healthy", badgeLabel: "Healthy" },
    citedCount: 4,
    citedThisQuarter: true,
    whatWorkedShort: "Fee moved above the cart and pinned by a release check",
    recurrence: "None in 6 months",
    whatBroke:
      "Second-order rate fell from 38% to 27% for everyone acquired after 4 March. 18,402 customers. ₦412M at risk over 90 days.",
    evidence: [
      { tier: "measured", text: "The delivery fee moved below the cart in the 4 March release." },
      { tier: "corroborated", text: "Customers whose first order arrived late reordered 31% less." },
      { tier: "indicative", text: "The first-order discount was not reapplied at order two." },
    ],
    triedFirst:
      "A win-back email to the affected cohort. No measurable lift against the holdout after six days. Reverted. Kept here because the next agent should not retry it.",
    workedDetail:
      "Fee position restored above the cart. Second-order rate recovered to 36% within eleven days, measured against a 10% holdout that kept the new layout.",
    decision: {
      approver: ME,
      role: "Product",
      date: "5 March",
      objection: {
        person: REVAN,
        body: "Revan S. objected to the discount leg on cost grounds",
        resolution: "Partly upheld — the discount leg was dropped, the fee fix shipped alone",
      },
    },
    citedSince: [
      { label: "Room 2465 · discount reapplication", date: "9 Mar" },
      { label: "Room 2471 · checklist drop-off", date: "2 Apr" },
      { label: "Room 2473 · discount depth", date: "5 Apr" },
      { label: "Playbook · checkout release checks", date: "11 Apr" },
    ],
  },
  {
    id: "room-2388",
    room: "Room 2388",
    title: "Dunning retries clustered on day one",
    closedShort: "2 Feb",
    closedFull: "2 February",
    openDays: 6,
    preserved: "₦224K",
    measuredAgainst: "10% holdout",
    control: { status: "decaying", badgeLabel: "Decaying" },
    citedCount: 7,
    whatWorkedShort: "Retries spread across days 1, 3 and 7 on the card issuer response",
    decay: {
      summary:
        "Retry spread held for five months. Effectiveness fell below 85% in August and the pattern is back on annual NGN plans. A control that is not monitored decays. This one did, and memory is where that shows up rather than in a new investigation.",
      chartTargetPercent: 85,
      chart: [
        { month: "Feb", percent: 93 },
        { month: "Mar", percent: 92 },
        { month: "Apr", percent: 91 },
        { month: "May", percent: 89 },
        { month: "Jun", percent: 87 },
        { month: "Jul", percent: 86 },
        { month: "Aug", percent: 79 },
        { month: "Sep", percent: 71 },
      ],
      whatChanged:
        "The issuer changed its retry response codes in July. The control still runs, but it is matching on a code that no longer appears.",
      stillGivesYou:
        "The diagnosis holds — retries clustered on day one is still the mechanism, and the fix worked for five months. What needs redoing is the control, not the investigation. That is the difference between memory and a report.",
    },
  },
  {
    id: "room-2301",
    room: "Room 2301",
    title: "Onboarding checklist stalls at step 4",
    closedShort: "11 Dec",
    closedFull: "11 December",
    openDays: 12,
    preserved: "₦156K",
    measuredAgainst: "15% holdout",
    control: { status: "healthy", badgeLabel: "Healthy" },
    citedCount: 9,
    whatWorkedShort: "Step 4 split in two and made skippable",
    recurrence: "None in 4 months",
    whatBroke:
      "61% of new signups abandoned the onboarding checklist at step 4 (connect a payout account). Completion cratered from October's 74% after the account-verification copy changed on 28 Nov.",
    evidence: [
      { tier: "measured", text: "Step 4 completion fell in the same week the verification copy changed." },
      { tier: "corroborated", text: "Support tickets mentioning \"stuck\" tripled in the same window." },
      { tier: "indicative", text: "The step had no way to skip it and return later." },
    ],
    triedFirst:
      "A tooltip explaining the verification requirement. Completion barely moved — 66% after two weeks. Reverted the copy, kept the tooltip.",
    workedDetail:
      "Step 4 split into a required half and a skippable optional half. Completion recovered to 79% within eleven days, measured against a 15% holdout on the old flow.",
    decision: { approver: ME, role: "Product", date: "13 December" },
    citedSince: [{ label: "Playbook · onboarding release checks", date: "2 Jan" }],
  },
  {
    id: "room-2465",
    room: "Room 2465",
    title: "First-order discount not reapplied",
    closedShort: "9 Mar",
    closedFull: "9 March",
    openDays: 4,
    preserved: "₦88.4K",
    measuredAgainst: "10% holdout",
    control: { status: "no-control", badgeLabel: "No control" },
    citedCount: 2,
    citedThisQuarter: true,
    whatWorkedShort: "Discount carried through order two for the affected cohort",
    whatBroke:
      "The first-order discount did not carry through to a customer's second order for the cohort acquired after 4 March. 6,140 customers affected.",
    evidence: [
      { tier: "measured", text: "Order two charged full price, not the first-order rate, for 41% of the cohort." },
      { tier: "indicative", text: "The discount service checked order sequence only, not customer-level history." },
    ],
    workedDetail: "Discount carried through order two via a one-time backfill and a sequence-check fix.",
    decision: { approver: ME, role: "Product", date: "9 March" },
    citedSince: [{ label: "Room 2473 · discount depth", date: "5 Apr" }],
  },
  {
    id: "room-2277",
    room: "Room 2277",
    title: "Kenya market fee misconfiguration",
    closedShort: "3 Nov",
    closedFull: "3 November",
    openDays: 2,
    preserved: null,
    measuredAgainst: "no holdout run",
    control: { status: "healthy", badgeLabel: "Healthy" },
    citedCount: 1,
    whatWorkedShort: "Market fee table corrected at source",
    recurrence: "None since",
    whatBroke:
      "A pricing sync left Kenya's fee table pointing at last quarter's rate, overcharging every order in the market by a fixed KES amount.",
    evidence: [{ tier: "measured", text: "Kenya's fee row referenced last quarter's rate table after the 2 November sync." }],
    workedDetail: "Fee table corrected at source; no downstream fix needed, so no holdout was run.",
    citedSince: [{ label: "Room 2472 · card failures", date: "6 Nov" }],
  },
];

export function getMemoryEntry(id: string | undefined): MemoryEntry | undefined {
  return MEMORY_ENTRIES.find((entry) => entry.id === id);
}

export function countByControlStatus(status: ControlStatus): number {
  return MEMORY_ENTRIES.filter((entry) => entry.control.status === status).length;
}

export function countCitedThisQuarter(): number {
  return MEMORY_ENTRIES.filter((entry) => entry.citedThisQuarter).length;
}

export type IndexFilter = "all" | "healthy" | "decaying" | "no-control" | "cited";

export function filterEntries(entries: MemoryEntry[], filter: IndexFilter): MemoryEntry[] {
  if (filter === "healthy") return entries.filter((e) => e.control.status === "healthy");
  if (filter === "decaying") return entries.filter((e) => e.control.status === "decaying");
  if (filter === "no-control") return entries.filter((e) => e.control.status === "no-control");
  if (filter === "cited") return entries.filter((e) => e.citedThisQuarter);
  return entries;
}

/** Business memory has its own tiny demo-state flag, same precedent as the old build's `MEMORY_STATE` — flip to "empty" to preview 05. */
export const MEMORY_DEMO_STATE: "populated" | "empty" = "populated";

export const RETAINED_NOTE =
  `${MEMORY_ENTRIES.length} closed rooms retained so far · episodic memory is kept for three years, controls and playbooks permanently`;

/**
 * Workspace-wide headline stats — authored aggregate figures, same convention as leakage-map's
 * "4.2M customers" header (see leakage-map/data.ts): illustrative of a much larger real dataset
 * than the five rows below them, not a computation over MEMORY_ENTRIES.
 */
export const MEMORY_STATS = {
  controlCoverage: { value: "87%", note: "target 95% · 4 rooms short", tone: "amber" as const },
  controlEffectiveness: { value: "91%", note: "target 85%", tone: "teal" as const },
  fixEffectiveness: { value: "84%", note: "target 80%", tone: "teal" as const },
  citedThisQuarter: { value: "34", note: "across 12 rooms", tone: "ink" as const },
};

export type NearestMatch = {
  entryId: string;
  strength: "strong" | "partial" | "weak";
  reason: string;
  suggestion: string;
};

export const RECALL_QUERY_PLACEHOLDER = "discount depth rising with no lift in conversion";

export const RECALL_BANNER = {
  agent: DISCOUNT_OPTIMIZER,
  headline: "Discount Optimizer checked memory before opening Room 2473",
  body: "Two near matches. Neither control covers the Lagos cohort, so it opened a new room rather than reusing one.",
};

export const NEAREST_MATCHES: NearestMatch[] = [
  {
    entryId: "room-2412",
    strength: "strong",
    reason: "Same mechanism — a checkout change that suppressed reorders. Control is healthy but scoped to fee position, not discount depth.",
    suggestion: "Reuse the release check, widen its scope",
  },
  {
    entryId: "room-2465",
    strength: "partial",
    reason:
      "Same lever, different cohort. Fix worked but no control was designed, so nothing would have caught this recurrence.",
    suggestion: "Design the control that was skipped",
  },
  {
    entryId: "room-2277",
    strength: "weak",
    reason: "Shares the market dimension only. Different mechanism.",
    suggestion: "Not applicable",
  },
];

export const OPEN_ROOMS_PREVIEW: { label: string; stage: string }[] = [
  { label: "Room 2471 · checklist drop-off", stage: "Diagnosed" },
  { label: "Room 2472 · card failures", stage: "Detected" },
  { label: "Room 2473 · discount depth", stage: "Detected" },
];
