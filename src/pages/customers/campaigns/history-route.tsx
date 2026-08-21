import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { CP_HISTORY_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/**
 * History — no dedicated frame in the export (`TABS` lists it as a sixth tab
 * but `cp.py` never calls `S.save("CP..", ..., "History", ...)`; same "tab
 * with no frame" gap Scenario hit with its own History tab). Built anyway,
 * grounded in CP17's own "every change is logged, in the campaign log"
 * line, widened into the chronological record that phrase implies.
 */
const CampaignsHistoryRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">History</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Every send, approval, incident and standing-authority change, in one log</p>
      </div>

      <CampaignsTabs active="History" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The campaign log</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>Action</th>
                <th className={HEAD_CLASS}>Campaign</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {CP_HISTORY_ROWS.map((row) => (
                <tr key={`${row.when}-${row.action}-${row.campaign}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4 whitespace-nowrap">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.action}</td>
                  <td className="px-4 py-3 text-ink-3">{row.campaign}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className={`px-4 py-3 ${CP_TONE_CLASS[row.detailTone]}`}>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="neutral" title="Every change is logged, with who, when and what it was before">
        Sends, approvals, incidents and standing-authority grants all land here with a name and a timestamp, never a
        role. A rate shift that follows a guardrail change is marked on the chart that reads it, because a
        comparison across an unstated change is the easiest number in this section to get wrong.
      </Callout>
    </div>
  );
};

export default CampaignsHistoryRoute;
