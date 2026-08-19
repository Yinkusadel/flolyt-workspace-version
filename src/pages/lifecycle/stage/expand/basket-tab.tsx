import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { RequestInstrumentationModal } from "@/pages/lifecycle/stage/modals/request-instrumentation-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  EXPAND_BASKET_INSIDE_ROWS,
  EXPAND_BASKET_KPIS,
  EXPAND_BASKET_ROWS,
  EXPAND_REQUEST_INSTRUMENTATION_PRESET,
} from "@/pages/lifecycle/stage/expand/data";

const INSIDE_TONE_CLASS: Record<"teal" | "rose" | "amber", string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber" };

/**
 * EX05 — Expand's unique Basket tab, mostly blocked on a missing
 * `order_lines` field (same gap Price's Margin tab hits). Reuses the
 * shared RequestInstrumentationModal (already generic, built for Adopt's
 * AD13) with Expand's own preset rather than building a new modal.
 */
const ExpandBasketTab = () => {
  const { headerActionsEl } = useStageContext();
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
            Request instrumentation
          </Button>,
          headerActionsEl
        )}

      <KpiCards items={EXPAND_BASKET_KPIS} />

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>Basket size held flat through everything</p>
        <div className="space-y-5">
          {EXPAND_BASKET_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="Basket size not moving is a finding, not a null result">
        Through a fee change, a discount increase and a 21% acquisition surge, the median basket did not move once.
        Everything that happened to this company happened to order frequency. Any strategy aimed at making people
        spend more per order is aimed at the one number that has never responded to anything.
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>What is inside a basket · and why this section is short</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {EXPAND_BASKET_INSIDE_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${INSIDE_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="rose" title="This is the thinnest screen in the lifecycle and the reason is a single missing field">
        `order_lines` has been requested from Engineering since 28 July. It is 41 days overdue and it blocks basket
        composition here, margin in Price, category expansion in this stage&apos;s own definition, and payback in
        Acquire. One field, four stages, six figures.
      </Callout>

      <RequestInstrumentationModal preset={EXPAND_REQUEST_INSTRUMENTATION_PRESET} open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
};

export default ExpandBasketTab;
