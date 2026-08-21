import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL12_KV_ROWS, VL12_ROWS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL12 — /value/board. */
const BoardRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Value</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four things cannot be removed from the pack · two numbers cannot be added to it</p>
        </div>
        <Button type="button" size="sm" onClick={() => toast.success("Board pack built")}>
          Build the pack
        </Button>
      </div>

      <ValueTabs active="For the board" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What goes in the pack · and four things that travel whether you want them or not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Included</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Optional?</th>
                <th className={HEAD_CLASS}>Format</th>
              </tr>
            </thead>
            <tbody>
              {VL12_ROWS.map((row) => (
                <tr key={row.included} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.included}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.optional === "yes" ? "teal" : "rose"}>{row.optional}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Ravi asked for this without the identified figure and it ships with it">
        ₦411M on its own is a good quarter. ₦411M beside ₦1.08B is a different conversation, and it is the accurate
        one. The pack is not permitted to carry the recovery number alone, because a board that only ever sees the
        recovered column has no way to ask why the ratio is what it is.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where the last pack went and what has changed since</p>
        <ValueKvList rows={VL12_KV_ROWS} />
      </section>
    </div>
  );
};

export default BoardRoute;
