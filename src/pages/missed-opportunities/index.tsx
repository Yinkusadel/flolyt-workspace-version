import { AlertTriangle } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Callout } from "@/components/ui/rail";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOpportunities } from "@/features/opportunities/use-get-opportunities";
import { formatAsOf } from "@/pages/leakage-map/format";
import { OpportunityCellCard } from "@/pages/missed-opportunities/opportunity-cell-card";

/**
 * `GET /opportunities`: a separate, positive-polarity read. Nothing here is added to, netted against or
 * ranked with the leakage figures, and money only ever comes from a cell's own `amounts[]` or a signal's
 * own valuation, each in its own currency. Built 2026-10-04 against a live legacy publication (one
 * UNKNOWN cell), so the priced-amounts and signal-preview views follow the contract only.
 */
export default function MissedOpportunities() {
  usePageBreadcrumb([{ label: "Leakage Map", to: "/leakage-map" }, { label: "Missed opportunities" }]);
  const { data, error, isLoading, refetch } = useGetOpportunities(true);

  if (isLoading) return <OpportunitiesSkeleton />;

  const page = data?.succeeded ? data.data : undefined;
  if (!page) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-card border border-line bg-paper px-6 py-12 text-center">
        <AlertTriangle className="size-5 text-rose" />
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Missed opportunities could not be loaded</h2>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {error?.message ?? data?.messages[0] ?? "Something went wrong loading missed opportunities."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-control border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink-4"
        >
          Try again
        </button>
      </div>
    );
  }

  // The page repeats a cell's limitation when only one cell exists; show each sentence once.
  const cellLimitations = new Set(page.cells.flatMap((cell) => cell.limitations));
  const pageLimitations = page.limitations.filter((limitation) => !cellLimitations.has(limitation));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Missed opportunities</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Upside the latest publication found, kept separate from leakage.{" "}
          <span className="font-mono text-[10.5px] text-ink-4">As of {formatAsOf(page.publication.asOfUtc)}</span>
        </p>
      </div>

      <Callout tone="neutral" title="Separate from leakage">
        These figures are upside, not lost revenue. They are never added to, subtracted from or ranked against the leakage map,
        and each currency stays on its own.
      </Callout>

      <dl className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Stat label="Candidates" value={page.candidateCount} />
        <Stat label="Priced candidates" value={page.pricedCandidateCount} />
      </dl>

      {page.cells.length === 0 ? (
        <div className="rounded-card border border-line bg-paper px-5 py-8 text-center">
          <p className="text-[12.5px] font-medium text-ink">No opportunity areas were published</p>
          <p className="mt-1 text-[11.5px] text-ink-3">The latest publication holds no opportunity cells for this workspace.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {page.cells.map((cell) => (
            <OpportunityCellCard key={cell.id} cell={cell} />
          ))}
        </div>
      )}

      {pageLimitations.length > 0 && (
        <section className="space-y-2">
          <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">Limitations</p>
          <ul className="space-y-2">
            {pageLimitations.map((limitation, i) => (
              <li key={i} className="rounded-control border border-line bg-paper-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-2">
                {limitation}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-line bg-paper p-3.5">
      <dt className="text-[10.5px] text-ink-4">{label}</dt>
      <dd className="mt-1 font-mono text-[18px] font-semibold text-ink">{value.toLocaleString()}</dd>
    </div>
  );
}

function OpportunitiesSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading missed opportunities">
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-3.5 w-80 max-w-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-card" />
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Skeleton className="h-16 rounded-card" />
        <Skeleton className="h-16 rounded-card" />
      </div>
      <Skeleton className="h-56 w-full rounded-card" />
    </div>
  );
}
