import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSchemaExplorer from "@/features/dataplatform/use-get-schema-explorer";
import { SchemaTableListSkeleton, SchemaTableRow } from "@/pages/schema/schema-table-row";

function StatCard({ eyebrow, value }: { eyebrow: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-paper p-4">
      <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{eyebrow}</p>
      <p className="mt-2.5 text-[19px] font-semibold text-ink-2">{value}</p>
    </div>
  );
}

export default function SchemaRoute() {
  const { schemaExplorer, isLoading, isError, refetch } = useGetSchemaExplorer();
  const { tables, totalDatasources, totalColumns } = schemaExplorer;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          The schema Flolyt has inferred across every connected datasource — tables, columns, and
          how confidently each one was classified.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-card border border-line bg-paper p-4">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="mt-2.5 h-4.5 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <StatCard eyebrow="Datasources" value={String(totalDatasources)} />
          <StatCard eyebrow="Columns" value={String(totalColumns)} />
        </div>
      )}

      {isLoading ? (
        <SchemaTableListSkeleton />
      ) : isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load the schema.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : tables.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
          <p className="text-[12.5px] font-semibold text-ink">No schema classified yet</p>
          <p className="mt-1 text-[11px] text-ink-3">
            This fills in once a connected datasource has been synced at least once.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
          {tables.map((table) => (
            <SchemaTableRow key={`${table.clientDatasourceId}-${table.tableName}`} table={table} />
          ))}
        </div>
      )}
    </div>
  );
}
