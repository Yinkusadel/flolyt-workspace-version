import type { Department } from "@/pages/lifecycle/data";

/**
 * Types for screens 27-35 (Rooms) in flolyt-kit-122 — see
 * flolyt-kit-122/27-room-cohort-war-room.svg through 35-plays-at-scale.svg
 * and docs/build-tracker.md.
 */

export type EvidenceGrade = "causal" | "association" | "hypothesis" | "insufficient";

export type PersonRef = {
  initials: string;
  name: string;
  /** Drives avatar colour — reuses the lifecycle department palette, not the rotating team-1..4 slots. */
  department: Department;
  /** Display label if different from the department name (e.g. "CX", "Growth"). */
  roleLabel?: string;
};

export type AgentRef = {
  initials: string;
  name: string;
};

export type Actor = { kind: "human"; person: PersonRef } | { kind: "agent"; agent: AgentRef };

export type ChipTone = "warn" | "risk" | "neutral" | "ok";
export type HeaderChip = { label: string; tone: ChipTone };

export type RoomKind = "war-room" | "persistent";
export type RoomStatus = "live" | "empty" | "recovering" | "archived";

export type EvidenceRow = {
  grade: EvidenceGrade;
  claim: string;
  detail: string;
  meta: string;
};

export type ImpactStat = { label: string; value: string; sub: string; tone?: "rose" | "ink" };

export type DecisionDocData = {
  eyebrow: string;
  statement: string;
  draftedBy: AgentRef;
  owner: PersonRef;
  ownerNote?: string;
  ownerStatus: "draft" | "undecided" | "decided";
  whyNow: EvidenceRow[];
  impact: ImpactStat[];
  nextStep: { body: string; footnote?: string };
  whatWouldChange?: string;
  guardrails?: {
    editingNote?: { person: PersonRef; note: string };
    body: string;
    heldSuggestion?: { agent: AgentRef; body: string };
  };
};

export type ThreadMessage = {
  kind: "message";
  id: string;
  actor: Actor;
  roleLabel?: string;
  time: string;
  lines: string[];
  evidenceTag?: { grade: EvidenceGrade; amount?: string };
  signal?: string;
};

export type ThreadConflict = {
  kind: "conflict";
  id: string;
  agent: AgentRef;
  options: { team: string; summary: string }[];
  ownerNote: string;
};

export type ThreadEntry = ThreadMessage | ThreadConflict;

export type RunState = "queued" | "running" | "cancelRequested" | "cancelled" | "failed" | "reconnect";

export type RunStatusData = {
  state: RunState;
  detail: string;
  trailing: string;
  queuedSteering?: string;
};

export type ProposalStatus = "pending" | "editing" | "decided";
export type ProposalRow = { label: string; value: string };

export type Proposal = {
  id: string;
  status: ProposalStatus;
  title: string;
  rows: ProposalRow[];
  footnote?: string;
  actionKey: string;
  /** Amount above the caller's re-auth ceiling — presence triggers the re-auth sheet instead of an inline approve. */
  reauthAmount?: string;
  objection?: string;
  decidedNote?: { by: string; time: string; detail: string };
};

export type PlayStatus = "in-progress" | "draft" | "deferred";

export type Play = {
  id: string;
  status: PlayStatus;
  eyebrow: string;
  title: string;
  rows?: ProposalRow[];
  note?: string;
  dissent?: { who: string; quote: string };
};

export type EvidenceClaim = { claim: string; grade: EvidenceGrade; source: string; window: string; n: string };

export type SignalSource = {
  name: string;
  meta: string;
  bars: number[];
  tone: "ultra" | "rose" | "neutral";
  notConnected?: boolean;
  note?: string;
};

export type TimelineEvent = { time: string; body: string };

export type LogEntry = {
  time: string;
  actor: Actor;
  roleLabel?: string;
  action: string;
  consequence: string;
  consequenceTone?: "amber" | "teal" | "ink";
};

export type RevenueCondition = {
  key: string;
  value: string;
  tone: "teal" | "rose" | "muted";
  detail: string;
  treatment: string;
};

export type DecisionLogEntry = {
  time: string;
  actor: string;
  measured: boolean;
  headline: string;
  detail: string;
  dissent?: { who: string; quote: string };
};

export type MemoryCard = { body: string; meta: string };

export type ArchivedSummary = {
  closedOn: string;
  headline: string;
  body: string;
  outcome: { headline: string; detail: string };
  memory: MemoryCard;
};

export type RecoveringSummary = { droppedAt: string; inventory: string[] };

export type EmptyPrompt = { question: string; meta: string };

export type PlaysQueueGroup = "needs-approval" | "blocked" | "in-progress" | "drafts" | "decided";

export type PlaysQueueRow = {
  id: string;
  group: PlaysQueueGroup;
  title: string;
  subtitle: string;
  time: string;
  checked?: boolean;
};

export type RoomListMeta = {
  condition: string;
  population: string;
  atRisk: string;
  owner: PersonRef;
  working: AgentRef[];
  last: string;
};

export type RoomDetail = {
  id: string;
  title: string;
  kind: RoomKind;
  status: RoomStatus;
  /** Whether this room appears in the Rooms index table. */
  listed: boolean;
  listMeta: RoomListMeta;
  chips: HeaderChip[];
  agents: AgentRef[];
  humans: PersonRef[];
  counts: { evidence: number; plays: number; log: number };

  decisionDoc?: DecisionDocData;
  thread?: ThreadEntry[];
  runStatus?: RunStatusData;
  proposals?: Proposal[];
  plays?: Play[];

  evidenceSignals?: SignalSource[];
  evidenceTimeline?: TimelineEvent[];
  evidenceClaims?: EvidenceClaim[];
  evidenceWhatWouldChange?: { headline: string; body: string };
  evidenceGaps?: { body: string; resolves: string; cta: string };

  log?: LogEntry[];
  logAttribution?: { human: number; agent: number };

  revenuePosture?: RevenueCondition[];
  decisionsLogged?: DecisionLogEntry[];
  memory?: MemoryCard[];
  threadDrawerUnread?: number;

  emptyPrompts?: EmptyPrompt[];
  recovering?: RecoveringSummary;
  archived?: ArchivedSummary;

  playsQueue?: PlaysQueueRow[];
  playsNeedYou?: number;
};
