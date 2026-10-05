import * as React from "react";
import { toast } from "sonner";
import { ChevronDown, MessagesSquare, MessageCircle, X } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { initialsFromName } from "@/pages/rooms/format";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import useCreateInboxThread from "@/features/inbox/use-create-inbox-thread";

/**
 * Real `POST /inbox/threads` is multi-recipient by design ("a message addressed to three people
 * is one conversation all three are in, not three threads" — docs/endpoints/inbox.md), unlike the
 * old mock's single-recipient slot. Draft-saving (`asDraft: true`) re-added once `GET
 * /inbox/drafts` resolved the "no way to list your own drafts" gap — see `DraftView` for editing
 * a saved draft afterward.
 */
export function ComposeView({ onDiscard, onSent }: { onDiscard: () => void; onSent: () => void }) {
  const [recipients, setRecipients] = React.useState<{ ref: string; name: string }[]>([]);
  const [attachedRoomId, setAttachedRoomId] = React.useState<string | null>(null);
  const [body, setBody] = React.useState("");
  const [pendingAction, setPendingAction] = React.useState<"send" | "draft" | null>(null);

  const { members, isLoading: isMembersLoading } = useGetWorkspaceMembers();
  const { data: roomsData, isLoading: isRoomsLoading } = useGetRooms();
  const { createInboxThread, isPending } = useCreateInboxThread();

  const recipientRefs = new Set(recipients.map((r) => r.ref));
  const memberOptions = members
    .filter((m) => m.kind === "Human" && m.isActive && !recipientRefs.has(m.ref))
    .map((m) => ({ value: m.ref, label: m.displayName }));

  const rooms = roomsData?.data.rooms ?? [];
  const roomOptions = rooms.map((r) => ({ value: r.id, label: r.title }));
  const attachedRoom = rooms.find((r) => r.id === attachedRoomId);

  const addRecipient = (ref: string) => {
    const member = members.find((m) => m.ref === ref);
    if (!member) return;
    setRecipients((prev) => [...prev, { ref, name: member.displayName }]);
  };

  const removeRecipient = (ref: string) => {
    setRecipients((prev) => prev.filter((r) => r.ref !== ref));
  };

  const handleSend = () => {
    const trimmed = body.trim();
    if (recipients.length === 0 || !trimmed || isPending) return;

    setPendingAction("send");
    createInboxThread(
      { recipients: recipients.map((r) => r.ref), body: trimmed, asDraft: false, roomId: attachedRoomId },
      { onSuccess: (res) => res.succeeded && onSent() }
    );
  };

  const handleSaveDraft = () => {
    const trimmed = body.trim();
    // Confirmed live: the backend rejects an empty body even with `asDraft: true` ("A message
    // needs something in it."), so a draft needs the same recipient + body requirements as Send.
    if (recipients.length === 0 || !trimmed || isPending) return;

    setPendingAction("draft");
    createInboxThread(
      { recipients: recipients.map((r) => r.ref), body: trimmed, asDraft: true, roomId: attachedRoomId },
      {
        onSuccess: (res) => {
          if (!res.succeeded) return;
          toast.success("Draft saved");
          onSent();
        },
      }
    );
  };

  const canSend = recipients.length > 0 && !!body.trim() && !isPending;
  const canSaveDraft = recipients.length > 0 && !!body.trim() && !isPending;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
        <p className="text-[15px] font-semibold text-ink">New message</p>
        <button type="button" onClick={onDiscard} className="text-[13px] font-medium text-ink-3 hover:text-ink">
          Discard
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl space-y-5 px-6 py-6">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ink-2">To</label>
            <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-panel border border-border bg-paper px-2.5 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              {recipients.map((r) => (
                <span
                  key={r.ref}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-paper-2 py-1 pr-1.5 pl-1"
                >
                  <PersonAvatar kind="human" initials={initialsFromName(r.name)} team={1} size="sm" />
                  <span className="text-[12px] font-medium text-ink">{r.name}</span>
                  <button
                    type="button"
                    onClick={() => removeRecipient(r.ref)}
                    aria-label={`Remove ${r.name}`}
                    className="text-ink-4 hover:text-ink-2"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {isMembersLoading ? (
                <span className="px-1 text-[12px] text-ink-4">Loading teammates…</span>
              ) : (
                <SearchableSelect
                  options={memberOptions}
                  value={null}
                  onChange={addRecipient}
                  placeholder="Add a teammate…"
                  searchPlaceholder="Search teammates…"
                  className="h-7 min-w-35 flex-1 border-none bg-transparent px-1 focus-visible:ring-0"
                />
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-baseline gap-1.5 text-[12px] font-medium text-ink-2">
              About
              <span className="text-[11px] font-normal text-ink-4">Optional — attaches the evidence for you</span>
            </label>
            {isRoomsLoading ? (
              <SearchableSelectSkeleton />
            ) : attachedRoom ? (
              <button
                type="button"
                onClick={() => setAttachedRoomId(null)}
                className="flex h-9 w-full items-center gap-2 rounded-panel border border-border bg-paper px-2.5 text-left transition-colors hover:border-ink-4"
              >
                <MessagesSquare className="size-3.5 shrink-0 text-ink-3" />
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink">
                  {attachedRoom.title}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-ink-4" />
              </button>
            ) : (
              <SearchableSelect
                options={roomOptions}
                value={null}
                onChange={setAttachedRoomId}
                placeholder="Attach a room…"
                searchPlaceholder="Search rooms…"
                className="bg-paper"
              />
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ink-2">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.currentTarget.value)}
              placeholder="Write your message…"
              rows={7}
              className="w-full resize-none rounded-panel border border-border bg-paper px-3.5 py-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line px-6 py-3.5">
        <p className="flex min-w-0 items-center gap-1.5 text-[11.5px] text-ink-4">
          <MessageCircle className="size-3.5 shrink-0" />
          <span className="truncate">Inbox is for people — bring an agent in via a room instead.</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" disabled={!canSaveDraft} onClick={handleSaveDraft}>
            {isPending && pendingAction === "draft" ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" disabled={!canSend} onClick={handleSend}>
            {isPending && pendingAction === "send" ? "Sending…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
