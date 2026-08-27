import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import { groupByCategory, POPULAR_DATASOURCE_NAMES } from "@/pages/onboarding/data/data";
import { SourceCard } from "@/pages/onboarding/data/source-card";

function CardSkeleton() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-panel border border-line bg-paper p-4">
      <Skeleton className="size-9 rounded-control" />
      <div className="w-full space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2.5 w-14" />
      </div>
    </div>
  );
}

export function SourceGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * From tablet up, the search bar and an optional `footer` (the "read-only" callout) stay fixed
 * while just the results scroll in their own bounded div, so a long category list can't grow the
 * page past the viewport. Below that breakpoint the whole thing reverts to plain block flow and
 * scrolls with the page, same as before this layout existed.
 */
export function SourceGrid({
  datasources,
  connectedNames,
  onSelect,
  footer,
}: {
  datasources: DatasourceDto[];
  connectedNames: Set<string>;
  onSelect: (datasource: DatasourceDto) => void;
  footer?: ReactNode;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return datasources;
    return datasources.filter(
      (ds) => ds.displayName.toLowerCase().includes(term) || ds.category.toLowerCase().includes(term)
    );
  }, [datasources, search]);

  const popular = useMemo(
    () => filtered.filter((ds) => POPULAR_DATASOURCE_NAMES.has(ds.name)),
    [filtered]
  );
  const rest = useMemo(
    () => filtered.filter((ds) => !POPULAR_DATASOURCE_NAMES.has(ds.name)),
    [filtered]
  );
  const grouped = useMemo(() => groupByCategory(rest), [rest]);

  return (
    <div className="flex flex-col md:h-full md:min-h-0">
      <div className="relative max-w-sm shrink-0">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sources..."
          className="h-8 pl-8"
        />
      </div>

      <div className="mt-4 space-y-8 md:min-h-0 md:flex-1 md:overflow-y-auto">
        {filtered.length === 0 && <p className="text-[12px] text-ink-3">No sources match "{search}".</p>}

        {popular.length > 0 && (
          <section className="space-y-3">
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Popular</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {popular.map((ds) => (
                <SourceCard
                  key={ds.id}
                  datasource={ds}
                  isConnected={connectedNames.has(ds.name)}
                  onClick={() => onSelect(ds)}
                />
              ))}
            </div>
          </section>
        )}

        {Array.from(grouped.entries()).map(([category, items]) => (
          <section key={category} className="space-y-3">
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{category}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((ds) => (
                <SourceCard
                  key={ds.id}
                  datasource={ds}
                  isConnected={connectedNames.has(ds.name)}
                  onClick={() => onSelect(ds)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {footer && <div className="mt-8 shrink-0 pb-6">{footer}</div>}
    </div>
  );
}
