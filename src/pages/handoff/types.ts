import type { Department } from "@/pages/lifecycle/data";
import type { PersonRef, Tone } from "@/pages/rooms/types";

/**
 * Shared primitives for the /handoff rebuild — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-handoff/ (17 screens, H00–H16).
 * See docs/build-tracker.md section 7 for the per-screen route map.
 */

export type ChainStatus = "live" | "closed" | "no_owner" | "recovering";

/** A row in the /handoff index chains table (H02). */
export type ChainListRow = {
  id: string;
  title: string;
  startedTeam: Department;
  startedDate: string;
  teamsCount: number;
  obligationsCount: number;
  overdueCount: number;
  oldestSignal: string;
  oldestSignalTone?: Tone;
  status: ChainStatus;
  statusLabel: string;
  statusTone: Tone;
};

/** "You owe" table row (H03) — a cross-chain view of the signed-in user's own obligations. */
export type MyObligationRow = {
  id: string;
  chainId: string;
  title: string;
  toTeam: Department;
  fromChain: string;
  due: string;
  dueTone?: Tone;
  state: string;
  stateTone: Tone;
  blocks: string;
  blocksTone?: Tone;
  accepted: string;
  acceptedTone?: Tone;
};

/** "Owed to you" table row (H03). */
export type OwedToMeRow = {
  id: string;
  title: string;
  fromTeam: Department;
  due: string;
  state: string;
  stateTone: Tone;
  unlocks: string;
};

/** Overdue table row (H10) — `/handoff?state=overdue`. */
export type OverdueRow = {
  id: string;
  chainId?: string;
  title: string;
  team: Department;
  owner?: PersonRef;
  due: string;
  daysOver: number;
  blocks: string;
  blocksTone?: Tone;
  escalatedTo: string;
  escalatedToTone?: Tone;
};

/** One dated entry in a live chain's timeline (H04). */
export type SignalEvent = {
  date: string;
  team: Department | "Everyone";
  headline: string;
  detail: string;
  tag?: string;
  tagTone?: Tone;
};

/** A row in a chain's own obligations table (H05) — `owner` is undefined for the unaccepted row. */
export type ChainObligationRow = {
  id: string;
  chainId: string;
  title: string;
  team: Department;
  owner?: PersonRef;
  unacceptedLabel?: string;
  due: string;
  dueTone?: Tone;
  state: string;
  stateTone: Tone;
  lastMoved: string;
  lastMovedTone?: Tone;
};

/** One entry in an obligation's own audit timeline (H06). */
export type ObligationEvent = {
  at: string;
  headline: string;
  headlineTone?: Tone;
  detail: string;
};

/** The full detail record for /handoff/:id/o/:oid (H06). */
export type ObligationDetail = {
  id: string;
  chainId: string;
  chainTitle: string;
  title: string;
  team: Department;
  owner: PersonRef;
  due: string;
  overdueBy?: string;
  state: string;
  stateTone: Tone;
  blocks: string;
  blocksTone?: Tone;
  originTitle: string;
  originBody: string;
  timeline: ObligationEvent[];
};

/** A row in a closed chain's own obligations table (H14) — every one already accepted/done. */
export type ClosedObligationRow = {
  id: string;
  title: string;
  team: Department;
  owner: PersonRef;
  accepted: string;
  acceptedTone?: Tone;
  due: string;
  done: string;
  doneTone?: Tone;
  days: string;
  daysTone?: Tone;
};

/** One of the 3 "why this worked" cards on a closed chain (H14). */
export type ClosedInsightCard = {
  eyebrow: string;
  title: string;
  body: string;
  footnote: string;
  footnoteTone?: Tone;
};

export type ChainDetail = {
  id: string;
  title: string;
  subtitle: string;
  status: ChainStatus;
  startedTeam: Department;
  startedDate: string;
  // live chain (H04/H05)
  signals?: SignalEvent[];
  liveInsights?: { tone: Tone; title: string; body: string }[];
  obligations?: ChainObligationRow[];
  obligationsSubtitle?: string;
  obligationsStats?: { eyebrow: string; value: string; tone?: "ink" | "teal" | "amber" | "rose"; note?: string }[];
  obligationsInsight?: { tone: Tone; title: string; body: string };
  // closed chain (H14)
  closedSummary?: { tone: Tone; title: string; body: string };
  closedObligations?: ClosedObligationRow[];
  closedInsights?: ClosedInsightCard[];
  closedFooter?: { tone: Tone; title: string; body: string };
};
