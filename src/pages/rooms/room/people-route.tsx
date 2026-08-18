import * as React from "react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/rooms/actor";
import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { InvitePeopleModal } from "@/pages/rooms/room/modals/invite-people-modal";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R30 — Room · people and permissions (`/rooms/:id/people`), with the R29 invite modal on top. */
export const PeopleRoute = () => {
  const { room } = useRoomContext();
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const people = room.peoplePermissions ?? [];
  const agents = room.agentPermissions ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "People" }]}
        title="People"
        subtitle={`${people.length} people, ${agents.length} agents · everyone sees everything · no agent can act`}
        action={<Button onClick={() => setInviteOpen(true)}>Add someone</Button>}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Person</th>
              <th className={HEAD_CLASS}>Team</th>
              <th className={HEAD_CLASS}>Role here</th>
              <th className={HEAD_CLASS}>Can approve</th>
              <th className={HEAD_CLASS}>Added</th>
              <th className={HEAD_CLASS}>By</th>
              <th className={HEAD_CLASS}>Sees the cohort</th>
            </tr>
          </thead>
          <tbody>
            {people.map((row) => (
              <tr key={row.person.initials + row.person.name} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <ActorAvatar actor={{ kind: "human", person: row.person }} size="sm" />
                    <span className="font-semibold text-ink-2">{row.person.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-2">{row.person.department}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.role.tone}>{row.role.label}</Chip>
                </td>
                <td className="px-4 py-3 text-amber">{row.canApprove}</td>
                <td className="px-4 py-3 font-mono text-ink-4">{row.added}</td>
                <td className="px-4 py-3 text-ink-3">{row.addedBy}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.seesCohort.tone}>{row.seesCohort.label}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Roles decide who is asked, not what they can see</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Every person in this list can read every message, every finding and every customer in the cohort. The
            role only changes who a proposal routes to and what they are allowed to approve. Visibility is the price
            of being in the room, which is why adding somebody is a real decision.
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Agents in this room</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>What it does here</th>
                <th className={HEAD_CLASS}>Role</th>
                <th className={HEAD_CLASS}>Reads</th>
                <th className={HEAD_CLASS}>Can act</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "agent", agent: row.agent }} size="sm" />
                      <span className="font-semibold text-ink-2">{row.agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.does}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.role.tone}>{row.role.label}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.reads}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.canAct.tone}>{row.canAct.label}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">No agent can act, in any room, ever</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Every one of them is propose-only by construction — not by a setting somebody could change. The
            Orchestrator cannot even propose; it can only name that two other agents disagree.
          </p>
        </div>
      </div>

      <InvitePeopleModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
};
