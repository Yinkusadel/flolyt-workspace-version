import type { AgentRef, PersonRef, Tone } from "@/pages/rooms/types";

/**
 * Shared primitives for the /digest rebuild — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-digest/ (17 screens, D00–D16).
 * See docs/build-tracker.md for the per-screen route map.
 */

/** The eyebrow + title + body + divider + mono-footer card repeated across D01–D03, D07, D15, D16. */
export type DigestCard = {
  eyebrow: string;
  eyebrowTone: Tone;
  /** Small dashed-outline agent avatar chip leading the eyebrow, when the card is attributed to an agent. */
  agent?: AgentRef;
  title: string;
  body: string;
  footnote?: string;
  footnoteTone?: Tone;
  /** Gray-bg "nothing to report" cards (D01's "nothing needs you yet", D02/D05/D07's "not in this digest"). */
  muted?: boolean;
};

/** Label-left / mono-value-right row used for "How this arrives", "What gets in", "Still running", etc. */
export type KvRow = { label: string; value: string; tone?: Tone };

export type ArchiveRow = {
  date: string;
  headline: string;
  neededYou: number;
  neededYouTone?: Tone;
  actedWithin: string;
  actedWithinTone?: Tone;
  atStake: string;
  atStakeTone?: Tone;
  outcome: string;
  outcomeTone: Tone;
};

export type WeeklyDeltaRow = {
  thing: string;
  start: string;
  end: string;
  change: string;
  changeTone: Tone;
  comment: string;
};

export type TeamMemberLoad = { person: PersonRef; items: number; tone?: Tone };

export type BlockageRow = {
  what: string;
  where: string;
  behind: string;
  behindTone: Tone;
  stuckFor: string;
  stuckForTone: Tone;
  needs: string;
  needsAda: boolean;
};

export type PastDigestSectionRow = {
  section: string;
  item: string;
  atStake: string;
  atStakeTone?: Tone;
  youDid: string;
  youDidTone?: Tone;
  when: string;
  whenTone?: Tone;
  outcome: string;
  outcomeTone: Tone;
};

export type WhatGetsInRow = {
  when: string;
  threshold: string;
  yesterday: string;
  yesterdayTone?: Tone;
  canChange: "yes" | "no";
  state: "on" | "off by design";
};

export type ChannelRow = {
  channel: string;
  sends: string;
  contains: string;
  state: "on" | "not connected";
  health?: string;
  healthTone?: Tone;
  lastDelivered?: string;
  lastDeliveredTone?: Tone;
};

export type QuietHoursRow = {
  market: string;
  quietHours: string;
  builtAt: string;
  builtAtTone?: Tone;
  timezone: string;
  affects: string;
  exempt: string;
};

export type NotificationRuleRow = {
  id: string;
  when: string;
  whoItReaches: string;
  channel: string;
  urgency: string;
  urgencyTone?: Tone;
  firedThisWeek: number;
  firedTone?: Tone;
  state: string;
  stateTone: Tone;
};

export type NotInDigestRow = {
  what: string;
  count: string;
  countTone?: Tone;
  why: string;
  whyTone?: Tone;
  where: string;
  whereTone?: Tone;
  canChange: "yes" | "no";
};
