import { ActorAvatar, actorColorClass, actorName } from "@/pages/everyday/rooms/actor";
import type { Actor } from "@/pages/everyday/rooms/types";

/** Avatar + name for a table's "Who" column — solid for a person, dashed for an agent, per the app's material person/agent distinction. */
export function WhoCell({ actor, label }: { actor: Actor | null; label?: string }) {
  if (!actor) {
    return <span className="text-[11px] text-ink-4">{label}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <ActorAvatar actor={actor} size="sm" />
      <span className={`text-[11px] font-medium whitespace-nowrap ${actorColorClass(actor)}`}>{actorName(actor)}</span>
    </div>
  );
}
