import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { BarTrack } from "@/pages/everyday/lifecycle/stage/bar";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { EX_BAR_TONE, EX_TONE_CLASS, XP12_BARS, XP12_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP12 — /experiments/readability, the "Readability" tab. */
const ExperimentsReadabilityRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Readability</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Two of four cannot say anything yet · one never will · no preliminary results anywhere</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening each experiment's registered design")}>
          See the designs
        </Button>
      </div>

      <ExperimentsTabs active="Readability" />

      <section className="max-w-3xl space-y-4">
        <p className={EYEBROW_CLASS}>When each running experiment will actually be able to say something</p>
        {XP12_BARS.map((bar) => (
          <div key={bar.label} className="space-y-1.5">
            <span className="text-[12px] font-semibold text-ink">{bar.label}</span>
            <BarTrack percent={bar.percent} tone={EX_BAR_TONE[bar.tone]} />
            <p className={`text-[10.5px] ${EX_TONE_CLASS[bar.tone]}`}>{bar.note}</p>
          </div>
        ))}
      </section>

      <Callout tone="ultra" title="Two of four experiments cannot say anything yet and one never will">
        Nothing on this screen is a preliminary result, because there is no such thing here. A difference read on
        day three of eighteen is noise with a decimal point, and showing it would guarantee somebody quotes it in a
        meeting on day four. The bars measure time to readability, not progress towards a good answer.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What determines when a result can be read</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Experiment</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Baseline rate</th>
                <th className={`${HEAD_CLASS} text-right`}>Change it can detect</th>
                <th className={`${HEAD_CLASS} text-right`}>Days needed</th>
                <th className={`${HEAD_CLASS} text-right`}>Days elapsed</th>
              </tr>
            </thead>
            <tbody>
              {XP12_ROWS.map((row) => (
                <tr key={row.experiment} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.experiment}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.baseline}</td>
                  <td className={`px-4 py-3 text-right font-mono ${EX_TONE_CLASS[row.changeTone]}`}>{row.change}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.daysNeeded}</td>
                  <td className={`px-4 py-3 text-right font-mono ${EX_TONE_CLASS[row.daysElapsedTone]}`}>{row.daysElapsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The Kenya experiment could only ever have detected a large change, and it found one">
        490 held customers is enough to see 8 points and nothing smaller. It came back at 44.3, so the design was
        adequate — but if the real effect had been 5 points, this experiment would have reported nothing and
        everyone would have concluded the retry does not work in Kenya. The detectable change is printed beside
        every result for that reason.
      </Callout>
    </div>
  );
};

export default ExperimentsReadabilityRoute;
