import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarTrack, type BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { formatCount, formatPercent, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetActivateTimeToValue } from "@/features/lifecycle/use-get-activate-time-to-value";

// The 5 bands are fixed by Flolyt (GET /lifecycle/activate/time-to-value's own notes), not
// per-tenant — "never" is a band, not a drop.
const BAND_LABELS: Record<string, string> = {
  "same-day": "Same day",
  "1-7": "1–7 days",
  "8-30": "8–30 days",
  "31+": "31+ days",
  never: "Never activated",
};
const BAND_TONES: Record<string, BarTone> = {
  "same-day": "teal",
  "1-7": "teal",
  "8-30": "amber",
  "31+": "rose",
  never: "rose",
};

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

/** AC03 — Activate's unique Time to value tab. */
const ActivateTimeToValueTab = () => {
  const { data, isLoading, isError, refetch } = useGetActivateTimeToValue();
  const timeToValue = data?.data;
  const isUnbound = !!timeToValue && timeToValue.conversionConditionKey === null;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Days from first order to activation
          {timeToValue?.maturityDays != null ? ` · matured after ${timeToValue.maturityDays} days` : ""}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load time to value.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : isUnbound ? (
          <Callout tone="amber" title="This screen has no answer until Activate has a conversion">
            Reaching value is measured against whichever exit is bound as Activate's conversion, and none is bound
            yet. Bind one from the stage's definition to turn this from unavailable into a real breakdown.
          </Callout>
        ) : (
          <>
            {(timeToValue?.entered != null || timeToValue?.reached != null) && (
              <p className="font-mono text-[10.5px] text-ink-4">
                {timeToValue.entered != null && `${formatCount(timeToValue.entered)} entered`}
                {timeToValue.entered != null && timeToValue.reached != null && " · "}
                {timeToValue.reached != null && `${formatCount(timeToValue.reached)} reached value`}
              </p>
            )}
            <div className="space-y-4">
              {timeToValue?.bands.map((band) => (
                <div key={band.band} className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-[12.5px] font-semibold text-ink">{BAND_LABELS[band.band] ?? band.band}</span>
                    <span className="font-mono text-[12px] font-semibold text-ink">
                      {formatCount(band.customers)}
                      {band.share !== null && ` · ${formatPercent(band.share)}`}
                    </span>
                  </div>
                  <BarTrack percent={band.share !== null ? band.share * 100 : 0} tone={BAND_TONES[band.band] ?? "ink"} />
                </div>
              ))}
            </div>
            {(timeToValue?.medianBand || timeToValue?.drift != null) && (
              <p className="font-mono text-[10.5px] text-ink-4">
                {timeToValue.medianBand && `Median: ${BAND_LABELS[timeToValue.medianBand] ?? timeToValue.medianBand}`}
                {timeToValue.medianBand && timeToValue.drift != null && " · "}
                {/* Drift's exact scale (fraction vs already-in-points) isn't confirmed live — shown
                    as points without a ×100 conversion rather than guess the wrong order of magnitude. */}
                {timeToValue.drift != null && `${timeToValue.drift >= 0 ? "+" : ""}${round(timeToValue.drift, 1)} pts vs prior quarter`}
              </p>
            )}
          </>
        )}
      </section>

      {/* ❌ Backend does NOT provide: a per-cohort-by-month breakdown (activated/rate/median
          days/same-day/vs prior month) — GET /lifecycle/activate/time-to-value has no cohort
          dimension at all, only the fixed same-day/1-7/8-30/31+/never bands above. Dropped
          rather than shown against fabricated rows. */}

      {timeToValue?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default ActivateTimeToValueTab;
