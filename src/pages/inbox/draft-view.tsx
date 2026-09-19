import * as React from "react";
import { toast } from "sonner";
import { ChevronDown, MessageCircle, MessagesSquare } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { initialsFromName } from "@/pages/rooms/format";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import useUpdateInboxDraft from "@/features/inbox/use-update-inbox-draft";
import useSendInboxDraft from "@/features/inbox/use-send-inbox-draft";
import useDeleteInboxDraft from "@/features/inbox/use-delete-inbox-draft";
import type { InboxDraftDto } from "@/services/api/inbox/get-inbox-drafts";

/**
 * `to` on a draft comes from `POST /inbox/threads`' original `recipients` and can't be changed
 * afterward — `PUT /inbox/drafts/{messageId}` only accepts `body`/`roomId` (see
 * update-inbox-draft.ts) — so recipients render as read-only chips here, unlike `ComposeView`'s
 * editable picker.
 */
export function DraftView({ draft, onClosed }: { draft: InboxDraftDto; onClosed: () => void }) {
  const [body, setBody] = React.useState(draft.body);
  const [attachedRoomId, setAttachedRoomId] = React.useState<string | null>(draft.roomId);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    setBody(draft.body);
    setAttachedRoomId(draft.roomId);
  }, [draft.messageId, draft.body, draft.roomId]);

  const { data: roomsData, isLoading: isRoomsLoading } = useGetRooms();
  const { updateInboxDraft, isPending: isSaving } = useUpdateInboxDraft();
  const { sendInboxDraft, isPending: isSending } = useSendInboxDraft();
  const { deleteInboxDraft, isPending: isDeleting } = useDeleteInboxDraft();

  const rooms = roomsData?.data.rooms ?? [];
  const roomOptions = rooms.map((r) => ({ value: r.id, label: r.title }));
  const attachedRoom = rooms.find((r) => r.id === attachedRoomId);

  const isBusy = isSaving || isSending || isDeleting;

  const handleSaveChanges = () => {
    const trimmed = body.trim();
    // Confirmed live (compose): the backend rejects an empty body even on a draft, so this can't
    // be saved down to nothing — delete it instead if that's the intent.
    if (!trimmed || isBusy) return;
    updateInboxDraft(
      { messageId: draft.messageId, body: trimmed, roomId: attachedRoomId },
      { onSuccess: (res) => res.succeeded && toast.success("Draft saved") }
    );
  };

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed || isBusy) return;
    // Persist whatever's currently typed before sending — a draft's body/room can be edited
    // right up to the moment Send is clicked, and there's no autosave in between.
    updateInboxDraft(
      { messageId: draft.messageId, body: trimmed, roomId: attachedRoomId },
      {
        onSuccess: (updateRes) => {
          if (!updateRes.succeeded) return;
          sendInboxDraft(draft.messageId, {
            onSuccess: (sendRes) => sendRes.succeeded && onClosed(),
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteInboxDraft(draft.messageId, {
      onSuccess: (res) => {
        if (!res.succeeded) return;
        setConfirmDelete(false);
        onClosed();
      },
    });
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
        <p className="text-[15px] font-semibold text-ink">Draft</p>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={isBusy}
          className="text-[13px] font-medium text-rose hover:text-rose/80 disabled:opacity-50"
        >
          Delete draft
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl space-y-5 px-6 py-6">
          <div>
            <p className="mb-1.5 text-[12px] font-medium text-ink-2">To</p>
            <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-panel border border-border bg-paper-2 px-2.5 py-1.5">
              {draft.to.length === 0 ? (
                <span className="px-1 text-[12px] text-ink-4">No recipients</span>
              ) : (
                draft.to.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-paper py-1 pr-2.5 pl-1"
                  >
                    <PersonAvatar kind="human" initials={initialsFromName(name)} team={1} size="sm" />
                    <span className="text-[12px] font-medium text-ink">{name}</span>
                  </span>
                ))
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-ink-4">
              Recipients were set when this draft was started and can't be changed here.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ink-2">About</label>
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
          <Button type="button" variant="outline" onClick={handleSaveChanges} disabled={isBusy || !body.trim()}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" onClick={handleSend} disabled={isBusy || !body.trim() || draft.to.length === 0}>
            {isSending ? "Sending…" : "Send"}
          </Button>
        </div>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this draft?</DialogTitle>
            <DialogDescription>This can't be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex items-center gap-4">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting…" : "Delete draft"}
              </Button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
                className="text-[12px] font-semibold text-ink-3 hover:text-ink disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
