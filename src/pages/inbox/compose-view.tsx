import * as React from "react";
import { toast } from "sonner";
import { ChevronDown, MessageCircle, MessagesSquare, X } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";

export function ComposeView({ onDiscard, onSent }: { onDiscard: () => void; onSent: () => void }) {
  const [recipient, setRecipient] = React.useState<{ name: string; initials: string } | null>({
    name: "Revan S.",
    initials: "RS",
  });
  const [attachedRoom, setAttachedRoom] = React.useState<string | null>("Room 2471 · Checklist drop-off at Adopt");
  const [body, setBody] = React.useState("");

  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <p className="text-[15px] font-semibold text-ink">New message</p>
        <button type="button" onClick={onDiscard} className="text-[13px] font-medium text-ink-3 hover:text-ink">
          Discard
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-ink-2">To</p>
          <div className="flex min-h-9 flex-wrap items-center gap-2 rounded-panel border border-border bg-paper-2 px-2.5 py-1.5">
            {recipient && (
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-2 py-1">
                <PersonAvatar kind="human" initials={recipient.initials} team={1} size="sm" />
                <span className="text-[12px] font-medium text-ink">{recipient.name}</span>
                <button type="button" onClick={() => setRecipient(null)} aria-label="Remove recipient">
                  <X className="size-3 text-ink-4" />
                </button>
              </span>
            )}
            <span className="text-[12px] text-ink-4">Add a teammate…</span>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[12px] font-medium text-ink-2">About</p>
          {attachedRoom ? (
            <button
              type="button"
              onClick={() => setAttachedRoom(null)}
              className="flex h-9 w-full items-center gap-2 rounded-panel border border-border bg-paper-2 px-2.5 text-left"
            >
              <MessagesSquare className="size-3.5 shrink-0 text-ink-3" />
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink">{attachedRoom}</span>
              <ChevronDown className="size-3.5 shrink-0 text-ink-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAttachedRoom("Room 2471 · Checklist drop-off at Adopt")}
              className="flex h-9 w-full items-center rounded-panel border border-dashed border-line px-2.5 text-left text-[12px] text-ink-4"
            >
              Attach a room…
            </button>
          )}
          <p className="mt-1.5 text-[11px] text-ink-3">
            Optional. Attaching a room gives them the evidence without you pasting it.
          </p>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
          placeholder="Write your message…"
          rows={6}
          className="w-full resize-none rounded-card border border-border bg-paper px-4 py-3.5 text-[13.5px] text-ink outline-none placeholder:text-ink-4 focus-visible:border-ring"
        />

        <div className="flex items-start gap-3 rounded-card border border-line bg-paper-2 px-4 py-3.5">
          <MessageCircle className="mt-0.5 size-4 shrink-0 text-ink-3" />
          <div>
            <p className="text-[13px] font-semibold text-ink">Inbox is for people</p>
            <p className="mt-0.5 text-[11.5px] text-ink-3">To bring an agent in, open a room or start a conversation.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            disabled={!recipient || !body.trim()}
            onClick={() => {
              toast.success("Message sent");
              onSent();
            }}
          >
            Send
          </Button>
          <button
            type="button"
            onClick={() => toast.info("Draft saved")}
            className="text-[13px] font-medium text-ink-3 hover:text-ink"
          >
            Save draft
          </button>
        </div>
      </div>
    </div>
  );
}
