import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { VL_TABS, type VlTab } from "@/pages/revenue/value/data";

const TAB_HREF: Record<VlTab, string> = {
  "The ledger": "/value",
  "By market": "/value?by=market",
  "By room": "/value?by=room",
  "What it cost": "/value/cost",
  Reconciliation: "/value/reconciliation",
  "For the board": "/value/board",
};

/** Shared 6-tab bar across VL03/04/05/07/08/09/10/11/12 — spans both the /value index's query-param states and its standalone sibling routes. */
export function ValueTabs({ active }: { active: VlTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {VL_TABS.map((tab) => (
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
