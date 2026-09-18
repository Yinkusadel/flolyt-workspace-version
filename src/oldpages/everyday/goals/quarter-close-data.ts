import { ADA, IFEOMA, RAVI, TUNDE } from "@/pages/rooms/data";
import type { PersonRef, Tone } from "@/pages/rooms/types";

export type QuarterCloseRow = {
  goal: string;
  baseline: string;
  target: string;
  targetTone?: Tone;
  closedAt: string;
  closedAtTone: Tone;
  result: string;
  resultTone: Tone;
  targetChanged: string;
  targetChangedTone: Tone;
  owner: PersonRef;
};

/** G15 — Q1 close results, one row per goal. */
export const QUARTER_CLOSE_ROWS: QuarterCloseRow[] = [
  {
    goal: "Involuntary churn",
    baseline: "3.1%/mo",
    target: "1.8%/mo",
    closedAt: "1.9%/mo",
    closedAtTone: "teal",
    result: "missed by 0.1",
    resultTone: "amber",
    targetChanged: "no",
    targetChangedTone: "teal",
    owner: RAVI,
  },
  {
    goal: "Second orders",
    baseline: "142,000",
    target: "184,000",
    closedAt: "191,000",
    closedAtTone: "teal",
    result: "met",
    resultTone: "teal",
    targetChanged: "no",
    targetChangedTone: "teal",
    owner: TUNDE,
  },
  {
    goal: "90-day repeat rate",
    baseline: "27.2%",
    target: "32.0%",
    targetTone: "amber",
    closedAt: "31.4%",
    closedAtTone: "amber",
    result: "missed by 0.6",
    resultTone: "amber",
    targetChanged: "yes · 12 Aug",
    targetChangedTone: "amber",
    owner: IFEOMA,
  },
  {
    goal: "Net revenue",
    baseline: "₦4.12B",
    target: "₦4.90B",
    closedAt: "₦4.78B",
    closedAtTone: "amber",
    result: "missed by ₦120M",
    resultTone: "amber",
    targetChanged: "no",
    targetChangedTone: "teal",
    owner: ADA,
  },
  {
    goal: "Contribution margin",
    baseline: "Unavailable",
    target: "Unavailable",
    closedAt: "Unavailable",
    closedAtTone: "neutral",
    result: "never settable",
    resultTone: "neutral",
    targetChanged: "—",
    targetChangedTone: "neutral",
    owner: RAVI,
  },
];

export const QUARTER_CLOSE_CARDS = [
  {
    label: "Second orders · met",
    tone: "amber" as Tone,
    title: "Met, and it cost ₦88M in CAC",
    body: "191,000 against a target of 184,000, achieved by acquiring 31% more customers who repeat at a lower rate. The tension with the repeat goal was raised in February and never decided.",
    bottomLine: "met · and flagged",
  },
  {
    label: "Involuntary churn · missed by 0.1",
    tone: "teal" as Tone,
    title: "The best-run goal of the five",
    body: "One room, nine days, ₦62M recovered against a holdout, and a clean measurement. Missing by 0.1 points on a well-measured goal is worth more than hitting a badly-measured one.",
    bottomLine: "missed · and exemplary",
  },
  {
    label: "Contribution margin",
    tone: "rose" as Tone,
    title: "Never settable, all quarter",
    body: "The COGS source was requested on 28 July and is still outstanding. This appears as unavailable on the board pack rather than being quietly removed from the goal list.",
    bottomLine: "carried into Q2, unchanged",
  },
];
