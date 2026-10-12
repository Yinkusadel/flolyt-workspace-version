import * as React from "react";
import { Bot, Check, ChevronDown, Send, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ConversationReplyMode } from "@/features/ai-conversations/ai-conversation-types";
import type { RoomListAgentDto } from "@/services/api/rooms/get-rooms";

type Mode = "agents" | "people";

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

const modeKey = (conversationId: string) => `flolyt-room-thread-mode:${conversationId}`;

/** Remembered per conversation on this browser; storage can be blocked, so every access is guarded. */
function readMode(conversationId: string): Mode {
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
 * The thread's composer: a mode switcher that explains each mode, `@` to address one rostered agent, Enter to
 * send and Shift+Enter for a new line. A typed `@Name` is sent as the stored mention `@[agent:key]`.
 */
export function ThreadComposer({
  conversationId,
  agents,
  isSending,
  onSend,
}: {
  conversationId: string;
  agents: RoomListAgentDto[];
  isSending: boolean;
  onSend: (message: string, replyMode: ConversationReplyMode) => void;
}) {
  const [text, setText] = React.useState("");
  const [mode, setModeState] = React.useState<Mode>(() => readMode(conversationId));
  const [modeOpen, setModeOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => setModeState(readMode(conversationId)), [conversationId]);

  const setMode = (next: Mode) => {
    setModeState(next);
    try {
      localStorage.setItem(modeKey(conversationId), next);
    } catch {
      // Not remembered; the mode still applies to this session.
    }
  };

  // `@` at the tail of the text opens the picker over the rostered agents.
  const atMatch = /(^|\s)@([\w ]*)$/.exec(text);
  const atQuery = atMatch ? atMatch[2].toLowerCase() : null;
  const atOptions =
    atQuery === null ? [] : agents.filter((agent) => agent.displayName.toLowerCase().startsWith(atQuery));

  const pickAgent = (agent: RoomListAgentDto) => {
    setText((current) => current.replace(/@[\w ]*$/, `@${agent.displayName} `));
    setMode("agents");
    textareaRef.current?.focus();
  };

  const send = () => {
    let body = text.trim();
    if (!body || isSending) return;
    // Longest names first so "Retention analyst" is not eaten by a shorter name.
    for (const agent of [...agents].sort((a, b) => b.displayName.length - a.displayName.length)) {
      body = body.split(`@${agent.displayName}`).join(`@[agent:${agent.key}]`);
    }
    onSend(body, mode === "people" ? "none" : "auto");
    setText("");
  };

  const active = MODES.find((item) => item.value === mode) ?? MODES[0];
  const tone = MODE_TONE[mode];
  const ActiveIcon = active.Icon;

  return (
    <div className="relative">
      {atOptions.length > 0 && (
        <ul className="absolute right-0 bottom-full left-0 z-10 mb-1.5 overflow-hidden rounded-card border border-line bg-paper shadow-md">
          {atOptions.map((agent) => (
            <li key={agent.key}>
              <button
                type="button"
                onClick={() => pickAgent(agent)}
                className="flex w-full items-baseline gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-paper-2"
              >
                <span className="font-medium text-ink">{agent.displayName}</span>
                <span className="truncate text-[11px] text-ink-3">{agent.role}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("rounded-card border bg-paper transition-colors", tone.box)}>
        <textarea
          ref={textareaRef}
          value={text}
          rows={2}
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder={mode === "agents" ? "Ask the agents on this Room, or @ one" : "Write to the people in this Room"}
          className="block max-h-40 w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[13px] text-ink outline-none placeholder:text-ink-4"
        />
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
              <p className="px-2.5 pt-1.5 pb-1 text-[10.5px] text-ink-4">Remembered for this thread on this browser.</p>
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
