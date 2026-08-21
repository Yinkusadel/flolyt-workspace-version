import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RepliesTabs } from "@/pages/customers/replies/tabs";
import { RP_ANSWERED_ROWS, RP_ANSWERED_STATS, RP_KPI_TONE, RP_TONE_CLASS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * Answered — no dedicated frame in the export (`TABS` lists it as a fifth
 * tab but `rp.py` never calls `S.save("RP..", ..., "Answered", ...)`, same
 * "tab with no frame" gap Scenario/Campaigns/Experiments each hit with their
 * own no-frame tab). Built anyway, grounded in RP13's own "12,388 sent"
 * figure — which is exactly 12,800 total messages minus the 412 counted as
 * never answered on the Unanswered tab, so the number was already implied
 * rather than invented.
 */
const RepliesAnsweredRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Answered</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">12,388 of 12,800 answered · every one written and sent by a person</p>
      </div>

      <RepliesTabs active="Answered" />

      <KpiCards items={RP_ANSWERED_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>A sample of what got answered, and how fast</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>From</th>
                <th className={HEAD_CLASS}>What it was about</th>
                <th className={`${HEAD_CLASS} text-right`}>Answered in</th>
                <th className={`${HEAD_CLASS} text-right`}>By</th>
              </tr>
            </thead>
            <tbody>
              {RP_ANSWERED_ROWS.map((row) => (
                <tr key={row.from} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.from}</td>
                  <td className="px-4 py-3 text-ink-3">{row.about}</td>
                  <td className={`px-4 py-3 text-right font-mono ${RP_TONE_CLASS[row.answeredInTone]}`}>{row.answeredIn}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="96.8% of everything written to this company got a reply from a named person">
        An agent may draft every one of these, and the send is still a person's name on a button. The 412 that
        didn't make it here are counted on the Unanswered tab instead — this list only holds what actually reached
        somebody.
      </Callout>
    </div>
  );
};

export default RepliesAnsweredRoute;
