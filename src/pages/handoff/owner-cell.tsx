import { ActorAvatar } from "@/pages/rooms/actor";
import { Chip } from "@/pages/lifecycle/stage/chip";
import type { PersonRef } from "@/pages/rooms/types";

/** Owner avatar + first name, or an "Unaccepted"/"No owner" chip when nobody has said yes yet — the shape every obligations table in this section uses for its owner column. */
export function OwnerCell({ owner, unacceptedLabel }: { owner?: PersonRef; unacceptedLabel?: string }) {
  if (!owner) {
    return <Chip tone="rose">{unacceptedLabel ?? "Unaccepted"}</Chip>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <ActorAvatar actor={{ kind: "human", person: owner }} size="sm" />
      <span className="text-ink-2">{owner.name.split(" ")[0]}</span>
    </div>
  );
}
