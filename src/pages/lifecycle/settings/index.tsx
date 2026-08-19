import { OwnershipTable } from "@/pages/lifecycle/settings/ownership-table";
import { OWNERSHIP_ROWS } from "@/pages/lifecycle/data";

/**
 * LC04 (stage ownership) — relocated off the lifecycle map itself, which no
 * longer carries a combined ownership table. See
 * flolyt-figma-designs/flolyt-lifecycle/LC04-stage-ownership.svg.
 */
const LifecycleSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Stage ownership</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every stage's owning team, owner, lead agent, review cadence and current trend
        </p>
      </div>

      <OwnershipTable rows={OWNERSHIP_ROWS} />
    </div>
  );
};

export default LifecycleSettings;
