import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { ErasureRequestModal } from "@/pages/data/identity/modals/erasure-request-modal";
import { ID08_STATS, ID08_STEP_ROWS, ID_KPI_TONE } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID08 — /identity/erasure. */
const ErasureRoute = () => {
  const [erasureOpen, setErasureOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Six steps, under 24 hours · aggregates are not restated, theme counts are
          </p>
        </div>
        <Button type="button" onClick={() => setErasureOpen(true)}>
          Process an erasure request
        </Button>
      </div>

      <IdentityTabs active="Erasure" />

      <KpiCards items={ID08_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: ID_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Erasure requests and what happens to everything derived from that person</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>What happens</th>
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Reversible</th>
              </tr>
            </thead>
            <tbody>
              {ID08_STEP_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.step}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.reversible === "no" ? "rose" : "neutral"}>{row.reversible}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A person is erased and the aggregate figures they contributed to are not restated">
        Their transactions remain as anonymous rows, so revenue history is unchanged, and closed rooms keep the
        figures they were credited with. This is the standard reading — an aggregate is not personal data — and it
        is stated here because the alternative, restating eight months of figures on every erasure request, would
        make the ledger unusable and is not required.
      </Callout>

      <Callout tone="teal" title="Theme counts decrement and that is deliberate">
        Reply themes store membership rather than a denormalised total, precisely so an erasure removes one
        person's contribution to a count without leaving a stale number behind. It is the one place where an
        aggregate does move, because the underlying object is that person's words.
      </Callout>

      <ErasureRequestModal open={erasureOpen} onOpenChange={setErasureOpen} />
    </div>
  );
};

export default ErasureRoute;
