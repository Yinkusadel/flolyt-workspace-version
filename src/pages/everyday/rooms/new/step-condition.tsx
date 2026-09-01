import * as React from "react";

import { useGetLeakageMap } from "@/features/lifecycle/use-get-leakage-map";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";

/** "lifecycle_stage" -> "Lifecycle stage" — the grid key has no separate label in the response. */
function formatGridLabel(grid: string): string {
  const words = grid.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export interface ConditionStepValue {
  title: string;
  conditionKey: string | null;
}

interface StepConditionProps {
  value: ConditionStepValue;
  onChange: (value: ConditionStepValue) => void;
}

/** R06 — New room · the condition. */
export function StepCondition({ value, onChange }: StepConditionProps) {
  const { title, conditionKey } = value;
  const { data, isPending, isError, error } = useGetLeakageMap();

  // TEMP DEBUG — remove once the new-room wizard's fields are all wired and reviewed.
  React.useEffect(() => {
    console.log("[new-room] condition step:", value);
  }, [value]);

  const conditionOptions = React.useMemo(() => {
    const grids = data?.data.grids ?? [];
    const seen = new Set<string>();
    const options: { value: string; label: string; group: string }[] = [];
    for (const grid of grids) {
      const group = formatGridLabel(grid.grid);
      for (const condition of grid.conditions) {
        if (seen.has(condition.key)) continue;
        seen.add(condition.key);
        options.push({ value: condition.key, label: condition.label, group });
      }
    }
    return options;
  }, [data]);

  const noRevenueModel = !isPending && !isError && data?.data.revenueModel === null;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What condition are these customers in?
        </p>
        {isPending && <SearchableSelectSkeleton className="mt-2" />}
        {isError && (
          <p className="mt-2 rounded-control border border-rose-border bg-rose-bg px-3.5 py-2.5 text-[11.5px] text-rose">
            {error?.message ?? "Couldn't load the condition vocabulary."}
          </p>
        )}
        {noRevenueModel && (
          <p className="mt-2 rounded-control border border-amber-border bg-amber-bg px-3.5 py-2.5 text-[11.5px] text-ink-2">
            No revenue model is selected for this workspace yet — pick one on the leakage map before opening a room.
          </p>
        )}
        {!isPending && !isError && !noRevenueModel && (
          <SearchableSelect
            className="mt-2"
            options={conditionOptions}
            value={conditionKey}
            onChange={(next) => onChange({ ...value, conditionKey: next })}
            placeholder="Select a condition..."
            searchPlaceholder="Search conditions..."
          />
        )}
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Name it, in your own words</p>
        <div className="mt-2 flex items-center rounded-control border-2 border-ultra-border bg-paper px-3.5 py-2.5">
          <input
            value={title}
            onChange={(e) => onChange({ ...value, title: e.currentTarget.value })}
            placeholder="Second order never happened"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:text-ink-4 placeholder:font-normal"
          />
          <span className="shrink-0 text-[10.5px] text-ink-4">A state, not a task</span>
        </div>
      </div>

      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Name the condition, not the project</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            "Second order never happened" is a state a group of customers is in. "Q3 reactivation push" is something
            a team is doing. The first can be measured, closed and disproven; the second can only be finished. Rooms
            named after projects are the ones that go stale.
          </p>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Duplicate detection runs before you have finished typing</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            At scale, two people finding the same cause from two directions is routine. This is checked at the
            audience and once more before the room opens — the earlier you find out, the cheaper it is to join
            instead.
          </p>
        </div>
      </div>
    </div>
  );
}
