import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { getRoomIndex, getRoomListCounts, SAVED_VIEWS } from "@/pages/everyday/rooms/data";
import { EMPTY_STATE_SOURCES, OTHER_STATES_EXPLAINERS } from "@/pages/everyday/rooms/index-content";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import type { RoomListRow, RoomListState } from "@/pages/everyday/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const SOURCE_STATE_TONE: Record<string, string> = {
  reading: "border-ultra-border bg-ultra-bg text-ultra",
  done: "border-teal-border bg-teal-bg text-teal",
  "not-connected": "border-amber-border bg-amber-bg text-amber",
};

function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Nothing open · three sources still reading · first room expected this afternoon
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/rooms/new">New room</Link>
        </Button>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">No rooms yet</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Agents are reading your sources now. Most rooms open on their own within a few hours of a source finishing
          its first read — you should not have to go looking for the first one.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/rooms/new">Open one yourself</Link>
          </Button>
          <Button variant="outline">See what agents watch</Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          You do not need to create a room to get value. Most people here never create one.
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is happening while you wait
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Rows read</th>
                <th className={cn(HEAD_CLASS, "text-right")}>First full read</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Agents waiting on it</th>
              </tr>
            </thead>
            <tbody>
              {EMPTY_STATE_SOURCES.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.source}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex rounded-chip border px-2 py-0.5 text-[9.5px] font-semibold",
                        SOURCE_STATE_TONE[row.state]
                      )}
                    >
                      {row.stateLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.rowsRead}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.firstFullRead}</td>
                  <td className="px-4 py-3 text-right text-ink-2">{row.waitingOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            An empty screen with a finish time is not the same as an empty screen
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            This state lasts one afternoon and then never returns. It says what is happening, when it ends, and what
            you can do meanwhile — none of which is "check back later". The two unconnected sources are named
            because they will block specific agents, not as a generic setup nag.
          </p>
        </div>
      </div>
    </div>
  );
}

function firstRoomBanner(rooms: RoomListRow[]) {
  const room = rooms[0];
  return (
    <div className="rounded-card border-2 border-ultra-border bg-ultra-bg p-5">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink">
          {room.working[0]?.name} opened your first room, 41 minutes after finishing its first read
        </p>
        <p className="mt-1.5 text-[11px] text-ink-2">
          Nobody asked it to. It read the customer base, found a cohort behaving differently from every cohort
          before it, and opened a room about it.
        </p>
        <p className="mt-1 text-[11px] text-ink-2">
          The room has no owner yet. It will keep working either way — it just cannot act on anything without one.
        </p>
        <div className="mt-3 flex gap-2.5">
          <Button asChild size="sm">
            <Link to={`/rooms/${room.id}`}>Open the room</Link>
          </Button>
          <Button variant="outline" size="sm">
            Assign an owner
          </Button>
        </div>
      </div>
    </div>
  );
}

function StateTabs({ counts, active }: { counts: Record<RoomListState, number>; active: RoomListState }) {
  const tabs: { key: RoomListState; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "recovering", label: "Recovering" },
    { key: "stale", label: "Stale" },
    { key: "archived", label: "Archived" },
  ];
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.key === "open" ? "/rooms" : `/rooms?state=${tab.key}`}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {counts[tab.key]}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RoomTableRow({ room }: { room: RoomListRow }) {
  return (
    <tr key={room.id} className="border-b border-line last:border-0 hover:bg-paper-2">
      <td className="px-4 py-3.5">
        <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
          {room.title}
        </Link>
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="inline-flex rounded-chip border border-line bg-paper-2 px-2 py-0.5 text-[10.5px] font-medium text-ink-3">
          {room.condition}
        </span>
      </td>
      <td className="px-4 py-3.5 font-mono whitespace-nowrap text-ink">{room.population}</td>
      <td
        className={cn(
          "px-4 py-3.5 font-mono font-semibold whitespace-nowrap",
          room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
        )}
      >
        {room.atRisk}
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        {room.owner ? (
          <div className="flex items-center gap-1.5">
            <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
            <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
          </div>
        ) : (
          <Chip tone="amber">No owner</Chip>
        )}
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex -space-x-1.5">
          {room.working.map((agent) => (
            <ActorAvatar key={agent.initials} actor={{ kind: "agent", agent }} size="sm" />
          ))}
        </div>
      </td>
      <td
        className={cn(
          "px-4 py-3.5 text-right font-mono whitespace-nowrap",
          room.lastTone ? TONE_TEXT_CLASS[room.lastTone] : "text-ink-4"
        )}
      >
        {room.last}
      </td>
      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <Chip tone={room.stateTone}>{room.stateLabel}</Chip>
      </td>
    </tr>
  );
}

function MainTable({ rooms }: { rooms: RoomListRow[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[900px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD_CLASS}>Room</th>
            <th className={HEAD_CLASS}>Condition</th>
            <th className={HEAD_CLASS}>Population</th>
            <th className={HEAD_CLASS}>At risk</th>
            <th className={HEAD_CLASS}>Owner</th>
            <th className={HEAD_CLASS}>Working</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Last</th>
            <th className={cn(HEAD_CLASS, "text-right")}>State</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <RoomTableRow key={room.id} room={room} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaleTable({ rooms }: { rooms: RoomListRow[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[860px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD_CLASS}>Room</th>
            <th className={HEAD_CLASS}>At risk</th>
            <th className={HEAD_CLASS}>Untouched</th>
            <th className={HEAD_CLASS}>Owner</th>
            <th className={HEAD_CLASS}>Why it stopped</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Suggested</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b border-line last:border-0 hover:bg-paper-2">
              <td className="px-4 py-3.5">
                <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
                  {room.title}
                </Link>
              </td>
              <td
                className={cn(
                  "px-4 py-3.5 font-mono whitespace-nowrap",
                  room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
                )}
              >
                {room.atRisk}
              </td>
              <td className="px-4 py-3.5 font-mono whitespace-nowrap text-rose">{room.untouchedDays} days</td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                {room.owner ? (
                  <div className="flex items-center gap-1.5">
                    <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
                    <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
                  </div>
                ) : (
                  <Chip tone="amber">No owner</Chip>
                )}
              </td>
              <td className="px-4 py-3.5 text-ink-2">{room.whyStopped}</td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                {room.suggested && <Chip tone={room.suggested.tone}>{room.suggested.label}</Chip>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StateExplainers() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OTHER_STATES_EXPLAINERS.map((card) => (
        <div key={card.eyebrow} className="flex flex-col justify-between rounded-card border border-line bg-paper p-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              {card.eyebrow}
            </p>
            <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.heading}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
          </div>
          <p className={cn("mt-3 border-t border-line pt-2.5 text-[10px] font-semibold", TONE_TEXT_CLASS[card.tone])}>
            {card.tag}
          </p>
        </div>
      ))}
    </div>
  );
}

function SearchView({ q, rooms }: { q: string; rooms: RoomListRow[] }) {
  const filtered = rooms.filter((r) =>
    [r.title, r.condition, r.stage, r.market].filter(Boolean).some((v) => v!.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {rooms.length} open across every team · searching "{q}"
          </p>
        </div>
        <Button className="shrink-0">Save this view</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center rounded-control border-2 border-line bg-paper px-3.5 py-2">
          <span className="text-[12px] font-semibold text-ink">{q}</span>
          <span className="ml-auto font-mono text-[10px] text-ink-4">{filtered.length} rooms</span>
        </div>
        <Chip tone="neutral">Mine</Chip>
        <Chip tone="ultra">Open</Chip>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Saved views · yours, and your team's
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SAVED_VIEWS.map((view) => (
            <button
              key={view.label}
              type="button"
              className={cn(
                "rounded-card border p-3.5 text-left",
                view.active ? "border-2 border-ultra-border bg-paper" : "border-line bg-paper"
              )}
            >
              <p className="text-[11.5px] font-semibold text-ink">{view.label}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-4">{view.count} rooms</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {filtered.length} results
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Stage</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Market</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At risk</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Last activity</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((room) => (
                <tr key={room.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3.5">
                    <Link to={`/rooms/${room.id}`} className="font-semibold whitespace-nowrap text-ultra hover:underline">
                      {room.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-ink-2">{room.stage}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{room.market}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono",
                      room.atRiskTone ? TONE_TEXT_CLASS[room.atRiskTone] : "text-ink"
                    )}
                  >
                    {room.atRisk}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {room.owner ? (
                      <div className="flex items-center gap-1.5">
                        <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
                        <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <Chip tone="amber">No owner</Chip>
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono",
                      room.lastTone ? TONE_TEXT_CLASS[room.lastTone] : "text-ink-4"
                    )}
                  >
                    {room.last}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Chip tone={room.stateTone}>{room.stateLabel}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Every filter is in the URL, so a filtered view is a link</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            The index is a search surface first and a list second — "Kenya, unowned, above ₦25M" is something you
            paste into Slack rather than describe.
          </p>
        </div>
      </div>
    </div>
  );
}

/** R01–R05 — the Rooms index. All five states share one route (`/rooms`), branching on data shape and `?q=`/`?state=`. */
const Rooms = () => {
  const [searchParams] = useSearchParams();
  const rooms = getRoomIndex();
  const counts = getRoomListCounts();
  const q = searchParams.get("q");
  const state = (searchParams.get("state") as RoomListState | null) ?? "open";

  if (rooms.length === 0) {
    return <EmptyState />;
  }

  if (rooms.length === 1 && !rooms[0].owner) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
            <p className="mt-1 text-[11.5px] text-ink-3">One room · opened by an agent · nobody assigned</p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/rooms/new">New room</Link>
          </Button>
        </div>
        {firstRoomBanner(rooms)}
      </div>
    );
  }

  if (q) {
    return <SearchView q={q} rooms={rooms} />;
  }

  const shown = rooms.filter((r) => r.listState === state);
  const needsYou = rooms.filter((r) => r.listState === "open" && r.stateLabel === "needs you").length;
  const unowned = rooms.filter((r) => r.listState === "open" && !r.owner).length;
  const agentOpened = rooms.filter((r) => r.listState === "open" && !r.owner).length;

  const staleStats: Kpi[] =
    state === "stale"
      ? [
          { eyebrow: "Untouched 14+ days", value: `${counts.stale} rooms`, tone: "amber" },
          { eyebrow: "Revenue behind them", value: "sitting, not leaking faster", tone: "amber" },
          { eyebrow: "With no owner", value: `${shown.filter((r) => !r.owner).length}`, tone: "rose" },
          {
            eyebrow: "Oldest",
            value: `${Math.max(...shown.map((r) => r.untouchedDays ?? 0), 0)} days`,
            tone: "rose",
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {counts.open} open · {agentOpened} opened by agents · {unowned} with no owner
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/rooms/new">New room</Link>
        </Button>
      </div>

      <StateTabs counts={counts} active={state} />

      {state === "stale" && (
        <>
          <KpiCards items={staleStats} />
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Why each one stopped, which is not the same question as who to blame
          </p>
          <StaleTable rooms={shown} />
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            The other two states, and what they mean
          </p>
          <StateExplainers />
        </>
      )}

      {state !== "stale" && (
        <>
          <MainTable rooms={shown} />
          {state === "open" && (
            <div className="grid grid-cols-1 gap-y-2 rounded-card border border-line bg-paper p-4 text-[11.5px] sm:grid-cols-2">
              <p className="text-ink-2">Opened by an agent</p>
              <p className="text-right font-mono text-ink-4">
                {agentOpened} of {counts.open} · you will rarely create one yourself
              </p>
              <p className="text-ink-2">Needing a decision from someone</p>
              <p className="text-right font-mono text-amber">{needsYou} · shown as the amber badge in the sidebar</p>
              <p className="text-ink-2">With no owner</p>
              <p className="text-right font-mono text-rose">{unowned}</p>
              <p className="text-ink-2">Median time from opening to a decision</p>
              <p className="text-right font-mono text-teal">3.1 hrs · was 2 days in January</p>
            </div>
          )}
          {(state === "recovering" || state === "archived") && <StateExplainers />}
        </>
      )}

      {state === "open" && (
        <div className="rounded-card border border-line bg-paper-2 p-4">
          <div>
            <p className="text-[12px] font-semibold text-ink">A room is about a cohort, not a customer</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
              Every row is a condition a group of people is in — not an account, not a ticket, not a campaign. That
              is what lets several teams work in one place without wondering why they were invited.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
