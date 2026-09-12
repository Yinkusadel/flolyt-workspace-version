/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/inbox/inbox/svg/01–05. Inbox is people
 * only — no agent is ever a participant in a thread. Agent activity surfaces as a "notice" row
 * (approval or plain agent update) that deep-links into the room it came from; the room ids the
 * export uses (2471, 2473, 2468…) don't correspond to any of the fully-built rooms in
 * src/pages/rooms/room/data.ts, so every "open the room" affordance here points at the Rooms
 * index rather than a specific room detail page that would show mismatched content.
 */

export type PersonRef = { name: string; initials: string; team: 1 | 2 | 3 | 4 };

export type EvidenceTier = "measured" | "corroborated" | "indicative";

export type AttachedRoom = { label: string; subtitle: string };

export type InboxMessage = { person: PersonRef; timestamp: string; text: string; attachedRoom?: AttachedRoom };

export type ApprovalDetail = {
  subtitle: string;
  whatWillHappen: string;
  atRisk: string;
  customers: string;
  evidenceLabel: string;
  evidence: { tier: EvidenceTier; text: string }[];
  objection: { person: PersonRef; body: string } | null;
};

export type ThreadItem = {
  id: string;
  kind: "thread";
  unread: boolean;
  timestamp: string;
  person: PersonRef;
  personSubtitle?: string;
  preview: string[];
  roomLabel?: string;
  thread?: InboxMessage[];
};

export type NoticeItem = {
  id: string;
  kind: "notice";
  noticeType: "approval" | "agent";
  unread: boolean;
  timestamp: string;
  title: string;
  preview: string;
  approval?: ApprovalDetail;
  /** Set only when the notice is one named agent's own update (e.g. "Repeat & Decay · Room
   * 2473") — drives the initials in its row icon. A system-level notice like "Room 2468 closed"
   * has no single agent to name, so this stays unset and the icon falls back to a glyph. */
  agentName?: string;
};

export type InboxItem = ThreadItem | NoticeItem;

export type InboxFilter = "all" | "unread" | "mentions" | "approvals";

export const ME: PersonRef = { name: "Dana O.", initials: "D", team: 2 };

const REVAN: PersonRef = { name: "Revan S.", initials: "RS", team: 1 };
const TUNDE: PersonRef = { name: "Tunde K.", initials: "TK", team: 2 };
const AMARA: PersonRef = { name: "Amara N.", initials: "AN", team: 3 };
const IFEOMA: PersonRef = { name: "Ifeoma O.", initials: "IO", team: 4 };

export const INBOX_ITEMS: InboxItem[] = [
  {
    id: "approval-2471",
    kind: "notice",
    noticeType: "approval",
    unread: true,
    timestamp: "12m",
    title: "Room 2471 needs your release",
    preview: "Hold the first-order discount through order two",
    approval: {
      subtitle: "Adoption Specialist · 12 minutes ago",
      whatWillHappen:
        "Hold the first-order discount through order two for the March cohort. 18,402 customers. Nothing sends until you release it.",
      atRisk: "₦412M",
      customers: "18,402",
      evidenceLabel: "4 findings",
      evidence: [
        { tier: "measured", text: "Delivery fee moved after the cart on 4 March" },
        { tier: "measured", text: "61% abandon the onboarding checklist at step 4" },
        { tier: "corroborated", text: "Late first orders reorder 31% less often" },
        { tier: "indicative", text: "The first-order discount is not reapplied" },
      ],
      objection: { person: REVAN, body: "It stays on the record whether you release or not." },
    },
  },
  {
    id: "thread-revan",
    kind: "thread",
    unread: true,
    timestamp: "1h",
    person: REVAN,
    personSubtitle: "Finance · usually replies within the hour",
    preview: ["I have filed the objection on 2471. The discount", "holds cost more than the orders they recover."],
    roomLabel: "Room 2471",
    thread: [
      {
        person: REVAN,
        timestamp: "1h",
        text: "I have filed the objection on 2471. The discount holds cost more than the second orders they recover, on the numbers I can see.",
        attachedRoom: {
          label: "Room 2471 · Checklist drop-off at Adopt",
          subtitle: "₦412M at risk · 4 findings · 1 objection open",
        },
      },
      {
        person: ME,
        timestamp: "52m",
        text: "Fair. The measured finding is the checkout fee though — the discount is the indicative one. Worth separating them?",
      },
      {
        person: REVAN,
        timestamp: "48m",
        text: "Agreed. I will narrow the objection to the discount leg only. Still want the holdout set before either ships.",
      },
    ],
  },
  {
    id: "notice-2473",
    kind: "notice",
    noticeType: "agent",
    unread: true,
    timestamp: "5h",
    title: "Repeat & Decay · Room 2473",
    preview: "Discount depth rose 4 points on the Lagos cohort",
    agentName: "Repeat & Decay",
  },
  {
    id: "thread-tunde",
    kind: "thread",
    unread: false,
    timestamp: "6h",
    person: TUNDE,
    preview: ["Checklist fix is in staging. Want me to hold it", "until the holdout is set?"],
    roomLabel: "Room 2471",
  },
  {
    id: "thread-amara",
    kind: "thread",
    unread: false,
    timestamp: "1d",
    person: AMARA,
    preview: ["Setup tickets are spiking again, mostly week two."],
  },
  {
    id: "thread-ifeoma",
    kind: "thread",
    unread: false,
    timestamp: "1d",
    person: IFEOMA,
    preview: ["Can you look at the Kenya numbers before Friday?"],
  },
  {
    id: "notice-2468",
    kind: "notice",
    noticeType: "agent",
    unread: false,
    timestamp: "2d",
    title: "Room 2468 closed",
    preview: "₦224,000 preserved, measured against a 10% holdout",
  },
];

export function getInboxItem(id: string | null): InboxItem | undefined {
  if (!id) return undefined;
  return INBOX_ITEMS.find((item) => item.id === id);
}

export function filterInboxItems(items: InboxItem[], filter: InboxFilter): InboxItem[] {
  if (filter === "unread") return items.filter((item) => item.unread);
  if (filter === "approvals") return items.filter((item) => item.kind === "notice" && item.noticeType === "approval");
  if (filter === "mentions") return []; // not modeled yet — Inbox has no @mention source today
  return items;
}

export function countUnread(items: InboxItem[]): number {
  return items.filter((item) => item.unread).length;
}

export function countApprovals(items: InboxItem[]): number {
  return items.filter((item) => item.kind === "notice" && item.noticeType === "approval").length;
}

export function countAgentNotices(items: InboxItem[]): number {
  return items.filter((item) => item.kind === "notice" && item.noticeType === "agent").length;
}
