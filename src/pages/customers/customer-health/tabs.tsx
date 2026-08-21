import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { HL_TABS, type HlTab } from "@/pages/customers/customer-health/data";

const TAB_HREF: Record<HlTab, string> = {
  Signals: "/customer-health",
  "By cohort": "/customer-health?by=cohort",
  Coverage: "/customer-health/coverage",
  "What changed": "/customer-health/changed",
  Thresholds: "/customer-health/thresholds",
};

/** Shared 5-tab bar across the /customer-health index's "full" state and its standalone sibling routes. */
export function HealthTabs({ active }: { active: HlTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {HL_TABS.map((tab) => (
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
