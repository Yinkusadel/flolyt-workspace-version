import { ArrowLeft } from "lucide-react";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { SourceLogo } from "@/pages/onboarding/data/source-card";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";

/**
 * flolyt-figma-designs/onboarding/06-source-connected.svg — the "what Flolyt found and mapped"
 * table and the "what you can ask now" rail need an entity-mapping endpoint that isn't
 * documented yet (see docs/onboarding/build-plan.md, step 3 row). This holds the space it
 * opens into from a connected source's card, and gets replaced with the real screen once that
 * endpoint exists.
 */
export function ConnectionDetailPlaceholder({
  connection,
  onBack,
}: {
  connection: ConnectedDatasourceDto;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11.5px] text-ink-3 hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Back to connected sources
      </button>

      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-panel border border-line bg-paper-2">
          <SourceLogo name={connection.datasourceName} className="size-5" />
        </div>
        <div>
          <h1 className="text-[17px] font-semibold text-ink">
            {connection.datasourceDisplayName || connection.connectionName} is connected and reading
          </h1>
        </div>
      </div>

      <Callout tone="neutral" title="The entity-mapping view isn't wired up yet">
        This is where Flolyt would show what it found in {connection.datasourceDisplayName || connection.connectionName}{" "}
        and what it mapped that into — public.users → Customer, public.orders → Order, and so on, each with a
        confidence level. That table needs an entity-mapping endpoint the backend hasn't documented yet, so this
        space is reserved for it rather than built against a guess.
      </Callout>
    </div>
  );
}
