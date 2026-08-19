import { ADA, IFEOMA, RAVI, REPEAT_DECAY, TUNDE } from "@/pages/everyday/rooms/data";
import type { AgentRef } from "@/pages/everyday/rooms/types";
import type { AgentFinding, GoalRow, MetricReadinessRow } from "@/pages/everyday/goals/types";

/** G01 — "what Flolyt can already measure, without you setting anything". */
export const METRIC_READINESS: MetricReadinessRow[] = [
  {
    metric: "Net revenue",
    today: "₦4.12B / qtr",
    trailing90: "stable",
    source: "orders",
    sourceTone: "teal",
    canGoalLabel: "yes",
    canGoalTone: "teal",
  },
  {
    metric: "90-day repeat rate",
    today: "27.2%",
    trailing90: "−10.2 pts",
    trailing90Tone: "rose",
    source: "orders",
    sourceTone: "teal",
    canGoalLabel: "yes",
    canGoalTone: "teal",
  },
  {
    metric: "Second orders",
    today: "142,000 / qtr",
    trailing90: "−15.6%",
    trailing90Tone: "rose",
    source: "orders",
    sourceTone: "teal",
    canGoalLabel: "yes",
    canGoalTone: "teal",
  },
  {
    metric: "Involuntary churn",
    today: "3.1% / mo",
    trailing90: "stable",
    source: "payments",
    sourceTone: "teal",
    canGoalLabel: "yes",
    canGoalTone: "teal",
  },
  {
    metric: "Contribution margin",
    today: "Unavailable",
    trailing90: "Unavailable",
    source: "nothing connected",
    sourceTone: "rose",
    canGoalLabel: "no baseline",
    canGoalTone: "amber",
  },
];

const ACQUISITION_QUALITY: AgentRef = { initials: "AQ", name: "Acquisition Quality" };

/** G07 — the populated tracker table. Row 2 (90-day repeat rate) is the one fully-built goal, see goal/data.ts. */
export const GOAL_ROWS: GoalRow[] = [
  {
    id: "net-revenue",
    metric: "Net revenue",
    hasBaseline: true,
    gapToTarget: "₦186M behind",
    gapTone: "amber",
    workingOnIt: "3 rooms · 2 campaigns",
    projectedClose: "₦4.71B",
    projectedCloseTone: "amber",
    owner: ADA,
    agent: REPEAT_DECAY,
    pace: "94% of target",
    paceTone: "amber",
  },
  {
    id: "repeat-90",
    metric: "90-day repeat rate",
    hasBaseline: true,
    gapToTarget: "7.2 points",
    gapTone: "amber",
    workingOnIt: "Second order room",
    projectedClose: "36.4%",
    owner: IFEOMA,
    agent: REPEAT_DECAY,
    pace: "96% of target",
    paceTone: "amber",
  },
  {
    id: "second-orders",
    metric: "Second orders",
    hasBaseline: true,
    gapToTarget: "58,600 customers",
    workingOnIt: "Reactivation wave",
    projectedClose: "184,000",
    owner: TUNDE,
    agent: ACQUISITION_QUALITY,
    pace: "Ahead",
    paceTone: "teal",
  },
  {
    id: "involuntary-churn",
    metric: "Involuntary churn",
    hasBaseline: true,
    gapToTarget: "0.4 pts",
    workingOnIt: "Dunning room · closed",
    projectedClose: "1.9%/mo",
    owner: RAVI,
    agent: { initials: "IC", name: "Involuntary Churn" },
    pace: "On target",
    paceTone: "teal",
  },
  {
    id: "contribution-margin",
    metric: "Contribution margin",
    hasBaseline: false,
    gapToTarget: "Unavailable",
    gapTone: "neutral",
    workingOnIt: "Nothing · no baseline",
    projectedClose: "Unavailable",
    projectedCloseTone: "neutral",
    owner: RAVI,
    agent: { initials: "PX", name: "Price & Margin" },
    pace: "Unavailable",
    paceTone: "neutral",
  },
];

export const GOAL_FINDINGS: AgentFinding[] = [
  {
    agent: REPEAT_DECAY,
    runId: "8f2c",
    title: "The gap is one release, not one quarter",
    body: "Revenue tracked target until 4 March. Everything since is the delivery-fee change: 148,000 customers who never placed a second order. Closing it recovers ₦412M of the gap.",
    footnote: "the fix shipped 7 August",
    tone: "amber",
  },
  {
    agent: ACQUISITION_QUALITY,
    runId: "4b19",
    title: "Second orders are ahead for a bad reason",
    body: "The count is ahead because acquisition rose 31%. The rate per acquired customer fell. Hitting this goal without the repeat goal costs ₦88M in CAC.",
    footnote: "two goals in tension · unresolved",
    tone: "rose",
  },
];
