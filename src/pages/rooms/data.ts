import { agentInitialsFromName } from "@/pages/rooms/format";
import type { AgentRef, PersonRef } from "@/pages/rooms/types";

/**
 * Shared identity roster — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-rooms/R01–R11 (index states)
 * and R32/R41 (collision/plays-at-scale, which reuse the same rooms). Reused across dozens of
 * still-mocked feature domains as their "who's who," so these named constants stay even after
 * the rooms index itself moved to live data — see `room-list-adapter.ts` / `index.tsx` for the
 * live index, and [[flolyt_rooms_wiring_roadmap]].
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

export const REPEAT_DECAY: AgentRef = { initials: agentInitialsFromName("Repeat & Decay"), name: "Repeat & Decay" };
export const ACQUISITION_QUALITY: AgentRef = {
  initials: agentInitialsFromName("Acquisition Quality"),
  name: "Acquisition Quality",
};
export const ORCHESTRATOR: AgentRef = { initials: agentInitialsFromName("Orchestrator"), name: "Orchestrator" };
export const PRICE_MARGIN: AgentRef = { initials: agentInitialsFromName("Price & Margin"), name: "Price & Margin" };
export const SUPPORT_SIGNAL: AgentRef = { initials: agentInitialsFromName("Support Signal"), name: "Support Signal" };
export const INVOLUNTARY_CHURN: AgentRef = {
  initials: agentInitialsFromName("Involuntary Churn"),
  name: "Involuntary Churn",
};
export const EXPANSION: AgentRef = { initials: agentInitialsFromName("Expansion"), name: "Expansion" };
