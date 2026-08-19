import type { Department } from "@/pages/lifecycle/data";
import type { KpiTone } from "@/pages/lifecycle/stage/kpi-cards";
import type { AgentRef, PersonRef, Tone } from "@/pages/rooms/types";

/**
 * Shared primitives for the /inbox rebuild — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-inbox/ (17 screens, I00–I16).
 * See docs/build-tracker.md for the per-screen route map.
 */

export type { Department };

/** Label-left / mono-value-right row used for "The rules", "What gets in", diagnostics, etc. */
export type KvRow = { label: string; value: string; tone?: Tone };

/** I01 — "working right now, and not bothering you" table. */
export type WorkingAgentRow = {
  agent: AgentRef;
  room: string;
  doing: string;
  since: string;
  willReach: string;
  willReachTone?: Tone;
};

/** I02 — "needs a decision from you" cards. */
export type DecisionCard = {
  agent?: AgentRef;
  waitingLabel: string;
  title: string;
  body: string;
  footnote: string;
  footnoteTone: Tone;
  roomId: string;
  itemId: string;
};

/** I02/I05 shared shape for a customer/person quote row. */
export type MentionRow = {
  person: PersonRef;
  quote: string;
  room: string;
  when: string;
};

/** I03 — grouped triage table + group summary cards. */
export type GroupKey = "decide-today" | "clear-in-a-minute" | "overdue";

export type GroupedRow = {
  decision: string;
  room: string;
  costPerDay: string;
  costPerDayTone?: Tone;
  waiting: string;
  waitingTone?: Tone;
  effort: string;
  group: GroupKey;
  groupLabel: string;
  groupTone: Tone;
};

export type GroupSummaryCard = {
  key: GroupKey;
  label: string;
  title: string;
  body: string;
  footnote: string;
  tone: Tone;
};

/** I04 — one inbox item detail. */
export type InboxItemFact = { label: string; value: string; tone?: Tone };
export type InboxActionCard = { label: string; title: string; body: string; footnote: string; tone: Tone };

export type InboxItemDetail = {
  id: string;
  title: string;
  subtitle: string;
  roomId: string;
  facts: InboxItemFact[];
  actionCards: InboxActionCard[];
};

/** A non-staff customer identity — replies come from outside the workspace roster. */
export type Customer = { name: string; location: string };

/** I05 — replies table. */
export type ReplyRow = {
  id: string;
  customer: Customer;
  repliedTo: string;
  quote: string;
  reason: string;
  reasonTone: Tone;
  waiting: string;
  waitingTone?: Tone;
  sla: string;
  slaTone?: Tone;
};

export type ReplyReasonCard = {
  label: string;
  agent?: AgentRef;
  title: string;
  body: string;
  footnote: string;
  tone: Tone;
};

/** I06 — one reply detail. */
export type ReplyTimelineRow = {
  when: string;
  what: string;
  byPerson?: PersonRef;
  byAgent?: AgentRef;
  byLabel?: string;
  state: string;
  stateTone: Tone;
};

export type ReplyDetail = {
  id: string;
  customer: Customer;
  subtitle: string;
  timeline: ReplyTimelineRow[];
  willNotRows: { label: string; caveat: string; tone?: Tone }[];
};

/** I07 — routing rules table + stat tiles. */
export type RoutingRuleRow = {
  when: string;
  goesTo: string;
  goesToTeam?: Department;
  goesToTone?: Tone;
  because: string;
  becauseTone?: Tone;
  fallback: string;
  fallbackTone?: Tone;
  firedThisWeek: number;
  firedTone?: Tone;
  state: string;
  stateTone: Tone;
};

export type RoutingStat = { eyebrow: string; value: string; tone?: KpiTone; note: string };

/** I08 — unroutable conditions table + fallback-option cards. */
export type UnroutableRow = {
  condition: string;
  causeTeam?: Department;
  causeLabel?: string;
  symptomTeam?: Department;
  symptomLabel?: string;
  symptomTone?: Tone;
  fired: string;
  since: string;
  atStake: string;
  atStakeTone?: Tone;
  why: string;
};

export type FallbackOption = { label: string; title: string; body: string; footnote: string; tone: Tone };

/** I09 — snoozed table. */
export type SnoozedRow = {
  item: string;
  because: string;
  snoozedWhen: string;
  returns: string;
  returnsTone?: Tone;
  costOfWaiting: string;
  costOfWaitingTone?: Tone;
  times: number;
  timesTone?: Tone;
  whoKnows: string;
  whoKnowsTone?: Tone;
};

/** I10 — delegation table + can/cannot cards. */
export type DelegationRow = {
  what: string;
  from: string;
  atRisk: string;
  atRiskTone?: Tone;
  wouldWait: string;
  wouldWaitTone?: Tone;
  cover?: PersonRef;
  coverLabel?: string;
  coverTone?: Tone;
  why: string;
};

export type DelegationCard = { label: string; title: string; body: string; footnote: string; tone: Tone };

/** I11 — approval-authority thresholds table + stat tiles. */
export type ThresholdRow = {
  play: string;
  reach: string;
  cost?: string;
  costTone?: Tone;
  approvedBy: string;
  approvedByTone?: Tone;
  ifAway: string;
  ifAwayTone?: Tone;
  medianWait: string;
  medianWaitTone?: Tone;
};

export type AuthorityStat = { eyebrow: string; value: string; tone?: KpiTone; note: string };

/** I12 — standing authority: grants table + this-week activity table. */
export type StandingGrantRow = {
  classOfPlay: string;
  limits: string;
  market: string;
  expires: string;
  expiresTone?: Tone;
  used: string;
  state: string;
  stateTone: Tone;
};

export type StandingActivityRow = {
  play: string;
  room: string;
  reach: string;
  reachTone?: Tone;
  ranAt: string;
  ranAtTone?: Tone;
  under?: PersonRef;
  underLabel?: string;
  reviewed: string;
  reviewedTone: Tone;
};

/** I13 — systems table + "not a failure" info cards. */
export type SystemsRow = {
  what: string;
  since: string;
  sinceTone?: Tone;
  effect: string;
  effectTone?: Tone;
  queued?: string;
  owner?: PersonRef;
  ownerLabel?: string;
  ownerTone?: Tone;
  state: string;
  stateTone: Tone;
  blocks: string;
  blocksTone: Tone;
};

export type SystemsInfoCard = { label: string; title: string; body: string; footnote: string; tone: Tone };

/** I14 — bulk-selection action table. */
export type BulkActionRow = {
  action: string;
  available: string;
  availableTone: Tone;
  why: string;
  whyTone?: Tone;
  loggedAs?: string;
};

/** I15 — inbox settings rules table. */
export type SettingsRuleRow = {
  when: string;
  threshold: string;
  thisWeek: string;
  thisWeekTone?: Tone;
  canChange: "yes" | "no";
  state: string;
  stateTone: Tone;
};

export type { AgentRef, PersonRef, Tone };
