import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type AuthorityTab = "thresholds" | "standing";

/** Shared 2-tab bar across I11/I12. The export's own tab bar also shows "Escalation" and "Recent",
 * but neither screen for those tabs exists in this design source, so they are left out rather than
 * built as dangling nav. */
const TABS: { key: AuthorityTab; label: string; href: string }[] = [
  { key: "thresholds", label: "Thresholds", href: "/settings/authority" },
  { key: "standing", label: "Standing authority", href: "/settings/authority/standing" },
];

export function AuthorityTabs({ active }: { active: AuthorityTab }) {
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
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
