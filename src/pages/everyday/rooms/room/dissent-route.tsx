import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const WHAT_IT_DOES = [
  { label: "Does not block the decision", value: "The decision owner decided and the play is unchanged" },
  { label: "Stays attached permanently", value: "to the decision, the play and the room · it is not resolved by seniority", tone: "text-amber" },
  { label: "Is cited automatically", value: "if this is proposed again, in this room or another", tone: "text-ultra" },
  { label: "Is checked at close-out", value: "if the outcome supports it, they were right and the room says so", tone: "text-teal" },
  { label: "Cannot be edited by the decision owner", value: "only the person who recorded it can withdraw it", tone: "text-amber" },
  { label: "Is not a vote", value: "rooms are not democracies · one person owns the decision" },
];

/** R25 — Room · recorded dissent (`/rooms/:id/decision/dissent`). */
export const DissentRoute = () => {
  const { room } = useRoomContext();
  const dissent = room.dissent;
  if (!dissent) return null;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Decision", to: `/rooms/${room.id}` }, { label: "Dissent" }]}
        title="Recorded dissent"
        subtitle={`${dissent.by.name}, attached to the decision, checked again at close-out`}
        action={<Button>Add a dissent</Button>}
      />

      <div className="flex gap-3 rounded-card border border-amber-border bg-paper p-4">
        <ActorAvatar actor={{ kind: "human", person: dissent.by }} size="default" />
        <div>
          <p className="text-[13px] font-semibold text-ink">
            {dissent.by.name} · {dissent.by.department}
          </p>
          <p className="mt-0.5 text-[10.5px] text-ink-4">Recorded {dissent.recordedAt}</p>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-2">"{dissent.quote}"</p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What a recorded dissent does, and does not do
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {WHAT_IT_DOES.map((row) => (
            <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
              <span className="text-ink-2">{row.label}</span>
              <span className={`text-right ${row.tone ?? "text-ink-3"}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Dissent in this workspace
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Dissent</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>By</th>
                <th className={HEAD_CLASS}>Recorded</th>
                <th className={HEAD_CLASS}>Status</th>
                <th className={HEAD_CLASS}>Was it right?</th>
              </tr>
            </thead>
            <tbody>
              {dissent.workspaceRows.map((row) => (
                <tr key={row.quote} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">"{row.quote}"</td>
                  <td className="px-4 py-3 text-ink-3">{row.room}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "human", person: row.by }} size="sm" />
                      <span className="text-ink-2">{row.by.name.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.recorded}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.status.tone}>{row.status.label}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.outcome.tone}>{row.outcome.label}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">The second row is why this screen matters</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Somebody disagreed and was wrong, and the record says so plainly. Nobody has held it against them — but
            the next time they disagree, the room knows they have been wrong about this once and right about other
            things, which is more useful than a culture where nobody writes anything down.
          </p>
        </div>
      </div>
    </div>
  );
};
