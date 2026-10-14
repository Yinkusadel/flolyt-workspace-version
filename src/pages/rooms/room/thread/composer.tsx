import * as React from "react";
import { Bot, Check, ChevronDown, Send, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ConversationReplyMode } from "@/features/ai-conversations/ai-conversation-types";
import { useGetConversationReplyMode, useSetConversationReplyMode } from "@/features/rooms/use-conversation-reply-mode";
import { findMentions, mentionToken, type Mentionable } from "@/pages/rooms/room/thread/mentions";

type Mode = "agents" | "people";

/** A trailing line break in the highlight layer, so it is as tall as the textarea when the draft ends in a new line. */
const NEWLINE = "\n";

const toMode = (replyMode: ConversationReplyMode): Mode => (replyMode === "none" ? "people" : "agents");

const MODES: { value: Mode; label: string; sendLabel: string; explain: string; Icon: typeof Bot }[] = [
  {
    value: "agents",
    label: "Ask the agents",
    sendLabel: "Ask",
    explain: "Your message goes to an agent on this Room, who replies in the thread. @ picks which one.",
    Icon: Bot,
  },
  {
    value: "people",
    label: "Post to the people",
    sendLabel: "Post",
    explain: "A comment for the people in this Room. No agent runs and nothing is spent.",
    Icon: Users,
  },
];

/** Shown on this browser straight away; the server's saved choice replaces it once it answers. */
const modeKey = (conversationId: string) => `flolyt-room-thread-mode:${conversationId}`;

function readLocalMode(conversationId: string): Mode {
  try {
    return localStorage.getItem(modeKey(conversationId)) === "people" ? "people" : "agents";
  } catch {
    return "agents";
  }
}

const MODE_TONE: Record<Mode, { box: string; button: string; send: string }> = {
  agents: {
    box: "border-ultra-border focus-within:border-ultra",
    button: "bg-ultra-bg text-ultra",
    send: "bg-ultra text-white",
  },
  people: {
    box: "border-teal-border focus-within:border-teal",
    button: "bg-teal-bg text-teal",
    send: "bg-teal text-white",
  },
};

/**
 * The thread's composer: a mode switcher that explains each mode (the choice is saved per person per conversation,
 * `GET`/`PUT /conversations/{id}/preferences`), `@` to address an agent or a person on the Room, Enter to send and
 * Shift+Enter for a new line. A typed `@Name` is sent as the stored token (`@[agent:key]` or `@[human:userId]`);
 * every message still carries its own `replyMode`, the saved choice is only the default.
 */
export function ThreadComposer({
  conversationId,
  mentionables,
  isSending,
  onSend,
}: {
  conversationId: string;
  mentionables: Mentionable[];
  isSending: boolean;
  onSend: (message: string, replyMode: ConversationReplyMode) => void;
}) {
  const [text, setText] = React.useState("");
  const [mode, setModeState] = React.useState<Mode>(() => readLocalMode(conversationId));
  const [modeOpen, setModeOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);
  // Where the caret goes after the next render (a controlled textarea resets it when its text is replaced).
  const pendingCaret = React.useRef<number | null>(null);

  const saved = useGetConversationReplyMode(conversationId);
  const { setReplyMode } = useSetConversationReplyMode();

  // Adopt the saved choice once per conversation. A later refetch must never overwrite what the person picks since.
  const adoptedFor = React.useRef<string | null>(null);
  React.useEffect(() => {
    adoptedFor.current = null;
    setModeState(readLocalMode(conversationId));
  }, [conversationId]);
  React.useEffect(() => {
    const replyMode = saved.data?.data.replyMode;
    if (!replyMode || adoptedFor.current === conversationId) return;
    adoptedFor.current = conversationId;
    setModeState(toMode(replyMode));
  }, [saved.data, conversationId]);

  const setMode = (next: Mode) => {
    setModeState(next);
    adoptedFor.current = conversationId;
    try {
      localStorage.setItem(modeKey(conversationId), next);
    } catch {
      // Not remembered on this browser; the server copy below still is.
    }
    setReplyMode({ conversationId, replyMode: next === "people" ? "none" : "auto" });
  };

  React.useLayoutEffect(() => {
    if (pendingCaret.current === null) return;
    textareaRef.current?.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  });

  // Mentions in the draft: coloured behind the text, removed as one unit, swapped for their token on send.
  const mentions = React.useMemo(() => findMentions(text, mentionables), [text, mentionables]);
  const segments = React.useMemo(() => {
    const parts: { text: string; mention: boolean }[] = [];
    let last = 0;
    for (const range of mentions) {
      if (range.start > last) parts.push({ text: text.slice(last, range.start), mention: false });
      parts.push({ text: text.slice(range.start, range.end), mention: true });
      last = range.end;
    }
    if (last < text.length) parts.push({ text: text.slice(last), mention: false });
    return parts;
  }, [text, mentions]);

  // Backspace right after a mention (or inside one) removes all of it; Delete right before one does the same.
  const removeWholeMention = (key: "Backspace" | "Delete", caret: number) => {
    const range = mentions.find((m) => (key === "Backspace" ? m.start < caret && caret <= m.end : m.start <= caret && caret < m.end));
    if (!range) return false;
    setText(text.slice(0, range.start) + text.slice(range.end));
    pendingCaret.current = range.start;
    return true;
  };

  // `@` at the tail of the text opens the picker over the agents and people on this Room.
  const atMatch = /(^|\s)@([\w .'-]*)$/.exec(text);
  const atQuery = atMatch ? atMatch[2].toLowerCase() : null;
  const atOptions =
    atQuery === null ? [] : mentionables.filter((mention) => mention.label.toLowerCase().startsWith(atQuery)).slice(0, 8);

  const pickMention = (mention: Mentionable) => {
    setText((current) => current.replace(/@[\w .'-]*$/, `@${mention.label} `));
    // Addressing an agent means asking the agents; addressing a person leaves the mode as it is.
    if (mention.kind === "agent" && mode !== "agents") setMode("agents");
    textareaRef.current?.focus();
  };

  const send = () => {
    if (!text.trim() || isSending) return;
    // Swap each mention for its stored token, from the end so the earlier positions stay valid.
    let body = text;
    for (const range of [...mentions].reverse()) {
      body = body.slice(0, range.start) + mentionToken(range.mention) + body.slice(range.end);
    }
    onSend(body.trim(), mode === "people" ? "none" : "auto");
    setText("");
  };

  const active = MODES.find((item) => item.value === mode) ?? MODES[0];
  const tone = MODE_TONE[mode];
  const ActiveIcon = active.Icon;

  return (
    <div className="relative">
      {atOptions.length > 0 && (
        <ul className="absolute right-0 bottom-full left-0 z-10 mb-1.5 max-h-56 overflow-y-auto rounded-card border border-line bg-paper shadow-md">
          {atOptions.map((mention) => (
            <li key={`${mention.kind}:${mention.id}`}>
              <button
                type="button"
                onClick={() => pickMention(mention)}
                className="flex w-full items-baseline gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-paper-2"
              >
                <span className="font-medium text-ink">{mention.label}</span>
                <span className="truncate text-[11px] text-ink-3">{mention.kind === "agent" ? `Agent · ${mention.role}` : "Person"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("rounded-card border bg-paper transition-colors", tone.box)}>
        <div className="relative">
          {/* The coloured copy of the text sits behind the real, transparent textarea, in identical metrics, so nothing moves:
              a mention keeps its place in the sentence and is only drawn in colour. */}
          <div
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden px-3.5 pt-3 pb-1 text-[13px] leading-normal wrap-break-word whitespace-pre-wrap text-ink"
          >
            {segments.map((part, index) =>
              part.mention ? (
                <span key={index} className="font-medium text-ultra">
                  {part.text}
                </span>
              ) : (
                <React.Fragment key={index}>{part.text}</React.Fragment>
              )
            )}
            {NEWLINE}
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            rows={2}
            onChange={(event) => setText(event.currentTarget.value)}
            onScroll={(event) => {
              if (highlightRef.current) highlightRef.current.scrollTop = event.currentTarget.scrollTop;
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
                return;
              }
              if ((event.key === "Backspace" || event.key === "Delete") && !event.ctrlKey && !event.metaKey && !event.altKey) {
                const { selectionStart, selectionEnd } = event.currentTarget;
                if (selectionStart === selectionEnd && removeWholeMention(event.key, selectionStart)) event.preventDefault();
              }
            }}
            placeholder={mode === "agents" ? "Ask the agents on this Room, or @ someone" : "Write to the people in this Room"}
            className="relative block max-h-40 w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[13px] leading-normal text-transparent caret-ink outline-none placeholder:text-ink-4"
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5">
          <Popover open={modeOpen} onOpenChange={setModeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn("inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-[12px] font-medium", tone.button)}
              >
                <ActiveIcon className="size-3.5" />
                {active.label}
                <ChevronDown className="size-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-72 p-1.5">
              {MODES.map(({ value, label, explain, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setMode(value);
                    setModeOpen(false);
                  }}
                  className="flex w-full items-start gap-2.5 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-ink-3" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-ink">{label}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">{explain}</span>
                  </span>
                  {mode === value && <Check className="mt-0.5 size-4 shrink-0 text-ultra" />}
                </button>
              ))}
              <p className="px-2.5 pt-1.5 pb-1 text-[10.5px] text-ink-4">Saved for you in this thread, on every device.</p>
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onClick={send}
            disabled={!text.trim() || isSending}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-[12px] font-medium disabled:opacity-40",
              tone.send
            )}
          >
            <Send className="size-3.5" />
            {isSending ? "Sending" : active.sendLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
