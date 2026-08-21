import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AMARA } from "@/pages/everyday/rooms/data";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { VL02_KV_ROWS, VL02_STATS, VL_KPI_TONE } from "@/pages/revenue/value/data";

/** VL02 — the first room ever closed, and it is unmeasurable. Wired but unreachable with VALUE_STATE's current default. */
export function TheFirstRecoveryState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One room closed · ₦9M returned · unmeasurable, and in the ledger anyway</p>
      </div>

      <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={AMARA.initials} team={3} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              Amara closed the first room, and it goes in with no number beside it
            </p>
            <p className="mt-1.5 text-[11px] text-ink-2">
              3,100 Lagos orders failed on the new fee. Every one was refunded, the driver app was fixed, and ₦9M
              went back to customers who had already paid it.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-teal">
              310 people could have been held back to measure the other 3,100. She refused, on the day, in writing.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={VL02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: VL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The first entry sets what this ledger is for</p>
        <ValueKvList rows={VL02_KV_ROWS} />
      </section>

      <Callout tone="ultra" title="Starting this ledger with an unmeasurable row was an accident and it turned out to be the right shape">
        The first thing in the book is money that came back and cannot be proven to be ours. Every screen after
        this one inherits that: two columns, always, and the harder one never hidden behind the easier one.
      </Callout>
    </div>
  );
}
