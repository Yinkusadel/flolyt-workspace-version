import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { LEDGER } from "@/pages/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * G14 — Value and ROI. Lives at its own top-level `/value` route (not nested under Goals) —
 * per EVERYDAY-routes.md, it's written by both Goals and room close-out, so it's the shared
 * ledger, not a Goals sub-page.
 */
const Value = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-[10.5px] text-ink-4">
          <span className="text-ink-3">Goals</span>
          <span className="mx-1.5">›</span>
          <span className="text-ink-3">Value and ROI</span>
        </p>
        <h1 className="mt-2 text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          What Flolyt has protected and recovered since 12 January · 41 rooms closed
        </p>
      </div>
      <Button className="shrink-0" onClick={() => toast.success("Exported for the board")}>
        Export for the board
      </Button>
    </div>

    <div>
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        Two numbers, and they are not the same number
      </p>
      <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-card border border-rose-border bg-paper p-5">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
            Revenue at risk identified
          </p>
          <p className="mt-2 text-[24px] font-semibold text-ink">₦1.08B</p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Found by agents across 41 closed rooms and 11 open ones. Identifying it is not saving it — most of this
            was leaking before anyone opened a room.
          </p>
          <p className="mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] text-rose">
            ₦412M of it is still open
          </p>
        </div>
        <div className="rounded-card border border-teal-border bg-paper p-5">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
            Revenue recovered
          </p>
          <p className="mt-2 text-[19px] font-semibold text-ink">₦411M · KES 18.2M · GHS 1.4M · £61k</p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Measured against held-back groups, not against forecasts. Four markets, four currencies, four figures —
            combining them would hide that the UK is 0.4% of this and Nigeria is nine tenths.
          </p>
          <p className="mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] text-teal">
            ₦74M-equivalent excluded as unmeasurable
          </p>
        </div>
      </div>
    </div>

    <div>
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The ledger</p>
      <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Room</th>
              <th className={HEAD_CLASS}>Closed</th>
              <th className={cn(HEAD_CLASS, "text-right")}>At risk</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Recovered</th>
              <th className={HEAD_CLASS}>How it was measured</th>
              <th className={HEAD_CLASS}>Credited to</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Days</th>
            </tr>
          </thead>
          <tbody>
            {LEDGER.map((row) => (
              <tr key={row.room} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.room}</td>
                <td className={cn("px-4 py-3", row.closedTone ? TONE_TEXT_CLASS[row.closedTone] : "text-ink-3")}>
                  {row.closed}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">{row.atRisk}</td>
                <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.recoveredTone])}>
                  {row.recovered}
                </td>
                <td className="px-4 py-3 text-ink-3">{row.howMeasured}</td>
                <td className="px-4 py-3 text-ink-3">{row.creditedTo}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-4">{row.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <Callout tone="teal" title="One room recovered money that cannot be attributed to it and it is worth ₦0 here">
      It is listed as unavailable and left out of every figure above. A number the board can check is worth more
      than a number that flatters us — which is also why there is no single combined total on this screen, only a
      rate and its date where one is genuinely needed.
    </Callout>
  </div>
);

export default Value;
