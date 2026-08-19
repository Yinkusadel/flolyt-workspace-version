import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { TODAY_TAB_COUNTS } from "@/pages/everyday/what-to-do-today/data";

export type ScopeTab = "mine" | "team" | "goal" | "org";

export function ScopeTabs({ active }: { active: ScopeTab }) {
  const tabs: { key: ScopeTab; label: string; count: number; to: string }[] = [
    { key: "mine", label: "Mine", count: TODAY_TAB_COUNTS.mine, to: "/what-to-do-today" },
    { key: "team", label: "My team", count: TODAY_TAB_COUNTS.myTeam, to: "/what-to-do-today?scope=team" },
    { key: "goal", label: "Blocking a goal", count: TODAY_TAB_COUNTS.blockingGoal, to: "/what-to-do-today?filter=goal" },
    { key: "org", label: "Everything", count: TODAY_TAB_COUNTS.everything, to: "/what-to-do-today?scope=org" },
  ];
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.to}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>
    </div>
  );
}
