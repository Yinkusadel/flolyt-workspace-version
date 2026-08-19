import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { SIMILAR_ROOMS } from "@/pages/everyday/rooms/new/new-room-data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R06 — New room · the condition. */
export function StepCondition() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What condition are these customers in?
        </p>
        <div className="mt-2 flex items-center rounded-control border-2 border-ultra-border bg-paper px-3.5 py-2.5">
          <input
            defaultValue="Second order never happened"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none"
          />
          <span className="shrink-0 text-[10.5px] text-ink-4">A state, not a task</span>
        </div>
      </div>

      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Name the condition, not the project</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            "Second order never happened" is a state a group of customers is in. "Q3 reactivation push" is something
            a team is doing. The first can be measured, closed and disproven; the second can only be finished. Rooms
            named after projects are the ones that go stale.
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Rooms that already exist about something similar
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Population</th>
                <th className={HEAD_CLASS}>Overlap with yours</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>Action</th>
              </tr>
            </thead>
            <tbody>
              {SIMILAR_ROOMS.map((room) => (
                <tr key={room.title} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{room.title}</td>
                  <td className="px-4 py-3 font-mono text-ink">{room.population}</td>
                  <td className="px-4 py-3">
                    <Chip tone={room.overlapTone}>{room.overlap}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
                      <span className="text-ink-2">{room.owner.name.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={room.stateTone}>{room.state}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={room.actionTone}>{room.action}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">Duplicate detection runs before you have finished typing</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            At scale, two people finding the same cause from two directions is routine. This is checked at the name,
            again at the audience, and once more before the room opens — the earlier you find out, the cheaper it is
            to join instead.
          </p>
        </div>
      </div>
    </div>
  );
}
