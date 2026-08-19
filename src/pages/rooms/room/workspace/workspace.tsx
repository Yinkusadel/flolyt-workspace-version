import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { ActorAvatar, actorName } from "@/pages/rooms/actor";
import { WorkspaceHeader } from "@/pages/rooms/room/room-header";
import { TONE_BG_CLASS, TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { RoomDetail } from "@/pages/rooms/room/types";
import { CreateFromDecisionModal } from "@/pages/handoff/create-from-decision-modal";

type WorkspaceTab = "decision" | "evidence" | "log" | "steering";

// ---------------------------------------------------------------------------
// Left pane — Live thread (R12–R16, R18, R28's shared left panel)
// ---------------------------------------------------------------------------

function ThreadPanel({ room }: { room: RoomDetail }) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-[12px] font-semibold text-ink">Live thread</p>
        <p className="font-mono text-[10px] text-ink-4">
          {room.humans.length} people · {room.agentsChipCount} agents
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {room.thread?.map((entry) => {
          if (entry.kind === "system") {
            return (
              <div key={entry.id} className={cn("rounded-panel border px-3 py-2 text-[10.5px]", TONE_BG_CLASS[entry.tone], TONE_TEXT_CLASS[entry.tone])}>
                {entry.text}
              </div>
            );
          }
          return (
            <div key={entry.id} className="flex gap-2.5">
              <ActorAvatar actor={entry.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-[10.5px] font-semibold",
                      entry.actor.kind === "agent" ? "font-mono text-ultra" : "text-ink"
                    )}
                  >
                    {actorName(entry.actor)}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[9px] text-ink-4">{entry.time}</span>
                </div>
                {entry.lines.map((line, i) => (
                  <p key={i} className="mt-0.5 text-[11px] leading-relaxed text-ink-2">
                    {line}
                  </p>
                ))}
                {entry.chip && (
                  <div className="mt-1.5">
                    <Chip tone={entry.chip.tone}>{entry.chip.label}</Chip>
                  </div>
                )}
                {entry.toolCall && (
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[9.5px] text-ink-4">
                    <span className="size-1 rounded-full bg-ink-4" />
                    {entry.toolCall}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line px-4 py-2.5">
        {room.runStatus && (
          <p className="mb-2 flex items-center gap-1.5 text-[10.5px] text-ink-3">
            <span className={cn("size-1.5 rounded-full", room.runStatus.state === "working" ? "bg-ultra" : "bg-teal")} />
            {room.runStatus.state === "working" ? `Working — ${room.runStatus.detail}` : "Finished"}
          </p>
        )}
        <div className="flex items-center gap-2 rounded-control border border-line bg-paper-2 px-3 py-2">
          <span className="flex-1 text-[11px] text-ink-4">Ask, or redirect the agent…</span>
          <span className="font-mono text-[11px] text-ink-4">↵</span>
        </div>
        {room.runStatus?.queuedRedirect && (
          <p className="mt-2 rounded-panel border border-ultra-border bg-ultra-bg px-2.5 py-1.5 text-[10px] text-ultra">
            ⟳ {room.runStatus.queuedRedirect}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Center pane — Decision / Evidence / Log tabs, or Steering (R15/R16/R18/R28)
// ---------------------------------------------------------------------------

function DecisionPanelBody({ room }: { room: RoomDetail }) {
  const doc = room.decisionDoc;
  const [handoffOpen, setHandoffOpen] = React.useState(false);
  const showCreateHandoffs = room.id === "second-order-never-happened" && Boolean(doc?.decidedBy);
  if (!doc) {
    return (
      <div className="rounded-card border border-dashed border-line p-6 text-center">
        <p className="text-[12px] font-semibold text-ink">Nothing decided yet</p>
        <p className="mt-1 text-[10.5px] text-ink-3">An agent will draft this as it finds things.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">{doc.revisionLabel}</p>
        {doc.liveEditing && (
          <p className="font-mono text-[9.5px] text-amber">{doc.liveEditing.note}</p>
        )}
      </div>
      <p className="font-serif text-[14.5px] leading-relaxed text-ink" style={{ fontFamily: "Newsreader, serif" }}>
        {doc.statement}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <ActorAvatar actor={{ kind: "agent", agent: doc.draftedBy }} size="sm" />
          <span className="text-[10.5px] text-ink-3">drafted by {doc.draftedBy.name}</span>
        </div>
        {doc.decidedBy && (
          <div className="flex items-center gap-1.5">
            <ActorAvatar actor={{ kind: "human", person: doc.decidedBy.person }} size="sm" />
            <span className="text-[10.5px] text-ink-3">
              decided by {doc.decidedBy.person.name} · {doc.decidedBy.time}
            </span>
          </div>
        )}
        <Chip tone={doc.statusChip.tone}>{doc.statusChip.label}</Chip>
      </div>

      {showCreateHandoffs && (
        <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11.5px] font-semibold text-ink">This decision obliges four other teams</p>
              <p className="mt-0.5 text-[10px] text-ink-3">Repeat &amp; Decay drafted them from the decision doc</p>
            </div>
            <Button type="button" size="sm" onClick={() => setHandoffOpen(true)}>
              Create handoffs
            </Button>
          </div>
        </div>
      )}

      <div className="border-t border-line pt-3">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Guardrails</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{doc.guardrailsBody}</p>
      </div>

      {doc.suggestion && (
        <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
          <div className="flex items-center gap-1.5">
            <ActorAvatar actor={{ kind: "agent", agent: doc.suggestion.agent }} size="sm" />
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ultra uppercase">
              {doc.suggestion.agent.name} suggests
            </p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{doc.suggestion.body}</p>
          <div className="mt-2 flex gap-3">
            <button type="button" className="text-[10.5px] font-semibold text-ultra">
              Accept
            </button>
            <button type="button" className="text-[10.5px] text-ink-4">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">What would change this</p>
        <p className="mt-1.5 text-[11px] text-ink-2">{doc.whatWouldChange}</p>
      </div>

      <div className="border-t border-line pt-3">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Revisions</p>
        <div className="mt-2 space-y-2">
          {doc.revisions.map((rev) => (
            <div key={rev.id} className="flex items-center justify-between text-[10.5px]">
              <span className={cn("font-semibold", TONE_TEXT_CLASS[rev.nameTone])}>{rev.name}</span>
              <span className="text-ink-4">{rev.note}</span>
            </div>
          ))}
        </div>
      </div>

      {showCreateHandoffs && (
        <CreateFromDecisionModal open={handoffOpen} onOpenChange={setHandoffOpen} />
      )}
    </div>
  );
}

function EvidencePanelBody({ room }: { room: RoomDetail }) {
  return (
    <div className="space-y-4">
      {room.evidenceEyebrow && (
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">{room.evidenceEyebrow}</p>
      )}
      <div className="space-y-3">
        {room.evidenceClaims?.map((claim, i) => (
          <div key={i} className="rounded-card border border-line bg-paper p-3.5">
            <Chip tone={claim.chip.tone}>{claim.chip.label}</Chip>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{claim.body}</p>
            <p className={cn("mt-1.5 font-mono text-[9.5px]", TONE_TEXT_CLASS[claim.metaTone])}>{claim.meta}</p>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
        <p className="text-[11.5px] font-semibold text-ink">Three kinds of statement, never mixed</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
          A causal finding needs a dated change, a comparison group and a measured effect. An association has none
          of those and says so. Insufficient evidence is a value, and it names what would resolve it.
        </p>
      </div>
    </div>
  );
}

function LogPanelBody({ room }: { room: RoomDetail }) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
        Log · nothing here was ever a notification
      </p>
      <div className="space-y-2.5">
        {room.log?.map((row, i) => (
          <div key={i} className="flex items-start gap-3 text-[11px]">
            <span className="w-11 shrink-0 font-mono text-[9.5px] text-ink-4">{row.time}</span>
            <span
              className={cn(
                "w-28 shrink-0 font-semibold",
                row.actorTone === "ink" ? "text-ink-2" : TONE_TEXT_CLASS[row.actorTone]
              )}
            >
              {row.actor.kind === "system" ? row.actor.label : actorName(row.actor)}
            </span>
            <span className="min-w-0 flex-1 text-ink-2">{row.action}</span>
            <span
              className={cn(
                "shrink-0 font-mono text-[9.5px]",
                row.annotationTone === "ink" ? "text-ink-4" : TONE_TEXT_CLASS[row.annotationTone]
              )}
            >
              {row.annotation}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-line bg-paper-2 p-3.5">
        <p className="text-[11.5px] font-semibold text-ink">The log is not a feed</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
          An agent narrating its own tool calls never reaches your inbox. It lands here, where you go looking for it
          when a number needs explaining.
        </p>
      </div>
    </div>
  );
}

function SteeringPanelBody({ room }: { room: RoomDetail }) {
  const s = room.steering;
  if (!s) return null;
  return (
    <div className="space-y-4">
      <p className="flex items-center justify-between font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
        <span>What you can do to a running agent</span>
      </p>
      <div className="space-y-2.5">
        {s.actions.map((action) => (
          <div key={action.label} className="flex items-start gap-2.5">
            <Chip tone={action.tone}>{action.label}</Chip>
            <p className="text-[10.5px] text-ink-3">{action.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
        <p className="text-[11.5px] font-semibold text-ink">Redirects land between turns, never inside one</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
          An agent halfway through reading finishes that read before taking your instruction. Interrupting
          mid-tool-call would produce a partial table that looks like a complete one.
        </p>
      </div>
      <div className="border-t border-line pt-3">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">This run</p>
        <div className="mt-2 space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-ink-2">Turn</span><span className="font-mono text-ink">{s.turn}</span></div>
          <div className="flex justify-between"><span className="text-ink-2">Redirects queued</span><span className="font-mono text-ultra">{s.queued}</span></div>
          <div className="flex justify-between"><span className="text-ink-2">Applied at</span><span className="font-mono text-ink-4">{s.appliedAt}</span></div>
          <div className="flex justify-between"><span className="text-ink-2">Rows read so far</span><span className="font-mono text-ink">{s.rowsRead}</span></div>
          <div className="flex justify-between"><span className="text-ink-2">Elapsed</span><span className="font-mono text-ink-4">{s.elapsed}</span></div>
          <div className="flex justify-between"><span className="text-ink-2">Cost so far</span><span className="font-mono text-ink-4">{s.cost}</span></div>
        </div>
      </div>
    </div>
  );
}

const TAB_CLASS = (active: boolean) =>
  cn(
    "rounded-panel px-3 py-1.5 text-[11px]",
    active ? "bg-paper-2 font-semibold text-ink" : "font-normal text-ink-3 hover:text-ink-2"
  );

function CenterPanel({
  room,
  activeTab,
  onSteer,
}: {
  room: RoomDetail;
  activeTab: WorkspaceTab;
  onSteer?: (steering: boolean) => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-paper">
      {activeTab === "steering" ? (
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-[12px] font-semibold text-ink">Steering</p>
          <button type="button" onClick={() => onSteer?.(false)} className="text-[10.5px] font-semibold text-ink-4 hover:text-ink">
            Back to Decision
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line px-3 py-2">
          <Link to={`/rooms/${room.id}`} className={cn(TAB_CLASS(activeTab === "decision"), "shrink-0")}>
            Decision
          </Link>
          <Link to={`/rooms/${room.id}/evidence`} className={cn(TAB_CLASS(activeTab === "evidence"), "shrink-0")}>
            Evidence
          </Link>
          <Link to={`/rooms/${room.id}/log`} className={cn(TAB_CLASS(activeTab === "log"), "shrink-0")}>
            Log
          </Link>
          {room.steering && room.runStatus?.state === "working" && (
            <button
              type="button"
              onClick={() => onSteer?.(true)}
              className="ml-auto shrink-0 pl-3 text-[10.5px] font-semibold whitespace-nowrap text-ultra hover:underline"
            >
              Steer this agent →
            </button>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === "decision" && <DecisionPanelBody room={room} />}
        {activeTab === "evidence" && <EvidencePanelBody room={room} />}
        {activeTab === "log" && <LogPanelBody room={room} />}
        {activeTab === "steering" && <SteeringPanelBody room={room} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right pane — Plays (R15/R16/R18: full 4-card set · R28: blocked placeholder)
// ---------------------------------------------------------------------------

function PlaysPanel({ room, blocked }: { room: RoomDetail; blocked?: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <Link to={`/rooms/${room.id}/plays`} className="text-[12px] font-semibold text-ultra hover:underline">
          Plays
        </Link>
        <p className="font-mono text-[10px] text-ink-4">{room.playsCountLabel}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {blocked ? (
          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">
              Nothing new while a run is open
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              {room.decisionDoc?.draftedBy.name ?? "The lead agent"} will not propose a play until this run finishes
              and the attribution is settled.
            </p>
          </div>
        ) : (
          room.playsBoard?.slice(0, 4).map((play) => (
            <div
              key={play.id}
              className={cn(
                "rounded-card border p-3",
                play.stateLabel === "needs approval" ? "border-amber-border bg-amber-bg" : "border-line bg-paper"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("font-mono text-[8.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[play.stateTone])}>
                  {play.stateLabel}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] font-semibold text-ink">{play.title}</p>
              {play.stateLabel === "needs approval" ? (
                <div className="mt-2 flex gap-2">
                  <Button asChild size="xs">
                    <Link to={`/rooms/${room.id}/plays/${play.id}`}>Approve</Link>
                  </Button>
                  <Button asChild size="xs" variant="outline">
                    <Link to={`/rooms/${room.id}/plays/${play.id}`}>Edit</Link>
                  </Button>
                  <button type="button" className="text-[10.5px] text-ink-4">
                    Reject
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-[10px] text-ink-4">{play.effect}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

/** The persistent 3-pane room workspace — R12–R16, R18, R28. Steering (R28) is a local toggle, not a distinct route — its own footer reports the same `/rooms/:id` route as the default view. */
export function Workspace({ room, activeTab }: { room: RoomDetail; activeTab: WorkspaceTab }) {
  const [steering, setSteering] = React.useState(false);
  const effectiveTab: WorkspaceTab = steering ? "steering" : activeTab;

  return (
    <div className="space-y-4">
      <WorkspaceHeader
        room={room}
        subtitle={steering ? "War room · a run is in progress · redirected 40 seconds ago" : undefined}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr_260px] lg:h-[calc(100dvh-var(--spacing-topbar)-var(--spacing-page)*2-96px)]">
        <ThreadPanel room={room} />
        <CenterPanel room={room} activeTab={effectiveTab} onSteer={setSteering} />
        <PlaysPanel room={room} blocked={steering} />
      </div>
    </div>
  );
}
