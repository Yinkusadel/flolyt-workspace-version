import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { TeamCard, TeamCardSkeleton } from "@/pages/onboarding/team/team-card";
import { CreateTeamModal } from "@/pages/onboarding/team/create-team-modal";
import { ConfirmModal } from "@/pages/onboarding/team/confirm-modal";
import { WhyCreateATeam } from "@/pages/onboarding/team/why-create-a-team";
import useGetTeams from "@/features/teams/use-get-teams";
import useDeactivateTeam from "@/features/teams/use-deactivate-team";
import useSaveOnboardingProgress from "@/features/workspace/use-save-onboarding-progress";
import type { TeamDto } from "@/services/api/teams/get-teams";

/**
 * Onboarding step 5 ("Your team") — no Figma source for this one, built from conversation
 * only. "Create team" opens the create-team modal and stays available at the top regardless
 * of how many teams already exist — a workspace isn't limited to one. Every team gets its own
 * card, each with an "Invite team member" button that hands off to the team page
 * (/onboarding/team/:teamId, team-detail-route.tsx) — same handoff shape as the data step's
 * "Show mapping", just across a route instead of a sub-state, since a team has a real id to
 * key off of — and a delete icon opening `ConfirmModal` before calling `DELETE /teams/{id}`
 * (soft-deactivate). Header (title + Create team) is `shrink-0`; only the team-card list
 * scrolls (`md:min-h-0 md:flex-1 md:overflow-y-auto`) so a long list can't push the page past
 * the viewport, same bounded-height pattern the agents step already uses for its card grid.
 * Team creation is optional — Continue works with zero teams just as well as with several,
 * and posts `kind: "Finished"` (the one progress event that exists specifically for this).
 * Unlike every other onboarding step's Continue (which fail-opens — navigates on both
 * onSuccess and onError, since a transient network hiccup shouldn't trap someone on a
 * non-gating step), this one is deliberately fail-closed, per the user's direct correction:
 * only navigate to /onboarding/finishing-up once the save comes back `succeeded: true`;
 * otherwise show an error and stay put so a genuinely-failed "Finished" flag doesn't get
 * silently skipped past.
 */
export default function OnboardingTeamRoute() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamDto | null>(null);

  const { teams, isLoading } = useGetTeams();
  const { deactivateTeam, isPending: isDeleting } = useDeactivateTeam({
    onSuccess: () => setTeamToDelete(null),
  });
  const { saveProgress, isPending: isSavingProgress } = useSaveOnboardingProgress();

  const goToTeamPage = (teamId: string) => navigate(`/onboarding/team/${teamId}`);

  const handleContinue = () => {
    saveProgress(
      { kind: "Finished", step: "team" },
      {
        onSuccess: (data) => {
          if (data.succeeded) {
            navigate("/onboarding/finishing-up");
            return;
          }
          toast.error(data.messages?.[0] || "Couldn't finish setup. Please try again.");
        },
        onError: (error) => {
          toast.error(error.message || "Couldn't finish setup. Please try again.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={5} />
      </div>

      <div className="flex flex-1 md:min-h-0">
        <div className="flex flex-1 flex-col px-6 md:min-h-0 lg:pl-10">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pb-6 md:min-h-0">
            <div className="shrink-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-[22px] font-semibold text-ink">Bring your team in</h1>
                  <p className="mt-2 max-w-2xl text-[12.5px] text-ink-3">
                    Everyone you invite works from the same agents and data — create your team
                    first, then invite people whenever you're ready.
                  </p>
                </div>

                {!isLoading && (
                  <Button type="button" onClick={() => setShowCreateModal(true)}>
                    Create team
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3 pb-1 md:min-h-0 md:flex-1 md:overflow-y-auto">
              {isLoading ? (
                <TeamCardSkeleton />
              ) : teams.length === 0 ? (
                <div className="rounded-panel border border-dashed border-line bg-paper-2 p-5">
                  <p className="text-[13px] font-semibold text-ink">No team yet</p>
                  <p className="mt-2 text-[11.5px] text-ink-3">
                    Create one to start inviting people — it only takes a name.
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

            <div className="mt-6 shrink-0">
              <Button
                type="button"
                onClick={handleContinue}
                disabled={isSavingProgress}
                className="h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
              >
                {isSavingProgress ? "Saving..." : "Continue"}
              </Button>
            </div>
          </div>
        </div>

        <WhyCreateATeam />
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
