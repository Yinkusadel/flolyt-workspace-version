import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { formatCompactMoney, formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageMarkets } from "@/features/lifecycle/use-get-stage-markets";
import type { StageMarketDto } from "@/services/api/lifecycle/get-stage-markets";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// A presentational label for known country codes — the endpoint only ever returns the raw ISO
// code, never a display name. Unknown codes fall back to the raw code rather than guessing.
const COUNTRY_LABEL: Record<string, string> = {
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  GB: "United Kingdom",
  UK: "United Kingdom",
  US: "United States",
  ZA: "South Africa",
};

type MarketRow = StageMarketDto & { id: string };

const COLUMNS: Column<MarketRow>[] = [
  {
    key: "market",
    header: "Market",
    render: (row) => (
      <span className="flex items-center gap-2 font-semibold text-ink-2">
        {COUNTRY_LABEL[row.countryCode] ?? row.countryCode}
        {row.isPrimary && <Chip tone="ultra">Primary</Chip>}
      </span>
    ),
  },
  {
    key: "population",
    header: "Population",
    align: "right",
    render: (row) =>
      row.population.value !== null ? (
        <span className="font-mono text-ink">{formatCount(row.population.value)}</span>
      ) : (
        <InfoTooltip missingSource={row.population.missingSource} wouldUnlock={row.population.wouldUnlock} />
      ),
  },
  {
    key: "atStake",
    header: "At stake",
    align: "right",
    render: (row) =>
      row.atStake.value !== null ? (
        <span className="text-rose">{formatCompactMoney(row.atStake.value, row.currencyCode)}</span>
      ) : (
        <InfoTooltip missingSource={row.atStake.missingSource} wouldUnlock={row.atStake.wouldUnlock} />
      ),
  },
  {
    key: "primaryConversion",
    header: "Primary conversion",
    align: "right",
    render: (row) =>
      row.primaryConversion.value !== null ? (
        <span className="text-ink-2">{formatPercent(row.primaryConversion.value)}</span>
      ) : (
        <InfoTooltip missingSource={row.primaryConversion.missingSource} wouldUnlock={row.primaryConversion.wouldUnlock} />
      ),
  },
];

function MarketsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** The shared Markets tab template (e.g. A08) — every stage's per-market breakout, no combined total by design. */
export function MarketsTab() {
  const { stage } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageMarkets(stage.slug);
  const marketsData = data?.data;
  const rows: MarketRow[] = (marketsData?.markets ?? []).map((market) => ({ ...market, id: market.countryCode }));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {rows.length > 0 ? `${rows.length} markets · no combined figure on this screen` : "No combined figure on this screen, by design"}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load this stage's markets.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <MarketsSkeleton />
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={rows}
            emptyTitle="No markets declared yet"
            emptyBody="Per-market figures will appear here once this workspace has declared which markets it sells in."
          />
        )}
      </section>

      {/* ❌ Backend does NOT provide: the per-market spend/CAC/reach-a-second-order columns and
          narrative spotlight cards every stage's old mock design had — this endpoint only ever
          returns population/atStake/primaryConversion per market, the same three measured values
          every stage's Overview KPI row already uses, just sliced by market instead of workspace-
          wide. Dropped rather than shown against fabricated per-market CAC/repeat-rate/ARPU
          figures. */}

      {marketsData?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
}
