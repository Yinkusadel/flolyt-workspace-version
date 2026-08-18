import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import { STAGES, type Stage } from "@/pages/lifecycle/data";

export type StageOutletContext = {
  stage: Stage;
  /** Portal target for a tab's header-right actions (e.g. Overview's Share or export row) — set by stage-tabs-layout.tsx, absent on the Definition/Compare/:id siblings that render their own header via StageSubpageHeader instead. */
  headerActionsEl?: HTMLDivElement | null;
};

/**
 * Resolves :stage to a Stage record and provides it via context to every
 * nested route (the tab bar layout, definition, compare, and :id
 * drilldowns alike) — no header markup here, see stage-tabs-layout.tsx and
 * stage-subpage-header.tsx for the two header shapes those routes use.
 */
const StageLayout = () => {
  const { stage: slug } = useParams();
  const stage = STAGES.find((s) => s.slug === slug);

  if (!stage) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Stage not found</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">
          Check the lifecycle map for the right stage.
        </p>
        <Link to="/lifecycle" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to the lifecycle map
        </Link>
      </div>
    );
  }

  return <Outlet context={{ stage } satisfies StageOutletContext} />;
};

export default StageLayout;

export function useStageContext() {
  return useOutletContext<StageOutletContext>();
}
