import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Callout } from "@/components/ui/rail";
import { FloatingCard } from "@/pages/leakage-map/floating-card";
import { StageDetailCard } from "@/pages/leakage-map/detail-panel";
import { formatCompactMoney, formatHeadlineValue } from "@/lib/format-measured-value";
import type {
  LeakageAtStakeAmountDto,
  LeakageCalloutDto,
  LeakageStageCardDto,
} from "@/services/api/leakage/get-leakage";
import type { GetLeakageStageParams } from "@/services/api/leakage/get-leakage-stage";

const HINT_VISIBLE_MS = 5000;

// Purely decorative — the API carries no per-stage color, so this just cycles a fixed palette by
// position rather than asserting anything the response doesn't.
const DOT_COLORS = ["#788831", "#7757AC", "#5E67C0", "#785BA1", "#798933", "#BB5390", "#CC6626", "#1D947F", "#7A8934", "#98A0AE"];

const CALLOUT_TONES = new Set(["amber", "teal", "rose"]);
function calloutTone(tone: string): "amber" | "teal" | "rose" {
  return CALLOUT_TONES.has(tone) ? (tone as "amber" | "teal" | "rose") : "amber";
}

/**
 * `atStake` is an array of per-currency figures that must never be added together, and this card
 * is barely 110px wide — running them together as "CAD 3.1k · EUR 2.4k · GBP 4.5k · ₦9.4M · USD
 * 12.6k" wrapped into four ragged lines where no amount lined up with any other, and a stage
 * measured at zero everywhere spent those four lines saying nothing.
 *
 * So: one row per currency, code left and amount right, so the figures align down a column and
 * each reads as its own number rather than part of a sum. Zero rows stay visible (the set is the
 * honest picture) but drop to muted weight so the eye lands on real money, and a stage that is
 * zero in every currency collapses to a single line. Order is the response's own — re-sorting by
 * amount would be a comparison across currencies, which this domain never makes.
 */
function AtStakeAmounts({ amounts }: { amounts: LeakageAtStakeAmountDto[] }) {
  if (amounts.length === 0) return <p className="text-[11px] text-ink-4">No currency measured</p>;

  if (!amounts.some((amount) => amount.amountAtRisk > 0)) {
    return (
      <>
        <p className="text-[12.5px] font-semibold text-ink-2">Nothing at stake</p>
        <p className="mt-0.5 text-[9.5px] text-ink-4">
          0 across {amounts.length} {amounts.length === 1 ? "currency" : "currencies"}
        </p>
      </>
    );
  }

  return (
    <ul className="space-y-0.5">
      {amounts.map((amount) => {
        const formatted = formatCompactMoney(amount.amountAtRisk, amount.currency);
        // Drop a leading "CAD "/"USD " so the code isn't printed twice; a symbol prefix (₦) stays,
        // since it reads as part of the figure rather than a repeat of the column beside it.
        const figure = formatted.replace(new RegExp(`^${amount.currency}\\s`), "");
        const isReal = amount.amountAtRisk > 0;

        return (
          <li key={amount.currency} className="flex items-baseline justify-between gap-1.5">
            <span className="font-mono text-[9px] tracking-[0.4px] text-ink-4">{amount.currency}</span>
            <span
              className={cn(
                "text-[12.5px] font-semibold tabular-nums",
                isReal ? "text-rose" : "text-ink-4"
              )}
            >
              {figure}
            </span>
          </li>
        );
      })}
    </ul>
  );
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
 * A stage card's face, opening the generic `StageDetailCard` (Step 3's modal consolidation —
 * lazy-fetches `GET /leakage/stages/{stageKey}` only once clicked, not for all 10 cards upfront).
 * Headline/atStake render either a real formatted figure or the gapped-figure InfoTooltip, never a
 * fallback number — same convention the old lifecycle domain used for the same
 * `LeakageMeasuredValueDto`-shaped fields.
 */
function StageCard({
  stage,
  dotColor,
  stageParams,
}: {
  stage: LeakageStageCardDto;
  dotColor: string;
  stageParams: GetLeakageStageParams;
}) {
  const metricValue = formatHeadlineValue(stage.headline);
  const atStakeAmounts = stage.atStake.value;

  return (
    <FloatingCard
      align="start"
      renderTrigger={({ open, toggle, ref }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          className={cn(
            "flex min-h-32 w-full flex-col rounded-card border border-transparent bg-paper-2 p-4 text-left transition-all",
            "hover:border-line hover:bg-paper",
            open && "border-ultra bg-paper shadow-md"
          )}
        >
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
            {atStakeAmounts ? (
              <AtStakeAmounts amounts={atStakeAmounts} />
            ) : (
              <InfoTooltip missingSource={stage.atStake.missingSource ?? undefined} wouldUnlock={stage.atStake.wouldUnlock ?? undefined} />
            )}
          </div>
        </button>
      )}
    >
      <StageDetailCard stageKey={stage.key} dotColor={dotColor} params={stageParams} />
    </FloatingCard>
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
  stageParams,
}: {
  stages: LeakageStageCardDto[] | undefined;
  callouts: LeakageCalloutDto[] | undefined;
  stageParams: GetLeakageStageParams;
}) {
  const [dismissedCallouts, setDismissedCallouts] = useState<Set<string>>(new Set());
  const hasGappedFigure = !!stages?.some((stage) => stage.headline.value === null || stage.atStake.value === null);
  const [showHint, setShowHint] = useState(false);

  // Auto-shows once the cards are actually on screen, holds briefly, then fades — teaches that
  // the info icon is hoverable (it was reading as inert on its own), same convention the archived
  // old-lifecycle stage rail used. Not anchored to a specific card: the row can wrap/scroll, so an
  // absolutely-positioned bubble pointing at one card could get cut off or drift.
  useEffect(() => {
    if (!hasGappedFigure) return;
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), HINT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [hasGappedFigure]);

  return (
    <div>
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Stage rollups</p>
        <p className="mt-0.5 text-[11px] text-ink-3">Independent from the matrix</p>
      </div>

      {/* Always mounted (so its own opacity/height transition can play) rather than conditionally
          rendered — but this must not contribute a layout gap of its own while collapsed: a
          `space-y-*` parent gives every sibling its margin-top regardless of that sibling's own
          visible height, so this wrapper being *present at all* (even collapsed to zero height)
          silently doubled the header-to-cards gap once a gapped stage existed. This wrapper itself
          carries no margin or padding, so it can genuinely reach 0px when collapsed — the gap it
          shows while visible is a `mt-3` on the bubble itself (a *margin*, unlike padding, doesn't
          force the collapsed 0fr row to be at least that tall), and the cards grid below gets its
          own fixed `mt-3` that stays constant whether this hint is shown, collapsed, or never
          rendered at all. */}
      {hasGappedFigure && (
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-500 ease-out",
            showHint ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0">
            <div className="relative mt-3 inline-flex max-w-57.5 items-start gap-1.5 rounded-2xl bg-ink px-3.5 py-2.5 text-[11.5px] leading-snug text-paper shadow-lg">
              <span className="absolute -bottom-1.5 left-5 size-3 rotate-45 rounded-xs bg-ink" aria-hidden />
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>Hover the info icon on a card to see why it's unavailable</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
        {!stages
          ? Array.from({ length: 10 }).map((_, index) => <StageCardSkeleton key={index} />)
          : stages.map((stage) => (
              <StageCard
                key={stage.key}
                stage={stage}
                dotColor={DOT_COLORS[stage.position % DOT_COLORS.length]}
                stageParams={stageParams}
              />
            ))}
      </div>

      {callouts && callouts.some((callout) => !dismissedCallouts.has(callout.key)) && (
        <div className="mt-3 space-y-3">
          {callouts
            .filter((callout) => !dismissedCallouts.has(callout.key))
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
      )}
    </div>
  );
}
