import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AT_TABS, type AtTab } from "@/pages/revenue/attribution/data";

const TAB_HREF: Record<AtTab, string> = {
  Attributed: "/attribution",
  Holdouts: "/attribution/holdouts",
  Overlap: "/attribution/overlap",
  Unattributable: "/attribution/unattributable",
  Methods: "/attribution/methods",
};

/** Shared 5-tab bar across the /attribution index's "full" state and its four standalone sibling routes. */
export function AttributionTabs({ active }: { active: AtTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {AT_TABS.map((tab) => (
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
