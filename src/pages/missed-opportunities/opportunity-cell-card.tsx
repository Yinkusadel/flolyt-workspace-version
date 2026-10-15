import { Chip } from "@/components/ui/chip";
import { formatCompactMoney, formatShortDateWithYear } from "@/lib/format-measured-value";
import type { OpportunityCell, OpportunitySignal } from "@/services/api/opportunities/get-opportunities";
import { humanizeEnum, isUnassignedMarket, marketName, sentenceCase } from "@/pages/leakage-map/format";

const SECTION_LABEL = "font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase";

/**
 * One opportunity area. The server's `explanation` carries the title and the plain-language summary; the
 * card never turns "no result" into "no opportunity", and an empty `amounts` with candidates means
 * "evidence-backed but not priced", never a zero.
 */
export function OpportunityCellCard({ cell }: { cell: OpportunityCell }) {
  const { explanation } = cell;
  const title = explanation?.label ?? humanizeEnum(cell.opportunityType);
  const stateChip =
    cell.state === "POPULATED" ? (
      <Chip tone="teal">Signals found</Chip>
    ) : cell.state === "NO_OPPORTUNITY" ? (
      <Chip>No opportunity found</Chip>
    ) : (
      <Chip tone="amber">Not measured</Chip>
    );
  // Only the facts the cell itself carries; the explanation's own states are shown as the server names them.
  const preview = cell.signalPreview ?? [];

  return (
    <article className="rounded-card border border-line bg-paper p-5">
      <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">
        {humanizeEnum(cell.revenueStage)}
        <span className="text-ink-4"> · {humanizeEnum(cell.subjectType)} · {cell.unit}</span>
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
        {stateChip}
        {explanation && explanation.measurementState !== "NOT_RECORDED" && <Chip>{sentenceCase(explanation.measurementState)}</Chip>}
        {explanation && <Chip>Pricing: {sentenceCase(explanation.valuationState).toLowerCase()}</Chip>}
      </div>

      {explanation?.summary && <p className="mt-2 text-[12px] leading-relaxed text-ink-2">{explanation.summary}</p>}

      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
        <Fact label="Candidates" value={cell.candidateCount.toLocaleString()} />
        {cell.signalCount != null && <Fact label="Signals" value={cell.signalCount.toLocaleString()} />}
        {explanation?.eligibleUnits != null && (
          <Fact label={`Eligible ${cell.unit}`} value={explanation.eligibleUnits.toLocaleString()} />
        )}
        {explanation?.usableUnits != null && <Fact label={`Usable ${cell.unit}`} value={explanation.usableUnits.toLocaleString()} />}
      </dl>

      {cell.amounts.length > 0 ? (
        <section className="mt-4 space-y-2">
          <p className={SECTION_LABEL}>Potential, each currency on its own</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {cell.amounts.map((a) => (
              <div key={`${a.currency}|${a.market ?? ""}|${a.calibration}`} className="rounded-control border border-line bg-paper-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-ink-2">{a.currency}</span>
                  <Chip>{humanizeEnum(a.calibration)}</Chip>
                </div>
                <p className="mt-1 font-mono text-[15px] font-semibold text-ink">{formatCompactMoney(a.grossPotential, a.currency)}</p>
                <p className="text-[10.5px] text-ink-3">gross potential</p>
                {a.expectedGain != null && (
                  <p className="mt-1.5 text-[11px] text-ink-2">
                    <span className="font-mono font-medium">{formatCompactMoney(a.expectedGain, a.currency)}</span> expected gain
                  </p>
                )}
                <p className="mt-1 text-[10px] text-ink-4">
                  {a.candidateCount.toLocaleString()} {a.candidateCount === 1 ? "candidate" : "candidates"}
                  {a.market && ` · ${isUnassignedMarket(a.market) ? "Unassigned market" : marketName(a.market)}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        cell.candidateCount > 0 && (
          <p className="mt-4 text-[11.5px] text-ink-3">
            Candidates were found, but the upside is not priced, so no amount is shown.
          </p>
        )
      )}

      {explanation && explanation.reasons.length > 0 && (
        <section className="mt-4 space-y-2">
          <p className={SECTION_LABEL}>Why</p>
          <ul className="space-y-2">
            {explanation.reasons.map((reason) => (
              <li key={reason.code} className="rounded-control border border-line bg-paper-2 px-3 py-2">
                <p className="text-[11.5px] leading-relaxed text-ink-2">{reason.message}</p>
                {reason.actionLabel && <p className="mt-0.5 text-[10.5px] text-ink-3">Suggested: {reason.actionLabel}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {explanation && explanation.missingRequirements.length > 0 && (
        <p className="mt-3 text-[11px] text-ink-3">Needs {explanation.missingRequirements.join(", ")}</p>
      )}

      {preview.length > 0 && (
        <section className="mt-4 space-y-2">
          <p className={SECTION_LABEL}>
            {cell.signalCount != null && preview.length < cell.signalCount
              ? `Preview: ${preview.length} of ${cell.signalCount.toLocaleString()} signals`
              : `Signals (${preview.length})`}
          </p>
          <div className="divide-y divide-line/70 rounded-control border border-line">
            {preview.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      )}

      {cell.limitations.length > 0 && (
        <section className="mt-4 space-y-2">
          <p className={SECTION_LABEL}>Limitations</p>
          <ul className="space-y-2">
            {cell.limitations.map((limitation, i) => (
              <li key={i} className="rounded-control border border-line bg-paper-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-2">
                {limitation}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] text-ink-4">{label}</dt>
      <dd className="font-mono text-[13px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** Qualification and pricing are shown separately; an unknown window or owner is simply left out, never shown as zero. */
function SignalRow({ signal }: { signal: OpportunitySignal }) {
  const { valuation } = signal;
  const priced = signal.pricingState === "PRICED" && valuation.currency;
  const closes = signal.availableWindow?.closesAtUtc;
  return (
    <div className="p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11.5px] font-medium text-ink-2">{signal.label}</span>
        <span className="flex gap-1.5">
          <Chip>{sentenceCase(signal.stage)}</Chip>
          <Chip tone={priced ? "teal" : "neutral"}>{priced ? "Priced" : "Not priced"}</Chip>
        </span>
      </div>
      <p className="mt-0.5 text-[10.5px] text-ink-3">{signal.revenuePath}</p>
      {priced && valuation.currency && (
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-ink-2">
          {valuation.grossOpportunity != null && (
            <span>
              <span className="font-mono font-medium">{formatCompactMoney(valuation.grossOpportunity, valuation.currency)}</span> gross
            </span>
          )}
          {valuation.expectedGain != null && (
            <span>
              <span className="font-mono font-medium">{formatCompactMoney(valuation.expectedGain, valuation.currency)}</span> expected
            </span>
          )}
          {valuation.netExpectedGain != null && (
            <span>
              <span className="font-mono font-medium">{formatCompactMoney(valuation.netExpectedGain, valuation.currency)}</span> net
            </span>
          )}
        </p>
      )}
      <p className="mt-1 text-[10px] text-ink-4">
        {signal.subjectReference} · signal confidence {signal.confidence.toFixed(2)}
        {signal.market && ` · ${isUnassignedMarket(signal.market) ? "Unassigned market" : marketName(signal.market)}`}
        {closes && ` · window closes ${formatShortDateWithYear(closes)}`}
        {signal.owner && ` · owner ${signal.owner.reference}`}
      </p>
      {signal.evidence.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {signal.evidence.map((line, i) => (
            <li key={i} className="text-[10.5px] leading-relaxed text-ink-3">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
