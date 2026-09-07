import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetSupportResolution } from "@/features/lifecycle/use-get-support-resolution";
import type { SupportResolutionBandDto } from "@/services/api/lifecycle/get-support-resolution";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type BandRow = SupportResolutionBandDto & { id: string };

const COLUMNS: Column<BandRow>[] = [
  { key: "driver", header: "Driver", render: (row) => <span className="font-semibold text-ink-2">{row.driver}</span> },
  { key: "tickets", header: "Tickets", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.tickets)}</span> },
  { key: "resolved", header: "Resolved", align: "right", render: (row) => <span className="font-mono text-teal">{formatCount(row.resolved)}</span> },
  { key: "open", header: "Open", align: "right", render: (row) => <span className="font-mono text-amber">{formatCount(row.open)}</span> },
  {
    key: "averageHours",
    header: "Avg hours (resolved only)",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.averageHours !== null ? round(row.averageHours, 1) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "resolvedShare",
    header: "Resolved share",
    align: "right",
    render: (row) => (
      <span className={row.resolvedShare !== null && row.resolvedShare < 0.8 ? "text-rose" : "text-ink-2"}>
        {row.resolvedShare !== null ? formatPercent(row.resolvedShare) : <span className="text-ink-4">Unavailable</span>}
      </span>
    ),
  },
];

function ResolutionSkeleton() {
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

/** SU04 — Support's own Resolution tab, wired to GET /lifecycle/support/resolution. */
const SupportResolutionTab = () => {
  const { data, isLoading, isError, refetch } = useGetSupportResolution();
  const resolution = data?.data;
  const rows: BandRow[] = (resolution?.bands ?? []).map((band) => ({ ...band, id: band.driver }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {resolution
          ? `${resolution.averageHours !== null ? round(resolution.averageHours, 1) : "?"}h average · ${resolution.resolvedShare !== null ? formatPercent(resolution.resolvedShare) : "an unknown share"} resolved, over ${resolution.windowDays} days`
          : "How long answering takes, and how much of the queue is still open"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Support's resolution.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ResolutionSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No resolution data measured yet" emptyBody="Resolution time by driver will appear here once enough tickets have closed." />
      )}

      <p className="text-[10.5px] text-ink-4">
        Average hours is computed over resolved tickets only — always read it alongside resolved share, since a driver that abandons half its queue can still report an excellent average.
      </p>

      {/* ❌ Backend does NOT provide: "resolved fast", "customer satisfied", repeat rate after
          contact, or a verdict per driver — this endpoint only carries ticket/resolved/open counts
          and timing. Dropped rather than fabricated. */}

      {resolution?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default SupportResolutionTab;
