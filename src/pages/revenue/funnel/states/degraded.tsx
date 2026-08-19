import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FunnelStepBars } from "@/pages/revenue/funnel/step-bars";
import { FunnelTabs } from "@/pages/revenue/funnel/tabs";
import { FN14_KV_ROWS, FN14_STEPS } from "@/pages/revenue/funnel/data";

/** FN14 — the checkout stream degraded, two steps read Unavailable. Wired but unreachable with FUNNEL_STATE's current default. */
export function DegradedState() {
  return (
    <div className="space-y-8">
      <FunnelTabs active="The funnel" />

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">
          The checkout event stream stopped at 04:12 and the funnel is showing you less, not something wrong
        </p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          Two steps have gone Unavailable. Nothing has been carried forward from yesterday, and nothing below them
          has been recalculated on a partial day.
        </p>
      </div>

      <FunnelStepBars rows={FN14_STEPS} />

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <p className="text-[12px] font-semibold text-ink">Two steps went blank and the four that still work did not</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          The steps that read from the orders table are unaffected and are shown normally. Blanking the whole funnel
          would be tidier and would suggest the whole thing is untrustworthy; showing yesterday's figure in the two
          broken rows would be worse still. Each step states its own source, so a failure only takes down what it
          actually touches.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={EYEBROW_CLASS}>What is known about the outage</p>
          <Button type="button" size="sm" variant="outline" onClick={() => toast.info("Opening the source")}>
            See the source
          </Button>
        </div>
        <FunnelKvList rows={FN14_KV_ROWS} />
      </section>
    </div>
  );
}
