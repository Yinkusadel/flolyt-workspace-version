import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { FC_TABS, type FcTab } from "@/pages/revenue/forecast/data";

const TAB_HREF: Record<FcTab, string> = {
  "Next 90 days": "/forecast",
  "By stage": "/forecast?by=stage",
  "By market": "/forecast?by=market",
  Blocked: "/forecast/blocked",
  "Against actuals": "/forecast/actuals",
  History: "/forecast/history",
};

/** Shared 6-tab bar across the /forecast index's "Next 90 days" state and its five sibling views — two reached by query param, three by sibling route. */
export function ForecastTabs({ active }: { active: FcTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {FC_TABS.map((tab) => (
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
