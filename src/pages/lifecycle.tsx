import { Button } from "@/components/ui/button";
import { OwnershipTable } from "@/pages/lifecycle/ownership-table";
import { RootCauseSpotlight } from "@/pages/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/lifecycle/stage-rail";
import { OWNERSHIP_ROWS, ROOT_CAUSE_ROWS, STAGES } from "@/pages/lifecycle/data";

/**
 * Screen 15 (lifecycle map) in flolyt-kit-122 — see
 * flolyt-kit-122/15-lifecycle-map.svg and docs/build-tracker.md.
 */
const Lifecycle = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">The customer lifecycle</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Ten stages, one revenue story · every stage has an owning team and a live number
          </p>
        </div>
        <Button type="button" className="shrink-0">
          Open a war room
        </Button>
      </div>

      <StageRail stages={STAGES} />
      <RootCauseSpotlight rows={ROOT_CAUSE_ROWS} />
      <OwnershipTable rows={OWNERSHIP_ROWS} />
    </div>
  );
};

export default Lifecycle;
