import { ArrowLeft, Check, HelpCircle, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Controls, LeakageV2CoverageSummary } from "@/services/api/leakage/get-leakage";
import type {
  LeakageExecutive,
  LeakageExecutiveMarket,
  LeakageExecutiveMatrixMarketEntry,
  LeakageExecutiveMatrixRow,
} from "@/services/api/leakage/leakage-executive-types";
import { formatAsOf, isUnassignedMarket, marketName, sentenceCase, UNASSIGNED_MARKET } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

/** The executive row for the selected market, or `undefined` if the server did not list it. */
export const findMarketRow = (executive: LeakageExecutive | undefined, market: string): LeakageExecutiveMarket | undefined =>
  executive?.markets.find((m) => m.attribution.code === market);

/** This market's own cell in a matrix row. */
const entryFor = (row: LeakageExecutiveMatrixRow, market: string): LeakageExecutiveMatrixMarketEntry | undefined =>
  row.markets.find((m) => m.market === market);

/**
 * Whether anything is attributed to the selected market: an amount in its executive row, or a populated cell for
 * it in the matrix. When none is, the page shows the "nothing is measured" view in place of empty sections.
 */
export function marketHasData(executive: LeakageExecutive | undefined, market: string): boolean {
  if (!executive) return true; // old publication without `executive`: leave the existing sections alone
  const row = findMarketRow(executive, market);
  if (row && row.amounts.length > 0) return true;
  return executive.matrix.some((m) => entryFor(m, market)?.display === "POPULATED");
}

interface MarketHeaderProps {
  market: string;
  executive: LeakageExecutive | undefined;
  controls: LeakageV2Controls;
  coverage: LeakageV2CoverageSummary;
  asOf: string;
  onClear: () => void;
  onOpenCoverage: () => void;
}

/**
 * The top of a single market's page: who it is (primary, configured, attributed or not), what is affected in it,
 * and a way back to all markets. Coverage is publication-wide, so the note says there is no per-market ratio and
 * links to the coverage sheet instead of inventing one. Every fact is a field of the market's executive row.
 */
export function MarketHeader({ market, executive, controls, coverage, asOf, onClear, onOpenCoverage }: MarketHeaderProps) {
  const row = findMarketRow(executive, market);
  const unassigned = isUnassignedMarket(market);
  const option = controls.marketOptions.find((o) => o.market === market);
  const hasEvidence = !!row?.hasMeasurementEvidence;

  const facts = unassigned
    ? ["Not attributed to a market", "currency proven, market not"]
    : [
        ...(option?.isPrimary ? ["Primary market"] : []),
        ...(row ? [row.isConfigured ? "Configured" : "Not configured"] : []),
        hasEvidence || (row && row.amounts.length > 0) ? "attributed by published evidence" : "nothing attributed yet",
      ];

  return (
    <section aria-label={marketName(market)} className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-control font-mono text-[13px] font-semibold",
              unassigned ? "border border-dashed border-ultra-border bg-ultra-bg/50 text-ultra" : "bg-ink text-paper"
            )}
          >
            {unassigned ? <MapPin className="size-5" /> : market}
          </span>
          <div>
            <h1 className="text-[17px] font-semibold text-ink">{marketName(market)}</h1>
            <p className="mt-0.5 text-[11.5px] text-ink-3">{facts.join(" · ")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex h-8 items-center gap-1.5 rounded-control border border-line bg-paper px-3 text-[11.5px] font-medium text-ink hover:border-ink-4"
        >
          <ArrowLeft className="size-3.5" />
          All markets
        </button>
      </div>

      {row && row.affectedEntities.length > 0 && (
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          {row.affectedEntities.map((entity) => (
            <div key={`${entity.subjectType}:${entity.grain}`}>
              <dt className="text-[10.5px] text-ink-4 capitalize">Affected {entity.unit}</dt>
              <dd className="font-mono text-[15px] font-semibold text-ink">{entity.count == null ? "Not available" : entity.count.toLocaleString("en-US")}</dd>
            </div>
          ))}
          <p className="self-end text-[10.5px] text-ink-4">De-duplicated across leak types. Units are never mixed.</p>
        </dl>
      )}

      <p className="mt-4 rounded-panel bg-paper-2 px-3 py-2 text-[11px] text-ink-3">
        Coverage is published for the whole workspace
        {coverage.effective != null ? ` (${(coverage.effective * 100).toFixed(1)}%)` : ""}: there is no{" "}
        {unassigned ? "per-market" : `${marketName(market)}-only`} coverage ratio.{" "}
        <button type="button" onClick={onOpenCoverage} className="font-medium text-ultra hover:underline">
          Coverage detail
        </button>
      </p>
      <p className="mt-2 font-mono text-[10px] text-ink-4">As of {formatAsOf(asOf)}</p>
    </section>
  );
}

interface NothingMeasuredProps {
  market: string;
  executive: LeakageExecutive;
  onSelectMarket: (market: string) => void;
}

const REASON_PHRASE: Record<string, string> = {
  NO_MARKET_SCOPED_MEASUREMENT: "No market-scoped measurement",
  PUBLISHED_EXPOSURE: "Published exposure",
  EXCLUDED_BY_SELECTION: "Hidden by the current selection",
};

/**
 * The page for a market nothing is attributed to. It says plainly that this is unknown, not zero, lists the facts
 * the server gave (configured, evidence, amounts, coverage), compares each leak type's workspace-wide state with
 * this market's, and, when the workspace has Unassigned exposure, points to it and to the source mappings. It
 * replaces the empty expected-loss, findings and leak-card sections that would otherwise show nothing.
 */
export function NothingMeasured({ market, executive, onSelectMarket }: NothingMeasuredProps) {
  const name = marketName(market);
  const row = findMarketRow(executive, market);
  const hasUnassigned = executive.marketInventory.hasUnassignedExposure && market !== UNASSIGNED_MARKET;

  const facts: { label: string; value: string }[] = [
    { label: "Configured", value: row ? (row.isConfigured ? "Yes" : "No") : "Not listed" },
    { label: "Measurement evidence", value: row ? (row.hasMeasurementEvidence ? "Some" : "None") : "None" },
    { label: "Attributed amounts", value: row && row.amounts.length > 0 ? `${row.amounts.length} ${row.amounts.length === 1 ? "currency" : "currencies"}` : "None" },
    { label: `Coverage for ${name}`, value: "Not available per market" },
  ];

  return (
    <div className="space-y-5">
      <section aria-label={`Nothing measured for ${name}`} className="rounded-card border border-line bg-paper p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-[18px] font-semibold text-ink">Nothing is measured for {name} yet</h2>
            {/* Two lines of height are always reserved: a longer market name wraps onto a second line and a shorter one does
                not, and without this the card (and the button under it) changed height from one market to the next. */}
            <p className="mt-2 min-h-[41px] text-[12.5px] leading-relaxed text-ink-2">
              {name} is {row?.isConfigured ? "configured" : "not configured"}, but no published observation is attributed to it.
              That is <span className="font-semibold text-ink">unknown, not zero</span>: {name} may still be leaking.
            </p>
            {hasUnassigned && (
              <button
                type="button"
                onClick={() => onSelectMarket(UNASSIGNED_MARKET)}
                className={cn("mt-4 inline-flex h-9 items-center rounded-control border px-4 text-[12px] font-medium transition-colors", PRIMARY_ACTION_CLASS)}
              >
                See unassigned exposure
              </button>
            )}
          </div>
          <dl className="divide-y divide-line rounded-panel border border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between gap-3 px-3 py-2">
                <dt className="text-[11.5px] text-ink-2">{fact.label}</dt>
                <dd className="text-right text-[11.5px] font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <LeakTypesTable market={market} executive={executive} />

      {hasUnassigned && (
        <section className="rounded-card border border-line bg-paper p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-ultra-bg text-ultra">
              <MapPin className="size-4" />
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-ink">Some of {name}'s exposure may be sitting in Unassigned</h3>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-3">
                Unassigned holds amounts whose market wasn't proven. We never move them into {name} based on currency or
                settings. They stay there until a new calculation reads market evidence for them.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/** Each leak type, side by side: how the whole workspace stands on it and how this market does. Comes from `executive.matrix`. */
function LeakTypesTable({ market, executive }: { market: string; executive: LeakageExecutive }) {
  const name = marketName(market);
  return (
    <section aria-label={`Leak types in ${name}`} className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <h2 className="text-[13px] font-semibold text-ink">Leak types in {name}</h2>
      <p className="mt-0.5 text-[11.5px] text-ink-3">Every row shows its workspace-wide state beside {name}'s own.</p>

      <div className="mt-3 overflow-hidden rounded-panel border border-line">
        <table className="w-full text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2 text-[10px] text-ink-4">
              <th className="px-3 py-2 font-medium">Leak type</th>
              <th className="px-3 py-2 font-medium">Whole workspace</th>
              <th className="px-3 py-2 font-medium">In {name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {executive.matrix.map((row) => {
              const entry = entryFor(row, market);
              const workspaceUnknown = row.publicationDisplay === "UNKNOWN";
              return (
                <tr key={row.cellId} className="align-top">
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{row.coordinate.mechanismLabel}</p>
                    <p className="font-mono text-[9.5px] tracking-wide text-ink-4 uppercase">
                      {row.coordinate.revenueStageLabel} · {row.coordinate.subject.unit}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <WorkspaceState display={row.publicationDisplay} />
                  </td>
                  <td className="px-3 py-2">
                    <MarketState entry={entry} workspaceUnknown={workspaceUnknown} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WorkspaceState({ display }: { display: string }) {
  if (display === "POPULATED") {
    return (
      <span className="flex items-center gap-1 text-teal">
        <Check className="size-3.5" />
        Populated
      </span>
    );
  }
  return <span className="text-ink-3">{display === "NO_EXPOSURE" ? "Measured zero" : sentenceCase(display)}</span>;
}

/** This market's cell: its amounts when populated, otherwise why there is nothing (never a zero). */
function MarketState({ entry, workspaceUnknown }: { entry: LeakageExecutiveMatrixMarketEntry | undefined; workspaceUnknown: boolean }) {
  const dotted = "flex items-center gap-1.5 rounded-control border border-dashed border-line px-2.5 py-2 text-ink-3";
  const hatched =
    "rounded-control px-2.5 py-2 text-ink-3 bg-[repeating-linear-gradient(135deg,var(--color-paper-2)_0_6px,transparent_6px_12px)]";

  if (!entry) return <div className={dotted}>Not listed</div>;
  if (entry.display === "POPULATED") {
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 py-1.5">
        {entry.amounts.map((a) => (
          <span key={`${a.currency}:${a.lifecycleClass}`} className="font-mono text-[12px] font-semibold text-ink">
            {formatCompactMoney(a.value, a.currency)}
          </span>
        ))}
      </div>
    );
  }
  if (entry.display === "NO_EXPOSURE") return <div className={dotted}>Measured: no exposure found</div>;
  if (workspaceUnknown) return <div className={hatched}>Not measurable anywhere yet</div>;
  return (
    <div className={dotted}>
      <HelpCircle className="size-3.5 shrink-0" />
      {REASON_PHRASE[entry.reason] ?? sentenceCase(entry.reason)}
    </div>
  );
}
