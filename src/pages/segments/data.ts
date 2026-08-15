export type StageAccent = "teal" | "amber" | "rose" | "ultra";

export type StageSummary = {
  key: string;
  label: string;
  count: string;
  accent: StageAccent;
};

export type MovementTone = "concern" | "healthy";

export type MovementEntry = {
  id: string;
  from: string;
  to: string;
  count: string;
  note: string;
  tone: MovementTone;
};

export type ChangeTone = "teal" | "amber" | "rose";

export type SegmentRow = {
  id: string;
  name: string;
  rule: string;
  size: string;
  change: string;
  changeTone: ChangeTone;
  usedBy: string;
  usedByWarn?: boolean;
};

export const CUSTOMER_BASE = "4.2M";

export const STAGE_SUMMARY: StageSummary[] = [
  { key: "new", label: "New", count: "412k", accent: "teal" },
  { key: "active", label: "Active", count: "1.1M", accent: "teal" },
  { key: "slipping", label: "Slipping", count: "684k", accent: "amber" },
  { key: "lapsed", label: "Lapsed", count: "1.5M", accent: "rose" },
  { key: "reactivated", label: "Reactivated", count: "504k", accent: "ultra" },
];

export const MOVEMENTS: MovementEntry[] = [
  {
    id: "active-slipping",
    from: "Active",
    to: "Slipping",
    count: "684,000",
    note: "fastest movement in nine months",
    tone: "concern",
  },
  {
    id: "slipping-lapsed",
    from: "Slipping",
    to: "Lapsed",
    count: "312,000",
    note: "up 41% on last month",
    tone: "concern",
  },
  {
    id: "lapsed-reactivated",
    from: "Lapsed",
    to: "Reactivated",
    count: "84,000",
    note: "almost all from one campaign",
    tone: "healthy",
  },
  {
    id: "new-active",
    from: "New",
    to: "Active",
    count: "168,000",
    note: "second-order rate still 27%",
    tone: "healthy",
  },
];

export const SEGMENTS: SegmentRow[] = [
  {
    id: "champions",
    name: "Champions",
    rule: "4+ orders, last 30 days, full price",
    size: "148,000",
    change: "+2.1%",
    changeTone: "teal",
    usedBy: "3 campaigns",
  },
  {
    id: "one-and-done",
    name: "One and done",
    rule: "1 order, no second within 90 days",
    size: "148,000",
    change: "+31.4%",
    changeTone: "rose",
    usedBy: "1 room",
  },
  {
    id: "discount-only",
    name: "Discount-only",
    rule: "every order used a promotion",
    size: "94,000",
    change: "+8.2%",
    changeTone: "amber",
    usedBy: "2 campaigns",
  },
  {
    id: "slipping-high-value",
    name: "Slipping high value",
    rule: "top decile LTV, no order in 45 days",
    size: "38,400",
    change: "+12.6%",
    changeTone: "rose",
    usedBy: "1 campaign",
  },
  {
    id: "failed-payment",
    name: "Failed payment",
    rule: "an active decline in the last 30 days",
    size: "61,400",
    change: "+4.4%",
    changeTone: "rose",
    usedBy: "1 room",
  },
  {
    id: "deep-lapsed",
    name: "Deep lapsed",
    rule: "no order in 12 months, still opening",
    size: "180,000",
    change: "−1.2%",
    changeTone: "teal",
    usedBy: "nothing yet",
    usedByWarn: true,
  },
];
