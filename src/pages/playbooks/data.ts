import type { AgentRef } from "@/pages/rooms/types";
import { ME, type PersonRef } from "@/pages/inbox/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/playbooks/svg/01–07. A playbook is memory
 * that has earned the right to run again — proposed from outcomes, proved against holdouts,
 * granted autonomy by working, retired when it stops. This **replaces** the placeholder stub at
 * `/playbooks`; the old 16-screen Knowledge-group build (`src/oldpages/knowledge/playbooks`,
 * see the historical [[flolyt_playbooks_rebuild]] memory) is not reused — new export, new copy,
 * new agent roster.
 *
 * Every agent here (Guardian, Prism, Anchor, RIA, Loom, Maestro) is new to this export and has no
 * existing roster entry, so all six stay locally scoped rather than joining `rooms/data.ts`'s
 * shared roster — same "one-off agent" precedent as business-memory's `DISCOUNT_OPTIMIZER`.
 * `ME` (Dana O., the approver on every release in this export) is reused from `inbox/data.ts`;
 * `REVAN` is redeclared locally since `inbox/data.ts` doesn't export it either.
 */

export type AutonomyStatus = "automatic" | "proposed" | "draft" | "retired";

export const AUTONOMY_LABEL: Record<AutonomyStatus, string> = {
  automatic: "Automatic",
  proposed: "Proposed",
  draft: "Draft",
  retired: "Retired",
};

export const AUTONOMY_TONE: Record<AutonomyStatus, "teal" | "amber" | "neutral"> = {
  automatic: "teal",
  proposed: "amber",
  draft: "neutral",
  retired: "neutral",
};

export const GUARDIAN: AgentRef = { initials: "GD", name: "Guardian" };
export const PRISM: AgentRef = { initials: "PR", name: "Prism" };
export const ANCHOR: AgentRef = { initials: "AN", name: "Anchor" };
export const RIA: AgentRef = { initials: "RI", name: "RIA" };
export const LOOM: AgentRef = { initials: "LO", name: "Loom" };
export const MAESTRO: AgentRef = { initials: "MA", name: "Maestro" };

const REVAN: PersonRef = { name: "Revan S.", initials: "RS", team: 1 };

export type RunResult = "significant" | "not-significant";

export type PlaybookRun = {
  runNumber: number;
  when: string;
  cohort: number;
  preserved: string | null;
  result: RunResult;
  releasedBy: PersonRef;
  detail?: RunDetail;
};

export type PlaybookStep = { title: string; detail: string };
export type PlaybookParameter = { label: string; value: string };
export type RoomCitation = { label: string; roomId?: string };

export type RunTimelineStep = { time: string; title: string; detail: string };
export type RunExclusion = { count: number; reason: string };

export type RunDetail = {
  triggeredBy: AgentRef;
  liftLabel: string;
  liftNote: string;
  heldBack: number;
  excludedTotal: number;
  excludedNote: string;
  timeline: RunTimelineStep[];
  measuredBody: string;
  measuredStats: string;
  excludedBreakdown: RunExclusion[];
  addedToMemoryBody: string;
};

export type EffectByRun = { run: string; label: string; percent: number; significant: boolean };

export type DecayDetail = {
  version: number;
  agent: AgentRef;
  runsCount: number;
  lastRun: string;
  summary: string[];
  effectByRun: EffectByRun[];
  chartNote: string;
  whyStopped: string[];
  goodOutcome: string[];
};

export type ProposalDetail = {
  drawnFrom: { label: string; date: string; preserved: string }[];
  fromRoomsBody: string;
  proposing: { label: string; value: string }[];
  backtestCount: number;
  backtestBody: string;
  falsePositiveNote: string;
};

export type Playbook = {
  id: string;
  name: string;
  owner: AgentRef;
  ownerNote?: string;
  trigger: string;
  runs: number;
  effectLabel: string;
  effectTone: "teal" | "neutral";
  status: AutonomyStatus;
  retiredOn?: string;

  version?: number;
  promotedFromRoom?: string;
  promotedDate?: string;
  releasedByLine?: string;

  whenItRunsBody?: string;
  whenItRunsCondition?: string[];
  whoReleasesBody?: string[];
  automaticAfter?: string;

  steps?: PlaybookStep[];
  parameters?: PlaybookParameter[];

  runsSignificantOf?: number;
  runHistory?: PlaybookRun[];

  cameFromBody?: string;
  citedRooms?: RoomCitation[];

  decay?: DecayDetail;
  proposal?: ProposalDetail;
};

export const PLAYBOOKS: Playbook[] = [
  {
    id: "delivery-fee-position-check",
    name: "Delivery fee position check",
    owner: GUARDIAN,
    trigger: "every checkout release",
    runs: 34,
    effectLabel: "2 regressions caught",
    effectTone: "teal",
    status: "automatic",
  },
  {
    id: "first-order-discount-reapplication",
    name: "First-order discount reapplication",
    owner: PRISM,
    trigger: "order two on a discounted first order",
    runs: 12,
    effectLabel: "₦88.4K preserved",
    effectTone: "teal",
    status: "automatic",
  },
  {
    id: "dunning-retry-spread",
    name: "Dunning retry spread",
    owner: ANCHOR,
    trigger: "card failures cluster on one plan",
    runs: 18,
    effectLabel: "₦224K preserved",
    effectTone: "teal",
    status: "proposed",
  },
  {
    id: "win-back-60-day-lapsed",
    name: "Win-back the 60-day lapsed",
    owner: RIA,
    ownerNote: "RIA detects the cohort, Prism sets the offer ceiling",
    trigger: "a cohort crosses 60 days dormant",
    runs: 9,
    effectLabel: "₦312K preserved",
    effectTone: "teal",
    status: "proposed",

    version: 3,
    promotedFromRoom: "Room 2442",
    promotedDate: "11 February",

    whenItRunsBody: "A cohort of 500 or more crosses 60 days without an order, and the drop is not explained by an open room.",
    whenItRunsCondition: ["cohort.size >= 500 AND days_since_order >= 60", "AND NOT cohort.in_open_room"],

    whoReleasesBody: [
      "Proposed means it never runs on its own. Each run waits for an approver because it messages customers and touches a discount.",
    ],
    automaticAfter: "Automatic after 12 significant runs",

    steps: [
      { title: "Build the cohort", detail: "exclude anyone in an open room" },
      { title: "Hold back a control", detail: "10% at random, never the same people twice" },
      { title: "Ask Prism for the ceiling", detail: "the offer may not go below the floor" },
      { title: "Request release", detail: "from whoever can approve that discount" },
      { title: "Hand the audience to Klaviyo", detail: "Flolyt does not send" },
      { title: "Measure at day 14", detail: "against the holdout, not against last month" },
    ],

    parameters: [
      { label: "Cohort cap", value: "2,500 per run" },
      { label: "Holdout", value: "10%" },
      { label: "Offer ceiling", value: "set by Prism" },
      { label: "Quiet hours", value: "customer's local" },
      { label: "Cool-off", value: "90 days per person" },
      { label: "Measure at", value: "day 14" },
    ],

    runsSignificantOf: 7,
    runHistory: [
      {
        runNumber: 9,
        when: "2 April",
        cohort: 1204,
        preserved: "₦42,100",
        result: "significant",
        releasedBy: ME,
        detail: {
          triggeredBy: RIA,
          liftLabel: "+6.2 pts",
          liftNote: "reorder within 14 days",
          heldBack: 120,
          excludedTotal: 142,
          excludedNote: "in an open room",
          timeline: [
            { time: "09:02", title: "Trigger fired", detail: "RIA · 1,346 customers crossed 60 days" },
            { time: "09:02", title: "Conditions checked", detail: "no open room covers this cohort" },
            { time: "09:04", title: "Cohort built", detail: "1,204 after exclusions · 120 held back" },
            { time: "09:04", title: "Ceiling requested", detail: "Prism returned 15%, floor not breached" },
            { time: "09:05", title: "Release requested", detail: "discount 15% routed to Dana O." },
            { time: "11:40", title: "Released", detail: "Dana O. · 2h 35m after the request" },
            { time: "11:41", title: "Handed to Klaviyo", detail: "Flolyt did not send · audience passed" },
            { time: "16 Apr", title: "Measured", detail: "day 14, against the 120 held back" },
          ],
          measuredBody:
            "120 customers were held back at random and received nothing. 14 days later the treated group reordered 6.2 points more.",
          measuredStats: "p = 0.02 · n = 1,204 / 120",
          excludedBreakdown: [
            { count: 142, reason: "already in an open room" },
            { count: 88, reason: "inside the 90-day cool-off" },
            { count: 12, reason: "no contactable address" },
          ],
          addedToMemoryBody:
            "The 15% ceiling held. Two earlier runs used 20% and did no better, so Prism lowered the ceiling for version 3. That change came from the runs, not from an opinion.",
        },
      },
      { runNumber: 8, when: "19 March", cohort: 2410, preserved: "₦71,400", result: "significant", releasedBy: ME },
      { runNumber: 7, when: "2 March", cohort: 880, preserved: null, result: "not-significant", releasedBy: REVAN },
    ],

    cameFromBody:
      "Promoted after the same fix worked in three separate rooms. It cites them on every run, and any agent reading this pattern is pointed here before opening a new room.",
    citedRooms: [
      { label: "Room 2442 · win-back SMS" },
      { label: "Room 2388 · dunning spread" },
      { label: "Room 2301 · onboarding stall" },
    ],
  },
  {
    id: "onboarding-step-4-split",
    name: "Onboarding step-4 split",
    owner: LOOM,
    trigger: "activation below 55% in a cohort",
    runs: 4,
    effectLabel: "no significant effect",
    effectTone: "neutral",
    status: "draft",

    decay: {
      version: 2,
      agent: LOOM,
      runsCount: 4,
      lastRun: "28 March",
      summary: [
        "Runs 1 and 2 moved activation by 4 and 3 points against the holdout. Runs 3 and 4 moved nothing.",
        "The step-4 change shipped permanently in February, so the playbook has been re-running a fix that is already in the product.",
      ],
      effectByRun: [
        { run: "run 1", label: "+4 pts", percent: 100, significant: true },
        { run: "run 2", label: "+3 pts", percent: 76, significant: true },
        { run: "run 3", label: "none", percent: 10, significant: false },
        { run: "run 4", label: "none", percent: 5, significant: false },
      ],
      chartNote: "Significance is measured against the holdout, never against last month.",
      whyStopped: [
        "The thing it tested became the default.",
        "There is no longer a version of the product where step 4 is unsplit, so there is nothing left to move.",
      ],
      goodOutcome: ["This is a good outcome, not a failure.", "The fix won. The playbook outlived it."],
    },
  },
  {
    id: "weekend-dip-alert",
    name: "Weekend dip alert",
    owner: ANCHOR,
    trigger: "a Saturday below trend",
    runs: 3,
    effectLabel: "all three were false",
    effectTone: "neutral",
    status: "retired",
    retiredOn: "2 April",
  },
];

export function getPlaybook(id: string | undefined): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}

export function countByStatus(status: AutonomyStatus): number {
  return PLAYBOOKS.filter((p) => p.status === status).length;
}

export function getPlaybookRun(playbookId: string | undefined, runNumber: string | undefined) {
  const playbook = getPlaybook(playbookId);
  const run = playbook?.runHistory?.find((r) => String(r.runNumber) === runNumber);
  return playbook && run ? { playbook, run } : undefined;
}

/** Workspace-wide headline stats — authored aggregate figures illustrative of a larger real
 * dataset than the six rows below them, same convention as leakage-map's "4.2M customers" header
 * and business-memory's `MEMORY_STATS` (see those data.ts files). Not a computation over
 * `PLAYBOOKS`. */
export const PLAYBOOK_STATS = {
  inLibrary: { value: "9", note: "4 running" },
  runsThisQuarter: { value: "142", note: "across 4 playbooks" },
  preserved: { value: "₦1.2M", note: "measured vs holdouts", tone: "teal" as const },
  retired: { value: "1", note: "stopped working", tone: "amber" as const },
};

export const AUTONOMY_FOOTNOTE = {
  headline: "A playbook earns Automatic by working. It loses it the same way.",
  body: "Nothing starts automatic, and nothing stays automatic on reputation.",
};

/** PB06 — the empty state's "closest to becoming one" preview list, patterns that have worked
 * once or twice but not yet the three times Maestro requires before proposing. */
export const CLOSEST_TO_BECOMING_ONE: { label: string; note: string }[] = [
  { label: "Dunning retry spread", note: "worked twice · one more to go" },
  { label: "Delivery fee position", note: "worked once" },
  { label: "Discount reapplication", note: "worked once" },
];

/** PB04 — Flolyt's single pending proposal, reviewed at /playbooks/propose. Maestro proposes
 * "Dunning retry spread" (id above) after it closed the same three rooms this drawn-from list
 * cites, at a stage before the row above has a status of "proposed" for real. */
export const PENDING_PROPOSAL: Playbook & { proposal: ProposalDetail } = {
  id: "dunning-retry-spread",
  name: "Dunning retry spread",
  owner: ANCHOR,
  trigger: "card failures cluster on one plan",
  runs: 3,
  effectLabel: "₦224K preserved",
  effectTone: "teal",
  status: "proposed",
  proposal: {
    drawnFrom: [
      { label: "Room 2388 · dunning spread", date: "2 Feb", preserved: "₦224K preserved" },
      { label: "Room 2455 · retry window", date: "6 Mar", preserved: "₦96K preserved" },
      { label: "Room 2472 · card failures", date: "9 Apr", preserved: "₦104K preserved" },
    ],
    fromRoomsBody:
      "The same fix closed three rooms in eleven weeks, each time with a measured result. Maestro is proposing it as a playbook so the fourth time costs an approval rather than an investigation.",
    proposing: [
      { label: "Name", value: "Dunning retry spread" },
      { label: "Runs when", value: "card failures cluster on one plan" },
      { label: "Owned by", value: "Anchor, with Prism on any offer" },
      { label: "Holdout", value: "10%" },
      { label: "Releases", value: "needs an approver every run" },
      { label: "Measures at", value: "day 14, against the holdout" },
    ],
    backtestCount: 4,
    backtestBody: "clusters it would have fired on, three of which became rooms anyway — about nine days later.",
    falsePositiveNote: "One of the four was a false positive. A person would have caught it at approval.",
  },
};

/** PB07 — writing a playbook by promoting Room 2412 (business-memory's "Delivery fee shown after
 * the cart", ₦312K preserved). Reusing that room id keeps the cross-reference real rather than
 * inventing a room the memory section doesn't have. */
export const WRITE_FROM_ROOM = {
  roomId: "room-2412",
  roomLabel: "Room 2412",
  preserved: "₦312K",
  fields: [
    { label: "Name", value: "Delivery fee position check" },
    { label: "Runs when", value: "a checkout template changes", hint: "the trigger, in your words" },
    { label: "What it does", value: "check the fee renders above the cart, block if not" },
    { label: "Owned by", value: "Guardian, with RevOps", hint: "an agent and a person, always both" },
    { label: "Holdout", value: "not applicable · this is a check, not a send" },
  ],
  inherits: [
    { label: "Evidence", value: "4 findings, with their weights and sources" },
    { label: "The control", value: "Guardian · release check" },
    { label: "What did not work", value: "a win-back email, no lift in six days" },
    { label: "Citations", value: "the 3 rooms that already cite Room 2412" },
  ],
};
