import { Button } from "@/components/ui/button";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/rooms/room/room-layout";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const STATS: Kpi[] = [
  { eyebrow: "This room wants", value: "100,000", note: "three waves of 33,000" },
  { eyebrow: "Also being contacted", value: "41,300", tone: "rose", note: "by four other rooms" },
  { eyebrow: "Would breach the cap", value: "31,900", tone: "rose", note: "two messages in 48 hrs" },
  { eyebrow: "Clear to send", value: "58,700", tone: "teal", note: "no other contact planned" },
];

/** R32 — Room · contact collision (`/rooms/:id/collision`). */
export const CollisionRoute = () => {
  const { room } = useRoomContext();
  const rows = room.collisionRows ?? [];
  const options = room.collisionOptions ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Who else is contacting these people" }]}
        title="Who else is contacting these people"
        subtitle="100,000 in this wave · 41,300 are already being contacted by four other rooms"
        action={<Button>Exclude the 41,300</Button>}
      />

      <KpiCards items={STATS} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Who else is touching these customers this week
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={HEAD_CLASS}>Overlap</th>
                <th className={HEAD_CLASS}>Their send</th>
                <th className={HEAD_CLASS}>Yours</th>
                <th className={HEAD_CLASS}>Gap</th>
                <th className={HEAD_CLASS}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.room}</td>
                  <td className="px-4 py-3 text-ink-3">{row.team}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.overlapTone}>{row.overlap}</Chip>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.theirSend}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.yourSend}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.gapTone}>{row.gap}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.verdict.tone}>{row.verdict.label}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you can do about the 41,300
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          {options.map((opt) => (
            <div key={opt.label} className="flex flex-col rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{opt.label}</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{opt.heading}</p>
              <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{opt.body}</p>
              <Chip tone={opt.tone}>{opt.footer}</Chip>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Nobody did anything wrong here, which is exactly why this screen is needed
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Four teams each built a sensible audience and none of them could see the other three. A room's own
            frequency cap only knows about that room. This is the only place the overlap is visible before it is
            delivered.
          </p>
        </div>
      </div>
    </div>
  );
};
