import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AN_TABS, type AnTab } from "@/pages/agents/agent-detail/data";

const TAB_HREF: Record<AnTab, string> = {
  Overview: "/agent-detail",
  "What it watches": "/agent-detail/conditions",
  "What it reads": "/agent-detail/sources",
  Findings: "/agent-detail/findings",
  Runs: "/agent-detail/runs",
  Record: "/agent-detail/record",
};

/** Shared 6-tab bar across every tab route in this section. */
export function AgentDetailTabs({ active }: { active: AnTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {AN_TABS.map((tab) => (
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
