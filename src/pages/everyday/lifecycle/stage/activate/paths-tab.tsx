import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetActivatePaths } from "@/features/lifecycle/use-get-activate-paths";
import type { ActivateRouteDto } from "@/services/api/lifecycle/get-activate-paths";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type RouteRow = ActivateRouteDto & { id: string };

// ❌ Backend does NOT provide: "Median days", "At stake" or "Verdict" — GET
// /lifecycle/activate/paths has no per-route time-to-value, no per-route money figure and no
// verdict/label field (confirmed against docs/endpoints/lifecycle.md). Those three columns from
// the original design are dropped rather than shown against a fabricated value, same treatment
// as Acquire Channels' dropped "Reach 2nd order"/"Verdict" columns. The route name no longer
// links out to a detail page either — no endpoint backs a per-route narrative, same gap as
// Acquire's channel-detail-route.
const COLUMNS: Column<RouteRow>[] = [
  { key: "route", header: "How they arrived at a first order", render: (row) => <span className="font-semibold text-ink-2">{row.route}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  {
    key: "activated",
    header: "Activated",
    align: "right",
    render: (row) => (
      <span className="text-ink-2">
        {formatCount(row.activated)}
        {row.activationRate !== null && ` · ${formatPercent(row.activationRate)}`}
      </span>
    ),
  },
  {
    key: "repeated",
    header: "Repeated",
    align: "right",
    render: (row) =>
      row.repeated !== null ? (
        <span className="text-ink-2">
          {formatCount(row.repeated)}
          {row.repeatRate !== null && ` · ${formatPercent(row.repeatRate)}`}
        </span>
      ) : (
        <InfoTooltip />
      ),
  },
];

function PathsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** AC04 — Activate's unique Paths tab. */
const ActivatePathsTab = () => {
  const { data, isLoading, isError, refetch } = useGetActivatePaths();
  const paths = data?.data;
  const rows: RouteRow[] = (paths?.routes ?? []).map((route) => ({ ...route, id: route.route }));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load paths.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <PathsSkeleton />
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={rows}
            emptyTitle="No acquisition routes measured yet"
            emptyBody="Which routes bring customers who reach value and come back will appear here once acquisition data has been read for this workspace."
          />
        )}
      </section>

      {/* ❌ Backend does NOT provide: the "guest checkout activates low"-style insight cards
          (agent tag, title, body, footnote per finding) — GET /lifecycle/activate/paths' callouts
          only carry headline/body, nothing shaped like these richer cards. Dropped rather than
          shown on mock data — there's no real field to hang it off of. Its live callouts[] below
          replaces it, same pattern as Acquire's Funnel/Channels tabs. */}

      {paths?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default ActivatePathsTab;
