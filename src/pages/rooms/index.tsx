import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ActorAvatar } from "@/pages/rooms/actor";
import { getRoomIndex } from "@/pages/rooms/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen: Rooms index (not in the original 122-frame kit — reference supplied directly by the user). */
const Rooms = () => {
  const navigate = useNavigate();
  const rows = getRoomIndex();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Rooms</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Each one is about a cohort, not a customer.</p>
        </div>
        <Button type="button" disabled className="shrink-0" title="Coming soon">
          New room
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className={HEAD_CLASS}>Room</th>
              <th className={HEAD_CLASS}>Condition</th>
              <th className={HEAD_CLASS}>Population</th>
              <th className={HEAD_CLASS}>At risk</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS}>Working</th>
              <th className={`${HEAD_CLASS} text-right`}>Last</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((room) => (
              <tr
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-paper-2"
              >
                <td className="px-4 py-3.5 font-semibold whitespace-nowrap text-ink">{room.title}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="inline-flex rounded-chip border border-line bg-paper-2 px-2 py-0.5 text-[10.5px] font-medium text-ink-3">
                    {room.condition}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-mono whitespace-nowrap text-ink-2">{room.population}</td>
                <td className="px-4 py-3.5 font-mono font-semibold whitespace-nowrap text-rose">{room.atRisk}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <ActorAvatar actor={{ kind: "human", person: room.owner }} size="sm" />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex -space-x-1.5">
                    {room.working.map((agent) => (
                      <ActorAvatar key={agent.initials} actor={{ kind: "agent", agent }} size="sm" />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap text-ink-4">{room.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;
