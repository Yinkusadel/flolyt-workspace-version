import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/pages/rooms/room/evidence-badge";
import { LifecycleGraphRail } from "@/pages/rooms/room/evidence/lifecycle-graph-rail";
import type { RoomDetail } from "@/pages/rooms/types";

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 29 (evidence tab) — see flolyt-kit-122/29-room-evidence-tab.svg. */
export function EvidenceTab({ room }: { room: RoomDetail }) {
  const claims = room.evidenceClaims ?? [];

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
      <LifecycleGraphRail
        signals={room.evidenceSignals ?? []}
        timeline={room.evidenceTimeline}
        className="border-b border-line lg:border-r lg:border-b-0"
      />

      <div className="space-y-6 overflow-y-auto p-6">
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Every claim in this room, and how strong it is
          </p>
          <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[640px] text-left text-[11.5px]">
              <thead>
                <tr className="border-b border-line">
                  <th className={HEAD_CLASS}>Claim</th>
                  <th className={HEAD_CLASS}>Grade</th>
                  <th className={HEAD_CLASS}>Source</th>
                  <th className={HEAD_CLASS}>Window</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>N</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.claim} className="border-b border-line last:border-0">
                    <td className="max-w-[280px] px-3 py-3 text-ink-2">{claim.claim}</td>
                    <td className="px-3 py-3">
                      <EvidenceBadge grade={claim.grade} />
                    </td>
                    <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-3">{claim.source}</td>
                    <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-3">{claim.window}</td>
                    <td className="px-3 py-3 text-right font-mono text-ink-3">{claim.n}</td>
                  </tr>
                ))}
                {claims.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-ink-4">
                      No claims recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {room.evidenceWhatWouldChange && (
          <div>
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
              What would change the recommendation
            </p>
            <div className="mt-3 rounded-card border border-ultra-border bg-ultra-bg p-4">
              <p className="text-[12.5px] font-semibold text-ink">{room.evidenceWhatWouldChange.headline}</p>
              <p className="mt-1.5 text-[11.5px] text-ink-2">{room.evidenceWhatWouldChange.body}</p>
            </div>
          </div>
        )}

        {room.evidenceGaps && (
          <div>
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
              Gaps the agents flagged themselves
            </p>
            <div className="mt-3 flex flex-col gap-3 rounded-card border border-dashed border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] text-ink-2">{room.evidenceGaps.body}</p>
                <p className="mt-1 text-[11.5px] text-ink-4">{room.evidenceGaps.resolves}</p>
              </div>
              <Button
                type="button"
                size="sm"
                className="shrink-0"
                onClick={() => toast.info("Connect a data source — not built yet")}
              >
                {room.evidenceGaps.cta}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
