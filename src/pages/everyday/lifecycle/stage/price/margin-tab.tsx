import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatPercent, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetPriceMargin } from "@/features/lifecycle/use-get-price-margin";
import type { PriceMarginMonthDto } from "@/services/api/lifecycle/get-price-margin";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type MonthRow = PriceMarginMonthDto & { id: string };

const COLUMNS: Column<MonthRow>[] = [
  { key: "period", header: "Month", render: (row) => <span className="font-semibold text-ink-2">{row.period}</span> },
  { key: "currency", header: "Currency", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.currency}</span> },
  { key: "orders", header: "Orders", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.orders)}</span> },
  { key: "revenue", header: "Revenue", align: "right", render: (row) => <span className="font-mono text-ink">{formatCompactMoney(row.revenue, row.currency)}</span> },
  { key: "cost", header: "Cost", align: "right", render: (row) => <span className="font-mono text-ink-4">{formatCompactMoney(row.cost, row.currency)}</span> },
  { key: "margin", header: "Margin", align: "right", render: (row) => <span className={row.margin >= 0 ? "text-teal" : "text-rose"}>{formatCompactMoney(row.margin, row.currency)}</span> },
  {
    key: "marginRate",
    header: "Margin rate",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.marginRate !== null ? formatPercent(row.marginRate) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "marginPerOrder",
    header: "Margin / order",
    align: "right",
    render: (row) => <span className="text-ink-4">{row.marginPerOrder !== null ? formatCompactMoney(row.marginPerOrder, row.currency) : "Unavailable"}</span>,
  },
];

function MarginSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** PR05 — Price's own Margin tab, wired to GET /lifecycle/price/margin. */
const PriceMarginTab = () => {
  const { data, isLoading, isError, refetch } = useGetPriceMargin();
  const margin = data?.data;
  const rows: MonthRow[] = (margin?.months ?? []).map((month) => ({ ...month, id: `${month.period}-${month.currency}` }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        Revenue net of delivery cost, per complete month{margin && margin.components.length > 0 ? ` · nets off: ${margin.components.join(", ")}` : ""}
      </p>

      {margin && !margin.excludesReturns && (
        <Callout tone="amber" title="Failed, cancelled and refunded orders are counted at full revenue, cost included">
          No status is mapped to exclude them, so margin here is overstated by roughly the return rate. This is stated,
          not hidden.
        </Callout>
      )}

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Price's margin.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <MarginSkeleton />
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows}
          emptyTitle="No complete month measured yet"
          emptyBody="A month's margin appears here once it has fully closed and its orders are netted against cost."
        />
      )}

      {!isLoading && !isError && margin && margin.trend.length > 0 && (
        <section className="space-y-1">
          <p className={`pb-2 ${EYEBROW_CLASS}`}>Margin rate, first month observed vs latest</p>
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {margin.trend.map((trend) => (
              <div key={trend.currency} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[11.5px] text-ink-2">
                  {trend.currency} · {trend.from} → {trend.to}
                </span>
                <span className="font-mono text-[11px]">
                  {trend.fromRate !== null ? formatPercent(trend.fromRate) : "Unavailable"} → {trend.toRate !== null ? formatPercent(trend.toRate) : "Unavailable"}
                  {trend.change !== null && (
                    <span className={trend.change >= 0 ? "text-teal" : "text-rose"}>
                      {" "}
                      ({trend.change >= 0 ? "+" : ""}
                      {round(trend.change, 1)} pts)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ❌ Backend does NOT provide: a whole-product "what is blocked by missing margin" table or
          business-memory cards about it — this endpoint returns real per-month margin (net of
          delivery cost specifically, not full contribution margin) whenever complete months exist;
          it isn't a permanently-blocked screen the way the old mock assumed. Payback (Unit
          economics' figure) and full COGS-based contribution margin stay separate concerns,
          per this endpoint's own note. */}

      {margin?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default PriceMarginTab;
