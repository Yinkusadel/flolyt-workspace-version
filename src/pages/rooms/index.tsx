import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";

import { useGetConveningProposals } from "@/features/rooms/use-get-convening-proposals";
import ConveningTab from "@/pages/rooms/convening";
import DissentTab from "@/pages/rooms/dissent";
import MyLoadTab from "@/pages/rooms/my-load";
import RoomsListTab from "@/pages/rooms/rooms-list-tab";

type RoomsTab = "rooms" | "convening" | "dissent" | "my-load" | "admin";

const TABS: { key: RoomsTab; label: string }[] = [
  { key: "rooms", label: "Rooms" },
  { key: "convening", label: "Convening" },
  { key: "dissent", label: "Dissent" },
  { key: "my-load", label: "My load" },
  { key: "admin", label: "Admin" },
];

const isTab = (value: string | null): value is RoomsTab => TABS.some((tab) => tab.key === value);

function RoomsTabBar({ active, conveningWaiting }: { active: RoomsTab; conveningWaiting: number | null }) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1" role="tablist">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.key === "rooms" ? "/rooms" : `/rooms?tab=${tab.key}`}
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
            {tab.key === "convening" && conveningWaiting !== null && conveningWaiting > 0 && (
              <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] leading-4 font-semibold text-primary-foreground">
                {conveningWaiting}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Shown for tabs whose screens are not built yet, so no tab is a dead link. */
function ComingNext({ label }: { label: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">{label} is being rebuilt</p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">This tab arrives in the next step of the Rooms rebuild.</p>
    </div>
  );
}

/**
 * `/rooms`: the Rooms page. Rooms, Convening, Dissent, My load and Admin are tabs inside it,
 * the active one lives in the URL (`?tab=`). Each tab renders its own H1 and description.
 */
const Rooms = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const active: RoomsTab = isTab(tabParam) ? tabParam : "rooms";

  // Same query (and key) the Convening tab reads, so the badge costs no extra request.
  const convening = useGetConveningProposals({ includeDecided: true });
  const conveningWaiting = convening.data ? convening.data.data.waiting.length : null;

  return (
    <div className="space-y-6">
      <RoomsTabBar active={active} conveningWaiting={conveningWaiting} />
      {active === "rooms" && <RoomsListTab />}
      {active === "convening" && <ConveningTab />}
      {active === "dissent" && <DissentTab />}
      {active === "my-load" && <MyLoadTab />}
      {active === "admin" && <ComingNext label="Admin" />}
    </div>
  );
};

export default Rooms;
