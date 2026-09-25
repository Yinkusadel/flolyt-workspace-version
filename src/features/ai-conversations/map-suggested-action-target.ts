import type { SuggestedActionV2 } from "./agent-response-types";

// Only resources with a real, live destination in this app resolve to a route. The v3 handoff's
// initial catalog also lists `segment`, `campaign`, and `channels`, but none of those have a live
// top-level page today (segments/channels only exist inside the archived src/oldpages lifecycle
// build, campaign has no route at all) — resolving those would link into a dead or archived page,
// so they fall through exactly like an unknown resource name: hidden, not guessed at.
//
// `room` without a `resourceId` is hidden too, not a fallback to the bare `/rooms` list — confirmed
// live 2026-09-25 that this shape is a real "open a room from a leak" suggestion whose actual
// identifying info lives in `parameters` (`grid`/`rowKey`/`conditionKey`/`currency`), meant for the
// New Room wizard's prefill, not a plain navigable id. A `/rooms` fallback silently discarded that
// and sent the user to the generic index — worse than no button at all. Full writeup, including
// the live payload example and what building this properly would need, is in
// docs/chat-panel/build-plan.md's "Reference: action-resource routing" section.
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
