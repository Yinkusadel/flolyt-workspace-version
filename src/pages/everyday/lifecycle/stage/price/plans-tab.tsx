import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetPricePlans } from "@/features/lifecycle/use-get-price-plans";
import type { PricePlanDto } from "@/services/api/lifecycle/get-price-plans";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type PlanRow = PricePlanDto & { id: string };

const COLUMNS: Column<PlanRow>[] = [
  { key: "plan", header: "Plan", render: (row) => <span className="font-semibold text-ink-2">{row.plan}</span> },
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
  {
    key: "value",
    header: "Value",
    align: "right",
    render: (row) => <span className="font-mono text-ink">{row.value !== null ? formatCompactMoney(row.value, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "valuePerCustomer",
    header: "Value / customer",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.valuePerCustomer !== null ? formatCompactMoney(row.valuePerCustomer, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function PlansSkeleton() {
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

/** PR03 — Price's own Plans tab, wired to GET /lifecycle/price/plans. */
const PricePlansTab = () => {
  const { data, isLoading, isError, refetch } = useGetPricePlans();
  const plans = data?.data;
  const rows: PlanRow[] = (plans?.plans ?? []).map((plan) => ({ ...plan, id: `${plan.plan}-${plan.currency}` }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {plans ? `${rows.length} plan · currency rows${plans.customers !== null ? ` · ${formatCount(plans.customers)} customers on a live subscription` : ""}` : "Which tiers people are actually on, live subscriptions only"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Price's plans.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <PlansSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No live plans yet" emptyBody="Plans with at least one live subscription will appear here." />
      )}

      {/* ❌ Backend does NOT provide: a per-plan sticker price, orders/month, margin, or a
          "state" (live/retiring) chip — this endpoint only returns customers/value/valuePerCustomer
          per plan+currency. Dropped rather than shown against fabricated figures. The old
          per-plan drilldown link (plans/:id) is also dropped: PRICE_PLAN_DETAILS was keyed by a
          few specific mock plan ids, not a general per-plan endpoint, so nothing here can populate
          it for a real plan name — see [[flag_unreachable_routes]], plan-detail-route.tsx is now
          unreachable, same accepted state as Acquire's channel-detail and Activate's path-detail. */}

      {plans?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default PricePlansTab;
