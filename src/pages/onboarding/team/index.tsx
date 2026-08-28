import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { TeamCard, TeamCardSkeleton } from "@/pages/onboarding/team/team-card";
import { CreateTeamModal } from "@/pages/onboarding/team/create-team-modal";
import { WhyCreateATeam } from "@/pages/onboarding/team/why-create-a-team";
import useGetTeams from "@/features/teams/use-get-teams";

/**
 * Onboarding step 5 ("Your team") — no Figma source for this one, built from conversation
 * only. "Create team" opens the create-team modal and stays available at the top regardless
 * of how many teams already exist — a workspace isn't limited to one. Every team gets its own
 * card, each with an "Invite team member" button that hands off to the team page
 * (/onboarding/team/:teamId, team-detail-route.tsx) — same handoff shape as the data step's
 * "Show mapping", just across a route instead of a sub-state, since a team has a real id to
 * key off of.
 */
export default function OnboardingTeamRoute() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { teams, isLoading } = useGetTeams();

  const goToTeamPage = (teamId: string) => navigate(`/onboarding/team/${teamId}`);

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={5} />
      </div>

      <div className="flex flex-1 md:min-h-0">
        <div className="flex flex-1 flex-col px-6 md:min-h-0 md:overflow-y-auto lg:pl-10">
          <div className="mx-auto w-full max-w-4xl pb-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-[22px] font-semibold text-ink">Bring your team in</h1>
                <p className="mt-2 max-w-2xl text-[12.5px] text-ink-3">
                  Everyone you invite works from the same agents and data — create your team first,
                  then invite people whenever you're ready.
                </p>
              </div>

              {!isLoading && (
                <Button type="button" onClick={() => setShowCreateModal(true)}>
                  Create team
                </Button>
              )}
            </div>

            <div className="mt-6 space-y-3">
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
                  <TeamCard key={team.id} team={team} onInvite={() => goToTeamPage(team.id)} />
                ))
              )}
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
    </div>
  );
}
