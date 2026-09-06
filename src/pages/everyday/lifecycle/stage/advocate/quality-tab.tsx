import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { ADVOCATE_QUALITY_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/advocate/data";
import { useGetAdvocateReferralQuality } from "@/features/lifecycle/use-get-advocate-referral-quality";
import type { ReferralQualityCohortDto } from "@/services/api/lifecycle/get-advocate-referral-quality";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type CohortRow = ReferralQualityCohortDto & { id: string };

const COLUMNS: Column<CohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  {
    key: "ordersPerCustomer",
    header: "Orders / customer",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.ordersPerCustomer !== null ? round(row.ordersPerCustomer, 1) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function QualitySkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** AV04 — Advocate's own Referral quality tab, wired to GET /lifecycle/advocate/referral-quality. */
const AdvocateReferralQualityTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetAdvocateReferralQuality();
  const quality = data?.data;
  const rows: CohortRow[] = (quality?.cohorts ?? []).map((cohort) => ({ ...cohort, id: cohort.cohort }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        Referred customers against everybody else who bought
        {quality?.orderLift !== null && quality?.orderLift !== undefined ? ` · order lift ${round(quality.orderLift, 2)}×` : ""}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Advocate's referral quality.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <QualitySkeleton />
      ) : (
        <>
          {quality && quality.byCurrency.length > 0 && (
            <section className="space-y-1">
              <p className={`pb-2 ${EYEBROW_CLASS}`}>Order value per customer, referred vs everybody else — never blended across currencies</p>
              <div className="divide-y divide-line rounded-card border border-line bg-paper">
                {quality.byCurrency.map((row) => (
                  <div key={row.currency} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className="text-[11.5px] text-ink-2">{row.currency}</span>
                    <span className="font-mono text-[11px] text-ink">
                      {row.referredPerCustomer !== null ? formatCount(Math.round(row.referredPerCustomer)) : "Unavailable"} referred vs{" "}
                      {row.otherPerCustomer !== null ? formatCount(Math.round(row.otherPerCustomer)) : "Unavailable"} other
                      {row.lift !== null && <span className={row.lift >= 1 ? "text-teal" : "text-rose"}> · {round(row.lift, 2)}× lift</span>}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <p className={EYEBROW_CLASS}>Orders per customer, by cohort</p>
            <DataTable columns={COLUMNS} rows={rows} emptyTitle="No cohorts measured yet" emptyBody="Referred-customer cohorts will appear here once enough history exists." />
          </section>
        </>
      )}

      {/* ❌ Backend does NOT provide: a per-acquisition-channel comparison (CAC, features used,
          etc.) — this endpoint only compares referred customers against "everybody else who
          bought," never against a named channel, and never claims referred customers were
          acquired for free. Dropped rather than fabricated. */}

      {quality?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={ADVOCATE_QUALITY_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateReferralQualityTab;
