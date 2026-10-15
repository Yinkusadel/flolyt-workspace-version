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
      {/* The notice row the section shows once loaded, so the cards don't jump down when it arrives. */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-60" />
      <Skeleton className="h-72" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
