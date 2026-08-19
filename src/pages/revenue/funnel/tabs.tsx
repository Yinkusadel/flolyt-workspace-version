import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { FN_TABS, type FnTab } from "@/pages/revenue/funnel/data";

const TAB_HREF: Record<FnTab, string> = {
  "The funnel": "/funnel",
  "By market": "/funnel?by=market",
  "By cohort": "/funnel?by=cohort",
  "Not instrumented": "/funnel/gaps",
  Compare: "/funnel/compare",
  History: "/funnel/history",
};

/** Shared 6-tab bar across FN03/05/06/07/08/12 — spans both the /funnel index's query-param states and its three standalone sibling routes. */
export function FunnelTabs({ active }: { active: FnTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {FN_TABS.map((tab) => (
        <Link
          key={tab}
          to={TAB_HREF[tab]}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            active === tab ? "border border-line bg-paper font-semibold text-ink" : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
}
