import { Check } from "lucide-react";

import type { ArchivedSummary, EmptyPrompt, RecoveringSummary } from "@/pages/rooms/types";

/** Screen 32 (empty / recovering / archived) — see flolyt-kit-122/32-room-empty-recovering-archived.svg. */
export function RoomEmptyState({ prompts }: { prompts: EmptyPrompt[] }) {
  return (
    <div className="mx-auto max-w-md py-14">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Empty</p>
      <h2 className="mt-2 text-[15px] font-semibold text-ink">Nothing has been decided here yet.</h2>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">
        Rooms start from a question, not a dashboard. Ask why something moved and the agents bring the evidence.
      </p>
      <div className="mt-6 space-y-2.5">
        {prompts.map((prompt) => (
          <button
            key={prompt.question}
            type="button"
            className="w-full rounded-panel border border-line bg-paper px-3.5 py-2.5 text-left transition-colors hover:border-ink-4"
          >
            <p className="text-[11.5px] text-ink-2">{prompt.question}</p>
            <p className="mt-1 font-mono text-[9px] text-ink-4">{prompt.meta}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RoomRecoveringState({ summary }: { summary: RecoveringSummary }) {
  return (
    <div className="mx-auto max-w-md py-14">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Recovering</p>
      <h2 className="mt-2 text-[15px] font-semibold text-ink">Reconnected. Catching up on this run.</h2>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">
        The connection dropped at {summary.droppedAt}. The run kept going without it — it lives on the server, not
        in this tab.
      </p>
      <div className="mt-6 rounded-card border border-teal-border bg-teal-bg p-4">
        <p className="text-[11.5px] font-semibold text-ink">Nothing was lost.</p>
        <ul className="mt-2 space-y-1">
          {summary.inventory.map((line) => (
            <li key={line} className="text-[11px] text-ink-2">
              · {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-panel border border-line bg-paper px-3.5 py-2.5">
        <span className="size-2 shrink-0 rounded-full bg-teal" aria-hidden />
        <span className="text-[11.5px] font-semibold text-ink">Catching up</span>
        <span className="ml-auto font-mono text-[9.5px] text-ink-4">every 3s</span>
      </div>
    </div>
  );
}

export function RoomArchivedState({ summary }: { summary: ArchivedSummary }) {
  return (
    <div className="mx-auto max-w-md py-14">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Archived · read-only</p>
      <h2 className="mt-2 text-[15px] font-semibold text-ink">{summary.headline}</h2>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">{summary.body}</p>
      <div className="mt-6 flex items-start gap-2.5 rounded-card border border-teal-border bg-teal-bg p-4">
        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-teal text-white">
          <Check className="size-2.5" />
        </span>
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{summary.outcome.headline}</p>
          <p className="mt-1 text-[11.5px] text-ink-2">{summary.outcome.detail}</p>
        </div>
      </div>
      <div className="mt-3 rounded-card border border-dashed border-ultra-border bg-ultra-bg p-4">
        <p className="text-[11.5px] text-ink-2">{summary.memory.body}</p>
        <p className="mt-2 font-mono text-[9px] text-ultra">{summary.memory.meta}</p>
      </div>
    </div>
  );
}
