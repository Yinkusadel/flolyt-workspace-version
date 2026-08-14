export type MemoryCategory = "validated" | "observed" | "superseded";
export type MemoryScope = "workspace" | "account";

export type MemoryEntry = {
  id: string;
  headline: string;
  body: string;
  category: MemoryCategory;
  scope: MemoryScope;
  account?: string;
  meta: string;
};

export type MemoryStats = {
  learningsHeld: number;
  citedInDecisions: number;
  superseded: number;
  crossTenant: number;
};

export const MEMORY_STATS: MemoryStats = {
  learningsHeld: 412,
  citedInDecisions: 96,
  superseded: 38,
  crossTenant: 0,
};

export const MEMORY_ENTRIES: MemoryEntry[] = [
  {
    id: "seat-reactivation",
    headline: "Seat reactivation outperforms discounting at Northwind Retail.",
    body: "April's onboarding rescue recovered 22 of 31 dormant seats with no margin concession. Repeated in August: 29 of 41.",
    category: "validated",
    scope: "account",
    account: "Northwind Retail",
    meta: "validated learning · n=72 · high confidence · updated 12 Aug",
  },
  {
    id: "p2-escalation-renewal",
    headline: "Accounts with an open P2 escalation at renewal renew 22 points lower.",
    body: "Association across 64 accounts over 18 months. Not shown to cause the drop — an open ticket may be a symptom of the same underlying problem.",
    category: "validated",
    scope: "workspace",
    meta: "validated learning · n=64 · high confidence · 2 Aug",
  },
  {
    id: "trial-48h",
    headline: "Trial users who do not return within 48 hours almost never activate.",
    body: "Observed across 3,100 trials. The second session, not the first, is the moment worth defending.",
    category: "observed",
    scope: "workspace",
    meta: "observed pattern · n=3,100 · medium confidence · 14 Jul",
  },
  {
    id: "discount-smb",
    headline: "Discounting below 12% no longer moves SMB renewals.",
    body: "Superseded on 28 Jul after the pricing change. Kept for the record; the agents no longer use it.",
    category: "superseded",
    scope: "workspace",
    meta: 'superseded · replaced by "SMB renewals respond to support quality, not price" · 28 Jul',
  },
];
