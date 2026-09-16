import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import type { SchemaTableDto } from "@/services/api/dataplatform/get-schema-explorer";
import { confidenceTone, formatConfidence, formatDateTime } from "@/pages/schema/format";

function SchemaTableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <Skeleton className="h-4.5 w-16 shrink-0 rounded-chip" />
      <Skeleton className="h-4.5 w-12 shrink-0 rounded-chip" />
    </div>
  );
}

export function SchemaTableListSkeleton() {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <SchemaTableRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function SchemaTableRow({ table }: { table: SchemaTableDto }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-ink">{table.tableName}</p>
          <p className="truncate text-[10.5px] text-ink-4">
            {table.datasourceType} · {table.columns.length} columns
            {table.rowCount != null && ` · ${table.rowCount.toLocaleString()} rows`}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <Chip tone="ultra">{table.classifiedType}</Chip>
            <Chip tone={confidenceTone(table.confidence)}>{formatConfidence(table.confidence)}</Chip>
          </div>
          {table.lastSyncedAt && (
            <p className="text-[10px] text-ink-4">Synced {formatDateTime(table.lastSyncedAt)}</p>
          )}
        </div>

        <ChevronDown
          className={cn("size-3.5 shrink-0 text-ink-4 transition-transform", expanded && "rotate-180")}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="overflow-x-auto border-t border-line bg-paper">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-2 text-[10px] font-semibold tracking-[0.3px] text-ink-4 uppercase">Column</th>
                <th className="px-4 py-2 text-[10px] font-semibold tracking-[0.3px] text-ink-4 uppercase">Native type</th>
                <th className="px-4 py-2 text-[10px] font-semibold tracking-[0.3px] text-ink-4 uppercase">Mapped role</th>
                <th className="px-4 py-2 text-[10px] font-semibold tracking-[0.3px] text-ink-4 uppercase">Confidence</th>
                <th className="px-4 py-2 text-[10px] font-semibold tracking-[0.3px] text-ink-4 uppercase">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {table.columns.map((column) => (
                <tr key={column.columnName}>
                  <td className="px-4 py-2 font-mono text-[10.5px] text-ink-2">{column.columnName}</td>
                  <td className="px-4 py-2 text-[10.5px] text-ink-3">{column.nativeDataType}</td>
                  <td className="px-4 py-2 text-[10.5px] text-ink-3">{column.mappedRole}</td>
                  <td className="px-4 py-2">
                    <Chip tone={confidenceTone(column.confidence)}>{formatConfidence(column.confidence)}</Chip>
                  </td>
                  <td className="px-4 py-2">
                    {column.flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {column.flags.map((flag) => (
                          <Chip key={flag} tone="neutral">
                            {flag}
                          </Chip>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10.5px] text-ink-4">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
