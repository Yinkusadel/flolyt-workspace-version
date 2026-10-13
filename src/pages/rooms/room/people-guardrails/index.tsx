import * as React from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import { GuardrailsSection } from "@/pages/rooms/room/people-guardrails/guardrails-section";
import { PeopleCard } from "@/pages/rooms/room/people-guardrails/people-card";
import { RestrictBox } from "@/pages/rooms/room/people-guardrails/restrict-box";
import type { RoomDetailDto } from "@/services/api/rooms/get-room";

/**
 * The People & guardrails tab (Room · People & guardrails.png): who is in the Room, what the Room may not do, and the Restrict box at the
 * bottom. People come from `GET /rooms/{roomId}/people`, guardrails from `GET /rooms/{roomId}/guardrails`. The notice at the top is the
 * documented rule (everyone listed reads everything; a role changes only who a play routes to and what they may approve).
 */
export const PeopleGuardrailsTab = ({ room, canEdit }: { room: RoomDetailDto; canEdit: boolean }) => {
  const people = useGetRoomPeople(room.id);
  const data = people.data?.data;
  const nameForUser = React.useCallback(
    (userId: string) => data?.people.find((person) => person.userId === userId)?.displayName ?? null,
    [data]
  );

  return (
    <div className="space-y-8">
      {data?.everyoneSeesEverything !== false && (
        <p className="flex items-start gap-3 rounded-card bg-ink px-5 py-3.5 text-[12.5px] leading-relaxed text-paper">
          <Eye className="mt-0.5 size-4 shrink-0" />
          <span>
            Everyone listed here sees every message, every finding and every customer in the cohort. A role changes who a play routes to and what they can approve. It never
            changes what they can see.
          </span>
        </p>
      )}

      {people.isPending ? (
        <Skeleton className="h-72 rounded-card" aria-busy="true" aria-label="Loading the people" />
      ) : people.isError || !data ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">{people.error?.message || "Couldn't load the people."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => people.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <PeopleCard roomId={room.id} ownerId={room.ownerMemberId} people={data.people} canEdit={canEdit} />
      )}

      <GuardrailsSection roomId={room.id} canEdit={canEdit} />

      <RestrictBox roomId={room.id} restricted={room.restricted} nameForUser={nameForUser} canEdit={canEdit} />
    </div>
  );
};
