import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flag, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  CONFIDENCE_LABEL,
  FEATURED_CELL,
  SEVERITY_LABEL,
  type ConfidenceLevel,
  type SeverityLevel,
} from "@/pages/leakage-map/data";
import { useGetLeakageStage } from "@/features/leakage/use-get-leakage-stage";
import { useLearnWhyLeakageStage } from "@/features/leakage/use-learn-why-leakage-stage";
import { formatAtStakeAmounts, formatCount, formatRelativeTime } from "@/lib/format-measured-value";
import type { GetLeakageStageParams } from "@/services/api/leakage/get-leakage-stage";
import type { LeakageExpectedEntryDto } from "@/services/api/leakage/get-leakage";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12px]">
      <dt className="text-ink-3">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}

function CardEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

function RiskChips({ severity, confidence }: { severity: SeverityLevel; confidence: ConfidenceLevel }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <Chip tone={severity <= 2 ? "rose" : severity === 3 ? "amber" : "neutral"}>{SEVERITY_LABEL[severity]}</Chip>
      <Chip tone="neutral">{CONFIDENCE_LABEL[confidence]} confidence</Chip>
    </div>
  );
}

/** The floating card any real-value cell opens — the one authored example (Slipping · Repeat
 * decay) gets the full threat-score / range / recovery / segments readout; every other value cell
 * only carries what the matrix itself already shows, plus a real "start a room" action. */
export function ValueCellCard({
  rowKey,
  columnKey,
  rowLabel,
  columnLabel,
  value,
  severity,
  confidence,
}: {
  rowKey: string;
  columnKey: string;
  rowLabel: string;
  columnLabel: string;
  value: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
}) {
  const isFeatured = rowKey === FEATURED_CELL.rowKey && columnKey === FEATURED_CELL.columnKey;

  if (!isFeatured) {
    return (
      <div className="p-4">
        <CardEyebrow>
          {rowLabel} · {columnLabel}
        </CardEyebrow>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[22px] font-bold text-rose">{value}</span>
          <span className="text-[11.5px] text-ink-3">expected loss</span>
        </div>
        <RiskChips severity={severity} confidence={confidence} />
        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-line pt-2.5">
          <span className="text-[11.5px] text-ink-3">No room is open on this cell yet.</span>
          <Button asChild size="sm" variant="outline">
            <Link to="/rooms/new">Start a room</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-3">
        <CardEyebrow>
          {rowLabel} · {columnLabel}
        </CardEyebrow>
        <span className="text-[10.5px] font-medium text-ink-3">Threat score {FEATURED_CELL.threatScore}/100</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-rose">{value}</span>
        <span className="text-[11.5px] text-ink-3">expected loss · next 90 days</span>
      </div>
      <p className="mt-0.5 text-[10.5px] text-ink-4">Probability-weighted. Not net of intervention.</p>

      <dl className="mt-2.5 space-y-1 border-t border-line pt-2.5">
        <StatRow label="Range · 80% CI" value={`${FEATURED_CELL.rangeLow} – ${FEATURED_CELL.rangeHigh}`} />
        <StatRow label="Confidence" value={CONFIDENCE_LABEL[confidence]} />
        <StatRow label="Severity" value={SEVERITY_LABEL[severity]} />
        <StatRow label="Recency" value={FEATURED_CELL.recencyDays} />
      </dl>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Recovery estimate</p>
        <p className="mt-1 text-[11.5px] text-ink-2">
          <span className="font-semibold text-ink">{FEATURED_CELL.recoverablePercent}%</span> is realistically
          saveable → net expected loss <span className="font-semibold text-ink">{FEATURED_CELL.netExpectedLoss}</span>
        </p>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
          Most affected segments
        </p>
        <ol className="mt-1.5 space-y-1">
          {FEATURED_CELL.segments.map((segment, i) => (
            <li key={segment.label} className="flex items-baseline justify-between gap-3 text-[11.5px]">
              <span className="text-ink-2">
                {i + 1}. {segment.label}
              </span>
              <span className="font-medium text-ink">{segment.amount}</span>
            </li>
          ))}
        </ol>
        <p className="mt-1 text-[10.5px] text-ink-4">+ {FEATURED_CELL.moreSegments} more segments</p>
      </div>

      <Button asChild size="sm" className="mt-2.5 w-full">
        <Link to={`/rooms/${FEATURED_CELL.room.id}`}>Open operational queue</Link>
      </Button>
    </div>
  );
}

/** The floating card a compound-risk cell opens (05-cell-compound.svg) — a cell whose amount rank
 * and threat rank disagree, because it grows sharply across horizons. */
export function CompoundCellCard({
  rowLabel,
  columnLabel,
  value,
  projection,
  severityNow,
  severityAt12m,
  rankByAmount,
  rankByThreat,
}: {
  rowLabel: string;
  columnLabel: string;
  value: string;
  projection: { horizon: string; value: string }[];
  severityNow: SeverityLevel;
  severityAt12m: SeverityLevel;
  rankByAmount: number;
  rankByThreat: number;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <div className="mt-1.5 flex items-center gap-2">
        <Chip tone="amber">Compound risk</Chip>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-ink">{value}</span>
        <span className="text-[11.5px] text-ink-3">at the current horizon</span>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">
          This leak grows across horizons
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {projection.map((point) => (
            <div key={point.horizon} className="rounded-control bg-paper-2 px-2 py-1.5 text-center">
              <p className="font-mono text-[8.5px] font-medium text-ink-4 uppercase">{point.horizon}</p>
              <p className="mt-0.5 text-[11.5px] font-semibold text-ink">{point.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ink-3">
          Currently <span className="font-semibold text-ink">{SEVERITY_LABEL[severityNow]}</span>. Projects to{" "}
          <span className="font-semibold text-ink">{SEVERITY_LABEL[severityAt12m]}</span> by 12 months.
        </p>
      </div>

      <Button size="sm" variant="outline" className="mt-2.5 w-full">
        View compound projection
      </Button>

      <p className="mt-2.5 border-t border-line pt-2.5 text-[11px] text-ink-2">
        Ranked {ordinal(rankByAmount)} by amount, {ordinal(rankByThreat)} by threat score.
      </p>
    </div>
  );
}

export function ordinal(n: number) {
  const suffixes: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
  return suffixes[n] ?? `${n}th`;
}

/** The floating card a "no exposure" cell opens (04-cell-zero.svg) — measured and empty, and
 * explicitly not the same thing as Unknown or Hidden by filter. */
export function ZeroCellCard({
  rowLabel,
  columnLabel,
  note,
  lastChecked,
}: {
  rowLabel: string;
  columnLabel: string;
  note: string;
  lastChecked: string;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <p className="mt-1.5 text-[16px] font-semibold text-ink">No exposure</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ink-2">{note}</p>

      <div className="mt-2.5 rounded-control border border-line bg-paper-2 p-2.5">
        <p className="text-[11.5px] text-ink-2">Not necessarily zero — it could sit below the detection threshold.</p>
      </div>
      <p className="mt-2 text-[10.5px] text-ink-4">Last checked {lastChecked}</p>
    </div>
  );
}

/** The floating card a gap cell opens (03-cell-unknown.svg) — works for any dashed cell, not
 * just the one the export shows: `explanation` is per-cell. "Connect Stripe" is a placeholder
 * for now — wiring it to the real onboarding connect flow (ConnectSourceModal) glitched here,
 * nested inside this page's own FloatingCard portal; revisit once that's untangled. */
export function GapCellCard({
  rowLabel,
  columnLabel,
  explanation,
  recoveryLow,
  recoveryHigh,
}: {
  rowLabel: string;
  columnLabel: string;
  explanation: string;
  recoveryLow: string;
  recoveryHigh: string;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[20px] font-semibold text-ink">Unknown</span>
        <span className="text-[12px] text-ink-3">exposure is not measurable here</span>
      </div>

      <div className="mt-2.5 flex gap-2 rounded-control border border-amber-border bg-amber-bg p-3">
        <Flag className="mt-0.5 size-3.5 shrink-0 text-amber" aria-hidden />
        <div>
          <p className="text-[12px] font-semibold text-amber">This is a data gap, not a zero</p>
          <p className="mt-0.5 text-[11px] text-amber">The number exists. No connected source can see it.</p>
        </div>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Why</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-2">{explanation}</p>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-2.5">
        <div>
          <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">If you fix it</p>
          <p className="mt-1 text-[11.5px] text-ink-2">
            Estimated additional coverage{" "}
            <span className="font-semibold text-ink">{recoveryLow} – {recoveryHigh}</span>
          </p>
        </div>
        <Button type="button" size="sm" className="shrink-0">
          Connect dunning feed
        </Button>
      </div>
    </div>
  );
}

/** The floating card a cell hidden by the Severity/Confidence filter opens (11-filtered.svg) —
 * the cell is real, just outside the current view. */
export function FilteredCellCard({
  rowLabel,
  columnLabel,
  severity,
  confidence,
  amount,
  onClearFilter,
  onLowerSeverityTo,
}: {
  rowLabel: string;
  columnLabel: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  amount: string;
  onClearFilter: () => void;
  onLowerSeverityTo: (level: SeverityLevel) => void;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <p className="mt-1.5 text-[16px] font-semibold text-ink">Hidden by your filter</p>
      <p className="text-[11.5px] text-ink-3">The cell is measured. It is outside the view you chose.</p>

      <dl className="mt-2.5 space-y-1 border-t border-line pt-2.5">
        <StatRow label="Severity" value={`${SEVERITY_LABEL[severity]} — below your current filter`} />
        <StatRow label="Confidence" value={CONFIDENCE_LABEL[confidence]} />
        <StatRow label="Amount" value={amount} />
      </dl>

      <div className="mt-2.5 flex flex-wrap gap-2 border-t border-line pt-2.5">
        <Button type="button" size="sm" variant="outline" onClick={onClearFilter}>
          Clear severity filter
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => onLowerSeverityTo(severity)}>
          Or lower it to {SEVERITY_LABEL[severity].split(" ")[0]}
        </Button>
      </div>
    </div>
  );
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
        {/* The endpoint refuses on a stage with no measured figure ("a gap is not a question") —
            hidden rather than shown-and-guaranteed-to-fail when nothing here is measured yet, per
            [[feedback_hold_mostly_gated_feature]]. `atStake`/`headline` are the two figures this
            card actually shows, so either being real is what makes the stage answerable. */}
        {(stage.atStake.value !== null || stage.headline.value !== null) && (
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
            {isAskingWhy ? "Asking…" : `Ask ${stage.learnWhy.agentName} why`}
          </button>
        )}
      </div>
    </div>
  );
}
