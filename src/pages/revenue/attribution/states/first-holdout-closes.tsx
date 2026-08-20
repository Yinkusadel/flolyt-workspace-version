import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RAVI } from "@/pages/everyday/rooms/data";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT02_KV_ROWS, AT02_STATS, AT_KPI_TONE } from "@/pages/revenue/attribution/data";

/** AT02 — the first holdout ever to close, and the workspace's first causal figure. Wired but unreachable with ATTRIBUTION_STATE's current default. */
export function FirstHoldoutClosesState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Attribution</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One holdout closed today · ₦31M, and for the first time a number does not need "probably" next to it</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={RAVI.initials} team={4} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              The first holdout closed and produced the workspace's first causal figure
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              Discount-only buyers, nine days, 1,900 customers held back and still offered the code. Order value
              ₦8,420 treated against ₦8,100 held.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-teal">
              ₦31M, and for the first time the number does not need the word "probably" next to it.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={AT02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: AT_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What changes now that one causal figure exists</p>
        <AttributionKvList rows={AT02_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="One controlled result makes every uncontrolled one look worse, and that is the point of showing it first">
        Before today the ledger read as a single column of recoveries. From today it reads as ₦31M anybody can
        defend and a much larger figure nobody can, which is a less flattering picture of the same work. The board
        that saw the old version will see this one in August.
      </Callout>
    </div>
  );
}
