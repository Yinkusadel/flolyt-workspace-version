import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { KvList } from "@/pages/digest/kv-list";
import { DEGRADED_AFFECTED, DEGRADED_SOURCES } from "@/pages/digest/data";

/** D15 — Digest, degraded. A state of the base /digest route (confirmed by its own footer), wired but unreachable given DIGEST_DEGRADED in data.ts. */
export function DegradedState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your morning digest</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Friday 15 August · incomplete · the orders feed has not delivered since 04:12
          </p>
        </div>
        <Button variant="outline" className="shrink-0">
          See source health
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Overnight</p>

          <div className="rounded-card border-2 border-rose-border bg-rose-bg p-4">
            <h3 className="text-[13px] font-semibold text-ink">This digest is incomplete</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              The orders feed last delivered at 04:12. Anything that depends on order data is missing from this
              digest rather than shown as unchanged — which would be indistinguishable from nothing happening.
            </p>
            <p className="mt-3 border-t border-dashed border-rose-border pt-3 font-mono text-[10.5px] text-rose">
              Three agents paused · they do not guess
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-4">
            <span className="font-mono text-[9.5px] font-semibold tracking-[0.6px] text-amber uppercase">Needs you</span>
            <h3 className="mt-2 text-[13px] font-semibold text-ink">The reactivation sequence is still unapproved</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              Unaffected by the outage — this was proposed yesterday and the audience is already built.
            </p>
            <p className="mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] text-amber">
              ₦412M · still accurate
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-4">
            <span className="font-mono text-[9.5px] font-semibold tracking-[0.6px] text-rose uppercase">Unavailable</span>
            <h3 className="mt-2 text-[13px] font-semibold text-ink">Repeat rate, cohorts and second-order movement</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              All of it depends on the orders feed. It is not zero and it is not unchanged — it is unknown, and it
              will backfill when the source returns.
            </p>
            <p className="mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] text-rose">3 agents paused</p>
          </div>

          <Callout tone="rose" title="What a degraded digest refuses to do">
            Show yesterday's number as if it were today's. Fill a gap with a projection. Skip a section quietly. The
            digest arrives on time, states what is missing and names the source — because a digest that silently
            shrinks is one you stop being able to read.
          </Callout>
        </div>

        <div className="space-y-5">
          <KvList label="Sources" rows={DEGRADED_SOURCES} />
          <KvList label="Affected" rows={DEGRADED_AFFECTED} />
          <Callout tone="teal" title="Plays are not blocked">
            Approved sends continue. An outage stops Flolyt from reading, not from doing what it was already told to
            do.
          </Callout>
        </div>
      </div>
    </div>
  );
}
