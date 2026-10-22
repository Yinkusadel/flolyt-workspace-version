import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatShortDateWithYear } from "@/lib/format-measured-value";
import { useGetLeakageCellEvidence } from "@/features/leakage/use-get-leakage-cell-evidence";
import type { LeakageEvidenceV2 } from "@/services/api/leakage/get-leakage-cell-evidence";
import { availabilityPhrase, humanizeEnum, MODE_TITLE, sentenceCase } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS, SectionLabel } from "@/pages/leakage-map/drawer/shared";

/** A cell's evidence can carry over a thousand limitations, so they reveal in steps. */
const LIMITATION_STEP = 25;

interface EvidenceTabProps {
  cellId: string;
  mode?: string;
  horizon?: string;
  horizonDays?: number;
  lifecycleClass?: string;
}

/**
 * "Why this number": the server's own explanation of a cell, from `GET /cells/{id}/evidence`. It is fetched
 * only when the tab opens (the response is large) and shows what the other tabs do not: the question the
 * number answers, the formulas and policy values behind it, where the data came from, how much of the
 * population was usable, every recorded limitation, and the server's permitted next steps. Components and
 * signals stay on their own tabs.
 */
export function EvidenceTab({ cellId, mode, horizon, horizonDays, lifecycleClass }: EvidenceTabProps) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellEvidence({ cellId, mode, horizon, horizonDays, lifecycleClass });
  const evidence = data?.data;

  if (isLoading) return <EvidenceSkeleton />;
  if (isError || !evidence) {
    return (
      <div>
        <p className="text-[11.5px] text-rose">Couldn't load the evidence for this cell.</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QuestionBlock evidence={evidence} />
      <CalculationBlock evidence={evidence} />
      <SourcesBlock evidence={evidence} />
      <CoverageBlock evidence={evidence} />
      <LimitationsBlock limitations={evidence.limitations} />
      <ActionsBlock evidence={evidence} />
    </div>
  );
}

/**
 * The server's `question` sentence carries raw figures ("NGN 644982") and an enum stage ("RETAIN") inside one
 * string, so it cannot be formatted. The heading is built from the same response's structured fields instead,
 * with each currency's figure formatted on its own and nothing added across currencies.
 */
function QuestionBlock({ evidence }: { evidence: LeakageEvidenceV2 }) {
  const { cell, selection } = evidence;
  const mode = MODE_TITLE[selection.mode.toUpperCase()] ?? humanizeEnum(selection.mode);
  return (
    <div className="space-y-2.5">
      <p className="text-[13px] leading-relaxed font-medium text-ink">
        Why is {cell.coordinate.mechanismLabel} showing these amounts at {sentenceCase(cell.coordinate.revenueStageLabel)} over {selection.horizonDays} days?
      </p>
      {cell.amounts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cell.amounts.map((a) => (
            <Chip key={`${a.currency}|${a.market}|${a.lifecycleClass}`}>
              <span className="font-mono">{formatCompactMoney(a.value, a.currency)}</span>
              <span className="text-ink-4"> {a.currency}</span>
            </Chip>
          ))}
          <span className="self-center text-[10.5px] text-ink-4">{mode}</span>
        </div>
      )}
    </div>
  );
}

function CalculationBlock({ evidence }: { evidence: LeakageEvidenceV2 }) {
  if (evidence.calculationFormulas.length === 0 && evidence.calculationPolicies.length === 0) return null;
  const days = String(evidence.selection.horizonDays);
  return (
    <section className="space-y-2.5">
      <SectionLabel>How it is calculated</SectionLabel>
      {evidence.calculationFormulas.length > 0 && (
        <div className="space-y-1.5 rounded-control border border-line bg-paper-2 p-3">
          {evidence.calculationFormulas.map((formula) => (
            <p key={formula} className="font-mono text-[11px] leading-relaxed text-ink-2">
              {formula}
            </p>
          ))}
        </div>
      )}
      {evidence.calculationPolicies.map((policy) => {
        const ramp = policy.rampFactors[days];
        return (
          <div key={`${policy.sector}|${policy.mechanism}`} className="rounded-card border border-line p-3">
            <p className="text-[11.5px] font-medium text-ink-2">
              {humanizeEnum(policy.mechanism)} · {humanizeEnum(policy.sector)}
            </p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
              <Stat label="Probability" value={policy.probability} />
              <Stat label="Recovery rate" value={policy.recoveryRate} />
              {ramp != null && <Stat label={`Ramp factor at ${evidence.selection.horizonDays}d`} value={ramp} />}
            </dl>
            <p className="mt-2.5 text-[10.5px] leading-relaxed text-ink-3">{policy.baselineBasis}</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-3">{policy.recoveryBasis}</p>
          </div>
        );
      })}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[10.5px] text-ink-4">{label}</dt>
      <dd className="font-mono text-[12px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function SourcesBlock({ evidence }: { evidence: LeakageEvidenceV2 }) {
  if (evidence.lineage.length === 0) return null;
  return (
    <section className="space-y-2.5">
      <SectionLabel>Where the data comes from</SectionLabel>
      <div className="divide-y divide-line/70 rounded-card border border-line">
        {evidence.lineage.map((entry, i) => (
          <div key={`${entry.signalId}-${i}`} className="p-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11.5px] font-medium text-ink-2">{entry.capabilityId}</span>
              <span className="text-[10.5px] text-ink-3">{availabilityPhrase(entry.sourceAvailability)}</span>
            </div>
            {entry.explanation && <p className="mt-1 text-[11px] leading-relaxed text-ink-3">{entry.explanation}</p>}
            {entry.missingRequirements.length > 0 && (
              <p className="mt-1 text-[10.5px] text-ink-3">Needs {entry.missingRequirements.join(", ")}</p>
            )}
            {entry.candidates.map((c) => (
              <div key={c.sourceId} className="mt-2 rounded-control border border-line bg-paper-2 p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11.5px] font-medium text-ink-2">{c.sourceName}</p>
                  <Chip tone={c.state === "AVAILABLE" ? "teal" : "neutral"}>{humanizeEnum(c.state)}</Chip>
                </div>
                <p className="mt-1 text-[10px] text-ink-4">
                  {c.quality != null && `quality ${c.quality}`}
                  {c.populationCoverage != null && ` · population coverage ${c.populationCoverage}`}
                  {c.mappingVersion && ` · mapping ${c.mappingVersion}`}
                  {c.observedAtUtc && ` · observed ${formatShortDateWithYear(c.observedAtUtc)}`}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CoverageBlock({ evidence }: { evidence: LeakageEvidenceV2 }) {
  if (evidence.coverage.length === 0) return null;
  return (
    <section className="space-y-2.5">
      <SectionLabel>How much of the population was usable</SectionLabel>
      <div className="divide-y divide-line/70 rounded-card border border-line">
        {evidence.coverage.map((c) => (
          <div key={c.signalId} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 p-3">
            <span className="text-[11.5px] text-ink-2">{c.signalId}</span>
            <span className="font-mono text-[11.5px] font-medium text-ink">
              {c.usableUnits.toLocaleString()} of {c.eligibleUnits.toLocaleString()} {c.subject.unit}
            </span>
            <p className="w-full text-[10px] text-ink-4">
              {humanizeEnum(c.maturity)} · run {humanizeEnum(c.runOutcome).toLowerCase()}
              {c.missingJoinUnits > 0 && ` · ${c.missingJoinUnits.toLocaleString()} missing a join`}
              {c.missingValueUnits > 0 && ` · ${c.missingValueUnits.toLocaleString()} missing a value`}
              {c.residualUnknownUnits > 0 && ` · ${c.residualUnknownUnits.toLocaleString()} unknown`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LimitationsBlock({ limitations }: { limitations: string[] }) {
  const [shown, setShown] = useState(LIMITATION_STEP);
  return (
    <section className="space-y-2.5">
      <SectionLabel>Limitations ({limitations.length.toLocaleString()})</SectionLabel>
      {limitations.length === 0 ? (
        <p className="text-[11.5px] text-ink-3">The server recorded no limitations for this cell.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {limitations.slice(0, shown).map((limitation, i) => (
              <li key={i} className="rounded-control border border-line bg-paper-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-2">
                {limitation}
              </li>
            ))}
          </ul>
          {shown < limitations.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + LIMITATION_STEP)}
              className="text-[11.5px] font-medium text-ultra hover:underline"
            >
              Show {Math.min(LIMITATION_STEP, limitations.length - shown)} more ({(limitations.length - shown).toLocaleString()} left)
            </button>
          )}
        </>
      )}
    </section>
  );
}

/** Only the server's permitted, eligible Room link is offered; the "review this cell" action is where the person already is. */
function ActionsBlock({ evidence }: { evidence: LeakageEvidenceV2 }) {
  const room = evidence.suggestedActions.find((a) => a.target.resource === "room" && a.target.resourceId);
  if (!room) return null;
  return (
    <section className="space-y-2.5">
      <SectionLabel>Next step</SectionLabel>
      {room.eligibility.eligible ? (
        <Button asChild type="button" size="sm" className={PRIMARY_ACTION_CLASS}>
          <Link to={`/rooms/${room.target.resourceId}`}>{room.label}</Link>
        </Button>
      ) : (
        <p className="text-[11.5px] text-ink-3">{room.eligibility.reason ?? "This action is not available right now."}</p>
      )}
    </section>
  );
}

function EvidenceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2.5">
          <Skeleton className="h-2.5 w-32" />
          <Skeleton className="h-20 w-full rounded-card" />
        </div>
      ))}
    </div>
  );
}
