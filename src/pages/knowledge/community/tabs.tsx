import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { CM_TABS, type CmTab } from "@/pages/knowledge/community/data";

const TAB_HREF: Record<CmTab, string> = {
  Methods: "/community",
  Constraints: "/community/constraints",
  Questions: "/community/questions",
  "What leaves": "/community/outbound",
  Yours: "/community/yours",
};

/** Shared 5-tab bar across the /community index's "Methods" state and its four standalone sibling routes. */
export function CommunityTabs({ active }: { active: CmTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {CM_TABS.map((tab) => (
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
