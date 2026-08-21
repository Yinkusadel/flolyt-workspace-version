import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { BM_TABS, type BmTab } from "@/pages/knowledge/business-memory/data";

const TAB_HREF: Record<BmTab, string> = {
  Learnings: "/business-memory",
  Constraints: "/business-memory/constraints",
  Superseded: "/business-memory/superseded",
  Challenged: "/business-memory/challenged",
  "Open questions": "/business-memory/questions",
  "Due for review": "/business-memory/review",
};

/** Shared 6-tab bar across the /business-memory index's "full" state and its five standalone sibling routes. */
export function BusinessMemoryTabs({ active }: { active: BmTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {BM_TABS.map((tab) => (
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
