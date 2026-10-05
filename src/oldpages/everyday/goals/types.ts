import type { AgentRef, PersonRef, Tone } from "@/pages/rooms/types";

/**
 * Shared types for the /goals rebuild — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-goals/ (17 screens, G00–G16).
 * See docs/build-tracker.md for the per-screen route map.
 */

export type MetricReadinessRow = {
  metric: string;
  today: string;
  trailing90: string;
  trailing90Tone?: Tone;
  source: string;
  sourceTone?: Tone;
  canGoalLabel: string;
  canGoalTone: Tone;
};

export type GoalRow = {
  id: string;
  metric: string;
  hasBaseline: boolean;
  gapToTarget: string;
  gapTone?: Tone;
  workingOnIt: string;
  projectedClose: string;
  projectedCloseTone?: Tone;
  owner?: PersonRef;
  agent?: AgentRef;
  pace: string;
  paceTone: Tone;
};

export type AgentFinding = {
  agent: AgentRef;
  runId: string;
  title: string;
  body: string;
  footnote: string;
  tone: Tone;
};

export type TimelinePoint = {
  label: string;
  value: string;
  delta?: string;
  percent: number;
  tone: "teal" | "amber" | "rose" | "ink" | "ultra";
};

export type ContributionRow = {
  what: string;
  type: string;
  contribution: string;
  contributionTone: Tone;
  measuredHow: string;
  state: string;
  stateTone: Tone;
};

export type GoalDetail = {
  id: string;
  metric: string;
  owner: PersonRef;
  leadAgent: AgentRef;
  reviewCadence: string;
  target: string;
  targetDate: string;
  today: string;
  todayTone: Tone;
  gap: string;
  gapTone: Tone;
  baseline: string;
  baselineLockedDate: string;
  timeline: TimelinePoint[];
  paceCallout: { title: string; body: string; tone: Tone };
  contributions: ContributionRow[];
  contributionsCallout: { title: string; body: string; tone: Tone };
};
