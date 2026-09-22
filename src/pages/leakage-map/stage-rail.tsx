import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Callout } from "@/components/ui/rail";
import { formatAtStakeAmounts, formatHeadlineValue } from "@/lib/format-measured-value";
import type { LeakageCalloutDto, LeakageStageCardDto } from "@/services/api/leakage/get-leakage";

// Purely decorative — the API carries no per-stage color, so this just cycles a fixed palette by
// position rather than asserting anything the response doesn't.
const DOT_COLORS = ["#788831", "#7757AC", "#5E67C0", "#785BA1", "#798933", "#BB5390", "#CC6626", "#1D947F", "#7A8934", "#98A0AE"];

const CALLOUT_TONES = new Set(["amber", "teal", "rose"]);
function calloutTone(tone: string): "amber" | "teal" | "rose" {
  return CALLOUT_TONES.has(tone) ? (tone as "amber" | "teal" | "rose") : "amber";
}

function StageCardSkeleton() {
  return (
    <div className="flex min-h-32 w-full flex-col rounded-card border border-transparent bg-paper-2 p-4">
      <Skeleton className="size-2 rounded-full" />
      <Skeleton className="mt-2 h-3.5 w-16" />
      <Skeleton className="mt-2 h-3 w-20" />
      <div className="mt-auto border-t border-dashed border-line pt-2.5">
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}

/**
 * A stage card's face — no click-through modal yet (that lazy-fetches
 * `GET /leakage/stages/{stageKey}` and lands in Step 3's modal consolidation; see
 * docs/leakage-map/build-plan.md). Headline/atStake render either a real formatted figure or the
 * gapped-figure InfoTooltip, never a fallback number — same convention the old lifecycle domain
 * used for the same `LeakageMeasuredValueDto`-shaped fields.
 */
function StageCard({ stage, dotColor }: { stage: LeakageStageCardDto; dotColor: string }) {
  const metricValue = formatHeadlineValue(stage.headline);
  const atStakeValue = stage.atStake.value !== null ? formatAtStakeAmounts(stage.atStake.value) : null;

  return (
    <div className="flex min-h-32 w-full flex-col rounded-card border border-line bg-paper-2 p-4 text-left">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10.5px] font-medium text-ink-4">{String(stage.position).padStart(2, "0")}</span>
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden />
      </div>
      <p className="mt-2 text-[13.5px] font-semibold text-ink">{stage.name}</p>

      <div className="mt-1 min-h-8">
        {metricValue ? (
          <p className="text-[11px] leading-snug text-ink-4">{metricValue}</p>
        ) : (
          <InfoTooltip missingSource={stage.headline.missingSource ?? undefined} wouldUnlock={stage.headline.wouldUnlock ?? undefined} />
        )}
        {stage.headline.label && (
          <p className="truncate font-mono text-[8.5px] text-ink-4" title={stage.headline.label}>
            {stage.headline.label}
          </p>
        )}
      </div>

      <div className="mt-auto border-t border-dashed border-line pt-2.5">
        {atStakeValue ? (
          <p className="text-[15px] font-semibold text-rose">{atStakeValue}</p>
        ) : (
          <InfoTooltip missingSource={stage.atStake.missingSource ?? undefined} wouldUnlock={stage.atStake.wouldUnlock ?? undefined} />
        )}
      </div>
    </div>
  );
}

/**
 * `stages`/`callouts` undefined means "no data fetched yet" (the true first load — a failed or
 * in-flight refetch keeps rendering the previous filter's cards instead, courtesy of
 * `useGetLeakage`'s `placeholderData`, so no separate loading/error prop is needed here; the page
 * level banner in index.tsx carries that message).
 */
export function StageRail({
  stages,
  callouts,
}: {
  stages: LeakageStageCardDto[] | undefined;
  callouts: LeakageCalloutDto[] | undefined;
}) {
  const [dismissedCallouts, setDismissedCallouts] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-3">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Stage rollups</p>
        <p className="mt-0.5 text-[11px] text-ink-3">Independent from the matrix</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
        {!stages
          ? Array.from({ length: 10 }).map((_, index) => <StageCardSkeleton key={index} />)
          : stages.map((stage) => (
              <StageCard key={stage.key} stage={stage} dotColor={DOT_COLORS[stage.position % DOT_COLORS.length]} />
            ))}
      </div>

      {callouts
        ?.filter((callout) => !dismissedCallouts.has(callout.key))
        .map((callout) => (
          <Callout
            key={callout.key}
            tone={calloutTone(callout.tone)}
            title={callout.headline}
            onClose={() => setDismissedCallouts((prev) => new Set(prev).add(callout.key))}
          >
            {callout.body}
          </Callout>
        ))}
    </div>
  );
}
