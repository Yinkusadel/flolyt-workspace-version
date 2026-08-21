import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RecognitionTabs } from "@/pages/knowledge/recognition/tabs";
import { WhoCell } from "@/pages/knowledge/recognition/who-cell";
import { QUIET_WORK_ROWS, RC07_NOTES, RC_CHIP_TONE } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC07 — /recognition/quiet. */
const QuietWorkRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Five kinds of invisible work · four recognised, one deliberately not</p>
      </div>

      <RecognitionTabs active="Quiet work" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Work that leaves no artefact and appears nowhere else in this product</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What was done</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>How it was noticed</th>
                <th className={`${HEAD_CLASS} text-right`}>Appears elsewhere?</th>
                <th className={`${HEAD_CLASS} text-right`}>Recognised</th>
              </tr>
            </thead>
            <tbody>
              {QUIET_WORK_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3">
                    <WhoCell actor={row.who} label={row.whoLabel} />
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.howNoticed}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.appearsElsewhereTone]}>{row.appearsElsewhere}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.recognisedTone]}>{row.recognised}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The fourth row is deliberately not recognised and the line matters">
        {RC07_NOTES.fourthRow}
      </Callout>

      <Callout tone="amber" title="Peter's nine answers are recognised four days before he leaves and none of them is written down">
        {RC07_NOTES.peterRow}
      </Callout>
    </div>
  );
};

export default QuietWorkRoute;
