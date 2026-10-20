import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import useGetRelationshipById from "@/features/datasource-relationships/use-get-relationship-by-id";
import useGetRelationshipCatalog from "@/features/datasource-relationships/use-get-relationship-catalog";
import { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type {
  RelationshipDatasetScope,
  RelationshipEndpoint,
} from "@/services/api/datasource-relationships/types";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import { PreviewPanel } from "@/pages/relationships/preview-panel";
import { DisableRelationshipModal } from "@/pages/relationships/disable-modal";
import { HistoryPanel } from "@/pages/relationships/history-panel";
import { RelationshipDeclare } from "@/pages/relationships/relationship-declare";
import { formatDateTime } from "@/pages/data-sources/format";
import { CARDINALITY_LABEL, STATE_LABEL, STATE_TONE } from "@/pages/relationships/labels";

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-3 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
      </div>
      <Skeleton className="h-40 rounded-card" />
    </div>
  );
}

function EndpointCard({
  title,
  endpoint,
  sourceLabel,
}: {
  title: string;
  endpoint: RelationshipEndpoint;
  sourceLabel?: string;
}) {
  const scope: RelationshipDatasetScope = endpoint.dataset;

  return (
    <div className="min-w-0 rounded-card border border-line bg-paper-2 p-4">
      <p className="text-[10.5px] font-semibold tracking-wide text-ink-3 uppercase">{title}</p>
      <p className="mt-2 truncate text-[12.5px] font-semibold text-ink">
        {sourceLabel && <span className="font-normal text-ink-4">{sourceLabel} / </span>}
        {scope.datasetId}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink-4">
        Subject: {scope.subjectType} · Grain: {scope.grain}
      </p>
      <ol className="mt-2.5 space-y-1">
        {endpoint.keyColumns.map((column, index) => (
          <li key={column} className="flex items-center gap-2 text-[11px]">
            <span className="w-3 shrink-0 text-[10px] font-semibold text-ultra">{index + 1}</span>
            <span className="min-w-0 truncate font-mono text-ink-2">{column}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * /relationships/:id. Header, what the relationship links, the preview, approval, edit, disable and
 * the history (docs/datasource-relationships/build-plan.md).
 */
export default function RelationshipDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editing = searchParams.get("view") === "edit";
  // The active tab lives in the URL (?tab=), default Overview.
  const tabParam = searchParams.get("tab");
  const tab = tabParam === "preview" || tabParam === "history" ? tabParam : "overview";
  const [disabling, setDisabling] = useState(false);
  const { relationship, isLoading, isError, error, refetch } = useGetRelationshipById(id);
  const { datasets } = useGetRelationshipCatalog();

  usePageBreadcrumb(
    editing && relationship
      ? [
          { label: "Relationships", to: "/relationships" },
          { label: relationship.definition.name, to: `/relationships/${relationship.id}` },
          { label: "Edit" },
        ]
      : [
          { label: "Relationships", to: "/relationships" },
          { label: relationship?.definition.name ?? "Relationship" },
        ]
  );

  if (isLoading) return <DetailSkeleton />;

  if (isError || !relationship) {
    const notFound = error instanceof RelationshipApiError && error.status === 404;

    return (
      <div className="mx-auto max-w-4xl rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">
          {notFound ? "Relationship not found" : "Could not load this relationship"}
        </p>
        <p className="mt-1 text-[11px] text-ink-3">
          {notFound
            ? "It may have been removed, or it belongs to another workspace."
            : error?.message}
        </p>
        {!notFound && (
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  const { definition } = relationship;

  if (editing) {
    return (
      <RelationshipDeclare
        mapping={relationship}
        onClose={() => setSearchParams({}, { replace: true })}
        onSaved={() => navigate(`/relationships/${relationship.id}`, { replace: true })}
        onReload={() => refetch()}
      />
    );
  }

  const sourceLabelOf = (datasourceId: string) =>
    datasets.find((d) => d.dataset.datasourceId === datasourceId)?.sourceLabel;
  // Limitation elements have not been seen with real data, so only plain strings are shown.
  const limitations = relationship.limitations.filter((item): item is string => typeof item === "string");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[17px] font-semibold text-ink">{definition.name}</h1>
          <Chip tone={STATE_TONE[relationship.state] ?? "neutral"}>
            {STATE_LABEL[relationship.state] ?? relationship.state}
          </Chip>
          <div className="ml-auto flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setSearchParams({ view: "edit" })}>
              Edit
            </Button>
            {relationship.state !== "DISABLED" && (
              <Button type="button" variant="outline" size="sm" onClick={() => setDisabling(true)}>
                Disable
              </Button>
            )}
          </div>
        </div>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {definition.meaning} · {CARDINALITY_LABEL[definition.cardinality] ?? definition.cardinality} ·
          Revision {relationship.revision}
        </p>
      </div>

      {/* Same as the Room page: the tab bar stays pinned under the top bar while the header above it
          scrolls away and the tab's content scrolls beneath it. Full-bleed (the side padding is
          cancelled and re-applied) with the page's own background so nothing shows through. */}
      <div className="sticky top-0 z-20 -mx-page bg-paper px-page">
        <UnderlineTabs
          active={tab}
          tabs={[
            { key: "overview", label: "Overview", to: `/relationships/${relationship.id}` },
            { key: "preview", label: "Preview and approval", to: `/relationships/${relationship.id}?tab=preview` },
            { key: "history", label: "History", to: `/relationships/${relationship.id}?tab=history` },
          ]}
        />
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          {relationship.state === "NEEDS_REVIEW" && (
            <div className="rounded-card border border-amber-border bg-amber-bg p-4 text-[11px] text-ink-2">
              <p className="text-[12px] font-semibold text-ink">A source changed since this was approved</p>
              <p className="mt-1">
                Its configuration, schema or permissions changed. Run a preview again before relying on it.
              </p>
            </div>
          )}

          {relationship.state === "DISABLED" && (
            <div className="rounded-card border border-line bg-paper-2 p-4 text-[11px] text-ink-2">
              <p className="text-[12px] font-semibold text-ink">This relationship is disabled</p>
              <p className="mt-1">
                It is not being used. To turn it back on, run a new preview and approve it again.
              </p>
            </div>
          )}

          {relationship.state === "APPROVED" && (
            <div className="rounded-card border border-teal-border bg-teal-bg p-4 text-[11px] text-ink-2">
              <p className="text-[12px] font-semibold text-ink">Approved</p>
              <p className="mt-1">
                An administrator approved revision {relationship.revision}
                {relationship.approval ? ` on ${formatDateTime(relationship.approval.approvedAtUtc)}` : ""}.
                {relationship.approval?.acceptedPartial
                  ? " They accepted a partial preview, so the data is checked again whenever it is used."
                  : ""}{" "}
                Any edit returns it to draft and clears the approval.
              </p>
            </div>
          )}

          {limitations.length > 0 && (
            <div className="rounded-card border border-line bg-paper-2 p-4">
              <p className="text-[12px] font-semibold text-ink">Limitations</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
                {limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </div>
          )}

          <section className="space-y-3">
            <h2 className="text-[13px] font-semibold text-ink">What it links</h2>
            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
              <EndpointCard
                title="From"
                endpoint={definition.from}
                sourceLabel={sourceLabelOf(definition.from.dataset.datasourceId)}
              />
              <ArrowRight className="mx-auto size-4 rotate-90 text-ink-4 md:rotate-0" aria-hidden />
              <EndpointCard
                title="To"
                endpoint={definition.to}
                sourceLabel={sourceLabelOf(definition.to.dataset.datasourceId)}
              />
            </div>
            {definition.crosswalk && (
              <p className="text-[10.5px] text-ink-3">
                Linked through the bridge table{" "}
                <span className="font-medium text-ink-2">{definition.crosswalk.dataset.datasetId}</span>:{" "}
                <span className="font-mono">({definition.crosswalk.fromColumns.join(", ")})</span> matches the
                From keys and{" "}
                <span className="font-mono">({definition.crosswalk.toColumns.join(", ")})</span> matches the To
                keys.
              </p>
            )}
            <div>
              <p className="text-[11px] font-semibold text-ink">Evidence</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
                {definition.evidence.map((item) => (
                  <li key={item} className="wrap-break-word">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}

      {tab === "preview" && (
        <PreviewPanel mapping={relationship} datasets={datasets} onReload={() => refetch()} />
      )}

      {tab === "history" && <HistoryPanel mapping={relationship} />}

      <DisableRelationshipModal
        open={disabling}
        onOpenChange={setDisabling}
        mapping={relationship}
      />
    </div>
  );
}
