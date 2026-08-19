import type { Tone } from "@/pages/everyday/rooms/types";

export type TensionPair = {
  severityLabel: string;
  title: string;
  body: string;
  footline: string;
  tone: Tone;
};

/** G11 — the three pairs of goals pulling against each other. */
export const TENSIONS: TensionPair[] = [
  {
    severityLabel: "Expensive · ₦88M",
    title: "Second orders vs 90-day repeat rate",
    body: "Second orders is ahead because acquisition rose 31%. The rate per acquired customer fell. Hitting the count without the rate means buying the difference — ₦88M of CAC for volume that will not repeat.",
    footline: "Tunde vs Ifeoma · unresolved 6 weeks",
    tone: "rose",
  },
  {
    severityLabel: "Moderate",
    title: "Involuntary churn vs contribution margin",
    body: "Aggressive card retries recover revenue and raise processor fees. Nobody can price the trade because margin has no baseline, so it is stated rather than scored.",
    footline: "Ravi owns both · unpriced",
    tone: "amber",
  },
  {
    severityLabel: "Minor",
    title: "Support resolution time vs first-delivery success",
    body: "Faster ticket closure and better delivery follow-up compete for the same nine people in Lagos. Real, but small — about ₦4M either way.",
    footline: "Amara owns both",
    tone: "neutral",
  },
];

export type ComparisonRow = { label: string; left: string; right: string; winner?: "left" | "right" };

/** The "expensive one, in detail" comparison table — second orders vs 90-day repeat rate. */
export const TENSION_COMPARISON: ComparisonRow[] = [
  { label: "Owner", left: "Tunde Bakare · Sales", right: "Ifeoma Nwosu · Marketing", winner: "left" },
  { label: "Target", left: "184,000 second orders", right: "36.4% repeat rate" },
  { label: "Today", left: "Ahead of pace", right: "7.2 points behind" },
  { label: "Moved by", left: "Acquiring more customers", right: "Making acquired customers return" },
  { label: "Cost of winning", left: "₦88M in CAC", right: "One release · ₦0 incremental", winner: "right" },
  { label: "Currently funded", left: "31% budget increase, approved", right: "Waiting 19 hrs for an approval", winner: "left" },
];
