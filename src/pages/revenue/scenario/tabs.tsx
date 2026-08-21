import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { SC_TABS, type ScTab } from "@/pages/revenue/scenario/data";

const TAB_HREF: Record<ScTab, string> = {
  Saved: "/scenario",
  Blocked: "/scenario/blocked",
  "Against what happened": "/scenario/actuals",
  History: "/scenario/history",
};

/** Shared 4-tab bar across the /scenario index's "full" state and its three standalone sibling routes. */
export function ScenarioTabs({ active }: { active: ScTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {SC_TABS.map((tab) => (
          <Link
            key={tab}
            to={TAB_HREF[tab]}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab}
          </Link>
        ))}
      </div>
    </div>
  );
}
