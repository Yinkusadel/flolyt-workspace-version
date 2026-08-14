import { PersonAvatar, type PersonAvatarProps } from "@/components/person-avatar";
import { DEPARTMENT_COLORS } from "@/pages/lifecycle/data";
import type { Actor, AgentRef, PersonRef } from "@/pages/rooms/types";

/** Human avatars use the department palette (via `style`), never the rotating team-1..4 slots. */
export function ActorAvatar({
  actor,
  size = "default",
}: {
  actor: Actor;
  size?: PersonAvatarProps["size"];
}) {
  if (actor.kind === "agent") {
    return <PersonAvatar kind="agent" initials={actor.agent.initials} size={size} />;
  }
  return (
    <PersonAvatar
      kind="human"
      initials={actor.person.initials}
      size={size}
      style={{ backgroundColor: DEPARTMENT_COLORS[actor.person.department] }}
    />
  );
}

export function PersonDot({ person, size = "default" }: { person: PersonRef; size?: PersonAvatarProps["size"] }) {
  return (
    <PersonAvatar
      kind="human"
      initials={person.initials}
      size={size}
      style={{ backgroundColor: DEPARTMENT_COLORS[person.department] }}
    />
  );
}

export function AgentDot({ agent, size = "default" }: { agent: AgentRef; size?: PersonAvatarProps["size"] }) {
  return <PersonAvatar kind="agent" initials={agent.initials} size={size} />;
}

export function actorName(actor: Actor): string {
  return actor.kind === "agent" ? actor.agent.name : actor.person.name;
}

export function actorRole(actor: Actor, roleLabel?: string): string | undefined {
  if (actor.kind === "agent") return undefined;
  return roleLabel ?? actor.person.roleLabel ?? actor.person.department;
}
