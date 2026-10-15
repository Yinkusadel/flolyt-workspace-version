import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type ChainTab = "chain" | "obligations";

/**
 * H05's own tab bar shows three tabs (The chain / Obligations / Timeline),
 * but no screen in this export backs a separate "Timeline" view — "The
 * chain" tab (H04) already is a dated timeline. Left out rather than built
 * as dangling nav, same call as Inbox's authority-tabs dropping
 * Escalation/Recent.
 */
const TABS: { key: ChainTab; label: string }[] = [
  { key: "chain", label: "The chain" },
  { key: "obligations", label: "Obligations" },
];

export function ChainTabs({ chainId, active }: { chainId: string; active: ChainTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          to={tab.key === "chain" ? `/handoff/${chainId}` : `/handoff/${chainId}/obligations`}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            active === tab.key
              ? "border border-line bg-paper font-semibold text-ink"
              : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
