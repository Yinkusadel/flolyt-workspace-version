import { Chip } from "@/components/ui/chip";
import type { DataMapSummaryDto } from "@/services/api/workspace/get-data-map";

const EYEBROW_CLASS =
  "font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className={EYEBROW_CLASS}>{label}</p>
      <p className="mt-1.5 text-[17px] font-semibold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-[10.5px] text-ink-4">{hint}</p>}
    </div>
  );
}

function EntityRow({
  label,
  entities,
  tone,
  empty,
}: {
  label: string;
  entities: string[];
  tone: "teal" | "amber";
  empty: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
      <p className={`${EYEBROW_CLASS} sm:w-20 sm:shrink-0 sm:pt-1`}>{label}</p>
      {entities.length === 0 ? (
        <p className="text-[11.5px] text-ink-3">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {entities.map((entity) => (
            <Chip key={entity} tone={tone}>
              {entity}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The `summary` block of GET .../workspace/data-map, every figure as the server sent it (nothing is
 * added up here). totalRows is the warehouse's own estimate and a floor, per docs/endpoints/workspace.md,
 * so it is labelled as one and the uncounted tables are named beside it.
 */
export function MappingSummary({ summary }: { summary: DataMapSummaryDto }) {
  return (
    <div className="space-y-5 rounded-card border border-line bg-paper-2 p-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
        <Stat
          label="Tables mapped"
          value={`${summary.mappedTableCount} of ${summary.tableCount}`}
          hint={
            summary.unmappedTableCount > 0
              ? `${summary.unmappedTableCount} not mapped`
              : null
          }
        />
        <Stat
          label="Low confidence"
          value={String(summary.lowConfidenceTableCount)}
          hint={
            summary.lowConfidenceTableCount > 0
              ? "mapped, but not counted yet"
              : null
          }
        />
        <Stat
          label="Rows read"
          value={`about ${summary.totalRows.toLocaleString()}`}
          hint={
            summary.uncountedTableCount > 0
              ? `at least, ${summary.uncountedTableCount} ${summary.uncountedTableCount === 1 ? "table" : "tables"} not counted`
              : "a warehouse estimate"
          }
        />
        <Stat
          label="Sources read"
          value={`${summary.analysedSourceCount} of ${summary.sourceCount}`}
        />
      </div>

      <div className="space-y-3 border-t border-line pt-4">
        <EntityRow
          label="Covered"
          entities={summary.entitiesCovered}
          tone="teal"
          empty="No entity is covered yet."
        />
        <EntityRow
          label="Missing"
          entities={summary.entitiesMissing}
          tone="amber"
          empty="Nothing is missing."
        />
      </div>
    </div>
  );
}
