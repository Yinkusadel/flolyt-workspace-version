import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeakageLimitations } from "@/features/leakage/use-get-leakage-limitations";
import type { LeakageV2LimitationCode, LeakageV2LimitationSummary } from "@/services/api/leakage/get-leakage";
import { humanizeEnum, sentenceCase } from "@/pages/leakage-map/format";
import { DIAGNOSTICS_ALL, type DiagnosticsFilter } from "@/pages/leakage-map/drawer/use-diagnostics-param";

const PAGE_SIZE = 50;

export const LIMITATION_CODE_LABEL: Record<LeakageV2LimitationCode, string> = {
  CAPABILITY_GAP: "Capability gap",
  SECTOR_ASSIGNMENT_MISSING: "Sector assignment",
  PRICING_INPUT_MISSING: "Pricing input",
  BASELINE_HISTORY_MISSING: "Baseline history",
  CURRENCY_POLICY_MISSING: "Currency policy",
  NORMALIZED_FACTS_UNAVAILABLE: "Platform reader",
  OTHER: "Other",
};

interface DiagnosticsDrawerProps {
  summary: LeakageV2LimitationSummary;
  /** `null` = closed. */
  filter: DiagnosticsFilter | null;
  onFilterChange: (filter: DiagnosticsFilter) => void;
  onClose: () => void;
}

/**
 * Every diagnostic behind the page's bounded limitation summary, fetched only while this drawer is open and
 * paged 50 at a time. The chips are the summary's own groups (with the counts it reported); picking one asks
 * the server for just that code. Never reads the page's compatibility `limitations` strings.
 */
export function DiagnosticsDrawer({ summary, filter, onFilterChange, onClose }: DiagnosticsDrawerProps) {
  const [offset, setOffset] = useState(0);
  // Back to the first page whenever the drawer closes, and (in `changeFilter`) the moment another kind is picked,
  // so a new kind never asks the server for the old kind's page number.
  useEffect(() => {
    if (!filter) setOffset(0);
  }, [filter]);
  const changeFilter = (next: DiagnosticsFilter) => {
    setOffset(0);
    onFilterChange(next);
  };

  const code = filter && filter !== DIAGNOSTICS_ALL ? filter : undefined;
  const { data, isLoading, isError, isFetching, refetch } = useGetLeakageLimitations(
    { offset, limit: PAGE_SIZE, code },
    !!filter
  );
  const page = data?.data;
  const group = code ? summary.items.find((item) => item.code === code) : undefined;

  return (
    <Sheet open={!!filter} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[46rem]">
        <SheetHeader className="gap-2">
          <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">Diagnostics</p>
          <SheetTitle className="text-[18px]">Why some leakage isn't counted</SheetTitle>
          <SheetDescription>
            {summary.detailCount.toLocaleString("en-US")} {summary.detailCount === 1 ? "diagnostic" : "diagnostics"} behind the
            summary, as the server recorded them.
          </SheetDescription>
          <div role="tablist" aria-label="Diagnostic kind" className="flex flex-wrap gap-1.5 pt-1">
            <FilterChip active={!code} label="All" count={summary.detailCount} onClick={() => changeFilter(DIAGNOSTICS_ALL)} />
            {summary.items.map((item) => (
              <FilterChip
                key={item.code}
                active={code === item.code}
                label={LIMITATION_CODE_LABEL[item.code] ?? humanizeEnum(item.code)}
                count={item.affectedCount}
                onClick={() => changeFilter(item.code)}
              />
            ))}
          </div>
        </SheetHeader>

        <SheetBody className="px-5 py-4">
          {group && (
            <div className="mb-4 rounded-card border border-line bg-paper-2 p-3.5">
              <span className="rounded-chip bg-amber-bg px-2 py-0.5 font-mono text-[9px] font-semibold text-amber uppercase">
                {humanizeEnum(group.origin)}
              </span>
              <p className="mt-2 text-[12.5px] font-semibold text-ink">{group.message}</p>
              <p className="mt-1 text-[11px] text-ink-3">Recommended: {sentenceCase(group.recommendedAction)}</p>
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-line">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="grid grid-cols-[8rem_1fr_3rem] gap-4 py-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (isError || !page) && (
            <div>
              <p className="text-[11.5px] text-rose">Couldn't load the diagnostics.</p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {page && page.items.length === 0 && <p className="text-[11.5px] text-ink-3">No diagnostics of this kind.</p>}

          {page && page.items.length > 0 && (
            <div className={cn("overflow-x-auto transition-opacity", isFetching && "opacity-60")}>
              <table className="w-full min-w-[34rem] text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-line text-[10px] text-ink-4">
                    <th className="py-2 pr-3 font-medium">Reference</th>
                    <th className="px-3 py-2 font-medium">Detail</th>
                    <th className="py-2 pl-3 text-right font-medium">Currency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {page.items.map((item, i) => (
                    <tr key={`${item.referenceId ?? "none"}-${offset + i}`} className="align-top">
                      <td className="py-2.5 pr-3">
                        <p className="font-mono text-[9px] tracking-wide text-ink-4 uppercase">
                          {item.referenceType ? humanizeEnum(item.referenceType) : "General"}
                        </p>
                        <p className="font-mono text-[11px] text-ink-2">
                          {item.referenceId ? `${item.referenceId.slice(0, 8)}…` : "none"}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 leading-relaxed text-ink-2">{item.message}</td>
                      <td className="py-2.5 pl-3 text-right font-mono text-ink-3">{item.currency ?? "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SheetBody>

        {page && page.total > 0 && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p className="font-mono text-[10.5px] text-ink-3">
              {(page.offset + 1).toLocaleString("en-US")}–{Math.min(page.offset + page.limit, page.total).toLocaleString("en-US")} of{" "}
              {page.total.toLocaleString("en-US")}
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={page.offset + page.limit >= page.total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next {Math.min(PAGE_SIZE, Math.max(page.total - (page.offset + page.limit), 0))}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FilterChip({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] transition-colors",
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink-4"
      )}
    >
      {label}
      <span className={cn("font-mono text-[10.5px]", active ? "text-paper/70" : "text-ink-4")}>{count.toLocaleString("en-US")}</span>
    </button>
  );
}
