import { lifecycleClassOptionLabel, type LeakageV2FilterState } from "@/pages/leakage-map/v2-filters";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";

const SELECT_CLASS = "rounded-control border border-line bg-paper px-2 py-1 text-[10.5px] text-ink-2 outline-none";

/** A plain option list where "no filter" is spelled as the empty string in the <select>, mapped
 * back to `null` in the filter state — native <select> has no first-class null value. */
function NullableSelect({
  value,
  onChange,
  allLabel,
  options,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.currentTarget.value || null)}
      className={SELECT_CLASS}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/**
 * V2's filter controls — no Figma design exists for this page (the handoff doc is a backend
 * contract, not a visual spec), so this is deliberately plain, matching Step 2's cell grid. Every
 * option list is the response's own `controls.*` — never invented, per
 * [[feedback_retire_mock_options_not_extend]]. See docs/leakage-map/v2-build-plan.md Step 3.
 */
export function V2ControlsBar({
  controls,
  filters,
  onFiltersChange,
}: {
  controls: LeakageV2Controls;
  filters: LeakageV2FilterState;
  onFiltersChange: (patch: Partial<LeakageV2FilterState>) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.mode}
        onChange={(e) => onFiltersChange({ mode: e.currentTarget.value })}
        className={SELECT_CLASS}
      >
        {controls.modes.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={filters.horizon}
        onChange={(e) => onFiltersChange({ horizon: e.currentTarget.value })}
        className={SELECT_CLASS}
      >
        {controls.horizons.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {filters.horizon === "custom" && (
        <input
          type="number"
          min={1}
          max={365}
          value={filters.horizonDays}
          onChange={(e) => onFiltersChange({ horizonDays: Number(e.currentTarget.value) || 1 })}
          className={`${SELECT_CLASS} w-16`}
          aria-label="Custom horizon, in days"
        />
      )}

      {controls.markets.length > 0 && (
        <NullableSelect
          value={filters.market}
          onChange={(market) => onFiltersChange({ market })}
          allLabel="All markets"
          options={controls.markets.map((m) => ({ value: m, label: m }))}
        />
      )}

      {controls.sectors.length > 0 && (
        <NullableSelect
          value={filters.sector}
          onChange={(sector) => onFiltersChange({ sector })}
          allLabel="All sectors"
          options={controls.sectors.map((s) => ({ value: s, label: s }))}
        />
      )}

      {/* Severity/confidence labels render the API's own raw value — unlike V1's "≥ S2" floor
          copy, it's unconfirmed live whether V2's `severity`/`confidence` params are a floor or an
          exact match, so no threshold wording is invented here. */}
      <NullableSelect
        value={filters.severity}
        onChange={(severity) => onFiltersChange({ severity })}
        allLabel="All severities"
        options={controls.severities.map((s) => ({ value: s, label: s.toUpperCase() }))}
      />

      <NullableSelect
        value={filters.confidence}
        onChange={(confidence) => onFiltersChange({ confidence })}
        allLabel="All confidence levels"
        options={controls.confidenceLevels.map((c) => ({ value: c, label: c }))}
      />

      <NullableSelect
        value={filters.lifecycleClass}
        onChange={(lifecycleClass) => onFiltersChange({ lifecycleClass })}
        allLabel="All lifecycle classes"
        options={controls.lifecycleClasses.map((l) => ({ value: l, label: lifecycleClassOptionLabel(l) }))}
      />
    </div>
  );
}
