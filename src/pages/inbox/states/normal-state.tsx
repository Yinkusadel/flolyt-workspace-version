import * as React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { AgentDot, PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { BulkSelectionPanel } from "@/pages/inbox/bulk-selection-panel";
import { InboxSettingsLink, InboxTabs } from "@/pages/inbox/quick-links";
import { DECISION_CARDS, MENTIONS, NEVER_APPEAR_CALLOUT, SYSTEMS_CALLOUT } from "@/pages/inbox/data";

const ROOM_LINKS: Record<string, string> = {
  "Second order never happened": "second-order-never-happened",
  "Cards failing on renewal night": "cards-failing-on-renewal-night",
};

/** I02 — Your inbox, the default populated state at /inbox. */
export function NormalState() {
  const [selectMode, setSelectMode] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  if (selected.size > 0) {
    return <BulkSelectionPanel count={selected.size} onClear={clearSelection} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your inbox</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {DECISION_CARDS.length} need a decision · sorted by what stops work, not by time
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:shrink-0 sm:justify-end">
          <button
            type="button"
            onClick={() => setSelectMode((v) => !v)}
            className={cn(
              "rounded-panel border px-3 py-1.5 text-[11.5px] font-medium",
              selectMode ? "border-ultra-border bg-ultra-bg text-ultra" : "border-line bg-paper text-ink-2 hover:border-ink-4"
            )}
          >
            {selectMode ? "Selecting…" : "Select"}
          </button>
          <button
            type="button"
            onClick={() => toast.success("All caught up")}
            className="rounded-panel bg-ink px-3.5 py-1.5 text-[11.5px] font-medium text-paper hover:bg-ink/90"
          >
            Mark all read
          </button>
          <InboxSettingsLink />
        </div>
      </div>

      <InboxTabs />

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Needs a decision from you · {DECISION_CARDS.length}
          </p>
          <Link to="/inbox?group=cost" className="shrink-0 text-[11px] font-medium text-ultra hover:underline">
            Group by cost →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {DECISION_CARDS.map((card) => (
            <div key={card.itemId} className="relative rounded-card border border-amber-border bg-paper p-4">
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(card.itemId)}
                  onChange={() => toggle(card.itemId)}
                  className="absolute top-4 right-4 size-3.5 accent-ultra"
                  aria-label={`Select ${card.title}`}
                />
              )}
              <span className="flex items-center gap-1.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ink-4 uppercase">
                {card.agent && <AgentDot agent={card.agent} size="sm" />}
                {card.waitingLabel}
              </span>
              <h3 className="mt-2 pr-6 text-[13.5px] font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              <Link
                to={`/inbox/${card.itemId}`}
                className={cn(
                  "mt-3 block border-t border-dashed border-line pt-3 font-mono text-[10.5px] font-semibold hover:underline",
                  TONE_TEXT_CLASS[card.footnoteTone]
                )}
              >
                {card.footnote}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Someone mentioned you · {MENTIONS.length}
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Who</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">What they said</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Where</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">When</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {MENTIONS.map((row, i) => {
                const mentionId = `mention-${i}`;
                const roomId = ROOM_LINKS[row.room];
                return (
                  <tr key={mentionId} className="border-b border-line last:border-0">
                    {selectMode && (
                      <td className="w-8 py-3 pl-4">
                        <input
                          type="checkbox"
                          checked={selected.has(mentionId)}
                          onChange={() => toggle(mentionId)}
                          className="size-3.5 accent-ultra"
                          aria-label={`Select mention from ${row.person.name}`}
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold text-ink-2 whitespace-nowrap">
                        <PersonDot person={row.person} size="sm" />
                        {row.person.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-2">{row.quote}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-3">{row.room}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-4">{row.when}</td>
                    <td className="px-4 py-3 text-right">
                      {roomId ? (
                        <Link
                          to={`/rooms/${roomId}`}
                          className="inline-flex shrink-0 items-center rounded-chip border border-ultra-border bg-ultra-bg px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap text-ultra ring-1 ring-current/15 transition-shadow hover:ring-2 hover:ring-current/40"
                        >
                          reply
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Systems · 1</p>
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-card border border-rose-border bg-rose-bg p-4">
            <h3 className="text-[13px] font-semibold text-ink">{SYSTEMS_CALLOUT.title}</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{SYSTEMS_CALLOUT.body}</p>
          </div>
          <div className="rounded-card border border-line bg-paper-2 p-4">
            <h3 className="text-[13px] font-semibold text-ink">{NEVER_APPEAR_CALLOUT.title}</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{NEVER_APPEAR_CALLOUT.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
