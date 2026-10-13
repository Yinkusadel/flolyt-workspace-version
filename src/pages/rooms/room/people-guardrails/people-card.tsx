import * as React from "react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { initialsFromName } from "@/lib/initials";
import useRemoveRoomPerson from "@/features/rooms/use-remove-room-person";
import useUpdateRoomOwner from "@/features/rooms/use-update-room-owner";
import useUpdateRoomPerson from "@/features/rooms/use-update-room-person";
import { formatDay, humanize } from "@/pages/rooms/convening/format";
import { AddToRoomDialog } from "@/pages/rooms/room/thread/add-to-room-dialog";
import type { RoomPersonDto } from "@/services/api/rooms/get-room-people";

const HEAD = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Roles a person can be given here (the backend's list; `decision-owner` is the owner's seat, changed by handing ownership over). */
const PERSON_ROLES = [
  { value: "participant", label: "Participant" },
  { value: "approver", label: "Approver" },
  { value: "observer", label: "Observer" },
];

/**
 * The approval limit cell: a whole number (the largest play a person may approve; unit undocumented, the design hints "people
 * reached"), saved with the role through `PUT /rooms/{roomId}/people/{userId}` when the field loses focus or Enter is pressed.
 * Empty means no number (null). What null means for an approver is not documented, so it is not translated into words here.
 */
function ReachCell({ person, editable, onSave, isSaving }: { person: RoomPersonDto; editable: boolean; onSave: (value: number | null) => void; isSaving: boolean }) {
  const current = person.maxApprovalReach === null ? "" : String(person.maxApprovalReach);
  const [value, setValue] = React.useState(current);
  React.useEffect(() => setValue(current), [current]);

  const trimmed = value.trim();
  const parsed = trimmed === "" ? null : Number(trimmed);
  const invalid = parsed !== null && (!Number.isInteger(parsed) || parsed < 0 || parsed > 2147483647);

  const commit = () => {
    if (invalid) return setValue(current);
    if (trimmed === current) return;
    onSave(parsed);
  };

  if (!editable) {
    return <span className="font-mono text-[12.5px] text-ink">{person.maxApprovalReach === null ? "—" : person.maxApprovalReach.toLocaleString("en-US")}</span>;
  }
  return (
    <input
      inputMode="numeric"
      value={value}
      disabled={isSaving}
      aria-label="Largest play this person can approve"
      aria-invalid={invalid}
      placeholder="—"
      onChange={(event) => setValue(event.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
      className="h-8 w-28 rounded-control border border-line bg-paper px-2 text-right font-mono text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ultra aria-[invalid=true]:border-rose disabled:opacity-60"
    />
  );
}

/**
 * Who is in the Room (Room · People & guardrails.png, People), from `GET /rooms/{roomId}/people`: role, approval limit, how and when
 * they were added, and Remove; the owner cannot be removed (reassign first). A person whose name can't be resolved stays in the table as
 * "Name not available", so they can still be managed. Not shown: the design's team after a role ("Approver · Pricing"), which no field carries.
 */
export function PeopleCard({
  roomId,
  ownerId,
  people,
  canEdit,
}: {
  roomId: string;
  ownerId: string | null;
  people: RoomPersonDto[];
  canEdit: boolean;
}) {
  const [removing, setRemoving] = React.useState<RoomPersonDto | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [handOpen, setHandOpen] = React.useState(false);
  const [newOwner, setNewOwner] = React.useState<string | null>(null);

  const { removeRoomPerson, isPending: isRemoving } = useRemoveRoomPerson({ onSuccess: () => setRemoving(null) });
  const { updateRoomPerson, isPending: isUpdating } = useUpdateRoomPerson();
  const { updateRoomOwner, isPending: isHanding } = useUpdateRoomOwner({
    onSuccess: () => {
      setHandOpen(false);
      setNewOwner(null);
    },
  });

  const nameFor = React.useMemo(() => new Map(people.map((person) => [person.userId, person.displayName] as const)), [people]);
  const ownerCandidates = people
    .filter((person) => person.displayName && person.userId !== ownerId)
    .map((person) => ({ value: person.userId, label: person.displayName as string }));

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-semibold text-ink">
          People <span className="ml-1 font-normal text-ink-3">{people.length}</span>
        </h3>
        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setAddOpen(true)}>
              Add someone
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setHandOpen(true)}>
              Hand ownership to…
            </Button>
          </div>
        )}
      </header>

      {people.length === 0 ? (
        <p className="px-5 py-6 text-[12.5px] text-ink-3">No one is listed on this Room yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="bg-paper-2/60">
              <tr>
                <th className={HEAD}>Person</th>
                <th className={HEAD}>Here for</th>
                <th className={cn(HEAD, "text-right")}>Can approve plays up to</th>
                <th className={HEAD}>Added</th>
                <th className={HEAD}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => {
                const isOwner = person.userId === ownerId;
                const name = person.displayName;
                const roleOptions = PERSON_ROLES.some((role) => role.value === person.role)
                  ? PERSON_ROLES
                  : [{ value: person.role, label: humanize(person.role) }, ...PERSON_ROLES];
                const how = person.source ? humanize(person.source) : person.addedBy && person.addedBy !== person.userId && nameFor.get(person.addedBy) ? `Added by ${nameFor.get(person.addedBy)}` : "Added";
                return (
                  <tr key={person.userId} className="border-t border-line align-middle text-[12.5px]">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <PersonAvatar kind="human" size="lg" team={((index % 4) + 1) as 1 | 2 | 3 | 4} initials={name ? initialsFromName(name) : "?"} />
                        <span className={cn("font-semibold", name ? "text-ink" : "text-ink-3 italic")}>{name ?? "Name not available"}</span>
                        {isOwner && <span className="rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold text-paper">Owner</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isOwner || !canEdit ? (
                        <span className="text-ink">{humanize(person.role)}</span>
                      ) : (
                        <div className="w-44">
                          <SearchableSelect
                            options={roleOptions}
                            value={person.role}
                            disabled={isUpdating}
                            onChange={(role) =>
                              role !== person.role && updateRoomPerson({ roomId, userId: person.userId, role, maxApprovalReach: person.maxApprovalReach })
                            }
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ReachCell
                        person={person}
                        editable={canEdit && !isOwner}
                        isSaving={isUpdating}
                        onSave={(value) => updateRoomPerson({ roomId, userId: person.userId, role: person.role, maxApprovalReach: value })}
                      />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-3">
                      {how} · {formatDay(person.addedAtUtc)}
                    </td>
                    <td className="px-4 py-3">
                      {isOwner ? (
                        <span className="text-[11.5px] text-ink-3">Reassign before removing</span>
                      ) : canEdit ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => setRemoving(person)}>
                          Remove
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={`Remove ${removing?.displayName ?? "this person"} from this Room?`}
        description="They will no longer be listed on this Room."
        confirmLabel="Remove"
        pendingLabel="Removing"
        isPending={isRemoving}
        onConfirm={() => removing && removeRoomPerson({ roomId, userId: removing.userId })}
      />

      <Dialog open={handOpen} onOpenChange={(open) => !isHanding && setHandOpen(open)}>
        <DialogContent className="max-w-md" onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Hand ownership to…</DialogTitle>
            <DialogDescription>Ownership exists so a leak can't sit open with everyone assuming someone else has it.</DialogDescription>
          </DialogHeader>
          <DialogBody className="flex-none space-y-2 px-5 py-4 sm:px-7">
            <label className="block text-[11px] font-semibold text-ink-2">New owner</label>
            <SearchableSelect
              options={ownerCandidates}
              value={newOwner}
              onChange={setNewOwner}
              placeholder="Choose someone in this Room"
              searchPlaceholder="Search people"
              emptyText="No one else in this Room has a name to choose"
              disabled={isHanding}
            />
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isHanding} onClick={() => setHandOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={!newOwner || isHanding} onClick={() => newOwner && updateRoomOwner({ roomId, ownerMemberId: newOwner })}>
              {isHanding ? "Handing over" : "Hand over"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddToRoomDialog roomId={roomId} open={addOpen} onOpenChange={setAddOpen} initialTab="people" />
    </section>
  );
}
