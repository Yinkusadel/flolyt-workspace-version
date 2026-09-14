import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  ADOPT_STAGE_DETAIL,
  CONFIDENCE_LABEL,
  FEATURED_CELL,
  RETAIN_STAGE_ROLLUP,
  SEVERITY_LABEL,
  type ConfidenceLevel,
  type SeverityLevel,
  type Stage,
} from "@/pages/leakage-map/data";

const VALUE_TONE_CLASS = { rose: "text-rose", teal: "text-teal" } as const;

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
      <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-4">
        A cell ranked {ordinal(rankByAmount)} by amount can be the {ordinal(rankByThreat)} most urgent thing on this
        page. Shading is amount, ranking is threat score — this is the cell where the two disagree most, which is
        exactly why the page says so twice.
      </p>
    </div>
  );
}

function ordinal(n: number) {
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
      <p className="mt-1.5 text-[11px] text-ink-3">Not necessarily zero — it could sit below the detection threshold.</p>
      <p className="mt-2 text-[10.5px] text-ink-4">Last checked {lastChecked}</p>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="text-[11px] font-medium text-ink-2">Three ways a cell can be empty, and they are not the same</p>
        <dl className="mt-2 space-y-1">
          <div className="text-[10.5px]">
            <dt className="inline font-semibold text-ink">No exposure</dt>
            <dd className="inline text-ink-3"> · measured, nothing there</dd>
          </div>
          <div className="text-[10.5px]">
            <dt className="inline font-semibold text-ink">Unknown</dt>
            <dd className="inline text-ink-3"> · exists, not measurable — connect a source</dd>
          </div>
          <div className="text-[10.5px]">
            <dt className="inline font-semibold text-ink">Hidden by filter</dt>
            <dd className="inline text-ink-3"> · measured, outside your current view</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/** The floating card a gap cell opens — works for any dashed cell, not just the one the export
 * shows: `explanation`/`wouldUnlock` are per-cell. "Connect Stripe" is a placeholder for now —
 * wiring it to the real onboarding connect flow (ConnectSourceModal) glitched here, nested inside
 * this page's own FloatingCard portal; revisit once that's untangled. */
export function GapCellCard({
  rowLabel,
  columnLabel,
  missingSource,
  explanation,
  wouldUnlock,
  recoveryLow,
  recoveryHigh,
}: {
  rowLabel: string;
  columnLabel: string;
  missingSource: string;
  explanation: string;
  wouldUnlock: string;
  recoveryLow: string;
  recoveryHigh: string;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <p className="mt-1.5 text-[16px] font-semibold text-ink">Unknown</p>
      <p className="text-[11px] text-ink-3">exposure is not measurable here</p>

      <div className="mt-2.5">
        <Chip tone="neutral">Unavailable · {missingSource}</Chip>
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink-2">
        <span className="font-semibold text-ink">This is a data gap, not a zero.</span> The number exists. No
        connected source can see it.
      </p>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Why</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-2">{explanation}</p>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">If you fix it</p>
        <p className="mt-1 text-[11.5px] text-ink-2">
          Estimated additional coverage <span className="font-semibold text-ink">{recoveryLow} – {recoveryHigh}</span>
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-line pt-2.5">
        <span className="text-[11px] text-ink-3">{wouldUnlock}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span className="text-[10.5px] text-ink-4">Never estimated</span>
        <Button type="button" size="sm">
          Connect dunning feed
        </Button>
      </div>

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="text-[10.5px] font-medium text-ink-2">Why the word changed</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-4">
          "Unavailable" implies the number does not exist. "Unknown — data gap" says it exists and is not measured.
          Different mental model, different action: one invites a shrug, the other names a source to connect.
        </p>
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
  hiddenPercent,
  onClearFilter,
  onLowerSeverityTo,
}: {
  rowLabel: string;
  columnLabel: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  amount: string;
  hiddenPercent: number;
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

      <div className="mt-2.5 border-t border-line pt-2.5">
        <p className="text-[10.5px] font-medium text-ink-2">A filtered total is not a total</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-4">
          Every figure on this page now describes {100 - hiddenPercent}% of the cells. The warning stays up for as
          long as that is true, because a number that quietly means something narrower than it says is worse than no
          number.
        </p>
      </div>
    </div>
  );
}

/** The floating card a stage card opens — Adopt keeps its authored operational drilldown + a
 * "Learn why" hop to the existing conversation surface; Retain gets the export's own rollup
 * worked example (coverage, unattributed amount, top mechanisms); every other stage only restates
 * what its own rail card already shows. */
export function StageDetailCard({ stage }: { stage: Stage }) {
  const navigate = useNavigate();
  const isAdopt = stage.id === ADOPT_STAGE_DETAIL.stageId;
  const isRetain = stage.id === RETAIN_STAGE_ROLLUP.stageId;
  const leakWord = stage.valueTone === "teal" ? "generated at this stage" : "leaking at this stage";

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: stage.dot }} aria-hidden />
        <CardEyebrow>
          {stage.number} · {stage.label}
        </CardEyebrow>
        {isAdopt && <span className="text-[10.5px] text-ink-4">{ADOPT_STAGE_DETAIL.owner}</span>}
      </div>

      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <span className={cn("text-[22px] font-bold", VALUE_TONE_CLASS[stage.valueTone])}>{stage.value}</span>
        <span className="text-[11.5px] text-ink-3">{leakWord} · last 90 days</span>
      </div>
      {!isRetain && (
        <p className="mt-1 text-[10.5px] text-ink-4">{stage.coveragePercent}% covered · independent from the matrix</p>
      )}

      {isAdopt ? (
        <>
          <dl className="mt-2.5 grid grid-cols-3 gap-2 border-t border-line pt-2.5">
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                Customers in stage
              </dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-ink">{ADOPT_STAGE_DETAIL.customersInStage}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                Median features
              </dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-ink">{ADOPT_STAGE_DETAIL.medianFeaturesReached}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">
                Slipped out last quarter
              </dt>
              <dd className="mt-0.5 text-[13px] font-semibold text-ink">{ADOPT_STAGE_DETAIL.slippedOutLastQuarter}</dd>
            </div>
          </dl>
          <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] text-ink-3">{ADOPT_STAGE_DETAIL.spansNote}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/new-conversation", {
                state: {
                  prefillPrompt: `Why is ${stage.value} leaking at the ${stage.label} stage? ${ADOPT_STAGE_DETAIL.customersInStage} customers are in this stage and the median has reached only ${ADOPT_STAGE_DETAIL.medianFeaturesReached} features, with ${ADOPT_STAGE_DETAIL.slippedOutLastQuarter} slipping out before adopting more.`,
                },
              })
            }
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-control border border-line bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2 hover:bg-paper"
          >
            <HelpCircle className="size-3.5" />
            Learn why
          </button>
        </>
      ) : isRetain ? (
        <>
          <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] text-ink-3">{RETAIN_STAGE_ROLLUP.summary}</p>

          <div className="mt-2.5 border-t border-line pt-2.5">
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Coverage</p>
            <p className="mt-1 text-[11.5px] text-ink-2">
              {RETAIN_STAGE_ROLLUP.coveragePercent}% of detectable Retain leaks are in this rollup.
            </p>
            <p className="mt-1 text-[10.5px] text-ink-4">
              Unattributed: {RETAIN_STAGE_ROLLUP.unattributedAmount} ({RETAIN_STAGE_ROLLUP.unattributedPercent}%) —
              not yet mapped to a mechanism.
            </p>
          </div>

          <div className="mt-2.5 border-t border-line pt-2.5">
            <p className="font-mono text-[9px] font-medium tracking-[0.6px] text-ink-4 uppercase">Top mechanisms</p>
            <ol className="mt-1.5 space-y-1">
              {RETAIN_STAGE_ROLLUP.topMechanisms.map((mechanism, i) => (
                <li key={mechanism.label} className="flex items-baseline justify-between gap-3 text-[11.5px]">
                  <span className="text-ink-2">
                    {i + 1}. {mechanism.label}
                  </span>
                  <span className="font-medium text-ink">{mechanism.value}</span>
                </li>
              ))}
            </ol>
          </div>

          <dl className="mt-2.5 flex items-baseline justify-between gap-3 border-t border-line pt-2.5 text-[11.5px]">
            <dt className="text-ink-3">Confidence · range 80% CI</dt>
            <dd className="font-medium text-ink">
              {RETAIN_STAGE_ROLLUP.confidence} · {RETAIN_STAGE_ROLLUP.rangeLow} – {RETAIN_STAGE_ROLLUP.rangeHigh}
            </dd>
          </dl>
        </>
      ) : (
        <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] text-ink-3">{stage.metricLines.join(" · ")}</p>
      )}
    </div>
  );
}
