import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DH01_CHECK_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH01 — before any source has delivered twice. Wired but unreachable with DATA_HEALTH_STATE's current default. */
export function NothingToCheckState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data health</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          One delivery is a fact · five checks, and four of them describe arrival rather than meaning
        </p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has delivered twice, so there is nothing to check</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Health here is a comparison — this delivery against the last one, this row count against yesterday's, this
          schema against the one before. One delivery is a fact. Two are the beginning of a health check.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/data-sources")}>
            See the sources
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/data-health/limits")}>
            What gets checked
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          The first source connected three hours ago. The second delivery is due in eleven minutes.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What will be checked, once there is something to compare</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Check</th>
                <th className={HEAD_CLASS}>What it compares</th>
                <th className={HEAD_RIGHT_CLASS}>Fires when</th>
                <th className={HEAD_RIGHT_CLASS}>Goes to</th>
              </tr>
            </thead>
            <tbody>
              {DH01_CHECK_ROWS.map((row) => (
                <tr key={row.check} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.check}</td>
                  <td className="px-4 py-3 text-ink-2">{row.compares}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DH_TONE_CLASS[row.firesTone]}`}>{row.fires}</td>
                  <td className={`px-4 py-3 text-right ${DH_TONE_CLASS[row.goesToTone]}`}>{row.goesTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The last check is the only one that would have caught the ad_spend problem">
        Freshness, volume, completeness and schema all describe whether data arrived correctly. Shape describes
        whether it means what it used to, and it is the one that noticed spend fell 22% on the day an agency
        changed how it billed. It is also the check that fires on real business changes, which is why it goes to a
        stage owner rather than to an engineer.
      </Callout>
    </div>
  );
}
