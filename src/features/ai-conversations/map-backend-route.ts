// The backend generates NAV_LINK routes against its own (out of date / assumed) route shape —
// e.g. "/settings/datasources/connect?type=Paystack" or "/settings/datasources/{id}" — which
// don't match this app's actual flat routes (routes.tsx has a single "data-sources" path, no
// per-id sub-route). Rewrite known backend patterns to a real in-app destination before
// navigating; anything unrecognized falls through unchanged rather than being guessed at.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function mapBackendRoute(route: string): string {
  const [path] = route.split("?");
  const datasourceSegment = path.match(/^\/settings\/datasources\/?([^/]*)$/)?.[1];

  if (datasourceSegment !== undefined) {
    // A specific already-connected source (identified by id) — there's no per-source detail
    // route, so send them to the Connected tab where that source is actually listed.
    if (UUID_RE.test(datasourceSegment)) return "/data-sources?tab=connected";
    // "connect", empty, or anything else asking to pick/add a source — the Sources tab (default).
    return "/data-sources";
  }

  return route;
}
