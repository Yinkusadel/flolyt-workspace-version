import { useSearchParams } from "react-router-dom";

import { MEMORY_STATE } from "@/pages/knowledge/business-memory/data";
import { NothingLearnedYetState } from "@/pages/knowledge/business-memory/states/nothing-learned-yet";
import { FirstLearningState } from "@/pages/knowledge/business-memory/states/first-learning";
import { LearningsState } from "@/pages/knowledge/business-memory/states/learnings";
import { SearchState } from "@/pages/knowledge/business-memory/states/search";

/**
 * ME01/02/03/08 — all share /business-memory, branching on the `q` query
 * param first, then on MEMORY_STATE (nothing/first/full). ME01/ME02 are
 * wired but unreachable with the default "full" state, same "not wired, no
 * demo state currently triggers it" situation as every prior rebuild's
 * empty/edge states.
 */
const BusinessMemory = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  if (q !== null) return <SearchState query={q} />;

  if (MEMORY_STATE === "nothing") return <NothingLearnedYetState />;
  if (MEMORY_STATE === "first") return <FirstLearningState />;
  return <LearningsState />;
};

export default BusinessMemory;
