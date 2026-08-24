import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { SchemaTabs } from "@/pages/data/schema/tabs";
import { MapAFieldModal } from "@/pages/data/schema/modals/map-a-field-modal";
import { SM03_FIELD_ROWS, SM03_STATS, SM_CHIP_TONE, SM_KPI_TONE, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM03 — the default populated "Fields" state, and the /schema tab bar's home tab. */
export function FieldsState() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">94 mapped fields · 23 without a written meaning · one personal</p>
        </div>
        <Button type="button" onClick={() => setMapOpen(true)}>
          Map a field
        </Button>
      </div>

      <SchemaTabs active="Fields" />

      <KpiCards items={SM03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Mapped fields · what each means and what depends on it</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What it means here</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Type</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Depends on it</th>
                <th className={HEAD_CLASS}>Meaning</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {SM03_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap">
                    <Link to={`/schema/${row.slug}`} className="text-ultra hover:underline">
                      {row.field}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.type}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", SM_TONE_CLASS[row.dependentsTone])}>{row.dependents}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SM_CHIP_TONE[row.meaningStateTone]}>{row.meaningState}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={SM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {SM03_FIELD_ROWS.map((row) => (
            <Link
              key={row.field}
              to={`/schema/${row.slug}`}
              className="block rounded-card border border-line bg-paper p-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[12.5px] font-semibold text-ultra">{row.field}</span>
                <span className={cn("font-mono text-[11px] font-semibold", SM_TONE_CLASS[row.dependentsTone])}>{row.dependents} deps</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.meaning}</p>
              <div className="mt-1.5 flex gap-1.5">
                <Chip tone={SM_CHIP_TONE[row.meaningStateTone]}>{row.meaningState}</Chip>
                <Chip tone={SM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="rose" title="Twenty-three mapped fields have no written meaning and seven metrics depend on them">
        `orders.discount_code` feeds discount attachment, discount dependence and three price figures, and nobody
        has written down whether a code applied automatically at checkout counts as one. Two teams currently answer
        that differently, and both are reading the same number.
      </Callout>

      <Callout tone="ultra" title="The two timestamps are the most depended-upon fields in the workspace">
        Forty metrics rest on `orders.created_at` and `customers.created_at`. Both have a written meaning that
        distinguishes them from a plausible alternative — placed rather than dispatched, account creation rather
        than first purchase — and both distinctions have caused an argument at least once.
      </Callout>

      <MapAFieldModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
}
