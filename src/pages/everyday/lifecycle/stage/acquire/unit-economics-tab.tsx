import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { MapAFieldModal } from "@/pages/everyday/lifecycle/stage/modals/map-a-field-modal";
import { Sparkline } from "@/pages/everyday/lifecycle/stage/sparkline";
import { formatCompactMoney } from "@/pages/everyday/lifecycle/format-measured-value";
import { ACQUIRE_MAP_FIELD_PRESET } from "@/pages/everyday/lifecycle/stage/acquire/data";
import { useGetAcquireUnitEconomics } from "@/features/lifecycle/use-get-acquire-unit-economics";
import type { UnitEconomicsCohortDto } from "@/services/api/lifecycle/get-acquire-unit-economics";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type CohortRow = UnitEconomicsCohortDto & { id: string };

function CohortCurve({ row, hasMargin }: { row: CohortRow; hasMargin: boolean }) {
  return (
    <Sparkline
      series={[
        { points: row.points.map((p) => ({ x: p.month, y: p.cumulativeRevenue })), toneClass: "stroke-teal" },
        ...(hasMargin ? [{ points: row.points.map((p) => ({ x: p.month, y: p.cumulativeMargin })), toneClass: "stroke-amber" }] : []),
      ]}
      referenceLines={row.acquisitionCost !== null ? [{ y: row.acquisitionCost }] : []}
    />
  );
}

function paybackCell(month: number | null) {
  return month !== null ? (
    <span className="font-mono text-teal">Month {month}</span>
  ) : (
    <span className="font-mono text-amber">Not yet crossed</span>
  );
}

function buildColumns(hasMargin: boolean): Column<CohortRow>[] {
  const columns: Column<CohortRow>[] = [
    {
      key: "cohort",
      header: "Cohort",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink-2">{row.cohort}</p>
          <p className="mt-0.5 font-mono text-[10px] text-ink-4">
            {row.customers.toLocaleString("en-US")} customers · {row.monthsObserved}mo observed
          </p>
        </div>
      ),
    },
    {
      key: "acquisitionCost",
      header: "Acquisition cost",
      align: "right",
      render: (row) => (
        <span className="font-mono text-ink">
          {row.acquisitionCost !== null ? formatCompactMoney(row.acquisitionCost, row.currency) : <span className="text-ink-4">Unavailable</span>}
        </span>
      ),
    },
    { key: "revenuePayback", header: "Revenue payback", align: "right", render: (row) => paybackCell(row.revenuePaybackMonth) },
  ];

  if (hasMargin) {
    columns.push({ key: "marginPayback", header: "Margin payback", align: "right", render: (row) => paybackCell(row.marginPaybackMonth) });
  }

  columns.push({
    key: "curve",
    header: "Revenue" + (hasMargin ? " / margin" : ""),
    align: "right",
    render: (row) => <CohortCurve row={row} hasMargin={hasMargin} />,
  });

  return columns;
}

function UnitEconomicsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
      ))}
    </div>
  );
}

/** A07 — Acquire's own Unit economics tab, wired to GET /lifecycle/acquire/unit-economics. */
const AcquireUnitEconomicsTab = () => {
  const [mapFieldOpen, setMapFieldOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetAcquireUnitEconomics();
  const econ = data?.data;
  const hasMargin = econ?.hasMargin ?? false;
  const rows: CohortRow[] = (econ?.cohorts ?? []).map((cohort) => ({ ...cohort, id: cohort.cohort }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Cost to acquire against what a customer returns, as a curve per cohort
          {econ?.monthsObserved ? ` · ${econ.monthsObserved} months observed` : ""}
        </p>
        {!hasMargin && !isLoading && (
          <Button type="button" size="sm" className="shrink-0" onClick={() => setMapFieldOpen(true)}>
            Connect a COGS source
          </Button>
        )}
      </div>

      {!isLoading && !isError && !hasMargin && (
        <Callout tone="amber" title="Every figure below is revenue, not margin, and that is a limitation not a choice">
          Margin payback needs cost of goods, which no connected source currently maps. Flolyt could estimate it from a
          category benchmark. It will not — a payback period built on a guessed margin is the kind of number that gets
          quoted in a board deck for two years.
        </Callout>
      )}

      {!isLoading && !isError && hasMargin && econ && econ.costComponents.length > 0 && (
        <p className="text-[11px] text-ink-3">Margin includes: {econ.costComponents.join(", ")}.</p>
      )}

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Cohorts, oldest observed first</p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load Acquire's unit economics.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <UnitEconomicsSkeleton />
        ) : (
          <DataTable
            columns={buildColumns(hasMargin)}
            rows={rows}
            emptyTitle="No cohorts measured yet"
            emptyBody="Per-cohort acquisition cost and payback will appear here once Flolyt has enough history to curve them."
          />
        )}
      </section>

      {/* ❌ Backend does NOT provide: a per-channel breakdown (CAC / revenue per customer / ratio
          by channel) — this endpoint has no channel dimension at all, only cohorts. The old mock's
          per-channel table was fabricated; dropped rather than reproduced with a wrong grouping. */}

      {econ?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

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
