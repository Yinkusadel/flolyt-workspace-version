import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { QuoteCard } from "@/pages/knowledge/business-memory/quote-card";
import { RecognitionKvList } from "@/pages/knowledge/recognition/kv-list";
import { RC02_NOTE, RC02_QUOTE, RC02_STATS, RC02_WHY_KV, RC_KPI_TONE } from "@/pages/knowledge/recognition/data";

/** RC02 — 18 August, the first recognition. Wired but unreachable with RECOGNITION_STATE's current default. */
export function FirstRecognitionState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 · recognised this morning</p>
      </div>

      <QuoteCard text={RC02_QUOTE.text} source={RC02_QUOTE.source} />

      <KpiCards items={RC02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RC_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why this one first</p>
        <RecognitionKvList rows={RC02_WHY_KV} />
      </section>

      <Callout tone="ultra" title="The first recognition in this workspace is for something that made the numbers worse">
        {RC02_NOTE}
      </Callout>
    </div>
  );
}
