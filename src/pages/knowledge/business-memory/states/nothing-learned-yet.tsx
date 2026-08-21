import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { BM_CHIP_TONE, ME01_ENDS_HOW_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME01 — before any room has closed. Wired but unreachable with MEMORY_STATE's current default. */
export function NothingLearnedYetState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">0 learnings · no room has closed yet</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">
          Nothing has been learned yet, because no room has closed
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Business memory is written by closing things. A room that ends writes one learning here, whatever the
          outcome — including the rooms that recovered nothing and the ones that could not be measured at all.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/rooms")}>
            See the open rooms
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/business-memory/sources")}>
            How a learning gets written
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Nobody types a learning into an empty box. Every line here is the residue of a decision somebody made.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The five ways a room can end, and what each one writes here</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>How it ends</th>
                <th className={HEAD_CLASS}>What it writes</th>
                <th className={`${HEAD_CLASS} text-right`}>State it arrives in</th>
                <th className={`${HEAD_CLASS} text-right`}>How often</th>
              </tr>
            </thead>
            <tbody>
              {ME01_ENDS_HOW_ROWS.map((row) => (
                <tr key={row.how} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.how}</td>
                  <td className="px-4 py-3 text-ink-3">{row.writes}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.often}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The third row is the one that makes this section worth having">
        A room that ends unmeasurable writes two things — what happened, unvalidated, and the reason it could not be
        measured, which is usually a constraint about the product. “Push frequency cannot be held back per customer”
        came out of a room that claimed ₦0, and it saves the next three weeks of somebody rediscovering it.
      </Callout>
    </div>
  );
}
