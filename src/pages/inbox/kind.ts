import type { GetInboxParams, InboxItemDto, InboxItemKind } from "@/services/api/inbox/get-inbox";
import type { InboxSentItemDto } from "@/services/api/inbox/get-inbox-sent";
import type { InboxThreadRoomDto } from "@/services/api/inbox/get-inbox-thread";
import type { AttachedRoom, InboxFilter } from "@/pages/inbox/data";
import { formatCompactMoney } from "@/lib/format-measured-value";

/** Builds the compact attached-room card's `{label, subtitle}` from the structured room object a
 * thread message carries — the API gives raw fields (stage/condition/currency/amount), not a
 * pre-formatted line. */
export function formatAttachedRoom(room: InboxThreadRoomDto): AttachedRoom {
  const parts = [room.stageLabel, room.conditionLabel].filter((v): v is string => Boolean(v));
  if (room.currency && room.amountAtRisk != null) {
    parts.push(`${formatCompactMoney(room.amountAtRisk, room.currency)} at risk`);
  }
  return {
    label: room.title,
    subtitle: parts.length > 0 ? parts.join(" · ") : room.status,
    roomId: room.id,
  };
}

/** UI filter (lowercase, matches the tab bar) -> real API filter (PascalCase, matches the enum
 * in docs/endpoints/inbox.md). */
export function toApiFilter(filter: InboxFilter): NonNullable<GetInboxParams["filter"]> {
  switch (filter) {
    case "unread":
      return "Unread";
    case "mentions":
      return "Mentions";
    case "approvals":
      return "Approvals";
    case "snoozed":
      return "Snoozed";
    default:
      return "All";
  }
}

/** Display label for each real inbox kind — see docs/endpoints/inbox.md. */
export const KIND_LABEL: Record<InboxItemKind, string> = {
  Proposal: "Proposal",
  Assignment: "Assignment",
  Investigation: "Investigation",
  Obligation: "Obligation",
  Finished: "Finished",
  Notification: "Notification",
  Message: "Message",
  Mention: "Mention",
};

/** Only `Message` opens a thread — `GET /inbox/threads/{sourceId}` is the only endpoint that
 * takes a plain message-thread id. `Mention` has no dedicated detail endpoint of its own, so it
 * renders through the generic notice view like the agent-authored kinds do, not as a thread. */
export function isThreadKind(kind: InboxItemKind): boolean {
  return kind === "Message";
}

export function isProposalKind(kind: InboxItemKind): boolean {
  return kind === "Proposal";
}

/** "NeedsYou" -> "Needs you" — humanizes whatever `group` value the server sends without a fixed
 * lookup table, since only "NeedsYou" is confirmed from a real example so far. */
export function groupLabel(group: string): string {
  const spaced = group.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim();
  if (!spaced) return group;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/** `GET /inbox/sent` returns its own shape (`to`/`summary`/`lastAtUtc`, no `kind`/`group`/`isRead`)
 * since a thread you started isn't a recipient-filtered `GET /inbox` row. `lastFromYou` is a
 * timestamp (when you last sent), not text — deliberately unused here rather than mistaken for a
 * preview. Reshaping the rest into an `InboxItemDto` lets a sent row reuse `ThreadView` (keyed off
 * `sourceId`/`kind: "Message"`) unchanged instead of needing its own detail view. */
export function sentItemToInboxItem(item: InboxSentItemDto): InboxItemDto {
  return {
    group: "Sent",
    kind: "Message",
    sourceId: item.threadId,
    isRead: true,
    mentionsYou: false,
    actorLabel: item.to.join(", "),
    others: item.to,
    summary: item.summary,
    context: null,
    occurredAtUtc: item.lastAtUtc,
    roomId: item.roomId,
    href: null,
    snoozedUntilUtc: null,
    eventCount: item.messageCount,
  };
}

/** `GET /inbox` items' `href` points at routes from a different/older frontend that don't exist
 * in this app (confirmed live 2026-09-18 — `/analytics`, `/customers`,
 * `/intelligence/suggested-actions` all 404 here). Maps the two known backend paths onto their
 * real equivalent here; anything else is hidden rather than linked to a dead page. */
export function resolveInboxHref(href: string | null): string | null {
  if (!href) return null;
  if (href === "/settings/billing/credits") return "/plan-and-billing";
  if (/^\/data-platform\/datasources\/[^/]+$/.test(href)) return "/data-sources?tab=connected";
  return null;
}
