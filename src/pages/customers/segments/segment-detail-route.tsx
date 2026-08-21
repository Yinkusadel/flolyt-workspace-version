import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG04_EXCLUDED_ROWS, SG04_KV_ROWS, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function LapsedFeeDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Segments", to: "/segments" }, { label: "Lapsed after the fee change" }]}
        title="Lapsed after the fee change"
        subtitle="100,000 of 148,000 · four exclusions, one of them fixable · 4,100 leave a day"
        action={
          <Button type="button" onClick={() => toast.success("Opening room 8f2c")}>
            Use in a room
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">In the segment today</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">100,000</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          148,000 matched the definition. 48,000 are excluded by name and 4,100 leave every day.
        </p>
        <div className="mt-3 flex flex-wrap gap-5 border-t border-dashed border-rose-border pt-3">
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Decaying at</p>
            <p className="mt-0.5 text-[13px] font-semibold text-rose">4,100 a day</p>
          </div>
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">In money</p>
            <p className="mt-0.5 text-[13px] font-semibold text-rose">≈₦2.1M a day</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The definition, as it was written</p>
        <SegmentsKvList rows={SG04_KV_ROWS} />
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who matched and did not make it in</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Excluded</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={HEAD_CLASS}>Could it change?</th>
              </tr>
            </thead>
            <tbody>
              {SG04_EXCLUDED_ROWS.map((row) => (
                <tr key={row.excluded} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.excluded}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className={`px-4 py-3 ${SG_TONE_CLASS[row.couldChangeTone]}`}>{row.couldChange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The largest exclusion is a missing database field and it has been requested since 28 July">
        42,000 people behaved exactly like the segment describes and cannot be joined to a customer record. They are
        not a privacy exclusion or a policy one — they are a schema gap, sitting in the same table as two exclusions
        that are permanent and correct. Marking them differently is the only way anyone would know one of the three
        is fixable.
      </Callout>

      <Callout tone="rose" title="This segment is smaller than it was when you opened the page">
        4,100 people cross the 90-day boundary every day and stop being reachable in any useful sense — repeat rate
        past that line falls from 16.1% to 4.2%. The number at the top is today's, dated, and the decay rate sits
        beside it rather than in a footnote, because a segment quoted from a slide written three weeks ago is
        86,000 people, not 100,000.
      </Callout>
    </div>
  );
}

function SegmentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Segment not found</p>
      <Link to="/segments" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to segments
      </Link>
    </div>
  );
}

/** SG04 (`lapsed-fee`) — the index's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const SegmentDetailRoute = () => {
  const { id } = useParams();

  if (id === "lapsed-fee") return <LapsedFeeDetail />;
  return <SegmentNotFound />;
};

export default SegmentDetailRoute;
