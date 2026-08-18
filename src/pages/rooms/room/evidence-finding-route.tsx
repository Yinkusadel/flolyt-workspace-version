import { Button } from "@/components/ui/button";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { ThreeCardRow } from "@/pages/rooms/room/three-card-row";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R17 — Room · one finding (`/rooms/:id/evidence/:findingId`). */
export const EvidenceFindingRoute = () => {
  const { room } = useRoomContext();
  const finding = room.evidenceFinding;
  if (!finding) return null;

  const stats: Kpi[] = finding.stats.map((s) => ({
    eyebrow: s.label,
    value: s.value,
    tone: s.tone === "ink" ? "ink" : s.tone === "teal" ? "teal" : s.tone === "rose" ? "rose" : s.tone === "amber" ? "amber" : "ink",
    note: s.note,
  }));

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[
          { label: "Rooms", to: "/rooms" },
          { label: room.title, to: `/rooms/${room.id}` },
          { label: "Evidence", to: `/rooms/${room.id}/evidence` },
          { label: finding.title },
        ]}
        title={finding.title}
        subtitle={finding.subtitle}
        action={<Button>Cite this elsewhere</Button>}
      />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The claim, stated once, precisely
        </p>
        <div className="mt-2 rounded-card border border-ultra-border bg-ultra-bg p-4">
          <p className="text-[13px] font-semibold text-ink">{finding.claimHeading}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{finding.claimBody}</p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What makes this causal rather than correlated
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Test</th>
                <th className={HEAD_CLASS}>Result</th>
                <th className={HEAD_CLASS}>Passes?</th>
              </tr>
            </thead>
            <tbody>
              {finding.causalTests.map((row) => (
                <tr key={row.test} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.test}</td>
                  <td className="px-4 py-3 text-ink-3">{row.result}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.passesTone}>{row.passes}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where the reading disagrees with itself
        </p>
        <div className="mt-2">
          <ThreeCardRow cards={finding.readings} />
        </div>
      </div>
    </div>
  );
};
