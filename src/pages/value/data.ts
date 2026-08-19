import type { Tone } from "@/pages/everyday/rooms/types";

export type LedgerRow = {
  room: string;
  closed: string;
  closedTone?: Tone;
  atRisk: string;
  recovered: string;
  recoveredTone: Tone;
  howMeasured: string;
  creditedTo: string;
  days: string;
};

/** G14 — the value ledger, one row per closed (or open) room. */
export const LEDGER: LedgerRow[] = [
  {
    room: "Cards failing on renewal night",
    closed: "2 Apr",
    atRisk: "₦88M",
    recovered: "₦62M",
    recoveredTone: "teal",
    howMeasured: "Holdout · 10% not retried",
    creditedTo: "Involuntary churn",
    days: "9",
  },
  {
    room: "Discount-only buyers",
    closed: "28 Mar",
    atRisk: "₦46M",
    recovered: "₦31M",
    recoveredTone: "teal",
    howMeasured: "Holdout · margin per order",
    creditedTo: "Net revenue",
    days: "14",
  },
  {
    room: "Lagos delivery failures",
    closed: "21 Mar",
    atRisk: "₦9M",
    recovered: "₦9M",
    recoveredTone: "teal",
    howMeasured: "Every affected order refunded once",
    creditedTo: "90-day repeat rate",
    days: "4",
  },
  {
    room: "Second order never happened",
    closed: "Open",
    closedTone: "amber",
    atRisk: "₦412M",
    recovered: "—",
    recoveredTone: "neutral",
    howMeasured: "Holdout planned · 10%",
    creditedTo: "90-day repeat rate",
    days: "—",
  },
  {
    room: "Weekend push fatigue",
    closed: "17 Mar",
    atRisk: "₦12M",
    recovered: "Unavailable",
    recoveredTone: "neutral",
    howMeasured: "No holdout was possible",
    creditedTo: "—",
    days: "6",
  },
];
