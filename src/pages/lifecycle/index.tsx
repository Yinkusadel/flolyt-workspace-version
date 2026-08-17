import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { RootCauseSpotlight } from "@/pages/lifecycle/root-cause-spotlight";
import { StageRail } from "@/pages/lifecycle/stage-rail";
import { ROOT_CAUSE_ROWS, STAGES } from "@/pages/lifecycle/data";

/**
 * The lifecycle map (LC02, plus LC01's first-run empty state and LC05's
 * ?market= filter — those aren't wired in yet, see docs/build-tracker.md).
 * See flolyt-figma-designs/flolyt-lifecycle/LC02-lifecycle-map.svg.
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

      <p className="text-[11px] text-ink-4">
        Owner, lead agent and review cadence per stage now live on{" "}
        <Link to="/lifecycle/settings" className="font-semibold text-ultra hover:underline">
          stage ownership
        </Link>
        .
      </p>
    </div>
  );
};

export default Lifecycle;
