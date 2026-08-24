import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { DataSourcesTabs } from "@/pages/data/data-sources/tabs";
import { DisconnectASourceModal } from "@/pages/data/data-sources/modals/disconnect-a-source-modal";
import { DS03_SOURCE_ROWS, DS03_STATS, DS_CHIP_TONE, DS_KPI_TONE, DS_TONE_CLASS, type SourceRow } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function StateCell({ row, onDisconnect }: { row: SourceRow; onDisconnect: () => void }) {
  if (row.rowAction === "disconnect") {
    return (
      <button type="button" onClick={onDisconnect}>
        <Chip tone={DS_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={DS_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

/** DS03 — the default populated "Connected" state, and the /data-sources tab bar's home tab. */
export function AllConnectedState() {
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Ten connected, eight delivering · one has carried nothing for a year
          </p>
        </div>
        <Button type="button" asChild>
          <Link to="/data-sources/new">Connect a source</Link>
        </Button>
      </div>

      <DataSourcesTabs active="Connected" />

      <KpiCards items={DS03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: DS_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every source · what it carries and what it is doing</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>What it carries</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Rows</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Freshness</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Fields</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {DS03_SOURCE_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap">
                    <Link to={`/data-sources/${row.id}`} className="text-ultra hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.carries}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DS_TONE_CLASS[row.rowsTone])}>{row.rows}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DS_TONE_CLASS[row.freshTone])}>{row.fresh}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", DS_TONE_CLASS[row.fieldsTone])}>{row.fields}</td>
                  <td className="px-4 py-3">
                    <StateCell row={row} onDisconnect={() => setDisconnectOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {DS03_SOURCE_ROWS.map((row) => (
            <Link
              key={row.id}
              to={`/data-sources/${row.id}`}
              className="block rounded-card border border-line bg-paper p-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[12.5px] font-semibold text-ultra">{row.name}</span>
                <span className={cn("font-mono text-[11px] font-semibold", DS_TONE_CLASS[row.freshTone])}>{row.fresh}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.carries}</p>
              <div className="mt-1.5">
                <Chip tone={DS_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout tone="rose" title="The last row has been connected for a year and has never delivered a single row">
        `loyalty_events` was wired up in August 2024 and the events were never fired by the app. It reads as
        connected on every dashboard that counts connections, which is why the state here says connected, empty
        rather than healthy — a source that exists and carries nothing is more misleading than one that is missing.
      </Callout>

      <Callout tone="ultra" title="Ninety-four fields of three hundred and forty, and that is a design decision made ten times">
        Every one of these connections took the fields something needed and left the rest. It costs a little more
        work each time and produces a governance table that fits on one screen, an agent access list that means
        something, and eleven months later a set of blocked figures that name exactly which field would unblock
        them.
      </Callout>

      <DisconnectASourceModal open={disconnectOpen} onOpenChange={setDisconnectOpen} />
    </div>
  );
}
