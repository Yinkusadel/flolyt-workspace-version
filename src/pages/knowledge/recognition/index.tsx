import { useSearchParams } from "react-router-dom";

import { RECOGNITION_STATE } from "@/pages/knowledge/recognition/data";
import { NotRecognisedState } from "@/pages/knowledge/recognition/states/not-recognised";
import { FirstRecognitionState } from "@/pages/knowledge/recognition/states/first-recognition";
import { RecognisedState } from "@/pages/knowledge/recognition/states/recognised";
import { YoursLensState } from "@/pages/knowledge/recognition/states/yours-lens";

/**
 * RC01/02/03/11 — all share /recognition, branching on the `as` query param
 * first (`?as=me` is RC11's own literal footer route, a viewing-as lens
 * rather than a sibling path), then on RECOGNITION_STATE (nothing/first/
 * full). RC01/RC02 are wired but unreachable with the default "full" state,
 * same "not wired, no demo state currently triggers it" situation as every
 * prior rebuild's empty/edge states.
 */
const Recognition = () => {
  const [searchParams] = useSearchParams();
  const asMe = searchParams.get("as") === "me";

  if (asMe) return <YoursLensState />;

  if (RECOGNITION_STATE === "nothing") return <NotRecognisedState />;
  if (RECOGNITION_STATE === "first") return <FirstRecognitionState />;
  return <RecognisedState />;
};

export default Recognition;
