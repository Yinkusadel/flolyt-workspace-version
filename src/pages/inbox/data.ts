/**
 * Real-endpoint rebuild, 2026-09-18 — see docs/inbox/build-plan.md. The mock item array this file
 * used to hold (built from flolyt-figma-designs/New-pages-pattern/inbox/) is gone; `/inbox` now
 * reads `GET /inbox` and its detail endpoints directly (see get-inbox.ts, get-inbox-thread.ts,
 * get-inbox-approval.ts).
 *
 * `ME` and `PersonRef` stay here and stay exported — src/pages/playbooks/data.ts and
 * src/pages/business-memory/data.ts both import them as the workspace's shared "current user"
 * stand-in, unrelated to the inbox rebuild.
 */

export type PersonRef = { name: string; initials: string; team: 1 | 2 | 3 | 4 };

export const ME: PersonRef = { name: "Dana O.", initials: "D", team: 2 };

/** What the room-attach affordance (compose, thread reply, attached-room-card) renders — built
 * client-side from a real room object (`InboxThreadRoomDto`, `RoomListRowDto`), not fetched
 * pre-formatted. `roomId` drives the card's link target; omitted only for the pre-wiring
 * placeholder card in compose. */
export type AttachedRoom = { label: string; subtitle: string; roomId?: string };

export type InboxFilter = "all" | "unread" | "mentions" | "approvals" | "snoozed" | "sent";
