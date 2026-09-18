import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { TeamCard, TeamCardSkeleton } from "@/pages/onboarding/team/team-card";
import { CreateTeamModal } from "@/pages/onboarding/team/create-team-modal";
import { ConfirmModal } from "@/pages/onboarding/team/confirm-modal";
import useGetTeams from "@/features/teams/use-get-teams";
import useDeactivateTeam from "@/features/teams/use-deactivate-team";
import type { TeamDto } from "@/services/api/teams/get-teams";

/**
 * Same team list + create/delete pattern as /onboarding/team (onboarding/team/index.tsx) —
 * same hooks, same TeamCard/CreateTeamModal/ConfirmModal, minus the wizard chrome (no
 * WizardStepper, no Continue/Back bar, no "Why create a team" aside, which is written for the
 * onboarding flow specifically). "Invite team member" hands off to /members/:teamId
 * (detail-route.tsx) the same way the onboarding step hands off to /onboarding/team/:teamId.
 */
export default function MembersRoute() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamDto | null>(null);

  const { teams, isLoading } = useGetTeams();
  const { deactivateTeam, isPending: isDeleting } = useDeactivateTeam({
    onSuccess: () => setTeamToDelete(null),
  });

  const goToTeamPage = (teamId: string) => navigate(`/members/${teamId}`);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Members</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Everyone you invite works from the same agents and data. Create a team first, then
            invite people whenever you're ready.
          </p>
        </div>

        {!isLoading && (
          <Button type="button" onClick={() => setShowCreateModal(true)}>
            Create team
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <TeamCardSkeleton />
        ) : teams.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
            <p className="text-[12.5px] font-semibold text-ink">No team yet</p>
            <p className="mt-1 text-[11px] text-ink-3">
              Create one to start inviting people. It only takes a name.
            </p>
          </div>
        ) : (
          teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onInvite={() => goToTeamPage(team.id)}
              onDelete={() => setTeamToDelete(team)}
            />
          ))
        )}
      </div>

      <CreateTeamModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={() => setShowCreateModal(false)}
      />

      <ConfirmModal
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
        title={`Delete "${teamToDelete?.name}"?`}
        description="This deactivates the team for everyone on it. This can't be undone from here."
        confirmLabel="Delete team"
        pendingLabel="Deleting..."
        isPending={isDeleting}
        onConfirm={() => teamToDelete && deactivateTeam(teamToDelete.id)}
      />
    </div>
  );
}
