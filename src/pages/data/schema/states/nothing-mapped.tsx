import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MapAFieldModal } from "@/pages/data/schema/modals/map-a-field-modal";
import { SM01_COMMIT_ROWS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM01 — before any field has been mapped. Wired but unreachable with SCHEMA_STATE's current default. */
export function NothingMappedState() {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          340 columns available · nothing mapped · mapping is a decision, not an import
        </p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been mapped yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A source delivers columns. A schema says what each one means here — which metric it feeds, which stage
          depends on it, and what happens to that stage if the column changes name tomorrow.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => setMapOpen(true)}>
            Map a field
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/data-sources")}>
            See what is available
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          340 columns are available across ten sources. Mapping is the act of deciding which of them the product
          will depend on.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What mapping a field commits you to</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}></th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={HEAD_RIGHT_CLASS}>Reversible</th>
              </tr>
            </thead>
            <tbody>
              {SM01_COMMIT_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-ink-2">{row.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="teal">{row.reversible}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The schema is where a column stops being a column and becomes a claim about the business">
        `total` is a number in a database. Mapping it to order value is a statement about what this company counts
        as revenue, which is why the mapping carries a written meaning and shows up in business memory as a
        definition. Most disagreements that look like data problems are two people using one mapped field to mean
        two things.
      </Callout>

      <MapAFieldModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
}
