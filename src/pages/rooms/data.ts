import type { AgentRef, PersonRef, RoomListRow, RoomListState } from "@/pages/rooms/types";

/**
 * Shared identity roster + the Rooms index dataset — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-rooms/R01–R11 (index states)
 * and R32/R41 (collision/plays-at-scale, which reuse the same rooms).
 */

export const IFEOMA: PersonRef = { initials: "IN", name: "Ifeoma Nwosu", department: "Marketing" };
export const TUNDE: PersonRef = { initials: "TB", name: "Tunde Bakare", department: "Sales" };
export const AMARA: PersonRef = { initials: "AO", name: "Amara Okeke", department: "Support" };
export const RAVI: PersonRef = { initials: "RM", name: "Ravi Mehta", department: "Finance" };
export const ZAINAB: PersonRef = { initials: "ZY", name: "Zainab Yusuf", department: "Product" };
export const SAM: PersonRef = { initials: "SM", name: "Sam Iyer", department: "Engineering" };
export const ADA: PersonRef = { initials: "AD", name: "Ada Obi", department: "Customer Success" };
export const KUNLE: PersonRef = { initials: "KO", name: "Kunle", department: "Customer Success" };
export const SADE: PersonRef = { initials: "SO", name: "Sade Ogun", department: "Engineering" };
export const SAMUEL: PersonRef = { initials: "SA", name: "Samuel Eze", department: "Finance" };

export const REPEAT_DECAY: AgentRef = { initials: "RD", name: "Repeat & Decay" };
export const ACQUISITION_QUALITY: AgentRef = { initials: "AQ", name: "Acquisition Quality" };
export const ORCHESTRATOR: AgentRef = { initials: "MO", name: "Orchestrator" };
export const PRICE_MARGIN: AgentRef = { initials: "PX", name: "Price & Margin" };
export const SUPPORT_SIGNAL: AgentRef = { initials: "SS", name: "Support Signal" };
export const INVOLUNTARY_CHURN: AgentRef = { initials: "IC", name: "Involuntary Churn" };
export const EXPANSION: AgentRef = { initials: "EX", name: "Expansion" };

const ROOM_INDEX: RoomListRow[] = [
  {
    id: "second-order-never-happened",
    title: "Second order never happened",
    condition: "Repeat decay",
    stage: "Retain",
    market: "NG",
    population: "148,000",
    atRisk: "₦412M",
    atRiskTone: "rose",
    owner: IFEOMA,
    working: [REPEAT_DECAY, ACQUISITION_QUALITY, ORCHESTRATOR],
    last: "live now",
    lastTone: "ultra",
    listState: "open",
    stateLabel: "needs you",
    stateTone: "amber",
  },
  {
    id: "cards-failing-on-renewal-night",
    title: "Cards failing on renewal night",
    condition: "Involuntary churn",
    stage: "Renew",
    market: "NG",
    population: "61,400",
    atRisk: "₦88M",
    atRiskTone: "rose",
    owner: RAVI,
    working: [INVOLUNTARY_CHURN],
    last: "22 min",
    listState: "open",
    stateLabel: "working",
    stateTone: "ultra",
  },
  {
    id: "checkout-abandoned-at-delivery-fee",
    title: "Checkout abandoned at delivery fee",
    condition: "Abandonment",
    stage: "Activate",
    market: "NG · KE",
    population: "308,000",
    atRisk: "₦124M",
    atRiskTone: "rose",
    owner: ZAINAB,
    working: [PRICE_MARGIN],
    last: "1 hr",
    listState: "open",
    stateLabel: "working",
    stateTone: "ultra",
  },
  {
    id: "discount-only-buyers",
    title: "Discount-only buyers",
    condition: "Margin erosion",
    stage: "Price",
    market: "NG",
    population: "94,000",
    atRisk: "₦46M",
    atRiskTone: "amber",
    owner: TUNDE,
    working: [PRICE_MARGIN],
    last: "Yesterday",
    listState: "archived",
    stateLabel: "decided",
    stateTone: "teal",
  },
  {
    id: "lagos-delivery-failures",
    title: "Lagos delivery failures",
    condition: "Delivery",
    stage: "Support",
    market: "NG",
    population: "12,800",
    atRisk: "₦9M",
    atRiskTone: "amber",
    owner: AMARA,
    working: [SUPPORT_SIGNAL],
    last: "Yesterday",
    listState: "open",
    stateLabel: "open",
    stateTone: "neutral",
  },
  {
    id: "ghana-signups-convert-at-4-percent",
    title: "Ghana signups convert at 4%",
    condition: "Acquisition quality",
    stage: "Acquire",
    market: "GH",
    population: "31,200",
    atRisk: "₦31M",
    atRiskTone: "amber",
    working: [ACQUISITION_QUALITY],
    last: "03:40",
    listState: "open",
    stateLabel: "unowned",
    stateTone: "rose",
  },
  {
    id: "accra-delivery-windows",
    title: "Accra delivery windows",
    condition: "Delivery",
    stage: "Support",
    market: "GH",
    population: "9,400",
    atRisk: "GHS 2.1M",
    atRiskTone: "amber",
    working: [SUPPORT_SIGNAL],
    last: "6 days",
    lastTone: "amber",
    listState: "stale",
    stateLabel: "stale",
    stateTone: "amber",
    untouchedDays: 41,
    whyStopped: "Opened by an agent, never assigned",
    suggested: { label: "assign", tone: "amber" },
  },
  {
    id: "loyalty-tier-confusion",
    title: "Loyalty tier confusion",
    condition: "Loyalty",
    stage: "Adopt",
    market: "NG",
    population: "22,000",
    atRisk: "₦18M",
    atRiskTone: "amber",
    owner: TUNDE,
    working: [ACQUISITION_QUALITY],
    last: "38 days",
    lastTone: "rose",
    listState: "stale",
    stateLabel: "stale",
    stateTone: "amber",
    untouchedDays: 38,
    whyStopped: "Waiting on instrumentation from Engineering",
    suggested: { label: "chase it", tone: "amber" },
  },
  {
    id: "weekend-push-fatigue",
    title: "Weekend push fatigue",
    condition: "Engagement",
    stage: "Retain",
    market: "NG",
    population: "112,000",
    atRisk: "₦12M",
    atRiskTone: "amber",
    owner: IFEOMA,
    working: [REPEAT_DECAY],
    last: "4 Jul",
    listState: "recovering",
    stateLabel: "recovering",
    stateTone: "ultra",
  },
  {
    id: "uk-checkout-latency",
    title: "UK checkout latency",
    condition: "Performance",
    stage: "Activate",
    market: "UK",
    population: "69,000",
    atRisk: "£14k",
    atRiskTone: "neutral",
    owner: RAVI,
    working: [ACQUISITION_QUALITY],
    last: "22 Aug",
    listState: "archived",
    stateLabel: "closed",
    stateTone: "neutral",
  },
  {
    id: "nakuru-card-failures",
    title: "Nakuru card failures",
    condition: "Involuntary churn",
    stage: "Renew",
    market: "KE",
    population: "8,100",
    atRisk: "KES 4.1M",
    atRiskTone: "amber",
    working: [INVOLUNTARY_CHURN],
    last: "19 days",
    lastTone: "amber",
    listState: "stale",
    stateLabel: "stale",
    stateTone: "amber",
    untouchedDays: 19,
    whyStopped: "Owner left the company on 24 July",
    suggested: { label: "reassign", tone: "rose" },
  },
  {
    id: "delivery-fee-kenya-rollout",
    title: "Delivery fee · Kenya rollout",
    condition: "Fee rollout",
    stage: "Activate",
    market: "KE",
    population: "44,000",
    atRisk: "KES 41M",
    atRiskTone: "amber",
    owner: KUNLE,
    working: [PRICE_MARGIN],
    last: "3 hrs",
    listState: "open",
    stateLabel: "open",
    stateTone: "amber",
  },
  {
    id: "delivery-partner-sla-breach",
    title: "Delivery partner SLA breach",
    condition: "Delivery",
    stage: "Support",
    market: "NG",
    population: "18,900",
    atRisk: "₦31M",
    atRiskTone: "amber",
    owner: AMARA,
    working: [SUPPORT_SIGNAL],
    last: "11 days",
    lastTone: "amber",
    listState: "stale",
    stateLabel: "stale",
    stateTone: "amber",
    untouchedDays: 11,
    whyStopped: "Too small to rank, never closed",
    suggested: { label: "close it", tone: "teal" },
  },
  {
    id: "thursday-win-back",
    title: "Thursday win-back",
    condition: "Win-back",
    stage: "Retain",
    market: "NG",
    population: "218,000",
    atRisk: "₦96M",
    atRiskTone: "amber",
    owner: IFEOMA,
    working: [REPEAT_DECAY],
    last: "4 hrs",
    listState: "open",
    stateLabel: "open",
    stateTone: "amber",
  },
  {
    id: "kenya-referral-push",
    title: "Kenya referral push",
    condition: "Referrals",
    stage: "Advocate",
    market: "KE",
    population: "9,100",
    atRisk: "KES 6M",
    atRiskTone: "amber",
    owner: IFEOMA,
    working: [ACQUISITION_QUALITY],
    last: "2 days",
    listState: "open",
    stateLabel: "open",
    stateTone: "amber",
  },
  {
    id: "lagos-delivery-apology",
    title: "Lagos delivery apology",
    condition: "Delivery",
    stage: "Support",
    market: "NG",
    population: "4,100",
    atRisk: "₦3M",
    atRiskTone: "amber",
    owner: AMARA,
    working: [SUPPORT_SIGNAL],
    last: "2 days",
    listState: "open",
    stateLabel: "open",
    stateTone: "amber",
  },
];

export function getRoomIndex(): RoomListRow[] {
  return ROOM_INDEX;
}

export function getRoomListRow(id: string): RoomListRow | undefined {
  return ROOM_INDEX.find((room) => room.id === id);
}

export function getRoomListCounts(): Record<RoomListState, number> {
  return {
    open: ROOM_INDEX.filter((r) => r.listState === "open").length,
    recovering: ROOM_INDEX.filter((r) => r.listState === "recovering").length,
    stale: ROOM_INDEX.filter((r) => r.listState === "stale").length,
    archived: ROOM_INDEX.filter((r) => r.listState === "archived").length,
  };
}

export function getRoomsNeedingApproval(): number {
  return ROOM_INDEX.filter((r) => r.listState === "open" && r.stateLabel === "needs you").length;
}

export type SavedView = { label: string; count: number; active?: boolean };

export const SAVED_VIEWS: SavedView[] = [
  { label: "My open rooms", count: 14, active: true },
  { label: "Kenya · everything", count: 38 },
  { label: "Above ₦25M", count: 31 },
  { label: "No owner", count: 9 },
  { label: "Untouched 14 days", count: 62 },
];
