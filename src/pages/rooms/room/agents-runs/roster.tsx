import * as React from "react";

import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { ConfirmModal } from "@/components/confirm-modal";
import { agentInitialsFromName } from "@/lib/initials";
import useRemoveRoomAgent from "@/features/rooms/use-remove-room-agent";
import { humanize } from "@/pages/rooms/convening/format";

/** What the roster card draws for one agent: its state from `/runs`, what it will do and what it reads from `/people`. */
export interface RosterCardAgent {
  key: string;
  displayName: string;
  role: string;
  /** From `GET /rooms/{roomId}/runs`: `idle`, `running`, `awaiting-approval`, ... Unknown values read as plain words on a grey chip. */
  state: string | null;
  whatItWillDo: string | null;
  reads: string[] | null;
}

const STATE_TONE: Record<string, ChipTone> = { running: "ultra", "awaiting-approval": "amber", failed: "rose" };

/** The state chip, shared with the runs table. */
export function StateChip({ state }: { state: string }) {
  return <Chip tone={STATE_TONE[state] ?? "neutral"}>{humanize(state)}</Chip>;
}

function RoleChip({ role }: { role: string }) {
  return role === "lead" ? (
    <span className="inline-flex items-center rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold text-paper">Lead</span>
  ) : (
    <Chip>{humanize(role)}</Chip>
  );
}

/**
 * The Room's agents, one card each (Room · Agents & runs.png, Roster). "Reads" is what the agent is told to look at; tool access
 * comes from its persona, not from this list. The arbiter (role `automatic`) cannot be removed: without one, a Room settles
 * disagreements by whichever agent spoke last (documented on the DELETE route). Anyone may try to remove another agent; the backend
 * decides and its message is shown.
 */
export function Roster({ roomId, agents, canEdit }: { roomId: string; agents: RosterCardAgent[]; canEdit: boolean }) {
  const [removing, setRemoving] = React.useState<RosterCardAgent | null>(null);
  const { removeRoomAgent, isPending } = useRemoveRoomAgent({ onSuccess: () => setRemoving(null) });

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[16px] font-semibold text-ink">Roster</h2>
        <p className="text-[11.5px] text-ink-3">“Reads” is what the agent is told to look at. Tool access comes from its persona, not from this list.</p>
      </div>

      {agents.length === 0 ? (
        <div className="mt-3 rounded-card border border-dashed border-line bg-paper p-8 text-center">
          <p className="text-[13px] font-semibold text-ink">No agents on this Room yet</p>
          <p className="mt-1 text-[11.5px] text-ink-3">Add one to start an investigation.</p>
        </div>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 @5xl:grid-cols-3">
          {agents.map((agent) => {
            const isArbiter = agent.role === "automatic";
            return (
              <li key={agent.key} className="flex flex-col rounded-card border border-line bg-paper p-5">
                <div className="flex items-start gap-3">
                  <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(agent.displayName)} className="bg-ultra-bg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{agent.displayName}</p>
                    <div className="mt-1">
                      <RoleChip role={agent.role} />
                    </div>
                  </div>
                  {agent.state && <StateChip state={agent.state} />}
                </div>
                {agent.whatItWillDo && <p className="mt-3 text-[12.5px] leading-relaxed text-ink">{agent.whatItWillDo}</p>}
                {agent.reads && agent.reads.length > 0 && (
                  <p className="mt-2 text-[11.5px] leading-snug text-ink-3">Reads: {agent.reads.join(", ")}</p>
                )}
                {canEdit && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" size="sm" disabled={isArbiter} onClick={() => setRemoving(agent)}>
                      Remove
                    </Button>
                    {isArbiter && <p className="text-[11px] leading-snug text-ink-3">Can't be removed. Without an arbiter, whoever spoke last would win.</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={`Remove ${removing?.displayName ?? "this agent"} from this Room?`}
        description="It will no longer be part of this Room's roster."
        confirmLabel="Remove agent"
        pendingLabel="Removing"
        isPending={isPending}
        onConfirm={() => removing && removeRoomAgent({ roomId, agentKey: removing.key })}
      />
    </section>
  );
}
