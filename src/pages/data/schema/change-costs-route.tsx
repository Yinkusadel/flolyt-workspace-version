import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { SM14_COST_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM14 — /schema/change-costs, "What a change costs". */
const ChangeCostsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Schema", to: "/schema" }, { label: "What a change costs" }]}
        title="What a change costs"
        subtitle="Seven kinds of change · six visible in a delivery, one invisible by construction"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Kind of change</th>
              <th className={HEAD_CLASS}>Detected</th>
              <th className={HEAD_CLASS}>Automatic response</th>
              <th className={HEAD_CLASS}>Needs a person</th>
              <th className={HEAD_CLASS}>Typical cost</th>
            </tr>
          </thead>
          <tbody>
            {SM14_COST_ROWS.map((row) => (
              <tr key={row.kind} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.kind}</td>
                <td className={`px-4 py-3 ${SM_TONE_CLASS[row.detectedTone]}`}>{row.detected}</td>
                <td className="px-4 py-3 text-ink-2">{row.response}</td>
                <td className={`px-4 py-3 ${SM_TONE_CLASS[row.needsPersonTone]}`}>{row.needsPerson}</td>
                <td className="px-4 py-3 text-ink-4">{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="Six of seven schema changes are cheap because they are visible in a delivery">
        A rename costs hours because the product stops computing rather than computing something wrong. The
        seventh costs months because nothing about the data changes — the column, the type, the volume and the
        freshness are all identical, and only the meaning moved. Every automatic check in this product is blind to
        it by construction.
      </Callout>

      <Callout tone="ultra" title="The response to five of these is to stop rather than to adapt">
        The product does not attempt to map a renamed column, coerce a changed type or infer a replacement. It
        goes Unavailable and names the field, which is slower and produces a gap somebody has to close, and is the
        only behaviour that cannot silently produce a wrong number.
      </Callout>

      <p className="text-[11px] text-ink-3">
        See every{" "}
        <Link to="/schema/changes" className="font-semibold text-ultra hover:underline">
          change that has happened
        </Link>
        .
      </p>
    </div>
  );
};

export default ChangeCostsRoute;
