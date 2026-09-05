import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetAdoptDepth } from "@/features/lifecycle/use-get-adopt-depth";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

function DepthSkeleton() {
  return (
    <div className="space-y-4 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** AD05 — Adopt's own Depth tab, wired to GET /lifecycle/adopt/depth. */
const AdoptDepthTab = () => {
  const { data, isLoading, isError, refetch } = useGetAdoptDepth();
  const depth = data?.data;

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>
          How many features each customer uses
          {depth?.medianFeatures !== null && depth?.medianFeatures !== undefined ? ` · median ${depth.medianFeatures}` : ""}
          {depth ? ` · active within ${depth.activeWithinDays} days, over a ${depth.windowDays}-day window` : ""}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load Adopt's depth.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <DepthSkeleton />
        ) : depth && depth.bands.length > 0 ? (
          <div className="space-y-5">
            {depth.bands.map((band) => (
              <WideBarRow
                key={band.features}
                label={`${band.features} feature${band.features === 1 ? "" : "s"}`}
                value={
                  band.stillActiveShare !== null
                    ? `${formatCount(band.customers)} · ${formatPercent(band.stillActiveShare)} still active`
                    : `${formatCount(band.customers)} · still-active share unavailable`
                }
                percent={band.stillActiveShare !== null ? band.stillActiveShare * 100 : 0}
                tone="teal"
              />
            ))}
          </div>
        ) : (
          <p className="text-[11.5px] text-ink-3">No feature-depth bands measured yet.</p>
        )}
      </section>

      {depth?.lift !== null && depth?.lift !== undefined && (
        <p className="text-[10.5px] text-ink-4">
          Lift between the top and bottom band: {formatPercent(depth.lift)} — a correlation worth reading alongside this endpoint's own callouts, not proof that using more features causes retention.
        </p>
      )}

      {/* ❌ Backend does NOT provide: a "most common second feature" breakdown per first feature —
          this endpoint only bands customers by how many features they use in total, with no
          pairwise feature-sequence field. The old mock's "which second feature matters most" table
          isn't reproducible from live data; dropped. */}

      {depth?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default AdoptDepthTab;
