/** `restricted.reason` values (POST /rooms/{id}/restrict accepts exactly these four). */
export const RESTRICT_REASON_LABEL: Record<string, string> = {
  "pricing-before-announcement": "pricing before announcement",
  "individual-employment": "individual employment",
  "active-legal-matter": "active legal matter",
  acquisition: "acquisition",
};

/** `stoppedBecause`'s four values, as a short phrase for the stale chip. */
export const STOPPED_BECAUSE_LABEL: Record<string, string> = {
  "never-assigned": "never assigned",
  "owner-left": "owner left",
  "owner-overloaded": "owner overloaded",
  unknown: "reason not recorded",
};

/** The Room list's four state values; they match GET /rooms's `state` query param exactly. */
export const ROOM_STATES = ["open", "recovering", "stale", "archived"] as const;
export type RoomStateFilter = (typeof ROOM_STATES)[number];

export const ROOM_STATE_LABEL: Record<RoomStateFilter, string> = {
  open: "Open",
  recovering: "Recovering",
  stale: "Stale",
  archived: "Archived",
};
