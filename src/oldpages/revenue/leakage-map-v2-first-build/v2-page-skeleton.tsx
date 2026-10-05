import { Skeleton } from "@/components/ui/skeleton";

/**
 * First-load skeleton for the V2 leakage page — shaped like the real layout (header row, KPI
 * strip, the grouped cell grid, Coverage/Limitations, Rollups) per this app's standing loading-
 * state convention: a real shape, never a bare spinner or "Loading…" line.
 *
 * Committed to the V2 shape specifically, not a generic/shared one — `GET /leakage` is
 * dual-contract and the very first request always goes out V1-shaped, so technically the contract
 * isn't known until a response arrives. This page is only reached on a confirmed V2-flagged
 * workspace in practice, so guessing V2 here is the right bet; a V1 fallback would need its own
 * skeleton shaped like the stage rail + matrix instead, not attempted here.
 *
 * Only shown for the true first paint (`isLoading`, i.e. no cached data yet) — a filter-driven
 * refetch keeps the previous page on screen with `RecomputingToast` instead of swapping back to
 * this, so this never flashes on every filter change, only once per session.
 */
export function V2PageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <Skeleton className="mt-2 h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-card border border-line bg-paper p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2.5 h-5 w-20" />
            <Skeleton className="mt-1.5 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper p-5">
        <Skeleton className="h-3 w-full max-w-md" />
        <div className="mt-4 space-y-5">
          {Array.from({ length: 2 }).map((_, g) => (
            <div key={g}>
              <Skeleton className="h-2.5 w-24" />
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-control border border-line bg-paper-2 p-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-1.5 h-2.5 w-20" />
                    <Skeleton className="mt-2.5 h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-card border border-line bg-paper p-5">
            <Skeleton className="h-3.5 w-24" />
            <div className="mt-4 space-y-3.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-2.5 w-8" />
                  </div>
                  <Skeleton className="mt-1.5 h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper p-5">
        <Skeleton className="h-3.5 w-24" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-control border border-line bg-paper-2 p-3">
              <Skeleton className="h-2.5 w-16" />
              <div className="mt-2 space-y-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between gap-2">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
