import { IFEOMA, REPEAT_DECAY } from "@/pages/rooms/data";
import type { PersonRef, Tone } from "@/pages/rooms/types";
import type { GoalDetail } from "@/pages/goals/types";

/** Only `repeat-90` is a fully-built goal — every other id (net-revenue, second-orders, involuntary-churn,
 * contribution-margin) exists only as a tracker row, matching the "one reference row" pattern from the
 * lifecycle/rooms/today rebuilds. */
const GOALS: Record<string, GoalDetail> = {
  "repeat-90": {
    id: "repeat-90",
    metric: "90-day repeat rate",
    owner: IFEOMA,
    leadAgent: REPEAT_DECAY,
    reviewCadence: "reviewed daily",
    target: "36.4%",
    targetDate: "by 31 March",
    today: "29.2%",
    todayTone: "amber",
    gap: "7.2 points",
    gapTone: "rose",
    baseline: "27.2%",
    baselineLockedDate: "locked 1 Jan",
    timeline: [
      { label: "1 Jan · baseline locked", value: "27.2%", percent: 27.2, tone: "ink" },
      { label: "2 Apr · dunning room closed", value: "27.9%", delta: "+0.7", percent: 27.9, tone: "teal" },
      { label: "18 Apr · one-tap reorder shipped", value: "29.0%", delta: "+1.1", percent: 29.0, tone: "teal" },
      { label: "Today · day 41", value: "29.2%", percent: 29.2, tone: "amber" },
      { label: "31 Mar · target", value: "36.4%", percent: 36.4, tone: "ultra" },
    ],
    paceCallout: {
      title: "Two points gained in 41 days against a target that needs 9.2",
      body: "At this pace the goal closes at 30.6%. Both movements so far came from things shipped by other teams — the dunning fix was Finance and the reorder was Product. Nothing Ifeoma directly controls has landed yet, because the reactivation wave has been waiting 19 hours for an approval.",
      tone: "amber",
    },
    contributions: [
      { what: "Retry cards at 09:00 local", type: "Room", contribution: "+0.7 pts", contributionTone: "teal", measuredHow: "holdout · 10%", state: "closed", stateTone: "teal" },
      { what: "One-tap reorder", type: "Release", contribution: "+1.1 pts", contributionTone: "teal", measuredHow: "before/after · 14 days", state: "closed", stateTone: "teal" },
      { what: "Second order never happened", type: "Room", contribution: "+7.4 pts projected", contributionTone: "amber", measuredHow: "holdout planned", state: "open", stateTone: "amber" },
      { what: "Weekend push reduction", type: "Campaign", contribution: "Unavailable", contributionTone: "neutral", measuredHow: "no holdout was possible", state: "closed", stateTone: "neutral" },
      { what: "Fee shown at basket", type: "Release", contribution: "measuring", contributionTone: "ultra", measuredHow: "holdout · 18,900 so far", state: "too early", stateTone: "ultra" },
    ],
    contributionsCallout: {
      title: "One contribution is unavailable and it is not counted",
      body: "The weekend push reduction almost certainly helped. No holdout was possible, so there is no honest number — it is listed, excluded from the total, and left visible rather than quietly dropped. Two others are still measuring and are shown as projections, clearly marked.",
      tone: "teal",
    },
  },
};

export function getGoal(id: string): GoalDetail | undefined {
  return GOALS[id];
}

/** G09 — "what would close the gap, and who has to do it." */
export type ActionRow = {
  action: string;
  wouldAdd: string;
  wouldAddTone?: Tone;
  confidence: string;
  confidenceTone: Tone;
  whoseLabel: string;
  whoseDept?: string;
  whoseDeptColor?: string;
  whosePerson?: PersonRef;
  stateLabel: string;
  stateTone: Tone;
  blockedBy: string;
  blockedByTone: Tone;
};

export const OFF_TRACK_ACTIONS: ActionRow[] = [
  {
    action: "Approve the reactivation wave",
    wouldAdd: "+7.4 pts",
    confidence: "high",
    confidenceTone: "teal",
    whoseLabel: "Ifeoma",
    whosePerson: IFEOMA,
    stateLabel: "waiting 19 hrs",
    stateTone: "amber",
    blockedBy: "you",
    blockedByTone: "rose",
  },
  {
    action: "Fee shown at basket · already shipped",
    wouldAdd: "+3.1 pts",
    wouldAddTone: "amber",
    confidence: "measuring",
    confidenceTone: "ultra",
    whoseLabel: "Engineering",
    whoseDept: "Engineering",
    whoseDeptColor: "#4E7080",
    stateLabel: "landing",
    stateTone: "ultra",
    blockedBy: "time",
    blockedByTone: "neutral",
  },
  {
    action: "Prompt one-feature customers toward a second",
    wouldAdd: "+2.8 pts",
    confidence: "medium",
    confidenceTone: "amber",
    whoseLabel: "Product",
    whoseDept: "Product",
    whoseDeptColor: "#7A5AA8",
    stateLabel: "never proposed",
    stateTone: "rose",
    blockedBy: "nobody owns depth",
    blockedByTone: "rose",
  },
  {
    action: "Fix first-delivery failures in Lagos",
    wouldAdd: "+0.9 pts",
    confidence: "high",
    confidenceTone: "teal",
    whoseLabel: "Support",
    whoseDept: "Support",
    whoseDeptColor: "#C56A2E",
    stateLabel: "open room",
    stateTone: "ultra",
    blockedBy: "—",
    blockedByTone: "neutral",
  },
  {
    action: "Lower the target to 32%",
    wouldAdd: "—",
    confidence: "—",
    confidenceTone: "neutral",
    whoseLabel: "Ifeoma",
    whosePerson: IFEOMA,
    stateLabel: "available",
    stateTone: "neutral",
    blockedBy: "audited",
    blockedByTone: "amber",
  },
];

/** G13 — how a contribution gets counted, and what disqualifies one. */
export type RuleRow = { rule: string; meaning: string; ifFails: string; ifFailsTone: Tone };

export const CONTRIBUTION_RULES: RuleRow[] = [
  { rule: "A holdout existed", meaning: "Some comparable group did not get the thing", ifFails: "counted as unavailable", ifFailsTone: "amber" },
  { rule: "The window is closed", meaning: "At least 28 days measured, not projected", ifFails: "shown as measuring", ifFailsTone: "ultra" },
  { rule: "The effect is separable", meaning: "No other change in the same window and population", ifFails: "counted, with a caveat", ifFailsTone: "amber" },
  { rule: "It is credited once", meaning: "A room that helps two goals is split, never doubled", ifFails: "split at close", ifFailsTone: "teal" },
  { rule: "It is attributed to a room", meaning: "Not to a person, a team or a campaign alone", ifFails: "not counted", ifFailsTone: "rose" },
  { rule: "The room closed", meaning: "Open rooms show projections, never contributions", ifFails: "shown as projected", ifFailsTone: "ultra" },
];

export type ScoredContributionRow = {
  what: string;
  claimed: string;
  claimedTone: Tone;
  holdout: string;
  holdoutTone: Tone;
  windowClosed: string;
  windowClosedTone: Tone;
  separable: string;
  separableTone: Tone;
  counted: string;
  countedTone: Tone;
};

export const SCORED_CONTRIBUTIONS: ScoredContributionRow[] = [
  { what: "Retry cards at 09:00 local", claimed: "+0.7 pts", claimedTone: "teal", holdout: "yes · 10%", holdoutTone: "teal", windowClosed: "yes", windowClosedTone: "teal", separable: "yes", separableTone: "teal", counted: "counted", countedTone: "teal" },
  { what: "One-tap reorder", claimed: "+1.1 pts", claimedTone: "teal", holdout: "before/after", holdoutTone: "amber", windowClosed: "yes", windowClosedTone: "teal", separable: "yes", separableTone: "teal", counted: "counted", countedTone: "teal" },
  { what: "Second order never happened", claimed: "+7.4 pts", claimedTone: "amber", holdout: "planned", holdoutTone: "ultra", windowClosed: "no", windowClosedTone: "amber", separable: "yes", separableTone: "teal", counted: "projected", countedTone: "ultra" },
  { what: "Weekend push reduction", claimed: "+1.9 pts", claimedTone: "neutral", holdout: "not possible", holdoutTone: "rose", windowClosed: "yes", windowClosedTone: "teal", separable: "no · Ramadan", separableTone: "rose", counted: "unavailable", countedTone: "amber" },
  { what: "Fee shown at basket", claimed: "+3.1 pts", claimedTone: "amber", holdout: "yes · 18,900", holdoutTone: "teal", windowClosed: "no · day 6", windowClosedTone: "amber", separable: "yes", separableTone: "teal", counted: "measuring", countedTone: "ultra" },
];
