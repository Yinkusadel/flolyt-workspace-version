import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { RC_TABS, type RcTab } from "@/pages/knowledge/recognition/data";

const TAB_HREF: Record<RcTab, string> = {
  Recognised: "/recognition",
  Dissent: "/recognition/dissent",
  Contributions: "/recognition/contributions",
  "Quiet work": "/recognition/quiet",
  Yours: "/recognition?as=me",
};

/** Shared 5-tab bar across the /recognition index's "Recognised" state and its sibling routes. "Yours" is a query-param variant of the index (`?as=me`), not its own path — see RC11's own footer. */
export function RecognitionTabs({ active }: { active: RcTab }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {RC_TABS.map((tab) => (
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
