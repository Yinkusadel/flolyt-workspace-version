import { useSearchParams } from "react-router-dom";

import { HANDOFF_EMPTY } from "@/oldpages/everyday/handoff/data";
import { EmptyState } from "@/oldpages/everyday/handoff/states/empty-state";
import { IndexState } from "@/oldpages/everyday/handoff/states/index-state";
import { OwedByMeState } from "@/oldpages/everyday/handoff/states/owed-by-me-state";
import { OverdueState } from "@/oldpages/everyday/handoff/states/overdue-state";

/** H01–H03, H10 — all share the /handoff route, branching on query params first, then the HANDOFF_EMPTY mock flag. */
const Handoff = () => {
  const [searchParams] = useSearchParams();
  const owner = searchParams.get("owner");
  const state = searchParams.get("state");

  if (owner === "me") return <OwedByMeState />;
  if (state === "overdue") return <OverdueState />;
  if (HANDOFF_EMPTY) return <EmptyState />;
  return <IndexState />;
};

export default Handoff;
