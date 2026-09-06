import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { ReclassifyADriverModal } from "@/pages/everyday/lifecycle/stage/modals/reclassify-a-driver-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { SUPPORT_RECLASSIFY_PRESET } from "@/pages/everyday/lifecycle/stage/support/data";
import { useGetSupportContactDrivers } from "@/features/lifecycle/use-get-support-contact-drivers";
import type { SupportContactDriverDto } from "@/services/api/lifecycle/get-support-contact-drivers";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type DriverRow = SupportContactDriverDto & { id: string };

const COLUMNS: Column<DriverRow>[] = [
  { key: "driver", header: "Driver", render: (row) => <span className="font-semibold text-ink-2">{row.driver}</span> },
  { key: "tickets", header: "Tickets", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.tickets)}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink-2">{formatCount(row.customers)}</span> },
  {
    key: "shareOfTickets",
    header: "Share of tickets",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.shareOfTickets !== null ? formatPercent(row.shareOfTickets) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "ticketsPerCustomer",
    header: "Tickets / customer",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.ticketsPerCustomer !== null ? round(row.ticketsPerCustomer, 1) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "refunded",
    header: "Refunded",
    align: "right",
    render: (row) => <span className="font-mono text-rose">{row.refunded !== null ? formatCount(row.refunded) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function DriversSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** SU03 — Support's own Contact drivers tab, wired to GET /lifecycle/support/contact-drivers. */
const SupportContactDriversTab = () => {
  const { headerActionsEl } = useStageContext();
  const [reclassifyOpen, setReclassifyOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetSupportContactDrivers();
  const drivers = data?.data;
  const rows: DriverRow[] = (drivers?.drivers ?? []).map((driver) => ({ ...driver, id: driver.driver }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setReclassifyOpen(true)}>
            Reclassify a driver
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        {drivers ? `${drivers.tickets !== null ? formatCount(drivers.tickets) : "?"} tickets over ${drivers.windowDays} days` : "What customers contact you about"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Support's contact drivers.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <DriversSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No contact drivers measured yet" emptyBody="What customers write in about will appear here once enough tickets exist." />
      )}

      {/* ❌ Backend does NOT provide: handle time, vs-a-prior-period comparison, repeat rate after
          contact, or a "really a ___" reclassification chip — this endpoint only relates each
          driver to its own ticket/customer counts. Dropped rather than fabricated. */}

      {drivers?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <ReclassifyADriverModal preset={SUPPORT_RECLASSIFY_PRESET} open={reclassifyOpen} onOpenChange={setReclassifyOpen} />
    </div>
  );
};

export default SupportContactDriversTab;
