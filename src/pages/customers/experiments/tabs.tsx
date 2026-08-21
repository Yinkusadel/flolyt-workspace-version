import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { EX_TABS, type ExTab } from "@/pages/customers/experiments/data";

const TAB_HREF: Record<ExTab, string> = {
  Running: "/experiments",
  Results: "/experiments/results",
  "Never included": "/experiments/excluded",
  Readability: "/experiments/readability",
  History: "/experiments/history",
};

/** Shared 5-tab bar across the /experiments index's "full" state and its four standalone sibling routes. */
export function ExperimentsTabs({ active }: { active: ExTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {EX_TABS.map((tab) => (
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
