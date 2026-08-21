import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { BM_TONE_CLASS, ME07_NOTES, ME07_SOURCE_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME07 — /business-memory/sources, own header, no tab bar. */
const SourcesRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Business memory", to: "/business-memory" }, { label: "Where these come from" }]}
        title="Where learnings come from"
        subtitle="Eight sources · eleven of them are reasons things were not done · one writes without a person"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Source</th>
              <th className={`${HEAD_CLASS} text-right`}>Learnings</th>
              <th className={HEAD_CLASS}>What it writes</th>
              <th className={HEAD_CLASS}>State it arrives in</th>
              <th className={`${HEAD_CLASS} text-right`}>Needs a person?</th>
            </tr>
          </thead>
          <tbody>
            {ME07_SOURCE_ROWS.map((row) => (
              <tr key={row.source} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.source}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">{row.count}</td>
                <td className="px-4 py-3 text-ink-3">{row.writes}</td>
                <td className={cn("px-4 py-3", BM_TONE_CLASS[row.stateTone])}>{row.state}</td>
                <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.needsPersonTone])}>{row.needsPerson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Eleven learnings here are reasons things were not done">
        {ME07_NOTES.rejections}
      </Callout>

      <Callout tone="teal" title="Only one source writes without a person, and it writes the narrowest kind of line">
        {ME07_NOTES.connectionFailing}
      </Callout>
    </div>
  );
};

export default SourcesRoute;
