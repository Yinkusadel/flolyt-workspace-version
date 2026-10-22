import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type HandoffTab = "owed-by-me" | "owed-to-me" | "every-chain" | "overdue";

/**
 * Shared 4-tab filter row across H02/H03/H10. "Owed by me" and "Owed to me"
 * both land on `/handoff?owner=me` — that single built page (H03) already
 * shows both directions ("You owe" and "Owed to you"), and no separate
 * screen exists for an "owed to me only" view, so both tabs point at the
 * one real destination rather than one of them going nowhere.
 */
const TABS: { key: HandoffTab; label: string; count: number; href: string }[] = [
  { key: "owed-by-me", label: "Owed by me", count: 3, href: "/handoff?owner=me" },
  { key: "owed-to-me", label: "Owed to me", count: 2, href: "/handoff?owner=me" },
  { key: "every-chain", label: "Every chain", count: 6, href: "/handoff" },
  { key: "overdue", label: "Overdue", count: 9, href: "/handoff?state=overdue" },
];

export function HandoffTabs({ active }: { active: HandoffTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          to={tab.href}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            active === tab.key
              ? "border border-line bg-paper font-semibold text-ink"
              : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          {tab.label} · {tab.count}
        </Link>
      ))}
    </div>
  );
}
