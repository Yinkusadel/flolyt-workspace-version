import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmojiPickerButton } from "@/components/ui/emoji-picker";
import type { InboxThreadMessageDto } from "@/services/api/inbox/get-inbox-thread";

export function EditMessageModal({
  open,
  onOpenChange,
  message,
  onSave,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: InboxThreadMessageDto;
  onSave: (body: string) => void;
  isPending: boolean;
}) {
  const [body, setBody] = React.useState(message.body);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Reset to the live text each time the modal opens — a previous unsaved edit shouldn't linger
  // if it's reopened later.
  React.useEffect(() => {
    if (open) setBody(message.body);
  }, [open, message.body]);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [body, open]);

  const trimmed = body.trim();
  const canSave = trimmed.length > 0 && trimmed !== message.body && !isPending;

  const handleSave = () => {
    if (!canSave) return;
    onSave(trimmed);
  };

  const handleInsertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart ?? body.length;
    const end = textarea.selectionEnd ?? body.length;
    setBody(body.slice(0, start) + emoji + body.slice(end));
    requestAnimationFrame(() => {
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Edit message</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-ultra px-4 py-2.5 text-[13px] leading-relaxed wrap-break-word text-paper shadow-xs">
              {message.body}
            </div>
          </div>

          <div className="flex items-end gap-2 rounded-3xl bg-ultra-bg px-4 py-2.5">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              disabled={isPending}
              rows={1}
              autoFocus
              className="max-h-32 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-[13px] text-ink outline-none disabled:opacity-60"
            />
            <EmojiPickerButton onSelect={handleInsertEmoji} className="mb-0.5" />
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              aria-label="Save changes"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-ultra text-white transition-opacity",
                !canSave && "opacity-40"
              )}
            >
              <Check className="size-4" />
            </button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
