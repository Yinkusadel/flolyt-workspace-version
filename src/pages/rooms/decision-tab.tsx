import * as React from "react";
import { MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { AccountBody } from "@/pages/rooms/account-body";
import { DecisionDoc } from "@/pages/rooms/decision-doc";
import { PlayBoard } from "@/pages/rooms/play-board";
import { RoomArchivedState, RoomEmptyState, RoomRecoveringState } from "@/pages/rooms/room-states";
import { RunStatusBar } from "@/pages/rooms/run-status-bar";
import { ThreadRail } from "@/pages/rooms/thread";
import type { RoomDetail, RunStatusData } from "@/pages/rooms/types";

/** The collapsed thread rail on a persistent room (screen 31) — expands into the full live thread. */
function ThreadDrawer({ room }: { room: RoomDetail }) {
  const [open, setOpen] = React.useState(false);

  if (open) {
    return (
      <ThreadRail
        entries={room.thread ?? []}
        peopleCount={room.humans.length}
        agentsCount={room.agents.length}
        className="w-[300px] shrink-0 border-l border-line"
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
      className="flex w-[46px] shrink-0 flex-col items-center gap-3 border-l border-line bg-paper-2 pt-4 hover:bg-paper"
      aria-label="Open thread"
    >
      {!!room.threadDrawerUnread && (
        <span className="flex size-4.5 items-center justify-center rounded-full bg-ultra font-mono text-[9px] font-semibold text-white">
          {room.threadDrawerUnread}
        </span>
      )}
      <MessagesSquare className="size-3.5 text-ink-3" />
      <span className="[writing-mode:vertical-rl] text-[10.5px] font-semibold tracking-[0.5px] text-ink-2">
        THREAD
      </span>
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
      <div className="flex h-full min-h-0">
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
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
      <ThreadRail
        entries={room.thread ?? []}
        peopleCount={room.humans.length}
        agentsCount={room.agents.length}
        className={cn("border-b border-line lg:border-r lg:border-b-0")}
        footer={run && <RunStatusBar run={run} onStop={onStop} onRedirect={onRedirect} />}
      />
      {room.decisionDoc ? (
        <DecisionDoc doc={room.decisionDoc} className="border-b border-line lg:border-r lg:border-b-0" />
      ) : (
        <div className="flex items-center justify-center p-10 text-[12px] text-ink-4">
          Nothing needs a decision right now.
        </div>
      )}
      <PlayBoard proposals={room.proposals ?? []} plays={room.plays ?? []} count={room.counts.plays} />
    </div>
  );
}
