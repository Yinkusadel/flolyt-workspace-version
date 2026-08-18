import { Chip } from "@/pages/lifecycle/stage/chip";
import { ActorAvatar } from "@/pages/rooms/actor";
import { IFEOMA } from "@/pages/rooms/data";
import { SUGGESTED_AGENTS, SUGGESTED_PEOPLE } from "@/pages/rooms/new/new-room-data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R08 — New room · who is in the room. */
export function StepPeople() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Decision owner · one person, and it cannot be a team
        </p>
        <div className="mt-2 flex items-center gap-3 rounded-card border-2 border-ultra-border bg-paper p-4">
          <ActorAvatar actor={{ kind: "human", person: IFEOMA }} size="lg" />
          <div>
            <p className="text-[13px] font-semibold text-ink">{IFEOMA.name}</p>
            <p className="text-[10.5px] text-ink-3">Marketing · owns Retain · already on 14 rooms</p>
          </div>
          <Chip tone="amber">high load</Chip>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          People · suggested from the stages this touches
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Person</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={HEAD_CLASS}>Why they are suggested</th>
                <th className={HEAD_CLASS}>On how many rooms</th>
                <th className={HEAD_CLASS}>Add</th>
              </tr>
            </thead>
            <tbody>
              {SUGGESTED_PEOPLE.map((row) => (
                <tr key={row.person.initials + row.person.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "human", person: row.person }} size="sm" />
                      <span className="font-semibold text-ink-2">{row.person.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.team}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.roomCount}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.added ? "teal" : "ultra"}>{row.added ? "added" : "add"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Agents · one leads, the rest support
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>What it will do here</th>
                <th className={HEAD_CLASS}>Role</th>
                <th className={HEAD_CLASS}>Reads</th>
                <th className={HEAD_CLASS}>Add</th>
              </tr>
            </thead>
            <tbody>
              {SUGGESTED_AGENTS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActorAvatar actor={{ kind: "agent", agent: row.agent }} size="sm" />
                      <span className="font-semibold text-ink-2">{row.agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.does}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.roleTone}>{row.role}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.reads}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.added ? "teal" : "ultra"}>{row.locked ? "always on" : row.added ? "added" : "add"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Everyone added here can see everything in the room, including the customer cohort
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            There is no partial membership. If someone should see the evidence but not the customer list, they
            should not be in the room — they should receive a handoff from it. That distinction is what stops rooms
            quietly becoming the place company data goes to be shared.
          </p>
        </div>
      </div>
    </div>
  );
}
