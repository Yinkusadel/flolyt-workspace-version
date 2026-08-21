import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RecognitionTabs } from "@/pages/knowledge/recognition/tabs";
import { WhoCell } from "@/pages/knowledge/recognition/who-cell";
import { DISSENT_ROWS, RC05_NOTES, RC_CHIP_TONE, RC_TONE_CLASS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC05 — /recognition/dissent. */
const DissentRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five recorded disagreements · one was wrong, one was withdrawn, and both are recognised
        </p>
      </div>

      <RecognitionTabs active="Dissent" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Recorded disagreement · recognised for being written down, not for being right</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>The dissent</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Turned out</th>
                <th className={HEAD_CLASS}>Kept because</th>
                <th className={`${HEAD_CLASS} text-right`}>Recognised</th>
              </tr>
            </thead>
            <tbody>
              {DISSENT_ROWS.map((row) => (
                <tr key={row.dissent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.dissent}</td>
                  <td className="px-4 py-3">
                    <WhoCell actor={row.who} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.turnedOutTone]}>{row.turnedOut}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.keptBecause}</td>
                  <td className={cn("px-4 py-3 text-right", RC_TONE_CLASS[row.recognisedTone])}>{row.recognised}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Tunde was wrong in public in August and it is the first thing in this table">
        {RC05_NOTES.tundeWrong}
      </Callout>

      <Callout tone="amber" title="The last row is an agent and it is not recognised">
        {RC05_NOTES.lastRowAgent}
      </Callout>
    </div>
  );
};

export default DissentRoute;
