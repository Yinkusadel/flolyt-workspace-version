import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetRetainSegments } from "@/features/lifecycle/use-get-retain-segments";
import type { RetainSegmentDto } from "@/services/api/lifecycle/get-retain-segments";
import type { LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

function measuredPercent(measured: LifecycleMeasuredValueDto<number>) {
  return measured.value !== null ? (
    formatPercent(measured.value)
  ) : (
    <InfoTooltip missingSource={measured.missingSource} wouldUnlock={measured.wouldUnlock} />
  );
}

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// `claim.grade`'s real enum values aren't confirmed by any live response — matched defensively by
// keyword, same pattern used for the Overview leak table's own claim.grade (overview-tab.tsx).
function claimTone(grade: string): ChipTone {
  const normalized = grade.toLowerCase();
  if (normalized.includes("causal")) return "ultra";
  if (normalized.includes("correlat")) return "amber";
  return "neutral";
}

type SegmentRow = RetainSegmentDto & { id: string };

const COLUMNS: Column<SegmentRow>[] = [
  { key: "segment", header: "Segment", render: (row) => <span className="font-semibold text-ink-2">{row.name}</span> },
  { key: "matched", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.matched)}</span> },
  {
    key: "reachable",
    header: "Reachable",
    align: "right",
    render: (row) => (
      <span className="font-mono text-ink-2">
        {formatCount(row.reachable)} <span className="text-ink-4">· {measuredPercent(row.reachableShare)}</span>
      </span>
    ),
  },
  {
    key: "repeatShare",
    header: "Repeat share",
    align: "right",
    render: (row) => <span className="text-ink-2">{measuredPercent(row.repeatShare)}</span>,
  },
  { key: "pastBoundary", header: "Past boundary", align: "right", render: (row) => <span className="font-mono text-ink-4">{formatCount(row.pastBoundary)}</span> },
  {
    key: "value",
    header: "Value",
    align: "right",
    render: (row) =>
      row.values.length > 0 ? (
        <div className="text-right">
          {row.values.map((v) => (
            <div key={v.currency} className="font-mono text-ink">
              {formatCompactMoney(v.amount, v.currency)}
            </div>
          ))}
        </div>
      ) : (
        <span className="font-mono text-ink-4">Unavailable</span>
      ),
  },
  {
    key: "claim",
    header: "Claim",
    align: "right",
    render: (row) => (row.claim ? <Chip tone={claimTone(row.claim.grade)}>{row.claim.statement}</Chip> : <span className="text-ink-4">No claim yet</span>),
  },
];

function SegmentsSkeleton() {
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

/** RT04 — Retain's own Segments tab, wired to GET /lifecycle/retain/segments. */
const RetainSegmentsTab = () => {
  const { data, isLoading, isError, refetch } = useGetRetainSegments();
  const segments = data?.data;
  const rows: SegmentRow[] = (segments?.segments ?? []).map((segment) => ({ ...segment, id: segment.segmentId }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {segments
          ? segments.distinctAcrossSegments.value !== null
            ? `${formatCount(segments.distinctAcrossSegments.value)} distinct customers across ${rows.length} segments · ${formatCount(segments.sumOfMatched)} counted before dedup`
            : `Dedup unavailable · ${formatCount(segments.sumOfMatched)} counted across ${rows.length} segments before dedup`
          : "Every active segment intersected with Retain's population"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Retain's segments.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <SegmentsSkeleton />
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows}
          emptyTitle="No segments matched yet"
          emptyBody="Segments that intersect Retain's population will appear here once at least one is active."
        />
      )}

      {/* ❌ Backend does NOT provide: a blended "vs base" comparison or a single "At stake" money
          figure per segment — this endpoint has no baseline-repeat-rate field and no risk-value
          field, only each segment's own repeatShare and values[]. Dropped rather than fabricated. */}

      {!isLoading && !isError && segments && segments.overlaps.length > 0 && (
        <section className="space-y-1">
          <p className={`pb-2 ${EYEBROW_CLASS}`}>Segments that overlap, and the double-count that would follow</p>
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {segments.overlaps.map((overlap) => (
              <div key={`${overlap.segmentA}-${overlap.segmentB}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[11.5px] text-ink-2">
                  {overlap.nameA} × {overlap.nameB}
                </span>
                <span className="font-mono text-[11px] text-amber">{formatCount(overlap.shared)} shared</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {segments?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default RetainSegmentsTab;
