import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { VL18_KV_ROWS, VL18_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL18 — /value/rates. */
const RatesRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Value", to: "/value" }, { label: "Exchange rates" }]}
        title="Exchange rates"
        subtitle="Used in one place, labelled indicative, and in no calculation anywhere"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every place a rate is used in this workspace</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Where</th>
                <th className={HEAD_CLASS}>What for</th>
                <th className={`${HEAD_CLASS} text-right`}>Rate</th>
                <th className={`${HEAD_CLASS} text-right`}>Date</th>
                <th className={`${HEAD_CLASS} text-right`}>Marked as indicative?</th>
              </tr>
            </thead>
            <tbody>
              {VL18_ROWS.map((row) => (
                <tr key={row.where} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.where}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whatFor}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.rateTone]}`}>{row.rate}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.date}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.indicativeTone === "ok" ? "teal" : "amber"}>{row.indicative}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="One rate, one place, and it is labelled indicative in the only spot it appears">
        The sidebar shows a single figure because people need a rough sense of scale when they open the app. It is
        never the number in a table, never in an export, and never the basis of a calculation. Everything else in
        this section stays in the currency the money was actually in.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why historical conversion is not offered at all</p>
        <ValueKvList rows={VL18_KV_ROWS} />
      </section>
    </div>
  );
};

export default RatesRoute;
