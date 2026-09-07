import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { BackButton } from "@/pages/onboarding/back-button";
import useGetDatasources from "@/features/datasources/use-get-datasources";
import useGetConnectedDatasources from "@/features/datasources/use-get-connected-datasources";
import useGetDataMap, { DATA_MAP_QUERY_KEY } from "@/features/workspace/use-get-data-map";
import useSaveOnboardingProgress from "@/features/workspace/use-save-onboarding-progress";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import { SourceGrid, SourceGridSkeleton } from "@/pages/onboarding/data/source-grid";
import { MappingView, MappingViewSkeleton } from "@/pages/onboarding/data/mapping-view";
import { WhatSourceUnlocks } from "@/pages/onboarding/data/what-source-unlocks";
import { WhatYouCanAskNow } from "@/pages/onboarding/data/what-you-can-ask-now";
import { ConnectSourceModal } from "@/pages/onboarding/data/connect-source-modal";

/**
 * Onboarding step 3 ("Your data") — flolyt-figma-designs/onboarding/05-connect-first-source.svg
 * and 06-source-connected.svg. Sub-states, not sub-routes, matching every other onboarding
 * step's index-branching pattern: "sources" (05) and "mapping" (06) both live at
 * /onboarding/data. There is no per-source detail page anymore — GET .../workspace/data-map
 * returns every connected source's tables in one call, so "mapping" shows all of them at once
 * instead of drilling into one connection at a time.
 */
export default function OnboardingDataRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"sources" | "mapping">("sources");
  const [selectedDatasource, setSelectedDatasource] = useState<DatasourceDto | null>(null);

  const { datasources, isLoading: isLoadingDatasources } = useGetDatasources();
  const { connectedDatasources, isLoading: isLoadingConnected } = useGetConnectedDatasources();
  const {
    dataMap,
    isLoading: isLoadingDataMap,
    refetch: refetchDataMap,
    isFetching: isFetchingDataMap,
  } = useGetDataMap(view === "mapping");
  const { saveProgress, isPending: isSavingProgress } = useSaveOnboardingProgress();

  const activeConnections = useMemo(
    () => connectedDatasources.filter((c) => c.isActive),
    [connectedDatasources]
  );
  const connectedNames = useMemo(
    () => new Set(activeConnections.map((c) => c.datasourceName)),
    [activeConnections]
  );
  const connectedCategories = useMemo(
    () => new Set(activeConnections.map((c) => c.category)),
    [activeConnections]
  );
  const stripeDatasource = useMemo(
    () => datasources.find((ds) => ds.name === "Stripe") ?? null,
    [datasources]
  );

  const isLoadingSources = isLoadingDatasources || isLoadingConnected;

  const goToNextStep = () => navigate("/onboarding/agents");

  const handleRefreshMapping = () => refetchDataMap();

  const handleContinue = () => {
    saveProgress(
      { kind: "ReviewedMapping", step: "data" },
      { onSuccess: goToNextStep, onError: goToNextStep }
    );
  };

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={3} />
      </div>

      <div className="flex flex-1 md:min-h-0">
        <div className="flex flex-1 flex-col px-6 md:min-h-0 md:min-w-0 md:overflow-hidden lg:pl-10">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col md:min-h-0">
            {view === "sources" ? (
              <>
                <div className="shrink-0">
                  <h1 className="text-[19px] font-semibold text-ink">
                    Connect one source. That's enough to start.
                  </h1>
                  <p className="mt-2 text-[12.5px] text-ink-3">
                    Flolyt reasons over your systems where they are. There is no import to wait for and
                    no nightly snapshot to go stale.
                  </p>
                </div>

                <div className="mt-6 flex-1 md:min-h-0">
                  {isLoadingSources ? (
                    <SourceGridSkeleton />
                  ) : (
                    <SourceGrid
                      datasources={datasources}
                      connectedNames={connectedNames}
                      onSelect={setSelectedDatasource}
                      footer={
                        <Callout tone="neutral" title="Read-only until you say otherwise">
                          Connecting grants read access only. Anything that writes back to a connected
                          system is granted separately, per action, and always through an approval.
                        </Callout>
                      }
                    />
                  )}
                </div>

                <div className="mt-4 flex shrink-0 items-center justify-between gap-3 pb-6">
                  <BackButton to="/onboarding/business-model" />

                  {activeConnections.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setView("mapping")}
                      className="h-10.5 rounded-card px-5 text-[13px] font-semibold"
                    >
                      Show mapping
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
                {isLoadingDataMap || !dataMap ? (
                  <MappingViewSkeleton />
                ) : (
                  <MappingView
                    dataMap={dataMap}
                    onConnectNewSource={() => setView("sources")}
                    onContinue={handleContinue}
                    isContinuing={isSavingProgress}
                    onRefresh={handleRefreshMapping}
                    isRefreshing={isFetchingDataMap}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {view === "sources" ? (
          <WhatSourceUnlocks connectedCategories={connectedCategories} />
        ) : (
          <WhatYouCanAskNow
            connectedCategories={connectedCategories}
            onConnectStripe={() => stripeDatasource && setSelectedDatasource(stripeDatasource)}
            onConnectProductSource={() => setView("sources")}
          />
        )}
      </div>

      {selectedDatasource && (
        <ConnectSourceModal
          datasource={selectedDatasource}
          onClose={() => setSelectedDatasource(null)}
          onConnected={() => {
            setSelectedDatasource(null);
            queryClient.invalidateQueries({ queryKey: DATA_MAP_QUERY_KEY });
            setView("mapping");
          }}
        />
      )}
    </div>
  );
}
