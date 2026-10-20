import { useMemo } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import { MAX_KEY_COLUMNS } from "@/validators/datasource-relationships";
import type { RelationshipCatalogDataset } from "@/services/api/datasource-relationships/types";

/**
 * Ordered key columns for one side of a relationship. The order is part of the declaration (a
 * composite key matches column by column), so it stays visible and can be changed. A dataset's
 * own composite or primary keys are offered as one group, never one component at a time.
 */
export function KeyColumnsPicker({
  dataset,
  value,
  onChange,
  disabled,
  invalid,
  id,
}: {
  dataset: RelationshipCatalogDataset | null;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  id: string;
}) {
  const options = useMemo<SearchableSelectOption[]>(() => {
    if (!dataset) return [];
    return dataset.columns
      .filter((column) => !value.includes(column.name))
      .map((column) => ({
        value: column.name,
        label: `${column.name} (${column.keyType})`,
        group: column.identityCandidate ? "Identity candidates" : "Other columns",
      }))
      .sort((a, b) => (a.group === b.group ? 0 : a.group === "Identity candidates" ? -1 : 1));
  }, [dataset, value]);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const typeOf = (name: string) => dataset?.columns.find((c) => c.name === name)?.keyType;

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ol className="space-y-1.5">
          {value.map((name, index) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-panel border border-ultra-border bg-ultra-bg py-1 pr-1 pl-2.5"
            >
              <span className="w-3 shrink-0 text-[10px] font-semibold text-ultra">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink">{name}</span>
              {typeOf(name) && <span className="shrink-0 text-[10px] text-ink-3">{typeOf(name)}</span>}
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
                aria-label={`Move ${name} earlier`}
                className="rounded-md p-1 text-ink-3 hover:bg-paper-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowUp className="size-3" />
              </button>
              <button
                type="button"
                disabled={disabled || index === value.length - 1}
                onClick={() => move(index, 1)}
                aria-label={`Move ${name} later`}
                className="rounded-md p-1 text-ink-3 hover:bg-paper-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowDown className="size-3" />
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(value.filter((n) => n !== name))}
                aria-label={`Remove ${name}`}
                className="rounded-md p-1 text-ink-3 hover:bg-paper-2 hover:text-ink"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ol>
      )}

      <SearchableSelect
        id={id}
        options={options}
        value={null}
        onChange={(name) => onChange([...value, name])}
        placeholder={
          !dataset
            ? "Choose a dataset first"
            : value.length >= MAX_KEY_COLUMNS
              ? "Key column limit reached"
              : value.length === 0
                ? "Add a key column"
                : "Add another key column"
        }
        searchPlaceholder="Search columns"
        emptyText="No more columns"
        disabled={disabled || !dataset || value.length >= MAX_KEY_COLUMNS}
        aria-invalid={invalid}
      />

      {dataset && dataset.identityKeys.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dataset.identityKeys.map((key) => (
            <button
              key={key.name}
              type="button"
              disabled={disabled}
              onClick={() => onChange(key.columns)}
              className="max-w-full truncate rounded-chip border border-line bg-paper px-2 py-0.5 text-[10px] text-ink-2 hover:border-ink-4 hover:text-ink"
            >
              Use {key.kind.toLowerCase()} key ({key.columns.join(", ")})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
