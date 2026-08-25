import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DH10_SHAPE_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * DH10 — /data-health/shape. The export's own `subtabs(p, "Right now", TABS)`
 * call sets the active tab to "Right now" even though there is no "Shape"
 * tab in TABS and this is a distinct page — the same tab-mislabel artifact
 * documented for other sections, so this is built as a standalone
 * breadcrumbed page instead of a mis-wired tab, linked from the Right now
 * state's "healthy-and-busy" callout.
 */
const ShapeRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data health", to: "/data-health" }, { label: "Shape" }]}
        title="Shape"
        subtitle="Five shape changes · two were data, two were the business, one was somebody improving a form"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The shape check · data arriving correctly and meaning something different</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What moved</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">When</th>
                <th className={HEAD_CLASS}>Data problem or business?</th>
                <th className={HEAD_CLASS}>Went to</th>
              </tr>
            </thead>
            <tbody>
              {DH10_SHAPE_ROWS.map((row) => (
                <tr key={row.whatMoved} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.whatMoved}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.source}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.when}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.classificationTone]}`}>{row.classification}</td>
                  <td className={`px-4 py-3 ${DH_TONE_CLASS[row.wentToTone]}`}>{row.wentTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="This check cannot tell a data problem from a business event and does not pretend to">
        It notices that something changed shape and routes it to whoever would know. Two of these five were data
        problems, two were the business behaving differently, and one was somebody improving a form. Every one of
        them looked identical on the day — a distribution moving — and a check that guessed would have been wrong
        twice.
      </Callout>

      <Callout tone="amber" title="The most important finding in this workspace came through this check">
        Repeat &amp; Decay noticed the repeat curve change shape on 11 March. It was routed to Ifeoma as a business
        event, which was correct, and it took until 2 August to connect it to a release. The check did its job on
        the day; everything expensive happened afterwards.
      </Callout>
    </div>
  );
};

export default ShapeRoute;
