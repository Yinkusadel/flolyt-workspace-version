import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useStageContext, type StageOutletContext } from "@/pages/lifecycle/stage/layout";
import { STAGE_TABS } from "@/pages/lifecycle/stage/stage-tabs-config";

const TAB_CLASS = ({ isActive }: { isActive: boolean }) =>
  cn(
    "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11px] whitespace-nowrap",
    isActive ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-ink-3 hover:text-ink-2"
  );

/**
 * Shared shell for a stage's Overview + tab screens (A02/A03/.../A10/A14 —
 * every screen that shows the persistent tab bar). Definition, Compare and
 * :id drilldowns are siblings under stage/layout.tsx instead — they have
 * their own header and never show this tab bar, confirmed by reading
 * A16/AC01/A05 directly (see the lifecycle rebuild plan).
 */
const StageTabsLayout = () => {
  const { stage } = useStageContext();
  const tabs = STAGE_TABS[stage.slug] ?? [];
  const [headerActionsEl, setHeaderActionsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] text-ink-4">
            <Link to="/lifecycle" className="hover:text-ink-3">
              Lifecycle
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-ink-3">{stage.name}</span>
          </p>
          <h1 className="mt-2 text-[17px] font-semibold text-ink">{stage.name}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{stage.headline}</p>
        </div>
        {/* Portal target for a tab's header-right actions — e.g. Overview's Share or export row. */}
        <div ref={setHeaderActionsEl} className="flex shrink-0 flex-wrap items-center gap-4" />
      </div>

      {stage.isDefined && tabs.length > 0 && (
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-line">
          <NavLink to={`/lifecycle/${stage.slug}`} end className={TAB_CLASS}>
            Overview
          </NavLink>
          {tabs.map((tab) => (
            <NavLink key={tab.path} to={`/lifecycle/${stage.slug}/${tab.path}`} className={TAB_CLASS}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}

      <Outlet context={{ stage, headerActionsEl } satisfies StageOutletContext} />
    </div>
  );
};

export default StageTabsLayout;
