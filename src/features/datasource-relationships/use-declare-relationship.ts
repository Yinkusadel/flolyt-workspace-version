import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  declareRelationshipSchema,
  type DeclareRelationshipValues,
} from "@/validators/datasource-relationships";
import type {
  RelationshipCatalogDataset,
  RelationshipDatasetScope,
  RelationshipEndpoint,
  RelationshipMapping,
  RelationshipSuggestion,
} from "@/services/api/datasource-relationships/types";
import { toast } from "sonner";
import useCreateRelationship from "./use-create-relationship";
import useUpdateRelationship from "./use-update-relationship";

/** The form holds a dataset as this key, never as a bare UUID. */
export const datasetKey = (scope: Pick<RelationshipDatasetScope, "datasourceId" | "datasetId">) =>
  `${scope.datasourceId}::${scope.datasetId}`;

const EMPTY_VALUES: Partial<DeclareRelationshipValues> = {
  name: "",
  fromDataset: "",
  fromKeyColumns: [],
  toDataset: "",
  toKeyColumns: [],
  evidence: [""],
};

interface UseDeclareRelationshipOptions {
  onSuccess?: (mapping: RelationshipMapping) => void;
  // When set the form edits this relationship (PUT with its revision) instead of declaring a new one.
  editing?: RelationshipMapping;
}

// The form's starting values for an existing relationship. Crosswalk is not part of the form.
export const valuesFromMapping = (mapping: RelationshipMapping): Partial<DeclareRelationshipValues> => {
  const { definition } = mapping;
  return {
    name: definition.name,
    meaning: definition.meaning,
    cardinality: definition.cardinality,
    fromDataset: datasetKey(definition.from.dataset),
    fromKeyColumns: definition.from.keyColumns,
    toDataset: datasetKey(definition.to.dataset),
    toKeyColumns: definition.to.keyColumns,
    evidence: definition.evidence,
  };
};

// A declaration sends only datasourceId, datasetId, subjectType and grain per dataset: the
// catalog's `companyId` is server-assigned and must not be sent.
const toEndpoint = (
  dataset: RelationshipCatalogDataset,
  keyColumns: string[]
): RelationshipEndpoint => ({
  dataset: {
    datasourceId: dataset.dataset.datasourceId,
    datasetId: dataset.dataset.datasetId,
    subjectType: dataset.dataset.subjectType,
    grain: dataset.dataset.grain,
  },
  keyColumns,
});

const useDeclareRelationship = (
  datasets: RelationshipCatalogDataset[],
  options?: UseDeclareRelationshipOptions
) => {
  const editing = options?.editing;
  const create = useCreateRelationship({ onSuccess: options?.onSuccess });
  const update = useUpdateRelationship({ onSuccess: options?.onSuccess });

  const form = useForm<DeclareRelationshipValues>({
    resolver: zodResolver(declareRelationshipSchema),
    mode: "onChange",
    defaultValues: editing ? valuesFromMapping(editing) : EMPTY_VALUES,
  });

  const onSubmit = (values: DeclareRelationshipValues) => {
    const from = datasets.find((d) => datasetKey(d.dataset) === values.fromDataset);
    const to = datasets.find((d) => datasetKey(d.dataset) === values.toDataset);
    if (!from || !to) {
      toast.error("One of these datasets is no longer in your catalog. Choose it again.");
      return;
    }

    const definition = {
      name: values.name.trim(),
      meaning: values.meaning,
      from: toEndpoint(from, values.fromKeyColumns),
      to: toEndpoint(to, values.toKeyColumns),
      cardinality: values.cardinality,
      evidence: values.evidence.map((item) => item.trim()),
    };

    if (editing) {
      // Sends the whole write body plus the revision the editor was opened at.
      update.updateRelationship({
        id: editing.id,
        payload: { expectedRevision: editing.revision, definition },
      });
      return;
    }

    create.createRelationship({ definition });
  };

  // Suggestions prefill the form, they are never approvals. A foreign key is a reference, so that
  // is prefilled. Cardinality is left for the person to choose.
  const applySuggestion = (suggestion: RelationshipSuggestion) => {
    form.reset(
      {
        name: `${suggestion.from.datasetId} to ${suggestion.to.datasetId}`,
        meaning: "Reference",
        fromDataset: datasetKey(suggestion.from),
        fromKeyColumns: suggestion.fromColumns,
        toDataset: datasetKey(suggestion.to),
        toKeyColumns: suggestion.toColumns,
        evidence: [suggestion.evidence],
      },
      { keepDefaultValues: true }
    );
    void form.trigger();
  };

  return {
    form,
    onSubmit,
    applySuggestion,
    isPending: create.isPending || update.isPending,
    error: editing ? update.error : create.error,
  };
};

export default useDeclareRelationship;
