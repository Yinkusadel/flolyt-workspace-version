import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
};

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * The WHERE/CUSTOMERS/VALUE-style tables used across nearly every tab (channels, cohorts,
 * markets, agents, history). `emptyTitle`/`emptyBody` cover the zero-rows case — pass a
 * stage-specific reason when one is known; the defaults stay generic rather than inventing one.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyTitle = "Nothing here yet",
  emptyBody = "There's no data to show for this table right now.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[640px] text-left text-[11.5px]">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th key={col.key} className={cn(HEAD_CLASS, col.align === "right" && "text-right")}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                <p className="text-[12px] font-semibold text-ink">{emptyTitle}</p>
                <p className="mx-auto mt-1.5 max-w-md text-[10.5px] leading-relaxed text-ink-4">{emptyBody}</p>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 align-middle", col.align === "right" && "text-right")}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
