import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CloseARoomModal } from "@/pages/revenue/value/modals/close-a-room-modal";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import { ValueTabs } from "@/pages/revenue/value/tabs";
import { VL05_ROWS, VL05_TIME_KV, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL05 — /value?by=room. Also the base page the "Close a room with no number" modal (VL16) opens from. */
export function ByRoomState() {
  const [closeOpen, setCloseOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Value</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Forty-one closed · twenty-one produced no money · none closed itself</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => setCloseOpen(true)}>
          Close a room
        </Button>
      </div>

      <ValueTabs active="By room" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Forty-one closed rooms, grouped by how they ended</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>How it ended</th>
                <th className={`${HEAD_CLASS} text-right`}>Rooms</th>
                <th className={`${HEAD_CLASS} text-right`}>Recovered</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={HEAD_CLASS}>Example</th>
              </tr>
            </thead>
            <tbody>
              {VL05_ROWS.map((row) => (
                <tr key={row.howEnded} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.howEnded}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.recoveredTone]}`}>{row.rooms}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.recoveredTone]}`}>{row.recovered}</td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-ink-4">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Twenty-one of forty-one closed rooms produced no money and that is not a failure rate">
        Fifteen closed because the thing stopped happening or was never really there; six were the wrong shape and
        the work carried on under a different name. Counting those as failures would push people to keep rooms open
        until they produce a figure — which is exactly how a ledger fills up with numbers nobody believes.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Time from opening to closing</p>
        <ValueKvList rows={VL05_TIME_KV} />
      </section>

      <CloseARoomModal open={closeOpen} onOpenChange={setCloseOpen} />
    </div>
  );
}
