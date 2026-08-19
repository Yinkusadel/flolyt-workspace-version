import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R26 — Room · guardrails (`/rooms/:id/guardrails`). */
export const GuardrailsRoute = () => {
  const { room } = useRoomContext();
  const guardrails = room.guardrails ?? [];
  const notOverridable = guardrails.filter((g) => g.overridable.tone === "rose").length;
  const stopped = room.guardrailStops?.length ?? 0;

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Guardrails" }]}
        title="Guardrails"
        subtitle={`${guardrails.length} in force · ${notOverridable} cannot be overridden by anyone · ${stopped} have already stopped something`}
        action={<Button>Add a guardrail</Button>}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Guardrail</th>
              <th className={HEAD_CLASS}>Setting</th>
              <th className={HEAD_CLASS}>Applies to</th>
              <th className={HEAD_CLASS}>Who set it</th>
              <th className={HEAD_CLASS}>Overridable</th>
            </tr>
          </thead>
          <tbody>
            {guardrails.map((row) => (
              <tr key={row.name} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.name}</td>
                <td className="px-4 py-3 text-ink-2">{row.setting}</td>
                <td className="px-4 py-3">
                  {row.setBy ? (
                    <div className="flex items-center gap-1.5">
                      <span className={row.appliesToTone === "ink" ? "text-ink-3" : undefined}>{row.appliesTo}</span>
                      <ActorAvatar actor={{ kind: "human", person: row.setBy }} size="sm" />
                    </div>
                  ) : (
                    <span className="text-ink-3">{row.appliesTo}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-4">{row.setBy ? row.setBy.name.split(" ")[0] : "workspace"}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.overridable.tone}>{row.overridable.label}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Three of these cannot be overridden by anyone in this workspace, including Ada
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Opt-out, quiet hours and the frequency cap are not settings with a permission attached — they are
            conditions the send pipeline checks and refuses. A guardrail an executive can wave through is a
            guideline, and the whole point is that these are not.
          </p>
        </div>
      </div>

      {room.guardrailStops && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What the guardrails have already stopped in this room
          </p>
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>When</th>
                  <th className={HEAD_CLASS}>What was stopped</th>
                  <th className={HEAD_CLASS}>Affected</th>
                  <th className={HEAD_CLASS}>Guardrail</th>
                  <th className={HEAD_CLASS}>What happened instead</th>
                </tr>
              </thead>
              <tbody>
                {room.guardrailStops.map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-mono text-ink-4">{row.when}</td>
                    <td className="px-4 py-3 text-ink-2">{row.what}</td>
                    <td className="px-4 py-3 text-amber">{row.affected}</td>
                    <td className="px-4 py-3">
                      <Chip tone="rose">{row.guardrail}</Chip>
                    </td>
                    <td className="px-4 py-3 text-ink-3">{row.instead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">A guardrail that stops something silently is a bug</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Everything above happened before approval, is named on this screen and appears in the log. The audience
            number in the play already has them applied.
          </p>
        </div>
      </div>
    </div>
  );
};
