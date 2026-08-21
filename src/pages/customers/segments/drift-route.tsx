import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SegmentsTabs } from "@/pages/customers/segments/tabs";
import { SG07_KV_ROWS, SG07_ROWS, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG07 — /segments/drift. */
const SegmentsDriftRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Drift</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Five segments moved · four because the world did, one because the question changed
          </p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the freeze flow")}>
          Freeze a segment
        </Button>
      </div>

      <SegmentsTabs active="Drift" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Segments whose size moved without anybody editing the definition</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Segment</th>
                <th className={`${HEAD_CLASS} text-right`}>Then</th>
                <th className={`${HEAD_CLASS} text-right`}>Now</th>
                <th className={`${HEAD_CLASS} text-right`}>Change</th>
                <th className={HEAD_CLASS}>Why it moved</th>
                <th className={HEAD_CLASS}>Definition edited?</th>
              </tr>
            </thead>
            <tbody>
              {SG07_ROWS.map((row) => (
                <tr key={row.segment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.segment}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.then}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-2">{row.now}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${SG_TONE_CLASS[row.changeTone]}`}>{row.change}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.editedTone === "risk" ? "rose" : "teal"}>{row.edited}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Four of these moved because the world moved and one moved because somebody changed the question">
        The fourth row fell 32% on 11 July when the value window went from sixty days to thirty, and nothing about
        any customer changed. That is the dangerous kind of drift, because it looks exactly like the other four in
        a chart. Its definition edit is flagged, both sizes are kept, and every chart spanning that date carries a
        mark.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What drift does to work already in flight</p>
        <SegmentsKvList rows={SG07_KV_ROWS} />
      </section>
    </div>
  );
};

export default SegmentsDriftRoute;
