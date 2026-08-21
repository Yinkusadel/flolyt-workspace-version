import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP05_KV_ROWS, CP05_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP05 — /campaigns/audiences. */
const CampaignsAudiencesRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Audiences</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Five audiences · each 20–43% smaller than its segment, with the largest reduction named</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the Lagos refund's zero-shrinkage resolution")}>
          See a resolution
        </Button>
      </div>

      <CampaignsTabs active="Audiences" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every audience running · and how far each is from the segment behind it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Campaign</th>
                <th className={`${HEAD_CLASS} text-right`}>Segment</th>
                <th className={`${HEAD_CLASS} text-right`}>Eligible</th>
                <th className={`${HEAD_CLASS} text-right`}>Sent</th>
                <th className={`${HEAD_CLASS} text-right`}>Shrinkage</th>
                <th className={HEAD_CLASS}>Largest single reduction</th>
              </tr>
            </thead>
            <tbody>
              {CP05_ROWS.map((row) => (
                <tr key={row.campaign} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.campaign}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.segment}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.eligible}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.sent}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.shrinkageTone]}`}>{row.shrinkage}</td>
                  <td className="px-4 py-3 text-ink-3">{row.largestReduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Audiences run 20% to 43% smaller than the segments they are named after, and the gap is not noise">
        Anyone reading a room that says 148,000 and a report that says 90,000 will assume something failed. Nothing
        failed: unreachability, consent, complaints, caps and holdouts each took their share, in that order. The
        shrinkage column exists so the question is answered before it is asked, and the largest reduction is named
        because it is usually the one worth arguing with.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The one audience that shrank by nothing</p>
        <CampaignsKvList rows={CP05_KV_ROWS} />
      </section>
    </div>
  );
};

export default CampaignsAudiencesRoute;
