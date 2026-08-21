import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { HL01_SIGNAL_ROWS, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** HL01 — before any signal has a baseline to read against. Wired but unreachable with HEALTH_STATE's current default. */
export function NothingToReadYetState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Customer health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">0 of 6 signals reading</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">
          There are no health signals yet, and there will never be a health score
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A signal is one measurable behaviour that predicts something, with the strength of that prediction stated.
          Six are possible from the data connected today. None can be read until a baseline exists to predict
          against.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => toast.info("Six signals listed below")}>
            See the six signals
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/customer-health/no-score")}>
            Why there is no score
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          A single number per customer would be available today. It is the one thing this section will not build.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The six signals that will be readable, and what each one predicts</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={HEAD_CLASS}>What it would predict</th>
                <th className={`${HEAD_CLASS} text-right`}>Strength when read</th>
                <th className={`${HEAD_CLASS} text-right`}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Ready</th>
              </tr>
            </thead>
            <tbody>
              {HL01_SIGNAL_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className="px-4 py-3 text-ink-3">{row.predicts}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.strengthTone]}`}>{row.strength}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.source}</td>
                  <td className={`px-4 py-3 text-right ${HL_TONE_CLASS[row.readyTone]}`}>{row.ready}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Six signals is harder to use than one score and it is the only honest shape">
        A score would be available on day one, would rank 4.2 million people, and would be wrong in a way nobody
        could inspect — because the moment six different behaviours are averaged into one number, the number no
        longer tells you which behaviour to do something about. Every screen in this section shows the signals
        separately, and the screen explaining why is one of them.
      </Callout>
    </div>
  );
}
