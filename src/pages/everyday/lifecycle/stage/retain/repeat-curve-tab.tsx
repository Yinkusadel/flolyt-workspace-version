import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Sparkline } from "@/pages/everyday/lifecycle/stage/sparkline";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetRetainRepeatCurve } from "@/features/lifecycle/use-get-retain-repeat-curve";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

function RepeatCurveSkeleton() {
  return (
    <div className="space-y-4 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** RT03 — Retain's own Repeat curve tab, wired to GET /lifecycle/retain/repeat-curve. */
const RetainRepeatCurveTab = () => {
  const { data, isLoading, isError, refetch } = useGetRetainRepeatCurve();
  const curve = data?.data;

  return (
    <div className="space-y-8">
      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Retain's repeat curve.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <RepeatCurveSkeleton />
      ) : curve ? (
        <>
          <section className="space-y-4">
            <p className={EYEBROW_CLASS}>
              When the second order happens · {curve.matureFirstTimeBuyers !== null ? `${formatCount(curve.matureFirstTimeBuyers)} mature first-time buyers` : "mature first-time buyers unavailable"}
            </p>
            {curve.buckets.length > 0 ? (
              <div className="space-y-5">
                {curve.buckets.map((bucket) => (
                  <WideBarRow
                    key={`${bucket.fromDay}-${bucket.toDay ?? "plus"}`}
                    label={bucket.toDay !== null ? `Day ${bucket.fromDay}–${bucket.toDay}` : `Day ${bucket.fromDay}+`}
                    value={bucket.share !== null ? `${formatCount(bucket.customers)} · ${formatPercent(bucket.share)}` : `${formatCount(bucket.customers)} · unavailable`}
                    percent={bucket.share !== null ? bucket.share * 100 : 0}
                    tone="teal"
                  />
                ))}
              </div>
            ) : (
              <p className="text-[11.5px] text-ink-3">No day-window buckets measured yet.</p>
            )}
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Repeat share within boundary</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">
                {curve.repeatShareWithinBoundary !== null ? formatPercent(curve.repeatShareWithinBoundary) : "Unavailable"}
              </p>
            </div>
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Never returned</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">{curve.neverReturned !== null ? formatCount(curve.neverReturned) : "Unavailable"}</p>
            </div>
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Daily boundary crossings</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">{curve.dailyBoundaryCrossings !== null ? formatCount(curve.dailyBoundaryCrossings) : "Unavailable"}</p>
            </div>
          </div>

          <section className="space-y-3">
            <p className={EYEBROW_CLASS}>Return-probability curve · days since first order</p>
            <div className="rounded-card border border-line bg-paper p-4">
              <Sparkline
                width={400}
                height={80}
                series={[{ points: curve.points.map((p) => ({ x: p.daysSince, y: p.returnProbability })), toneClass: "stroke-teal" }]}
              />
            </div>
          </section>

          <p className="text-[10.5px] text-ink-4">
            {curve.basisCaveat} · younger-than-{curve.boundaryDays}-day buyers ({curve.tooYoungFirstTimeBuyers !== null ? formatCount(curve.tooYoungFirstTimeBuyers) : "unavailable"}) excluded from every rate above.
          </p>

          {/* ❌ Backend does NOT provide: a before/after comparison of the curve across two time
              windows — this endpoint returns one snapshot, no trend/comparison field. Dropped
              rather than faked; GET .../compare (a different endpoint, shared across all 10
              stages) is the only real comparison-over-time surface in this domain. */}

          {curve.callouts.map((callout) => (
            <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
              {callout.body}
            </Callout>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default RetainRepeatCurveTab;
