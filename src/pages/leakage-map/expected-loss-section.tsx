import { useState } from "react";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageV2Controls, LeakageV2Summary } from "@/services/api/leakage/get-leakage";
import type {
  LeakageExecutive,
  LeakageExecutiveAmount,
  LeakageExecutiveConfidence,
} from "@/services/api/leakage/leakage-executive-types";
import type { LeakageFilters } from "@/pages/leakage-map/filters";
import { formatHeadlineMoney, humanizeEnum } from "@/pages/leakage-map/format";

/** Past this many cards the rest sit behind a "show more" control, so many currencies never flood the page. */
const VISIBLE_CARDS = 6;

/** `executive.fxState` value that means "no approved FX rates: nothing may be converted or combined". */
const NO_FX_STATE = "NOT_CONSOLIDATED_NO_APPROVED_FX";

const MODE_TITLE: Record<string, string> = {
  GROSS: "Gross exposure",
  EXPECTED: "Expected loss",
  NET: "Net expected loss",
};

const MEASUREMENT_BANNER_LABEL: Record<string, string> = {
  PARTIALLY_MEASURED: "Partially measured.",
  UNAVAILABLE: "Not measured yet.",
};

interface ExpectedLossSectionProps {
  executive: LeakageExecutive | undefined;
  summary: LeakageV2Summary;
  controls: LeakageV2Controls;
  filters: LeakageFilters;
}

/**
 * The page headline: one card per currency (and lifecycle class), never a combined total. Every figure,
 * label and tag is read from `executive` / `summary` / `controls`:
 * - the big number is the server's `selectedAmount` for the selected mode, with gross, expected and net
 *   shown side by side from the same bucket;
 * - the "Reporting" tag marks whichever currency the API names as `reportingCurrency`, and that card
 *   leads the row, the rest follow in code order (position only, never ranked or totalled by amount);
 * - the low-confidence line is the server's own `lowConfidenceExpectedLossShare` for that bucket.
 * Market and currency filters already narrow `executive.totals`, so the cards follow them untouched.
 */
export function ExpectedLossSection({ executive, summary, controls, filters }: ExpectedLossSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (!executive) {
    return (
      <section aria-label="Expected loss" className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[13px] font-semibold text-ink">Expected loss is not available for this publication</h2>
        <p className="mt-1 text-[11.5px] text-ink-3">
          This publication was built before the executive summary existed. A fresh calculation will fill it in.
        </p>
      </section>
    );
  }

  const selectedMode = (executive.selectedMode ?? controls.mode).toUpperCase();
  const reportingCurrency = executive.reportingCurrency ?? controls.reportingCurrency;
  const title = `${MODE_TITLE[selectedMode] ?? humanizeEnum(selectedMode)} over the next ${controls.horizonDays} days`;

  // The reporting currency leads (it is the one the workspace reads in); the rest follow in code order.
  // Position only: nothing is totalled or ranked by amount.
  const totals = [...executive.totals].sort(
    (a, b) =>
      Number(b.currency === reportingCurrency) - Number(a.currency === reportingCurrency) ||
      a.currency.localeCompare(b.currency) ||
      a.lifecycleClass.localeCompare(b.lifecycleClass)
  );
  const confidenceFor = (bucket: LeakageExecutiveAmount): LeakageExecutiveConfidence | undefined =>
    executive.confidence.find((c) => c.currency === bucket.currency && c.lifecycleClass === bucket.lifecycleClass);

  // Only meaningful with no filter: under a market or currency filter, a currency missing from `totals`
  // was filtered out, not "published with no amount".
  const unfiltered = !filters.market && !filters.currency;
  const publishedCurrencies = new Set(totals.map((t) => t.currency));
  const unpublishedCurrencies = unfiltered ? controls.currencies.filter((c) => !publishedCurrencies.has(c)) : [];

  const cards = [
    ...totals.map((bucket) => ({ key: `${bucket.currency}:${bucket.lifecycleClass}`, bucket, currency: bucket.currency })),
    ...unpublishedCurrencies.map((currency) => ({ key: `${currency}:unpublished`, bucket: null, currency })),
  ];
  const visibleCards = showAll ? cards : cards.slice(0, VISIBLE_CARDS);
  const hiddenCount = cards.length - visibleCards.length;

  const bannerLabel = MEASUREMENT_BANNER_LABEL[summary.measurementState];

  return (
    <section aria-label="Expected loss" className="space-y-3">
      {bannerLabel && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-panel border border-amber-border bg-amber-bg px-3 py-2.5 text-[11.5px] text-ink-2"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber" />
          <p>
            <span className="font-semibold text-ink">{bannerLabel}</span> {executive.coverageMessage}
          </p>
        </div>
      )}

      {executive.fxState === NO_FX_STATE && (
        <div className="flex items-start gap-2 rounded-panel border border-line bg-paper px-3 py-2.5 text-[11.5px] text-ink-2">
          <ArrowLeftRight className="mt-0.5 size-3.5 shrink-0 text-ink-3" />
          <p>
            <span className="font-semibold text-ink">No combined total.</span> There are no approved FX rates, so each
            currency stands alone.
            {reportingCurrency && ` ${reportingCurrency} is the reporting currency, used for display only.`}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
        <p className="text-[10.5px] text-ink-3">One card per currency and lifecycle class, reporting currency first</p>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper px-4 py-6 text-center">
          <p className="text-[12px] font-medium text-ink">No amount published for this selection</p>
          <p className="mt-1 text-[11px] text-ink-3">That is not the same as zero: nothing here has been priced yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
          {visibleCards.map((card) =>
            card.bucket ? (
              <CurrencyCard
                key={card.key}
                bucket={card.bucket}
                confidence={confidenceFor(card.bucket)}
                selectedMode={selectedMode}
                isReporting={card.currency === reportingCurrency}
              />
            ) : (
              <UnpublishedCurrencyCard key={card.key} currency={card.currency} />
            )
          )}
        </div>
      )}

      {cards.length > VISIBLE_CARDS && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-[11.5px] font-medium text-ultra hover:underline"
        >
          {showAll ? "Show fewer" : `Show ${hiddenCount} more ${hiddenCount === 1 ? "currency" : "currencies"}`}
        </button>
      )}
    </section>
  );
}

function CurrencyCard({
  bucket,
  confidence,
  selectedMode,
  isReporting,
}: {
  bucket: LeakageExecutiveAmount;
  confidence: LeakageExecutiveConfidence | undefined;
  selectedMode: string;
  isReporting: boolean;
}) {
  const stats: { mode: string; label: string; value: number }[] = [
    { mode: "GROSS", label: "Gross", value: bucket.grossExposure },
    { mode: "EXPECTED", label: "Expected", value: bucket.expectedLoss },
    { mode: "NET", label: "Net", value: bucket.netExpectedLoss },
  ];
  const lowShare = confidence ? Math.round(confidence.lowConfidenceExpectedLossShare * 100) : null;

  return (
    <article
      aria-label={`${bucket.currency} ${humanizeEnum(bucket.lifecycleClass)}`}
      className="flex flex-col rounded-card border border-line bg-paper p-4"
    >
      <header className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-semibold text-ink">{bucket.currency}</span>
        {isReporting && (
          <span className="rounded-chip bg-paper-2 px-1.5 py-px font-mono text-[8.5px] font-semibold tracking-wide text-ink-3 uppercase">
            Reporting
          </span>
        )}
        <span className="ml-auto text-[10.5px] text-ink-3">
          {confidence ? `${confidence.findingCount} ${confidence.findingCount === 1 ? "finding" : "findings"}` : ""}
        </span>
      </header>

      <p className="mt-3 font-mono text-[22px] leading-none font-semibold tracking-tight text-ink">
        {formatHeadlineMoney(bucket.selectedAmount, bucket.currency)}
      </p>
      <p className="mt-1 text-[10.5px] text-ink-3">{humanizeEnum(bucket.lifecycleClass)}</p>

      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
        {stats.map((stat) => (
          <div key={stat.mode}>
            <dt className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">{stat.label}</dt>
            <dd
              className={cn(
                "mt-0.5 font-mono text-[11px]",
                stat.mode === selectedMode ? "font-semibold text-ink" : "text-ink-3"
              )}
            >
              {formatCompactMoney(stat.value, bucket.currency)}
            </dd>
          </div>
        ))}
      </dl>

      {lowShare !== null && (
        <p className={cn("mt-3 text-[10.5px]", lowShare > 0 ? "text-amber" : "text-ink-3")}>
          {lowShare > 0
            ? `${lowShare}% of ${bucket.currency} expected loss is low-confidence`
            : `No low-confidence share of ${bucket.currency} expected loss`}
        </p>
      )}
    </article>
  );
}

function UnpublishedCurrencyCard({ currency }: { currency: string }) {
  return (
    <article
      aria-label={`${currency} no amount published`}
      className="rounded-card border border-dashed border-line bg-paper-2 p-4"
    >
      <p className="font-mono text-[11px] font-semibold text-ink">{currency}</p>
      <p className="mt-3 text-[12px] font-medium text-ink">No amount published</p>
      <p className="mt-1 text-[10.5px] text-ink-3">Not the same as zero: nothing in {currency} was priced.</p>
    </article>
  );
}
