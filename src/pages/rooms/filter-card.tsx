import * as React from "react";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { ROOM_STATES, ROOM_STATE_LABEL } from "@/pages/rooms/labels";
import { isDefaultFilters, type RoomsFilters } from "@/pages/rooms/use-rooms-filters";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  currencies: FilterOption[];
  stages: FilterOption[];
  conditions: FilterOption[];
  owners: FilterOption[];
}

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold text-ink-2";
const CONTROL =
  "h-9 w-full rounded-control border border-line bg-paper px-3 text-[12px] text-ink outline-none focus:border-ultra disabled:cursor-not-allowed disabled:bg-paper-2 disabled:text-ink-4";

/** SearchableSelect has no empty value, so "Any" is a real item that maps back to "" (no filter). */
const ANY = "__any__";

/** The app's own dropdown, never a native <select>: its menu is the browser's, not ours. */
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  anyLabel,
  loading,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  /** Omit when the filter always has a value (State). */
  anyLabel?: string;
  loading: boolean;
}) {
  const items = anyLabel ? [{ value: ANY, label: anyLabel }, ...options] : options;
  return (
    <div className="block">
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      {loading ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <SearchableSelect
          id={id}
          options={items}
          value={value || (anyLabel ? ANY : null)}
          onChange={(next) => onChange(next === ANY ? "" : next)}
          searchPlaceholder={`Search ${label.toLowerCase()}...`}
          className="rounded-control bg-paper text-[12px]"
        />
      )}
    </div>
  );
}

/** Search is debounced into the URL, and re-synced when the URL changes under it (Clear, a saved view). */
function SearchField({ value, onCommit }: { value: string; onCommit: (value: string) => void }) {
  const [text, setText] = React.useState(value);

  React.useEffect(() => {
    setText(value);
  }, [value]);

  React.useEffect(() => {
    if (text === value) return;
    const timer = window.setTimeout(() => onCommit(text), 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <label className="block">
      <span className={FIELD_LABEL}>Search</span>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Title, condition, owner..."
        className={CONTROL}
      />
    </label>
  );
}

export function FilterCard({
  filters,
  options,
  optionsLoading,
  onChange,
  onClear,
  onSaveView,
}: {
  filters: RoomsFilters;
  options: FilterOptions;
  optionsLoading: boolean;
  onChange: (patch: Partial<RoomsFilters>) => void;
  onClear: () => void;
  onSaveView: () => void;
}) {
  const hasCurrency = Boolean(filters.currency);

  return (
    <div className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <SearchField value={filters.q} onCommit={(q) => onChange({ q })} />
        </div>

        <SelectField
          id="rooms-filter-state"
          label="State"
          value={filters.state}
          onChange={(state) => onChange({ state: state as RoomsFilters["state"] })}
          options={ROOM_STATES.map((state) => ({ value: state, label: ROOM_STATE_LABEL[state] }))}
          loading={false}
        />

        <SelectField
          id="rooms-filter-currency"
          label="Currency"
          value={filters.currency}
          onChange={(currency) => onChange({ currency })}
          options={options.currencies}
          anyLabel="Any"
          loading={optionsLoading}
        />
        <SelectField
          id="rooms-filter-stage"
          label="Stage"
          value={filters.stage}
          onChange={(stage) => onChange({ stage })}
          options={options.stages}
          anyLabel="Any"
          loading={optionsLoading}
        />
        <SelectField
          id="rooms-filter-condition"
          label="Condition"
          value={filters.condition}
          onChange={(condition) => onChange({ condition })}
          options={options.conditions}
          anyLabel="Any"
          loading={optionsLoading}
        />
        <SelectField
          id="rooms-filter-owner"
          label="Owner"
          value={filters.owner}
          onChange={(owner) => onChange({ owner })}
          options={options.owners}
          anyLabel="Anyone"
          loading={optionsLoading}
        />

        <label className="block">
          <span className={FIELD_LABEL}>Min. at risk</span>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={filters.min}
            disabled={!hasCurrency}
            onChange={(e) => onChange({ min: e.currentTarget.value })}
            placeholder={hasCurrency ? "Amount" : "Pick a currency first"}
            className={CONTROL}
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-[12px] text-ink-2">
          <input
            type="checkbox"
            checked={filters.archived}
            onChange={(e) => onChange({ archived: e.currentTarget.checked })}
          />
          Include archived
        </label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClear} disabled={isDefaultFilters(filters)}>
            Clear
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onSaveView}>
            Save as view...
          </Button>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-ink-3">
        Minimum at risk compares within one currency only, so it unlocks once a currency is chosen.
      </p>
    </div>
  );
}
