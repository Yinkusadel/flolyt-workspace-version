import { PLAYBOOKS_STATE } from "@/pages/knowledge/playbooks/data";
import { NoPlaybooksYetState } from "@/pages/knowledge/playbooks/states/no-playbooks-yet";
import { FirstPlaybookState } from "@/pages/knowledge/playbooks/states/first-playbook";
import { AllPlaybooksState } from "@/pages/knowledge/playbooks/states/all-playbooks";

/**
 * PB01/02/03 — all share /playbooks, branching on PLAYBOOKS_STATE
 * (empty/first/full). PB01/PB02 are wired but unreachable with the default
 * "full" state, same "not wired, no demo state currently triggers it"
 * situation as every prior rebuild's empty/edge states.
 */
const Playbooks = () => {
  if (PLAYBOOKS_STATE === "empty") return <NoPlaybooksYetState />;
  if (PLAYBOOKS_STATE === "first") return <FirstPlaybookState />;
  return <AllPlaybooksState />;
};

export default Playbooks;
