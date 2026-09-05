import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { formatCount, formatPercent, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageCompare } from "@/features/lifecycle/use-get-stage-compare";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// Real preset windows this endpoint actually supports (query `months`, 1-12) — "Custom"/"Year on
// year"/named market splits from the old mock have no backing param (no from/to date range, no
// market filter on this endpoint) and are dropped rather than wired to nothing.
const MONTH_OPTIONS = [3, 6, 12];

type CompareRowData = {
  id: string;
  metric: string;
  before: number | null;
  after: number | null;
  valueFormat: "count" | "percent";
  change: number | null;
  changeFormat: "count" | "percent";
};

/** Screen A16 (and the shared Compare-periods template for every stage) — has its own header, never shows the tab bar. */
const CompareRoute = () => {
  const { stage } = useStageContext();
  const [months, setMonths] = useState(3);
  const { data, isLoading, isError, refetch } = useGetStageCompare(stage.slug, { months });
  const compare = data?.data;

  const rows: CompareRowData[] = compare
    ? [
        {
          id: "population",
          metric: "Population",
          before: compare.before.endPopulation,
          after: compare.after.endPopulation,
          valueFormat: "count",
          // changePercent is preferred; falls back to the raw count delta (not a percent) only
          // when changePercent itself is unavailable — never format a raw count as a percentage.
          change: compare.changePercent ?? compare.change,
          changeFormat: compare.changePercent !== null ? "percent" : "count",
        },
        {
          id: "conversion",
          metric: "Primary conversion",
          before: compare.before.endConversion,
          after: compare.after.endConversion,
          valueFormat: "percent",
          change: compare.conversionChange,
          changeFormat: "percent",
        },
      ]
    : [];

  const columns: Column<CompareRowData>[] = [
    { key: "metric", header: "Metric", render: (row) => <span className="font-semibold text-ink-2">{row.metric}</span> },
    {
      key: "before",
      header: "Before",
      align: "right",
      render: (row) =>
        row.before !== null ? (
          <span className="font-mono text-ink">{row.valueFormat === "percent" ? formatPercent(row.before) : formatCount(row.before)}</span>
        ) : (
          <InfoTooltip />
        ),
    },
    {
      key: "after",
      header: "After",
      align: "right",
      render: (row) =>
        row.after !== null ? (
          <span className="font-mono text-ink">{row.valueFormat === "percent" ? formatPercent(row.after) : formatCount(row.after)}</span>
        ) : (
          <InfoTooltip />
        ),
    },
    {
      key: "change",
      header: "Change",
      align: "right",
      render: (row) =>
        row.change !== null ? (
          <span className={row.change >= 0 ? "text-teal" : "text-rose"}>
            {row.change >= 0 ? "+" : ""}
            {row.changeFormat === "percent" ? formatPercent(row.change) : formatCount(row.change)}
          </span>
        ) : (
          <InfoTooltip />
        ),
    },
    // ❌ Backend does NOT provide: "What moved it" — GET .../compare only reports population and
    // conversion movement, never an attributed cause. Dropped rather than shown against a
    // fabricated value.
  ];

  const periodLabel = compare
    ? `${formatShortDate(compare.before.fromUtc)} – ${formatShortDate(compare.before.toUtc)}  vs  ${formatShortDate(compare.after.fromUtc)} – ${formatShortDate(compare.after.toUtc)}`
    : undefined;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Compare" }]}
        title={`${stage.name} · compare`}
        subtitle={periodLabel ?? `Last ${months} months vs the ${months} before`}
      />

      <div className="flex flex-wrap gap-2">
        {MONTH_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMonths(option)}
            className={cn(
              "rounded-panel border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap",
              months === option ? "border-ultra-border bg-ultra-bg text-ultra" : "border-line bg-paper-2 text-ink-3"
            )}
          >
            Last {option} months
          </button>
        ))}
      </div>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load this comparison.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3 rounded-card border border-line bg-paper p-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {compare?.definitionChangedInside && (
        <Callout tone="amber" title="This stage's definition changed inside the comparison window">
          Part of any movement here is the meaning moving, not the business — read the accompanying callouts below for where to read the delta from instead.
        </Callout>
      )}

      {compare?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      {/* ❌ Backend does NOT provide: the fuller CAC/repeat-rate/value-per-customer table or the
          per-stage "how this comparison is built" notes (Acquire's original design) — this
          endpoint only ever compares population and conversion, and says so rather than faking
          the rest of the row set. */}
    </div>
  );
};

export default CompareRoute;
