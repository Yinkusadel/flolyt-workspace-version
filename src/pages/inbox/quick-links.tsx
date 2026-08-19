import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

/** Cross-links into the rest of the Inbox section, shown at the top of every /inbox state — otherwise
 * replies/routing/snoozed/systems/delegation/settings have no in-app path leading to them. */
export function InboxQuickLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line pb-3 text-[11px] text-ink-3">
      <Link to="/inbox/replies" className="hover:text-ink">
        Replies
      </Link>
      <span className="text-ink-4">·</span>
      <Link to="/inbox/routing" className="hover:text-ink">
        Routing
      </Link>
      <span className="text-ink-4">·</span>
      <Link to="/inbox/snoozed" className="hover:text-ink">
        Snoozed
      </Link>
      <span className="text-ink-4">·</span>
      <Link to="/inbox/systems" className="hover:text-ink">
        Systems
      </Link>
      <span className="text-ink-4">·</span>
      <Link to="/inbox/delegation" className="hover:text-ink">
        While away
      </Link>
      <Link to="/settings/inbox" className="ml-auto flex items-center gap-1 hover:text-ink" aria-label="Inbox settings">
        <Settings className="size-3" aria-hidden />
        Settings
      </Link>
    </div>
  );
}
