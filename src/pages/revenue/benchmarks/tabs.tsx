import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { BM_TABS, type BmTab } from "@/pages/revenue/benchmarks/data";

const TAB_HREF: Record<BmTab, string> = {
  "Our own past": "/benchmarks",
  "Market vs market": "/benchmarks?by=market",
  "Stage vs stage": "/benchmarks?by=stage",
  "Against a holdout": "/benchmarks/holdouts",
  "Not compared": "/benchmarks/refused",
};

/** Shared 5-tab bar across the /benchmarks index's "Our own past" state and its four sibling views — two reached by query param, two by sibling route. */
export function BenchmarksTabs({ active }: { active: BmTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {BM_TABS.map((tab) => (
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
