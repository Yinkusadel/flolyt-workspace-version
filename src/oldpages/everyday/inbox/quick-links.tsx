import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const INBOX_TABS = [
  { label: "Overview", to: "/inbox", exact: true },
  { label: "Replies", to: "/inbox/replies", exact: false },
  { label: "Routing", to: "/inbox/routing", exact: false },
  { label: "Snoozed", to: "/inbox/snoozed", exact: false },
  { label: "Systems", to: "/inbox/systems", exact: false },
  { label: "While away", to: "/inbox/delegation", exact: false },
];

/** The Inbox section's own tab bar, shown below the header on every /inbox page — otherwise
 * replies/routing/snoozed/systems/delegation have no in-app path leading to each other. Active tab is
 * derived from the current path, same as ScopeTabs on What to do today; Overview covers the root
 * page so there is always exactly one active tab. */
export function InboxTabs() {
  const { pathname } = useLocation();

  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {INBOX_TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.to : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
                active ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-ink-3 hover:text-ink-2"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Link into /settings/inbox, styled to sit alongside a state's other header actions. */
export function InboxSettingsLink() {
  return (
    <Link
      to="/settings/inbox"
      aria-label="Inbox settings"
      className="flex shrink-0 items-center gap-1 rounded-panel border border-line bg-paper px-3 py-1.5 text-[11.5px] font-medium text-ink-2 hover:border-ink-4"
    >
      <Settings className="size-3" aria-hidden />
      Settings
    </Link>
  );
}
