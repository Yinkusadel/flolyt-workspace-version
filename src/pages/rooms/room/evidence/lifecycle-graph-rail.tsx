import { cn } from "@/lib/utils";
import type { SignalSource, TimelineEvent } from "@/pages/rooms/types";

const TONE_CLASS: Record<SignalSource["tone"], string> = {
  ultra: "bg-ultra-border",
  rose: "bg-rose-border",
  neutral: "bg-line",
};

function SignalSparkline({ bars, tone }: { bars: number[]; tone: SignalSource["tone"] }) {
  return (
    <div className="flex h-6 items-end gap-1">
      {bars.map((value, i) => (
        <div
          key={i}
          className={cn("w-3.5 rounded-[1px]", TONE_CLASS[tone])}
          style={{ height: `${Math.max(8, value * 100)}%` }}
        />
      ))}
    </div>
  );
}

/** Screens 29/31 left rail — "CUSTOMER LIFECYCLE GRAPH". */
export function LifecycleGraphRail({
  signals,
  timeline,
  className,
}: {
  signals: SignalSource[];
  timeline?: TimelineEvent[];
  className?: string;
}) {
  return (
    <div className={cn("h-full min-h-0 overflow-y-auto bg-paper-2", className)}>
      <div className="flex items-baseline justify-between border-b border-line px-3.5 py-3">
        <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">CUSTOMER LIFECYCLE GRAPH</p>
        <p className="font-mono text-[9.5px] text-ink-4">{signals.length} sources</p>
      </div>
      <div className="divide-y divide-line">
        {signals.map((signal) => (
          <div key={signal.name} className="px-3.5 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11.5px] font-semibold text-ink">{signal.name}</span>
              {signal.notConnected ? (
                <span className="rounded-chip border border-amber-border bg-amber-bg px-1.5 py-0.5 text-[9.5px] font-semibold text-amber">
                  Not connected
                </span>
              ) : (
                <span className="font-mono text-[9.5px] text-ink-4">{signal.meta}</span>
              )}
            </div>
            {signal.notConnected ? (
              signal.note && <p className="mt-1.5 text-[11px] leading-snug text-ink-3">{signal.note}</p>
            ) : (
              <div className="mt-2">
                <SignalSparkline bars={signal.bars} tone={signal.tone} />
              </div>
            )}
          </div>
        ))}
      </div>

      {timeline && timeline.length > 0 && (
        <div className="border-t border-line px-3.5 py-3">
          <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">RECENT EVENTS</p>
          <div className="mt-3 space-y-3">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-10 shrink-0 font-mono text-[9.5px] text-ink-4">{event.time}</span>
                <p className="text-[11px] leading-snug text-ink-2">{event.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
