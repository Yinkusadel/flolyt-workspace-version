import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetAdoptDepth } from "@/features/lifecycle/use-get-adopt-depth";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  if (CALLOUT_TONES.has(tone)) return tone as "amber" | "teal" | "rose" | "ultra" | "neutral";
  // "attention"/"insight"/"context" confirmed live 2026-09-05 across Adopt's own endpoints — not
  // in the original tone vocabulary, matched defensively by keyword.
  const normalized = tone.toLowerCase();
  if (normalized.includes("attention")) return "amber";
  if (normalized.includes("insight")) return "teal";
  return "neutral";
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
          {depth?.medianFeatures.value !== null && depth?.medianFeatures.value !== undefined ? ` · median ${depth.medianFeatures.value}` : ""}
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
              <div key={band.features} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[12px] font-semibold text-ink">{`${band.features} feature${band.features === 1 ? "" : "s"}`}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-3">
                    {formatCount(band.customers)} ·{" "}
                    {band.stillActiveShare.value !== null ? (
                      `${formatPercent(band.stillActiveShare.value)} still active`
                    ) : (
                      <>
                        still-active share <InfoTooltip missingSource={band.stillActiveShare.missingSource} wouldUnlock={band.stillActiveShare.wouldUnlock} />
                      </>
                    )}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-paper">
                  <div
                    className="h-1.5 rounded-full bg-teal"
                    style={{ width: `${Math.min(100, Math.max(0, band.stillActiveShare.value !== null ? band.stillActiveShare.value * 100 : 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11.5px] text-ink-3">No feature-depth bands measured yet.</p>
        )}
      </section>

      {depth?.lift.value !== null && depth?.lift.value !== undefined && (
        <p className="text-[10.5px] text-ink-4">
          Lift between the top and bottom band: {formatPercent(depth.lift.value)} — a correlation worth reading alongside this endpoint's own callouts, not proof that using more features causes retention.
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
