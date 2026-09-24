import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flag, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { type ConfidenceLevel, CONFIDENCE_LABEL } from "@/pages/leakage-map/data";
import { useGetLeakageStage } from "@/features/leakage/use-get-leakage-stage";
import { useLearnWhyLeakageStage } from "@/features/leakage/use-learn-why-leakage-stage";
import { useGetLeakageCell } from "@/features/leakage/use-get-leakage-cell";
import { useOpenRoomOnLeakageCell } from "@/features/leakage/use-open-room-on-leakage-cell";
import { useLearnWhyLeakageCell } from "@/features/leakage/use-learn-why-leakage-cell";
import { formatAtStakeAmounts, formatCompactMoney, formatCount, formatRelativeTime } from "@/lib/format-measured-value";
import type { GetLeakageStageParams } from "@/services/api/leakage/get-leakage-stage";
import type { GetLeakageCellParams } from "@/services/api/leakage/get-leakage-cell";
import type { LeakageExpectedEntryDto } from "@/services/api/leakage/get-leakage";

function CardEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

function DetailGap({ missingSource, wouldUnlock }: { missingSource: string | null; wouldUnlock: string | null }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-4">
      Unavailable <InfoTooltip missingSource={missingSource ?? undefined} wouldUnlock={wouldUnlock ?? undefined} />
    </span>
  );
}

function ExpectedRow({ entry }: { entry: LeakageExpectedEntryDto }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11.5px]">
      <span className="text-ink-3">{entry.currency}</span>
      <span className="font-medium text-ink">
        {formatAtStakeAmounts([{ currency: entry.currency, amountAtRisk: entry.amount }])}
        <span className="text-ink-4">
          {" "}
          (80% range {formatAtStakeAmounts([{ currency: entry.currency, amountAtRisk: entry.rangeLow }])}–
          {formatAtStakeAmounts([{ currency: entry.currency, amountAtRisk: entry.rangeHigh }])} ·{" "}
          {CONFIDENCE_LABEL[entry.confidence as ConfidenceLevel] ?? entry.confidence} confidence)
        </span>
      </span>
    </div>
  );
}

function StageDetailSkeleton() {
  return (
    <div className="w-80 max-w-[calc(100vw-2rem)] space-y-2.5 p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/**
 * One generic stage detail card for all 10 stages, lazy-fetched via `useGetLeakageStage` on open
 * — replaces the old mock's three bespoke layouts (Adopt's operational drilldown, Retain's
 * authored rollup, everyone else's plain restatement), since the real
 * `GET /leakage/stages/{stageKey}` returns one uniform shape regardless of stage (see
 * docs/leakage-map/build-plan.md mismatch #1). "Learn why" is wired for every stage now, not just
 * Adopt, and is refused server-side on a stage with no measured figure — the mutation's own
 * `onError` toast (see use-learn-why-leakage-stage.ts) surfaces that rather than a client-side
 * guess at the exact gating rule.
 */
export function StageDetailCard({
  stageKey,
  dotColor,
  params,
}: {
  stageKey: string;
  dotColor: string;
  params: GetLeakageStageParams;
}) {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetLeakageStage(stageKey, params);
  const { mutate: learnWhy, isPending: isAskingWhy } = useLearnWhyLeakageStage();
  const stage = data?.data;

  if (isLoading) return <StageDetailSkeleton />;

  if (isError || !stage) {
    return (
      <div className="w-72 max-w-[calc(100vw-2rem)] p-4">
        <p className="text-[11.5px] text-rose">Couldn't load this stage.</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const atStakeAmounts = stage.atStake.value !== null ? formatAtStakeAmounts(stage.atStake.value) : null;
  const expectedEntries = stage.expected.value;
  const movement = stage.movement.value;
  const hasLeakToExplain = !!stage.atStake.value?.some((amount) => amount.amountAtRisk > 0);

  return (
    <div className="w-80 max-w-[calc(100vw-2rem)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden />
        <CardEyebrow>
          {String(stage.position).padStart(2, "0")} · {stage.name}
        </CardEyebrow>
        {stage.owner?.displayName && <span className="text-[10.5px] text-ink-4">{stage.owner.displayName}</span>}
      </div>

      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        {atStakeAmounts ? (
          <span className="text-[22px] font-bold text-rose">{atStakeAmounts}</span>
        ) : (
          <DetailGap missingSource={stage.atStake.missingSource ?? null} wouldUnlock={stage.atStake.wouldUnlock ?? null} />
        )}
        <span className="text-[11.5px] text-ink-3">at stake · last {stage.windowDays} days</span>
      </div>

      {stage.spansStates.length > 0 && (
        <p className="mt-1 text-[10.5px] text-ink-4">Spans {stage.spansStates.join(", ")} in the matrix below</p>
      )}

      <dl className="mt-2.5 grid grid-cols-3 gap-2 border-t border-line pt-2.5">
        <div>
          <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Population</dt>
          <dd className="mt-0.5 text-[13px] font-semibold text-ink">
            {stage.population.value !== null ? (
              formatCount(stage.population.value)
            ) : (
              <DetailGap missingSource={stage.population.missingSource ?? null} wouldUnlock={stage.population.wouldUnlock ?? null} />
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Left this month</dt>
          <dd className="mt-0.5 text-[13px] font-semibold text-ink">
            {stage.departedThisMonth.value !== null ? (
              formatCount(stage.departedThisMonth.value)
            ) : (
              <DetailGap
                missingSource={stage.departedThisMonth.missingSource ?? null}
                wouldUnlock={stage.departedThisMonth.wouldUnlock ?? null}
              />
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Open rooms</dt>
          <dd className="mt-0.5 text-[13px] font-semibold text-ink">{stage.openRoomCount}</dd>
        </div>
      </dl>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Movement</p>
        <p className="mt-1 text-[11.5px] text-ink-2">
          {movement ? (
            <>
              {movement.direction && <span className="capitalize">{movement.direction} </span>}
              {movement.percentChange !== null && `${movement.percentChange}% `}
              {movement.comparedToLabel && <span className="text-ink-4">vs {movement.comparedToLabel}</span>}
            </>
          ) : (
            <DetailGap missingSource={stage.movement.missingSource ?? null} wouldUnlock={stage.movement.wouldUnlock ?? null} />
          )}
        </p>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Expected loss</p>
        {expectedEntries && expectedEntries.length > 0 ? (
          <div className="mt-1 space-y-1">
            {expectedEntries.map((entry) => (
              <ExpectedRow key={entry.currency} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="mt-1">
            <DetailGap missingSource={stage.expected.missingSource ?? null} wouldUnlock={stage.expected.wouldUnlock ?? null} />
          </p>
        )}
      </div>

      {stage.severity.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-line pt-2.5">
          {stage.severity.map((s) => (
            <Chip key={s.currency} tone="neutral">
              {s.currency} · {s.severity.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line pt-2.5">
        {stage.refreshedAtUtc ? (
          <span className="text-[10px] text-ink-4">Refreshed {formatRelativeTime(stage.refreshedAtUtc)}</span>
        ) : (
          <span className="text-[10px] text-ink-4">Not yet refreshed</span>
        )}
        {/* The endpoint refuses twice over, and both refusals mean the same thing for this button:
            on a stage with nothing measured ("a gap is not a question") and on one measured at a
            real zero ("nothing is leaking there over this window — the refresh ran and found
            nought, which is a result rather than a gap", confirmed live on `acquire`). So the only
            stage worth offering this on is one where some currency actually carries an amount —
            an all-zero stage is a finished answer, not a question. Per
            [[feedback_hold_mostly_gated_feature]], hidden beats shown-and-guaranteed-to-fail.
            (`> 0` matches the same test the stage card's money block uses; a negative amount has
            never been seen, and would read as "no leak" in both places.) */}
        {hasLeakToExplain && (
          <button
            type="button"
            disabled={isAskingWhy}
            onClick={() =>
              learnWhy(
                { stageKey, window: params.window, horizon: params.horizon },
                { onSuccess: (res) => navigate(`/conversations/${res.data.conversationId}`) }
              )
            }
            className="inline-flex items-center gap-1.5 rounded-control border border-line bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2 hover:bg-paper disabled:opacity-60"
          >
            <HelpCircle className="size-3.5" />
            {/* `learnWhy` is null on a stage with no specialist (churn) — name the agent when
                there is one, otherwise the same plain label the cell card already uses. */}
            {isAskingWhy ? "Asking…" : stage.learnWhy ? `Ask ${stage.learnWhy.agentName} why` : "Learn why"}
          </button>
        )}
      </div>
    </div>
  );
}

function CellDetailSkeleton() {
  return (
    <div className="w-full space-y-2.5 p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/**
 * The floating card any matrix cell opens, lazy-fetched via `useGetLeakageCell` — replaces the
 * mock's five authored cell-card variants (value/compound/zero/gap/filtered) with one template
 * over the real two states `LeakageCellDetailDto` distinguishes: measured (`amount` present) or
 * gap (`reason`/`missingSource`/`wouldUnlock`/`explanation`/`alsoFills`/`connect` instead). The
 * surface never decides between "open room" and "create room" — `room` vs `draft` on the response
 * is that decision, made server-side (see docs/endpoints/leakage.md).
 */
export function CellDetailCard({
  grid,
  row,
  condition,
  currency,
  rowLabel,
  conditionLabel,
  params,
}: {
  grid: string;
  row: string;
  condition: string;
  currency: string;
  rowLabel: string;
  conditionLabel: string;
  params: Pick<GetLeakageCellParams, "window" | "horizon">;
}) {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetLeakageCell({ grid, row, condition, currency, ...params });
  const { mutate: openRoom, isPending: isOpeningRoom } = useOpenRoomOnLeakageCell();
  const { mutate: learnWhy, isPending: isAskingWhy } = useLearnWhyLeakageCell();
  const cell = data?.data;

  if (isLoading) return <CellDetailSkeleton />;

  if (isError || !cell) {
    return (
      <div className="w-72 max-w-[calc(100vw-2rem)] p-4">
        <p className="text-[11.5px] text-rose">Couldn't load this cell.</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const measured = cell.amount !== null;
  const movement = cell.movement.value;
  const expected = cell.expected.value;

  const handleStartRoom = () => {
    if (!cell.draft) return;
    openRoom(
      {
        grid: cell.grid,
        row: cell.rowKey,
        condition: cell.conditionKey,
        currency: cell.currency,
        title: cell.draft.title,
        settlement: {
          settlesWhen: cell.draft.settlesWhen,
          measuredOverDays: cell.draft.measuredOverDays,
          primaryMeasure: cell.draft.primaryMeasure,
          revenueBasis: cell.draft.revenueBasis,
          holdoutPercent: cell.draft.holdoutPercent,
          wouldProveUsWrong: cell.draft.wouldProveUsWrong,
        },
      },
      { onSuccess: (res) => res.succeeded && navigate(`/rooms/${res.data}`) }
    );
  };

  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {conditionLabel}
      </CardEyebrow>

      <div className="mt-1.5 flex items-baseline gap-2">
        {measured ? (
          <span className="text-[22px] font-bold text-rose">{formatCompactMoney(cell.amount!, cell.currency)}</span>
        ) : (
          <span className="text-[20px] font-semibold text-ink">Unknown</span>
        )}
        <span className="text-[11.5px] text-ink-3">
          {measured ? `over the last ${cell.windowDays} days` : "exposure is not measurable here"}
        </span>
      </div>

      {measured ? (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Chip tone="neutral">Severity: {cell.severity.label}</Chip>
            {cell.customers !== null && <Chip tone="neutral">{formatCount(cell.customers)} customers</Chip>}
          </div>

          <div className="mt-2.5 border-t border-line pt-2.5">
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Movement</p>
            <p className="mt-1 text-[11.5px] text-ink-2">
              {movement ? (
                <>
                  {movement.direction && <span className="capitalize">{movement.direction} </span>}
                  {movement.percentChange !== null && `${movement.percentChange}% `}
                  {movement.comparedToLabel && <span className="text-ink-4">vs {movement.comparedToLabel}</span>}
                </>
              ) : (
                <DetailGap missingSource={cell.movement.missingSource ?? null} wouldUnlock={cell.movement.wouldUnlock ?? null} />
              )}
            </p>
          </div>

          <div className="mt-2.5 border-t border-line pt-2.5">
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Expected loss</p>
            {expected ? (
              <div className="mt-1">
                <ExpectedRow entry={expected} />
              </div>
            ) : (
              <p className="mt-1">
                <DetailGap missingSource={cell.expected.missingSource ?? null} wouldUnlock={cell.expected.wouldUnlock ?? null} />
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mt-2.5 flex gap-2 rounded-control border border-amber-border bg-amber-bg p-3">
            <Flag className="mt-0.5 size-3.5 shrink-0 text-amber" aria-hidden />
            <div>
              <p className="text-[12px] font-semibold text-amber">This is a data gap, not a zero</p>
              {cell.missingSource && <p className="mt-0.5 text-[11px] text-amber">{cell.missingSource}</p>}
            </div>
          </div>

          {cell.explanation && (
            <div className="mt-2.5 border-t border-line pt-2.5">
              <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Why</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-2">{cell.explanation}</p>
            </div>
          )}

          {cell.wouldUnlock && (
            <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] text-ink-2">{cell.wouldUnlock}</p>
          )}

          {cell.alsoFills !== null && cell.alsoFills > 0 && (
            <p className="mt-1 text-[10.5px] text-ink-4">
              {cell.connect
                ? `Connecting this source would also fill ${cell.alsoFills} other cell${cell.alsoFills === 1 ? "" : "s"}.`
                : `This calculation would also fill ${cell.alsoFills} other cell${cell.alsoFills === 1 ? "" : "s"}.`}
            </p>
          )}
        </>
      )}

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5">
        {cell.room ? (
          <Button asChild size="sm" variant="outline">
            <Link to={`/rooms/${cell.room.roomId}`}>Open room</Link>
          </Button>
        ) : cell.draft ? (
          <Button type="button" size="sm" variant="outline" disabled={isOpeningRoom} onClick={handleStartRoom}>
            {isOpeningRoom ? "Starting…" : "Start a room"}
          </Button>
        ) : (
          <span />
        )}

        {/* Same gate as the stage card's "Learn why" — refused server-side with no measured
            figure ("a gap is not a question" per the stage endpoint's own prose, the cell version
            says "or one with no figure behind it"). Whether a real, non-zero cell can still be
            refused the way Acquire's stage was is unconfirmed here too — see
            [[flolyt_leakage_map_wiring]]. */}
        {measured && (
          <button
            type="button"
            disabled={isAskingWhy}
            onClick={() =>
              learnWhy(
                { grid, row, condition, currency, window: params.window, horizon: params.horizon },
                { onSuccess: (res) => navigate(`/conversations/${res.data.conversationId}`) }
              )
            }
            className="inline-flex items-center gap-1.5 rounded-control border border-line bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2 hover:bg-paper disabled:opacity-60"
          >
            <HelpCircle className="size-3.5" />
            {isAskingWhy ? "Asking…" : "Learn why"}
          </button>
        )}
      </div>
    </div>
  );
}
