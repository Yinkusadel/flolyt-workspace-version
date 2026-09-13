import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Table2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { downloadJson, downloadTableCsv } from "@/lib/chart-and-table-exports";
import type { DataTablePayload } from "@/features/ai-conversations/response-parser";
import { ResponseCta } from "./response-cta";

const ROW_LIMIT = 5;

type SortState = { column: number; direction: "asc" | "desc" } | null;

function sortRows(rows: string[][], sort: SortState): string[][] {
  if (!sort) return rows;
  const { column, direction } = sort;
  return [...rows].sort((a, b) => {
    const av = a[column] ?? "";
    const bv = b[column] ?? "";
    const an = Number(av.replace(/[^0-9.-]/g, ""));
    const bn = Number(bv.replace(/[^0-9.-]/g, ""));
    const cmp = av !== "" && bv !== "" && !Number.isNaN(an) && !Number.isNaN(bn) ? an - bn : av.localeCompare(bv);
    return direction === "asc" ? cmp : -cmp;
  });
}

export function AiDataTable({ data }: { data: DataTablePayload }) {
  const [sort, setSort] = useState<SortState>(null);
  const [expanded, setExpanded] = useState(false);

  const rows = useMemo(() => sortRows(data.rows, sort), [data.rows, sort]);
  const visibleRows = expanded ? rows : rows.slice(0, ROW_LIMIT);
  const hasMore = rows.length > ROW_LIMIT;

  const toggleSort = (column: number) => {
    setSort((prev) => {
      if (!prev || prev.column !== column) return { column, direction: "asc" };
      return prev.direction === "asc" ? { column, direction: "desc" } : null;
    });
  };

  return (
    <div className="group max-w-full min-w-0 overflow-hidden rounded-card border border-line bg-paper">
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <Table2 className="size-3.5 shrink-0 text-ink-4" />
        <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-ink-3">{data.title}</span>
        <ResponseCta
          onCopy={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          onDownloadCsv={() => downloadTableCsv(data.title, data.columns, data.rows)}
          onDownloadJson={() => downloadJson(data.title, data)}
        />
      </div>

      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              {data.columns.map((column, idx) => (
                <th key={`${column}-${idx}`} className="px-3.5 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort(idx)}
                    className="inline-flex items-center gap-1 text-[10.5px] font-medium tracking-[0.4px] whitespace-nowrap text-ink-4 uppercase"
                  >
                    {column}
                    {sort?.column === idx &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIdx) => (
              <tr key={rowIdx} className={cn("border-b border-line last:border-b-0", rowIdx % 2 === 1 && "bg-paper-2/50")}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-3.5 py-2 text-[12px] whitespace-nowrap text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(hasMore || data.totalCount) && (
        <div className="flex items-center justify-between border-t border-line px-3.5 py-2">
          <span className="text-[11px] text-ink-4">
            {data.totalCount ? `Showing ${visibleRows.length} of ${data.totalCount}` : ""}
          </span>
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-[11px] font-medium text-ultra hover:underline"
            >
              {expanded ? "Show less" : `Show all ${rows.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
