import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetPriceDiscounting } from "@/features/lifecycle/use-get-price-discounting";
import type { PriceDiscountingBandDto } from "@/services/api/lifecycle/get-price-discounting";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// The endpoint's real band vocabulary — "too-few-orders" is its own band, not an exclusion.
const BAND_LABEL: Record<string, string> = {
  always: "Always discounted",
  mostly: "Mostly discounted",
  occasionally: "Occasionally discounted",
  never: "Never discounted",
  "too-few-orders": "Too few orders to band",
};

type BandRow = PriceDiscountingBandDto & { id: string };

function buildColumns(hasCost: boolean): Column<BandRow>[] {
  const columns: Column<BandRow>[] = [
    { key: "band", header: "Group", render: (row) => <span className="font-semibold text-ink-2">{BAND_LABEL[row.band] ?? row.band}</span> },
    { key: "currency", header: "Currency", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.currency}</span> },
    {
      key: "customers",
      header: "Customers",
      align: "right",
      render: (row) => (
        <span className="font-mono text-ink">
          {formatCount(row.customers)}
          {row.shareOfCustomers !== null && <span className="text-ink-4"> · {formatPercent(row.shareOfCustomers)}</span>}
        </span>
      ),
    },
    { key: "orders", header: "Orders", align: "right", render: (row) => <span className="font-mono text-ink-2">{formatCount(row.orders)}</span> },
    {
      key: "discountedOrders",
      header: "Discounted orders",
      align: "right",
      render: (row) => <span className="font-mono text-ink-4">{row.discountedOrders !== null ? formatCount(row.discountedOrders) : "Unavailable"}</span>,
    },
    {
      key: "depth",
      header: "Discount depth",
      align: "right",
      render: (row) => <span className="text-amber">{row.depth !== null ? formatPercent(row.depth) : <span className="text-ink-4">Unavailable</span>}</span>,
    },
    { key: "revenue", header: "Revenue", align: "right", render: (row) => <span className="font-mono text-ink">{formatCompactMoney(row.revenue, row.currency)}</span> },
    { key: "discount", header: "Discount given", align: "right", render: (row) => <span className="font-mono text-rose">{formatCompactMoney(row.discount, row.currency)}</span> },
  ];

  if (hasCost) {
    columns.push({
      key: "contribution",
      header: "Contribution",
      align: "right",
      render: (row) => (
        <span className={row.contribution !== null ? (row.contribution >= 0 ? "text-teal" : "text-rose") : "text-ink-4"}>
          {row.contribution !== null ? formatCompactMoney(row.contribution, row.currency) : "Unavailable"}
        </span>
      ),
    });
  }

  columns.push({
    key: "paidFullPriceFirst",
    header: "Paid full price first",
    align: "right",
    render: (row) => <span className="font-mono text-ink-4">{formatCount(row.paidFullPriceFirst)}</span>,
  });

  return columns;
}

function DiscountingSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** PR06 — Price's own Discounting tab, wired to GET /lifecycle/price/discounting. */
const PriceDiscountingTab = () => {
  const { data, isLoading, isError, refetch } = useGetPriceDiscounting();
  const discounting = data?.data;
  const rows: BandRow[] = (discounting?.bands ?? []).map((band) => ({ ...band, id: `${band.band}-${band.currency}` }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        Customers banded by how much of their buying was discounted over 365 days
        {discounting ? ` · at least ${discounting.minimumOrders} orders to qualify for a band` : ""}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Price's discounting.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <DiscountingSkeleton />
      ) : (
        <DataTable
          columns={buildColumns(discounting?.hasCost ?? false)}
          rows={rows}
          emptyTitle="No bands measured yet"
          emptyBody="Customers will be banded by discount frequency here once enough order history exists."
        />
      )}

      {discounting && !discounting.hasCost && (
        <Callout tone="amber" title="Contribution is unavailable, band by band">
          No connected source maps cost of goods, so what each band actually contributes after cost can't be
          computed here — only revenue and discount given, which is not the same question.
        </Callout>
      )}

      {/* ❌ Backend does NOT provide: a single blended "verdict" chip or an "at stake" money figure
          per band, and no field lets "full-price orders" be shown without subtracting discounted
          orders from total orders client-side — dropped rather than computed. The old mock's
          business-memory cards have no backing field either; dropped. */}

      {discounting?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default PriceDiscountingTab;
