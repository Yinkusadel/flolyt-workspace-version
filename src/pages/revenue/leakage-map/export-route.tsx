import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LK17_INCLUDED_ROWS, LK17_WENT_ROWS, LK_CHIP_TONE } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK17 — /leakage-map/export. */
const ExportRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Leakage map", to: "/leakage-map" }, { label: "Export" }]}
        title="Export the map"
        subtitle="Four things travel whether you want them to or not · one number does not exist"
        action={
          <Button type="button" onClick={() => toast.success("Export started")}>
            Export
          </Button>
        }
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What leaves this screen, and what is attached to it whether you want it or not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Included</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Optional?</th>
                <th className={HEAD_CLASS}>Format</th>
              </tr>
            </thead>
            <tbody>
              {LK17_INCLUDED_ROWS.map((row) => (
                <tr key={row.included} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.included}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3">
                    <Chip tone={LK_CHIP_TONE[row.optionalTone]}>{row.optional}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Four things cannot be unticked and one cannot be ticked at all">
        An export that drops the unavailable rows, the claim types or the open dispute would be a cleaner document
        and a false one — and unlike this screen, a spreadsheet in an inbox has no way to say what it left out. The
        combined total is not a setting because the number does not exist, not because it is discouraged.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where this has gone</p>
        <LeaksKvList rows={LK17_WENT_ROWS} />
      </section>
    </div>
  );
};

export default ExportRoute;
