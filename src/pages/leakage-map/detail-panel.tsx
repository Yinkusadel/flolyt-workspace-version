import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ADOPT_STAGE_DETAIL, FEATURED_CELL, type Stage } from "@/pages/leakage-map/data";

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
}: {
  rowLabel: string;
  columnLabel: string;
  missingSource: string;
  explanation: string;
  wouldUnlock: string;
}) {
  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <div className="mt-2">
        <Chip tone="neutral">Unavailable · {missingSource}</Chip>
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink-2">{explanation}</p>

      <div className="mt-3.5 border-t border-line pt-3">
        <p className="text-[11px] text-ink-3">{wouldUnlock}</p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="text-[10.5px] text-ink-4">Never estimated</span>
          <Button type="button" size="sm">
            Connect Stripe
          </Button>
        </div>
      </div>
    </div>
  );
}

/** The floating card any real-value cell opens — the one authored example (Slipping · Repeat
 * decay) gets the full "customers / second-order rate / room" readout; every other cell only
 * carries what the matrix itself already shows, plus a real "start a room" action. */
export function ValueCellCard({
  rowKey,
  columnKey,
  rowLabel,
  columnLabel,
  value,
}: {
  rowKey: string;
  columnKey: string;
  rowLabel: string;
  columnLabel: string;
  value: string;
}) {
  const isFeatured = rowKey === FEATURED_CELL.rowKey && columnKey === FEATURED_CELL.columnKey;

  return (
    <div className="p-4">
      <CardEyebrow>
        {rowLabel} · {columnLabel}
      </CardEyebrow>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-rose">{value}</span>
        <span className="text-[11.5px] text-ink-3">{FEATURED_CELL.atRiskWindow}</span>
      </div>

      {isFeatured ? (
        <>
          <dl className="mt-3 space-y-1.5 border-t border-line pt-3">
            <StatRow label="Customers in this cell" value={FEATURED_CELL.customersInCell} />
            <StatRow
              label="Second-order rate"
              value={`${FEATURED_CELL.secondOrderRateFrom} → ${FEATURED_CELL.secondOrderRateTo}`}
            />
            <StatRow label="Since" value={FEATURED_CELL.since} />
          </dl>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose" aria-hidden />
              <span className="text-[11.5px] text-ink-2">{FEATURED_CELL.room.label}</span>
            </div>
            <Button asChild size="sm">
              <Link to={`/rooms/${FEATURED_CELL.room.id}`}>Open room</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <span className="text-[11.5px] text-ink-3">No room is open on this cell yet.</span>
          <Button asChild size="sm" variant="outline">
            <Link to="/rooms/new">Start a room</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

/** The floating card a stage card opens — Adopt (the export's own worked example) gets the full
 * readout + a "Learn why" note synthesized only from numbers already on this card; every other
 * stage only restates what its own rail card already shows. */
export function StageDetailCard({ stage }: { stage: Stage }) {
  const navigate = useNavigate();
  const isAdopt = stage.id === ADOPT_STAGE_DETAIL.stageId;
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

      {isAdopt ? (
        <>
          <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
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
          <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-ink-3">{ADOPT_STAGE_DETAIL.spansNote}</p>

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
      ) : (
        <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-ink-3">{stage.metricLines.join(" · ")}</p>
      )}
    </div>
  );
}
