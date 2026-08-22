import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { MK_TABS, type MkTab } from "@/pages/agents/marketplace/data";

const TAB_HREF: Record<MkTab, string> = {
  Available: "/marketplace",
  Installed: "/marketplace/installed",
  Publishers: "/marketplace/publishers",
  "What arrives": "/marketplace/what-arrives",
  Requested: "/marketplace/requested",
};

/** Shared 5-tab bar across the /marketplace index's "full" state and its sibling routes. */
export function MarketplaceTabs({ active }: { active: MkTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {MK_TABS.map((tab) => (
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
