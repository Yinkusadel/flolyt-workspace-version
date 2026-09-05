import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetSupportDeflection } from "@/features/lifecycle/use-get-support-deflection";
import type { SupportDeflectionTopicDto } from "@/services/api/lifecycle/get-support-deflection";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type TopicRow = SupportDeflectionTopicDto & { id: string };

const COLUMNS: Column<TopicRow>[] = [
  { key: "topic", header: "Topic", render: (row) => <span className="font-semibold text-ink-2">{row.topic}</span> },
  { key: "readers", header: "Readers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.readers)}</span> },
  { key: "contacted", header: "Contacted", align: "right", render: (row) => <span className="font-mono text-ink-2">{formatCount(row.contacted)}</span> },
  {
    key: "contactedAnyway",
    header: "Contacted anyway",
    align: "right",
    render: (row) => <span className="text-rose">{row.contactedAnyway !== null ? formatCount(row.contactedAnyway) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
];

function DeflectionSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** SU05 — Support's own Deflection tab, wired to GET /lifecycle/support/deflection. */
const SupportDeflectionTab = () => {
  const { data, isLoading, isError, refetch } = useGetSupportDeflection();
  const deflection = data?.data;
  const rows: TopicRow[] = (deflection?.topics ?? []).map((topic) => ({ ...topic, id: topic.topic }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {deflection
          ? `${deflection.readings !== null ? formatCount(deflection.readings) : "?"} help-article reads · ${deflection.contactedAnyway !== null ? formatCount(deflection.contactedAnyway) : "an unknown number"} contacted anyway · over ${deflection.contactWindowDays} days`
          : "Which help content is followed by a ticket anyway, per topic"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Support's deflection.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <DeflectionSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No topics measured yet" emptyBody="Help topics will appear here once enough reads and tickets exist to relate them." />
      )}

      {/* ❌ Backend does NOT provide: cost saved, repeat rate after, a "vs contacting a human"
          comparison, or a verdict per topic — this endpoint only relates readers to tickets raised
          anyway. Dropped rather than fabricated. */}

      {deflection?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default SupportDeflectionTab;
