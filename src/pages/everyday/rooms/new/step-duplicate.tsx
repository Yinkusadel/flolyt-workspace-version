import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DUPLICATE_COMPARE } from "@/pages/everyday/rooms/new/new-room-data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** R10 — New room · duplicate detected (conditional interstitial before Review). */
export function StepDuplicate({
  onJoin,
  onLinked,
  onUnlinked,
}: {
  onJoin: () => void;
  onLinked: () => void;
  onUnlinked: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-card border-2 border-amber-border bg-amber-bg p-5">
        <div>
          <p className="text-[14px] font-semibold text-ink">
            91,400 of your 148,000 are already in a room opened nine days ago
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
            Zainab Yusuf opened "Checkout abandoned at delivery fee" on 11 August about the same root cause. Neither
            of you could see the other. Both readings are correct and they are looking at it from opposite ends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={onJoin}>Join that room</Button>
          <Button variant="outline" onClick={onLinked}>
            Open mine anyway, linked
          </Button>
          <Button variant="ghost" className="text-ink-4" onClick={onUnlinked}>
            Open unlinked
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}></th>
              <th className={HEAD_CLASS}>Yours · Second order never happened</th>
              <th className={HEAD_CLASS}>Zainab's · Checkout abandoned at delivery fee</th>
              <th className={HEAD_CLASS}>Overlap</th>
            </tr>
          </thead>
          <tbody>
            {DUPLICATE_COMPARE.map((row) => (
              <tr key={row.field} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                <td className="px-4 py-3 text-ink-2">{row.yours}</td>
                <td className="px-4 py-3 text-ink-2">{row.theirs}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.overlapTone}>{row.overlap}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Complementary is not the same as duplicate, and Flolyt will not decide which this is
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            One room is trying to recover the people already lost and the other is trying to stop the leak producing
            them. Those may genuinely be two pieces of work — or they may be one room with two owners arguing later.
            The overlap, the double count and the choice are all put in front of you now, and the decision is yours.
          </p>
        </div>
      </div>
    </div>
  );
}
