import * as React from "react";
import { UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { agentInitialsFromName, initialsFromName } from "@/lib/initials";
import { humanize } from "@/pages/rooms/convening/format";
import type { RosterAgent, RosterPerson } from "@/pages/rooms/room/thread/roster";

type Tab = "all" | "people" | "agents";

function PersonRow({ person, team }: { person: RosterPerson; team: 1 | 2 | 3 | 4 }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <PersonAvatar kind="human" size="lg" team={team} initials={initialsFromName(person.displayName)} />
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{person.displayName}</span>
      <span className="shrink-0 rounded-control bg-paper-2 px-2 py-0.5 text-[11px] text-ink-3">{humanize(person.role)}</span>
    </li>
  );
}

function AgentRow({ agent }: { agent: RosterAgent }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(agent.displayName)} className="bg-ultra-bg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink">{agent.displayName}</p>
        {agent.whatItWillDo && <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-3">{agent.whatItWillDo}</p>}
      </div>
      <span className="shrink-0 rounded-control bg-ultra-bg px-2 py-0.5 text-[11px] text-ultra">{humanize(agent.role)}</span>
    </li>
  );
}

/**
 * Everyone in the Room, from `GET /rooms/{roomId}/people`: All, People and Agents tabs. Read only; roles and removal belong
 * to the People & guardrails tab. Adding goes through the add dialog, opened from the footer once this one has closed.
 */
export function MembersDialog({
  open,
  onOpenChange,
  people,
  agents,
  teamFor,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  people: RosterPerson[];
  agents: RosterAgent[];
  teamFor: (userId: string) => 1 | 2 | 3 | 4;
  /** Present only when the viewer may add (can contribute to the thread). */
  onAdd?: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("all");

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: people.length + agents.length },
    { key: "people", label: "People", count: people.length },
    { key: "agents", label: "Agents", count: agents.length },
  ];
  const showPeople = tab !== "agents" && people.length > 0;
  const showAgents = tab !== "people" && agents.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>In this Room</DialogTitle>
          <DialogDescription>Everyone here reads the whole thread and the Room's work.</DialogDescription>
        </DialogHeader>

        <div role="tablist" className="flex gap-5 border-b border-line px-5 sm:px-7">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "-mb-px flex items-center gap-1.5 border-b-2 py-2.5 text-[13px]",
                tab === key ? "border-ink font-semibold text-ink" : "border-transparent text-ink-3 hover:text-ink"
              )}
            >
              {label}
              <span className="font-mono text-[10.5px] text-ink-4">{count}</span>
            </button>
          ))}
        </div>

        <DialogBody className="h-[min(26rem,55vh)] flex-none px-5 py-2 sm:px-7">
          {!showPeople && !showAgents ? (
            <p className="py-8 text-center text-[12.5px] text-ink-3">
              {tab === "agents" ? "No agents on this Room yet." : tab === "people" ? "No people to show yet." : "No one is listed yet."}
            </p>
          ) : (
            <>
              {showPeople && (
                <section>
                  {tab === "all" && (
                    <h3 className="pt-3 font-mono text-[9.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">People</h3>
                  )}
                  <ul className="divide-y divide-line">
                    {people.map((person) => (
                      <PersonRow key={person.userId} person={person} team={teamFor(person.userId)} />
                    ))}
                  </ul>
                </section>
              )}
              {showAgents && (
                <section>
                  {tab === "all" && (
                    <h3 className="pt-3 font-mono text-[9.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Agents</h3>
                  )}
                  <ul className="divide-y divide-line">
                    {agents.map((agent) => (
                      <AgentRow key={agent.key} agent={agent} />
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onAdd && (
            <Button type="button" onClick={onAdd}>
              <UserPlus className="size-3.5" />
              Add people or agents
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
