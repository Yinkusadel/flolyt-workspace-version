import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { MapAFieldModal } from "@/pages/everyday/lifecycle/stage/modals/map-a-field-modal";
import {
  ACQUIRE_MAP_FIELD_PRESET,
  ACQUIRE_UNIT_ECON_KPIS,
  ACQUIRE_UNIT_ECON_ROWS,
  ACQUIRE_UNIT_ECON_UNLOCK_ROWS,
  type UnitEconRow,
} from "@/pages/everyday/lifecycle/stage/acquire/data";

const TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const UNLOCK_TONE_CLASS: Record<"teal" | "amber" | "neutral", string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-2" };

const COLUMNS: Column<UnitEconRow>[] = [
  { key: "channel", header: "Channel", render: (row) => <span className="font-semibold text-ink-2">{row.channel}</span> },
  { key: "cac", header: "CAC", align: "right", render: (row) => <span className={TONE_CLASS[row.cacTone]}>{row.cac}</span> },
  { key: "revenuePerCustomer", header: "Revenue / customer", align: "right", render: (row) => <span className="font-mono text-ink">{row.revenuePerCustomer}</span> },
  { key: "ratio", header: "Ratio", align: "right", render: (row) => <span className={TONE_CLASS[row.ratioTone]}>{row.ratio}</span> },
  { key: "contributionMargin", header: "Contribution margin", align: "right", render: () => <span className="font-mono text-ink-4">Unavailable</span> },
  { key: "truePayback", header: "True payback", align: "right", render: () => <span className="font-mono text-ink-4">Unavailable</span> },
];

/** A07 — Acquire's unique Unit economics tab. */
const AcquireUnitEconomicsTab = () => {
  const [mapFieldOpen, setMapFieldOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          CAC and revenue per customer · payback is unavailable and says why
        </p>
        <Button type="button" size="sm" className="shrink-0" onClick={() => setMapFieldOpen(true)}>
          Connect a COGS source
        </Button>
      </div>

      <KpiCards items={ACQUIRE_UNIT_ECON_KPIS} />

      <Callout tone="amber" title="Every figure on this screen is revenue, not margin, and that is a limitation not a choice">
        Payback and true unit economics need cost of goods, which no connected source provides. Flolyt could
        estimate it from a category benchmark. It will not — a payback period built on a guessed margin is the
        kind of number that gets quoted in a board deck for two years.
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is available, by channel
        </p>
        <DataTable columns={COLUMNS} rows={ACQUIRE_UNIT_ECON_ROWS} />
      </section>

      <section className="space-y-1">
        <p className="pb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What connecting a COGS source would unlock
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {ACQUIRE_UNIT_ECON_UNLOCK_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${UNLOCK_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <MapAFieldModal
        metricLabel="Payback"
        preset={ACQUIRE_MAP_FIELD_PRESET}
        open={mapFieldOpen}
        onOpenChange={setMapFieldOpen}
      />
    </div>
  );
};

export default AcquireUnitEconomicsTab;
