import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { ArrowRight, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Callout } from "@/components/ui/rail";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import useGetRelationshipCatalog from "@/features/datasource-relationships/use-get-relationship-catalog";
import useDeclareRelationship, {
  datasetKey,
} from "@/features/datasource-relationships/use-declare-relationship";
import {
  IDENTITY_CARDINALITIES,
  MAX_EVIDENCE,
  RELATIONSHIP_CARDINALITIES,
  RELATIONSHIP_MEANINGS,
} from "@/validators/datasource-relationships";
import { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type {
  RelationshipCatalogDataset,
  RelationshipMapping,
} from "@/services/api/datasource-relationships/types";
import { KeyColumnsPicker } from "@/pages/relationships/key-columns-picker";
import { CARDINALITY_LABEL } from "@/pages/relationships/labels";

const MEANING_HINT: Record<string, string> = {
  Reference: "Points at a related record, like an invoice pointing at its account.",
  Identity: "Both sides are the same thing, like a contact and a person.",
};

function OptionButton({
  pressed,
  disabled,
  onClick,
  children,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-panel border px-3 py-1.5 text-[11.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        pressed
          ? "border-ultra bg-ultra-bg font-semibold text-ultra"
          : "border-line bg-paper-2 text-ink-3 hover:border-ink-4 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-[11px] text-destructive">{message}</p> : null;
}

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h2 className="text-[12.5px] font-semibold text-ink">{title}</h2>
      {hint && <p className="mt-0.5 text-[10.5px] text-ink-3">{hint}</p>}
    </div>
  );
}

function DeclareSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-full rounded-panel" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56 rounded-card" />
        <Skeleton className="h-56 rounded-card" />
      </div>
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}

function DatasetNotes({ dataset }: { dataset: RelationshipCatalogDataset }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10.5px] text-ink-4">
        Subject: {dataset.dataset.subjectType} · Grain: {dataset.dataset.grain}
      </p>
      {dataset.readPermission !== "ALLOWED" && (
        <p className="text-[10.5px] text-amber">
          Read permission is {dataset.readPermission}. A preview may not be able to read this dataset.
        </p>
      )}
      {!dataset.previewSupported && (
        <div className="rounded-panel border border-amber-border bg-amber-bg px-2.5 py-2 text-[10.5px] text-ink-2">
          <p className="font-semibold text-ink">This dataset cannot be previewed yet</p>
          {dataset.previewLimitations.length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {dataset.previewLimitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          )}
          <p className="mt-1">You can save a draft, but it needs a grain-aware projection before it can be approved.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Declare form (step 3 of docs/datasource-relationships/build-plan.md): POST /datasource-relationships.
 * Also the edit form (step 6): pass `mapping` to prefill it and save with PUT and the mapping's
 * revision. Built from the real GET /catalog response. Not covered here: the optional crosswalk (a
 * bridge dataset for sources with different identifiers), so a relationship that has one is not
 * editable here. A saved relationship opens its detail page, where the preview runs.
 */
export function RelationshipDeclare({
  onClose,
  onSaved,
  mapping,
  onReload,
}: {
  onClose: () => void;
  onSaved: (mapping: RelationshipMapping) => void;
  mapping?: RelationshipMapping;
  onReload?: () => void;
}) {
  usePageBreadcrumb(
    mapping
      ? [
          { label: "Relationships", to: "/relationships" },
          { label: mapping.definition.name, to: `/relationships/${mapping.id}` },
          { label: "Edit" },
        ]
      : [{ label: "Relationships", to: "/relationships" }, { label: "Declare" }]
  );

  const { datasets, suggestions, isLoading, isError, error: catalogError, refetch } =
    useGetRelationshipCatalog();
  const { form, onSubmit, applySuggestion, isPending, error } = useDeclareRelationship(datasets, {
    onSuccess: onSaved,
    editing: mapping,
  });
  const [prefilledFrom, setPrefilledFrom] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = form;

  const byKey = useMemo(() => new Map(datasets.map((d) => [datasetKey(d.dataset), d])), [datasets]);
  const datasetOptions = useMemo(
    () =>
      datasets.map((d) => ({
        value: datasetKey(d.dataset),
        label: d.dataset.datasetId,
        group: d.sourceLabel,
      })),
    [datasets]
  );
  const sourceLabelOf = (datasourceId: string) =>
    datasets.find((d) => d.dataset.datasourceId === datasourceId)?.sourceLabel;

  const fromKey = watch("fromDataset");
  const toKey = watch("toDataset");
  const meaning = watch("meaning");
  const cardinality = watch("cardinality");
  const fromKeyColumns = watch("fromKeyColumns") ?? [];
  const toKeyColumns = watch("toKeyColumns") ?? [];
  const evidence = watch("evidence") ?? [""];
  const fromDataset = byKey.get(fromKey) ?? null;
  const toDataset = byKey.get(toKey) ?? null;

  // Direct key components must have the same type. The backend is the authority: this only warns.
  const typeMismatches = useMemo(() => {
    if (!fromDataset || !toDataset) return [];
    const pairs: string[] = [];
    for (let i = 0; i < Math.min(fromKeyColumns.length, toKeyColumns.length); i++) {
      const a = fromDataset.columns.find((c) => c.name === fromKeyColumns[i]);
      const b = toDataset.columns.find((c) => c.name === toKeyColumns[i]);
      if (a && b && a.keyType !== b.keyType) {
        pairs.push(`${a.name} (${a.keyType}) and ${b.name} (${b.keyType})`);
      }
    }
    return pairs;
  }, [fromDataset, toDataset, fromKeyColumns, toKeyColumns]);

  const serverIssues = error instanceof RelationshipApiError ? error.validationIssues : [];
  const changedUnderneath = error instanceof RelationshipApiError && error.status === 409;

  if (isLoading) return <DeclareSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">Could not load your datasets</p>
        <p className="mt-1 text-[11px] text-ink-3">{catalogError?.message}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="mx-auto max-w-4xl rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">No datasets to link yet</p>
        <p className="mx-auto mt-1 max-w-md text-[11px] text-ink-3">
          Connect a source and let it finish analysis first. Tables only appear here once Flolyt has
          profiled them.
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onClose}>
          Back to relationships
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-7">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">
          {mapping ? "Edit relationship" : "Declare a relationship"}
        </h1>
        <p className="mt-1 max-w-2xl text-[11.5px] text-ink-3">
          {mapping
            ? `You are editing revision ${mapping.revision}.`
            : "Say how records in one dataset match records in another. This saves a draft. Nothing is used until an administrator previews and approves it."}
        </p>
      </div>

      {mapping && mapping.state !== "DRAFT" && (
        <div className="rounded-card border border-amber-border bg-amber-bg p-4 text-[11px] text-ink-2">
          <p className="text-[12px] font-semibold text-ink">
            {mapping.state === "DISABLED" ? "This relationship is disabled" : "Saving clears the approval"}
          </p>
          <p className="mt-1">
            {mapping.state === "DISABLED"
              ? "Saving keeps it disabled. A new preview and approval turn it back on."
              : "Saving returns this relationship to draft. You will need to preview and approve it again before it is used."}
          </p>
        </div>
      )}

      {!mapping && suggestions.length > 0 && (
        <section className="space-y-2.5">
          <SectionHeading
            title="Start from a suggestion"
            hint="Found from foreign keys in your databases. A suggestion only fills in the form."
          />
          <ul className="max-h-56 divide-y divide-line overflow-y-auto rounded-card border border-line bg-paper-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.name} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5">
                <p className="min-w-0 flex-1 basis-64 text-[11px] text-ink-2">
                  {sourceLabelOf(suggestion.from.datasourceId) && (
                    <span className="text-ink-4">{sourceLabelOf(suggestion.from.datasourceId)} / </span>
                  )}
                  <span className="font-medium text-ink">{suggestion.from.datasetId}</span>{" "}
                  <span className="font-mono text-[10px] text-ink-3">({suggestion.fromColumns.join(", ")})</span>
                  <ArrowRight className="mx-1.5 inline size-3 text-ink-4" aria-hidden />
                  <span className="font-medium text-ink">{suggestion.to.datasetId}</span>{" "}
                  <span className="font-mono text-[10px] text-ink-3">({suggestion.toColumns.join(", ")})</span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    applySuggestion(suggestion);
                    setPrefilledFrom(suggestion.name);
                  }}
                >
                  Use this
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!mapping && prefilledFrom && (
        <Callout tone="neutral" title="Filled in from a suggestion">
          The datasets, key columns and evidence came from the foreign key {prefilledFrom}. Check them,
          then choose how many rows sit on each side.
        </Callout>
      )}

      <section>
        <label htmlFor="relationship-name" className="text-[12.5px] font-semibold text-ink">
          Name
        </label>
        <Input
          id="relationship-name"
          placeholder="e.g. Invoice to ledger account"
          aria-invalid={!!errors.name}
          disabled={isPending}
          className="mt-2"
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </section>

      <section className="space-y-2.5">
        <SectionHeading title="What matches what" hint="The link runs from the first dataset's rows to the second's." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-3 rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[10.5px] font-semibold tracking-wide text-ink-3 uppercase">From</p>
            <div>
              <label htmlFor="from-dataset" className="text-[11px] text-ink-3">
                Dataset
              </label>
              <Controller
                control={control}
                name="fromDataset"
                render={({ field }) => (
                  <SearchableSelect
                    id="from-dataset"
                    options={datasetOptions}
                    value={field.value || null}
                    onChange={(next) => {
                      field.onChange(next);
                      setValue("fromKeyColumns", [], { shouldValidate: true, shouldDirty: true });
                    }}
                    placeholder="Choose a dataset"
                    searchPlaceholder="Search datasets"
                    className="mt-1.5"
                    disabled={isPending}
                    aria-invalid={!!errors.fromDataset}
                  />
                )}
              />
              <FieldError message={errors.fromDataset?.message} />
              {fromDataset && <div className="mt-1.5"><DatasetNotes dataset={fromDataset} /></div>}
            </div>
            <div>
              <label htmlFor="from-key-columns" className="text-[11px] text-ink-3">
                Key columns, in order
              </label>
              <div className="mt-1.5">
                <Controller
                  control={control}
                  name="fromKeyColumns"
                  render={({ field }) => (
                    <KeyColumnsPicker
                      id="from-key-columns"
                      dataset={fromDataset}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      disabled={isPending}
                      invalid={!!errors.fromKeyColumns}
                    />
                  )}
                />
              </div>
              <FieldError message={errors.fromKeyColumns?.message} />
            </div>
          </div>

          <div className="min-w-0 space-y-3 rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[10.5px] font-semibold tracking-wide text-ink-3 uppercase">To</p>
            <div>
              <label htmlFor="to-dataset" className="text-[11px] text-ink-3">
                Dataset
              </label>
              <Controller
                control={control}
                name="toDataset"
                render={({ field }) => (
                  <SearchableSelect
                    id="to-dataset"
                    options={datasetOptions}
                    value={field.value || null}
                    onChange={(next) => {
                      field.onChange(next);
                      setValue("toKeyColumns", [], { shouldValidate: true, shouldDirty: true });
                    }}
                    placeholder="Choose a dataset"
                    searchPlaceholder="Search datasets"
                    className="mt-1.5"
                    disabled={isPending}
                    aria-invalid={!!errors.toDataset}
                  />
                )}
              />
              <FieldError message={errors.toDataset?.message} />
              {toDataset && <div className="mt-1.5"><DatasetNotes dataset={toDataset} /></div>}
            </div>
            <div>
              <label htmlFor="to-key-columns" className="text-[11px] text-ink-3">
                Key columns, in order
              </label>
              <div className="mt-1.5">
                <Controller
                  control={control}
                  name="toKeyColumns"
                  render={({ field }) => (
                    <KeyColumnsPicker
                      id="to-key-columns"
                      dataset={toDataset}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      disabled={isPending}
                      invalid={!!errors.toKeyColumns}
                    />
                  )}
                />
              </div>
              <FieldError message={errors.toKeyColumns?.message} />
            </div>
          </div>
        </div>

        {typeMismatches.length > 0 && (
          <p className="text-[10.5px] text-amber">
            These key columns have different types: {typeMismatches.join("; ")}. Matching keys must be
            the same type, so the backend is likely to reject this.
          </p>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <SectionHeading title="Meaning" />
          <div className="mt-2 flex flex-wrap gap-2">
            {RELATIONSHIP_MEANINGS.map((option) => (
              <OptionButton
                key={option}
                pressed={meaning === option}
                disabled={isPending}
                onClick={() => {
                  setValue("meaning", option, { shouldValidate: true, shouldDirty: true });
                  if (option === "Identity" && cardinality && !IDENTITY_CARDINALITIES.includes(cardinality)) {
                    setValue("cardinality", undefined as never, { shouldValidate: true, shouldDirty: true });
                  }
                }}
              >
                {option}
              </OptionButton>
            ))}
          </div>
          <p className="mt-1.5 text-[10.5px] text-ink-3">
            {meaning ? MEANING_HINT[meaning] : "Reference or Identity. Identity needs a real identifier on both sides, not names or contact details."}
          </p>
          <FieldError message={errors.meaning?.message} />
        </div>

        <div>
          <SectionHeading title="How many rows on each side" hint="Read from the first dataset to the second. A foreign key usually means many to one." />
          <div className="mt-2 flex flex-wrap gap-2">
            {RELATIONSHIP_CARDINALITIES.map((option) => (
              <OptionButton
                key={option}
                pressed={cardinality === option}
                disabled={isPending || (meaning === "Identity" && !IDENTITY_CARDINALITIES.includes(option))}
                onClick={() => setValue("cardinality", option, { shouldValidate: true, shouldDirty: true })}
              >
                {CARDINALITY_LABEL[option]}
              </OptionButton>
            ))}
          </div>
          <FieldError message={errors.cardinality?.message} />
        </div>
      </section>

      <section className="space-y-2.5">
        <SectionHeading
          title="Evidence"
          hint="What tells you these match? A foreign key, a data dictionary, or someone who checked. Add up to 20."
        />
        <Controller
          control={control}
          name="evidence"
          render={({ field }) => (
            <div className="space-y-2">
              {evidence.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    aria-label={`Evidence ${index + 1}`}
                    placeholder="e.g. reviewed: invoice account identifier matches the commercial account identifier"
                    value={item}
                    disabled={isPending}
                    onChange={(e) => {
                      const next = [...evidence];
                      next[index] = e.currentTarget.value;
                      field.onChange(next);
                    }}
                  />
                  <button
                    type="button"
                    disabled={isPending || evidence.length === 1}
                    onClick={() => field.onChange(evidence.filter((_, i) => i !== index))}
                    aria-label={`Remove evidence ${index + 1}`}
                    className="shrink-0 rounded-md p-1.5 text-ink-3 hover:bg-paper-2 hover:text-ink disabled:opacity-30"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || evidence.length >= MAX_EVIDENCE}
                onClick={() => field.onChange([...evidence, ""])}
              >
                <Plus className="size-3.5" />
                Add evidence
              </Button>
            </div>
          )}
        />
        <FieldError message={errors.evidence?.message ?? errors.evidence?.root?.message} />
      </section>

      {changedUnderneath && onReload && (
        <div className="rounded-card border border-rose-border bg-rose-bg p-4">
          <h3 className="text-[12px] font-semibold text-ink">This relationship changed since you opened it</h3>
          <p className="mt-1 text-[10.5px] text-ink-2">
            Someone else saved it, or its sources changed. Reload to pick up the latest revision. Your
            edits stay in the form, so check them and save again.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onReload}>
            Reload the latest revision
          </Button>
        </div>
      )}

      {serverIssues.length > 0 && (
        <div className="rounded-card border border-rose-border bg-rose-bg p-4">
          <h3 className="text-[12px] font-semibold text-ink">The backend did not accept this declaration</h3>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
            {serverIssues.map((issue, index) => (
              <li key={`${issue.field}-${index}`}>
                {issue.field ? <span className="font-mono">{issue.field}</span> : null}
                {issue.field ? ": " : ""}
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={!isValid || isPending || (!!mapping && !isDirty)}>
          {isPending ? "Saving..." : mapping ? "Save changes" : "Save draft"}
        </Button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="text-[12px] font-semibold text-ink-3 hover:text-ink"
        >
          Cancel
        </button>
        {!isPending && (!isValid || (mapping && !isDirty)) && (
          <p className="text-[10.5px] text-ink-4">
            {!isValid ? "Fill in every required field to save." : "Change something to save."}
          </p>
        )}
      </div>
    </form>
  );
}
