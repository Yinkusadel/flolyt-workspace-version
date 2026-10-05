import { cn } from "@/lib/utils";
import type { LeakageV2Cell, LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import type { LeakageExecutive, LeakageExecutiveFinding } from "@/services/api/leakage/leakage-executive-types";
import {
  compareCurrencies,
  formatHeadlineMoney,
  humanizeEnum,
  isUnassignedMarket,
  marketName,
  MODE_TITLE,
  mechanismDotClass,
} from "@/pages/leakage-map/format";

interface KeyFindingsSectionProps {
  executive: LeakageExecutive | undefined;
  cells: LeakageV2Cell[];
  controls: LeakageV2Controls;
  /** The market currently selected in the filter bar, if any. */
  selectedMarket: string | null;
}

interface FindingGroup {
  market: string;
  lifecycleClass: string;
  findings: LeakageExecutiveFinding[];
}

/**
 * The page summary (`executive.headlineFindings`, all-markets view only, the server's own sentence) over the
 * largest leak in each market + currency + lifecycle scope (`executive.markets[].largestMechanisms`; the
 * deprecated `keyFindings` is read only when a server predates `headlineFindings`). Grouped by market and lifecycle, never ranked across currencies: inside a group the rows are ordered by
 * currency code (reporting currency first), not by amount. Deliberately not shown: the design's
 * "57% of CAD exposure" bar, because the API sends no share and working one out here would mean combining
 * two fields client-side. The revenue-stage chip is looked up from the finding's own cell.
 */
export function KeyFindingsSection({ executive, cells, controls, selectedMarket }: KeyFindingsSectionProps) {
  if (!executive) return null;

  // `keyFindings` is empty on new responses; an older server without `headlineFindings` still sends it.
  const detail =
    executive.headlineFindings !== undefined ? executive.markets.flatMap((m) => m.largestMechanisms) : executive.keyFindings;
  const findings = selectedMarket ? detail.filter((f) => f.market === selectedMarket) : detail;
  const headlines = selectedMarket ? [] : (executive.headlineFindings ?? []);

  // A market with nothing to show gets an explicit empty state, worded by the server, not a section that silently vanishes.
  if (findings.length === 0 && headlines.length === 0) {
    if (!selectedMarket) return null;
    const row = executive.markets.find((m) => m.attribution.code === selectedMarket);
    return (
      <section aria-label="Key findings" className="rounded-card border border-dashed border-line bg-paper p-5">
        <h2 className="text-[13px] font-semibold text-ink">Key findings in {marketName(selectedMarket)}</h2>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {row?.evidenceExplanation ?? `No findings were published for ${marketName(selectedMarket)}.`}
        </p>
      </section>
    );
  }

  const reportingCurrency = executive.reportingCurrency ?? controls.reportingCurrency;
  const byCurrency = compareCurrencies(reportingCurrency);
  const selectedMode = (executive.selectedMode ?? controls.mode).toUpperCase();

  // Primary market first, other markets in API order, the Unassigned bucket last. Position only.
  const marketOrder = [...executive.markets.map((m) => m.attribution.code)];
  const isPrimary = (code: string) => controls.marketOptions.some((o) => o.market === code && o.isPrimary);
  const rank = (code: string) => (isUnassignedMarket(code) ? 2 : isPrimary(code) ? 0 : 1);

  const groups = new Map<string, FindingGroup>();
  for (const finding of findings) {
    const key = `${finding.market}:${finding.lifecycleClass}`;
    const group = groups.get(key) ?? { market: finding.market, lifecycleClass: finding.lifecycleClass, findings: [] };
    group.findings.push(finding);
    groups.set(key, group);
  }
  const ordered = [...groups.values()]
    .map((g) => ({ ...g, findings: [...g.findings].sort((a, b) => byCurrency(a.currency, b.currency)) }))
    .sort(
      (a, b) =>
        rank(a.market) - rank(b.market) ||
        marketOrder.indexOf(a.market) - marketOrder.indexOf(b.market) ||
        a.lifecycleClass.localeCompare(b.lifecycleClass)
    );

  const stageLabel = (finding: LeakageExecutiveFinding): string | null => {
    const cell = cells.find((c) => c.id === finding.cellIds[0]);
    return cell?.coordinate.revenueStageLabel ?? null;
  };

  // Configured/evidenced markets that hold no amount have no finding; say so instead of leaving them out silently.
  // Only on the all-markets view: a single market's own view is not the place to list the others.
  const withoutFindings = (selectedMarket ? [] : executive.markets)
    .filter((m) => !isUnassignedMarket(m.attribution.code) && m.amounts.length === 0)
    .map((m) => marketName(m.attribution.code));

  return (
    <section aria-label="Key findings" className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[13px] font-semibold text-ink">
          {selectedMarket ? `Key findings in ${marketName(selectedMarket)}` : "Key findings"}
        </h2>
        <p className="text-[10.5px] text-ink-3">
          Estimated exposure · {MODE_TITLE[selectedMode] ?? humanizeEnum(selectedMode)}
        </p>
      </div>
      <p className="mt-0.5 text-[11.5px] text-ink-3">
        The largest leak in each market, currency and lifecycle. Not ranked across currencies.
      </p>

      {headlines.length > 0 && (
        <ul className="mt-3 space-y-2">
          {headlines.map((headline) => (
            <li
              key={`${headline.kind}:${headline.mechanism}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-panel border border-line bg-paper-2 px-3 py-2.5"
            >
              <span className="flex min-w-[12rem] flex-1 items-start gap-2">
                <span className={cn("mt-1 size-2 shrink-0 rounded-[2px]", mechanismDotClass(headline.mechanism))} aria-hidden />
                <span>
                  <span className="block text-[12px] leading-relaxed text-ink-2">{headline.message}</span>
                  <span className="mt-0.5 block text-[10.5px] text-ink-4">
                    {formatList(headline.markets.map((code) => marketName(code)))}
                  </span>
                </span>
              </span>
              <ConfidenceLevel level={headline.confidenceLevel} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-3">
        {ordered.map((group) => (
          <div
            key={`${group.market}:${group.lifecycleClass}`}
            className={cn(
              "overflow-hidden rounded-panel border",
              isUnassignedMarket(group.market) ? "border-dashed border-ultra-border" : "border-line"
            )}
          >
            <p
              className={cn(
                "px-3 py-2 font-mono text-[9px] font-medium tracking-[0.8px] uppercase",
                isUnassignedMarket(group.market) ? "bg-ultra-bg/40 text-ultra" : "bg-paper-2 text-ink-3"
              )}
            >
              {marketName(group.market)} <span className="text-ink-4">· {humanizeEnum(group.lifecycleClass)}</span>
            </p>
            <ul className="divide-y divide-line">
              {group.findings.map((finding) => (
                <FindingRow key={`${finding.currency}:${finding.mechanism}`} finding={finding} stage={stageLabel(finding)} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {withoutFindings.length > 0 && (
        <p className="mt-3 text-[11px] text-ink-3">
          {formatList(withoutFindings)} {withoutFindings.length === 1 ? "has" : "have"} no findings: no amount is
          attributed {withoutFindings.length === 1 ? "to it" : "to them"} yet.
        </p>
      )}
    </section>
  );
}

function FindingRow({ finding, stage }: { finding: LeakageExecutiveFinding; stage: string | null }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5">
      <span className="w-9 shrink-0 font-mono text-[11px] font-semibold text-ink">{finding.currency}</span>
      <span className="flex min-w-[10rem] flex-1 items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-[2px]", mechanismDotClass(finding.mechanism))} aria-hidden />
        <span className="text-[12.5px] font-medium text-ink">{finding.label}</span>
        {stage && (
          <span className="font-mono text-[9px] font-medium tracking-wide text-ink-4 uppercase">{stage}</span>
        )}
        {finding.isTied && (
          <span
            title="Equal leaders share the top spot in this scope"
            className="rounded-chip bg-paper-2 px-1.5 py-px font-mono text-[8.5px] font-semibold text-ink-3 uppercase"
          >
            Tied
          </span>
        )}
      </span>
      <span className="ml-auto flex items-center gap-4">
        <span className="font-mono text-[13px] font-semibold text-ink">
          {formatHeadlineMoney(finding.selectedAmount, finding.currency)}
        </span>
        <ConfidenceLevel level={finding.confidenceLevel} />
      </span>
    </li>
  );
}

const CONFIDENCE_BARS: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

/** Three small bars plus the server's own level word; "Not rated" when the API gives no level. */
function ConfidenceLevel({ level }: { level: string }) {
  const filled = CONFIDENCE_BARS[level.toUpperCase()] ?? 0;
  const label = filled ? humanizeEnum(level) : "Not rated";
  return (
    <span className="flex w-20 items-center gap-1.5 text-[11px] text-ink-3" title={`${label} confidence`}>
      <span className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn("w-[3px] rounded-[1px]", bar <= filled ? "bg-amber" : "bg-line")}
            style={{ height: 4 + bar * 3 }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

/** ["Kenya"] -> "Kenya", ["Kenya", "Nigeria"] -> "Kenya and Nigeria", three or more -> "A, B and C". */
function formatList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
