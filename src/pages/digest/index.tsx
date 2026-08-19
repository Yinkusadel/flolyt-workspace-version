import { useSearchParams } from "react-router-dom";

import { DIGEST_DEGRADED, QUIET_DAY_ACTIVE, WORKSPACE_AGE_DAYS } from "@/pages/digest/data";
import { DegradedState } from "@/pages/digest/states/degraded-state";
import { ExecState } from "@/pages/digest/states/exec-state";
import { FirstDigestState } from "@/pages/digest/states/first-digest-state";
import { QuietDayState } from "@/pages/digest/states/quiet-day-state";
import { TeamState } from "@/pages/digest/states/team-state";
import { TodayState } from "@/pages/digest/states/today-state";

/** D01–D03, D07, D08, D15 — all share the /digest route, branching on query params and mock data shape. */
const Digest = () => {
  const [searchParams] = useSearchParams();
  const team = searchParams.get("team");
  const scope = searchParams.get("scope");

  if (team) return <TeamState team={team} />;
  if (scope === "org") return <ExecState />;
  if (DIGEST_DEGRADED) return <DegradedState />;
  if (QUIET_DAY_ACTIVE) return <QuietDayState />;
  if (WORKSPACE_AGE_DAYS <= 1) return <FirstDigestState />;
  return <TodayState />;
};

export default Digest;
