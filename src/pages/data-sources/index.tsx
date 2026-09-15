import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Callout } from "@/components/ui/rail";
import useGetDatasources from "@/features/datasources/use-get-datasources";
import useGetConnectedDatasources, {
  CONNECTED_DATASOURCES_QUERY_KEY,
} from "@/features/datasources/use-get-connected-datasources";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import { SourceGrid, SourceGridSkeleton } from "@/pages/onboarding/data/source-grid";
import { ConnectSourceModal } from "@/pages/onboarding/data/connect-source-modal";
import { ConnectedSourcesList, ConnectedSourcesListSkeleton } from "@/pages/data-sources/connected-list";

type DataSourcesTab = "sources" | "connected";
const TABS: { key: DataSourcesTab; label: string }[] = [
  { key: "sources", label: "Sources" },
  { key: "connected", label: "Connected" },
];

function TabBar({ active, onChange }: { active: DataSourcesTab; onChange: (tab: DataSourcesTab) => void }) {
  return (
    <div className="border-b border-line">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The sources tab is the same catalog + connect flow as /onboarding/data (screen 05) — same
 * hooks, same SourceGrid/ConnectSourceModal, minus the wizard chrome. The connected tab is new
 * here: onboarding never needed to just list what's already hooked up.
 */
export default function DataSourcesRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: DataSourcesTab = searchParams.get("tab") === "connected" ? "connected" : "sources";
  const setActiveTab = (tab: DataSourcesTab) => {
    setSearchParams(tab === "sources" ? {} : { tab }, { replace: true });
  };

  const queryClient = useQueryClient();
  const [selectedDatasource, setSelectedDatasource] = useState<DatasourceDto | null>(null);

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

  const isLoadingSources = isLoadingDatasources || isLoadingConnected;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Connect the systems Flolyt should read from. Nothing here can write back without a
          separate, per-action approval.
        </p>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "sources" ? (
        isLoadingSources ? (
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
        )
      ) : isLoadingConnected ? (
        <ConnectedSourcesListSkeleton />
      ) : (
        <ConnectedSourcesList
          connections={connectedDatasources}
          onGoToSources={() => setActiveTab("sources")}
        />
      )}

      {selectedDatasource && (
        <ConnectSourceModal
          datasource={selectedDatasource}
          onClose={() => setSelectedDatasource(null)}
          onConnected={() => {
            setSelectedDatasource(null);
            queryClient.invalidateQueries({ queryKey: CONNECTED_DATASOURCES_QUERY_KEY });
            setActiveTab("connected");
          }}
        />
      )}
    </div>
  );
}
