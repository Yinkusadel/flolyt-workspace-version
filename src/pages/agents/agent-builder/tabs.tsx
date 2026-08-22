import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AB_TABS, type AbTab } from "@/pages/agents/agent-builder/data";

const TAB_HREF: Record<AbTab, string> = {
  "Built here": "/agent-builder",
  "Waiting for approval": "/agent-builder/waiting-for-approval",
  "Test runs": "/agent-builder/test-runs",
  Retired: "/agent-builder/retired",
};

/** Shared 4-tab bar across the /agent-builder index's "full" state and its sibling routes. */
export function AgentBuilderTabs({ active }: { active: AbTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {AB_TABS.map((tab) => (
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
