import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP08_KV_ROWS, CP08_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP08 — /campaigns/sent. */
const CampaignsSentRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Sent</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six sends since February · the two largest produced no evidence at all</p>
        </div>
        <Button type="button" onClick={() => toast.success("Exporting the send ledger")}>
          Export
        </Button>
      </div>

      <CampaignsTabs active="Sent" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything that has ever left this workspace</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Campaign</th>
                <th className={`${HEAD_CLASS} text-right`}>Sent</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Channel</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={`${HEAD_CLASS} text-right`}>Approved by</th>
              </tr>
            </thead>
            <tbody>
              {CP08_ROWS.map((row) => (
                <tr key={row.campaign} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink-2">{row.campaign}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.sent}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.channel}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.heldTone]}`}>{row.held}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.resultTone]}`}>{row.result}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The two largest sends in this list have no holdout and no causal figure between them">
        522,000 people received the onboarding rewrite and the cadence change, and neither can be shown to have done
        anything. The two smallest sends here, at 19,260 and 45,100, produced the only causal figures in the
        workspace. Reach and evidence have been in inverse proportion for seven months, and this table is the
        clearest place that shows it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is kept about every send, permanently</p>
        <CampaignsKvList rows={CP08_KV_ROWS} />
      </section>
    </div>
  );
};

export default CampaignsSentRoute;
