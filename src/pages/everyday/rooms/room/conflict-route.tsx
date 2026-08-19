import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";
import { ThreeCardRow } from "@/pages/everyday/rooms/room/three-card-row";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R24 — Room · conflict (`/rooms/:id/conflict/:conflictId`). */
export const ConflictRoute = () => {
  const { room } = useRoomContext();
  const conflict = room.conflict;
  if (!conflict) return null;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Conflict" }]}
        title={conflict.title}
        subtitle={`Raised by the ${conflict.raisedBy.name} ${conflict.raisedAt} · both supported · waiting on ${conflict.owner.name}`}
        action={<Button>Decide</Button>}
      />

      <div className="flex gap-3 rounded-card border-2 border-amber-border bg-amber-bg p-4">
        <ActorAvatar actor={{ kind: "agent", agent: conflict.raisedBy }} size="default" />
        <div>
          <p className="text-[13px] font-semibold text-ink">Two recommendations conflict. I am not picking one.</p>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
            Both are supported by evidence in this room. They lead to different actions and only a person can choose
            between them. Raised {conflict.raisedAt} · owner {conflict.owner.name}.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}></th>
              <th className={HEAD_CLASS}>{conflict.columns.left}</th>
              <th className={HEAD_CLASS}>{conflict.columns.right}</th>
              <th className={HEAD_CLASS}>Agreed?</th>
            </tr>
          </thead>
          <tbody>
            {conflict.rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.label}</td>
                <td className="px-4 py-3 text-ink-2">{row.left}</td>
                <td className="px-4 py-3 text-ink-2">{row.right}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.agreedTone}>{row.agreed}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <p className="text-[12px] font-semibold text-ink">
          The Orchestrator will not average two recommendations into a compromise nobody proposed
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
          A middle-ground discount would satisfy neither reading and would be defensible to nobody afterwards. Its
          job is to state the trade precisely, price what can be priced, name what cannot, and put it in front of
          the person whose decision it is.
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">How to resolve it</p>
        <div className="mt-2">
          <ThreeCardRow cards={conflict.resolve.map((c) => ({ eyebrow: c.eyebrow, heading: c.heading, body: c.body, footer: c.footer, tone: c.tone }))} />
        </div>
      </div>
    </div>
  );
};
