import type { SuggestedActionV2 } from "./agent-response-types";
import type { OpenRoomFromLeakParams } from "./use-open-room-from-leak";

// Only resources with a real, live destination in this app resolve to a route. The v3 handoff's
// initial catalog also lists `segment`, `campaign`, and `channels`, but none of those have a live
// top-level page today (segments/channels only exist inside the archived src/oldpages lifecycle
// build, campaign has no route at all) — resolving those would link into a dead or archived page,
// so they fall through exactly like an unknown resource name: hidden, not guessed at.
//
// `room` without a `resourceId` is hidden here too — see `extractLeakRoomParams` below for the one
// shape of that case this app actually knows how to handle.
export function resolveSuggestedActionRoute(action: SuggestedActionV2): string | null {
  const { resource, resourceId } = action.target;

  switch (resource) {
    case "room":
      return resourceId ? `/rooms/${resourceId}` : null;
    case "datasources":
      return "/data-sources";
    default:
      return null;
  }
}

// A live capture on 2026-09-25/26 (twice, identical shape) showed the backend sending "open a room
// from a leak" as `target.resource: "room"` with no `resourceId`, carrying `grid`/`rowKey`/
// `conditionKey`/`currency` in `parameters` instead — the same coordinate the leakage map's own
// "Start a room" button (`CellDetailCard.handleStartRoom`,
// src/pages/leakage-map/detail-panel.tsx) already knows how to resolve via `GET
// /leakage/cells/{grid}/{row}/{condition}/{currency}` + `POST .../room`. `useOpenRoomFromLeak`
// wraps that same flow for this action. Returns null for every other resourceless `room` shape —
// still hidden, not guessed at, per the policy above.
export function extractLeakRoomParams(action: SuggestedActionV2): OpenRoomFromLeakParams | null {
  if (action.target.resource !== "room" || action.target.resourceId) return null;

  const p = action.parameters;
  if (!p?.grid || !p?.rowKey || !p?.conditionKey || !p?.currency) return null;

  return { grid: p.grid, row: p.rowKey, condition: p.conditionKey, currency: p.currency };
}
