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

  return (
    <div className="space-y-6">
      <div>
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

      <Outlet context={{ stage } satisfies StageOutletContext} />
    </div>
  );
};

export default StageTabsLayout;
