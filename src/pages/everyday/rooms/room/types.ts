import type { Actor, AgentRef, PersonRef, RoomOutcome, RoomStatus, Tone } from "@/pages/everyday/rooms/types";

/** Content shapes for a single room's detail pages — R12–R39. Only "full" rooms carry every optional section. */

export type ThreadMessage = {
  kind: "message";
  id: string;
  actor: Actor;
  time: string;
  lines: string[];
  chip?: { label: string; tone: Tone };
  toolCall?: string;
};
export type ThreadSystemNote = { kind: "system"; id: string; tone: Tone; text: string };
export type ThreadEntry = ThreadMessage | ThreadSystemNote;

export type RunStatusBar = { state: "working" | "finished"; detail: string; queuedRedirect?: string };

export type RevisionRow = { id: string; name: string; nameTone: Tone; note: string; current?: boolean };

export type DecisionDoc = {
  revisionLabel: string;
  statement: string;
  draftedBy: AgentRef;
  decidedBy?: { person: PersonRef; time: string };
  statusChip: { label: string; tone: Tone };
  guardrailsBody: string;
  liveEditing?: { person: PersonRef; note: string };
  suggestion?: { agent: AgentRef; body: string };
  whatWouldChange: string;
  revisions: RevisionRow[];
};

export type EvidenceClaim = {
  chip: { label: string; tone: Tone };
  body: string;
  meta: string;
  metaTone: Tone;
};

export type LogRow = {
  time: string;
  actor: Actor | { kind: "system"; label: string };
  actorTone: Tone | "ink";
  action: string;
  annotation: string;
  annotationTone: Tone | "ink";
};

export type PlayBoardRow = {
  id: string;
  title: string;
  reach: string;
  reachTone?: Tone;
  proposedBy: Actor;
  stateLabel: string;
  stateTone: Tone;
  whoDecides: PersonRef;
  waiting: string;
  waitingTone: Tone | "ink";
  effect: string;
  effectTone: Tone;
};

export type ProposalSettingRow = { label: string; value: string; source: string; sourceTone: Tone | "ink" };
export type ProposalOutlookCard = {
  eyebrow: string;
  agent?: AgentRef;
  heading: string;
  body: string;
  footer: string;
  tone: Tone;
};

export type ProposalDetail = {
  id: string;
  title: string;
  subtitle: string;
  waitingHours: string;
  decayNote: string;
  settings: ProposalSettingRow[];
  outlook: ProposalOutlookCard[];
};

export type CausalTestRow = { test: string; result: string; passes: string; passesTone: Tone };

export type ReadingCard = {
  eyebrow: string;
  agent?: AgentRef;
  heading: string;
  body: string;
  footer: string;
  tone: Tone;
};

export type EvidenceFindingDetail = {
  id: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string; tone: Tone | "ink"; note: string }[];
  claimHeading: string;
  claimBody: string;
  causalTests: CausalTestRow[];
  readings: ReadingCard[];
};

export type ComparisonRow = { label: string; left: string; right: string; agreed: string; agreedTone: Tone };
export type ResolveCard = { eyebrow: string; heading: string; body: string; footer: string; tone: Tone };

export type ConflictDetail = {
  id: string;
  title: string;
  raisedBy: AgentRef;
  raisedAt: string;
  owner: PersonRef;
  columns: { left: string; right: string };
  rows: ComparisonRow[];
  resolve: ResolveCard[];
};

export type DissentRow = {
  quote: string;
  room: string;
  by: PersonRef;
  recorded: string;
  status: { label: string; tone: Tone };
  outcome: { label: string; tone: Tone };
};

export type Dissent = {
  by: PersonRef;
  recordedAt: string;
  quote: string;
  workspaceRows: DissentRow[];
};

export type GuardrailRow = {
  name: string;
  setting: string;
  appliesTo: string;
  appliesToTone: Tone | "ink";
  setBy?: PersonRef;
  overridable: { label: string; tone: Tone };
};

export type GuardrailStopRow = {
  when: string;
  what: string;
  affected: string;
  guardrail: string;
  instead: string;
};

export type RunRow = {
  id: string;
  agent: AgentRef;
  started: string;
  turns: string;
  rowsRead: string;
  rowsReadTone?: Tone;
  state: { label: string; tone: Tone };
  result: string;
  resultTone: Tone | "ink";
};

export type SteeringAction = { label: string; tone: Tone; body: string };

export type PersonPermissionRow = {
  person: PersonRef;
  role: { label: string; tone: Tone };
  canApprove: string;
  canApproveTone: Tone | "ink";
  added: string;
  addedBy: string;
  seesCohort: { label: string; tone: Tone };
};

export type AgentPermissionRow = {
  agent: AgentRef;
  does: string;
  role: { label: string; tone: Tone };
  reads: string;
  canAct: { label: string; tone: Tone };
};

export type CohortSampleRow = {
  customer: string;
  acquired: string;
  firstOrder: string;
  since: string;
  market: string;
  firstDelivery: { label: string; tone: Tone };
  contactable: { label: string; tone: Tone };
};

export type CollisionRow = {
  room: string;
  team: string;
  overlap: string;
  overlapTone: Tone;
  theirSend: string;
  yourSend: string;
  gap: string;
  gapTone: Tone;
  verdict: { label: string; tone: Tone };
};

export type CollisionOption = { label: string; heading: string; body: string; footer: string; tone: Tone };

export type CloseLedgerRow = {
  what: string;
  where: string;
  value?: string;
  visibleTo?: string;
  state: { label: string; tone: Tone };
};

export type ReopenedCompareRow = { label: string; first: string; second: string; changed: string; changedTone: Tone };

export type RoomDetail = {
  id: string;
  title: string;
  status: RoomStatus;
  outcome?: RoomOutcome;
  headline: string;
  subtitle: string;
  agentsChipCount: number;
  humans: PersonRef[];
  atRisk: string;
  owner?: PersonRef;

  runStatus?: RunStatusBar;
  thread?: ThreadEntry[];
  decisionDoc?: DecisionDoc;
  evidenceEyebrow?: string;
  evidenceClaims?: EvidenceClaim[];
  evidenceFinding?: EvidenceFindingDetail;
  log?: LogRow[];
  playsCountLabel?: string;
  playsBoard?: PlayBoardRow[];
  proposal?: ProposalDetail;
  conflict?: ConflictDetail;
  dissent?: Dissent;
  guardrails?: GuardrailRow[];
  guardrailStops?: GuardrailStopRow[];
  runs?: RunRow[];
  steering?: { turn: string; queued: string; appliedAt: string; rowsRead: string; elapsed: string; cost: string; actions: SteeringAction[] };

  peoplePermissions?: PersonPermissionRow[];
  agentPermissions?: AgentPermissionRow[];
  cohortSample?: CohortSampleRow[];
  collisionRows?: CollisionRow[];
  collisionOptions?: CollisionOption[];

  closeLedger?: CloseLedgerRow[];
  closeSummary?: string;
  closeFacts?: { label: string; value: string; tone: Tone | "ink" }[];
  closingNoteTitle?: string;
  closingNote?: string;
  closeForm?: {
    summary: string;
    ledger: { label: string; value: string; tone: Tone | "ink" }[];
    closingTitle: string;
    closingBody: string;
  };
  mergeCandidate?: {
    title: string;
    subtitle: string;
    rows: ComparisonRow[];
    keepBody: string;
    reconcileBody: string;
    decideBody: string;
  };
  reopenedCompare?: ReopenedCompareRow[];
  reopenedCarries?: { label: string; value: string; tone: Tone | "ink" }[];

  restrictedBy?: PersonRef;
  restrictedReason?: string;
};
