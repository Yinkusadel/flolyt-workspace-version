import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export interface UnderlineTab {
  key: string;
  label: string;
  /** Where the tab links to; the active tab lives in the URL. */
  to: string;
  /** Optional count badge, hidden when null or 0. */
  badge?: number | null;
}

/**
 * The app's underline tab bar (What to do today's ScopeTabs style): scrolls sideways on narrow
 * screens instead of wrapping, each tab is a link, and an optional count badge sits after the label.
 */
export function UnderlineTabs({ tabs, active }: { tabs: UnderlineTab[]; active: string }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1" role="tablist">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.to}
            role="tab"
            aria-selected={active === tab.key}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] leading-4 font-semibold text-primary-foreground">
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
