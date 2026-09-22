export type AuditCategory = "rooms" | "members" | "data" | "wallet";

export type AuditEntry = {
  id: string;
  category: AuditCategory;
  actor: string;
  actorInitials: string;
  action: string;
  detail: string;
  detailTone?: "default" | "warn";
  timestamp: string;
};

export const AUDIT_CATEGORIES: { key: AuditCategory; label: string }[] = [
  { key: "rooms", label: "Rooms" },
  { key: "members", label: "Members" },
  { key: "data", label: "Data sources" },
  { key: "wallet", label: "Wallet & credits" },
];

/**
 * No workspace-wide audit endpoint exists yet (only a per-room `GET /rooms/{id}/log`, see
 * docs/endpoints/rooms.md) — these are realistic placeholder entries covering the
 * governance-relevant actions this app actually supports (room decisions, member/role changes,
 * data source connections, wallet and credit purchases), not a live feed. Swap for a real
 * `GET /audit-log` response once that endpoint is documented.
 */
export const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "1",
    category: "rooms",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "closed the room",
    detail: "Renewal risk — Acme Corp, outcome: saved",
    timestamp: "2026-09-22T09:14:00Z",
  },
  {
    id: "2",
    category: "wallet",
    actor: "Priya N.",
    actorInitials: "PN",
    action: "purchased a credit pack",
    detail: "Growth pack — 5,000 credits",
    timestamp: "2026-09-22T08:02:00Z",
  },
  {
    id: "3",
    category: "data",
    actor: "Automated sync",
    actorInitials: "AS",
    action: "failed to sync",
    detail: "Salesforce — connection needs re-authentication",
    detailTone: "warn",
    timestamp: "2026-09-22T06:30:00Z",
  },
  {
    id: "4",
    category: "members",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "changed a role",
    detail: "Daniel A. — Member → Admin, on Growth",
    timestamp: "2026-09-21T17:45:00Z",
  },
  {
    id: "5",
    category: "rooms",
    actor: "Daniel A.",
    actorInitials: "DA",
    action: "reassigned the owner on",
    detail: "Checkout drop-off — EU cohort, to Priya N.",
    timestamp: "2026-09-21T15:20:00Z",
  },
  {
    id: "6",
    category: "rooms",
    actor: "Priya N.",
    actorInitials: "PN",
    action: "approved a play in",
    detail: "Win-back sequence — dormant accounts",
    timestamp: "2026-09-21T13:05:00Z",
  },
  {
    id: "7",
    category: "data",
    actor: "Daniel A.",
    actorInitials: "DA",
    action: "connected",
    detail: "Stripe",
    timestamp: "2026-09-21T10:40:00Z",
  },
  {
    id: "8",
    category: "rooms",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "added a guardrail to",
    detail: "Discount approval flow — cap raised past 20% needs a second approver",
    timestamp: "2026-09-20T19:12:00Z",
  },
  {
    id: "9",
    category: "members",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "invited",
    detail: "tomas@acme.com to Retention",
    timestamp: "2026-09-20T14:55:00Z",
  },
  {
    id: "10",
    category: "wallet",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "topped up the wallet",
    detail: "+$500.00",
    timestamp: "2026-09-20T11:30:00Z",
  },
  {
    id: "11",
    category: "rooms",
    actor: "Priya N.",
    actorInitials: "PN",
    action: "raised a conflict in",
    detail: "Pricing page A/B test — two agents proposed opposite treatments",
    timestamp: "2026-09-19T16:08:00Z",
  },
  {
    id: "12",
    category: "data",
    actor: "Automated sync",
    actorInitials: "AS",
    action: "finished syncing",
    detail: "HubSpot — 1,204 records updated",
    timestamp: "2026-09-19T09:00:00Z",
  },
  {
    id: "13",
    category: "members",
    actor: "Daniel A.",
    actorInitials: "DA",
    action: "accepted the invitation to",
    detail: "Growth",
    timestamp: "2026-09-18T12:22:00Z",
  },
  {
    id: "14",
    category: "rooms",
    actor: "Priya N.",
    actorInitials: "PN",
    action: "merged two rooms into",
    detail: "Trial expiry nudge (EU) — sources: Trial expiry nudge",
    timestamp: "2026-09-18T10:03:00Z",
  },
  {
    id: "15",
    category: "data",
    actor: "Priya N.",
    actorInitials: "PN",
    action: "disconnected",
    detail: "Segment — existing records kept",
    timestamp: "2026-09-17T15:40:00Z",
  },
  {
    id: "16",
    category: "members",
    actor: "Ifeoma K.",
    actorInitials: "IK",
    action: "removed",
    detail: "tomas@acme.com from the workspace",
    timestamp: "2026-09-17T09:18:00Z",
  },
];
