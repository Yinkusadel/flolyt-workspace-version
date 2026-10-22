import { cn } from "@/lib/utils";
import type {
  DataMapDto,
  DataMapTableDto,
} from "@/services/api/workspace/get-data-map";

const CONFIDENCE_CLASS: Record<"high" | "medium" | "low", string> = {
  high: "text-teal",
  medium: "text-amber",
  low: "text-rose",
};

export type MappingRow = DataMapTableDto & { sourceName: string };

export const toMappingRows = (dataMap: DataMapDto): MappingRow[] =>
  dataMap.sources.flatMap((source) =>
    source.tables.map((table) => ({ ...table, sourceName: source.name })),
  );

/**
 * The "your table / rows / mapped to / confidence" list off GET .../workspace/data-map, shared by
 * the onboarding mapping step and the Data sources "Mapping" tab. Unmapped rows stay visible on
 * purpose, see docs/endpoints/workspace.md.
 */
export function MappingTable({
  rows,
  showSourceName,
}: {
  rows: MappingRow[];
  showSourceName: boolean;
}) {
  return (
    <>
      <div className="sticky top-0 z-10 hidden border-b border-line bg-paper pb-2.5 sm:grid sm:grid-cols-[1fr_90px_1fr_90px] sm:gap-3">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Your table
        </p>
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Rows
        </p>
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Mapped to
        </p>
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Confidence
        </p>
      </div>

      {rows.map((row, i) => (
        <div
          key={`${row.sourceName}-${row.tableName}-${i}`}
          className="flex flex-col gap-2 border-b border-line py-3 sm:grid sm:grid-cols-[1fr_90px_1fr_90px] sm:items-center sm:gap-3"
        >
          <div className="min-w-0">
            <p className="truncate font-mono text-[12px] text-ink">
              {row.tableName}
            </p>
            {showSourceName && (
              <p className="mt-0.5 text-[10px] text-ink-4">{row.sourceName}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:block">
            <span className="font-mono text-[9px] tracking-[0.85px] text-ink-4 uppercase sm:hidden">
              Rows
            </span>
            <p className="font-mono text-[11.5px] text-ink-2">
              {row.rowCount.toLocaleString()}
            </p>
          </div>

          <div className="min-w-0">
            {row.mappedTo ? (
              <>
                <p className="text-[12px] font-semibold text-ink">
                  {row.mappedTo}
                </p>
                {row.mappedColumns.length > 0 && (
                  <div className="group/cols relative mt-0.5 sm:w-fit sm:max-w-full">
                    {/* Wraps freely on mobile (no truncate/tooltip — a nowrap span here was
                    forcing the whole page's layout viewport to blow past device width,
                    which mobile browsers respond to by auto-zooming out to fit; the
                    hover tooltip is also unreachable on touch anyway). Truncated with a
                    hover tooltip only from sm: up, where the grid gives it a fixed track
                    width to truncate against. */}
                    <p className="font-mono text-[10px] text-ink-4 sm:truncate">
                      {row.mappedColumns.join(", ")}
                    </p>
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute top-full left-0 z-50 mt-1.5 hidden w-max max-w-xs rounded-panel bg-ink px-3 py-1.5 font-mono text-[11px] text-paper opacity-0 shadow-md transition-opacity duration-150 group-hover/cols:opacity-100 sm:block"
                    >
                      {row.mappedColumns.join(", ")}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[12px] text-ink-4">not mapped</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:block">
            <span className="font-mono text-[9px] tracking-[0.85px] text-ink-4 uppercase sm:hidden">
              Confidence
            </span>
            <p
              className={cn(
                "font-mono text-[11px] font-semibold",
                row.confidenceBand
                  ? CONFIDENCE_CLASS[row.confidenceBand]
                  : "text-ink-4",
              )}
            >
              {row.confidenceBand ?? "—"}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
