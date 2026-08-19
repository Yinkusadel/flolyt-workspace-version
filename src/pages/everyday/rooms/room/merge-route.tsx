import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R39 — Merge two rooms (`/rooms/:id/merge`) — a full page, not a modal. */
export const MergeRoute = () => {
  const { room } = useRoomContext();
  const merge = room.mergeCandidate;
  if (!merge) return null;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Merge" }]}
        title={merge.title}
        subtitle={merge.subtitle}
        action={<Button>Merge them</Button>}
      />

      <div className="rounded-card border-2 border-amber-border bg-amber-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">
          Two rooms are working on the same {merge.rows.find((r) => r.label === "Population")?.agreed ?? "customers"}
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
          Opened nine days apart by two teams who could not see each other. Neither is wrong; each has half of the
          answer.
        </p>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}></th>
              <th className={HEAD_CLASS}>{room.title}</th>
              <th className={HEAD_CLASS}>The other room</th>
              <th className={HEAD_CLASS}>Overlap</th>
            </tr>
          </thead>
          <tbody>
            {merge.rows.map((row) => (
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

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What merging would do</p>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex flex-col rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">Keep</p>
            <p className="mt-1.5 text-[12.5px] font-semibold text-ink">Both decision docs, both threads</p>
            <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{merge.keepBody}</p>
            <Chip tone="teal">history is never rewritten</Chip>
          </div>
          <div className="flex flex-col rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">Reconcile</p>
            <p className="mt-1.5 text-[12.5px] font-semibold text-ink">One population, one figure</p>
            <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{merge.reconcileBody}</p>
            <Chip tone="amber">₦188M comes off the total</Chip>
          </div>
          <div className="flex flex-col rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">Decide</p>
            <p className="mt-1.5 text-[12.5px] font-semibold text-ink">One room needs one owner</p>
            <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{merge.decideBody}</p>
            <Chip tone="rose">the only hard part</Chip>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Merging is not the only right answer and Flolyt does not push you to it
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            One room may genuinely be two pieces of work with two owners. What is not acceptable is both of them
            sending to the same customers next week without knowing — and linking, rather than merging, fixes that
            alone.
          </p>
        </div>
      </div>
    </div>
  );
};
