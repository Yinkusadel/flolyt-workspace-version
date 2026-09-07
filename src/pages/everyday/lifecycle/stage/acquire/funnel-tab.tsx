import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarTrack } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetAcquireFunnel } from "@/features/lifecycle/use-get-acquire-funnel";
// PersonAvatar / ACQUIRE_FUNNEL_ACTION_CARDS were only used by the commented-out
// "two drops worth acting on" section below — re-import both if it's ever reinstated.

// The 5 rungs are fixed by Flolyt (GET /lifecycle/acquire/funnel's own notes), not per-tenant —
// don't derive labels from the workspace's event names, those live in `matched[]` instead.
const RUNG_LABELS: Record<string, string> = {
  registered: "Registered",
  verified: "Verified",
  intent: "Intent",
  transacted: "Transacted",
  settled: "Settled",
};

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

/** A03 — Acquire's unique Funnel tab (registered to settled). */
const AcquireFunnelTab = () => {
  const { data, isLoading, isError, refetch } = useGetAcquireFunnel();
  const funnel = data?.data;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Registered to settled{funnel?.maturityDays != null ? ` · matured after ${funnel.maturityDays} days` : ""}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load the funnel.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {funnel?.rungs.map((rung) => (
              <div key={rung.rung} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[12.5px] font-semibold text-ink">{RUNG_LABELS[rung.rung] ?? rung.rung}</span>
                  {rung.customers !== null ? (
                    <span className="font-mono text-[12px] font-semibold text-ink">
                      {formatCount(rung.customers)}
                      {rung.shareOfRegistered !== null && ` · ${formatPercent(rung.shareOfRegistered)} of registered`}
                    </span>
                  ) : (
                    <InfoTooltip />
                  )}
                </div>
                <BarTrack percent={rung.customers !== null && rung.shareOfRegistered !== null ? rung.shareOfRegistered * 100 : 0} tone={rung.customers !== null ? "ultra" : "ink"} />
                {rung.customers !== null && rung.shareOfPrevious !== null && (
                  <div className="flex justify-end">
                    <span className="font-mono text-[10.5px] text-ink-4">{formatPercent(rung.shareOfPrevious)} of the rung before it</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Required by the endpoint's own notes: keyword-matched events must be shown, since a wrong
          match would otherwise silently reshape the funnel. */}
      {funnel && funnel.matched.length > 0 && (
        <section className="space-y-2">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">How your events were read</p>
          <div className="space-y-1.5 rounded-card border border-line bg-paper p-4">
            {funnel.matched.map((match) => (
              <p key={`${match.event}-${match.rung}`} className="text-[10.5px] text-ink-3">
                <span className="font-mono text-ink-2">{match.event}</span> → {RUNG_LABELS[match.rung] ?? match.rung}
                <span className="text-ink-4"> · {formatCount(match.occurrences)} events</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {funnel && funnel.unevidenced.length > 0 && (
        <Callout tone="amber" title="No event found for these rungs">
          {funnel.unevidenced.map((rung) => RUNG_LABELS[rung] ?? rung).join(", ")}
        </Callout>
      )}

      {funnel?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      {/* ❌ Backend does NOT provide: the "two drops worth acting on" action cards (agent tag,
          title, body, footnote per drop) — GET /lifecycle/acquire/funnel has no field for this;
          its callouts[] only carries headline/body, nothing shaped like these richer cards.
          Commented out rather than shown on mock data — there's no real field to hang it off of.
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The two drops worth acting on</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ACQUIRE_FUNNEL_ACTION_CARDS.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <div className="flex items-center gap-2">
                  {card.agentTag && <PersonAvatar kind="agent" initials={card.agentTag} size="sm" />}
                  <p className="font-mono text-[9px] font-medium text-ink-4">{card.meta}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p
                  className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${
                    card.footnoteTone === "rose" ? "text-rose" : "text-ink-2"
                  }`}
                >
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}
    </div>
  );
};

export default AcquireFunnelTab;
