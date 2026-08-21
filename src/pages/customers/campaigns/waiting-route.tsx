import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { ApproveACampaignModal } from "@/pages/customers/campaigns/modals/approve-a-campaign-modal";
import { RaiseAStandingAuthorityModal } from "@/pages/customers/campaigns/modals/raise-a-standing-authority-modal";
import { CP06_CONDITION_ROWS, CP06_KV_ROWS, CP06_STATS, CP_KPI_TONE, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP06 — /campaigns/waiting. Two header actions for the two ways Ada can unblock wave three, same "two CTAs on one page" pattern Customer health's HL07 established. */
const CampaignsWaitingRoute = () => {
  const [modal, setModal] = useState<"approve" | "standing" | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Waiting on a person</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">One campaign, 2,000 people over a cap, 19 hours · and no way around it</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button type="button" variant="outline" onClick={() => setModal("standing")}>
            Raise the standing authority
          </Button>
          <Button type="button" onClick={() => setModal("approve")}>
            Ask Ada
          </Button>
        </div>
      </div>

      <CampaignsTabs active="Waiting" />

      <KpiCards items={CP06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why it is waiting</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>The standing authority Ada granted</th>
                <th className={HEAD_CLASS}>Wave three</th>
                <th className={`${HEAD_CLASS} text-right`}>Within it?</th>
                <th className={HEAD_CLASS}>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {CP06_CONDITION_ROWS.map((row) => (
                <tr key={row.condition} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.condition}</td>
                  <td className="px-4 py-3 font-mono text-ink-3">{row.wave3}</td>
                  <td className="px-4 py-3 text-right">
                    {row.within ? (
                      <Check className="ml-auto size-3.5 text-teal" aria-label="yes" />
                    ) : (
                      <X className="ml-auto size-3.5 text-rose" aria-label="no" />
                    )}
                  </td>
                  <td className={`px-4 py-3 ${CP_TONE_CLASS[row.whyTone]}`}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Four of five conditions are met and the fifth is 2,000 people over, so nothing happens">
        The agent did not round the audience down to 49,999, did not split it into two sends of 26,000, and did not
        ask a different person. A standing authority that can be satisfied by reshaping the request is not a limit.
        It waits, and the waiting has a visible price so that nobody has to pretend the strictness is free.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What Ada can do, and what nobody can do</p>
        <CampaignsKvList rows={CP06_KV_ROWS} />
      </section>

      <Callout tone="neutral" title="Nineteen hours is on the screen and is not an escalation">
        Nobody is paged, no manager is copied and no timer turns red. The cost is displayed beside the wait so that
        Ada, who is covering three markets today, can weigh it herself. Escalating automatically would make this
        decision somebody else&apos;s, which is exactly what a standing authority is for avoiding.
      </Callout>

      <ApproveACampaignModal open={modal === "approve"} onOpenChange={(open) => setModal(open ? "approve" : null)} />
      <RaiseAStandingAuthorityModal open={modal === "standing"} onOpenChange={(open) => setModal(open ? "standing" : null)} />
    </div>
  );
};

export default CampaignsWaitingRoute;
