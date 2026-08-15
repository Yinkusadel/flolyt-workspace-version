import * as React from "react";
import { MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { AccountBody } from "@/pages/rooms/room/decision/account-body";
import { DecisionDoc } from "@/pages/rooms/room/decision/decision-doc";
import { PlayBoard } from "@/pages/rooms/room/decision/play-board";
import { RoomArchivedState, RoomEmptyState, RoomRecoveringState } from "@/pages/rooms/room/decision/room-states";
import { RunStatusBar } from "@/pages/rooms/room/decision/run-status-bar";
import { ThreadRail } from "@/pages/rooms/room/decision/thread";
import type { RoomDetail, RunStatusData } from "@/pages/rooms/types";

/**
 * The collapsed thread rail on a persistent room (screen 31) — expands into
 * the full live thread. A side rail makes sense at desktop widths, but a
 * 46-300px vertical strip squeezed next to the account body doesn't work on
 * a phone, so below lg this renders as a full-width horizontal bar instead.
 */
function ThreadDrawer({ room }: { room: RoomDetail }) {
  const [open, setOpen] = React.useState(false);

  if (open) {
    return (
      <ThreadRail
        entries={room.thread ?? []}
        peopleCount={room.humans.length}
        agentsCount={room.agents.length}
        className="max-h-[60vh] w-full border-t border-line lg:h-full lg:max-h-none lg:w-[300px] lg:shrink-0 lg:border-t-0 lg:border-l"
        footer={
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full px-3.5 py-2.5 text-center text-[11px] font-semibold text-ink-3 hover:text-ink"
          >
            Collapse thread
          </button>
        }
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "flex shrink-0 items-center gap-2.5 border-t border-line bg-paper-2 px-4 py-2.5 hover:bg-paper",
        "lg:w-[46px] lg:flex-col lg:gap-3 lg:border-t-0 lg:border-l lg:px-0 lg:pt-4"
      )}
      aria-label="Open thread"
    >
      <MessagesSquare className="size-3.5 shrink-0 text-ink-3" />
      <span className="text-[11px] font-semibold tracking-[0.5px] text-ink-2 lg:[writing-mode:vertical-rl] lg:text-[10.5px]">
        THREAD
      </span>
      {!!room.threadDrawerUnread && (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-ultra font-mono text-[9px] font-semibold text-white lg:order-first">
          {room.threadDrawerUnread}
        </span>
      )}
    </button>
  );
}

export function DecisionTab({ room }: { room: RoomDetail }) {
  const [run, setRun] = React.useState<RunStatusData | undefined>(room.runStatus);

  const onStop = () => {
    setRun((r) => (r ? { ...r, state: "cancelRequested" } : r));
    window.setTimeout(() => setRun((r) => (r ? { ...r, state: "cancelled", detail: "" } : r)), 1200);
  };
  const onRedirect = (message: string) => {
    setRun((r) => (r ? { ...r, queuedSteering: message } : r));
  };

  if (room.kind === "persistent") {
    return (
      <div className="flex flex-col lg:h-full lg:min-h-0 lg:flex-row">
        <AccountBody
          posture={room.revenuePosture ?? []}
          decisionsLogged={room.decisionsLogged ?? []}
          memory={room.memory ?? []}
        />
        <ThreadDrawer room={room} />
      </div>
    );
  }

  if (room.status === "empty") {
    return <RoomEmptyState prompts={room.emptyPrompts ?? []} />;
  }
  if (room.status === "recovering" && room.recovering) {
    return <RoomRecoveringState summary={room.recovering} />;
  }
  if (room.status === "archived" && room.archived) {
    return <RoomArchivedState summary={room.archived} />;
  }

  return (
    <div className="flex flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
      {/* Below lg, Thread and Plays become bounded, independently-scrolling
          panels (like cards) so a long thread can't push the rest of the
          room off screen; Decision doc flows with the page like normal
          content. At lg+ all three become equal-height grid columns. */}
      <ThreadRail
        entries={room.thread ?? []}
        peopleCount={room.humans.length}
        agentsCount={room.agents.length}
        className={cn("max-h-[60vh] border-b border-line lg:h-full lg:max-h-none lg:border-r lg:border-b-0")}
        footer={run && <RunStatusBar run={run} onStop={onStop} onRedirect={onRedirect} />}
      />
      {room.decisionDoc ? (
        <DecisionDoc doc={room.decisionDoc} className="border-b border-line lg:h-full lg:border-r lg:border-b-0" />
      ) : (
        <div className="flex items-center justify-center p-10 text-[12px] text-ink-4">
          Nothing needs a decision right now.
        </div>
      )}
      <PlayBoard
        proposals={room.proposals ?? []}
        plays={room.plays ?? []}
        count={room.counts.plays}
        className="max-h-[60vh] border-t border-line lg:h-full lg:max-h-none lg:border-t-0"
      />
    </div>
  );
}
