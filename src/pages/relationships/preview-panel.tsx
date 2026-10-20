import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import usePreviewRelationship from "@/features/datasource-relationships/use-preview-relationship";
import { datasetKey } from "@/features/datasource-relationships/use-declare-relationship";
import { ApproveSection } from "@/pages/relationships/approve-section";
import { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type {
  RelationshipCatalogDataset,
  RelationshipMapping,
  RelationshipPreview,
  RelationshipPreviewSummary,
} from "@/services/api/datasource-relationships/types";

type CountTone = "good" | "gap" | "problem" | "plain";

const COUNT_TONE_CLASS: Record<CountTone, string> = {
  good: "text-teal",
  gap: "text-amber",
  problem: "text-rose",
  plain: "text-ink-2",
};

function CountCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: CountTone;
}) {
  // Problems and gaps only take their colour when there is something to look at.
  const shown = (tone === "gap" || tone === "problem") && value === 0 ? "plain" : tone;

  return (
    <div className="min-w-0 rounded-card border border-line bg-paper p-3.5">
      <p className={cn("font-mono text-[20px] font-semibold tabular-nums", COUNT_TONE_CLASS[shown])}>
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-[11.5px] font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-ink-3">{hint}</p>
    </div>
  );
}

function CountGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-[11.5px] font-semibold text-ink">{title}</h3>
        {hint && <p className="mt-0.5 text-[10.5px] text-ink-3">{hint}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3" aria-busy>
      <p className="text-[11px] text-ink-3">Reading your data. This can take up to 30 seconds.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-card" />
        ))}
      </div>
    </div>
  );
}

function PreviewResult({
  summary,
  hasBridge,
  observedAt,
  expiresAt,
}: {
  summary: RelationshipPreviewSummary;
  hasBridge: boolean;
  observedAt: Date;
  expiresAt: Date;
}) {
  const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {summary.partial ? (
          <Chip tone="amber">Partial preview</Chip>
        ) : (
          <Chip tone="teal">Complete for the selected datasets</Chip>
        )}
        {summary.canApprove ? (
          <Chip tone="teal">Can be approved</Chip>
        ) : (
          <Chip tone="rose">Cannot be approved yet</Chip>
        )}
        <span className="text-[10.5px] text-ink-4">
          Ran at {time(observedAt)}. Valid until {time(expiresAt)}.
        </span>
      </div>

      {summary.partial && (
        <div className="rounded-card border border-amber-border bg-amber-bg p-3.5 text-[11px] text-ink-2">
          <p className="font-semibold text-ink">Only part of each dataset was read</p>
          <p className="mt-1">
            The preview stops at 10,000 rows per dataset. A row with no match here is counted as
            unresolved, not as a record that does not exist. Approving a partial preview needs an
            explicit choice.
          </p>
        </div>
      )}

      <CountGroup title="Rows read" hint="How much of each dataset this preview looked at.">
        <CountCard label="Source rows" value={summary.sourceRowsExamined} hint="Rows read from the first dataset" tone="plain" />
        <CountCard label="Target rows" value={summary.targetRowsExamined} hint="Rows read from the second dataset" tone="plain" />
        {hasBridge && (
          <CountCard label="Bridge rows" value={summary.bridgeRowsExamined} hint="Rows read from the bridge table" tone="plain" />
        )}
      </CountGroup>

      <CountGroup title="Matches" hint="Counted over the source rows that were read.">
        <CountCard label="Matched" value={summary.matched} hint="Source rows that found their target" tone="good" />
      </CountGroup>

      <CountGroup title="Gaps" hint="Not errors. These records stay visible as gaps.">
        <CountCard label="Unmatched" value={summary.unmatched} hint="Source rows with no target" tone="gap" />
        <CountCard label="Unresolved" value={summary.unresolved} hint="Could not be decided because the read was partial" tone="gap" />
        <CountCard label="Missing source key" value={summary.sourceMissingKeys} hint="Source rows with an empty key" tone="gap" />
        <CountCard label="Missing target key" value={summary.targetMissingKeys} hint="Target rows with an empty key" tone="gap" />
        {hasBridge && (
          <CountCard label="Missing bridge key" value={summary.bridgeMissingKeys} hint="Bridge table rows with an empty key" tone="gap" />
        )}
      </CountGroup>

      <CountGroup title="Problems" hint="Any of these blocks approval until the data or the declaration changes.">
        <CountCard label="Ambiguous" value={summary.ambiguous} hint="Source rows that match more than one target" tone="problem" />
        <CountCard label="Malformed keys" value={summary.malformedKeys} hint="Keys that could not be compared" tone="problem" />
        <CountCard label="Cardinality violations" value={summary.cardinalityViolations} hint="Duplicate key groups or invalid bridge fan-out" tone="problem" />
      </CountGroup>

      <p className="text-[10.5px] text-ink-3">
        These are row counts. They are not money, and they do not show how complete your history is.
      </p>
    </div>
  );
}

function PreviewError({
  error,
  onReload,
}: {
  error: RelationshipApiError;
  onReload: () => void;
}) {
  const changed = error.status === 409;
  const title =
    error.status === 403
      ? "Only workspace administrators can run a preview"
      : changed
        ? "This relationship changed since you opened it"
        : error.status === 422
          ? "The preview could not be completed safely"
          : "The preview failed";

  return (
    <div className="rounded-card border border-rose-border bg-rose-bg p-4">
      <h3 className="text-[12px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-[10.5px] text-ink-2">{error.message}</p>
      {error.validationIssues.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
          {error.validationIssues.map((issue, index) => (
            <li key={`${issue.field}-${index}`}>
              {issue.field ? <span className="font-mono">{issue.field}: </span> : null}
              {issue.message}
            </li>
          ))}
        </ul>
      )}
      {changed && (
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onReload}>
          Reload and try again
        </Button>
      )}
    </div>
  );
}

/**
 * POST /{id}/preview (step 4 of docs/datasource-relationships/build-plan.md), verified live
 * 2026-10-20. A preview is a read-only check, so there is nothing to invalidate. The receipt it
 * returns (`id`, valid until `expiresAtUtc`) is kept in component state for the approval step.
 */
export function PreviewPanel({
  mapping,
  datasets,
  onReload,
}: {
  mapping: RelationshipMapping;
  datasets: RelationshipCatalogDataset[];
  onReload: () => void;
}) {
  const [ran, setRan] = useState<RelationshipPreview | null>(null);
  const { previewRelationship, isPending, error, reset } = usePreviewRelationship({
    onSuccess: setRan,
  });

  const { definition } = mapping;

  // Datasets in this declaration that the backend says cannot be previewed.
  const blockers = useMemo(() => {
    const keys = [
      datasetKey(definition.from.dataset),
      datasetKey(definition.to.dataset),
      ...(definition.crosswalk ? [datasetKey(definition.crosswalk.dataset)] : []),
    ];
    return datasets.filter((d) => keys.includes(datasetKey(d.dataset)) && !d.previewSupported);
  }, [datasets, definition]);

  const canRun = blockers.length === 0 && !isPending;
  // A result belongs to the revision it was run against. After an edit it is stale.
  const current = ran && ran.declarationRevision === mapping.revision ? ran : null;
  const apiError = error instanceof RelationshipApiError ? error : null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Preview</h2>
          <p className="mt-0.5 max-w-xl text-[10.5px] text-ink-3">
            Checks this declaration against your data. It reads at most 10,000 rows per dataset and
            changes nothing.
          </p>
        </div>
        <Button
          type="button"
          disabled={!canRun}
          onClick={() => {
            setRan(null);
            reset();
            previewRelationship({ id: mapping.id, payload: { expectedRevision: mapping.revision } });
          }}
        >
          {isPending ? "Running..." : current ? "Run again" : "Run preview"}
        </Button>
      </div>

      {blockers.length > 0 && (
        <div className="rounded-card border border-amber-border bg-amber-bg p-3.5 text-[11px] text-ink-2">
          <p className="font-semibold text-ink">This relationship cannot be previewed yet</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {blockers.map((d) => (
              <li key={datasetKey(d.dataset)}>
                {d.dataset.datasetId}
                {d.previewLimitations.length > 0 ? `: ${d.previewLimitations.join(" ")}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isPending ? (
        <PreviewSkeleton />
      ) : apiError ? (
        <PreviewError error={apiError} onReload={onReload} />
      ) : current?.summary ? (
        <div className="space-y-6">
          <PreviewResult
            summary={current.summary}
            hasBridge={!!definition.crosswalk}
            observedAt={new Date(current.observedAtUtc)}
            expiresAt={new Date(current.expiresAtUtc)}
          />
          {mapping.state !== "APPROVED" && (
            <ApproveSection key={current.id} mapping={mapping} preview={current} onReload={onReload} />
          )}
        </div>
      ) : current ? (
        <div className="rounded-card border border-dashed border-line bg-paper-2 p-6 text-center text-[11px] text-ink-3">
          The preview ran, but its response did not have the shape this page expects.
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
          <p className="text-[12.5px] font-semibold text-ink">No preview yet</p>
          <p className="mx-auto mt-1 max-w-md text-[11px] text-ink-3">
            Run a preview to see how many records match, which ones do not, and whether anything blocks
            approval.
          </p>
        </div>
      )}
    </section>
  );
}
