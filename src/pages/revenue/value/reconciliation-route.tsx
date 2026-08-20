import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import {
  RECONCILIATION_STATE,
  VL10_KV_ROWS,
  VL10_ROWS,
  VL10_STATS,
  VL11_KV_ROWS,
  VL11_STATS,
  VL11_SURFACE_ROWS,
  VL_KPI_TONE,
  VL_TONE_CLASS,
} from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL10 — the clean (default) reconciliation state. */
function CleanReconciliationState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">₦411M here, ₦386M at Finance · every naira of the difference explained, two of them permanently</p>
      </div>

      <ValueTabs active="Reconciliation" />

      <KpiCards items={VL10_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: VL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where the two figures part company</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Difference</th>
                <th className={`${HEAD_CLASS} text-right`}>Amount</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Who is right</th>
                <th className={`${HEAD_CLASS} text-right`}>Will it close?</th>
              </tr>
            </thead>
            <tbody>
              {VL10_ROWS.map((row) => (
                <tr key={row.difference} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.difference}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.amountTone]}`}>{row.amount}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.whoIsRight}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.willCloseTone === "ok" ? "teal" : "amber"}>{row.willClose}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Two of these four are not errors and will never close, and the screen says so plainly">
        Finance answers "what may we recognise" and this ledger answers "what moved because somebody did something".
        Those are different questions with different timing, and forcing them to agree would mean one of them
        lying. What matters is that the difference is explained to the last naira every morning, and that ₦0 of it
        is unexplained.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How the reconciliation runs</p>
        <ValueKvList rows={VL10_KV_ROWS} />
      </section>
    </div>
  );
}

/** VL11 — the degraded/held state, wired but unreachable with RECONCILIATION_STATE's current default. */
function BrokenReconciliationState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">₦19M unexplained since 06:00 · the total is held, and four other surfaces are unaffected</p>
      </div>

      <ValueTabs active="Reconciliation" />

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">
          ₦19M cannot be explained this morning, so the ledger is not publishing a figure at all
        </p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          The bank settlement file arrived truncated at 06:00. Nothing is wrong with the rooms, the methods or
          yesterday's figures — this morning's total simply cannot be stood behind.
        </p>
      </div>

      <KpiCards items={VL11_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: VL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What stops and what carries on</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[700px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Surface</th>
                <th className={`${HEAD_CLASS} text-right`}>State now</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Who is told</th>
              </tr>
            </thead>
            <tbody>
              {VL11_SURFACE_ROWS.map((row) => (
                <tr key={row.surface} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.surface}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.stateTone === "ok" ? "teal" : row.stateTone === "warn" ? "amber" : "rose"}>{row.state}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Holding one number is cheaper than publishing a number that is 4.6% wrong">
        The instinct is to publish ₦411M with a footnote. A footnote on a figure is read by nobody and quoted by
        everybody, and ₦19M is larger than three of the four differences this reconciliation normally explains. The
        ledger shows yesterday's figure with yesterday's date until the file is re-sent.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is being done, and by whom</p>
        <ValueKvList rows={VL11_KV_ROWS} />
      </section>
    </div>
  );
}

/** VL10/VL11 — /value/reconciliation, branching on RECONCILIATION_STATE. VL11 is wired but unreachable with the default "clean" state. */
const ReconciliationRoute = () => {
  if (RECONCILIATION_STATE === "broken") return <BrokenReconciliationState />;
  return <CleanReconciliationState />;
};

export default ReconciliationRoute;
