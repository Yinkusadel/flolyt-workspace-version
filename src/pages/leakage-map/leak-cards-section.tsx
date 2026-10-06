import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Amount, LeakageV2Cell, LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import type { LeakageExecutive } from "@/services/api/leakage/leakage-executive-types";
import {
  availabilityPhrase,
  compareCurrencies,
  formatHeadlineMoney,
  humanizeEnum,
  isUnassignedMarket,
  marketName,
  mechanismDotClass,
} from "@/pages/leakage-map/format";

interface LeakCardsSectionProps {
  cells: LeakageV2Cell[];
  executive: LeakageExecutive | undefined;
  controls: LeakageV2Controls;
  /** The page's currency filter. The server leaves a cell's other currencies in place, so the cards narrow to it here. */
  currencyFilter: string | null;
  /** Wired in a later step (the detail drawer / exact calculation drawer). A button only renders when its handler exists. */
  onOpenDetails?: (cellId: string) => void;
  onOpenCalculation?: (calculationReference: string) => void;
}

interface StageGroup {
  stage: string;
  label: string;
  cells: LeakageV2Cell[];
}

interface SectorGroup {
  sector: string;
  label: string;
  stages: StageGroup[];
}

/**
 * Where revenue leaks: one card per cell, grouped by revenue stage. The stages are whatever the data has,
 * titled with the API's own `revenueStageLabel` and kept in the order the API sends them (the contract
 * sends no stage order, and none is imposed here). With more than one sector (`showSectorBreakdown`) the
 * stages are grouped under their sector first. Every currency a leak has is listed on its card, each on its
 * own and never combined; the page's currency filter narrows the cards to that one currency. Cells hidden by
 * a filter are not drawn.
 */
export function LeakCardsSection({ cells, executive, controls, currencyFilter, onOpenDetails, onOpenCalculation }: LeakCardsSectionProps) {
  const reportingCurrency = executive?.reportingCurrency ?? controls.reportingCurrency;
  const visible = useMemo(() => cells.filter((c) => c.state.display !== "HIDDEN_BY_FILTER"), [cells]);

  const sectors = useMemo(() => groupCells(visible), [visible]);
  const showSectors = (executive?.showSectorBreakdown ?? false) && sectors.length > 1;

  if (visible.length === 0) {
    return (
      <section aria-label="Where revenue leaks" className="rounded-card border border-dashed border-line bg-paper p-5">
        <h2 className="text-[13px] font-semibold text-ink">Where revenue leaks</h2>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Nothing is visible under the current filters. Clear a filter to see every leak type again.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Where revenue leaks" className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Where revenue leaks</h2>
          <p className="mt-0.5 text-[11.5px] text-ink-3">
            Each leak type, grouped by where it happens. Hatched cards cannot be measured yet.
          </p>
        </div>
        <p className="text-[10.5px] text-ink-3">
          {currencyFilter ? `Showing ${currencyFilter} only (currency filter)` : "Each currency on its own, never added together"}
        </p>
      </div>

      <div className="mt-4 space-y-6">
        {sectors.map((sector) => (
          <div key={sector.sector} className="space-y-5">
            {showSectors && (
              <h3 className="border-b border-line pb-1.5 text-[12px] font-semibold text-ink">{sector.label}</h3>
            )}
            {sector.stages.map((stage) => (
              <StageBlock
                key={stage.stage}
                stage={stage}
                currencyFilter={currencyFilter}
                reportingCurrency={reportingCurrency}
                onOpenDetails={onOpenDetails}
                onOpenCalculation={onOpenCalculation}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Groups by sector and then stage, each in order of first appearance in the API's list. */
function groupCells(cells: LeakageV2Cell[]): SectorGroup[] {
  const sectors = new Map<string, SectorGroup>();
  for (const cell of cells) {
    const sector = sectors.get(cell.sector) ?? { sector: cell.sector, label: cell.sectorLabel, stages: [] };
    let stage = sector.stages.find((s) => s.stage === cell.coordinate.revenueStage);
    if (!stage) {
      stage = { stage: cell.coordinate.revenueStage, label: cell.coordinate.revenueStageLabel, cells: [] };
      sector.stages.push(stage);
    }
    stage.cells.push(cell);
    sectors.set(cell.sector, sector);
  }
  return [...sectors.values()];
}

function StageBlock({
  stage,
  currencyFilter,
  reportingCurrency,
  onOpenDetails,
  onOpenCalculation,
}: {
  stage: StageGroup;
  currencyFilter: string | null;
  reportingCurrency: string | null;
  onOpenDetails?: (cellId: string) => void;
  onOpenCalculation?: (calculationReference: string) => void;
}) {
  const measured = stage.cells.filter((c) => c.state.display === "POPULATED" || c.state.display === "NO_EXPOSURE").length;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[10px] font-medium tracking-[0.8px] text-ink-3 uppercase">{stage.label}</h3>
        <p className="text-[10.5px] text-ink-4">
          {measured} of {stage.cells.length} measured
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {stage.cells.map((cell) => (
          <LeakCard
            key={cell.id}
            cell={cell}
            currencyFilter={currencyFilter}
            reportingCurrency={reportingCurrency}
            onOpenDetails={onOpenDetails}
            onOpenCalculation={onOpenCalculation}
          />
        ))}
      </div>
    </div>
  );
}

/** Currencies listed on a card before the rest sit behind "+N more", so a leak with many currencies stays compact. */
const VISIBLE_CURRENCY_ROWS = 4;

function LeakCard({
  cell,
  currencyFilter,
  reportingCurrency,
  onOpenDetails,
  onOpenCalculation,
}: {
  cell: LeakageV2Cell;
  currencyFilter: string | null;
  reportingCurrency: string | null;
  onOpenDetails?: (cellId: string) => void;
  onOpenCalculation?: (calculationReference: string) => void;
}) {
  const { coordinate, state } = cell;
  const [showAllRows, setShowAllRows] = useState(false);
  // Every currency the leak has, reporting currency first then by code (position only, never by amount); the
  // page's currency filter narrows it to one. Nothing is added or converted.
  const byCurrency = compareCurrencies(reportingCurrency);
  const amounts = (currencyFilter ? cell.amounts.filter((a) => a.currency === currencyFilter) : [...cell.amounts]).sort(
    (a, b) => byCurrency(a.currency, b.currency) || a.lifecycleClass.localeCompare(b.lifecycleClass)
  );
  const multi = amounts.length > 1;
  const unmeasured = state.display === "UNKNOWN";
  const noExposure = state.display === "NO_EXPOSURE";
  const lead = amounts[0];
  const shownRows = showAllRows ? amounts : amounts.slice(0, VISIBLE_CURRENCY_ROWS);
  // With one amount the card keeps its single-figure look, with its own "How calculated" link; with several, each
  // currency row opens its own calculation and the footer link is replaced by a hint.
  const hasFooter = !unmeasured && ((onOpenCalculation && lead) || onOpenDetails);

  return (
    <article
      aria-label={`${coordinate.mechanismLabel}, ${coordinate.revenueStageLabel}`}
      className={cn(
        "flex flex-col rounded-card border p-4",
        unmeasured ? "border-line bg-[repeating-linear-gradient(135deg,var(--color-paper-2)_0_6px,transparent_6px_12px)]" : "border-line bg-paper"
      )}
    >
      <header className="flex items-start gap-2">
        <span className={cn("mt-1 size-2 shrink-0 rounded-[2px]", mechanismDotClass(coordinate.mechanism))} aria-hidden />
        <div className="min-w-0 flex-1">
          <h4 className="text-[12.5px] font-semibold text-ink">{coordinate.mechanismLabel}</h4>
          <p className="mt-0.5 text-[10.5px] text-ink-3">
            {coordinate.stateDimensionLabel} → {coordinate.stateValueLabel} · {coordinate.subject.unit}
          </p>
        </div>
        {amounts.some((a) => isUnassignedMarket(a.market)) && (
          <span className="shrink-0 rounded-chip border border-dashed border-ultra-border bg-ultra-bg/50 px-1.5 py-px text-[9.5px] font-medium text-ultra">
            Unassigned
          </span>
        )}
      </header>

      <div className="mt-3 flex-1">
        {unmeasured ? (
          <Unmeasured cell={cell} onOpenDetails={onOpenDetails} />
        ) : noExposure ? (
          <p className="text-[12px] font-medium text-ink-2">Measured: no exposure found</p>
        ) : amounts.length === 0 ? (
          <p className="text-[11.5px] text-ink-3">No amount in {currencyFilter ?? "any currency"}</p>
        ) : multi ? (
          <div className="space-y-3">
            <ul className="divide-y divide-line/70">
              {shownRows.map((amount) => (
                <CurrencyRow
                  key={`${amount.currency}:${amount.market}:${amount.lifecycleClass}`}
                  amount={amount}
                  onOpenCalculation={onOpenCalculation}
                />
              ))}
            </ul>
            {amounts.length > VISIBLE_CURRENCY_ROWS && (
              <button
                type="button"
                onClick={() => setShowAllRows((prev) => !prev)}
                className="text-[10.5px] font-medium text-ultra hover:underline"
              >
                {showAllRows ? "Show fewer currencies" : `+${amounts.length - VISIBLE_CURRENCY_ROWS} more ${amounts.length - VISIBLE_CURRENCY_ROWS === 1 ? "currency" : "currencies"}`}
              </button>
            )}
            {state.facets.includes("COMPOUND") && (
              <div className="flex flex-wrap gap-1.5">
                <Tag>Compound</Tag>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AmountBlock amount={lead} labelled={false} lead />
            <div className="flex flex-wrap gap-1.5">
              <SeverityChip severity={lead.severity} />
              <ConfidenceChip level={lead.confidenceLevel} />
              {state.facets.includes("COMPOUND") && <Tag>Compound</Tag>}
            </div>
          </div>
        )}
      </div>

      {hasFooter && (
        <footer className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
          {onOpenCalculation && lead && !multi ? (
            <button
              type="button"
              onClick={() => onOpenCalculation(lead.calculationReference)}
              className="text-[11.5px] font-medium text-ultra hover:underline"
            >
              How calculated
            </button>
          ) : multi ? (
            <span className="text-[10.5px] text-ink-4">Tap a currency to see how it is calculated</span>
          ) : (
            <span />
          )}
          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(cell.id)}
              className="rounded-control border border-ultra bg-ultra px-3 py-1.5 text-[11.5px] font-medium text-paper hover:bg-ultra/90"
            >
              Details
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

/**
 * One currency of a multi-currency leak: the currency code (a link to that amount's exact calculation), its own
 * figure and confidence, and a muted line with the lifecycle, candidate count and range. Each row is a separate
 * measurement in its own currency, never a share of a total.
 */
function CurrencyRow({
  amount,
  onOpenCalculation,
}: {
  amount: LeakageV2Amount;
  onOpenCalculation?: (calculationReference: string) => void;
}) {
  const showRange = amount.range.status !== "UNAVAILABLE" && amount.range.lower != null && amount.range.upper != null;
  const notRated = amount.confidenceLevel.toUpperCase() === "NOT_AVAILABLE";
  const detail = [
    humanizeEnum(amount.lifecycleClass),
    `${amount.candidateCount} ${amount.candidateCount === 1 ? "candidate" : "candidates"}`,
    ...(showRange
      ? [`Range ${formatCompactMoney(amount.range.lower as number, amount.currency)} to ${formatCompactMoney(amount.range.upper as number, amount.currency)}`]
      : []),
  ].join(" · ");
  return (
    <li className="py-2 first:pt-0 last:pb-0">
      <div className="flex items-baseline gap-2">
        {onOpenCalculation ? (
          <button
            type="button"
            onClick={() => onOpenCalculation(amount.calculationReference)}
            title="See how this amount is calculated"
            className="w-9 shrink-0 text-left font-mono text-[11px] font-semibold text-ultra underline decoration-ultra/40 underline-offset-2 hover:decoration-ultra"
          >
            {amount.currency}
          </button>
        ) : (
          <span className="w-9 shrink-0 font-mono text-[11px] font-semibold text-ink">{amount.currency}</span>
        )}
        <span className="min-w-0 flex-1 font-mono text-[15px] font-semibold tracking-tight text-ink">
          {formatHeadlineMoney(amount.value, amount.currency)}
        </span>
        <span className="shrink-0 text-[10px] text-ink-3">{notRated ? "Not rated" : `${humanizeEnum(amount.confidenceLevel)} confidence`}</span>
      </div>
      <p className="mt-0.5 pl-11 text-[10px] leading-snug text-ink-4">
        {detail}
      </p>
    </li>
  );
}

function AmountBlock({ amount, labelled, lead }: { amount: LeakageV2Amount; labelled: boolean; lead: boolean }) {
  const showRange = amount.range.status !== "UNAVAILABLE" && amount.range.lower != null && amount.range.upper != null;
  return (
    <div>
      {labelled && (
        <p className="mb-0.5 text-[10px] text-ink-4">
          {marketName(amount.market ?? "UNASSIGNED")} · {humanizeEnum(amount.lifecycleClass)}
        </p>
      )}
      <p className={cn("font-mono font-semibold tracking-tight text-ink", lead ? "text-[20px]" : "text-[15px]")}>
        {formatHeadlineMoney(amount.value, amount.currency)}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink-3">
        {humanizeEnum(amount.lifecycleClass)} · {amount.candidateCount} {amount.candidateCount === 1 ? "candidate" : "candidates"}
      </p>
      {showRange && (
        <p className="mt-1 font-mono text-[10px] text-ink-4">
          Range {formatCompactMoney(amount.range.lower as number, amount.currency)} to{" "}
          {formatCompactMoney(amount.range.upper as number, amount.currency)} · {humanizeEnum(amount.range.status)}
        </p>
      )}
    </div>
  );
}

/**
 * Why a cell has no figure: the server's availability and its first limitation sentence. A cell can carry
 * several limitations (the later ones are usually technical detector notes), so the rest stay out of the
 * card and open in the detail drawer through "+N more". That link only renders once the drawer is wired.
 */
function Unmeasured({ cell, onOpenDetails }: { cell: LeakageV2Cell; onOpenDetails?: (cellId: string) => void }) {
  const availability = cell.state.sourceAvailability;
  const extra = cell.limitations.length - 1;
  return (
    <div>
      <p className="text-[12px] font-medium text-ink-2">
        Not measured · {availabilityPhrase(availability)}
      </p>
      {cell.limitations[0] && <p className="mt-1 text-[10.5px] leading-relaxed text-ink-3">{cell.limitations[0]}</p>}
      {extra > 0 && onOpenDetails && (
        <button
          type="button"
          onClick={() => onOpenDetails(cell.id)}
          className="mt-1 text-[10.5px] font-medium text-ultra hover:underline"
        >
          +{extra} more
        </button>
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-chip bg-paper-2 px-1.5 py-0.5 text-[10.5px] text-ink-2">{children}</span>;
}

function SeverityChip({ severity }: { severity: string }) {
  return <Tag>{severity.toUpperCase() === "NOT_AVAILABLE" ? "Severity not rated" : `Severity ${severity.toUpperCase()}`}</Tag>;
}

function ConfidenceChip({ level }: { level: string }) {
  const upper = level.toUpperCase();
  if (upper === "NOT_AVAILABLE") return <Tag>Confidence not rated</Tag>;
  return (
    <span
      className={cn(
        "rounded-chip px-1.5 py-0.5 text-[10.5px]",
        upper === "LOW" ? "bg-amber-bg text-amber" : "bg-paper-2 text-ink-2"
      )}
    >
      {humanizeEnum(level)} confidence
    </span>
  );
}
