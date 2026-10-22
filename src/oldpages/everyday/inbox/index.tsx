import { useSearchParams } from "react-router-dom";

import { INBOX_EMPTY } from "@/oldpages/everyday/inbox/data";
import { EmptyState } from "@/oldpages/everyday/inbox/states/empty-state";
import { GroupedTriageState } from "@/oldpages/everyday/inbox/states/grouped-triage-state";
import { NormalState } from "@/oldpages/everyday/inbox/states/normal-state";

/** I01–I03 — all share the /inbox route, branching on data shape and the ?group= query param. */
const Inbox = () => {
  const [searchParams] = useSearchParams();
  const group = searchParams.get("group");

  if (group) return <GroupedTriageState activeGroup={group} />;
  if (INBOX_EMPTY) return <EmptyState />;
  return <NormalState />;
};

export default Inbox;
