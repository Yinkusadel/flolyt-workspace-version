import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { TM_TABS, type TmTab } from "@/pages/agents/ai-teammates/data";

const TAB_HREF: Record<TmTab, string> = {
  "The roster": "/ai-teammates",
  "Reading now": "/ai-teammates/runs",
  Coverage: "/ai-teammates/coverage",
  Disagreements: "/ai-teammates/conflicts",
  Paused: "/ai-teammates/paused",
  "What they cost": "/ai-teammates/cost",
};

/** Shared 6-tab bar across the /ai-teammates index's "full" state and its sibling routes. "Their record" (/ai-teammates/record) grounds itself in "The roster" rather than owning a tab, same as the export's own subtabs() call on TM12. */
export function TeammatesTabs({ active }: { active: TmTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {TM_TABS.map((tab) => (
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
