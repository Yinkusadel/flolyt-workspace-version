import type { Department } from "@/pages/everyday/lifecycle/data";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";

/**
 * Shared primitives for the /rooms rebuild — sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-rooms/ (42 screens, R01–R42).
 * See docs/build-tracker.md section 4 for the per-screen route map.
 */

export type Tone = ChipTone;

export type PersonRef = { initials: string; name: string; department: Department; roleLabel?: string };
export type AgentRef = { initials: string; name: string };
export type Actor = { kind: "human"; person: PersonRef } | { kind: "agent"; agent: AgentRef };

/** A room's own lifecycle state — distinct from `RoomListState`, which is the index's filter-tab value. */
export type RoomStatus = "open" | "closed" | "recovering" | "restricted";

/** The 5-way outcome a room is closed with (R34's close-out radio). */
export type RoomOutcome = "money_recovered" | "no_action_needed" | "superseded" | "disproven" | "unmeasurable";

/** The Rooms index's own filter-tab value (`?state=`) — a view over `RoomStatus`, not the same enum. */
export type RoomListState = "open" | "recovering" | "stale" | "archived";

export type RoomListRow = {
  id: string;
  title: string;
  condition: string;
  stage?: string;
  market?: string;
  population: string;
  atRisk: string;
  atRiskTone?: Tone;
  owner?: PersonRef;
  working: AgentRef[];
  last: string;
  lastTone?: Tone;
  listState: RoomListState;
  stateLabel: string;
  stateTone: Tone;
  untouchedDays?: number;
  /** Stale-tab-only fields (R05's "why it stopped" / "suggested" columns). */
  whyStopped?: string;
  suggested?: { label: string; tone: Tone };
};
