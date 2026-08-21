import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { SegmentsTabs } from "@/pages/customers/segments/tabs";
import { SG13_RETIRED_ROWS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG13's base table — /segments/retired. */
const SegmentsRetiredRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Segments · retired</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">3 retired · all still readable</p>
      </div>

      <SegmentsTabs active="Retired" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Retired · kept, readable, unusable</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Segment</th>
                <th className={`${HEAD_CLASS} text-right`}>Size at retirement</th>
                <th className={HEAD_CLASS}>Retired</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Still readable</th>
              </tr>
            </thead>
            <tbody>
              {SG13_RETIRED_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.sizeAtRetirement}</td>
                  <td className="px-4 py-3 text-ink-4">{row.retired}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3">
                    <Chip tone="teal">{row.stillReadable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Retiring is about what may happen next, not about tidying up">
        Three segments are retired and all three are still doing work — they are what a closed room's numbers mean.
        The reason this is a typed field rather than a delete button is that in November somebody will ask who the
        3,100 were, and “Amara retired it because we had already apologised to them” is the answer.
      </Callout>
    </div>
  );
};

export default SegmentsRetiredRoute;
