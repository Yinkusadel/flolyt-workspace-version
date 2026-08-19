import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import { getGoal } from "@/pages/everyday/goals/goal/data";
import type { GoalDetail } from "@/pages/everyday/goals/types";

export type GoalOutletContext = { goal: GoalDetail };

/** Resolves `:goalId` to a `GoalDetail` and provides it via context — mirrors rooms' `RoomLayout`. */
const GoalLayout = () => {
  const { goalId } = useParams();
  const goal = goalId ? getGoal(goalId) : undefined;

  if (!goal) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Goal not found</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">It may have been closed or the link is out of date.</p>
        <Link to="/goals" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to Goals
        </Link>
      </div>
    );
  }

  return <Outlet context={{ goal } satisfies GoalOutletContext} />;
};

export default GoalLayout;

export function useGoalContext() {
  return useOutletContext<GoalOutletContext>();
}
