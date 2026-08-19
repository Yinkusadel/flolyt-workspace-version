import { IFEOMA, REPEAT_DECAY } from "@/pages/everyday/rooms/data";
import type { AgentRef, PersonRef, Tone } from "@/pages/everyday/rooms/types";

/** G02 — the metric picker. Every candidate metric plus the one permanently blocked row. */
export type MetricOption = {
  id: string;
  name: string;
  description: string;
  tag: string;
  blocked?: boolean;
  blockedReason?: string;
  selected?: boolean;
};

export const METRIC_OPTIONS: MetricOption[] = [
  {
    id: "repeat-90",
    name: "90-day repeat rate",
    description: "The share of acquired customers who place a second order within 90 days",
    tag: "orders feed",
    selected: true,
  },
  { id: "net-revenue", name: "Net revenue", description: "Total revenue, all markets, before refunds", tag: "orders feed" },
  {
    id: "second-orders",
    name: "Second orders",
    description: "The count, not the rate · moves with acquisition volume",
    tag: "orders feed",
  },
  {
    id: "involuntary-churn",
    name: "Involuntary churn",
    description: "Renewals lost to a failed payment rather than a decision",
    tag: "payments feed",
  },
  {
    id: "contribution-margin",
    name: "Contribution margin",
    description: "Blocked · no cost-of-goods source is connected",
    tag: "—",
    blocked: true,
    blockedReason: "no cost-of-goods source is connected",
  },
];

/** G03 — the baseline breakdown. */
export const BASELINE = {
  value: "27.2%",
  population: "894,000",
  window: "trailing 90 days · 4 May to 2 August",
  refreshedAgo: "6 minutes ago",
  fields: [
    { label: "Window", value: "trailing 90 days · 4 May to 2 August" },
    { label: "Population", value: "894,000 customers acquired in the 12 months before that" },
    { label: "Excluded", value: "test accounts (1,904) and merged duplicates (31,400)", tone: "neutral" as Tone },
    { label: "Markets", value: "all four · you can scope this to one" },
    { label: "Known distortion", value: "the 4 March fee change sits inside this window", tone: "amber" as Tone },
    { label: "Pre-change comparison", value: "37.4% · Jan–Feb cohorts", tone: "teal" as Tone },
  ],
};

/** G04 — target and owner. */
export const TARGET = {
  value: "36.4%",
  date: "31 March",
  pointsGained: "+9.2 points on the baseline",
  customers: "≈ 58,600 more customers placing a second order",
  revenue: "≈ ₦412M of revenue, at the current basket size",
  rows: [
    { label: "Points to gain", figure: "+9.2", figureTone: "amber" as Tone, reading: "More than the 4 March fee cost you (−10.2)" },
    { label: "Customers", figure: "58,600", reading: "Per quarter, on current acquisition volume" },
    { label: "Weekly pace needed", figure: "+0.71 pts", figureTone: "amber" as Tone, reading: "Against a metric that has moved 0.4 in six weeks" },
    { label: "Best quarter on record", figure: "+3.1 pts", figureTone: "neutral" as Tone, reading: "Q3 2025, after the one-tap reorder launch" },
    { label: "What it assumes", figure: "the fee fix works", figureTone: "rose" as Tone, reading: "Shipped 7 August · not yet measured" },
    { label: "Flolyt's read", figure: "ambitious", figureTone: "amber" as Tone, reading: "Achievable only if the August fix lands as expected" },
  ],
};

export const OWNER: PersonRef = IFEOMA;
export const OWNER_META = {
  roleLine: "Marketing · owns Retain · already owns 2 goals and 14 rooms",
  loadLabel: "high load",
  reviewed: "daily · appears in Ifeoma's 06:00 digest",
  escalatesTo: "Ada Obi, if it goes 3 weeks with no movement",
  leadAgent: REPEAT_DECAY as AgentRef,
  visibleTo: "everyone · goals are never private",
};

/** G05 — what moves the metric, in order of measured effect. */
export type LeverRow = {
  lever: string;
  effect: string;
  effectTone: Tone;
  stage: string;
  dept: string;
  deptColor?: string;
  person?: PersonRef;
  yours: boolean;
  stateLabel: string;
  stateTone: Tone;
};

export const LEVERS: LeverRow[] = [
  {
    lever: "The delivery fee at checkout",
    effect: "−7.1 pts",
    effectTone: "rose",
    stage: "Activate",
    dept: "Engineering",
    deptColor: "#4E7080",
    yours: false,
    stateLabel: "fix shipped 7 Aug",
    stateTone: "ultra",
  },
  {
    lever: "Feature depth · 2+ features",
    effect: "+30 pts at 2",
    effectTone: "teal",
    stage: "Adopt",
    dept: "Product",
    deptColor: "#7A5AA8",
    yours: false,
    stateLabel: "no goal on it",
    stateTone: "amber",
  },
  {
    lever: "First-delivery success",
    effect: "+8.8 pts",
    effectTone: "teal",
    stage: "Support",
    dept: "Support",
    deptColor: "#C56A2E",
    yours: false,
    stateLabel: "open room",
    stateTone: "ultra",
  },
  {
    lever: "Reactivation timing and offer",
    effect: "+12 pts measured",
    effectTone: "teal",
    stage: "Retain",
    dept: "Marketing",
    person: IFEOMA,
    yours: true,
    stateLabel: "awaiting approval",
    stateTone: "amber",
  },
  {
    lever: "Channel mix · guest share",
    effect: "−3.2 pts",
    effectTone: "rose",
    stage: "Acquire",
    dept: "Sales",
    deptColor: "#B4568F",
    yours: false,
    stateLabel: "no room",
    stateTone: "amber",
  },
  {
    lever: "Discount depth",
    effect: "−3.1 pts",
    effectTone: "rose",
    stage: "Price",
    dept: "Finance",
    deptColor: "#5D6BB8",
    yours: false,
    stateLabel: "contested",
    stateTone: "amber",
  },
];

export const AGENTS_WATCHING = [
  { role: "Lead", value: "Repeat & Decay · opens a room when the rate moves 2 points against target", tone: "ultra" as Tone },
  { role: "Supporting", value: "Acquisition Quality · watches the channel-mix component", tone: "ultra" as Tone },
  { role: "Supporting", value: "Product Reason · holds every release against this goal for 14 days", tone: "ultra" as Tone },
  { role: "What they will not do", value: "act, or change the target · both need a person", tone: "amber" as Tone },
];

/** G06 — the review summary, rolling up every step above. */
export const REVIEW_ROWS = [
  { label: "Metric", value: "90-day repeat rate" },
  { label: "Baseline", value: "27.2% · measured over 894,000 customers, trailing 90 days, locked on save" },
  { label: "Known distortion in the baseline", value: "the 4 March fee change sits inside the window", tone: "amber" as Tone },
  { label: "Target", value: "36.4% by 31 March · +9.2 points" },
  { label: "Flolyt's read", value: "ambitious · three times the best quarter on record", tone: "amber" as Tone },
  { label: "Owner", value: "Ifeoma Nwosu · already owns 2 goals and 14 rooms", tone: "amber" as Tone },
  { label: "Levers she controls", value: "1 of 6", tone: "rose" as Tone },
  { label: "Agents watching", value: "Repeat & Decay leads · two supporting", tone: "ultra" as Tone },
  { label: "Escalates", value: "to Ada after 3 weeks with no movement" },
  { label: "Visible to", value: "everyone in the workspace" },
];
