import { useSearchParams } from "react-router-dom";

import { SEGMENTS_STATE } from "@/pages/customers/segments/data";
import { AllSegmentsState } from "@/pages/customers/segments/states/all-segments";
import { FirstSegmentState } from "@/pages/customers/segments/states/first-segment";
import { NoSegmentsYetState } from "@/pages/customers/segments/states/no-segments-yet";
import { SearchState } from "@/pages/customers/segments/states/search";

/**
 * SG01/02/03/08 — all share /segments, branching on the `q` query param
 * first, then on SEGMENTS_STATE. SG01/SG02 are wired but unreachable with
 * the default "full" state, same "not wired, no demo state currently
 * triggers it" situation as every prior rebuild's empty/edge states.
 */
const Segments = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  if (q !== null) return <SearchState query={q} />;

  if (SEGMENTS_STATE === "empty") return <NoSegmentsYetState />;
  if (SEGMENTS_STATE === "first") return <FirstSegmentState />;
  return <AllSegmentsState />;
};

export default Segments;
