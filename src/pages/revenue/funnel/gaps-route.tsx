import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { RequestInstrumentationModal } from "@/pages/revenue/funnel/modals/request-instrumentation-modal";
import { FN08_KV_ROWS, FN08_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN08 — /funnel/gaps. Also the base page the "Request instrumentation" modal (FN11) opens from. */
const FunnelGapsRoute = () => {
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Funnel</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five steps with no event · what each one would settle if it existed
        </p>
      </div>

      <FunnelTabs active="Not instrumented" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW_CLASS}>Five steps with no event · what each one would settle</p>
        <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
          Request instrumentation
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Step</th>
              <th className={HEAD_CLASS}>Event that would fire it</th>
              <th className={`${HEAD_CLASS} text-right`}>Asked</th>
              <th className={`${HEAD_CLASS} text-right`}>Overdue</th>
              <th className={`${HEAD_CLASS} text-right`}>Would settle</th>
              <th className={HEAD_CLASS}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {FN08_ROWS.map((row) => (
              <tr key={row.step} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.step}</td>
                <td className="px-4 py-3 font-mono text-[10.5px] text-ink-3">{row.event}</td>
                <td className="px-4 py-3 text-right text-ink-4">{row.asked}</td>
                <td className={`px-4 py-3 text-right ${FN_TONE_CLASS[row.overdueTone]}`}>{row.overdue}</td>
                <td className={`px-4 py-3 text-right ${FN_TONE_CLASS[row.wouldSettleTone]}`}>{row.wouldSettle}</td>
                <td className={`px-4 py-3 ${row.owner === "nobody" ? "text-rose" : "text-ink-4"}`}>{row.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="Four of these are overdue against one person and the fifth has never been asked for">
        Sam Iyer holds 41 obligations, 14 of them overdue, and four of them are on this screen. Flolyt does not score
        him, rank him or escalate automatically — it shows what each missing event blocks, because "this event would
        settle the ₦437M argument" is a different request from "this ticket is late". The fifth row is nobody's,
        which is a different failure and is shown as one.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is drawn in the meantime</p>
        <FunnelKvList rows={FN08_KV_ROWS} />
      </section>

      <RequestInstrumentationModal open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
};

export default FunnelGapsRoute;
