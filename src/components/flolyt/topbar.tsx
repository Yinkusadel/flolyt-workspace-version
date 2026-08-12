import * as React from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar, type PersonAvatarProps } from "@/components/flolyt/person-avatar";

/**
 * Layout reference: files (24)/flolyt-figma-559-screens/frames/555-design-system-layout.svg
 * Top bar region is 54px (--spacing-topbar / h-topbar) and holds breadcrumb, presence and
 * actions — never navigation, which belongs to the sidebar.
 */

export type PresenceEntry = Pick<PersonAvatarProps, "initials" | "kind" | "team">;

export type TopbarProps = {
  breadcrumb: React.ReactNode;
  /** Who's currently here. Omit/empty hides the strip — never fake presence. */
  presence?: PresenceEntry[];
  /** Screen-specific buttons rendered before the presence strip. */
  actions?: React.ReactNode;
  /** Opens the sidebar drawer below the lg breakpoint. */
  onMenuClick: () => void;
  className?: string;
};

function Topbar({ breadcrumb, presence = [], actions, onMenuClick, className }: TopbarProps) {
  return (
    <header
      data-slot="topbar"
      className={cn(
        "sticky top-0 z-30 flex h-topbar shrink-0 items-center gap-3 border-b border-line bg-paper px-page",
        className
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="-ml-1.5 flex size-8 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-[18px]" />
      </button>

      <div className="min-w-0 flex-1 truncate text-[11px] text-ink-3">{breadcrumb}</div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}

      {presence.length > 0 && (
        <div className="flex shrink-0 -space-x-1.5">
          {presence.map((entry, i) => (
            <PersonAvatar
              key={`${entry.initials}-${i}`}
              initials={entry.initials}
              kind={entry.kind}
              team={entry.team}
              size="sm"
              className="ring-2 ring-paper"
            />
          ))}
        </div>
      )}
    </header>
  );
}

export { Topbar };
