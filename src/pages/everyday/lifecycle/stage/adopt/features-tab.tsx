import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetAdoptFeatures } from "@/features/lifecycle/use-get-adopt-features";
import type { AdoptFeatureDto } from "@/services/api/lifecycle/get-adopt-features";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  if (CALLOUT_TONES.has(tone)) return tone as "amber" | "teal" | "rose" | "ultra" | "neutral";
  // "attention"/"insight" confirmed live 2026-09-05 — not in the original tone vocabulary,
  // matched defensively by keyword rather than left to fall through to neutral.
  const normalized = tone.toLowerCase();
  if (normalized.includes("attention")) return "amber";
  if (normalized.includes("insight")) return "teal";
  return "neutral";
}

function measuredPercent(measured: LifecycleMeasuredValueDto<number>) {
  return measured.value !== null ? (
    formatPercent(measured.value)
  ) : (
    <InfoTooltip missingSource={measured.missingSource} wouldUnlock={measured.wouldUnlock} />
  );
}

type FeatureRow = AdoptFeatureDto & { id: string };

const COLUMNS: Column<FeatureRow>[] = [
  { key: "feature", header: "Feature", render: (row) => <span className="font-semibold text-ink-2">{row.feature}</span> },
  { key: "customers", header: "Ever used", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  { key: "returned", header: "Returned", align: "right", render: (row) => <span className="text-teal">{formatCount(row.returned)}</span> },
  { key: "abandonedCustomers", header: "Abandoned", align: "right", render: (row) => <span className="text-rose">{formatCount(row.abandonedCustomers)}</span> },
  { key: "kept", header: "Kept", align: "right", render: (row) => <span className="text-ink-2">{measuredPercent(row.kept)}</span> },
  { key: "abandoned", header: "Abandoned share", align: "right", render: (row) => <span className="text-ink-4">{measuredPercent(row.abandoned)}</span> },
];

function FeaturesSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 5 }).map((_, index) => (
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

/** AD03 — Adopt's own Features tab, wired to GET /lifecycle/adopt/features. */
const AdoptFeaturesTab = () => {
  const { data, isLoading, isError, refetch } = useGetAdoptFeatures();
  const features = data?.data;
  const rows: FeatureRow[] = (features?.features ?? []).map((f) => ({ ...f, id: f.feature }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {features
          ? `${rows.length} features · read over a ${features.windowDays}-day window · abandoned after ${features.abandonedAfterDays} days of no use${features.customersSeen.value !== null ? ` · ${formatCount(features.customersSeen.value)} customers seen` : ""}`
          : "Which features people use, return to, and abandon"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Adopt's features.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <FeaturesSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No features measured yet" emptyBody="Feature usage will appear here once enough product-events history exists." />
      )}

      {/* ❌ Backend does NOT provide: orders/month after adoption, a ship date, or a verdict chip
          per feature — this endpoint only returns usage/return/abandonment counts. Dropped rather
          than shown against fabricated figures. The old per-feature drilldown link (features/:id)
          is also dropped — ADOPT_FEATURE_DETAILS was keyed by a few specific mock feature ids, not
          a general per-feature endpoint; see [[flag_unreachable_routes]], now unreachable, same
          accepted state as Acquire's channel-detail. */}

      {features?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default AdoptFeaturesTab;
