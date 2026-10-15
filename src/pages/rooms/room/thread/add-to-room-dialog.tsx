import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import useGetWorkspaceAgents from "@/features/workspace/use-get-workspace-agents";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import useAddRoomAgent from "@/features/rooms/use-add-room-agent";
import useAddRoomPerson from "@/features/rooms/use-add-room-person";

const FIELD_LABEL = "mb-1 block text-[11px] font-semibold text-ink-2";
const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

/** Roles the backend accepts for a person. `decision-owner` is left out on purpose: it is the Room's owner seat, changed by its own flow. */
const PERSON_ROLES = [
  { value: "participant", label: "Participant", explain: "Contributes to the investigation and work." },
  { value: "approver", label: "Approver", explain: "Provides approval or specialist sign-off." },
  { value: "observer", label: "Observer", explain: "Follows the work without deciding." },
];

/** Roles for an agent. `automatic` (the arbitration seat) is not offered: it reads as system-assigned. */
const AGENT_ROLES = [
  { value: "lead", label: "Lead", explain: "Leads the investigation. Only one agent per Room can lead." },
  { value: "supporting", label: "Supporting", explain: "Contributes alongside the lead." },
];

type Tab = "people" | "agents";

/**
 * Adds a person (`POST /rooms/{roomId}/people`) or an agent (`POST /rooms/{roomId}/agents`) to the Room, opened from the
 * thread panel. Anyone who can contribute to the thread sees it; the backend refuses where it must and its own message
 * is shown. `maxApprovalReach` (the largest play a person may approve; optional, unit undocumented, the design hints "people reached")
 * is sent when filled in, else null. Not sent: `source`. `reads` is the
 * agent's own list from `GET /workspace/agents` (a statement of what it looks at, not a grant); that it is the value the
 * backend means is unverified until the first real add.
 */
export function AddToRoomDialog({
  roomId,
  open,
  onOpenChange,
  initialTab = "people",
}: {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The tab shown each time the dialog opens (the Agents & runs tab opens it on Agents). */
  initialTab?: Tab;
}) {
  const [tab, setTab] = React.useState<Tab>(initialTab);
  React.useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  const [userId, setUserId] = React.useState<string | null>(null);
  const [personRole, setPersonRole] = React.useState("participant");
  const [reach, setReach] = React.useState("");

  const [agentKey, setAgentKey] = React.useState<string | null>(null);
  const [agentRole, setAgentRole] = React.useState("supporting");
  const [whatItWillDo, setWhatItWillDo] = React.useState("");
  const [whatEdited, setWhatEdited] = React.useState(false);

  const roomPeople = useGetRoomPeople(roomId);
  const members = useGetWorkspaceMembers();
  const workspaceAgents = useGetWorkspaceAgents();

  const reset = () => {
    setUserId(null);
    setPersonRole("participant");
    setReach("");
    setAgentKey(null);
    setAgentRole("supporting");
    setWhatItWillDo("");
    setWhatEdited(false);
  };
  const close = () => {
    onOpenChange(false);
    reset();
  };

  const { addRoomPerson, isPending: addingPerson } = useAddRoomPerson({ onSuccess: close });
  const { addRoomAgent, isPending: addingAgent } = useAddRoomAgent({ onSuccess: close });

  const inRoomUserIds = new Set((roomPeople.data?.data.people ?? []).map((person) => person.userId));
  const inRoomAgentKeys = new Set((roomPeople.data?.data.agents ?? []).map((agent) => agent.key));
  const roomHasLead = !!roomPeople.data?.data.leadAgentKey;

  // Active people only, not already in the Room. A member's id is the userId the route wants (same uuid seen across the app).
  const memberOptions = members.members
    .filter((member) => member.kind === "Human" && member.isActive && !inRoomUserIds.has(member.id))
    .map((member) => ({ value: member.id, label: member.displayName }));

  // Live agents only: enabled, `state` ready AND `detailedState` ready. The coarse `state` alone let an agent through whose data
  // capability was unavailable (Compass, found live 2026-10-13), so both must say ready. Others wait until they are.
  const liveAgents = (workspaceAgents.agents?.agents ?? []).filter(
    (agent) => agent.isEnabled && agent.state === "ready" && agent.detailedState === "ready" && !inRoomAgentKeys.has(agent.key)
  );
  const agentOptions = liveAgents.map((agent) => ({ value: agent.key, label: agent.name }));
  const selectedAgent = liveAgents.find((agent) => agent.key === agentKey) ?? null;
  const agentRoleOptions = AGENT_ROLES.filter((role) => !(role.value === "lead" && roomHasLead));

  const pickAgent = (key: string) => {
    setAgentKey(key);
    // Offer the agent's own description as what it will do; never overwrite what the person typed.
    if (!whatEdited) setWhatItWillDo(liveAgents.find((agent) => agent.key === key)?.description ?? "");
  };

  const personRoleInfo = PERSON_ROLES.find((role) => role.value === personRole);
  const agentRoleInfo = AGENT_ROLES.find((role) => role.value === agentRole);

  // A whole number the API can hold (int32), or nothing.
  const reachTrimmed = reach.trim();
  const reachValue = reachTrimmed === "" ? null : Number(reachTrimmed);
  const reachInvalid = reachValue !== null && (!Number.isInteger(reachValue) || reachValue < 0 || reachValue > 2147483647);

  const submitPerson = () => {
    if (!userId || reachInvalid) return;
    addRoomPerson({ roomId, userId, role: personRole, maxApprovalReach: reachValue, source: null });
  };
  const submitAgent = () => {
    if (!agentKey || !whatItWillDo.trim()) return;
    addRoomAgent({
      roomId,
      agentKey,
      role: agentRole,
      whatItWillDo: whatItWillDo.trim(),
      reads: selectedAgent?.reads?.length ? selectedAgent.reads : null,
    });
  };

  const isPending = addingPerson || addingAgent;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      {/* A form: it closes only with Cancel or the close button, never on an outside click or Escape. */}
      <DialogContent
        className="max-w-lg"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add to this Room</DialogTitle>
          <DialogDescription>Bring a teammate or an agent into the Room's thread and work.</DialogDescription>
        </DialogHeader>

        <div role="tablist" className="flex gap-5 border-b border-line px-5 sm:px-7">
          {(["people", "agents"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "-mb-px border-b-2 py-2.5 text-[13px]",
                tab === key ? "border-ink font-semibold text-ink" : "border-transparent text-ink-3 hover:text-ink"
              )}
            >
              {key === "people" ? "People" : "Agents"}
            </button>
          ))}
        </div>

        <DialogBody className="h-[min(26rem,60vh)] flex-none space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          {tab === "people" ? (
            <>
              <p className="rounded-card border border-line bg-paper-2/60 px-3 py-2.5 text-[11.5px] leading-relaxed text-ink-3">
                This is the widest access there is. Whoever you add will see the evidence, the decision, the plays and every
                customer in the cohort.
              </p>
              <div>
                <label className={FIELD_LABEL}>Person</label>
                {members.isPending || roomPeople.isPending ? (
                  <SearchableSelectSkeleton />
                ) : members.isError ? (
                  <p className="text-[12px] text-rose">{members.error.message || "The workspace members couldn't be loaded"}</p>
                ) : (
                  <SearchableSelect
                    options={memberOptions}
                    value={userId}
                    onChange={setUserId}
                    placeholder="Choose a teammate"
                    searchPlaceholder="Search teammates"
                    emptyText="Everyone in the workspace is already in this Room"
                    disabled={isPending}
                  />
                )}
              </div>
              <div>
                <label className={FIELD_LABEL}>Role</label>
                <SearchableSelect
                  options={PERSON_ROLES.map((role) => ({ value: role.value, label: role.label }))}
                  value={personRole}
                  onChange={setPersonRole}
                  disabled={isPending}
                />
                {personRoleInfo && <p className="mt-1.5 text-[11.5px] text-ink-3">{personRoleInfo.explain}</p>}
              </div>
              <div>
                <label htmlFor="add-person-reach" className={FIELD_LABEL}>
                  Largest play they can approve (optional)
                </label>
                <input
                  id="add-person-reach"
                  inputMode="numeric"
                  value={reach}
                  disabled={isPending}
                  onChange={(event) => setReach(event.currentTarget.value)}
                  placeholder="People reached"
                  aria-invalid={reachInvalid}
                  className="h-9 w-full rounded-control border border-line bg-paper px-3 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ultra aria-[invalid=true]:border-rose disabled:opacity-60"
                />
                {reachInvalid && <p className="mt-1.5 text-[11.5px] text-rose">Use a whole number, or leave it empty.</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={FIELD_LABEL}>Agent</label>
                {workspaceAgents.isPending || roomPeople.isPending ? (
                  <SearchableSelectSkeleton />
                ) : workspaceAgents.isError ? (
                  <p className="text-[12px] text-rose">{workspaceAgents.error.message || "The agents couldn't be loaded"}</p>
                ) : (
                  <SearchableSelect
                    options={agentOptions}
                    value={agentKey}
                    onChange={pickAgent}
                    placeholder="Choose an agent"
                    searchPlaceholder="Search agents"
                    emptyText="No ready agents left to add"
                    disabled={isPending}
                  />
                )}
                <p className="mt-1.5 text-[11.5px] text-ink-3">Only agents that are ready are listed.</p>
              </div>
              <div>
                <label className={FIELD_LABEL}>Role</label>
                <SearchableSelect
                  options={agentRoleOptions.map((role) => ({ value: role.value, label: role.label }))}
                  value={agentRoleOptions.some((role) => role.value === agentRole) ? agentRole : null}
                  onChange={setAgentRole}
                  placeholder="Choose a role"
                  disabled={isPending}
                />
                <p className="mt-1.5 text-[11.5px] text-ink-3">
                  {roomHasLead ? "This Room already has a lead agent. " : ""}
                  {agentRoleInfo?.explain}
                </p>
              </div>
              <div>
                <label htmlFor="add-agent-what" className={FIELD_LABEL}>
                  What will it do here? (required)
                </label>
                <textarea
                  id="add-agent-what"
                  rows={3}
                  value={whatItWillDo}
                  disabled={isPending}
                  onChange={(event) => {
                    setWhatItWillDo(event.currentTarget.value);
                    setWhatEdited(true);
                  }}
                  placeholder={selectedAgent ? "Describe what this agent should do on this Room" : "Choose an agent first"}
                  className={AREA}
                />
              </div>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={isPending} onClick={close}>
            Cancel
          </Button>
          {tab === "people" ? (
            <Button type="button" disabled={!userId || reachInvalid || isPending} onClick={submitPerson}>
              {addingPerson ? "Adding" : "Add person"}
            </Button>
          ) : (
            <Button type="button" disabled={!agentKey || !whatItWillDo.trim() || isPending} onClick={submitAgent}>
              {addingAgent ? "Adding" : "Add agent"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
