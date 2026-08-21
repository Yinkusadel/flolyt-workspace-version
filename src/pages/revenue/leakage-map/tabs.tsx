import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { LK_TABS, type LkTab } from "@/pages/revenue/leakage-map/data";

const TAB_HREF: Record<LkTab, string> = {
  "The map": "/leakage-map",
  "By market": "/leakage-map?by=market",
  "By claim": "/leakage-map?by=claim",
  "What changed": "/leakage-map/changed",
  Unmeasurable: "/leakage-map/unmeasurable",
  Detection: "/leakage-map/detection",
};

/** Shared 6-tab bar across LK03/05/06/07/09/11/12/13 — spans both the /leakage-map index's query-param states and its three standalone sibling routes. */
export function LeaksTabs({ active }: { active: LkTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {LK_TABS.map((tab) => (
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
