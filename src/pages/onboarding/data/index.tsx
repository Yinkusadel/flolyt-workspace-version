import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import useGetDatasources from "@/features/datasources/use-get-datasources";
import useGetConnectedDatasources from "@/features/datasources/use-get-connected-datasources";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import { SourceGrid, SourceGridSkeleton } from "@/pages/onboarding/data/source-grid";
import { ConnectedList, ConnectedListSkeleton } from "@/pages/onboarding/data/connected-list";
import { WhatSourceUnlocks } from "@/pages/onboarding/data/what-source-unlocks";
import { ConnectSourceModal } from "@/pages/onboarding/data/connect-source-modal";
import { ConnectionDetailPlaceholder } from "@/pages/onboarding/data/connection-detail-placeholder";

/**
 * Onboarding step 3 ("Your data") — flolyt-figma-designs/onboarding/05-connect-first-source.svg
 * and 06-source-connected.svg. Sub-states, not sub-routes, matching every other onboarding step's
 * index-branching pattern: "sources" (05) and "connected" both live at /onboarding/data, plus a
 * connection-detail state that reserves the space 06 will occupy once its mapping endpoint exists
 * (see docs/onboarding/build-plan.md).
 */
export default function OnboardingDataRoute() {
  const [view, setView] = useState<"sources" | "connected">("sources");
  const [selectedDatasource, setSelectedDatasource] = useState<DatasourceDto | null>(null);
  const [openConnection, setOpenConnection] = useState<ConnectedDatasourceDto | null>(null);

  const { datasources, isLoading: isLoadingDatasources } = useGetDatasources();
  const { connectedDatasources, isLoading: isLoadingConnected } = useGetConnectedDatasources();

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

  const isLoading = isLoadingDatasources || isLoadingConnected;

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={3} />
      </div>

      <div className="flex flex-1 md:min-h-0">
        <div className="flex flex-1 flex-col px-6 md:min-h-0 md:min-w-0 md:overflow-hidden lg:pl-10">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col md:min-h-0">
            {openConnection ? (
              <div className="pb-6 md:min-h-0 md:flex-1 md:overflow-y-auto">
                <ConnectionDetailPlaceholder connection={openConnection} onBack={() => setOpenConnection(null)} />
              </div>
            ) : (
              <>
                <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-[19px] font-semibold text-ink">
                      {view === "sources" ? "Connect one source. That's enough to start." : "Your connected sources"}
                    </h1>
                    <p className="mt-2 text-[12.5px] text-ink-3">
                      {view === "sources"
                        ? "Flolyt reasons over your systems where they are. There is no import to wait for and no nightly snapshot to go stale."
                        : "Reconnect anything that dropped, or disconnect a source you no longer want read."}
                    </p>
                  </div>

                  {view === "sources" && activeConnections.length > 0 && (
                    <Button type="button" variant="outline" onClick={() => setView("connected")}>
                      View connected sources
                    </Button>
                  )}
                  {view === "connected" && (
                    <Button type="button" variant="outline" onClick={() => setView("sources")}>
                      Connect new source
                    </Button>
                  )}
                </div>

                <div className="mt-6 flex-1 md:min-h-0">
                  {view === "sources" ? (
                    isLoading ? (
                      <SourceGridSkeleton />
                    ) : (
                      <SourceGrid
                        datasources={datasources}
                        connectedNames={connectedNames}
                        onSelect={setSelectedDatasource}
                        footer={
                          <Callout tone="neutral" title="Read-only until you say otherwise">
                            Connecting grants read access only. Anything that writes back to a connected system
                            is granted separately, per action, and always through an approval.
                          </Callout>
                        }
                      />
                    )
                  ) : isLoading ? (
                    <ConnectedListSkeleton />
                  ) : (
                    <ConnectedList connectedDatasources={connectedDatasources} onSelect={setOpenConnection} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <WhatSourceUnlocks connectedCategories={connectedCategories} />
      </div>

      {selectedDatasource && (
        <ConnectSourceModal
          datasource={selectedDatasource}
          onClose={() => setSelectedDatasource(null)}
          onConnected={() => {
            setSelectedDatasource(null);
            setView("connected");
          }}
        />
      )}
    </div>
  );
}
