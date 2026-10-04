import { Skeleton } from "@/components/ui/skeleton";

/** Shown only while no projection exists in memory yet; filter changes keep the old figures instead. */
export function LeakageMapSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading the leakage map">
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-3.5 w-80 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-32" />
      </div>
      {/* Same two notices the section shows once loaded (measurement banner, no-combined-total), so the cards don't jump down when they arrive. */}
      <Skeleton className="h-11" />
      <Skeleton className="h-11" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}
