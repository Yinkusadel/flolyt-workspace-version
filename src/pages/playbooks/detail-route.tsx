import { Navigate, useParams } from "react-router-dom";

import { getPlaybook } from "@/pages/playbooks/data";
import { PlaybookStandard } from "@/pages/playbooks/detail-standard";
import { PlaybookDecayed } from "@/pages/playbooks/detail-decayed";

/** PB02/PB05 — /playbooks/:id. A playbook whose runs stopped moving anything gets its own
 * layout — an effect-by-run chart and three next-step choices instead of the trigger/steps/
 * parameters/run-history detail, since deciding what to do about the decay is the point. Same
 * status/no-status-fork precedent as business-memory's `entry-route.tsx`. */
export default function PlaybookDetailRoute() {
  const { id } = useParams();
  const playbook = getPlaybook(id);

  if (!playbook) return <Navigate to="/playbooks" replace />;
  if (playbook.decay) return <PlaybookDecayed playbook={playbook} />;
  return <PlaybookStandard playbook={playbook} />;
}
