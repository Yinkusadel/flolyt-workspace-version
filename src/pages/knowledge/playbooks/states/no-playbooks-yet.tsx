import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PB01_NOTE, PB01_RAN_ONCE_ROWS, PB_CHIP_TONE, PB_TONE_CLASS } from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** PB01 — before anything has been done twice. Wired but unreachable with PLAYBOOKS_STATE's current default. */
export function NoPlaybooksYetState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Six plays have run once · nothing has been repeated, so nothing is reusable yet
        </p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been done twice yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          A playbook is a play that worked somewhere, written down with the conditions it needs and the record of
          everywhere it has run since. It cannot be written in advance — the first run is just a play, and the
          second one is what makes it a playbook.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/rooms")}>
            See the plays that ran
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/business-memory")}>
            What makes a playbook
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Six plays have run once. None of them has been repeated, so there is nothing here to reuse.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Plays that have run once, and whether they could be repeated</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Play</th>
                <th className={`${HEAD_CLASS} text-right`}>Ran</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>Could it be repeated?</th>
                <th className={`${HEAD_CLASS} text-right`}>What it would need</th>
              </tr>
            </thead>
            <tbody>
              {PB01_RAN_ONCE_ROWS.map((row) => (
                <tr key={row.play} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.play}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.ran}</td>
                  <td className={`px-4 py-3 text-right font-mono ${PB_TONE_CLASS[row.resultTone]}`}>{row.result}</td>
                  <td className="px-4 py-3">
                    <Chip tone={PB_CHIP_TONE[row.repeatableTone]}>{row.repeatable}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.needs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A playbook cannot be written before something has worked twice">
        {PB01_NOTE}
      </Callout>
    </div>
  );
}
