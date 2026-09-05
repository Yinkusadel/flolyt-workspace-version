import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { ReForecastTheBookModal } from "@/pages/everyday/lifecycle/stage/modals/re-forecast-the-book-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount } from "@/pages/everyday/lifecycle/format-measured-value";
import { RENEW_REFORECAST_PRESET } from "@/pages/everyday/lifecycle/stage/renew/data";
import { useGetRenewalBook } from "@/features/lifecycle/use-get-renewal-book";
import type { RenewalBookSliceDto } from "@/services/api/lifecycle/get-renew-renewal-book";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// `state`'s real enum values aren't confirmed by any live response — matched defensively by
// keyword, same pattern as claimTone/stateTone elsewhere in this domain.
function stateTone(state: string): ChipTone {
  const normalized = state.toLowerCase();
  if (normalized.includes("cancel")) return "rose";
  if (normalized.includes("pend") || normalized.includes("due")) return "amber";
  return "neutral";
}

type SliceRow = RenewalBookSliceDto & { id: string };

const COLUMNS: Column<SliceRow>[] = [
  { key: "band", header: "Renewing in", render: (row) => <span className="font-semibold text-ink-2">{row.band} days</span> },
  { key: "state", header: "State", render: (row) => <Chip tone={stateTone(row.state)}>{row.state}</Chip> },
  { key: "currency", header: "Currency", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.currency}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  {
    key: "value",
    header: "Value",
    align: "right",
    render: (row) => <span className="font-mono text-ink">{row.value !== null ? formatCompactMoney(row.value, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function BookSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-chip" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** RN03 — Renew's own Renewal book tab, wired to GET /lifecycle/renew/renewal-book. */
const RenewRenewalBookTab = () => {
  const { headerActionsEl } = useStageContext();
  const [reforecastOpen, setReforecastOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetRenewalBook();
  const book = data?.data;
  const rows: SliceRow[] = (book?.slices ?? []).map((slice, index) => ({ ...slice, id: `${slice.band}-${slice.state}-${slice.currency}-${index}` }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setReforecastOpen(true)}>
            Chase the re-forecast
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        {book
          ? `${book.comingUp !== null ? formatCount(book.comingUp) : "?"} renewing in the next ${book.horizonDays} days · ${book.alreadyCancelled !== null ? formatCount(book.alreadyCancelled) : "an unknown number"} already cancelled and certain not to renew`
          : "What's coming up for renewal, split by whether it's already cancelled"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Renew's renewal book.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <BookSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="Nothing on the book yet" emptyBody="Upcoming renewals will appear here banded by 0-30/31-60/61-90 days." />
      )}

      {/* ❌ Backend does NOT provide: a projected renewal rate, a confidence chip, a basis
          explanation, an owner, or a per-row drilldown — this endpoint only returns raw
          customer/value counts per band, state and currency. Dropped rather than fabricated. */}

      {book?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <ReForecastTheBookModal preset={RENEW_REFORECAST_PRESET} open={reforecastOpen} onOpenChange={setReforecastOpen} />
    </div>
  );
};

export default RenewRenewalBookTab;
