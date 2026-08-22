import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { GV_TABS, type GvTab } from "@/pages/agents/governance/data";

const TAB_HREF: Record<GvTab, string> = {
  "The log": "/governance",
  "Data access": "/governance/access",
  Permissions: "/governance/permissions",
  Spend: "/governance/spend",
  Reviews: "/governance/reviews",
  Incidents: "/governance/incidents/1",
};

/** Shared 6-tab bar across the /governance index's "full" state and its sibling routes. */
export function GovernanceTabs({ active }: { active: GvTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {GV_TABS.map((tab) => (
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
