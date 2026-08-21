import { cn } from "@/lib/utils";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PersonAvatar } from "@/components/person-avatar";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LK05_GHANA_ROWS, LK05_MARKET_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK05 — /leakage-map?by=market. */
export function ByMarketState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Four markets, four currencies · Nigeria worst at Retain, Ghana worst in nine of ten stages, the UK still at zero
        </p>
      </div>

      <LeaksTabs active="By market" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Four markets, four currencies, and no row that adds them up</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Market</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Base</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Realised</th>
                <th className={HEAD_CLASS}>Worst stage</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Stages worse than NG</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Fee shipped</th>
                <th className={HEAD_CLASS}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {LK05_MARKET_ROWS.map((row) => (
                <tr key={row.market} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.market}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.base}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.realisedTone]}`}>{row.realised}</td>
                  <td className="px-4 py-3 text-ink-2">{row.worstStage}</td>
                  <td className={`px-4 py-3 text-right ${LK_TONE_CLASS[row.worseThanNgTone]}`}>{row.worseThanNg}</td>
                  <td className={`px-4 py-3 text-right ${LK_TONE_CLASS[row.feeShippedTone]}`}>{row.feeShipped}</td>
                  <td className="px-4 py-3">
                    {row.owner ? (
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                        <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.owner.department] }} />
                        {row.owner.name.split(" ")[0]}
                      </span>
                    ) : (
                      <Chip tone="rose">nobody</Chip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The UK is the control group and nobody designed it that way">
        The fee never shipped to 269,000 British customers, for a reason nobody recorded — a release-flag default,
        most likely. Every causal claim on this map leans on that accident. It is the strongest evidence in the
        workspace and it exists because of an oversight, which is worth knowing before anyone treats the causal
        chips as settled.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Ghana · worst in nine of ten stages and the fee has not arrived yet</p>
        <LeaksKvList rows={LK05_GHANA_ROWS} />
      </section>

      <Callout tone="amber" title="Nine of ten does not mean Ghana is nine times worse">
        It means Ghana is smaller, later and less instrumented, and small denominators move further on less. The
        figure is shown as a count of stages rather than a severity score for exactly that reason — a composite
        “market health” number would rank Ghana bottom and explain nothing about why.
      </Callout>
    </div>
  );
}
