import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

/** Narrowest and widest a card may be when a stage is laid out on one line with its currencies split into cards. */
const UNIT_MIN = 215;
const UNIT_MAX = 300;
const GRID_GAP = 12;

/** The amounts a card shows: the page's currency filter applied, reporting currency first then by code (position only). */
function selectAmounts(cell: LeakageV2Cell, currencyFilter: string | null, reportingCurrency: string | null): LeakageV2Amount[] {
  const byCurrency = compareCurrencies(reportingCurrency);
  return (currencyFilter ? cell.amounts.filter((a) => a.currency === currencyFilter) : [...cell.amounts]).sort(
    (a, b) => byCurrency(a.currency, b.currency) || a.lifecycleClass.localeCompare(b.lifecycleClass)
  );
}

/**
 * One revenue stage. A leak with two or more currencies is split into one card per currency (sharing one Details
 * button) when every card in the stage, currency cards and the unmeasured or single-currency cards beside them,
 * fits on a single line at the current width. Otherwise the stage wraps as before and a multi-currency leak keeps
 * its compact card with the "+N more currencies" list. A leak with one currency is never split.
 */
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

  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cards a cell takes on one line: one per currency when it can be split, otherwise one (single currency, no
  // amount, unmeasured, no exposure).
  const plans = stage.cells.map((cell) => {
    const amounts = selectAmounts(cell, currencyFilter, reportingCurrency);
    const splittable = cell.state.display === "POPULATED" && amounts.length >= 2;
    return { cell, amounts, units: splittable ? amounts.length : 1, splittable };
  });
  const totalUnits = plans.reduce((sum, plan) => sum + plan.units, 0);
  const anySplittable = plans.some((plan) => plan.splittable);
  const fitsOneLine = width > 0 && totalUnits * UNIT_MIN + (totalUnits - 1) * GRID_GAP <= width;
  const split = anySplittable && fitsOneLine;

  return (
    <div ref={wrapRef}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[10px] font-medium tracking-[0.8px] text-ink-3 uppercase">{stage.label}</h3>
        <p className="text-[10.5px] text-ink-4">
          {measured} of {stage.cells.length} measured
        </p>
      </div>
      <div
        className={split ? "grid gap-3" : "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3"}
        style={split ? { gridTemplateColumns: `repeat(${totalUnits}, minmax(${UNIT_MIN}px, ${UNIT_MAX}px))` } : undefined}
      >
        {plans.map((plan) =>
          split && plan.splittable ? (
            <CurrencyGroupCard
              key={plan.cell.id}
              cell={plan.cell}
              amounts={plan.amounts}
              onOpenDetails={onOpenDetails}
              onOpenCalculation={onOpenCalculation}
            />
          ) : (
            <LeakCard
              key={plan.cell.id}
              cell={plan.cell}
              currencyFilter={currencyFilter}
              reportingCurrency={reportingCurrency}
              onOpenDetails={onOpenDetails}
              onOpenCalculation={onOpenCalculation}
            />
          )
        )}
      </div>
    </div>
  );
}

/**
 * A multi-currency leak split into one tile per currency inside a single card, with one Details button. Each tile
 * is a separate measurement in its own currency (figure, lifecycle, candidates, range, severity, confidence) and
 * keeps its own "How calculated" link. Nothing here is added across currencies.
 */
function CurrencyGroupCard({
  cell,
  amounts,
  onOpenDetails,
  onOpenCalculation,
}: {
  cell: LeakageV2Cell;
  amounts: LeakageV2Amount[];
  onOpenDetails?: (cellId: string) => void;
  onOpenCalculation?: (calculationReference: string) => void;
}) {
  const { coordinate, state } = cell;
  return (
    <article
      aria-label={`${coordinate.mechanismLabel}, ${coordinate.revenueStageLabel}`}
      style={{ gridColumn: `span ${amounts.length}` }}
      className="flex flex-col rounded-card border border-line bg-paper p-4"
    >
      <header className="flex items-start gap-2">
        <span className={cn("mt-1 size-2 shrink-0 rounded-[2px]", mechanismDotClass(coordinate.mechanism))} aria-hidden />
        <div className="min-w-0 flex-1">
          <h4 className="text-[12.5px] font-semibold text-ink">{coordinate.mechanismLabel}</h4>
          <p className="mt-0.5 text-[10.5px] text-ink-3">
            {coordinate.stateDimensionLabel} → {coordinate.stateValueLabel} · {coordinate.subject.unit}
          </p>
        </div>
        {state.facets.includes("COMPOUND") && <Tag>Compound</Tag>}
        {amounts.some((a) => isUnassignedMarket(a.market)) && (
          <span className="shrink-0 rounded-chip border border-dashed border-ultra-border bg-ultra-bg/50 px-1.5 py-px text-[9.5px] font-medium text-ultra">
            Unassigned
          </span>
        )}
      </header>

      <div className="mt-3 grid flex-1 gap-3" style={{ gridTemplateColumns: `repeat(${amounts.length}, minmax(0, 1fr))` }}>
        {amounts.map((amount) => (
          <div key={`${amount.currency}:${amount.market}:${amount.lifecycleClass}`} className="flex flex-col rounded-panel bg-paper-2/60 p-3">
            <p className="font-mono text-[11px] font-semibold text-ink-2">{amount.currency}</p>
            <div className="mt-1 flex-1">
              <AmountBlock amount={amount} labelled={false} lead />
              <div className="mt-2 flex flex-wrap gap-1.5">
                <SeverityChip severity={amount.severity} />
                <ConfidenceChip level={amount.confidenceLevel} />
              </div>
            </div>
            {onOpenCalculation && (
              <button
                type="button"
                onClick={() => onOpenCalculation(amount.calculationReference)}
                className="mt-3 self-start text-[11.5px] font-medium text-ultra hover:underline"
              >
                How calculated
              </button>
            )}
          </div>
        ))}
      </div>

      {onOpenDetails && (
        <footer className="mt-4 flex items-center justify-end gap-3 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => onOpenDetails(cell.id)}
            className="rounded-control border border-ultra bg-ultra px-3 py-1.5 text-[11.5px] font-medium text-paper hover:bg-ultra/90"
          >
            Details
          </button>
        </footer>
      )}
    </article>
  );
}

/** Currencies listed on a card before the rest sit behind "+N more", so a leak with many currencies stays compact. */
const VISIBLE_CURRENCY_ROWS = 2;

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
  const [morePopoverOpen, setMorePopoverOpen] = useState(false);
  // Every currency the leak has, reporting currency first then by code (position only, never by amount); the
  // page's currency filter narrows it to one. Nothing is added or converted.
  const amounts = selectAmounts(cell, currencyFilter, reportingCurrency);
  const multi = amounts.length > 1;
  const unmeasured = state.display === "UNKNOWN";
  const noExposure = state.display === "NO_EXPOSURE";
  const lead = amounts[0];
  const shownRows = amounts.slice(0, VISIBLE_CURRENCY_ROWS);
  const hiddenRows = amounts.length - shownRows.length;
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
          <div className="space-y-2">
            <ul className="divide-y divide-line/70">
              {shownRows.map((amount) => (
                <CurrencyRow
                  key={`${amount.currency}:${amount.market}:${amount.lifecycleClass}`}
                  amount={amount}
                  onOpenCalculation={onOpenCalculation}
                />
              ))}
            </ul>
            {/* "More" and the Compound tag share one line, to keep the card as short as its neighbours. */}
            {(hiddenRows > 0 || state.facets.includes("COMPOUND")) && (
              <div className="flex items-center justify-between gap-2">
                {hiddenRows > 0 ? (
                  <Popover open={morePopoverOpen} onOpenChange={setMorePopoverOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-[10.5px] font-medium text-ultra hover:underline">
                        +{hiddenRows} more {hiddenRows === 1 ? "currency" : "currencies"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 max-w-[calc(100vw-2rem)]">
                      <div className="border-b border-line px-3.5 py-2.5">
                        <p className="text-[12px] font-semibold text-ink">{coordinate.mechanismLabel}</p>
                        <p className="text-[10.5px] text-ink-3">Every currency, each on its own and never added together.</p>
                      </div>
                      <ul className="max-h-80 divide-y divide-line/70 overflow-y-auto px-3.5 py-2.5">
                        {amounts.map((amount) => (
                          <CurrencyRow
                            key={`${amount.currency}:${amount.market}:${amount.lifecycleClass}`}
                            amount={amount}
                            detailed
                            onOpenCalculation={
                              onOpenCalculation
                                ? (reference) => {
                                    setMorePopoverOpen(false);
                                    onOpenCalculation(reference);
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span />
                )}
                {state.facets.includes("COMPOUND") && <Tag>Compound</Tag>}
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
            <span className="text-[10.5px] text-ink-4">Tap a currency for its calculation</span>
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
  detailed = false,
  onOpenCalculation,
}: {
  amount: LeakageV2Amount;
  /** The full row (lifecycle, candidates, range) used in the "more" list; the card shows the one-line form. */
  detailed?: boolean;
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
    <li className={detailed ? "py-2 first:pt-0 last:pb-0" : "py-1.5 first:pt-0 last:pb-0"}>
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
        <span className={cn("min-w-0 flex-1 font-mono font-semibold tracking-tight text-ink", detailed ? "text-[15px]" : "text-[14px]")}>
          {formatHeadlineMoney(amount.value, amount.currency)}
        </span>
        <span
          className="shrink-0 text-[10px] text-ink-3"
          title={`${amount.candidateCount} ${amount.candidateCount === 1 ? "candidate" : "candidates"} · ${notRated ? "confidence not rated" : `${humanizeEnum(amount.confidenceLevel)} confidence`}`}
        >
          {/* The one-line form keeps the candidate count beside the confidence word; the "more" list spells both out. */}
          {detailed ? (notRated ? "Not rated" : `${humanizeEnum(amount.confidenceLevel)} confidence`) : `${amount.candidateCount} cand. · ${notRated ? "Not rated" : humanizeEnum(amount.confidenceLevel)}`}
        </span>
      </div>
      {detailed && (
        <p className="mt-0.5 pl-11 text-[10px] leading-snug text-ink-4">
          {detail}
        </p>
      )}
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
