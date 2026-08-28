import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { AgentCard, AgentCardSkeleton } from "@/pages/onboarding/agents/agent-card";
import useGetWorkspaceAgents from "@/features/workspace/use-get-workspace-agents";
import useSaveOnboardingProgress from "@/features/workspace/use-save-onboarding-progress";

/**
 * Onboarding step 4 ("Your agents") — flolyt-figma-designs/onboarding/07-meet-your-agents.svg.
 * Read-only readiness grid off GET /workspace/agents, no step-up gating. Continue saves
 * `AcknowledgedAgents` (one of the two "acts that leave no other trace" onboarding tracks —
 * see docs/endpoints/workspace.md) then sends the user into the app itself: step 5 ("Your
 * team") is the regular Team settings page per docs/onboarding/build-plan.md, not a wizard
 * route, and that page doesn't exist yet — until it does, ProtectedRoute's onboarding guard
 * falls back to this same screen if the backend still reports something outstanding.
 */
export default function OnboardingAgentsRoute() {
  const navigate = useNavigate();
  const { agents, isLoading } = useGetWorkspaceAgents();
  const { saveProgress, isPending } = useSaveOnboardingProgress();

  const goToNextStep = () => navigate("/");

  const handleContinue = () => {
    saveProgress(
      { kind: "AcknowledgedAgents", step: "agents" },
      { onSuccess: goToNextStep, onError: goToNextStep }
    );
  };

  const notReadyCount = agents?.notReadyCount ?? 0;
  const readinessTitle =
    notReadyCount === 0
      ? "Every agent is ready"
      : `${notReadyCount} agent${notReadyCount === 1 ? " is" : "s are"} not ready, and ${
          notReadyCount === 1 ? "it says" : "they say"
        } so`;

  const readinessLoading = isLoading || !agents;

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={4} />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-6 md:min-h-0">
        <div className="shrink-0">
          <h1 className="text-[22px] font-semibold text-ink">Your agents are reading in</h1>
          <p className="mt-2 max-w-2xl text-[12.5px] text-ink-3">
            Thirteen specialists share one memory of your business. Each one says plainly what it
            can answer today and what it is still missing — nothing here pretends to be ready
            before it is.
          </p>
        </div>

        <div className="mt-6 md:min-h-0 md:flex-1 md:overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading || !agents
              ? Array.from({ length: 13 }).map((_, i) => <AgentCardSkeleton key={i} />)
              : agents.agents.map((agent) => <AgentCard key={agent.key} agent={agent} />)}
          </div>
        </div>

        <div className="mt-6 shrink-0">
          {readinessLoading ? (
            <div className="rounded-card border border-line bg-paper-2 p-4">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="mt-2.5 h-3 w-full max-w-md" />
            </div>
          ) : (
            <Callout tone="neutral" title={readinessTitle}>
              An agent with no source does not guess. It names the source it needs and stays quiet
              until it has one.
            </Callout>
          )}

          <Button
            type="button"
            onClick={handleContinue}
            disabled={isPending || readinessLoading}
            className="mt-4 h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
          >
            {isPending ? "Saving..." : "Continue — invite your team"}
          </Button>
        </div>
      </div>
    </div>
  );
}
