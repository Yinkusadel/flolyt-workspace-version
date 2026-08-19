import { useSearchParams } from "react-router-dom";

import { INBOX_EMPTY } from "@/pages/inbox/data";
import { EmptyState } from "@/pages/inbox/states/empty-state";
import { GroupedTriageState } from "@/pages/inbox/states/grouped-triage-state";
import { NormalState } from "@/pages/inbox/states/normal-state";

/** I01–I03 — all share the /inbox route, branching on data shape and the ?group= query param. */
const Inbox = () => {
  const [searchParams] = useSearchParams();
  const group = searchParams.get("group");

  if (group) return <GroupedTriageState activeGroup={group} />;
  if (INBOX_EMPTY) return <EmptyState />;
  return <NormalState />;
};

export default Inbox;
