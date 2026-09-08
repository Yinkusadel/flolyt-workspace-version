import type { RoomListRowDto } from "@/services/api/rooms/get-rooms";
import { formatCompactMoney, formatCount } from "@/pages/everyday/lifecycle/format-measured-value";
import { formatRoomActivity, initialsFromName } from "@/pages/everyday/rooms/format";
import type { RoomListRow, RoomListState, Tone } from "@/pages/everyday/rooms/types";

/**
 * `GET /rooms` -> the index's own `RoomListRow` view shape. A handful of fields the old mocked
 * build invented per-row (a "Market" column, a magnitude-based color tone on the amount-at-risk
 * figure, custom per-room "why it stopped" prose) have no backing field on this endpoint — see
 * docs/rooms/wiring-roadmap.md's gap list. Dropped or replaced below with the closest thing the
 * response actually states, never guessed.
 */

const OUTCOME_LABEL: Record<string, string> = {
  money_recovered: "recovered",
  no_action_needed: "no action",
  superseded: "superseded",
  disproven: "disproven",
  unmeasurable: "unmeasurable",
};

const OUTCOME_TONE: Record<string, Tone> = {
  money_recovered: "teal",
  no_action_needed: "neutral",
  superseded: "ultra",
  disproven: "rose",
  unmeasurable: "amber",
};

/** `stoppedBecause`'s 4-value enum -> the stale tab's "why it stopped" text — generic, not the old mock's per-row narrative (dates, team names) the API doesn't supply. */
const STOPPED_BECAUSE_LABEL: Record<string, string> = {
  "never-assigned": "Opened by an agent, never assigned",
  "owner-left": "Owner left the workspace",
  "owner-overloaded": "Owner is already carrying a full load",
  unknown: "Reason not recorded",
};

/** Same enum -> the stale tab's "suggested" chip — a direct reading of the enum, not an invented recommendation. */
const STOPPED_BECAUSE_SUGGESTION: Record<string, { label: string; tone: Tone } | undefined> = {
  "never-assigned": { label: "assign", tone: "amber" },
  "owner-left": { label: "reassign", tone: "rose" },
  "owner-overloaded": { label: "reassign", tone: "amber" },
  unknown: undefined,
};

function deriveState(row: RoomListRowDto): { label: string; tone: Tone } {
  if (row.status === "restricted") return { label: "restricted", tone: "neutral" };
  if (row.status === "closed") {
    if (row.outcomeKind) {
      return { label: OUTCOME_LABEL[row.outcomeKind] ?? "closed", tone: OUTCOME_TONE[row.outcomeKind] ?? "neutral" };
    }
    return { label: "closed", tone: "neutral" };
  }
  if (row.isRecovering) return { label: "recovering", tone: "ultra" };
  if (row.needsYou) return { label: "needs you", tone: "amber" };
  if (!row.ownerMemberId) return { label: "unowned", tone: "rose" };
  if (row.agents.length > 0) return { label: "working", tone: "ultra" };
  return { label: "open", tone: "neutral" };
}

export function mapRoomListRow(row: RoomListRowDto, listState: RoomListState): RoomListRow {
  const state = deriveState(row);
  const stopped = row.stoppedBecause ? STOPPED_BECAUSE_LABEL[row.stoppedBecause] : undefined;
  const suggested = row.stoppedBecause ? STOPPED_BECAUSE_SUGGESTION[row.stoppedBecause] : undefined;

  return {
    id: row.id,
    title: row.title,
    condition: row.conditionLabel,
    stage: row.stageLabel,
    population: row.population === null ? "—" : formatCount(row.population),
    atRisk: row.currentAmountAtRisk === null ? null : formatCompactMoney(row.currentAmountAtRisk, row.currency),
    owner: row.ownerMemberId && row.ownerName
      ? { id: row.ownerMemberId, initials: initialsFromName(row.ownerName), name: row.ownerName }
      : undefined,
    working: row.agents.map((agent) => ({ initials: initialsFromName(agent.displayName), name: agent.displayName })),
    last: formatRoomActivity(row.lastActivityAtUtc),
    lastTone: row.isStale ? "amber" : undefined,
    listState,
    stateLabel: state.label,
    stateTone: state.tone,
    untouchedDays: row.isStale && row.lastActivityAtUtc
      ? Math.round((Date.now() - new Date(row.lastActivityAtUtc).getTime()) / 86_400_000)
      : undefined,
    whyStopped: stopped,
    suggested,
  };
}
