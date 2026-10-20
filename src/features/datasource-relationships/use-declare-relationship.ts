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
import useCreateRelationship from "./use-create-relationship";

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
}

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
  const create = useCreateRelationship({ onSuccess: options?.onSuccess });

  const form = useForm<DeclareRelationshipValues>({
    resolver: zodResolver(declareRelationshipSchema),
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = (values: DeclareRelationshipValues) => {
    const from = datasets.find((d) => datasetKey(d.dataset) === values.fromDataset);
    const to = datasets.find((d) => datasetKey(d.dataset) === values.toDataset);
    if (!from || !to) return;

    create.createRelationship({
      definition: {
        name: values.name.trim(),
        meaning: values.meaning,
        from: toEndpoint(from, values.fromKeyColumns),
        to: toEndpoint(to, values.toKeyColumns),
        cardinality: values.cardinality,
        evidence: values.evidence.map((item) => item.trim()),
      },
    });
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
    isPending: create.isPending,
    error: create.error,
  };
};

export default useDeclareRelationship;
