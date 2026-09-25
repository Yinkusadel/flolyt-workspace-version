import type { SuggestedActionV2 } from "./agent-response-types";

// Only resources with a real, live destination in this app resolve to a route. The v3 handoff's
// initial catalog also lists `segment`, `campaign`, and `channels`, but none of those have a live
// top-level page today (segments/channels only exist inside the archived src/oldpages lifecycle
// build, campaign has no route at all) — resolving those would link into a dead or archived page,
// so they fall through exactly like an unknown resource name: hidden, not guessed at. Revisit once
// those surfaces exist.
export function resolveSuggestedActionRoute(action: SuggestedActionV2): string | null {
  const { resource, resourceId } = action.target;

  switch (resource) {
    case "room":
      return resourceId ? `/rooms/${resourceId}` : "/rooms";
    case "datasources":
      return "/data-sources";
    default:
      return null;
  }
}
