import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { RequestInstrumentationModal } from "@/pages/everyday/lifecycle/stage/modals/request-instrumentation-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatPercent, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { EXPAND_REQUEST_INSTRUMENTATION_PRESET } from "@/pages/everyday/lifecycle/stage/expand/data";
import { useGetExpandBasket } from "@/features/lifecycle/use-get-expand-basket";
import type { ExpandBasketLineDto, ExpandBasketMonthDto } from "@/services/api/lifecycle/get-expand-basket";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type MonthRow = ExpandBasketMonthDto & { id: string };
type LineRow = ExpandBasketLineDto & { id: string };

const MONTH_COLUMNS: Column<MonthRow>[] = [
  { key: "period", header: "Month", render: (row) => <span className="font-semibold text-ink-2">{row.period}</span> },
  { key: "currency", header: "Currency", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.currency}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  { key: "orders", header: "Orders", align: "right", render: (row) => <span className="font-mono text-ink-2">{formatCount(row.orders)}</span> },
  {
    key: "averageOrderValue",
    header: "Avg order value",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.averageOrderValue !== null ? formatCompactMoney(row.averageOrderValue, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "ordersPerCustomer",
    header: "Orders / customer",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.ordersPerCustomer !== null ? round(row.ordersPerCustomer, 1) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "revenuePerCustomer",
    header: "Revenue / customer",
    align: "right",
    render: (row) => <span className="font-mono text-ink">{row.revenuePerCustomer !== null ? formatCompactMoney(row.revenuePerCustomer, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

const LINE_COLUMNS: Column<LineRow>[] = [
  { key: "item", header: "Item", render: (row) => <span className="font-semibold text-ink-2">{row.item}</span> },
  { key: "lines", header: "Lines", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.lines)}</span> },
  { key: "units", header: "Units", align: "right", render: (row) => <span className="text-ink-2">{row.units !== null ? formatCount(row.units) : <span className="text-ink-4">Unavailable</span>}</span> },
  { key: "share", header: "Share", align: "right", render: (row) => <span className="text-ink-2">{row.share !== null ? formatPercent(row.share) : <span className="text-ink-4">Unavailable</span>}</span> },
];

function BasketSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
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

/**
 * EX05 — Expand's own Basket tab, wired to GET /lifecycle/expand/basket. The old mock treated this
 * whole screen as blocked on `order_lines` — the real endpoint returns a full monthly revenue/
 * basket-size/order-frequency trend independently of that field; only item-level composition
 * (`lines[]`) needs it, same surprise this session already hit on Price's Margin tab.
 */
const ExpandBasketTab = () => {
  const { headerActionsEl } = useStageContext();
  const [requestOpen, setRequestOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetExpandBasket();
  const basket = data?.data;
  const monthRows: MonthRow[] = (basket?.months ?? []).map((month) => ({ ...month, id: `${month.period}-${month.currency}` }));
  const lineRows: LineRow[] = (basket?.lines ?? []).map((line) => ({ ...line, id: line.item }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
            Request instrumentation
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        Whether revenue per customer moved because baskets got bigger or people ordered more often
        {basket?.grain ? ` · ${basket.grain}` : ""}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Expand's basket.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <BasketSkeleton />
      ) : (
        <>
          <section className="space-y-3">
            <p className={EYEBROW_CLASS}>Basket size vs order frequency, per month</p>
            <DataTable columns={MONTH_COLUMNS} rows={monthRows} emptyTitle="No complete month measured yet" emptyBody="A month's basket figures appear here once it has fully closed." />
          </section>

          {basket && basket.movement.length > 0 && (
            <section className="space-y-1">
              <p className={`pb-2 ${EYEBROW_CLASS}`}>What drove the change</p>
              <div className="divide-y divide-line rounded-card border border-line bg-paper">
                {basket.movement.map((row) => (
                  <div key={row.currency} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className="text-[11.5px] text-ink-2">
                      {row.currency} · {row.from} → {row.to}
                    </span>
                    <span className="font-mono text-[11px] text-ink-2">
                      revenue/customer {row.revenuePerCustomerChange !== null ? formatCompactMoney(row.revenuePerCustomerChange, row.currency) : "Unavailable"} · driven by{" "}
                      <span className="font-semibold text-ultra">{row.driver}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <p className={EYEBROW_CLASS}>What is inside a basket</p>
            {lineRows.length > 0 ? (
              <DataTable columns={LINE_COLUMNS} rows={lineRows} />
            ) : (
              <Callout tone="amber" title="Basket composition is unavailable">
                {basket?.caveat ?? "This needs order lines, not just order amount and date — a separate connection from the monthly figures above."}
              </Callout>
            )}
          </section>
        </>
      )}

      {/* ❌ Backend does NOT provide: a "held flat through everything" narrative tied to specific
          named events (a fee change, a discount increase) — that framing was fabricated for the
          old mock. The real `movement[].driver` field says what actually moved revenue per
          customer; shown as-is rather than wrapped in invented commentary. */}

      {basket?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <RequestInstrumentationModal preset={EXPAND_REQUEST_INSTRUMENTATION_PRESET} open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
};

export default ExpandBasketTab;
