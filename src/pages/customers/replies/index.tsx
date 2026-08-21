import { REPLIES_STATE } from "@/pages/customers/replies/data";
import { NobodyHasWrittenBackState } from "@/pages/customers/replies/states/nobody-has-written-back";
import { FirstReplyState } from "@/pages/customers/replies/states/first-reply";
import { NeedsAnAnswerState } from "@/pages/customers/replies/states/needs-an-answer";

/**
 * RP01/02/03 — all share /replies, branching on REPLIES_STATE
 * (nothing/first/full). RP01/RP02 are wired but unreachable with the
 * default "full" state, same "not wired, no demo state currently
 * triggers it" situation as every prior rebuild's empty/edge states.
 */
const Replies = () => {
  if (REPLIES_STATE === "nothing") return <NobodyHasWrittenBackState />;
  if (REPLIES_STATE === "first") return <FirstReplyState />;
  return <NeedsAnAnswerState />;
};

export default Replies;
