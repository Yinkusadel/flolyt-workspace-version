/**
 * Mock content for screen 66 (AI teammates directory) in flolyt-kit-122 —
 * not fully built yet. This file currently only backs the Pause-an-agent
 * modal (screen 121, flolyt-kit-122/121-pause-an-agent.svg), which is
 * reachable both from here and from a room's agent chip.
 */
export type TeammateAgent = {
  initials: string;
  name: string;
  role: string;
  openRooms: number;
  evidenceRooms: number;
  dismissals: number;
};

export const AI_TEAMMATES: TeammateAgent[] = [
  { initials: "MO", name: "Orchestrator", role: "Routes conflicts to the right human, never resolves them itself", openRooms: 3, evidenceRooms: 38, dismissals: 7 },
  { initials: "RD", name: "Repeat & Decay", role: "Watches second-order and reorder rate across every cohort", openRooms: 2, evidenceRooms: 22, dismissals: 4 },
  { initials: "RL", name: "Revenue & Leakage", role: "Prices spoilage and leakage on active accounts", openRooms: 1, evidenceRooms: 14, dismissals: 2 },
  { initials: "SS", name: "Support Signal", role: "Reads tickets read-only, flags escalations by age", openRooms: 2, evidenceRooms: 19, dismissals: 5 },
  { initials: "CH", name: "CS Health", role: "Leads persistent account rooms, drafts renewal plans", openRooms: 1, evidenceRooms: 14, dismissals: 3 },
];
